const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envText = fs.readFileSync('.env', 'utf-8');
const envConfig = {};
envText.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] ? match[2].trim() : '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    envConfig[match[1]] = value;
  }
});

const url = envConfig.VITE_SUPABASE_URL;
const key = envConfig.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(url, key);

async function run() {
  // Get active session org or first org
  const { data: orgs } = await supabase.from('customers').select('organization_id').limit(1);
  if (!orgs || orgs.length === 0) {
    console.error('No organization found in database to run tests against. Create a customer first.');
    return;
  }
  const orgId = orgs[0].organization_id;
  console.log('Using Org ID:', orgId);

  // 1. Create a test customer
  const customerCode = 'TST-' + Math.floor(1000 + Math.random() * 9000);
  const { data: customer, error: custErr } = await supabase.from('customers').insert({
    organization_id: orgId,
    customer_code: customerCode,
    name: 'Trigger Test Customer',
    expected_amount: 5000,
    due_amount: 5000,
    status: 'unpaid'
  }).select().single();

  if (custErr) {
    console.error('Failed to create customer:', custErr);
    return;
  }
  console.log('Created Customer:', customer.id, 'Code:', customer.customer_code, 'Expected:', customer.expected_amount, 'Due:', customer.due_amount, 'Status:', customer.status);

  // 2. Insert a payment
  const trxId = 'TRX-' + Math.floor(100000 + Math.random() * 900000);
  const { data: payment, error: payErr } = await supabase.from('payments').insert({
    organization_id: orgId,
    customer_id: customer.id,
    amount_paid: 2000,
    payment_method: 'Transfer',
    reference: 'REF-' + trxId,
    payment_date: new Date().toISOString().slice(0, 10),
    source: 'bank',
    currency: 'NGN',
    transaction_id: trxId,
    status: 'paid'
  }).select().single();

  if (payErr) {
    console.error('Failed to insert payment:', payErr);
    // Cleanup customer
    await supabase.from('customers').delete().eq('id', customer.id);
    return;
  }
  console.log('Inserted Payment:', payment.id, 'Amount:', payment.amount_paid, 'Status:', payment.status);

  // 3. Fetch customer again
  const { data: updatedCustomer } = await supabase.from('customers').select('*').eq('id', customer.id).single();
  console.log('Updated Customer state:', {
    due_amount: updatedCustomer.due_amount,
    status: updatedCustomer.status
  });

  // 4. Clean up
  await supabase.from('payments').delete().eq('id', payment.id);
  await supabase.from('customers').delete().eq('id', customer.id);
  console.log('Test completed and temporary data cleaned.');
}

run();
