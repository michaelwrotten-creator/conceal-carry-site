import { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

function AiHelperChat() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Welcome to Illinois Protective Services. I can help with class options, pricing, deposits, booking, payment, refunds, and general concealed carry training questions.",
    },
  ]);

  const knowledge = {
    services: [
      "Mini Class — $50",
      "3-Hour Renewal Course — $75",
      "8-Hours Class Veteran — $100",
      "16-Hour CCL Course — $225",
    ],
    deposits: [
      "Mini Class deposit — $25",
      "All other class deposits — $75",
    ],
    hours: "Monday through Friday from 9:00 AM to 5:00 PM.",
    phone: "(224) 248-7021",
    email: "info@illinoisprotectiveservices.com",
    refundPolicy:
      "If you are unable to attend your scheduled class, notify the instructor at least 24 hours in advance to retain full credit toward a future class date. Rescheduling requests made with less than 48 hours’ notice will result in forfeiture of class credit and require a new payment and deposit.",
    bringItems:
      "Students should bring required identification and follow all instructor guidance. Final class details should be confirmed directly before class.",
  };

  function getBroadResponse(message) {
    const lower = message.toLowerCase();
    const mentions = (...terms) => terms.some((term) => lower.includes(term));

    if (mentions("class", "service", "services", "options")) {
      return `Available services: ${knowledge.services.join("; ")}.`;
    }

    if (mentions("deposit", "price", "cost", "payment")) {
      return `Pricing: ${knowledge.services.join("; ")}. Deposits: ${knowledge.deposits.join("; ")}.`;
    }

    if (mentions("book", "booking", "schedule")) {
      return "Booking is completed in three steps: choose a service, choose date and time, then review, pay, and confirm.";
    }

    if (mentions("refund", "reschedule", "policy")) {
      return knowledge.refundPolicy;
    }

    if (mentions("bring", "what should i bring")) {
      return knowledge.bringItems;
    }

    if (mentions("hours", "time")) {
      return `Booking hours are ${knowledge.hours}`;
    }

    if (mentions("contact", "phone", "email", "call")) {
      return `You can contact Illinois Protective Services at ${knowledge.phone} or ${knowledge.email}.`;
    }

    return "I can help with services, deposits, booking steps, payment, refund policy, class hours, and contact information.";
  }

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: trimmed },
      { role: "assistant", text: getBroadResponse(trimmed) },
    ]);
    setInput("");
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {open && (
        <div className="mb-4 w-[380px] overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,#050505_0%,#0b1016_100%)] shadow-[0_25px_70px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between border-b border-red-500/20 bg-[linear-gradient(90deg,#7f1d1d_0%,#0f172a_100%)] px-5 py-4 text-white">
            <div>
              <div className="text-sm font-black uppercase tracking-[0.22em]">
                AI Navigator
              </div>
              <div className="text-xs font-semibold text-white/80">
                Concealed carry training assistant
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMinimized((prev) => !prev)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white hover:bg-white/10"
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
              >
                ✕
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              <div className="h-[360px] space-y-3 overflow-y-auto p-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`max-w-[85%] rounded-2xl border px-4 py-3 text-sm leading-6 ${
                      msg.role === "assistant"
                        ? "border-white/10 bg-white/10 text-white"
                        : "ml-auto border-red-500/20 bg-red-600 text-white"
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 p-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSend();
                    }}
                    placeholder="Ask about classes, deposits, booking..."
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    className="rounded-xl bg-red-600 px-4 py-3 text-sm font-black uppercase text-white hover:bg-red-700"
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
        className="flex h-16 w-16 items-center justify-center rounded-full border border-red-500/40 bg-red-600 text-lg font-black uppercase text-white shadow-[0_0_30px_rgba(220,38,38,0.28)] transition hover:scale-105 hover:bg-red-700"
      >
        AI
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
          className="rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/40"
          required
        />
        <input
          type="email"
          value={billingEmail}
          onChange={(e) => setBillingEmail(e.target.value)}
          placeholder="Email for Receipt"
          className="rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/40"
          required
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
        <PaymentElement />
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-600/10 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={!stripe || status === "processing"}
        className="w-full rounded-2xl border border-red-500/40 bg-red-600 px-6 py-4 text-base font-black uppercase tracking-[0.16em] text-white shadow-[0_0_24px_rgba(220,38,38,0.18)] transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
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
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-white/70">
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
          theme: "night",
          variables: {
            colorPrimary: "#dc2626",
            colorBackground: "#0b1016",
            colorText: "#ffffff",
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

export default function ConcealCarryTrainingWebsite() {
  const API_BASE = "https://conceal-carry-backend.onrender.com";
  const LOGO_SRC = "/ips-logo.png";

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

  const availableDates = [
    { value: "2026-04-14", label: "Monday, April 14", disabled: false },
    { value: "2026-04-15", label: "Tuesday, April 15", disabled: false },
    { value: "2026-04-16", label: "Wednesday, April 16", disabled: false },
    { value: "2026-04-17", label: "Thursday, April 17", disabled: false },
    { value: "2026-04-18", label: "Friday, April 18", disabled: false },
    { value: "2026-04-19", label: "Saturday, April 19", disabled: true },
    { value: "2026-04-20", label: "Sunday, April 20", disabled: true },
    { value: "2026-04-21", label: "Monday, April 21", disabled: false },
    { value: "2026-04-22", label: "Tuesday, April 22", disabled: false },
    { value: "2026-04-23", label: "Wednesday, April 23", disabled: false },
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
      deposit: 25,
      duration: "1 hr 30 min",
      description:
        "Quick training session designed for basic instruction, refreshers, and introductory firearm safety.",
      details: [
        "Mini Class instruction included",
        "Range fee not included but required: $35.00",
        "Ammunition not included but required: $35.00",
        "Eye & Ear protection not included but required: $7.00",
        "Target not included but required: $2.00",
      ],
    },
    {
      id: "3hour",
      title: "3-Hour Renewal Course",
      price: 75,
      deposit: 75,
      duration: "3 hr",
      description:
        "Renewal training for qualified students who need a 3-hour concealed carry renewal course.",
      details: [
        "3-hour Renewal Course included",
        "Range fee not included but required: $35.00",
        "Ammunition not included but required: $35.00",
        "Eye & Ear protection not included but required: $7.00",
        "Target not included but required: $2.00",
        "Scenario Simulations may be required depending on student needs",
        "Concealed Carry & Home Defense Fundamentals Book may be needed if required and in stock",
      ],
    },
    {
      id: "8hour-veteran",
      title: "8-Hours Class Veteran",
      price: 100,
      deposit: 75,
      duration: "8 hr",
      description:
        "Extended training course for veterans with structured instruction and discounted pricing.",
      details: [
        "8-hour class included",
        "Range fee not included but required: $35.00",
        "Ammunition not included but required: $35.00",
        "Eye & Ear protection not included but required: $7.00",
        "Target not included but required: $2.00",
        "Scenario-based training may be required depending on student needs",
        "Training certificate may be included depending on what is required",
        "Concealed Carry & Home Defense Book may be needed if required and in stock",
      ],
    },
    {
      id: "16hour",
      title: "16-Hour CCL Course",
      price: 225,
      deposit: 75,
      duration: "16 hr",
      description:
        "Full concealed carry license training course for students who need complete instruction.",
      details: [
        "16-hour class included",
        "Range fee not included but required: $35.00",
        "Ammunition not included but required: $35.00",
        "Eye & Ear protection not included but required: $7.00",
        "Target not included but required: $2.00",
        "Scenario Simulations may be required depending on student needs",
        "Training Certificates may be required depending on student needs",
        "Concealed Carry and Home Defense Book may be needed if required and in stock",
      ],
    },
  ];

  const classPhotos = [
    { src: "/ips-class-1.jpeg", alt: "Students reviewing target results during concealed carry training" },
    { src: "/ips-class-2.jpeg", alt: "Student holding training target after class session" },
    { src: "/ips-class-3.jpeg", alt: "Student and instructor after successful class completion" },
    { src: "/ips-class-4.jpeg", alt: "Student practicing firearm stance at the range" },
    { src: "/ips-class-5.jpeg", alt: "Instructor guiding student during range training" },
    { src: "/ips-class-6.jpeg", alt: "Instructor demonstrating shotgun training at the range" },
    { src: "/ips-class-7.jpeg", alt: "Student practicing handgun aim during live-fire session" },
    { src: "/ips-class-8.jpeg", alt: "Student at indoor range during target practice" },
    { src: "/ips-class-9.jpeg", alt: "Student smiling during concealed carry training session" },
    { src: "/ips-class-10.jpeg", alt: "Student firing handgun during training exercise" },
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
      q: "Do I need prior experience?",
      a: "No. Beginner-friendly instruction is available.",
    },
    {
      q: "Is registration required?",
      a: "Yes. Space is limited, so advance registration is recommended.",
    },
    {
      q: "What should I bring?",
      a: "You will receive class details and required items after booking.",
    },
    {
      q: "What is the refund policy?",
      a: "Notify the instructor at least 24 hours in advance to keep full credit toward a future date. Rescheduling with less than 48 hours' notice results in forfeiture of class credit and requires a new payment and deposit.",
    },
  ];

  useEffect(() => {
    let isMounted = true;

    async function loadConfig() {
      try {
        const response = await fetch(`${API_BASE}/api/config`);
        const text = await response.text();
        console.log("CONFIG RESPONSE:", text);

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
    return getSelectedService()?.deposit || 0;
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
      console.log("PAYMENT RESPONSE:", text);

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
    "rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-white tracking-[0.14em] hover:border-red-500/40 hover:bg-red-600/10 hover:text-red-300 transition";

  const cardClass =
    "rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03))] p-6 shadow-[0_12px_30px_rgba(0,0,0,0.28)]";

  function BackButton() {
    return (
      <button
        type="button"
        onClick={goBack}
        className="mb-6 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm font-bold uppercase tracking-[0.14em] text-white hover:bg-white/10"
      >
        ← Go Back
      </button>
    );
  }

  function NavBar() {
    return (
      <div className="sticky top-0 z-50 border-b border-red-900/40 bg-[linear-gradient(180deg,rgba(0,0,0,0.95),rgba(10,10,10,0.92))] backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between md:px-10 lg:px-12">
          <button
            type="button"
            onClick={() => navigateTo("home")}
            className="flex items-center gap-3 text-left text-white"
          >
            <img
              src={LOGO_SRC}
              alt="Illinois Protective Services logo"
              className="h-12 w-12 rounded-full border border-white/10 bg-white/5 object-cover"
            />
            <div>
              <div className="text-sm font-black uppercase tracking-[0.22em] text-white">
                Illinois Protective
              </div>
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-blue-300">
                Services
              </div>
            </div>
          </button>

          <div className="flex flex-wrap gap-3 text-sm font-bold uppercase tracking-wide">
            <button type="button" onClick={() => navigateTo("home")} className={navButtonClass}>
              Home
            </button>
            <button type="button" onClick={() => navigateTo("about")} className={navButtonClass}>
              About Us
            </button>
            <button type="button" onClick={() => navigateTo("booking")} className={navButtonClass}>
              Booking
            </button>
            <button type="button" onClick={() => navigateTo("classes")} className={navButtonClass}>
              Classes
            </button>
            <button
              type="button"
              onClick={() => navigateTo("contact")}
              className="rounded-full border border-red-500/40 bg-red-600 px-4 py-2 text-white shadow-[0_0_18px_rgba(220,38,38,0.25)] hover:bg-red-700 transition"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (page === "about") {
    return (
      <div className="min-h-screen bg-black text-white">
        <NavBar />
        <AiHelperChat />

        <section className="mx-auto max-w-6xl px-6 py-16 md:px-10">
          <BackButton />

          <div className="max-w-4xl">
            <div className="inline-flex rounded-full border border-red-500/20 bg-red-600/10 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-blue-300">
              About Us
            </div>

            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.06em] sm:text-5xl">
              Professional Training Focused on Safety and Confidence
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">
              Illinois Protective Services provides concealed carry training for
              first-time students, returning students, and private groups who
              want professional, structured instruction in a safe and supportive
              environment.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Safety-first instruction",
              "Beginner-friendly guidance",
              "Professional classroom and range training",
              "Hands-on coaching for real confidence",
            ].map((item) => (
              <div key={item} className={cardClass}>
                {item}
              </div>
            ))}
          </div>

          <div className="mt-14">
            <div className="inline-flex rounded-full border border-red-500/20 bg-red-600/10 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-blue-300">
              Class Photos
            </div>

            <h2 className="mt-4 text-3xl font-black uppercase sm:text-4xl">
              Training In Action
            </h2>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-white/75">
              See real moments from our concealed carry classes, live-fire range
              sessions, instructor guidance, and student success.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {classPhotos.map((photo, index) => (
                <div
                  key={index}
                  className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] shadow-[0_12px_30px_rgba(0,0,0,0.28)]"
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

          <div className="mt-14 rounded-[2rem] border border-red-500/20 bg-red-600/10 p-8 shadow-[0_12px_30px_rgba(0,0,0,0.28)]">
            <h2 className="text-2xl font-black uppercase">
              Why Students Choose Illinois Protective Services
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <h3 className="text-lg font-black uppercase text-blue-300">
                  Real Training Experience
                </h3>
                <p className="mt-3 leading-7 text-white/80">
                  Students receive hands-on exposure to real range instruction,
                  guided coaching, and practical firearm safety support.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <h3 className="text-lg font-black uppercase text-blue-300">
                  Supportive Learning Environment
                </h3>
                <p className="mt-3 leading-7 text-white/80">
                  We help students build confidence step by step, whether they are
                  brand new, renewing, or completing a full concealed carry class.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (page === "classes") {
    return (
      <div className="min-h-screen bg-black text-white">
        <NavBar />
        <AiHelperChat />

        <section className="mx-auto max-w-6xl px-6 py-16 md:px-10">
          <BackButton />

          <div className="max-w-4xl">
            <div className="inline-flex rounded-full border border-red-500/20 bg-red-600/10 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-blue-300">
              Class Services
            </div>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.06em] sm:text-5xl">
              Available Services
            </h1>
            <p className="mt-4 text-lg leading-8 text-white/75">
              Browse the services currently available for customers to book.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {classServices.map((service) => (
              <div key={service.id} className={cardClass}>
                <div className="inline-flex rounded-full border border-red-500/20 bg-red-600/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
                  Service
                </div>

                <h2 className="mt-4 text-2xl font-black uppercase">
                  {service.title}
                </h2>

                <p className="mt-4 leading-7 text-white/75">
                  {service.description}
                </p>

                <div className="mt-4 space-y-2 text-white/80">
                  <div>
                    <span className="font-bold">Price:</span> {formatPrice(service.price)}
                  </div>
                  <div>
                    <span className="font-bold">Deposit:</span> {formatPrice(service.deposit)}
                  </div>
                  <div>
                    <span className="font-bold">Duration:</span> {service.duration}
                  </div>
                </div>

                <ul className="mt-5 space-y-2 text-white/80">
                  {service.details.map((detail) => (
                    <li key={detail}>• {detail}</li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedService(service.id);
                      setBookingStep(1);
                      navigateTo("booking");
                    }}
                    className="rounded-xl border border-red-500/40 bg-red-600 px-5 py-3 font-black uppercase tracking-[0.14em] text-white hover:bg-red-700"
                  >
                    Book This Service
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedService(service.id);
                      setFormData((prev) => ({
                        ...prev,
                        type: service.title,
                      }));
                      navigateTo("contact");
                    }}
                    className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-5 py-3 font-black uppercase tracking-[0.14em] text-blue-300 hover:bg-blue-500/20"
                  >
                    Ask About This Service
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (page === "booking") {
    const selectedServiceData = getSelectedService();

    return (
      <div className="min-h-screen bg-black text-white">
        <NavBar />
        <AiHelperChat />

        <section className="mx-auto max-w-6xl px-6 py-16 md:px-10">
          <BackButton />

          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-red-500/20 bg-red-600/10 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-blue-300">
              Booking
            </div>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.06em] sm:text-5xl">
              Complete Your Booking
            </h1>
            <p className="mt-4 text-lg leading-8 text-white/75">
              Step 1: choose a service. Step 2: choose date and time. Step 3: review, pay, and confirm.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { step: 1, label: "Step 1", text: "Choose Service" },
              { step: 2, label: "Step 2", text: "Choose Date & Time" },
              { step: 3, label: "Step 3", text: "Summary & Payment" },
            ].map((item) => (
              <div
                key={item.step}
                className={`rounded-2xl border px-5 py-4 ${
                  bookingStep === item.step
                    ? "border-red-500 bg-red-600 text-white"
                    : "border-white/10 bg-white/[0.03] text-white/70"
                }`}
              >
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
                <h2 className="text-2xl font-black uppercase">Choose a Service</h2>

                <div className="mt-6 grid gap-3">
                  {classServices.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setSelectedService(service.id)}
                      className={`rounded-2xl border px-4 py-4 text-left transition ${
                        selectedService === service.id
                          ? "border-red-500 bg-red-600 text-white"
                          : "border-white/15 bg-black/20 text-white hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="text-base font-black uppercase">
                            {service.title}
                          </div>
                          <div className="mt-1 text-sm text-white/80">
                            {service.duration}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-base font-black">
                            {formatPrice(service.price)}
                          </div>
                          <div className="text-xs text-white/70">
                            Deposit {formatPrice(service.deposit)}
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
                      alert("Please select a service first.");
                      return;
                    }
                    setBookingStep(2);
                  }}
                  className="mt-6 rounded-2xl border border-red-500/40 bg-red-600 px-6 py-4 text-base font-black uppercase tracking-[0.16em] text-white hover:bg-red-700"
                >
                  Continue to Step 2
                </button>
              </div>
            </div>
          )}

          {bookingStep === 2 && (
            <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                {selectedServiceData && (
                  <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-600/10 p-5 text-white shadow-[0_12px_30px_rgba(0,0,0,0.28)]">
                    <div className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
                      Selected Service
                    </div>
                    <div className="mt-2 text-lg font-black">
                      {selectedServiceData.title}
                    </div>
                    <div className="mt-1 text-white/80">
                      {selectedServiceData.duration} • {formatPrice(selectedServiceData.price)}
                    </div>
                  </div>
                )}

                <div className={cardClass}>
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
                            ? "cursor-not-allowed border-white/10 bg-white/5 text-white/30 line-through"
                            : selectedDate === date.value
                              ? "border-red-500 bg-red-600 text-white"
                              : "border-white/15 bg-white/[0.03] text-white hover:bg-white/10"
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

                <div className="mt-8 rounded-[2rem] border border-red-500/20 bg-blue-500/10 p-6 shadow-[0_12px_30px_rgba(0,0,0,0.28)]">
                  <h2 className="text-xl font-black uppercase text-blue-300">
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
                            ? "border-red-500 bg-red-600 text-white"
                            : "border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className={cardClass}>
                <div className="inline-flex rounded-full border border-red-500/20 bg-red-600/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
                  Step 2 Summary
                </div>
                <h2 className="mt-4 text-2xl font-black uppercase">Confirm Availability</h2>

                <div className="mt-6 space-y-4 text-white/80">
                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-white/50">Service</div>
                    <div className="mt-1 text-lg font-bold">
                      {getSelectedService()?.title || "No service selected"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-white/50">Price</div>
                    <div className="mt-1 text-lg font-bold">
                      {formatPrice(getSelectedPrice())}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-white/50">Deposit</div>
                    <div className="mt-1 text-lg font-bold">
                      {formatPrice(getSelectedDeposit())}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-white/50">Date</div>
                    <div className="mt-1 text-lg font-bold">
                      {selectedDate ? formatSelectedDate() : "No date selected"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-white/50">Time</div>
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
                    className="mt-4 w-full rounded-2xl border border-red-500/40 bg-red-600 px-6 py-4 text-center text-base font-black uppercase tracking-[0.16em] text-white hover:bg-red-700"
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
                <div className="inline-flex rounded-full border border-red-500/20 bg-red-600/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
                  Step 3
                </div>
                <h2 className="mt-4 text-2xl font-black uppercase">Booking Summary</h2>

                <div className="mt-6 space-y-4 text-white/85">
                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-white/50">Service</div>
                    <div className="mt-1 text-lg font-bold">
                      {getSelectedService()?.title || "No service selected"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-white/50">Full Price</div>
                    <div className="mt-1 text-lg font-bold">
                      {formatPrice(getSelectedPrice())}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-white/50">Deposit</div>
                    <div className="mt-1 text-lg font-bold">
                      {formatPrice(getSelectedDeposit())}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-white/50">Date</div>
                    <div className="mt-1 text-lg font-bold">{formatSelectedDate()}</div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-white/50">Time</div>
                    <div className="mt-1 text-lg font-bold">{selectedTime || "No time selected"}</div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-white/50">Payment Type</div>
                    <div className="mt-3 grid gap-3">
                      <button
                        type="button"
                        onClick={() => createPaymentIntent("deposit")}
                        className={`rounded-2xl border px-4 py-4 text-left font-black uppercase tracking-[0.14em] transition ${
                          paymentMode === "deposit"
                            ? "border-red-500 bg-red-600 text-white"
                            : "border-white/15 bg-white/[0.03] text-white hover:bg-white/10"
                        }`}
                      >
                        Pay Deposit — {formatPrice(getSelectedDeposit())}
                      </button>

                      <button
                        type="button"
                        onClick={() => createPaymentIntent("full")}
                        className={`rounded-2xl border px-4 py-4 text-left font-black uppercase tracking-[0.14em] transition ${
                          paymentMode === "full"
                            ? "border-red-500 bg-red-600 text-white"
                            : "border-white/15 bg-white/[0.03] text-white hover:bg-white/10"
                        }`}
                      >
                        Pay Full Amount — {formatPrice(getSelectedPrice())}
                      </button>
                    </div>
                  </div>

                  {paymentCompleted ? (
                    <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 text-sm text-blue-200">
                      Payment completed successfully.
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={confirmBooking}
                    className="mt-4 w-full rounded-2xl border border-red-500/40 bg-red-600 px-6 py-4 text-center text-base font-black uppercase tracking-[0.16em] text-white hover:bg-red-700"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>

              <div className={cardClass}>
                <h2 className="text-2xl font-black uppercase">Secure Payment</h2>

                {loadingPaymentIntent ? (
                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-white/70">
                    Loading secure payment form...
                  </div>
                ) : null}

                {paymentLoadError ? (
                  <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-600/10 p-5 text-red-200">
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
                  <div className="mt-4 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 text-sm text-blue-200">
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
      <div className="min-h-screen bg-black text-white">
        <NavBar />
        <AiHelperChat />

        <section className="mx-auto max-w-5xl px-6 py-16 md:px-10">
          <BackButton />

          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-red-500/20 bg-red-600/10 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-blue-300">
              Contact
            </div>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.06em] sm:text-5xl">
              Reach Out to Our Team
            </h1>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
            <div className={cardClass}>
              <h2 className="text-2xl font-black uppercase">Contact Details</h2>
              <div className="mt-6 space-y-4 text-lg text-white/85">
                <p><span className="font-bold text-white">Phone:</span> (224) 248-7021</p>
                <p className="break-all"><span className="font-bold text-white">Email:</span> info@illinoisprotectiveservices.com</p>
              </div>
            </div>

            <div className={cardClass}>
              <h2 className="text-2xl font-black uppercase">Send a Message</h2>
              <div className="mt-6 grid gap-4">
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-2xl border border-white/15 bg-black/20 px-5 py-4 text-white placeholder:text-white/40 outline-none"
                  placeholder="Full Name"
                />
                <input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="rounded-2xl border border-white/15 bg-black/20 px-5 py-4 text-white placeholder:text-white/40 outline-none"
                  placeholder="Phone Number"
                />
                <input
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="rounded-2xl border border-white/15 bg-black/20 px-5 py-4 text-white placeholder:text-white/40 outline-none"
                  placeholder="Email Address"
                />
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="rounded-2xl border border-white/15 bg-black/20 px-5 py-4 text-white outline-none"
                >
                  <option value="">Select Training Type</option>
                  <option>Mini Class</option>
                  <option>3-Hour Renewal Course</option>
                  <option>8-Hours Class Veteran</option>
                  <option>16-Hour CCL Course</option>
                </select>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="min-h-[140px] rounded-2xl border border-white/15 bg-black/20 px-5 py-4 text-white placeholder:text-white/40 outline-none"
                  placeholder="Questions or preferred class dates"
                />
                <button
                  type="button"
                  onClick={handleFormSubmit}
                  className="rounded-2xl border border-red-500/40 bg-red-600 px-6 py-4 text-lg font-black uppercase tracking-[0.16em] text-white transition hover:bg-red-700"
                >
                  Send Request
                </button>

                {submitted ? (
                  <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 px-5 py-4 font-bold text-blue-300">
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
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <AiHelperChat />

      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(127,29,29,0.35),transparent_30%),radial-gradient(circle_at_top_right,rgba(29,78,216,0.20),transparent_28%),linear-gradient(180deg,#000000_0%,#05070b_55%,#0a0f14_100%)]">
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.06)_50%,transparent_100%)]" />
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full bg-[linear-gradient(135deg,transparent_0%,transparent_47%,rgba(255,255,255,0.06)_47%,rgba(255,255,255,0.06)_53%,transparent_53%,transparent_100%)]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center md:px-10 lg:py-24">
          <div className="mx-auto mb-5 flex w-fit items-center gap-4 rounded-full border border-red-500/30 bg-red-600/10 px-4 py-3">
            <img
              src={LOGO_SRC}
              alt="Illinois Protective Services logo"
              className="h-14 w-14 rounded-full border border-white/10 bg-white/5 object-cover"
            />
            <div className="text-left">
              <div className="text-sm font-black uppercase tracking-[0.22em] text-white">
                Illinois Protective
              </div>
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-blue-300">
                Services
              </div>
            </div>
          </div>

          <h1 className="mx-auto max-w-5xl text-5xl font-black uppercase tracking-[0.06em] text-white sm:text-6xl lg:text-7xl">
            Clear Training. Simple Booking. Professional Instruction.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/75 sm:text-xl">
            Concealed carry training with weekday scheduling, guided instruction,
            and a simple path from booking to confirmation.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => navigateTo("classes")}
              className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-6 py-4 text-center text-lg font-black uppercase tracking-[0.16em] text-blue-300 transition hover:bg-blue-500/20"
            >
              View Class Services
            </button>
            <button
              type="button"
              onClick={() => {
                setBookingStep(1);
                navigateTo("booking");
              }}
              className="rounded-2xl border border-red-500/40 bg-red-600 px-6 py-4 text-center text-lg font-black uppercase tracking-[0.16em] text-white transition hover:bg-red-700"
            >
              Book Class
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 md:px-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Certified instruction",
            "Weekday classes",
            "Range included",
            "Certificate guidance",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-4 text-base font-medium text-white/90"
            >
              <span className="mr-2 text-blue-400">★</span>
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-400">
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
                title: "Choose Service",
                text: "Select the training service that fits your needs.",
              },
              {
                step: "2",
                title: "Pick Date & Time",
                text: "Choose the available date and time that works for you.",
              },
              {
                step: "3",
                title: "Review & Confirm",
                text: "Review the booking summary, complete payment, and confirm.",
              },
            ].map((item) => (
              <div key={item.step} className={cardClass}>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-xl font-black text-white">
                  {item.step}
                </div>
                <h3 className="mt-5 text-2xl font-black uppercase">{item.title}</h3>
                <p className="mt-3 leading-7 text-white/75">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:px-10">
        <div className="rounded-[2rem] border border-red-500/20 bg-red-600/10 p-8">
          <div className="inline-flex rounded-full border border-red-500/30 bg-red-600 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-white">
            Refund & Rescheduling Policy
          </div>

          <div className="mt-6 space-y-5 leading-8 text-white/85">
            <p>
              We understand that unexpected situations may arise. If you are unable to
              attend your scheduled class, please notify the instructor at least
              <span className="font-bold text-white"> 24 hours in advance </span>
              to retain full credit toward a future class date.
            </p>

            <p>
              Rescheduling requests made with
              <span className="font-bold text-white"> less than 48 hours’ notice </span>
              will result in the forfeiture of your class credit. In these cases, a
              new payment and deposit will be required to secure a spot in a future
              Concealed Carry License (CCL) class.
            </p>

            <p>
              We appreciate your understanding and cooperation, as this policy allows
              us to provide quality instruction and accommodate all students fairly.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-300">
              Testimonials
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase sm:text-4xl">
              What Students Say
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className={cardClass}>
                <p className="leading-7 text-white/80">“{t.text}”</p>
                <div className="mt-4 text-sm font-bold uppercase tracking-[0.14em] text-blue-300">
                  — {t.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:px-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className={cardClass}>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-400">
              Contact
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase sm:text-4xl">
              Need Help Before Booking?
            </h2>
            <div className="mt-6 space-y-4 text-lg text-white/85">
              <p>
                <span className="font-bold text-white">Phone:</span> (224) 248-7021
              </p>
              <p className="break-all">
                <span className="font-bold text-white">Email:</span>{" "}
                info@illinoisprotectiveservices.com
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigateTo("contact")}
              className="mt-8 rounded-xl border border-red-500/40 bg-red-600 px-6 py-4 font-black uppercase tracking-[0.14em] text-white hover:bg-red-700"
            >
              Contact Us
            </button>
          </div>

          <div className={cardClass}>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-300">
              FAQ
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase sm:text-4xl">
              Common Questions
            </h2>
            <div className="mt-6 space-y-5">
              {faqs.map((faq) => (
                <div key={faq.q}>
                  <h3 className="text-lg font-black">{faq.q}</h3>
                  <p className="mt-2 leading-7 text-white/75">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-8 text-sm text-white/55 md:flex-row md:items-center md:justify-between md:px-10">
          <p>© 2026 Illinois Protective Services. All rights reserved.</p>
          <p>Responsible training. Professional instruction. Convenient scheduling.</p>
        </div>
      </footer>
    </div>
  );
}