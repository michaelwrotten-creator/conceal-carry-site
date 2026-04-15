import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4242);

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const SERVICE_PRICES = {
  mini: 5000,
  "3hour": 7500,
  "8hour-veteran": 10000,
  "16hour": 22500,
};

function calculateDeposit(amountInCents) {
  return Math.round(amountInCents / 3);
}

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const signature = req.headers["stripe-signature"];

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return res.status(500).send("Missing STRIPE_WEBHOOK_SECRET");
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        console.log("✅ Payment succeeded:", paymentIntent.id);
        console.log("Booking metadata:", paymentIntent.metadata);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        console.log("❌ Payment failed:", paymentIntent.id);
        console.log("Booking metadata:", paymentIntent.metadata);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.json({ received: true });
  }
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Illinois Protective Services Stripe backend is running.");
});

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    message: "Stripe backend is running",
  });
});

app.get("/api/config", (_req, res) => {
  res.json({
    publishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY || "",
  });
});

app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const {
      serviceId,
      paymentMode,
      customerName,
      customerEmail,
      customerPhone,
      bookingDate,
      bookingTime,
    } = req.body ?? {};

    if (!serviceId || !SERVICE_PRICES[serviceId]) {
      return res.status(400).json({
        error: "Invalid or missing serviceId.",
      });
    }

    if (!paymentMode || !["deposit", "full"].includes(paymentMode)) {
      return res.status(400).json({
        error: "Invalid or missing paymentMode.",
      });
    }

    if (!bookingDate || !bookingTime) {
      return res.status(400).json({
        error: "Booking date and time are required.",
      });
    }

    const serviceAmount = SERVICE_PRICES[serviceId];
    const depositAmount = calculateDeposit(serviceAmount);
    const amount = paymentMode === "deposit" ? depositAmount : serviceAmount;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      receipt_email: customerEmail || undefined,
      metadata: {
        serviceId,
        paymentMode,
        serviceAmount: String(serviceAmount),
        depositAmount: String(depositAmount),
        customerName: customerName || "",
        customerEmail: customerEmail || "",
        customerPhone: customerPhone || "",
        bookingDate: bookingDate || "",
        bookingTime: bookingTime || "",
      },
    });

    return res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount,
      serviceAmount,
      depositAmount,
    });
  } catch (err) {
    console.error("Create PaymentIntent error:", err);
    return res.status(500).json({
      error: "Unable to create payment intent.",
      details: err.message,
    });
  }
});

app.use("/api", (_req, res) => {
  res.status(404).json({
    error: "API route not found.",
  });
});

app.listen(port, () => {
  console.log(`Stripe backend running on http://localhost:${port}`);
});