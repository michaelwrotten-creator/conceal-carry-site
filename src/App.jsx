import { useEffect, useMemo, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(65,105,225,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(220,38,38,0.14),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_10px,rgba(255,255,255,0.03)_11px)]" />

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
            in Illinois. Our focus is to train responsible citizens in Illinois
            to better protect themselves and their loved ones through our USCCA
            Personal Protection and Home Defense Courses. Our experienced
            instructors provide comprehensive training in a safe and supportive
            environment. Join us today and take the first step towards becoming
            a confident and responsible gun owner.
          </p>

          <button
            type="button"
            onClick={onEnter}
            className="mt-8 rounded-full border border-[#4169e1]/40 bg-[#4169e1] px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-white shadow-[0_0_30px_rgba(65,105,225,0.28)] transition hover:scale-[1.02] hover:bg-[#3558c9]"
          >
            Click Here To Explore!
          </button>
        </div>
      </div>
    </div>
  );
}

function AiHelperChat() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Welcome to Illinois Protective Services. I can help with class options, booking, paperwork, refunds, required items, and general concealed carry training questions.",
    },
  ]);

  const websiteKnowledge = {
    businessName: "Illinois Protective Services",
    phone: "(224) 248-7021",
    email: "support@illinoisprotectiveservices.com",
    address: "7601 S. Cicero Ave, Chicago, IL 60652",
    bookingHours: "Monday through Friday from 9:00 AM to 5:00 PM.",
    bookingSteps:
      "Booking is completed in three steps: choose a class, choose date and time, then review, pay, and confirm.",
    refundPolicy:
      "Website policy: If a student cannot attend, they should notify the instructor at least 24 hours in advance to retain full credit toward a future class date. Rescheduling requests made with less than 24 hours’ notice result in forfeiture of class credit and require a new class payment or deposit.",
    services: [
      {
        id: "mini",
        title: "Mini Class",
        price: 50,
        deposit: 16.67,
        duration: "1 hr 30 min",
        summary:
          "Quick training session for basic instruction, refreshers, and introductory firearm safety.",
      },
      {
        id: "3hour",
        title: "3-Hour Renewal Course",
        price: 75,
        deposit: 25.0,
        duration: "3 hr",
        summary:
          "Renewal training for students needing a 3-hour concealed carry renewal course.",
      },
      {
        id: "8hour-veteran",
        title: "8-Hours Class Veteran",
        price: 100,
        deposit: 33.33,
        duration: "8 hr",
        summary:
          "Extended training option for qualifying veterans needing 8-hour instruction.",
      },
      {
        id: "16hour",
        title: "16-Hour CCL Course",
        price: 225,
        deposit: 75.0,
        duration: "16 hr",
        summary:
          "Full concealed carry license training course for first-time students needing complete instruction.",
      },
    ],
  };

  const fileKnowledge = {
    paperwork: [
      "All paperwork should be completed fully in black ink and printed neatly.",
      "A copy of the student’s state ID or driver’s license should be added to the class folder.",
      "A copy of the FOID card should be added to the class folder.",
      "Renewal students should also include a copy of their CCL in the class folder.",
      "Failing to complete paperwork properly may delay certificate processing.",
    ],
    pricingNotes: [
      "Some uploaded course documents mention Basic, Advanced, or Premium inclusions for certain class types.",
      "The website’s pricing and policy should be treated as the primary source when there is any difference.",
    ],
    packetNotices: [
      "Training dates and class schedules may change by the instructor or Illinois Protective Services.",
      "Cell phone usage is prohibited during instructional time unless approved by the instructor.",
      "No audio or video recording is permitted.",
      "If a certificate is lost, the student packet lists replacement-fee language.",
      "Failure to arrive to class or range on time may result in a $55 makeup fee.",
    ],
    safetyAndTraining: [
      "Situational awareness and conflict avoidance are emphasized as top priorities.",
      "Students should stay alert, avoid trouble when possible, and use good judgment.",
      "Concealed carry training should include knowledge of laws, travel considerations, everyday carry choices, and regular practice.",
      "The training guides emphasize responsible carry, practical training, and continued learning.",
    ],
    checklist: [
      "Proof of registration and required class materials",
      "Eye and ear protection",
      "A firearm intended for practice if applicable",
      "Ammunition and extra magazines if applicable",
      "Notebook or journal and pen",
      "Water and class-day essentials",
    ],
  };

  function formatServices() {
    return websiteKnowledge.services
      .map(
        (s) =>
          `${s.title}: full payment $${s.price.toFixed(2)}, deposit $${s.deposit.toFixed(
            2
          )}, duration ${s.duration}`
      )
      .join("; ");
  }

  function answerFromKnowledge(message) {
    const lower = message.toLowerCase();
    const mentions = (...terms) => terms.some((term) => lower.includes(term));

    if (mentions("class", "classes", "service", "services", "options")) {
      return `Available classes: ${formatServices()}.`;
    }

    if (mentions("deposit", "price", "pricing", "cost", "payment", "pay")) {
      return `Website pricing: ${formatServices()}. Some uploaded pricing documents mention extra bundled inclusions for certain course versions, but website-stated pricing and policy should be treated as the primary source.`;
    }

    if (mentions("book", "booking", "schedule", "appointment")) {
      return `${websiteKnowledge.bookingSteps} Booking hours are ${websiteKnowledge.bookingHours}`;
    }

    if (mentions("paperwork", "forms", "packet", "black ink", "documents")) {
      return `Paperwork guidance: ${fileKnowledge.paperwork.join(" ")}`;
    }

    if (mentions("what should i bring", "what do i bring", "bring", "items")) {
      return `Helpful bring-items guidance: ${fileKnowledge.checklist.join(
        "; "
      )}. Students should also confirm final instructor instructions before class day.`;
    }

    if (mentions("refund", "reschedule", "policy")) {
      return websiteKnowledge.refundPolicy;
    }

    if (mentions("late", "makeup", "miss class", "miss range")) {
      return `Uploaded packet guidance mentions that missing class or range or arriving late may trigger a $55 makeup fee. The website refund and rescheduling policy should still be treated as primary for what is shown on the site.`;
    }

    if (mentions("certificate", "replacement")) {
      return `The uploaded student packet mentions certificate and replacement-fee language for lost certificates.`;
    }

    if (mentions("laws", "travel", "permit", "illinois law", "reciprocity")) {
      return `General concealed carry guidance: students should stay current with firearm laws, understand permit rules, and review travel and reciprocity considerations before carrying across jurisdictions.`;
    }

    if (mentions("safety", "situational awareness", "awareness", "conflict")) {
      return `General training guidance: situational awareness and conflict avoidance are top priorities. The uploaded guides emphasize staying alert, using good judgment, and avoiding trouble whenever possible.`;
    }

    if (mentions("contact", "phone", "email", "call", "address")) {
      return `You can contact ${websiteKnowledge.businessName} at ${websiteKnowledge.phone}, ${websiteKnowledge.email}, or ${websiteKnowledge.address}.`;
    }

    if (mentions("instructor", "michael", "ron")) {
      return `Illinois Protective Services lists Michael Wrotten-Simes as CEO and Lead Instructor and Ron Austin as Firearms Instructor.`;
    }

    return "I can help with class options, website pricing, booking steps, paperwork, what to bring, refund policy, training guidance, and general concealed carry education.";
  }

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: trimmed },
      { role: "assistant", text: answerFromKnowledge(trimmed) },
    ]);
    setInput("");
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {open && (
        <div className="mb-4 w-[390px] overflow-hidden rounded-3xl border border-[#d9dee8] bg-white shadow-[0_25px_70px_rgba(0,0,0,0.18)]">
          <div className="relative flex items-center justify-between border-b border-[#d9dee8] bg-black px-5 py-4 text-white">
            <div>
              <div className="text-sm font-black uppercase tracking-[0.22em]">
                Training Help
              </div>
              <div className="text-xs font-semibold text-white/80">
                Website + conceal carry assistant
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMinimized((prev) => !prev)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white hover:bg-white/10"
                aria-label="Minimize chat"
                title="Minimize"
              >
                —
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setMinimized(false);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white hover:bg-white/10"
                aria-label="Close chat"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              <div className="h-[380px] space-y-3 overflow-y-auto p-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`max-w-[88%] rounded-2xl border px-4 py-3 text-sm leading-6 ${
                      msg.role === "assistant"
                        ? "border-[#d9dee8] bg-[#f8fbff] text-[#111111]"
                        : "ml-auto border-[#4169e1]/20 bg-[#4169e1] text-white"
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              <div className="border-t border-[#d9dee8] p-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSend();
                    }}
                    placeholder="Ask about classes, paperwork, laws, refunds..."
                    className="flex-1 rounded-xl border border-[#d9dee8] bg-white px-4 py-3 text-sm text-[#111111] outline-none placeholder:text-[#6b7280]"
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    className="rounded-xl bg-[#4169e1] px-4 py-3 text-sm font-black uppercase text-white hover:bg-[#3558c9]"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          setOpen((prev) => !prev);
          if (!open) setMinimized(false);
        }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#4169e1]/40 bg-[#4169e1] text-xs font-black uppercase text-white shadow-[0_0_30px_rgba(65,105,225,0.28)] transition hover:scale-105 hover:bg-[#3558c9]"
      >
        A.I.
      </button>
    </div>
  );
}

function StripeCheckoutForm({ onSuccess, customerName, customerEmail }) {
  const stripe = useStripe();
  const elements = useElements();

  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [billingName, setBillingName] = useState(customerName || "");
  const [billingEmail, setBillingEmail] = useState(customerEmail || "");

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    if (!stripe || !elements) return;

    setStatus("processing");

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        payment_method_data: {
          billing_details: {
            name: billingName,
            email: billingEmail,
          },
        },
      },
      redirect: "if_required",
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message || "Payment failed.");
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      setStatus("success");
      onSuccess(paymentIntent.id);
      return;
    }

    setStatus("idle");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="text"
          value={billingName}
          onChange={(e) => setBillingName(e.target.value)}
          placeholder="Cardholder Name"
          className="rounded-2xl border border-[#d9dee8] bg-white px-4 py-3 text-[#111111] outline-none placeholder:text-[#6b7280]"
          required
        />
        <input
          type="email"
          value={billingEmail}
          onChange={(e) => setBillingEmail(e.target.value)}
          placeholder="Email for Receipt"
          className="rounded-2xl border border-[#d9dee8] bg-white px-4 py-3 text-[#111111] outline-none placeholder:text-[#6b7280]"
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
        disabled={!stripe || status === "processing"}
        className="w-full rounded-2xl border border-[#4169e1]/40 bg-[#4169e1] px-6 py-4 text-base font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#3558c9] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "processing" ? "Processing..." : "Submit Payment"}
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

function VerifiedBadge({ label = "Verified Instructor" }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#4169e1]/20 bg-white/95 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-[#4169e1] shadow-[0_6px_18px_rgba(65,105,225,0.12)] backdrop-blur-sm">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4169e1] text-[10px] text-white">
        ✓
      </span>
      <span>{label}</span>
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
  imagePosition = "center 14%",
}) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-[#d9dee8] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
      <div className="relative bg-[#eceef2]">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="block h-[460px] w-full object-cover"
          style={{ objectPosition: imagePosition }}
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

function ExpandableClassCard({
  service,
  isSelected,
  onSelect,
  onAsk,
  formatPrice,
}) {
  const [open, setOpen] = useState(false);
  const deposit = Math.round((service.price / 3) * 100) / 100;

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[#d9dee8] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-[linear-gradient(90deg,transparent_0%,rgba(65,105,225,0.65)_35%,rgba(220,38,38,0.55)_65%,transparent_100%)]" />

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
            Pricing
          </div>
          <div className="mt-2 text-lg font-black text-[#111111]">
            {formatPrice(service.price)}
          </div>
          <div className="text-sm text-[#4169e1]">
            Deposit {formatPrice(deposit)}
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

      {open && (
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
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

          <div className="rounded-2xl border border-[#d9dee8] bg-[#fff8f2] p-5">
            <div className="text-sm font-black uppercase tracking-[0.16em] text-[#b45309]">
              Pricing Notes
            </div>
            <ul className="mt-3 space-y-2 text-[#4b5563]">
              {service.pricingNotes.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileStickyBookButton({ onClick }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[9998] border-t border-[#d9dee8] bg-white/95 p-3 shadow-[0_-10px_30px_rgba(15,23,42,0.12)] backdrop-blur md:hidden">
      <button
        type="button"
        onClick={onClick}
        className="w-full rounded-2xl border border-[#4169e1]/40 bg-[#4169e1] px-6 py-4 text-center text-base font-black uppercase tracking-[0.16em] text-white hover:bg-[#3558c9]"
      >
        Book Now
      </button>
    </div>
  );
}

export default function ConcealCarryTrainingWebsite() {
  const API_BASE = "https://conceal-carry-backend.onrender.com";
  const LOGO_SRC = "/ips-logo.png";

  const [showOpeningGate, setShowOpeningGate] = useState(() => {
    if (typeof window === "undefined") return true;
    return sessionStorage.getItem("ips_opened") !== "yes";
  });

  const [page, setPage] = useState("home");
  const [pageHistory, setPageHistory] = useState(["home"]);
  const [bookingStep, setBookingStep] = useState(1);

  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [paymentMode, setPaymentMode] = useState("full");
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [publishableKey, setPublishableKey] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [loadingPaymentIntent, setLoadingPaymentIntent] = useState(false);
  const [paymentLoadError, setPaymentLoadError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    type: "",
    message: "",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, bookingStep]);

  const availableDates = [
    { value: "2026-04-16", label: "Thursday, April 16", disabled: false },
    { value: "2026-04-17", label: "Friday, April 17", disabled: false },
    { value: "2026-04-18", label: "Saturday, April 18", disabled: true },
    { value: "2026-04-19", label: "Sunday, April 19", disabled: true },
    { value: "2026-04-20", label: "Monday, April 20", disabled: false },
    { value: "2026-04-21", label: "Tuesday, April 21", disabled: false },
    { value: "2026-04-22", label: "Wednesday, April 22", disabled: false },
    { value: "2026-04-23", label: "Thursday, April 23", disabled: false },
    { value: "2026-04-24", label: "Friday, April 24", disabled: false },
  ];

  const availableTimes = [
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

  const classServices = [
    {
      id: "mini",
      title: "Mini Class",
      price: 50,
      duration: "1 hr 30 min",
      description:
        "Quick training session designed for basic instruction, refreshers, and introductory firearm safety.",
      audience: "Great for students wanting a shorter guided session.",
      included: [
        "Mini class instruction",
        "Basic firearm safety guidance",
        "Hands-on instructor support",
      ],
      requirements: [
        "Completed paperwork in black ink",
        "State ID or driver's license",
        "FOID card if applicable",
      ],
      pricingNotes: [
        "Deposit is one-third of class price",
        "Range fee may apply separately",
        "No refunds",
      ],
    },
    {
      id: "3hour",
      title: "3-Hour Renewal Course",
      price: 75,
      duration: "3 hr",
      description:
        "Renewal training for qualified students who need a 3-hour concealed carry renewal course.",
      audience: "Best for renewal students needing required update training.",
      included: [
        "3-hour renewal instruction",
        "Certificate guidance",
        "Structured classroom review",
      ],
      requirements: [
        "FOID card",
        "Renewal documents",
        "CCL copy if applicable",
      ],
      pricingNotes: [
        "Deposit is one-third of class price",
        "Late arrival may trigger a $55 makeup fee",
        "No refunds",
      ],
    },
    {
      id: "8hour-veteran",
      title: "8-Hours Class Veteran",
      price: 100,
      duration: "8 hr",
      description:
        "Extended training course for veterans with structured instruction and state-credit considerations.",
      audience: "Designed for qualifying veterans needing 8-hour credit.",
      included: [
        "8-hour instruction",
        "Qualification guidance",
        "Structured training support",
      ],
      requirements: [
        "DD-214 showing honorable discharge",
        "State ID or driver's license",
        "FOID card if applicable",
      ],
      pricingNotes: [
        "Deposit is one-third of class price",
        "Range qualification standards apply",
        "No refunds",
      ],
    },
    {
      id: "16hour",
      title: "16-Hour CCL Course",
      price: 225,
      duration: "16 hr",
      description:
        "Full concealed carry license training course for students who need complete instruction.",
      audience: "Best for first-time students needing full CCL training.",
      included: [
        "16-hour class instruction",
        "Hands-on training",
        "Certificate upon completion when requirements are met",
      ],
      requirements: [
        "Completed paperwork in black ink",
        "State ID or driver's license",
        "FOID card",
      ],
      pricingNotes: [
        "Deposit is one-third of class price",
        "Range fee may apply separately",
        "No refunds",
      ],
    },
  ];

  const classPhotos = [
    {
      src: "/ips-class-1.jpeg",
      alt: "Students reviewing target results during concealed carry training",
    },
    {
      src: "/ips-class-2.jpeg",
      alt: "Student holding training target after class session",
    },
    {
      src: "/ips-class-3.jpeg",
      alt: "Student and instructor after successful class completion",
    },
    {
      src: "/ips-class-4.jpeg",
      alt: "Student practicing firearm stance at the range",
    },
    {
      src: "/ips-class-5.jpeg",
      alt: "Instructor guiding student during range training",
    },
    {
      src: "/ips-class-6.jpeg",
      alt: "Instructor demonstrating range training",
    },
  ];

  const testimonials = [
    {
      name: "Jessica R.",
      text: "Very professional and informative. I came in nervous and left confident and prepared.",
    },
    {
      name: "Marcus T.",
      text: "Hands-on training was excellent. Instructor made everything easy to understand.",
    },
    {
      name: "Danielle S.",
      text: "Great class for beginners. I feel much safer and more knowledgeable now.",
    },
  ];

  const faqs = [
    {
      q: "What paperwork should I complete before class?",
      a: "Students should complete the packet neatly in black ink and provide required identification and firearms document copies.",
    },
    {
      q: "What should I bring?",
      a: "Bring your state ID or driver’s license, FOID card, renewal documents if applicable, and completed paperwork in black ink.",
    },
    {
      q: "What happens if I miss class or range?",
      a: "There is a $55 makeup fee for missed class or range and no refunds.",
    },
    {
      q: "What score do I need to pass shooting qualification?",
      a: "Students must pass with at least 60 percent, which is at least 30 hits out of 50 rounds.",
    },
  ];

  useEffect(() => {
    let isMounted = true;

    async function loadConfig() {
      try {
        const response = await fetch(`${API_BASE}/api/config`);
        const text = await response.text();

        let data;
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(`Config did not return JSON. Response was: ${text}`);
        }

        if (isMounted) {
          setPublishableKey(data.publishableKey || "");
        }
      } catch (error) {
        console.error("Failed to load Stripe config:", error);
      }
    }

    loadConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  function navigateTo(nextPage) {
    setPageHistory((prev) => [...prev, nextPage]);
    setPage(nextPage);
  }

  function goBack() {
    if (page === "booking" && bookingStep > 1) {
      setBookingStep((prev) => prev - 1);
      return;
    }

    setPageHistory((prev) => {
      if (prev.length <= 1) return prev;
      const updated = prev.slice(0, -1);
      setPage(updated[updated.length - 1]);
      return updated;
    });
  }

  function getSelectedService() {
    return classServices.find((service) => service.id === selectedService);
  }

  function getSelectedPrice() {
    return getSelectedService()?.price || 0;
  }

  function getSelectedDeposit() {
    const selected = getSelectedService();
    if (!selected) return 0;
    return Math.round((selected.price / 3) * 100) / 100;
  }

  function formatPrice(amount) {
    return `$${amount.toFixed(2)}`;
  }

  function formatSelectedDate() {
    if (!selectedDate) return "No date selected";
    const found = availableDates.find((d) => d.value === selectedDate);
    return found ? found.label : selectedDate;
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

    setLoadingPaymentIntent(true);
    setPaymentLoadError("");
    setClientSecret("");
    setPaymentMode(mode);

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
          customerPhone: formData.phone,
          bookingDate: selectedDate,
          bookingTime: selectedTime,
        }),
      });

      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Backend did not return JSON. Response was: ${text}`);
      }

      if (!response.ok) {
        throw new Error(data.error || "Unable to create payment intent.");
      }

      setClientSecret(data.clientSecret);
      setPaymentIntentId(data.paymentIntentId);
    } catch (error) {
      console.error("createPaymentIntent error:", error);
      setPaymentLoadError(error.message || "Unable to load checkout.");
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
    setPageHistory(["home"]);
    setPage("home");
  }

  function handleFormSubmit() {
    if (!formData.name || !formData.email || !formData.phone || !formData.type) {
      alert("Please fill out your name, phone, email, and training type.");
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

  const navButtonClass =
    "rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-white tracking-[0.14em] hover:border-[#4169e1]/50 hover:bg-[#4169e1]/10 hover:text-[#8ea6ff] transition";

  const cardClass =
    "relative overflow-hidden rounded-[2rem] border border-[#d9dee8] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)]";

  function ScanLine() {
    return (
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-[linear-gradient(90deg,transparent_0%,rgba(65,105,225,0.65)_50%,transparent_100%)]" />
    );
  }

  function BackButton() {
    return (
      <button
        type="button"
        onClick={goBack}
        className="mb-6 rounded-full border border-[#d9dee8] bg-white px-4 py-2 text-sm font-bold uppercase tracking-[0.14em] text-[#111111] hover:bg-[#f8fbff]"
      >
        ← Go Back
      </button>
    );
  }

  function NavBar() {
    return (
      <div className="sticky top-0 z-50 border-b border-white/10 bg-black shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-[linear-gradient(90deg,transparent_0%,rgba(65,105,225,0.65)_50%,transparent_100%)]" />
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
              className="rounded-full border border-[#4169e1]/40 bg-[#4169e1] px-4 py-2 text-white hover:bg-[#3558c9] transition"
            >
              Contact
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 px-4 pb-3 md:hidden">
          <button type="button" onClick={() => navigateTo("home")} className={navButtonClass}>
            Home
          </button>
          <button type="button" onClick={() => navigateTo("about")} className={navButtonClass}>
            About
          </button>
          <button type="button" onClick={() => navigateTo("classes")} className={navButtonClass}>
            Classes
          </button>
          <button type="button" onClick={() => navigateTo("booking")} className={navButtonClass}>
            Book
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
    );
  }

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
      <div className="min-h-screen bg-[linear-gradient(180deg,#fffdfd_0%,#f7f9ff_38%,#fffaf8_100%)] text-[#111111] pb-24 md:pb-0">
        <NavBar />
        <AiHelperChat />

        <section className="mx-auto max-w-6xl px-6 py-16 md:px-10">
          <BackButton />

          <div className="max-w-4xl">
            <div className="inline-flex rounded-full border border-[#4169e1]/20 bg-[#f5f8ff] px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-[#4169e1]">
              About Us
            </div>

            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.06em] sm:text-5xl">
              Premier Firearms Academy in Illinois
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#4b5563]">
              Illinois Protective Services focuses on training responsible
              citizens to better protect themselves and their loved ones through
              structured firearms education, USCCA-based training principles,
              disciplined range expectations, and a supportive learning
              environment.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "USCCA-inspired training approach",
              "Supportive learning environment",
              "Clear qualification guidance",
              "Professional instruction standards",
            ].map((item) => (
              <div key={item} className={cardClass}>
                <ScanLine />
                <div className="text-[#111111]">{item}</div>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <div className="inline-flex rounded-full border border-[#4169e1]/20 bg-[#f5f8ff] px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-[#4169e1]">
              Meet The Instructors
            </div>

            <h2 className="mt-4 text-3xl font-black uppercase">
              Professional Leadership & Real Training Experience
            </h2>

            <div className="mt-10 grid gap-8 md:grid-cols-2">
              <InstructorCard
                imageSrc="/instructor-michael.jpeg"
                imageAlt="Michael Wrotten-Simes instructor portrait"
                name="Michael Wrotten-Simes"
                title="CEO & Lead Instructor"
                imagePosition="center 12%"
                bio1="Michael Wrotten-Simes is the CEO and lead instructor of Illinois Protective Services, bringing a disciplined and professional approach to firearms training. His focus is on building responsible gun owners through structured instruction, safety-first standards, and practical defensive training."
                bio2="Known for clear communication and hands-on guidance, Michael works to ensure students leave with confidence, knowledge, and a stronger understanding of firearm responsibility, personal protection, and Illinois training expectations."
              />

              <InstructorCard
                imageSrc="/instructor-ron.jpeg"
                imageAlt="Ron Austin instructor portrait"
                name="Ron Austin"
                title="Firearms Instructor"
                imagePosition="center 10%"
                bio1="Ron Austin is a dedicated firearms instructor with a strong emphasis on precision, safety, and practical range performance. His calm, professional teaching style helps students build proper technique, awareness, and confidence under instruction."
                bio2="Ron focuses on making training approachable while maintaining high standards, ensuring students understand not only how to handle a firearm correctly, but how to do so responsibly and with the discipline required for real-world preparedness."
              />
            </div>
          </div>

          <div className="mt-14 rounded-[2rem] border border-[#4169e1]/20 bg-[#f5f8ff] p-8 text-center shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
            <h3 className="text-2xl font-black uppercase">
              Our Commitment to You
            </h3>

            <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-[#374151]">
              At Illinois Protective Services, we are committed to training
              responsible, confident, and prepared individuals. Our mission is
              to provide clear, professional instruction in a safe and
              structured environment where every student is treated with
              respect.
            </p>

            <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-[#374151]">
              We do not just teach firearm use—we teach accountability,
              awareness, and discipline. Our goal is to ensure every student
              leaves not only certified, but fully prepared to protect
              themselves and their loved ones responsibly.
            </p>
          </div>

          <div className="mt-14">
            <div className="inline-flex rounded-full border border-[#4169e1]/20 bg-[#f5f8ff] px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-[#4169e1]">
              Training In Action
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {classPhotos.map((photo, index) => (
                <div
                  key={index}
                  className="group overflow-hidden rounded-[1.75rem] border border-[#d9dee8] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="h-[320px] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <MobileStickyBookButton onClick={() => navigateTo("booking")} />
      </div>
    );
  }

  if (page === "classes") {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#fffdfd_0%,#f7f9ff_38%,#fffaf8_100%)] text-[#111111] pb-24 md:pb-0">
        <NavBar />
        <AiHelperChat />

        <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <BackButton />

          <div className="max-w-4xl">
            <div className="inline-flex rounded-full border border-[#b42318]/20 bg-[#fff3f4] px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-[#b42318]">
              Class Services
            </div>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.06em] sm:text-5xl">
              Choose the Right Training Path
            </h1>
            <p className="mt-4 text-lg leading-8 text-[#4b5563]">
              Review cleaner class details with included items, requirements,
              and pricing before booking.
            </p>
          </div>

          <div className="mt-10 grid gap-6">
            {classServices.map((service) => (
              <ExpandableClassCard
                key={service.id}
                service={service}
                isSelected={selectedService === service.id}
                onSelect={() => {
                  setSelectedService(service.id);
                  setBookingStep(1);
                  navigateTo("booking");
                }}
                onAsk={() => {
                  setSelectedService(service.id);
                  setFormData((prev) => ({
                    ...prev,
                    type: service.title,
                  }));
                  navigateTo("contact");
                }}
                formatPrice={formatPrice}
              />
            ))}
          </div>
        </section>

        <MobileStickyBookButton onClick={() => navigateTo("booking")} />
      </div>
    );
  }

  if (page === "booking") {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#fffdfd_0%,#f7f9ff_38%,#fffaf8_100%)] text-[#111111] pb-24 md:pb-0">
        <NavBar />
        <AiHelperChat />

        <section className="mx-auto max-w-6xl px-6 py-16 md:px-10">
          <BackButton />

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
              { step: 1, label: "Step 1", text: "Choose Class" },
              { step: 2, label: "Step 2", text: "Choose Date & Time" },
              { step: 3, label: "Step 3", text: "Review & Pay" },
            ].map((item) => (
              <div
                key={item.step}
                className={`relative overflow-hidden rounded-2xl border px-5 py-4 ${
                  bookingStep === item.step
                    ? "border-[#4169e1] bg-[#f5f8ff] text-[#111111]"
                    : "border-[#d9dee8] bg-white text-[#6b7280]"
                }`}
              >
                {bookingStep === item.step ? <ScanLine /> : null}
                <div className="text-sm font-black uppercase tracking-[0.18em]">
                  {item.label}
                </div>
                <div className="mt-1 text-lg font-bold">{item.text}</div>
              </div>
            ))}
          </div>

          {bookingStep === 1 && (
            <div className="mt-10 grid gap-6">
              <div className={cardClass}>
                <ScanLine />
                <h2 className="text-2xl font-black uppercase">Choose a Class</h2>

                <div className="mt-6 grid gap-3">
                  {classServices.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setSelectedService(service.id)}
                      className={`rounded-2xl border px-4 py-4 text-left transition ${
                        selectedService === service.id
                          ? "border-[#4169e1] bg-[#f5f8ff] text-[#111111]"
                          : "border-[#d9dee8] bg-white text-[#111111] hover:bg-[#f8fbff]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="text-base font-black uppercase">
                            {service.title}
                          </div>
                          <div className="mt-1 text-sm text-[#6b7280]">
                            {service.duration}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-base font-black">
                            {formatPrice(service.price)}
                          </div>
                          <div className="text-xs text-[#6b7280]">
                            Deposit{" "}
                            {formatPrice(Math.round((service.price / 3) * 100) / 100)}
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
            </div>
          )}

          {bookingStep === 2 && (
            <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                {getSelectedService() && (
                  <div className="mb-8 relative overflow-hidden rounded-2xl border border-[#4169e1]/20 bg-[#f5f8ff] p-5 text-[#111111] shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                    <ScanLine />
                    <div className="text-sm font-bold uppercase tracking-[0.2em] text-[#4169e1]">
                      Selected Class
                    </div>
                    <div className="mt-2 text-lg font-black">
                      {getSelectedService().title}
                    </div>
                    <div className="mt-1 text-[#6b7280]">
                      {getSelectedService().duration} •{" "}
                      {formatPrice(getSelectedService().price)}
                    </div>
                  </div>
                )}

                <div className={cardClass}>
                  <ScanLine />
                  <h2 className="text-xl font-black uppercase">Available Dates</h2>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {availableDates.map((date) => (
                      <button
                        key={date.value}
                        type="button"
                        onClick={() => {
                          if (!date.disabled) setSelectedDate(date.value);
                        }}
                        disabled={date.disabled}
                        className={`rounded-2xl border px-4 py-4 text-left text-sm font-black uppercase tracking-[0.12em] transition ${
                          date.disabled
                            ? "cursor-not-allowed border-[#e5e7eb] bg-[#f9fafb] text-[#9ca3af] line-through"
                            : selectedDate === date.value
                            ? "border-[#4169e1] bg-[#f5f8ff] text-[#111111]"
                            : "border-[#d9dee8] bg-white text-[#111111] hover:bg-[#f8fbff]"
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

                <div className="mt-8 relative overflow-hidden rounded-[2rem] border border-[#d9dee8] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-[linear-gradient(90deg,transparent_0%,rgba(65,105,225,0.7)_35%,rgba(220,38,38,0.55)_65%,transparent_100%)]" />
                  <h2 className="text-xl font-black uppercase text-[#4169e1]">
                    Available Time Frames
                  </h2>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {availableTimes.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`rounded-2xl border px-4 py-4 text-center text-sm font-black uppercase tracking-[0.12em] transition ${
                          selectedTime === slot
                            ? "border-[#4169e1] bg-[#4169e1] text-white"
                            : "border-[#d9dee8] bg-white text-[#4169e1] hover:bg-[#f5f8ff]"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className={cardClass}>
                <ScanLine />
                <div className="inline-flex rounded-full border border-[#4169e1]/20 bg-[#f5f8ff] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#4169e1]">
                  Step 2 Summary
                </div>
                <h2 className="mt-4 text-2xl font-black uppercase">Review Availability</h2>

                <div className="mt-6 space-y-4 text-[#374151]">
                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-[#6b7280]">
                      Class
                    </div>
                    <div className="mt-1 text-lg font-bold">
                      {getSelectedService()?.title || "No class selected"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-[#6b7280]">
                      Full Price
                    </div>
                    <div className="mt-1 text-lg font-bold">
                      {formatPrice(getSelectedPrice())}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-[#6b7280]">
                      Deposit
                    </div>
                    <div className="mt-1 text-lg font-bold">
                      {formatPrice(getSelectedDeposit())}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-[#6b7280]">
                      Date
                    </div>
                    <div className="mt-1 text-lg font-bold">
                      {selectedDate ? formatSelectedDate() : "No date selected"}
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
                    className="mt-4 w-full rounded-2xl border border-[#4169e1]/40 bg-[#4169e1] px-6 py-4 text-center text-base font-black uppercase tracking-[0.16em] text-white hover:bg-[#3558c9]"
                  >
                    Continue to Step 3
                  </button>
                </div>
              </div>
            </div>
          )}

          {bookingStep === 3 && (
            <div className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <div className={cardClass}>
                <ScanLine />
                <div className="inline-flex rounded-full border border-[#4169e1]/20 bg-[#f5f8ff] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#4169e1]">
                  Step 3
                </div>
                <h2 className="mt-4 text-2xl font-black uppercase">Review & Pay</h2>

                <div className="mt-6 space-y-4 text-[#374151]">
                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-[#6b7280]">
                      Class
                    </div>
                    <div className="mt-1 text-lg font-bold">
                      {getSelectedService()?.title || "No class selected"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-[#6b7280]">
                      Full Price
                    </div>
                    <div className="mt-1 text-lg font-bold">
                      {formatPrice(getSelectedPrice())}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-[#6b7280]">
                      Deposit
                    </div>
                    <div className="mt-1 text-lg font-bold">
                      {formatPrice(getSelectedDeposit())}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-[#6b7280]">
                      Date
                    </div>
                    <div className="mt-1 text-lg font-bold">{formatSelectedDate()}</div>
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
                    No refunds. Rescheduling requests made with less than 24
                    hours’ notice will result in forfeiture of class credit and
                    require another class payment or deposit.
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-[#6b7280]">
                      Payment Type
                    </div>
                    <div className="mt-3 grid gap-3">
                      <button
                        type="button"
                        onClick={() => createPaymentIntent("deposit")}
                        className={`rounded-2xl border px-4 py-4 text-left font-black uppercase tracking-[0.14em] transition ${
                          paymentMode === "deposit"
                            ? "border-[#4169e1] bg-[#f5f8ff] text-[#111111]"
                            : "border-[#d9dee8] bg-white text-[#111111] hover:bg-[#f8fbff]"
                        }`}
                      >
                        Pay Deposit — {formatPrice(getSelectedDeposit())}
                      </button>

                      <button
                        type="button"
                        onClick={() => createPaymentIntent("full")}
                        className={`rounded-2xl border px-4 py-4 text-left font-black uppercase tracking-[0.14em] transition ${
                          paymentMode === "full"
                            ? "border-[#4169e1] bg-[#f5f8ff] text-[#111111]"
                            : "border-[#d9dee8] bg-white text-[#111111] hover:bg-[#f8fbff]"
                        }`}
                      >
                        Pay Full Amount — {formatPrice(getSelectedPrice())}
                      </button>
                    </div>
                  </div>

                  {paymentCompleted ? (
                    <div className="rounded-2xl border border-[#4169e1]/20 bg-[#f5f8ff] p-4 text-sm text-[#3558c9]">
                      Payment completed successfully.
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={confirmBooking}
                    className="mt-4 w-full rounded-2xl border border-[#4169e1]/40 bg-[#4169e1] px-6 py-4 text-center text-base font-black uppercase tracking-[0.16em] text-white hover:bg-[#3558c9]"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>

              <div className={cardClass}>
                <ScanLine />
                <h2 className="text-2xl font-black uppercase">Secure Payment</h2>

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
          )}
        </section>
      </div>
    );
  }

  if (page === "contact") {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#fffdfd_0%,#f7f9ff_38%,#fffaf8_100%)] text-[#111111] pb-24 md:pb-0">
        <NavBar />
        <AiHelperChat />

        <section className="mx-auto max-w-5xl px-6 py-16 md:px-10">
          <BackButton />

          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-[#4169e1]/20 bg-[#f5f8ff] px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-[#4169e1]">
              Contact
            </div>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.06em] sm:text-5xl">
              Reach Out to Our Team
            </h1>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
            <div className={cardClass}>
              <ScanLine />
              <h2 className="text-2xl font-black uppercase">Contact Details</h2>
              <div className="mt-6 space-y-4 text-lg text-[#374151]">
                <p>
                  <span className="font-bold text-[#111111]">Phone:</span> (224)
                  248-7021
                </p>
                <p className="break-all">
                  <span className="font-bold text-[#111111]">Email:</span>{" "}
                  support@illinoisprotectiveservices.com
                </p>
                <p>
                  <span className="font-bold text-[#111111]">Address:</span> 7601 S.
                  Cicero Ave, Chicago, IL 60652
                </p>
              </div>
            </div>

            <div className={cardClass}>
              <ScanLine />
              <h2 className="text-2xl font-black uppercase">Send a Message</h2>
              <div className="mt-6 grid gap-4">
                <input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="rounded-2xl border border-[#d9dee8] bg-white px-5 py-4 text-[#111111] placeholder:text-[#6b7280] outline-none"
                  placeholder="Full Name"
                />
                <input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="rounded-2xl border border-[#d9dee8] bg-white px-5 py-4 text-[#111111] placeholder:text-[#6b7280] outline-none"
                  placeholder="Phone Number"
                />
                <input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="rounded-2xl border border-[#d9dee8] bg-white px-5 py-4 text-[#111111] placeholder:text-[#6b7280] outline-none"
                  placeholder="Email Address"
                />
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="rounded-2xl border border-[#d9dee8] bg-white px-5 py-4 text-[#111111] outline-none"
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
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="min-h-[140px] rounded-2xl border border-[#d9dee8] bg-white px-5 py-4 text-[#111111] placeholder:text-[#6b7280] outline-none"
                  placeholder="Questions about paperwork, eligibility, scheduling, or training"
                />
                <button
                  type="button"
                  onClick={handleFormSubmit}
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

        <MobileStickyBookButton onClick={() => navigateTo("booking")} />
      </div>
    );
  }

  const whyChooseUs = [
    {
      icon: "🛡️",
      title: "Safety-First Instruction",
      text: "Every class is built around responsible handling, clear guidance, and real defensive awareness.",
    },
    {
      icon: "📘",
      title: "Clear Illinois Guidance",
      text: "We help students understand requirements, qualification standards, and what to expect before class day.",
    },
    {
      icon: "🎯",
      title: "Practical Range Support",
      text: "Hands-on training and qualification support designed to build confidence, control, and consistency.",
    },
  ];

  const trustBadges = [
    "Professional Instruction",
    "Structured Booking",
    "Weekday Availability",
    "Certificate Guidance",
    "Supportive Environment",
  ];

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffdfd_0%,#f7f9ff_38%,#fffaf8_100%)] text-[#111111] pb-24 md:pb-0">
      <NavBar />
      <AiHelperChat />

      <section className="relative overflow-hidden border-b border-[#e5e7eb] bg-[linear-gradient(135deg,#fff1f1_0%,#ffffff_22%,#eef4ff_48%,#ffffff_70%,#fff4f4_100%)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.24),transparent_28%),radial-gradient(circle_at_top_right,rgba(65,105,225,0.22),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(220,38,38,0.10),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(65,105,225,0.12),transparent_28%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_9px,rgba(88,130,255,0.03)_10px)]" />

        <img
          src="/hero-flag-corner.png"
          alt="American flag decorative corner"
          className="pointer-events-none absolute left-0 top-0 z-10 w-[300px] max-w-[55vw] object-contain opacity-95 md:w-[420px]"
        />

        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="absolute right-16 top-10 text-2xl text-blue-500 opacity-20">
            ★
          </div>
          <div className="absolute right-32 top-20 text-lg text-blue-400 opacity-15">
            ★
          </div>
          <div className="absolute right-10 top-32 text-xl text-blue-600 opacity-10">
            ★
          </div>

          <div className="absolute bottom-16 left-12 text-xl text-red-500 opacity-20">
            ★
          </div>
          <div className="absolute bottom-28 left-24 text-lg text-red-400 opacity-15">
            ★
          </div>
          <div className="absolute bottom-10 left-32 text-2xl text-red-600 opacity-10">
            ★
          </div>
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

      <section className="border-b border-[#0f172a]/10 bg-[#0b1630] text-white">
        <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="text-sm font-black uppercase tracking-[0.24em] text-[#8ea6ff]">
                Trusted. Structured. Professional.
              </div>
              <h2 className="mt-3 text-3xl font-black uppercase sm:text-4xl">
                Train With Confidence From Day One
              </h2>
              <p className="mt-4 max-w-3xl leading-8 text-white/80">
                We help students move from interest to preparation with a cleaner
                process, practical instruction, and supportive guidance that
                keeps everything clear from booking through qualification.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {[
                "Beginner Friendly",
                "Professional Standards",
                "Structured Process",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-white/90"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#4169e1]">
            Trust Signals
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase sm:text-4xl">
            Built To Feel Clear, Credible, And Professional
          </h2>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {trustBadges.map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 rounded-full border border-[#d9dee8] bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#374151] shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
            >
              <span className="text-xs text-blue-500">★</span>
              {item}
              <span className="text-xs text-red-500">★</span>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-[#e5e7eb] bg-[linear-gradient(180deg,#fbfcfe_0%,#f7f9ff_100%)]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#4169e1]">
              Why Choose Us
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase sm:text-4xl">
              A Better Training Experience
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {whyChooseUs.map((item) => (
              <div key={item.title} className={cardClass}>
                <ScanLine />
                <div className="flex items-center gap-2 text-3xl">
                  <span className="text-blue-500">★</span>
                  <span>{item.icon}</span>
                  <span className="text-red-500">★</span>
                </div>
                <h3 className="mt-5 text-2xl font-black uppercase">
                  {item.title}
                </h3>
                <p className="mt-3 leading-7 text-[#4b5563]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#4169e1]">
            Who This Is For
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase sm:text-4xl">
            Training Paths for Different Students
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-4">
          {[
            "First-Time Students",
            "Renewal Students",
            "Veterans",
            "Students Needing Guidance",
          ].map((item) => (
            <div key={item} className={cardClass}>
              <ScanLine />
              <div className="text-2xl text-[#4169e1]">★</div>
              <h3 className="mt-4 text-xl font-black uppercase">{item}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-[#e5e7eb] bg-[linear-gradient(180deg,#fbfcfe_0%,#f7f9ff_100%)]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#4169e1]">
              Why Train With Us
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase sm:text-4xl">
              A Clearer Path to Preparedness
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Train With Confidence",
                text: "Professional instruction focused on safety, discipline, and clear range expectations.",
              },
              {
                title: "Understand Illinois Requirements",
                text: "Guidance on paperwork, qualification standards, and the importance of staying current on state law.",
              },
              {
                title: "Protect Home & Family",
                text: "Training designed to help responsible adults build confidence, readiness, and situational awareness.",
              },
            ].map((item) => (
              <div key={item.title} className={cardClass}>
                <ScanLine />
                <div className="text-2xl text-[#4169e1]">★</div>
                <h3 className="mt-4 text-2xl font-black uppercase">
                  {item.title}
                </h3>
                <p className="mt-3 leading-7 text-[#4b5563]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className={cardClass}>
            <ScanLine />
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#4169e1]">
              What To Bring
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase sm:text-4xl">
              Be Ready Before Class
            </h2>
            <ul className="mt-6 space-y-3 text-[#4b5563]">
              <li>• State ID or Driver’s License</li>
              <li>• FOID card</li>
              <li>• CCL for renewals</li>
              <li>• Completed paperwork in black ink</li>
              <li>• DD-214 if claiming veteran credit</li>
            </ul>
          </div>

          <div className={cardClass}>
            <ScanLine />
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#4169e1]">
              Booking Hours
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase sm:text-4xl">
              Weekday Scheduling
            </h2>
            <p className="mt-6 leading-8 text-[#4b5563]">
              Booking is currently scheduled Monday through Friday from 9:00 AM
              to 5:00 PM. Weekend dates are marked unavailable.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#4169e1]">
            How It Works
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase sm:text-4xl">
            Book in Three Simple Steps
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            {
              step: "1",
              title: "Choose Class",
              text: "Select the class that fits your training needs and review the deposit amount.",
            },
            {
              step: "2",
              title: "Pick Date & Time",
              text: "Choose an available weekday date and training time.",
            },
            {
              step: "3",
              title: "Review & Pay",
              text: "Review your booking details, choose deposit or full payment, and confirm.",
            },
          ].map((item) => (
            <div key={item.step} className={cardClass}>
              <ScanLine />
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4169e1] text-xl font-black text-white">
                {item.step}
              </div>
              <h3 className="mt-5 text-2xl font-black uppercase">
                {item.title}
              </h3>
              <p className="mt-3 leading-7 text-[#4b5563]">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#e85b66]/20 bg-[#fff3f4] p-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-[linear-gradient(90deg,transparent_0%,rgba(232,91,102,0.7)_50%,transparent_100%)]" />
          <div className="inline-flex rounded-full border border-[#e85b66]/25 bg-[#e85b66] px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-white">
            Refund & Rescheduling Policy
          </div>

          <div className="mt-6 space-y-5 leading-8 text-[#4b5563]">
            <p>
              We understand that unexpected situations may arise. If you are
              unable to attend your scheduled class, please notify the
              instructor at least{" "}
              <span className="font-bold text-[#111111]">
                24 hours in advance
              </span>{" "}
              to retain full credit toward a future class date.
            </p>

            <p>
              Rescheduling requests made with{" "}
              <span className="font-bold text-[#111111]">
                less than 24 hours’ notice
              </span>{" "}
              will result in the forfeiture of your class credit. In these
              cases, a new payment and deposit will be required to secure a spot
              in a future class.
            </p>

            <p>Missed class or range can also trigger a $55 makeup fee.</p>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e5e7eb] bg-[linear-gradient(180deg,#fbfcfe_0%,#f7f9ff_100%)]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#4169e1]">
              Testimonials
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase sm:text-4xl">
              What Students Say
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className={cardClass}>
                <ScanLine />
                <div className="mb-3 text-[#4169e1]">★★★★★</div>
                <p className="text-lg leading-7 text-[#4b5563]">“{t.text}”</p>
                <div className="mt-4 text-sm font-bold uppercase tracking-[0.14em] text-[#4169e1]">
                  — {t.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className={cardClass}>
            <ScanLine />
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#4169e1]">
              Contact
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase sm:text-4xl">
              Need Help Before Booking?
            </h2>
            <div className="mt-6 space-y-4 text-lg text-[#374151]">
              <p>
                <span className="font-bold text-[#111111]">Phone:</span> (224)
                248-7021
              </p>
              <p className="break-all">
                <span className="font-bold text-[#111111]">Email:</span>{" "}
                support@illinoisprotectiveservices.com
              </p>
              <p>
                <span className="font-bold text-[#111111]">Address:</span> 7601
                S. Cicero Ave, Chicago, IL 60652
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigateTo("contact")}
              className="mt-8 rounded-xl border border-[#4169e1]/40 bg-[#4169e1] px-6 py-4 font-black uppercase tracking-[0.14em] text-white hover:bg-[#3558c9]"
            >
              Contact Us
            </button>
          </div>

          <div className={cardClass}>
            <ScanLine />
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#4169e1]">
              FAQ
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase sm:text-4xl">
              Common Questions
            </h2>
            <div className="mt-6 space-y-5">
              {faqs.map((faq) => (
                <div key={faq.q}>
                  <h3 className="text-lg font-black">{faq.q}</h3>
                  <p className="mt-2 leading-7 text-[#4b5563]">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black text-white">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-3">
                <img
                  src={LOGO_SRC}
                  alt="Illinois Protective Services logo"
                  className="h-12 w-12 rounded-xl border border-white/10 bg-white object-cover p-1"
                />
                <div>
                  <div className="text-sm font-black uppercase tracking-[0.2em]">
                    Illinois Protective
                  </div>
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#8ea6ff]">
                    Services
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm font-black uppercase tracking-[0.18em] text-[#8ea6ff]">
                Contact
              </div>
              <div className="mt-3 space-y-2 text-white/75">
                <div>(224) 248-7021</div>
                <div>support@illinoisprotectiveservices.com</div>
                <div>7601 S. Cicero Ave, Chicago, IL 60652</div>
              </div>
            </div>

            <div>
              <div className="text-sm font-black uppercase tracking-[0.18em] text-[#8ea6ff]">
                Hours
              </div>
              <div className="mt-3 space-y-2 text-white/75">
                <div>Monday–Friday</div>
                <div>9:00 AM–5:00 PM</div>
              </div>
            </div>

            <div>
              <div className="text-sm font-black uppercase tracking-[0.18em] text-[#8ea6ff]">
                Quick Links
              </div>
              <div className="mt-3 space-y-2 text-white/75">
                <button onClick={() => navigateTo("classes")}>Classes</button>
                <br />
                <button onClick={() => navigateTo("booking")}>Book Now</button>
                <br />
                <button onClick={() => navigateTo("contact")}>Contact</button>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6 text-sm text-white/60">
            <div>© 2026 Illinois Protective Services. All rights reserved.</div>
            <div className="mt-2">
              Students are responsible for staying current with Illinois law and
              prohibited-area restrictions.
            </div>
          </div>
        </div>
      </footer>

      <MobileStickyBookButton onClick={() => navigateTo("booking")} />
    </div>
  );
}