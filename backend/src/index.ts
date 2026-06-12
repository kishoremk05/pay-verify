/**
 * PayVerify Backend Server
 * Express + TypeScript API for Invoice Workflow
 */

import "dotenv/config";
import express from "express";
import cors from "cors";
import invoiceRoutes from "./routes/invoices.js";
import refundRoutes from "./routes/refunds.js";
import inviteRoutes from "./routes/invites.js";
import paystackRoutes from "./routes/paystack.js";
import paymentRoutes from "./routes/payments.js";

const app = express();
const PORT = parseInt(process.env.PORT || "5000", 10);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:8080",
  "http://localhost:5173",
  "http://localhost:3000"
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      // Allow any localhost origins in development
      if (allowedOrigins.indexOf(origin) !== -1 || origin.startsWith("http://localhost:")) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "15mb" })); // Large limit for Base64 receipt images

// ── Health Check ──
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "PayVerify Invoice Workflow API",
    timestamp: new Date().toISOString(),
  });
});

// ── Routes ──
app.use("/api/invoices", invoiceRoutes);
app.use("/api/refunds", refundRoutes);
app.use("/api/invites", inviteRoutes);
app.use("/api/paystack", paystackRoutes);
app.use("/api/payments", paymentRoutes);

// ── Start ──
app.listen(PORT, () => {
  console.log(`\n  ┌──────────────────────────────────────────────┐`);
  console.log(`  │                                              │`);
  console.log(`  │   🚀 PayVerify Backend running on :${PORT}      │`);
  console.log(`  │                                              │`);
  console.log(`  │   Health:  http://localhost:${PORT}/api/health   │`);
  console.log(`  │   API:     http://localhost:${PORT}/api/invoices │`);
  console.log(`  │                                              │`);
  console.log(`  └──────────────────────────────────────────────┘\n`);
});

export default app;
