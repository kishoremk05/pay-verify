import { supabaseAdmin } from "../config/supabase.js";
import { queryOpenRouterText } from "./ai.js";

// Safe database schema info for system prompt
const SCHEMA_CONTEXT = `
You have access to 4 read-only database tables for the active organization:
1. "customers" (Stores payer accounts)
   - id: uuid
   - name: text
   - phone: text
   - email: text
   - service: text (the service they are paying for, e.g. "Tuition", "Hostel")
   - expected_amount: numeric (the invoice or expectation baseline)
   - status: 'unpaid' | 'partially_paid' | 'paid'
   - created_at: timestamptz

2. "payments" (Actual payment transactions received)
   - id: uuid
   - customer_id: uuid (references customers.id)
   - amount_paid: numeric
   - payment_method: text (e.g. "bank_transfer", "mobile_money", "card")
   - reference: text (transaction ID or reference)
   - payment_date: date
   - status: 'unpaid' | 'paid' | 'refunded' | 'duplicate' (status 'paid' is fully matched/reconciled, others might be mismatches)
   - source: 'manual' | 'paystack'
   - created_at: timestamptz

3. "invoices" (Billing invoices sent to customers)
   - id: uuid
   - customer_id: uuid (references customers.id)
   - invoice_number: text
   - amount: numeric
   - status: 'pending' | 'paid' | 'partial' | 'overpaid' | 'refunded'
   - due_date: date
   - created_at: timestamptz

4. "refunds" (Processed refunds)
   - id: uuid
   - customer_id: uuid (references customers.id)
   - payment_id: uuid (references payments.id)
   - refund_amount: numeric
   - reason: text
   - created_at: timestamptz
`;

interface SafeQuery {
  needsQuery: boolean;
  table?: "customers" | "payments" | "invoices" | "refunds";
  select?: string;
  filters?: {
    field: string;
    operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "like" | "ilike" | "in" | "is";
    value: any;
  }[];
  limit?: number;
  order?: {
    field: string;
    direction: "asc" | "desc";
  };
}

/**
 * Parses user input to generate a safe Supabase query.
 */
async function generateSafeQuery(userInput: string): Promise<SafeQuery> {
  const systemPrompt = `You are a query generator. Analyze the user's natural language question and translate it into a structured database query.
${SCHEMA_CONTEXT}

RULES:
1. ONLY query the 4 allowed tables: "customers", "payments", "invoices", "refunds".
2. Do NOT write SQL. Produce a structured JSON matching this TypeScript type:
   {
     "needsQuery": boolean, // true if DB data is required to answer, false for general questions
     "table"?: "customers" | "payments" | "invoices" | "refunds",
     "select"?: string, // e.g. "*", "id, name, status", or "*, customers(*)" for joins
     "filters"?: Array<{
        "field": string, // column name
        "operator": "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "like" | "ilike" | "in" | "is",
        "value": any
     }>,
     "limit"?: number, // default/max 100
     "order"?: { "field": string, "direction": "asc" | "desc" }
   }
3. If the user refers to "today", use the current ISO date: ${new Date().toISOString().split("T")[0]}.
4. You cannot perform write/delete/update operations. ONLY select.
5. Return ONLY raw JSON. No backticks, no markdown.`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: `Question: "${userInput}"` },
  ];

  try {
    const rawResult = await queryOpenRouterText(messages, { temperature: 0.1 });
    const parsed = parseJSONResponse(rawResult);
    if (!parsed) {
      console.warn("[AI Analytics] Failed to parse generated query, returning blank template:", rawResult);
      return { needsQuery: false };
    }
    return parsed as SafeQuery;
  } catch (err: any) {
    console.error("[AI Analytics] Error generating query:", err);
    return { needsQuery: false };
  }
}

/**
 * Executes a SafeQuery object against Supabase, strictly scoping to the organization.
 */
async function executeSafeQuery(query: SafeQuery, orgId: string): Promise<any[]> {
  if (!query.needsQuery || !query.table) return [];

  try {
    let builder = supabaseAdmin.from(query.table).select(query.select || "*");

    // CRITICAL: Always filter by organization_id to enforce multi-tenancy
    builder = builder.eq("organization_id", orgId);

    if (query.filters && Array.isArray(query.filters)) {
      for (const filter of query.filters) {
        if (!filter.field || !filter.operator) continue;
        
        switch (filter.operator) {
          case "eq":
            builder = builder.eq(filter.field, filter.value);
            break;
          case "neq":
            builder = builder.neq(filter.field, filter.value);
            break;
          case "gt":
            builder = builder.gt(filter.field, filter.value);
            break;
          case "gte":
            builder = builder.gte(filter.field, filter.value);
            break;
          case "lt":
            builder = builder.lt(filter.field, filter.value);
            break;
          case "lte":
            builder = builder.lte(filter.field, filter.value);
            break;
          case "like":
            builder = builder.like(filter.field, filter.value);
            break;
          case "ilike":
            builder = builder.ilike(filter.field, filter.value);
            break;
          case "in":
            builder = builder.in(filter.field, filter.value);
            break;
          case "is":
            builder = builder.is(filter.field, filter.value);
            break;
        }
      }
    }

    if (query.order && query.order.field) {
      builder = builder.order(query.order.field, {
        ascending: query.order.direction !== "desc",
      });
    }

    builder = builder.limit(query.limit || 100);

    const { data, error } = await builder;
    if (error) {
      console.error(`[AI Analytics] Supabase query execution error on table ${query.table}:`, error);
      return [];
    }

    return data || [];
  } catch (err: any) {
    console.error("[AI Analytics] Exception in executeSafeQuery:", err);
    return [];
  }
}

/**
 * Formats the final answer using the user query and fetched data.
 */
async function formatResponse(
  userInput: string,
  query: SafeQuery,
  data: any[]
): Promise<{ message: string; chart?: any }> {
  const systemPrompt = `You are the Todella AI Business Intelligence Assistant.
Analyze the provided transaction database records and give a highly professional, structured answer.

RULES:
1. Always respond in clean markdown.
2. Present data as a formatted list or table using markdown syntax.
3. For each record show the most relevant fields: name, amount, date, status, etc.
4. Be concise. Summarize totals or trends at the end if useful.
5. Respond ONLY with a valid JSON in this exact format:
   { "message": "Your full markdown answer here" }
6. Return ONLY raw JSON. No markdown wrappers or extra text outside the JSON.`;

  const userContext = `
Question: "${userInput}"
Table Queried: ${query.table || "None"}
Retrieved Data (Count: ${data.length}):
${JSON.stringify(data.slice(0, 50), null, 2)}
`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userContext },
  ];

  try {
    const rawResult = await queryOpenRouterText(messages, { temperature: 0.2, max_tokens: 1500 });
    const parsed = parseJSONResponse(rawResult);
    if (parsed) {
      return { message: parsed.message || "No explanation provided." };
    }
    return { message: rawResult };
  } catch (err: any) {
    console.error("[AI Analytics] Formatting response failed:", err);
    return { message: `I queried the database but failed to format the response. Retrieved ${data.length} records.` };
  }
}

/**
 * Helper to process the user natural language query end-to-end.
 */
export async function processBusinessQuery(
  userInput: string,
  orgId: string
): Promise<{ message: string; chart?: any; queryAttempted?: string }> {
  console.log(`[AI Analytics] Parsing query for Org ${orgId}: "${userInput}"`);
  
  const query = await generateSafeQuery(userInput);
  console.log("[AI Analytics] Safe Query Plan:", JSON.stringify(query));

  let data: any[] = [];
  if (query.needsQuery && query.table) {
    data = await executeSafeQuery(query, orgId);
    console.log(`[AI Analytics] Fetched ${data.length} records.`);
  }

  const response = await formatResponse(userInput, query, data);
  return {
    ...response,
    queryAttempted: query.needsQuery ? `${query.table} (limit ${query.limit || 100})` : undefined,
  };
}

// Helper to extract JSON from raw content cleanly
function parseJSONResponse(raw: string): any | null {
  try {
    return JSON.parse(raw.trim());
  } catch {
    const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match?.[1]) {
      try {
        return JSON.parse(match[1].trim());
      } catch {
        // ignore
      }
    }
    const braceMatch = raw.match(/\{[\s\S]*\}/);
    if (braceMatch) {
      try {
        return JSON.parse(braceMatch[0]);
      } catch {
        // ignore
      }
    }
    return null;
  }
}
