import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 4242);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
const stripePublishableKey =
  process.env.VITE_STRIPE_PUBLISHABLE_KEY ||
  process.env.STRIPE_PUBLISHABLE_KEY ||
  "";

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

const SERVICES = {
  mini: {
    id: "mini",
    title: "Mini Class",
    price: 50,
  },
  renewal3: {
    id: "renewal3",
    title: "3-Hour Renewal Course",
    price: 75,
  },
  veteran8: {
    id: "veteran8",
    title: "8-Hours Class Veteran",
    price: 100,
  },
  ccl16: {
    id: "ccl16",
    title: "16-Hour CCL Course",
    price: 225,
  },
};

function depositFor(service) {
  if (!service) return 0;
  return service.id === "mini" ? 25 : 75;
}

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    message: "Illinois Protective Services API is running.",
  });
});

app.get("/api/config", (_req, res) => {
  res.json({
    publishableKey: stripePublishableKey,
    stripeEnabled: Boolean(stripe && stripePublishableKey),
  });
});

app.post("/api/create-payment-intent", async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({
        error: "Stripe is not configured yet.",
      });
    }

    const {
      serviceId,
      paymentMode,
      customerName,
      customerEmail,
      bookingDate,
      bookingTime,
    } = req.body || {};

    const service = SERVICES[serviceId];

    if (!service) {
      return res.status(400).json({ error: "Invalid service selected." });
    }

    if (!bookingDate || !bookingTime) {
      return res
        .status(400)
        .json({ error: "Booking date and booking time are required." });
    }

    const fullAmount = service.price;
    const depositAmount = depositFor(service);
    const amount = paymentMode === "deposit" ? depositAmount : fullAmount;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      receipt_email: customerEmail || undefined,
      metadata: {
        serviceId: service.id,
        serviceTitle: service.title,
        paymentMode: paymentMode || "full",
        fullAmount: String(fullAmount),
        depositAmount: String(depositAmount),
        customerName: customerName || "",
        customerEmail: customerEmail || "",
        bookingDate,
        bookingTime,
      },
    });

    return res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("create-payment-intent error:", error);
    return res.status(500).json({
      error: error?.message || "Unable to create payment intent.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});