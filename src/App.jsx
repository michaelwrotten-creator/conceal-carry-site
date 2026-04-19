import { useEffect, useMemo, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4242";
const LOGO_SRC = "/ips-logo.png";
const BUSINESS_PHONE = "2242487027";
const BUSINESS_PHONE_DISPLAY = "(224) 248-7027";
const BUSINESS_EMAIL = "support@illinoisprotectiveservices.com";
const BUSINESS_ADDRESS = "7601 S. Cicero Ave, Chicago, IL 60652";

const SERVICES = [
  {
    id: "mini",
    title: "Mini Class",
    price: 50,
    deposit: 25,
    duration: "1 hr 30 min",
    audience: "Short guided session",
    description:
      "A shorter guided class for basic instruction, refreshers, and introductory firearm safety support.",
    included: [
      "Basic firearm safety guidance",
      "Hands-on instructor support",
      "Short-form practical instruction",
    ],
    requirements: [
      "State ID or driver's license",
      "Completed paperwork in black ink",
      "FOID card if applicable",
    ],
  },
  {
    id: "renewal3",
    title: "3-Hour Renewal Course",
    price: 75,
    deposit: 75,
    duration: "3 hr",
    audience: "Renewal students",
    description:
      "Required renewal-style instruction for qualified students who need a shorter renewal class option.",
    included: [
      "Structured classroom instruction",
      "Renewal guidance",
      "Certificate support",
    ],
    requirements: [
      "FOID card",
      "Renewal documents",
      "CCL copy if applicable",
    ],
  },
  {
    id: "veteran8",
    title: "8-Hours Class Veteran",
    price: 100,
    deposit: 75,
    duration: "8 hr",
    audience: "Qualified veterans",
    description:
      "An 8-hour course option for qualified veterans with structured training and class guidance.",
    included: [
      "8-hour instruction",
      "Qualification guidance",
      "Structured support",
    ],
    requirements: [
      "DD-214 showing honorable discharge",
      "State ID or driver's license",
      "FOID card if applicable",
    ],
  },
  {
    id: "ccl16",
    title: "16-Hour CCL Course",
    price: 225,
    deposit: 75,
    duration: "16 hr",
    audience: "First-time CCL students",
    description:
      "Full concealed carry training for students who need the complete classroom and qualification path.",
    included: [
      "16-hour class instruction",
      "Hands-on training support",
      "Certificate guidance",
    ],
    requirements: [
      "State ID or driver's license",
      "FOID card",
      "Completed paperwork in black ink",
    ],
  },
];

const AVAILABLE_DATES = [
  { value: "2026-04-21", label: "Monday, April 21", disabled: false },
  { value: "2026-04-22", label: "Tuesday, April 22", disabled: false },
  { value: "2026-04-23", label: "Wednesday, April 23", disabled: false },
  { value: "2026-04-24", label: "Thursday, April 24", disabled: false },
  { value: "2026-04-25", label: "Friday, April 25", disabled: false },
  { value: "2026-04-26", label: "Saturday, April 26", disabled: true },
  { value: "2026-04-27", label: "Sunday, April 27", disabled: true },
  { value: "2026-04-28", label: "Monday, April 28", disabled: false },
  { value: "2026-04-29", label: "Tuesday, April 29", disabled: false },
];

const AVAILABLE_TIMES = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

function formatPrice(value) {
  return `$${Number(value).toFixed(2)}`;
}

function OpeningGate({ onEnter }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.45;
    }
  }, []);

  return (
    <div className="fixed inset-0 z-[10000] overflow-hidden bg-black">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/opening-flag.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/60" />

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="mx-auto max-w-4xl text-center text-white">
          <div className="mb-5 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-white/90 backdrop-blur-sm">
            Illinois Protective Services
          </div>

          <h1 className="text-5xl font-black uppercase tracking-[0.18em] sm:text-6xl md:text-7xl">
            Welcome!
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/90 sm:text-lg">
            Welcome to Illinois Protective Services, the premier Firearms Academy
            in Illinois. Our focus is to train responsible citizens through
            structured instruction, practical guidance, and a supportive
            learning environment.
          </p>

          <button
            type="button"
            onClick={onEnter}
            className="mt-8 rounded-full border border-[#4169e1]/40 bg-[#4169e1] px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:scale-[1.02] hover:bg-[#3558c9]"
          >
            Click Here To Explore!
          </button>
        </div>
      </div>
    </div>
  );
}

function StripeCheckoutForm({ onSuccess, customerName, customerEmail }) {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState("");
  const [billingName, setBillingName] = useState(customerName || "");
  const [billingEmail, setBillingEmail] = useState(customerEmail || "");
  const [processing, setProcessing] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    if (!stripe || !elements) return;

    setProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        payment_method_data: {
          billing_details: {
            name: billingName,
            email: billingEmail,
          },
        },
      },
    });

    if (error) {
      setErrorMessage(error.message || "Payment failed.");
      setProcessing(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      onSuccess(paymentIntent.id);
      setProcessing(false);
      return;
    }

    setProcessing(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="text"
          value={billingName}
          onChange={(e) => setBillingName(e.target.value)}
          placeholder="Cardholder Name"
          className="rounded-2xl border border-[#d9dee8] bg-white px-4 py-3 outline-none"
          required
        />
        <input
          type="email"
          value={billingEmail}
          onChange={(e) => setBillingEmail(e.target.value)}
          placeholder="Email for Receipt"
          className="rounded-2xl border border-[#d9dee8] bg-white px-4 py-3 outline-none"
          required
        />
      </div>

      <div className="rounded-2xl border border-[#d9dee8] bg-white p-4">
        <PaymentElement />
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-[#e85b66]/20 bg-[#fff3f4] px-4 py-3 text-sm text-[#b42318]">
          {errorMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full rounded-2xl border border-[#4169e1]/40 bg-[#4169e1] px-6 py-4 text-base font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#3558c9] disabled:opacity-60"
      >
        {processing ? "Processing..." : "Submit Payment"}
      </button>
    </form>
  );
}

function StripePaymentPanel({
  publishableKey,
  clientSecret,
  customerName,
  customerEmail,
  onSuccess,
}) {
  const stripePromise = useMemo(() => {
    if (!publishableKey) return null;
    return loadStripe(publishableKey);
  }, [publishableKey]);

  if (!publishableKey || !clientSecret || !stripePromise) {
    return (
      <div className="rounded-2xl border border-[#d9dee8] bg-white p-5 text-[#6b7280]">
        Select a payment option to load secure checkout.
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#4169e1",
            colorBackground: "#ffffff",
            colorText: "#111111",
            borderRadius: "16px",
          },
        },
      }}
    >
      <StripeCheckoutForm
        customerName={customerName}
        customerEmail={customerEmail}
        onSuccess={onSuccess}
      />
    </Elements>
  );
}

function NavBar({ navigateTo }) {
  const navButtonClass =
    "rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-white tracking-[0.14em] hover:border-[#4169e1]/50 hover:bg-[#4169e1]/10 hover:text-[#8ea6ff] transition";

  return (
    <div className="sticky top-0 z-50 border-b border-white/10 bg-black shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3 md:px-10 lg:px-12">
        <button
          type="button"
          onClick={() => navigateTo("home")}
          className="flex items-center gap-3 text-left text-white"
        >
          <img
            src={LOGO_SRC}
            alt="Illinois Protective Services logo"
            className="h-11 w-11 rounded-xl border border-white/10 bg-white object-cover p-1"
          />
          <div className="leading-tight">
            <div className="text-sm font-black uppercase tracking-[0.18em] text-white">
              Illinois Protective
            </div>
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8ea6ff]">
              Services
            </div>
          </div>
        </button>

        <div className="hidden flex-wrap gap-3 text-sm font-bold uppercase tracking-wide md:flex">
          <button type="button" onClick={() => navigateTo("home")} className={navButtonClass}>
            Home
          </button>
          <button type="button" onClick={() => navigateTo("about")} className={navButtonClass}>
            About Us
          </button>
          <button type="button" onClick={() => navigateTo("classes")} className={navButtonClass}>
            Classes
          </button>
          <button type="button" onClick={() => navigateTo("booking")} className={navButtonClass}>
            Book Now
          </button>
          <button
            type="button"
            onClick={() => navigateTo("contact")}
            className="rounded-full border border-[#4169e1]/40 bg-[#4169e1] px-4 py-2 text-white transition hover:bg-[#3558c9]"
          >
            Contact
          </button>
        </div>
      </div>
    </div>
  );
}

function BackButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-6 rounded-full border border-[#d9dee8] bg-white px-4 py-2 text-sm font-bold uppercase tracking-[0.14em] text-[#111111] hover:bg-[#f8fbff]"
    >
      ← Go Back
    </button>
  );
}

function VerifiedBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#4169e1]/20 bg-white/95 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-[#4169e1] shadow-[0_6px_18px_rgba(65,105,225,0.12)] backdrop-blur-sm">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4169e1] text-[10px] text-white">
        ✓
      </span>
      <span>Verified Instructor</span>
    </div>
  );
}

function InstructorCard({
  imageSrc,
  imageAlt,
  name,
  title,
  bio1,
  bio2,
  objectPosition = "center 18%",
}) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-[#d9dee8] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
      <div className="relative bg-[#eceef2]">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="block h-[430px] w-full object-cover"
          style={{ objectPosition }}
        />
        <div className="absolute bottom-4 left-4">
          <VerifiedBadge />
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-black uppercase">{name}</h3>
        <p className="mt-2 text-sm font-bold uppercase tracking-[0.14em] text-[#4169e1]">
          {title}
        </p>
        <p className="mt-4 leading-7 text-[#4b5563]">{bio1}</p>
        <p className="mt-3 leading-7 text-[#4b5563]">{bio2}</p>
      </div>
    </div>
  );
}

function ExpandableClassCard({ service, isSelected, onSelect, onAsk }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative h-full overflow-hidden rounded-[2rem] border border-[#d9dee8] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
      <div className="inline-flex rounded-full border border-[#4169e1]/20 bg-[#f5f8ff] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#4169e1]">
        Class Option
      </div>

      <h3 className="mt-4 text-2xl font-black uppercase">{service.title}</h3>
      <p className="mt-2 text-sm font-semibold text-[#b42318]">
        {service.audience}
      </p>
      <p className="mt-4 leading-7 text-[#4b5563]">{service.description}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#d9dee8] bg-[#f8fbff] p-4">
          <div className="text-xs font-black uppercase tracking-[0.14em] text-[#6b7280]">
            Full Price
          </div>
          <div className="mt-2 text-lg font-black text-[#111111]">
            {formatPrice(service.price)}
          </div>
          <div className="text-sm text-[#4169e1]">
            Deposit {formatPrice(service.deposit)}
          </div>
        </div>

        <div className="rounded-2xl border border-[#d9dee8] bg-[#fff8f2] p-4">
          <div className="text-xs font-black uppercase tracking-[0.14em] text-[#6b7280]">
            Duration
          </div>
          <div className="mt-2 text-lg font-black text-[#111111]">
            {service.duration}
          </div>
        </div>

        <div className="rounded-2xl border border-[#d9dee8] bg-[#f5f8ff] p-4">
          <div className="text-xs font-black uppercase tracking-[0.14em] text-[#6b7280]">
            Best For
          </div>
          <div className="mt-2 text-sm font-bold text-[#111111]">
            {service.audience}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-xl border border-[#111111]/10 bg-white px-5 py-3 font-black uppercase tracking-[0.12em] text-[#111111] hover:bg-[#f8fbff]"
        >
          {open ? "Hide Details" : "View Details"}
        </button>

        <button
          type="button"
          onClick={onSelect}
          className={`rounded-xl px-5 py-3 font-black uppercase tracking-[0.12em] transition ${
            isSelected
              ? "border border-[#4169e1]/40 bg-[#4169e1] text-white"
              : "border border-[#4169e1]/40 bg-[#4169e1] text-white hover:bg-[#3558c9]"
          }`}
        >
          Select This Class
        </button>

        <button
          type="button"
          onClick={onAsk}
          className="rounded-xl border border-[#e85b66]/25 bg-[#fff3f4] px-5 py-3 font-black uppercase tracking-[0.12em] text-[#c2414f] hover:bg-[#ffe8eb]"
        >
          Ask A Question
        </button>
      </div>

      {open ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#d9dee8] bg-[#f8fbff] p-5">
            <div className="text-sm font-black uppercase tracking-[0.16em] text-[#4169e1]">
              Included
            </div>
            <ul className="mt-3 space-y-2 text-[#4b5563]">
              {service.included.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-[#d9dee8] bg-white p-5">
            <div className="text-sm font-black uppercase tracking-[0.16em] text-[#111111]">
              Requirements
            </div>
            <ul className="mt-3 space-y-2 text-[#4b5563]">
              {service.requirements.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SmartAIChat({
  open,
  setOpen,
  services,
  navigateTo,
  setBookingStep,
  setSelectedService,
  selectedService,
  selectedDate,
  selectedTime,
}) {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Welcome to Illinois Protective Services. I can help you choose a class, explain pricing, and guide you through booking.",
    },
  ]);
  const [input, setInput] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const text = event.results?.[0]?.[0]?.transcript || "";
      if (text) {
        handleSend(text);
      }
    };

    recognitionRef.current = recognition;
  }, []);

  function pushConversation(userText, aiText) {
    setMessages((prev) => [
      ...prev,
      { role: "user", text: userText },
      { role: "ai", text: aiText },
    ]);
  }

  function currentSummary() {
    const service = services.find((item) => item.id === selectedService);
    if (!service) return "No class is selected yet.";
    return `${service.title} is selected. Full price is ${formatPrice(
      service.price
    )}. Deposit is ${formatPrice(service.deposit)}. Date: ${
      selectedDate || "not selected"
    }. Time: ${selectedTime || "not selected"}.`;
  }

  function replyFor(text) {
    const lower = text.toLowerCase();

    if (
      lower.includes("book") ||
      lower.includes("start booking") ||
      lower.includes("help me book")
    ) {
      navigateTo("booking");
      setBookingStep(1);
      return "I opened the booking page for you. Step 1 is choosing your class.";
    }

    if (lower.includes("price") || lower.includes("cost") || lower.includes("deposit")) {
      return services
        .map(
          (service) =>
            `${service.title}: full payment ${formatPrice(
              service.price
            )}, deposit ${formatPrice(service.deposit)}`
        )
        .join(" | ");
    }

    if (lower.includes("mini")) {
      setSelectedService("mini");
      navigateTo("booking");
      setBookingStep(2);
      return "I selected Mini Class and moved you to date and time selection.";
    }

    if (lower.includes("renewal")) {
      setSelectedService("renewal3");
      navigateTo("booking");
      setBookingStep(2);
      return "I selected the 3-Hour Renewal Course and moved you to date and time selection.";
    }

    if (lower.includes("veteran")) {
      setSelectedService("veteran8");
      navigateTo("booking");
      setBookingStep(2);
      return "I selected the 8-Hours Class Veteran option and moved you to date and time selection.";
    }

    if (
      lower.includes("16") ||
      lower.includes("ccl") ||
      lower.includes("full class")
    ) {
      setSelectedService("ccl16");
      navigateTo("booking");
      setBookingStep(2);
      return "I selected the 16-Hour CCL Course and moved you to date and time selection.";
    }

    if (
      lower.includes("summary") ||
      lower.includes("selected class") ||
      lower.includes("what did i choose")
    ) {
      return currentSummary();
    }

    if (
      lower.includes("refund") ||
      lower.includes("reschedule") ||
      lower.includes("policy")
    ) {
      return "If you cannot attend, notify the instructor at least 24 hours before class to retain full credit toward a future class date. Rescheduling requests with less than 24 hours’ notice result in forfeiture of class credit and require a new payment or deposit.";
    }

    if (
      lower.includes("bring") ||
      lower.includes("what should i bring") ||
      lower.includes("paperwork")
    ) {
      return "Bring your state ID or driver's license, FOID card, renewal documents if applicable, and completed paperwork in black ink.";
    }

    if (
      lower.includes("phone") ||
      lower.includes("contact") ||
      lower.includes("email")
    ) {
      return `You can contact Illinois Protective Services at ${BUSINESS_PHONE_DISPLAY} or ${BUSINESS_EMAIL}.`;
    }

    return "I can help you choose a class, show pricing, explain the refund policy, or start booking. Try: show class pricing, choose 16-hour class, or start booking.";
  }

  function handleSend(override) {
    const text = (override ?? input).trim();
    if (!text) return;

    const aiText = replyFor(text);
    pushConversation(text, aiText);
    setInput("");
  }

  function startVoice() {
    recognitionRef.current?.start();
  }

  const suggestions = [
    "Show class pricing",
    "Start booking",
    "Choose 16-hour class",
    "What should I bring?",
  ];

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[999999] flex h-16 w-16 items-center justify-center rounded-2xl border border-[#4169e1]/40 bg-[#4169e1] text-sm font-black uppercase text-white shadow-[0_0_30px_rgba(65,105,225,0.28)] transition hover:scale-105 hover:bg-[#3558c9]"
      >
        A.I.
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-[999999] w-[360px] overflow-hidden rounded-3xl border border-[#d9dee8] bg-white shadow-[0_25px_70px_rgba(0,0,0,0.22)]">
      <div className="flex items-center justify-between bg-black px-5 py-4 text-white">
        <div>
          <div className="text-sm font-black uppercase tracking-[0.2em]">
            Training Help
          </div>
          <div className="text-xs text-white/80">
            Website + concealed carry assistant
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={startVoice}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 hover:bg-white/10"
            title="Voice"
          >
            🎙️
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 hover:bg-white/10"
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="h-[320px] space-y-3 overflow-y-auto bg-[#f8fbff] p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[88%] rounded-2xl border px-4 py-3 text-sm leading-6 ${
              msg.role === "ai"
                ? "border-[#d9dee8] bg-white text-[#111111]"
                : "ml-auto border-[#4169e1]/20 bg-[#4169e1] text-white"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="border-t border-[#d9dee8] bg-white p-3">
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleSend(item)}
              className="rounded-full border border-[#d9dee8] bg-[#f8fbff] px-3 py-1.5 text-xs font-bold text-[#3558c9] hover:bg-[#eef4ff]"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder="Ask about classes, pricing, booking..."
            className="flex-1 rounded-xl border border-[#d9dee8] bg-white px-4 py-3 text-sm text-[#111111] outline-none"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            className="rounded-xl bg-[#4169e1] px-4 py-3 text-sm font-black uppercase text-white hover:bg-[#3558c9]"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [showOpeningGate, setShowOpeningGate] = useState(() => {
    if (typeof window === "undefined") return true;
    return sessionStorage.getItem("ips_opened") !== "yes";
  });

  const [page, setPage] = useState("home");
  const [history, setHistory] = useState(["home"]);
  const [classesView, setClassesView] = useState("grid");
  const [bookingStep, setBookingStep] = useState(1);
  const [aiOpen, setAiOpen] = useState(false);

  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [paymentMode, setPaymentMode] = useState("full");
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState("");

  const [publishableKey, setPublishableKey] = useState("");
  const [stripeEnabled, setStripeEnabled] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [loadingPaymentIntent, setLoadingPaymentIntent] = useState(false);
  const [paymentLoadError, setPaymentLoadError] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    type: "",
    message: "",
  });

  useEffect(() => {
    let isMounted = true;

    async function loadConfig() {
      try {
        const response = await fetch(`${API_BASE}/api/config`);
        const data = await response.json();
        if (!isMounted) return;
        setPublishableKey(data.publishableKey || "");
        setStripeEnabled(Boolean(data.stripeEnabled));
      } catch (error) {
        console.error("Failed to load config:", error);
      }
    }

    loadConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, bookingStep]);

  function navigateTo(nextPage) {
    setHistory((prev) => [...prev, nextPage]);
    setPage(nextPage);
  }

  function goBack() {
    if (page === "booking" && bookingStep > 1) {
      setBookingStep((prev) => prev - 1);
      return;
    }

    setHistory((prev) => {
      if (prev.length <= 1) return prev;
      const updated = prev.slice(0, -1);
      setPage(updated[updated.length - 1]);
      return updated;
    });
  }

  function getSelectedServiceObject() {
    return SERVICES.find((item) => item.id === selectedService);
  }

  function resetBookingFlow() {
    setSelectedService("");
    setSelectedDate("");
    setSelectedTime("");
    setPaymentMode("full");
    setPaymentCompleted(false);
    setPaymentIntentId("");
    setClientSecret("");
    setPaymentLoadError("");
    setBookingStep(1);
  }

  async function createPaymentIntent(mode) {
    if (!selectedService || !selectedDate || !selectedTime) {
      alert("Please complete your booking details first.");
      return;
    }

    if (!formData.name || !formData.phone || !formData.email) {
      alert("Please fill out your name, phone number, and email before payment.");
      return;
    }

    if (!stripeEnabled) {
      alert("Stripe is not configured yet.");
      return;
    }

    setPaymentMode(mode);
    setLoadingPaymentIntent(true);
    setPaymentLoadError("");
    setClientSecret("");

    try {
      const response = await fetch(`${API_BASE}/api/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId: selectedService,
          paymentMode: mode,
          customerName: formData.name,
          customerEmail: formData.email,
          bookingDate: selectedDate,
          bookingTime: selectedTime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to create payment intent.");
      }

      setClientSecret(data.clientSecret);
      setPaymentIntentId(data.paymentIntentId);
    } catch (error) {
      console.error(error);
      setPaymentLoadError(error.message || "Unable to load payment form.");
    } finally {
      setLoadingPaymentIntent(false);
    }
  }

  function handlePaymentSuccess(intentId) {
    setPaymentCompleted(true);
    setPaymentIntentId(intentId);
  }

  function confirmBooking() {
    if (!paymentCompleted) {
      alert("Please complete payment before confirming your booking.");
      return;
    }

    alert("Booking confirmed successfully.");
    resetBookingFlow();
    setHistory(["home"]);
    setPage("home");
  }

  function handleContactSubmit() {
    if (!formData.name || !formData.phone || !formData.email || !formData.type) {
      alert("Please fill out your name, phone number, email, and training type.");
      return;
    }

    setSubmitted(true);
    setFormData({
      name: "",
      phone: "",
      email: "",
      type: "",
      message: "",
    });
  }

  const assistantProps = {
    open: aiOpen,
    setOpen: setAiOpen,
    services: SERVICES,
    navigateTo,
    setBookingStep,
    setSelectedService,
    selectedService,
    selectedDate,
    selectedTime,
  };

  if (showOpeningGate) {
    return (
      <OpeningGate
        onEnter={() => {
          sessionStorage.setItem("ips_opened", "yes");
          setShowOpeningGate(false);
        }}
      />
    );
  }

  if (page === "about") {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#fffdfd_0%,#f7f9ff_38%,#fffaf8_100%)] pb-24 text-[#111111] md:pb-0">
        <NavBar navigateTo={navigateTo} />
        <SmartAIChat {...assistantProps} />

        <section className="mx-auto max-w-6xl px-6 py-16 md:px-10">
          <BackButton onClick={goBack} />

          <div className="max-w-4xl">
            <div className="inline-flex rounded-full border border-[#4169e1]/20 bg-[#f5f8ff] px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-[#4169e1]">
              About Us
            </div>

            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.06em] sm:text-5xl">
              Premier Firearms Academy in Illinois
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#4b5563]">
              Illinois Protective Services focuses on training responsible
              citizens through structured firearms education, practical guidance,
              disciplined range expectations, and a supportive learning
              environment.
            </p>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-black uppercase">
              Professional Leadership & Real Training Experience
            </h2>

            <div className="mt-10 grid gap-8 md:grid-cols-2">
              <InstructorCard
                imageSrc="/instructor-michael.jpeg"
                imageAlt="Michael Wrotten-Simes"
                name="Michael Wrotten-Simes"
                title="CEO & Lead Instructor"
                objectPosition="center 16%"
                bio1="Michael Wrotten-Simes is the CEO and lead instructor of Illinois Protective Services, bringing a disciplined and professional approach to firearms training."
                bio2="His focus is on building responsible gun owners through structured instruction, safety-first standards, and practical defensive training."
              />

              <InstructorCard
                imageSrc="/instructor-ron.jpeg"
                imageAlt="Ron Austin"
                name="Ron Austin"
                title="Firearms Instructor"
                objectPosition="center 14%"
                bio1="Ron Austin is a dedicated firearms instructor with a strong emphasis on precision, safety, and practical range performance."
                bio2="His calm, professional teaching style helps students build proper technique, awareness, and confidence under instruction."
              />
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (page === "classes") {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#fffdfd_0%,#f7f9ff_38%,#fffaf8_100%)] pb-24 text-[#111111] md:pb-0">
        <NavBar navigateTo={navigateTo} />
        <SmartAIChat {...assistantProps} />

        <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <BackButton onClick={goBack} />

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <div className="inline-flex rounded-full border border-[#b42318]/20 bg-[#fff3f4] px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-[#b42318]">
                Class Services
              </div>
              <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.06em] sm:text-5xl">
                Choose the Right Training Path
              </h1>
              <p className="mt-4 text-lg leading-8 text-[#4b5563]">
                Review class details, requirements, and pricing before booking.
              </p>
            </div>

            <div className="w-full max-w-[220px]">
              <label className="mb-2 block text-sm font-black uppercase tracking-[0.16em] text-[#4169e1]">
                View
              </label>
              <select
                value={classesView}
                onChange={(e) => setClassesView(e.target.value)}
                className="w-full rounded-2xl border border-[#d9dee8] bg-white px-4 py-3 text-sm font-bold text-[#111111] outline-none"
              >
                <option value="grid">Grid View</option>
                <option value="list">List View</option>
              </select>
            </div>
          </div>

          <div
            className={`mt-10 grid gap-6 ${
              classesView === "grid" ? "lg:grid-cols-2" : "grid-cols-1"
            }`}
          >
            {SERVICES.map((service) => (
              <ExpandableClassCard
                key={service.id}
                service={service}
                isSelected={selectedService === service.id}
                onSelect={() => {
                  setSelectedService(service.id);
                  navigateTo("booking");
                  setBookingStep(1);
                }}
                onAsk={() => {
                  setSelectedService(service.id);
                  setFormData((prev) => ({ ...prev, type: service.title }));
                  navigateTo("contact");
                }}
              />
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (page === "booking") {
    const service = getSelectedServiceObject();

    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#fffdfd_0%,#f7f9ff_38%,#fffaf8_100%)] pb-24 text-[#111111] md:pb-0">
        <NavBar navigateTo={navigateTo} />
        <SmartAIChat {...assistantProps} />

        <section className="mx-auto max-w-6xl px-6 py-16 md:px-10">
          <BackButton onClick={goBack} />

          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-[#4169e1]/20 bg-[#f5f8ff] px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-[#4169e1]">
              Booking
            </div>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.06em] sm:text-5xl">
              Book Your Class
            </h1>
            <p className="mt-4 text-lg leading-8 text-[#4b5563]">
              Step 1: choose class. Step 2: choose date and time. Step 3:
              review, pay, and confirm.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { step: 1, text: "Choose Class" },
              { step: 2, text: "Choose Date & Time" },
              { step: 3, text: "Review & Pay" },
            ].map((item) => (
              <div
                key={item.step}
                className={`rounded-2xl border px-5 py-4 ${
                  bookingStep === item.step
                    ? "border-[#4169e1] bg-[#f5f8ff]"
                    : "border-[#d9dee8] bg-white text-[#6b7280]"
                }`}
              >
                <div className="text-sm font-black uppercase tracking-[0.18em]">
                  Step {item.step}
                </div>
                <div className="mt-1 text-lg font-bold">{item.text}</div>
              </div>
            ))}
          </div>

          {bookingStep === 1 ? (
            <div className="mt-10 rounded-[2rem] border border-[#d9dee8] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
              <h2 className="text-2xl font-black uppercase">Choose a Class</h2>

              <div className="mt-6 grid gap-3">
                {SERVICES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedService(item.id)}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                      selectedService === item.id
                        ? "border-[#4169e1] bg-[#f5f8ff]"
                        : "border-[#d9dee8] bg-white hover:bg-[#f8fbff]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-base font-black uppercase">
                          {item.title}
                        </div>
                        <div className="mt-1 text-sm text-[#6b7280]">
                          {item.duration}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-black">
                          {formatPrice(item.price)}
                        </div>
                        <div className="text-xs text-[#6b7280]">
                          Deposit {formatPrice(item.deposit)}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!selectedService) {
                    alert("Please select a class first.");
                    return;
                  }
                  setBookingStep(2);
                }}
                className="mt-6 rounded-2xl border border-[#4169e1]/40 bg-[#4169e1] px-6 py-4 text-base font-black uppercase tracking-[0.16em] text-white hover:bg-[#3558c9]"
              >
                Continue to Step 2
              </button>
            </div>
          ) : null}

          {bookingStep === 2 ? (
            <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-[#d9dee8] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                  <h2 className="text-xl font-black uppercase">Available Dates</h2>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {AVAILABLE_DATES.map((date) => (
                      <button
                        key={date.value}
                        type="button"
                        disabled={date.disabled}
                        onClick={() => {
                          if (!date.disabled) setSelectedDate(date.value);
                        }}
                        className={`rounded-2xl border px-4 py-4 text-left text-sm font-black uppercase tracking-[0.12em] transition ${
                          date.disabled
                            ? "cursor-not-allowed border-[#e5e7eb] bg-[#f9fafb] text-[#9ca3af] line-through"
                            : selectedDate === date.value
                            ? "border-[#4169e1] bg-[#f5f8ff]"
                            : "border-[#d9dee8] bg-white hover:bg-[#f8fbff]"
                        }`}
                      >
                        <div>{date.label}</div>
                        <div className="mt-2 text-xs tracking-[0.18em]">
                          {date.disabled ? "Unavailable" : "Available"}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-[#d9dee8] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                  <h2 className="text-xl font-black uppercase text-[#4169e1]">
                    Available Time Frames
                  </h2>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {AVAILABLE_TIMES.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`rounded-2xl border px-4 py-4 text-center text-sm font-black uppercase tracking-[0.12em] transition ${
                          selectedTime === time
                            ? "border-[#4169e1] bg-[#4169e1] text-white"
                            : "border-[#d9dee8] bg-white text-[#4169e1] hover:bg-[#f5f8ff]"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-[#d9dee8] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                <h2 className="text-2xl font-black uppercase">Review Availability</h2>

                <div className="mt-6 space-y-4 text-[#374151]">
                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-[#6b7280]">
                      Class
                    </div>
                    <div className="mt-1 text-lg font-bold">
                      {service?.title || "No class selected"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-[#6b7280]">
                      Full Price
                    </div>
                    <div className="mt-1 text-lg font-bold">
                      {formatPrice(service?.price || 0)}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-[#6b7280]">
                      Deposit
                    </div>
                    <div className="mt-1 text-lg font-bold">
                      {formatPrice(service?.deposit || 0)}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-[#6b7280]">
                      Date
                    </div>
                    <div className="mt-1 text-lg font-bold">
                      {AVAILABLE_DATES.find((d) => d.value === selectedDate)?.label ||
                        "No date selected"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-[#6b7280]">
                      Time
                    </div>
                    <div className="mt-1 text-lg font-bold">
                      {selectedTime || "No time selected"}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!selectedDate || !selectedTime) {
                        alert("Please choose a date and time first.");
                        return;
                      }
                      setBookingStep(3);
                    }}
                    className="w-full rounded-2xl border border-[#4169e1]/40 bg-[#4169e1] px-6 py-4 text-base font-black uppercase tracking-[0.16em] text-white hover:bg-[#3558c9]"
                  >
                    Continue to Step 3
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {bookingStep === 3 ? (
            <div className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[2rem] border border-[#d9dee8] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                <h2 className="text-2xl font-black uppercase">Review & Pay</h2>

                <div className="mt-6 space-y-4 text-[#374151]">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Full Name"
                      className="rounded-2xl border border-[#d9dee8] bg-white px-4 py-3 outline-none"
                    />
                    <input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      placeholder="Phone Number"
                      className="rounded-2xl border border-[#d9dee8] bg-white px-4 py-3 outline-none"
                    />
                    <input
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="Email Address"
                      className="rounded-2xl border border-[#d9dee8] bg-white px-4 py-3 outline-none sm:col-span-2"
                    />
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-[#6b7280]">
                      Class
                    </div>
                    <div className="mt-1 text-lg font-bold">
                      {service?.title || "No class selected"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-[#6b7280]">
                      Full Price
                    </div>
                    <div className="mt-1 text-lg font-bold">
                      {formatPrice(service?.price || 0)}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-[#6b7280]">
                      Deposit
                    </div>
                    <div className="mt-1 text-lg font-bold">
                      {formatPrice(service?.deposit || 0)}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-[#6b7280]">
                      Date
                    </div>
                    <div className="mt-1 text-lg font-bold">
                      {AVAILABLE_DATES.find((d) => d.value === selectedDate)?.label ||
                        "No date selected"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-[#6b7280]">
                      Time
                    </div>
                    <div className="mt-1 text-lg font-bold">
                      {selectedTime || "No time selected"}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#e85b66]/20 bg-[#fff3f4] p-4 text-sm text-[#b42318]">
                    If you cannot attend class, notify the instructor at least
                    24 hours before the scheduled class date to retain full
                    credit toward a future class. Rescheduling with less than 24
                    hours’ notice forfeits class credit and requires a new
                    payment or deposit.
                  </div>

                  <div className="grid gap-3">
                    <button
                      type="button"
                      onClick={() => createPaymentIntent("deposit")}
                      className={`rounded-2xl border px-4 py-4 text-left font-black uppercase tracking-[0.14em] transition ${
                        paymentMode === "deposit"
                          ? "border-[#4169e1] bg-[#f5f8ff]"
                          : "border-[#d9dee8] bg-white hover:bg-[#f8fbff]"
                      }`}
                    >
                      Pay Deposit — {formatPrice(service?.deposit || 0)}
                    </button>

                    <button
                      type="button"
                      onClick={() => createPaymentIntent("full")}
                      className={`rounded-2xl border px-4 py-4 text-left font-black uppercase tracking-[0.14em] transition ${
                        paymentMode === "full"
                          ? "border-[#4169e1] bg-[#f5f8ff]"
                          : "border-[#d9dee8] bg-white hover:bg-[#f8fbff]"
                      }`}
                    >
                      Pay Full Amount — {formatPrice(service?.price || 0)}
                    </button>
                  </div>

                  {paymentCompleted ? (
                    <div className="rounded-2xl border border-[#4169e1]/20 bg-[#f5f8ff] p-4 text-sm text-[#3558c9]">
                      Payment completed successfully.
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={confirmBooking}
                    className="w-full rounded-2xl border border-[#4169e1]/40 bg-[#4169e1] px-6 py-4 text-base font-black uppercase tracking-[0.16em] text-white hover:bg-[#3558c9]"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>

              <div className="rounded-[2rem] border border-[#d9dee8] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                <h2 className="text-2xl font-black uppercase">Secure Payment</h2>

                {!stripeEnabled ? (
                  <div className="mt-6 rounded-2xl border border-[#d9dee8] bg-white p-5 text-[#6b7280]">
                    Stripe is not configured yet.
                  </div>
                ) : null}

                {loadingPaymentIntent ? (
                  <div className="mt-6 rounded-2xl border border-[#d9dee8] bg-white p-5 text-[#6b7280]">
                    Loading secure payment form...
                  </div>
                ) : null}

                {paymentLoadError ? (
                  <div className="mt-6 rounded-2xl border border-[#e85b66]/20 bg-[#fff3f4] p-5 text-[#b42318]">
                    {paymentLoadError}
                  </div>
                ) : null}

                <div className="mt-6">
                  <StripePaymentPanel
                    publishableKey={publishableKey}
                    clientSecret={clientSecret}
                    customerName={formData.name}
                    customerEmail={formData.email}
                    onSuccess={handlePaymentSuccess}
                  />
                </div>

                {paymentIntentId ? (
                  <div className="mt-4 rounded-2xl border border-[#4169e1]/20 bg-[#f5f8ff] p-4 text-sm text-[#3558c9]">
                    Payment recorded: {paymentIntentId}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </section>
      </div>
    );
  }

  if (page === "contact") {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#fffdfd_0%,#f7f9ff_38%,#fffaf8_100%)] pb-24 text-[#111111] md:pb-0">
        <NavBar navigateTo={navigateTo} />
        <SmartAIChat {...assistantProps} />

        <section className="mx-auto max-w-5xl px-6 py-16 md:px-10">
          <BackButton onClick={goBack} />

          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-[#4169e1]/20 bg-[#f5f8ff] px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-[#4169e1]">
              Contact
            </div>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.06em] sm:text-5xl">
              Reach Out to Our Team
            </h1>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-[2rem] border border-[#d9dee8] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
              <h2 className="text-2xl font-black uppercase">Contact Details</h2>
              <div className="mt-6 space-y-4 text-lg text-[#374151]">
                <p>
                  <span className="font-bold text-[#111111]">Phone:</span>{" "}
                  <a href={`tel:${BUSINESS_PHONE}`} className="hover:text-[#4169e1]">
                    {BUSINESS_PHONE_DISPLAY}
                  </a>
                </p>
                <p className="break-all">
                  <span className="font-bold text-[#111111]">Email:</span>{" "}
                  <a href={`mailto:${BUSINESS_EMAIL}`} className="hover:text-[#4169e1]">
                    {BUSINESS_EMAIL}
                  </a>
                </p>
                <p>
                  <span className="font-bold text-[#111111]">Address:</span>{" "}
                  {BUSINESS_ADDRESS}
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#d9dee8] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
              <h2 className="text-2xl font-black uppercase">Send a Message</h2>
              <div className="mt-6 grid gap-4">
                <input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="rounded-2xl border border-[#d9dee8] bg-white px-5 py-4 outline-none"
                  placeholder="Full Name"
                />
                <input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="rounded-2xl border border-[#d9dee8] bg-white px-5 py-4 outline-none"
                  placeholder="Phone Number"
                />
                <input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="rounded-2xl border border-[#d9dee8] bg-white px-5 py-4 outline-none"
                  placeholder="Email Address"
                />
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="rounded-2xl border border-[#d9dee8] bg-white px-5 py-4 outline-none"
                >
                  <option value="">Select Training Type</option>
                  <option>Mini Class</option>
                  <option>3-Hour Renewal Course</option>
                  <option>8-Hours Class Veteran</option>
                  <option>16-Hour CCL Course</option>
                </select>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, message: e.target.value }))
                  }
                  className="min-h-[140px] rounded-2xl border border-[#d9dee8] bg-white px-5 py-4 outline-none"
                  placeholder="Questions about paperwork, eligibility, scheduling, or training"
                />

                <button
                  type="button"
                  onClick={handleContactSubmit}
                  className="rounded-2xl border border-[#4169e1]/40 bg-[#4169e1] px-6 py-4 text-lg font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#3558c9]"
                >
                  Send Request
                </button>

                {submitted ? (
                  <div className="rounded-2xl border border-[#4169e1]/20 bg-[#f5f8ff] px-5 py-4 font-bold text-[#3558c9]">
                    Request submitted successfully.
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffdfd_0%,#f7f9ff_38%,#fffaf8_100%)] pb-24 text-[#111111] md:pb-0">
      <NavBar navigateTo={navigateTo} />
      <SmartAIChat {...assistantProps} />

      <section className="relative overflow-hidden border-b border-[#e5e7eb] bg-[linear-gradient(135deg,#fff1f1_0%,#ffffff_22%,#eef4ff_48%,#ffffff_70%,#fff4f4_100%)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.24),transparent_28%),radial-gradient(circle_at_top_right,rgba(65,105,225,0.22),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(220,38,38,0.10),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(65,105,225,0.12),transparent_28%)]" />

        <img
          src="/hero-flag-corner.png"
          alt="American flag decorative corner"
          className="pointer-events-none absolute left-0 top-0 z-10 w-[300px] max-w-[55vw] object-contain opacity-95 md:w-[420px]"
        />

        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="absolute right-16 top-10 text-2xl text-blue-500 opacity-20">★</div>
          <div className="absolute right-32 top-20 text-lg text-blue-400 opacity-15">★</div>
          <div className="absolute right-10 top-32 text-xl text-blue-600 opacity-10">★</div>
          <div className="absolute bottom-16 left-12 text-xl text-red-500 opacity-20">★</div>
          <div className="absolute bottom-28 left-24 text-lg text-red-400 opacity-15">★</div>
          <div className="absolute bottom-10 left-32 text-2xl text-red-600 opacity-10">★</div>
        </div>

        <div className="relative z-20 mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center md:px-10">
          <div className="inline-flex items-center gap-4 rounded-2xl border border-[#d9dee8] bg-white/90 px-4 py-3 shadow-[0_10px_24px_rgba(15,23,42,0.06)] backdrop-blur-sm">
            <img
              src={LOGO_SRC}
              alt="Illinois Protective Services logo"
              className="h-14 w-14 rounded-xl border border-[#d9dee8] bg-white object-cover p-1"
            />
            <div className="leading-tight text-left">
              <div className="text-sm font-black uppercase tracking-[0.18em] text-[#111111]">
                Illinois Protective Services
              </div>
              <div className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-[#4169e1]">
                Premier Firearms Academy in Illinois
              </div>
            </div>
          </div>

          <h1 className="mt-10 text-5xl font-black uppercase tracking-[0.05em] text-[#111111] sm:text-6xl lg:text-7xl">
            Concealed Carry
            <span className="block text-[#4169e1]">Training Done Right</span>
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#4b5563] sm:text-xl">
            Professional Illinois concealed carry instruction with structured
            booking, practical training, and a clear path toward responsible
            firearm ownership.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setBookingStep(1);
                navigateTo("booking");
              }}
              className="rounded-2xl border border-[#4169e1]/40 bg-[#4169e1] px-7 py-4 text-center text-lg font-black uppercase tracking-[0.14em] text-white transition hover:bg-[#3558c9]"
            >
              Book Now
            </button>

            <button
              type="button"
              onClick={() => navigateTo("classes")}
              className="rounded-2xl border border-[#d9dee8] bg-white/95 px-7 py-4 text-center text-lg font-black uppercase tracking-[0.14em] text-[#111111] transition hover:bg-[#f8fbff]"
            >
              View Classes
            </button>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              "Certified Instruction",
              "Weekday Classes",
              "Range Guidance",
              "Certificate Support",
            ].map((item) => (
              <div
                key={item}
                className="rounded-full border border-[#d9dee8] bg-white/95 px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] text-[#374151]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}