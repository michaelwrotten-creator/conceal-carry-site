import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";
import process from "node:process";
import { fileURLToPath } from "node:url";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 4242);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const STRIPE_PUBLISHABLE_KEY =
  process.env.VITE_STRIPE_PUBLISHABLE_KEY ||
  process.env.STRIPE_PUBLISHABLE_KEY ||
  "";
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || "";
const MISTRAL_ASSISTANT_MODEL =
  process.env.MISTRAL_ASSISTANT_MODEL || "mistral-medium-latest";

const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null;

const HANDBOOK_GUIDANCE = [
  "Carrying a firearm for defense is about protecting innocent life, not acting like law enforcement or looking for conflict.",
  "Situational awareness and conflict avoidance come before force. It is better to avoid a fight than to win one.",
  "A good carry gun is one the student can shoot accurately, carry comfortably, and operate safely and consistently.",
  "Reliable defensive ammunition and a quality holster matter, but training and safe handling matter more than gear hype.",
  "Everyday carry often includes a sidearm, flashlight, phone, spare ammunition, and a less-lethal option where lawful and appropriate.",
  "Deadly force is a last resort for an imminent threat of death or great bodily harm.",
  "After a defensive incident, call 911, cooperate physically with officers, and understand that police and legal follow-up will be serious.",
  "Permit classes are only the beginning. Ongoing professional training, safe practice, and continued study are part of responsible carry.",
  "Carry laws, reciprocity, and restricted locations vary by jurisdiction and can change, so current state and local rules must always be verified.",
];

const HANDBOOK_TOPICS = [
  {
    id: "why-choose-ips",
    patterns: [
      "why should i choose illinois protective services",
      "why choose illinois protective services",
      "why should i choose your company",
      "why choose your company",
      "why choose you",
    ],
    buildReply: (siteContext) =>
      siteContext?.policies?.whyChooseMessage ||
      "You should choose Illinois Protective Services because the focus is on teaching responsible American citizens gun rights and firearm ownership with professionalism, courteous service, integrity, and transparency. The training is structured, safety-focused, and designed to help students leave more confident, better informed, and prepared to handle firearm ownership responsibly. If you want, I can also help you compare the classes and choose the right one for your situation.",
  },
  {
    id: "concealed-carry-class-purpose",
    patterns: [
      "conceal carry class",
      "concealed carry class",
      "concealed carry training",
      "carry class for",
      "what is conceal carry",
      "what is concealed carry",
      "what is ccl class",
      "why take a carry class",
    ],
    buildReply: (siteContext) => {
      const services = Array.isArray(siteContext?.classServices)
        ? siteContext.classServices
        : [];
      const firstTime = services.find((item) =>
        String(item.title || "").toLowerCase().includes("16-hour")
      );
      const renewal = services.find((item) =>
        String(item.title || "").toLowerCase().includes("renewal")
      );
      const veteran = services.find((item) =>
        String(item.title || "").toLowerCase().includes("veteran")
      );

      const courseLine = [
        firstTime ? `${firstTime.title} is the full course for first-time students` : "",
        renewal ? `${renewal.title} is for renewals` : "",
        veteran ? `${veteran.title} is for qualifying veterans` : "",
      ]
        .filter(Boolean)
        .join(", ");

      return normalizeAssistantText(
        `A concealed carry class is for learning how to carry and use a handgun responsibly, safely, and legally, not just for getting a certificate. It should teach safe handling, defensive mindset, situational awareness, use-of-force basics, and range qualification so students understand both skill and responsibility. ${courseLine ? `${courseLine}.` : ""}`
      );
    },
  },
  {
    id: "which-class",
    patterns: [
      "which class",
      "what class do i need",
      "what course do i need",
      "which course should i take",
      "what class should i take",
      "which concealed carry class",
    ],
    buildReply: (siteContext) => {
      const services = Array.isArray(siteContext?.classServices)
        ? siteContext.classServices
        : [];

      const firstTime = services.find((item) =>
        String(item.title || "").toLowerCase().includes("16-hour")
      );
      const renewal = services.find((item) =>
        String(item.title || "").toLowerCase().includes("renewal")
      );
      const veteran = services.find((item) =>
        String(item.title || "").toLowerCase().includes("veteran")
      );
      const mini = services.find((item) =>
        String(item.title || "").toLowerCase().includes("mini")
      );

      return normalizeAssistantText(
        `${firstTime ? `${firstTime.title} is usually the right choice for first-time concealed carry students. ` : ""}${renewal ? `${renewal.title} is for students renewing their license. ` : ""}${veteran ? `${veteran.title} is for qualifying veterans who receive credit. ` : ""}${mini ? `${mini.title} works better for shorter guided instruction or refreshers than for a full concealed carry training path.` : ""}`
      );
    },
  },
  {
    id: "training-purpose",
    patterns: [
      "why train",
      "why take training",
      "how much should i train",
      "do i need training",
      "practice enough",
      "how often should i practice",
    ],
    buildReply: () =>
      "Training matters because permit classes are only the beginning. Good training builds safe gun handling, better judgment, better accuracy under stress, and a stronger understanding of when to avoid conflict and when force may be legally justified. The handbook is clear that responsible carry means continuing to practice and learn after the class ends.",
  },
  {
    id: "gun-choice",
    patterns: [
      "best gun",
      "what gun",
      "choose a gun",
      "what pistol",
      "what handgun",
      "what firearm should i buy",
    ],
    buildReply: () =>
      "The best carry gun is one you can shoot accurately, operate safely, and carry consistently. The handbook recommends trying different options instead of chasing hype, then choosing the one that feels reliable and manageable in your hands. Comfort, control, reliability, and regular practice matter more than buying the most popular model.",
  },
  {
    id: "ammo",
    patterns: [
      "ammo",
      "ammunition",
      "hollow point",
      "frangible",
      "self-defense ammo",
    ],
    buildReply: () =>
      "For defensive use, the handbook generally favors reliable self-defense ammunition such as hollow-point rounds because they are designed to expand on impact and reduce over-penetration risk. Whatever you choose should run reliably in your firearm and should be tested safely at the range. Local rules can vary, so verify what is lawful in your area.",
  },
  {
    id: "holster-gear",
    patterns: [
      "holster",
      "carry gear",
      "edc",
      "everyday carry",
      "what gear",
      "what should i carry every day",
    ],
    buildReply: () =>
      "A good carry setup should be secure, comfortable, discreet, and consistent enough that you will actually use it every day. The handbook highlights a quality holster, safe on-body carry when possible, and practical support gear like a flashlight, phone, spare ammunition, and a less-lethal option where appropriate. Good gear should support safe habits, not replace training.",
  },
  {
    id: "situational-awareness",
    patterns: [
      "situational awareness",
      "avoid a fight",
      "conflict avoid",
      "de-escalat",
      "stay aware",
      "how do i stay safe",
    ],
    buildReply: () =>
      "The handbook emphasizes that it is better to avoid a fight than to win one. Stay alert, reduce distractions, notice exits and unusual behavior, and leave early when something feels off. Good concealed carry judgment starts with awareness and avoidance, not with looking for confrontation.",
  },
  {
    id: "home-family-defense",
    patterns: [
      "home defense",
      "family defense",
      "protect my family",
      "protect my home",
      "defend my home",
    ],
    buildReply: () =>
      "Home and family defense start with responsibility, planning, and safe habits. The handbook frames armed defense as protecting innocent life, which means thinking ahead about safety, access control, awareness, communication, and how to avoid reckless decisions under stress. A firearm can be part of that plan, but mindset, training, and safe storage matter just as much.",
  },
  {
    id: "storage-kids",
    patterns: [
      "storage",
      "store my gun",
      "safe storage",
      "kids",
      "children",
      "around my family",
    ],
    buildReply: () =>
      "If you have children or other unauthorized people in the home, safe storage is essential. A defensive firearm should be secured from unauthorized access while still fitting your safety plan and local law. Responsible ownership means thinking through access, retention, and how to prevent careless or unauthorized handling.",
  },
  {
    id: "laws-travel",
    patterns: [
      "law",
      "legal",
      "permit",
      "reciprocity",
      "travel",
      "can i carry",
      "where can i carry",
      "restricted places",
    ],
    buildReply: () =>
      "I can share general information, but I do not want to guess about current carry laws. Permit rules, reciprocity, and restricted locations can change, so please verify current Illinois requirements and any travel rules with the Illinois State Police, an attorney, or your instructor before relying on them.",
  },
  {
    id: "after-incident",
    patterns: [
      "what to say to police",
      "after self-defense",
      "after a shooting",
      "after defensive use",
      "after using my gun",
      "911",
      "police arrive",
    ],
    buildReply: () =>
      "The handbook says to call 911 immediately, report the incident, and cooperate physically with responding officers. It also stresses that the legal aftermath can be serious, so you should be careful about detailed statements and follow current law and legal advice. In any real incident, speak with qualified counsel as soon as possible.",
  },
  {
    id: "certificate-replacement",
    patterns: [
      "lost certificate",
      "lost my certificate",
      "replace certificate",
      "replacement certificate",
      "certificate replacement",
      "replacement fee",
      "duplicate certificate",
    ],
    buildReply: (siteContext) =>
      siteContext?.policies?.certificateReplacementMessage ||
      "If you lost your certificate, the replacement fee is $75.00.",
  },
  {
    id: "certificate",
    patterns: [
      "certificate",
      "completion certificate",
      "certificate of completion",
      "do i get a certificate",
      "will i get a certificate",
      "end of class",
    ],
    buildReply: () =>
      "Yes. Everyone who passes the class receives a certificate of completion at the end of class. If you want, I can also explain which course is the best fit for you.",
  },
  {
    id: "pricing-general",
    patterns: [
      "pricing",
      "price",
      "cost",
      "deposit",
      "how much",
      "full payment",
    ],
    buildReply: (siteContext) => {
      const servicesReply = getServiceListReply(siteContext);
      return servicesReply
        ? `Here is the current pricing: ${servicesReply}`
        : "I can help with pricing, deposits, and class options. Tell me which class you want and I will break it down clearly.";
    },
  },
  {
    id: "instructors",
    patterns: [
      "who are the instructors",
      "who is the instructor",
      "instructors",
      "trainer",
      "teacher",
    ],
    buildReply: (siteContext) => {
      const instructors = Array.isArray(siteContext?.instructors)
        ? siteContext.instructors
        : [];

      if (!instructors.length) {
        return "I can help with instructor questions, class options, pricing, and booking.";
      }

      return instructors
        .map(
          (item) =>
            `${item.name} is our ${item.title}. ${item.summary || ""}`.trim()
        )
        .join(" ");
    },
  },
];

function normalizeAssistantText(text) {
  return String(text || "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

function includesPattern(text, pattern) {
  return text.includes(pattern);
}

function getBestHandbookTopic(message) {
  const lower = String(message || "").toLowerCase().trim();
  let bestTopic = null;
  let bestScore = 0;

  for (const topic of HANDBOOK_TOPICS) {
    let score = 0;

    for (const pattern of topic.patterns) {
      if (includesPattern(lower, pattern)) {
        score += Math.max(2, pattern.split(" ").length);
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestTopic = topic;
    }
  }

  return bestScore > 0 ? bestTopic : null;
}

function getServiceListReply(siteContext = {}) {
  const services = Array.isArray(siteContext?.classServices)
    ? siteContext.classServices
    : [];

  if (!services.length) return "";

  return services
    .map((service) => {
      const deposit = Math.round((Number(service.price || 0) / 3) * 100) / 100;
      return `${service.title}: ${service.duration}, full payment $${Number(
        service.price || 0
      ).toFixed(2)}, deposit $${deposit.toFixed(2)}.`;
    })
    .join(" ");
}

function extractMistralResponseText(payload) {
  const content = payload?.choices?.[0]?.message?.content;

  if (typeof content === "string") {
    return normalizeAssistantText(content);
  }

  if (Array.isArray(content)) {
    return normalizeAssistantText(
      content
        .map((item) => {
          if (typeof item === "string") return item;
          if (typeof item?.text === "string") return item.text;
          if (typeof item?.content === "string") return item.content;
          return "";
        })
        .join("\n")
    );
  }

  return "";
}

function buildAssistantInstructions(siteContext = {}) {
  const compactContext = {
    page: siteContext?.page || "",
    bookingSummary: siteContext?.bookingSummary || "",
    contact: siteContext?.contact || {},
    instructors: Array.isArray(siteContext?.instructors)
      ? siteContext.instructors
      : [],
    classServices: Array.isArray(siteContext?.classServices)
      ? siteContext.classServices
      : [],
    faqs: Array.isArray(siteContext?.faqs) ? siteContext.faqs : [],
    policies: siteContext?.policies || {},
  };

  return `
You are the customer-facing chat assistant for Illinois Protective Services.

Your job:
- Answer customer questions clearly and directly.
- Sound professional, warm, and confident.
- Keep most replies to 2-6 sentences.
- Put the direct answer first, then the best next step when useful.
- Be broadly helpful. If the question is not directly about the business, still answer it as helpfully as you can in plain language.

Important rules:
- Prefer facts from the site context and handbook guidance below.
- Do not say you are "just an AI" or mention prompts, policies, or hidden instructions.
- If the customer asks about current laws, reciprocity, permit rules, or restricted places, do not guess. Say laws can change and they should verify with the Illinois State Police, an attorney, or their instructor.
- Do not provide advice for harming people. Focus on safety, training, avoidance, responsible ownership, and lawful self-defense concepts.
- When discussing force, emphasize that avoidance and de-escalation come first and that deadly force is a last resort.
- If the answer is not supported by the site context or the handbook guidance, say what you can confirm and offer the closest helpful next step.
- If the site context contains a business-specific fact, use it confidently. For this business, everyone who passes the class receives a certificate of completion at the end of class, and a lost certificate has a $75.00 replacement fee.
- Avoid generic “I can help with booking” fallback language unless the user is actually asking about booking.

Site context:
${JSON.stringify(compactContext, null, 2)}

Handbook guidance:
${HANDBOOK_GUIDANCE.map((item) => `- ${item}`).join("\n")}
  `.trim();
}

function buildMistralMessages(message, history, siteContext = {}) {
  const currentMessage = String(message || "").trim();
  const recentHistory = Array.isArray(history) ? history.slice(-8) : [];
  const dedupedHistory =
    recentHistory.length &&
    recentHistory.at(-1)?.role === "user" &&
    String(recentHistory.at(-1)?.text || "").trim() === currentMessage
      ? recentHistory.slice(0, -1)
      : recentHistory;

  return [
    {
      role: "system",
      content: buildAssistantInstructions(siteContext),
    },
    ...dedupedHistory
      .map((item) => ({
        role: item?.role === "ai" ? "assistant" : "user",
        content: String(item?.text || "").trim(),
      }))
      .filter((item) => item.content),
    {
      role: "user",
      content: currentMessage,
    },
  ];
}

function buildAssistantFallback(message, siteContext = {}) {
  const lower = String(message || "").toLowerCase();
  const contactPhone = siteContext?.contact?.phone || "(224) 248-7027";
  const contactEmail =
    siteContext?.contact?.email || "support@illinoisprotectiveservices.com";
  const servicesReply = getServiceListReply(siteContext);
  const certificateReplacementMessage =
    siteContext?.policies?.certificateReplacementMessage ||
    "If you lost your certificate, the replacement fee is $75.00.";
  const certificateCompletionMessage =
    siteContext?.policies?.certificateCompletionMessage ||
    "Yes. Everyone who passes the class receives a certificate of completion at the end of class.";
  const whyChooseMessage =
    siteContext?.policies?.whyChooseMessage ||
    "You should choose Illinois Protective Services because the focus is on teaching responsible American citizens gun rights and firearm ownership with professionalism, courteous service, integrity, and transparency. The training is structured, safety-focused, and designed to help students leave more confident, better informed, and prepared to handle firearm ownership responsibly. If you want, I can also help you compare the classes and choose the right one for your situation.";

  if (
    lower.includes("why should i choose illinois protective services") ||
    lower.includes("why choose illinois protective services") ||
    lower.includes("why should i choose your company") ||
    lower.includes("why choose your company") ||
    lower.includes("why choose you")
  ) {
    return whyChooseMessage;
  }

  if (lower.includes("instructor")) {
    const instructorReply = Array.isArray(siteContext?.instructors)
      ? siteContext.instructors
          .map(
            (item) =>
              `${item.name} is our ${item.title}. ${item.summary || ""}`.trim()
          )
          .join(" ")
      : "";

    if (instructorReply) return normalizeAssistantText(instructorReply);
  }

  if (
    (lower.includes("lost") && lower.includes("certificate")) ||
    lower.includes("replacement certificate") ||
    lower.includes("replace certificate") ||
    lower.includes("certificate replacement") ||
    lower.includes("replacement fee")
  ) {
    return certificateReplacementMessage;
  }

  if (lower.includes("certificate") || lower.includes("completion")) {
    return certificateCompletionMessage;
  }

  if (
    lower.includes("what should i bring") ||
    lower.includes("what do i bring") ||
    lower.includes("bring to class")
  ) {
    const faqReply = Array.isArray(siteContext?.faqs)
      ? siteContext.faqs.find((item) =>
          String(item.q || "").toLowerCase().includes("what should i bring")
        )?.a
      : "";

    if (faqReply) return normalizeAssistantText(faqReply);
  }

  if (
    lower.includes("refund") ||
    lower.includes("reschedule") ||
    lower.includes("policy") ||
    lower.includes("miss class") ||
    lower.includes("missed class")
  ) {
    return "If you cannot attend, notify the instructor at least 24 hours in advance to keep credit toward a future class date. Rescheduling with less than 24 hours’ notice means class credit is forfeited and a new payment or deposit is required. Missed class or range sessions also carry a $55 makeup fee.";
  }

  if (
    lower.includes("price") ||
    lower.includes("cost") ||
    lower.includes("deposit") ||
    lower.includes("full payment")
  ) {
    if (servicesReply) {
      return `Here is the current class pricing: ${servicesReply}`;
    }
  }

  const handbookTopic = getBestHandbookTopic(message);
  if (handbookTopic) {
    return normalizeAssistantText(handbookTopic.buildReply(siteContext));
  }

  if (
    lower.includes("law") ||
    lower.includes("legal") ||
    lower.includes("permit")
  ) {
    return "I can share general concealed carry information, but I do not want to guess about current laws. Rules can change, so please verify current Illinois requirements with the Illinois State Police, an attorney, or your instructor.";
  }

  if (
    lower.includes("class") ||
    lower.includes("price") ||
    lower.includes("booking")
  ) {
    return normalizeAssistantText(
      `I can help with class selection, pricing, booking, and concealed carry training questions. ${servicesReply ? `Current options: ${servicesReply}` : ""} If you want, ask me which class fits your situation and I will point you to the right course.`
    );
  }

  return normalizeAssistantText(
    `I can answer general questions, concealed carry questions, and class questions in plain language. If your question is about training here specifically, I can also help with pricing, instructors, certificates of completion, replacement certificates, and booking. You can also contact Illinois Protective Services at ${contactPhone} or ${contactEmail}.`
  );
}

function buildAssistantResponse(reply, extra = {}) {
  const provider = extra.provider || "fallback";
  const defaultModel = provider === "mistral" ? MISTRAL_ASSISTANT_MODEL : "";

  return {
    reply,
    source: provider,
    provider,
    model: extra.model || defaultModel,
    ...extra,
  };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

const SERVICES = {
  mini: {
    id: "mini",
    title: "Mini Class",
    price: 50,
    deposit: 16.67,
  },
  renewal3: {
    id: "renewal3",
    title: "3-Hour Renewal Course",
    price: 75,
    deposit: 25,
  },
  veteran8: {
    id: "veteran8",
    title: "8-Hours Class Veteran",
    price: 100,
    deposit: 33.33,
  },
  ccl16: {
    id: "ccl16",
    title: "16-Hour CCL Course",
    price: 225,
    deposit: 75,
  },
};
const SERVICE_ID_ALIASES = {
  "3hour": "renewal3",
  "8hour-veteran": "veteran8",
  "16hour": "ccl16",
};

function getServiceById(serviceId) {
  const normalizedId =
    SERVICE_ID_ALIASES[String(serviceId || "").trim()] ||
    String(serviceId || "").trim();
  return SERVICES[normalizedId];
}

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    message: "Illinois Protective Services backend is running.",
  });
});

app.get("/api/config", (_req, res) => {
  res.json({
    publishableKey: STRIPE_PUBLISHABLE_KEY,
    stripeEnabled: Boolean(stripe && STRIPE_PUBLISHABLE_KEY),
  });
});

app.post("/api/create-checkout-session", async (req, res) => {
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
      customerPhone,
      bookingDate,
      bookingTime,
      origin,
    } = req.body || {};

    const service = getServiceById(serviceId);

    if (!service) {
      return res.status(400).json({ error: "Invalid service selected." });
    }

    if (!bookingDate || !bookingTime) {
      return res
        .status(400)
        .json({ error: "Booking date and booking time are required." });
    }

    if (!String(customerName || "").trim()) {
      return res.status(400).json({ error: "Customer name is required." });
    }

    if (!String(customerPhone || "").trim()) {
      return res
        .status(400)
        .json({ error: "Customer phone number is required." });
    }

    if (!isValidEmail(customerEmail)) {
      return res.status(400).json({ error: "A valid customer email is required." });
    }

    const safeOrigin =
      typeof origin === "string" && origin.startsWith("http")
        ? origin
        : `http://localhost:${PORT}`;
    const amount = paymentMode === "deposit" ? service.deposit : service.price;
    const itemLabel =
      paymentMode === "deposit"
        ? `${service.title} Deposit`
        : `${service.title} Full Payment`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: String(customerEmail || "").trim(),
      success_url: `${safeOrigin}/?checkout=success`,
      cancel_url: `${safeOrigin}/?checkout=cancelled`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(amount * 100),
            product_data: {
              name: itemLabel,
              description: `${service.title} on ${bookingDate} at ${bookingTime}`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        serviceId: service.id,
        serviceTitle: service.title,
        paymentMode: paymentMode || "full",
        customerName: customerName || "",
        customerEmail: customerEmail || "",
        customerPhone: customerPhone || "",
        bookingDate,
        bookingTime,
      },
    });

    return res.json({
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("create-checkout-session error:", error);
    return res.status(500).json({
      error: error?.message || "Unable to start Stripe Checkout.",
    });
  }
});

app.post("/api/assistant", async (req, res) => {
  try {
    const { message, history, siteContext } = req.body || {};

    if (!String(message || "").trim()) {
      return res
        .status(400)
        .json({ error: "A customer message is required." });
    }

    if (!MISTRAL_API_KEY) {
      return res.json(
        buildAssistantResponse(buildAssistantFallback(message, siteContext), {
          provider: "fallback",
          fallbackReason: "missing_api_key",
        })
      );
    }

    const mistralResponse = await fetch(
      "https://api.mistral.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${MISTRAL_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MISTRAL_ASSISTANT_MODEL,
          messages: buildMistralMessages(message, history, siteContext),
          max_tokens: 220,
          temperature: 0.35,
        }),
      }
    );

    const payload = await mistralResponse.json();

    if (!mistralResponse.ok) {
      console.error("assistant mistral api error:", payload);
      return res.json(
        buildAssistantResponse(buildAssistantFallback(message, siteContext), {
          provider: "mistral",
          fallbackReason:
            payload?.error?.code ||
            payload?.error?.type ||
            `http_${mistralResponse.status}`,
          mistralStatus: mistralResponse.status,
        })
      );
    }

    const reply =
      extractMistralResponseText(payload) ||
      buildAssistantFallback(message, siteContext);

    return res.json(
      buildAssistantResponse(reply, {
        provider: "mistral",
        model: payload?.model || MISTRAL_ASSISTANT_MODEL,
      })
    );
  } catch (error) {
    console.error("assistant route error:", error);
    return res.json(
      buildAssistantResponse(
        buildAssistantFallback(req.body?.message, req.body?.siteContext),
        {
          provider: "fallback",
          fallbackReason: "request_failed",
        }
      )
    );
  }
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
      customerPhone,
      bookingDate,
      bookingTime,
    } = req.body || {};

    const service = getServiceById(serviceId);

    if (!service) {
      return res.status(400).json({ error: "Invalid service selected." });
    }

    if (!bookingDate || !bookingTime) {
      return res
        .status(400)
        .json({ error: "Booking date and booking time are required." });
    }

    if (!String(customerName || "").trim()) {
      return res.status(400).json({ error: "Customer name is required." });
    }

    if (!String(customerPhone || "").trim()) {
      return res.status(400).json({ error: "Customer phone number is required." });
    }

    if (!isValidEmail(customerEmail)) {
      return res.status(400).json({ error: "A valid customer email is required." });
    }

    const amount =
      paymentMode === "deposit" ? service.deposit : service.price;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      payment_method_types: ["card"],
      receipt_email: String(customerEmail || "").trim(),
      metadata: {
        serviceId: service.id,
        serviceTitle: service.title,
        paymentMode: paymentMode || "full",
        customerName: customerName || "",
        customerEmail: customerEmail || "",
        customerPhone: customerPhone || "",
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

app.post("/api/post-booking-sms", (req, res) => {
  const { customerName, customerPhone, serviceTitle, bookingDate, bookingTime } =
    req.body || {};

  console.log("post-booking-sms placeholder:", {
    customerName: customerName || "",
    customerPhone: customerPhone || "",
    serviceTitle: serviceTitle || "",
    bookingDate: bookingDate || "",
    bookingTime: bookingTime || "",
  });

  return res.json({
    ok: true,
    delivered: false,
    message: "Post-booking SMS is not configured yet.",
  });
});

const isDirectRun =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === process.argv[1];

if (isDirectRun) {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

export default app;
