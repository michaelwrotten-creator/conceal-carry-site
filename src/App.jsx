import { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

function OpeningGate({ onEnter }) {
  return (
    <div className="fixed inset-0 z-[10000] overflow-hidden bg-black">
      <img
        src="/opening-flag.jpg"
        alt="American flag background"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(65,105,225,0.08)_0%,transparent_25%,transparent_75%,rgba(65,105,225,0.08)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_9px,rgba(88,130,255,0.06)_10px)]" />

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="mx-auto max-w-3xl text-center text-white">
          <div className="mb-5 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-white/90 backdrop-blur-sm">
            Illinois Protective Services
          </div>

          <h1 className="text-4xl font-black uppercase tracking-[0.12em] text-white sm:text-5xl md:text-6xl">
            Elite Protection Training
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">
            Professional concealed carry instruction with disciplined training,
            structured booking, and a confident path to responsible protection.
          </p>

          <button
            type="button"
            onClick={onEnter}
            className="mt-8 rounded-full border border-[#4169e1]/40 bg-[#4169e1] px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-white shadow-[0_0_30px_rgba(65,105,225,0.28)] transition hover:scale-[1.02] hover:bg-[#3558c9]"
          >
            Enter Site
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
      text: "Welcome to Illinois Protective Services. I can help with class options, deposits, paperwork, range requirements, rescheduling, qualification rules, and general concealed carry training questions.",
    },
  ]);

  const knowledge = {
    services: [
      {
        title: "Mini Class",
        price: 50,
        deposit: 16.67,
        duration: "1 hr 30 min",
      },
      {
        title: "3-Hour Renewal Course",
        price: 75,
        deposit: 25.0,
        duration: "3 hr",
      },
      {
        title: "8-Hours Class Veteran",
        price: 100,
        deposit: 33.33,
        duration: "8 hr",
      },
      {
        title: "16-Hour CCL Course",
        price: 225,
        deposit: 75.0,
        duration: "16 hr",
      },
    ],
    business: {
      phone: "(224) 248-7021",
      email: "support@illinoisprotectiveservices.com",
      address: "7601 S. Cicero Ave, Chicago, IL 60652",
      bookingHours: "Monday through Friday from 9:00 AM to 5:00 PM.",
    },
    paperwork: [
      "Complete all paperwork in black ink and print neatly.",
      "A copy of your state ID or driver's license should be added to your class folder.",
      "A copy of your FOID card should be added to your class folder.",
      "Renewal students should also have a copy of their CCL added to the class folder.",
      "Incomplete paperwork can delay certificate processing.",
    ],
    studentNotices: [
      "If you miss class or range for any reason, there is a $55 makeup fee.",
      "Late arrival to class or range results in a $55 makeup fee.",
      "Shotgun can be added to training for an additional $75 and should be requested the day before range day.",
      "Cell phone use is prohibited during instructional time unless approved by the instructor.",
      "No audio or video recording is permitted.",
      "A replacement state training certificate costs $75.",
    ],
    range: [
      "Range fee listed in the packet is $75 due upfront and noted as non-refundable.",
      "Students must pass the shooting qualification with at least 60 percent.",
      "Students must hit at least 30 rounds out of 50 total rounds.",
      "Qualification stages include 5, 7, and 10 yards, with optional one-handed stages.",
    ],
    veteran:
      "Veterans seeking the 8-hour credit should provide a DD-214 showing honorable discharge.",
    refundPolicy:
      "No refunds. If a student cannot attend, they must notify the instructor at least 24 hours before class to keep credit for the next available class and pay a $55 rescheduling fee before the next scheduled class. Rescheduling with less than 24 hours' notice results in forfeiture of class credit and the student must pay for another class or deposit.",
    safety:
      "Students should verify current Illinois law, prohibited areas, storage requirements, and reporting requirements through the Illinois State Police because laws can change.",
  };

  function formatServices() {
    return knowledge.services
      .map(
        (s) =>
          `${s.title}: full ${s.price.toFixed(2)}, deposit ${s.deposit.toFixed(
            2
          )}, duration ${s.duration}`
      )
      .join("; ");
  }

  function getBroadResponse(message) {
    const lower = message.toLowerCase();
    const mentions = (...terms) => terms.some((term) => lower.includes(term));

    if (mentions("class", "service", "services", "options")) {
      return `Available training options: ${formatServices()}.`;
    }

    if (mentions("deposit", "price", "cost", "payment")) {
      return `Current class pricing: ${formatServices()}. Deposits are set at one-third of the listed class price.`;
    }

    if (mentions("book", "booking", "schedule")) {
      return `Booking is done in three steps: choose a class, choose date and time, then review, pay, and confirm. Booking hours are ${knowledge.business.bookingHours}`;
    }

    if (mentions("paperwork", "forms", "packet", "black ink")) {
      return `Paperwork reminders: ${knowledge.paperwork.join(" ")}`;
    }

    if (mentions("foid", "driver", "license", "id copy", "documents")) {
      return `Students should bring and provide copies of required identification and firearms documents. ${knowledge.paperwork.join(
        " "
      )}`;
    }

    if (mentions("range", "qualification", "shooting", "pass", "score")) {
      return `Range information: ${knowledge.range.join(" ")}`;
    }

    if (mentions("makeup", "late", "miss class")) {
      return `Attendance notice: ${knowledge.studentNotices[0]} ${knowledge.studentNotices[1]}`;
    }

    if (mentions("shotgun")) {
      return knowledge.studentNotices[2];
    }

    if (mentions("record", "recording", "video", "audio")) {
      return knowledge.studentNotices[4];
    }

    if (mentions("certificate", "replacement certificate")) {
      return `Certificate note: students receive one state training certificate after successful completion, and a replacement certificate fee is $75.`;
    }

    if (mentions("veteran", "dd214", "dd-214")) {
      return knowledge.veteran;
    }

    if (mentions("refund", "reschedule", "policy")) {
      return knowledge.refundPolicy;
    }

    if (mentions("contact", "phone", "email", "call", "address")) {
      return `You can contact Illinois Protective Services at ${knowledge.business.phone}, ${knowledge.business.email}, and ${knowledge.business.address}.`;
    }

    if (mentions("law", "laws", "illinois law", "prohibited areas")) {
      return knowledge.safety;
    }

    return "I can help with class options, deposits, booking steps, paperwork, FOID and ID document reminders, range qualification, veteran credit, refund policy, and general concealed carry training guidance.";
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
        <div className="mb-4 w-[390px] overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,#060606_0%,#0c1118_100%)] shadow-[0_25px_70px_rgba(0,0,0,0.6)]">
          <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_9px,rgba(88,130,255,0.05)_10px)]" />
          <div className="relative flex items-center justify-between border-b border-[#4169e1]/20 bg-[linear-gradient(90deg,#0b1220_0%,#131b29_100%)] px-5 py-4 text-white">
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
              <div className="relative h-[380px] space-y-3 overflow-y-auto p-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`max-w-[88%] rounded-2xl border px-4 py-3 text-sm leading-6 ${
                      msg.role === "assistant"
                        ? "border-white/10 bg-white/10 text-white"
                        : "ml-auto border-[#4169e1]/20 bg-[#4169e1] text-white"
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              <div className="relative border-t border-white/10 p-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSend();
                    }}
                    placeholder="Ask about paperwork, deposits, laws, class details..."
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
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
        className="flex h-16 w-16 items-center justify-center rounded-full border border-[#4169e1]/40 bg-[#4169e1] text-lg font-black uppercase text-white shadow-[0_0_30px_rgba(65,105,225,0.28)] transition hover:scale-105 hover:bg-[#3558c9]"
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
        <div className="rounded-2xl border border-[#e85b66]/20 bg-[#e85b66]/10 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={!stripe || status === "processing"}
        className="w-full rounded-2xl border border-[#4169e1]/40 bg-[#4169e1] px-6 py-4 text-base font-black uppercase tracking-[0.16em] text-white shadow-[0_0_24px_rgba(65,105,225,0.18)] transition hover:bg-[#3558c9] disabled:cursor-not-allowed disabled:opacity-60"
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
            colorPrimary: "#4169e1",
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
      details: [
        "Mini Class instruction included",
        "Range fee listed in the packet is $75 and separate from class tuition.",
        "Ammunition may be required depending on class and range use.",
        "Eye and ear protection may be needed if not already provided.",
        "Required paperwork should be completed in black ink.",
      ],
    },
    {
      id: "3hour",
      title: "3-Hour Renewal Course",
      price: 75,
      duration: "3 hr",
      description:
        "Renewal training for qualified students who need a 3-hour concealed carry renewal course.",
      details: [
        "3-hour renewal instruction included",
        "Bring your FOID card and renewal documents.",
        "Range qualification rules still apply where required.",
        "Late arrival or missed class can trigger a $55 makeup fee.",
        "No audio or video recording is permitted during instruction.",
      ],
    },
    {
      id: "8hour-veteran",
      title: "8-Hours Class Veteran",
      price: 100,
      duration: "8 hr",
      description:
        "Extended training course for veterans with structured instruction and state-credit considerations.",
      details: [
        "8-hour class included",
        "Veteran students should provide a DD-214 showing honorable discharge for 8-hour credit consideration.",
        "Bring required identification and firearms paperwork.",
        "Range qualification requires at least 30 hits out of 50 rounds.",
        "Illinois law review remains the student’s responsibility.",
      ],
    },
    {
      id: "16hour",
      title: "16-Hour CCL Course",
      price: 225,
      duration: "16 hr",
      description:
        "Full concealed carry license training course for students who need complete instruction.",
      details: [
        "16-hour class included",
        "Students should complete the full packet carefully and neatly in black ink.",
        "Copies of state ID or driver’s license and FOID should be added to the class folder.",
        "If applicable, range qualification requires a passing score of at least 60 percent.",
        "No refunds. Rescheduling is controlled by the posted policy.",
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
    {
      src: "/ips-class-7.jpeg",
      alt: "Student practicing handgun aim during live-fire session",
    },
    {
      src: "/ips-class-8.jpeg",
      alt: "Student at indoor range during target practice",
    },
    {
      src: "/ips-class-9.jpeg",
      alt: "Student smiling during concealed carry training session",
    },
    {
      src: "/ips-class-10.jpeg",
      alt: "Student firing handgun during training exercise",
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
      q: "What happens if I miss class or range?",
      a: "There is a $55 makeup fee for missed class or range and no refunds.",
    },
    {
      q: "What score do I need to pass shooting qualification?",
      a: "Students must pass with at least 60 percent, which is at least 30 hits out of 50 rounds.",
    },
    {
      q: "Do veterans get special credit?",
      a: "Veterans should provide a DD-214 showing honorable discharge to receive 8-hour credit where applicable.",
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
    "relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur-sm";

  function ScanLine() {
    return (
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-[linear-gradient(90deg,transparent_0%,rgba(65,105,225,0.7)_50%,transparent_100%)]" />
    );
  }

  function StarRow() {
    return (
      <div className="mt-6 flex justify-center gap-3 text-3xl text-[#4169e1]">
        <span>★</span>
        <span>★</span>
        <span>★</span>
        <span>★</span>
        <span>★</span>
      </div>
    );
  }

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
      <div className="sticky top-0 z-50 border-b border-[#4169e1]/15 bg-[linear-gradient(180deg,rgba(0,0,0,0.95),rgba(10,14,20,0.92))] backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-[linear-gradient(90deg,transparent_0%,rgba(65,105,225,0.65)_50%,transparent_100%)]" />
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
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-[#8ea6ff]">
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
            <button type="button" onClick={() => navigateTo("classes")} className={navButtonClass}>
              Classes
            </button>
            <button type="button" onClick={() => navigateTo("booking")} className={navButtonClass}>
              Book Now
            </button>
            <button
              type="button"
              onClick={() => navigateTo("contact")}
              className="rounded-full border border-[#4169e1]/40 bg-[#4169e1] px-4 py-2 text-white shadow-[0_0_18px_rgba(65,105,225,0.25)] hover:bg-[#3558c9] transition"
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
      <div className="min-h-screen bg-[#050607] text-white">
        <NavBar />
        <AiHelperChat />

        <section className="mx-auto max-w-6xl px-6 py-16 md:px-10">
          <BackButton />

          <div className="max-w-4xl">
            <div className="inline-flex rounded-full border border-[#4169e1]/25 bg-[#4169e1]/10 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-[#8ea6ff]">
              About Us
            </div>

            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.06em] sm:text-5xl">
              Elite Protection Training
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">
              Illinois Protective Services provides structured concealed carry
              instruction with a focus on responsible protection, disciplined
              training, paperwork readiness, and real-world safety awareness.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Structured booking",
              "Paperwork and document readiness",
              "Range qualification guidance",
              "Professional instruction environment",
            ].map((item) => (
              <div key={item} className={cardClass}>
                <ScanLine />
                {item}
              </div>
            ))}
          </div>

          <div className="mt-14">
            <div className="inline-flex rounded-full border border-[#4169e1]/25 bg-[#4169e1]/10 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-[#8ea6ff]">
              Class Photos
            </div>

            <h2 className="mt-4 text-3xl font-black uppercase sm:text-4xl">
              Training In Action
            </h2>

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
        </section>
      </div>
    );
  }

  if (page === "classes") {
    return (
      <div className="min-h-screen bg-[#050607] text-white">
        <NavBar />
        <AiHelperChat />

        <section className="mx-auto max-w-6xl px-6 py-16 md:px-10">
          <BackButton />

          <div className="max-w-4xl">
            <div className="inline-flex rounded-full border border-[#4169e1]/25 bg-[#4169e1]/10 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-[#8ea6ff]">
              Class Services
            </div>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.06em] sm:text-5xl">
              Available Classes
            </h1>
            <p className="mt-4 text-lg leading-8 text-white/75">
              Review class details, full tuition, deposit amount, and what to
              expect before selecting your class.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {classServices.map((service) => (
              <div key={service.id} className={cardClass}>
                <ScanLine />
                <div className="inline-flex rounded-full border border-[#4169e1]/20 bg-[#4169e1]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#8ea6ff]">
                  Class Option
                </div>

                <h2 className="mt-4 text-2xl font-black uppercase">
                  {service.title}
                </h2>

                <p className="mt-4 leading-7 text-white/75">
                  {service.description}
                </p>

                <div className="mt-4 space-y-2 text-white/80">
                  <div>
                    <span className="font-bold">Full Price:</span>{" "}
                    {formatPrice(service.price)}
                  </div>
                  <div>
                    <span className="font-bold">Deposit:</span>{" "}
                    {formatPrice(Math.round((service.price / 3) * 100) / 100)}
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
                    className="rounded-xl border border-[#4169e1]/40 bg-[#4169e1] px-5 py-3 font-black uppercase tracking-[0.14em] text-white hover:bg-[#3558c9]"
                  >
                    Select This Class
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
                    className="rounded-xl border border-[#e85b66]/35 bg-[#e85b66]/10 px-5 py-3 font-black uppercase tracking-[0.14em] text-[#ffb1b8] hover:bg-[#e85b66]/20"
                  >
                    Ask A Question
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
      <div className="min-h-screen bg-[#050607] text-white">
        <NavBar />
        <AiHelperChat />

        <section className="mx-auto max-w-6xl px-6 py-16 md:px-10">
          <BackButton />

          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-[#4169e1]/25 bg-[#4169e1]/10 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-[#8ea6ff]">
              Booking
            </div>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.06em] sm:text-5xl">
              Book Your Class
            </h1>
            <p className="mt-4 text-lg leading-8 text-white/75">
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
                    ? "border-[#4169e1] bg-[#4169e1]/15 text-white"
                    : "border-white/10 bg-white/[0.03] text-white/70"
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
                          ? "border-[#4169e1] bg-[#4169e1]/15 text-white"
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
                {selectedServiceData && (
                  <div className="mb-8 relative overflow-hidden rounded-2xl border border-[#4169e1]/20 bg-[#4169e1]/10 p-5 text-white shadow-[0_12px_30px_rgba(0,0,0,0.28)]">
                    <ScanLine />
                    <div className="text-sm font-bold uppercase tracking-[0.2em] text-[#8ea6ff]">
                      Selected Class
                    </div>
                    <div className="mt-2 text-lg font-black">
                      {selectedServiceData.title}
                    </div>
                    <div className="mt-1 text-white/80">
                      {selectedServiceData.duration} •{" "}
                      {formatPrice(selectedServiceData.price)}
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
                            ? "cursor-not-allowed border-white/10 bg-white/5 text-white/30 line-through"
                            : selectedDate === date.value
                            ? "border-[#4169e1] bg-[#4169e1]/15 text-white"
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

                <div className="mt-8 relative overflow-hidden rounded-[2rem] border border-[#4169e1]/20 bg-[#4169e1]/10 p-6 shadow-[0_12px_30px_rgba(0,0,0,0.28)]">
                  <ScanLine />
                  <h2 className="text-xl font-black uppercase text-[#8ea6ff]">
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
                            : "border-[#4169e1]/30 bg-[#4169e1]/10 text-[#8ea6ff] hover:bg-[#4169e1]/20"
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
                <div className="inline-flex rounded-full border border-[#4169e1]/25 bg-[#4169e1]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#8ea6ff]">
                  Step 2 Summary
                </div>
                <h2 className="mt-4 text-2xl font-black uppercase">Review Availability</h2>

                <div className="mt-6 space-y-4 text-white/80">
                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-white/50">
                      Class
                    </div>
                    <div className="mt-1 text-lg font-bold">
                      {getSelectedService()?.title || "No class selected"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-white/50">
                      Full Price
                    </div>
                    <div className="mt-1 text-lg font-bold">
                      {formatPrice(getSelectedPrice())}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-white/50">
                      Deposit
                    </div>
                    <div className="mt-1 text-lg font-bold">
                      {formatPrice(getSelectedDeposit())}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-white/50">
                      Date
                    </div>
                    <div className="mt-1 text-lg font-bold">
                      {selectedDate ? formatSelectedDate() : "No date selected"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-white/50">
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
                <div className="inline-flex rounded-full border border-[#4169e1]/25 bg-[#4169e1]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#8ea6ff]">
                  Step 3
                </div>
                <h2 className="mt-4 text-2xl font-black uppercase">Review & Pay</h2>

                <div className="mt-6 space-y-4 text-white/85">
                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-white/50">
                      Class
                    </div>
                    <div className="mt-1 text-lg font-bold">
                      {getSelectedService()?.title || "No class selected"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-white/50">
                      Full Price
                    </div>
                    <div className="mt-1 text-lg font-bold">
                      {formatPrice(getSelectedPrice())}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-white/50">
                      Deposit
                    </div>
                    <div className="mt-1 text-lg font-bold">
                      {formatPrice(getSelectedDeposit())}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-white/50">
                      Date
                    </div>
                    <div className="mt-1 text-lg font-bold">{formatSelectedDate()}</div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-white/50">
                      Time
                    </div>
                    <div className="mt-1 text-lg font-bold">
                      {selectedTime || "No time selected"}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#e85b66]/20 bg-[#e85b66]/10 p-4 text-sm text-red-100">
                    No refunds. Rescheduling requests made with less than 24
                    hours’ notice will result in forfeiture of class credit and
                    require another class payment or deposit.
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-white/50">
                      Payment Type
                    </div>
                    <div className="mt-3 grid gap-3">
                      <button
                        type="button"
                        onClick={() => createPaymentIntent("deposit")}
                        className={`rounded-2xl border px-4 py-4 text-left font-black uppercase tracking-[0.14em] transition ${
                          paymentMode === "deposit"
                            ? "border-[#4169e1] bg-[#4169e1]/15 text-white"
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
                            ? "border-[#4169e1] bg-[#4169e1]/15 text-white"
                            : "border-white/15 bg-white/[0.03] text-white hover:bg-white/10"
                        }`}
                      >
                        Pay Full Amount — {formatPrice(getSelectedPrice())}
                      </button>
                    </div>
                  </div>

                  {paymentCompleted ? (
                    <div className="rounded-2xl border border-[#4169e1]/20 bg-[#4169e1]/10 p-4 text-sm text-[#b8c8ff]">
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
                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-white/70">
                    Loading secure payment form...
                  </div>
                ) : null}

                {paymentLoadError ? (
                  <div className="mt-6 rounded-2xl border border-[#e85b66]/20 bg-[#e85b66]/10 p-5 text-red-200">
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
                  <div className="mt-4 rounded-2xl border border-[#4169e1]/20 bg-[#4169e1]/10 p-4 text-sm text-[#b8c8ff]">
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
      <div className="min-h-screen bg-[#050607] text-white">
        <NavBar />
        <AiHelperChat />

        <section className="mx-auto max-w-5xl px-6 py-16 md:px-10">
          <BackButton />

          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-[#4169e1]/25 bg-[#4169e1]/10 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-[#8ea6ff]">
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
              <div className="mt-6 space-y-4 text-lg text-white/85">
                <p>
                  <span className="font-bold text-white">Phone:</span> (224)
                  248-7021
                </p>
                <p className="break-all">
                  <span className="font-bold text-white">Email:</span>{" "}
                  support@illinoisprotectiveservices.com
                </p>
                <p>
                  <span className="font-bold text-white">Address:</span> 7601 S.
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
                  className="rounded-2xl border border-white/15 bg-black/20 px-5 py-4 text-white placeholder:text-white/40 outline-none"
                  placeholder="Full Name"
                />
                <input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="rounded-2xl border border-white/15 bg-black/20 px-5 py-4 text-white placeholder:text-white/40 outline-none"
                  placeholder="Phone Number"
                />
                <input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="rounded-2xl border border-white/15 bg-black/20 px-5 py-4 text-white placeholder:text-white/40 outline-none"
                  placeholder="Email Address"
                />
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="min-h-[140px] rounded-2xl border border-white/15 bg-black/20 px-5 py-4 text-white placeholder:text-white/40 outline-none"
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
                  <div className="rounded-2xl border border-[#4169e1]/20 bg-[#4169e1]/10 px-5 py-4 font-bold text-[#b8c8ff]">
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
    <div className="min-h-screen bg-[#050607] text-white">
      <NavBar />
      <AiHelperChat />

      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(65,105,225,0.14),transparent_28%),radial-gradient(circle_at_top_right,rgba(232,91,102,0.08),transparent_22%),linear-gradient(180deg,#050607_0%,#0b0e13_55%,#121720_100%)]">
        <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_9px,rgba(88,130,255,0.04)_10px)]" />
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.06)_50%,transparent_100%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 md:px-10 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="inline-flex rounded-full border border-[#4169e1]/30 bg-[#4169e1]/10 px-4 py-3">
                <div className="flex items-center gap-4">
                  <img
                    src={LOGO_SRC}
                    alt="Illinois Protective Services logo"
                    className="h-14 w-14 rounded-full border border-white/10 bg-white/5 object-cover"
                  />
                  <div className="text-left">
                    <div className="text-sm font-black uppercase tracking-[0.22em] text-white">
                      Illinois Protective
                    </div>
                    <div className="text-xs font-bold uppercase tracking-[0.22em] text-[#8ea6ff]">
                      Services
                    </div>
                  </div>
                </div>
              </div>

              <h1 className="mt-6 max-w-4xl text-5xl font-black uppercase tracking-[0.06em] text-white sm:text-6xl lg:text-7xl">
                Elite Protection Training
              </h1>

              <StarRow />

              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75 sm:text-xl">
                Professional concealed carry instruction with disciplined
                booking, practical firearms education, and a confident path to
                responsible protection.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigateTo("classes")}
                  className="rounded-2xl border border-[#4169e1]/40 bg-[#4169e1] px-6 py-4 text-center text-lg font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#3558c9]"
                >
                  View Classes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBookingStep(1);
                    navigateTo("booking");
                  }}
                  className="rounded-2xl border border-[#e85b66]/35 bg-[#e85b66]/10 px-6 py-4 text-center text-lg font-black uppercase tracking-[0.16em] text-[#ffb1b8] transition hover:bg-[#e85b66]/20"
                >
                  Book Now
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Professional Instruction",
                "Weekday Scheduling",
                "Paperwork Guidance",
                "Range Qualification Support",
              ].map((item) => (
                <div key={item} className={cardClass}>
                  <ScanLine />
                  <div className="text-2xl text-[#4169e1]">★</div>
                  <div className="mt-3 text-lg font-black uppercase">{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#8ea6ff]">
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
                <p className="mt-3 leading-7 text-white/75">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#8ea6ff]">
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
              <h3 className="mt-5 text-2xl font-black uppercase">{item.title}</h3>
              <p className="mt-3 leading-7 text-white/75">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#e85b66]/20 bg-[#e85b66]/10 p-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-[linear-gradient(90deg,transparent_0%,rgba(232,91,102,0.7)_50%,transparent_100%)]" />
          <div className="inline-flex rounded-full border border-[#e85b66]/30 bg-[#e85b66] px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-white">
            Refund & Rescheduling Policy
          </div>

          <div className="mt-6 space-y-5 leading-8 text-white/85">
            <p>
              We understand that unexpected situations may arise. If you are unable
              to attend your scheduled class, please notify the instructor at
              least <span className="font-bold text-white">24 hours in advance</span>{" "}
              to retain full credit toward a future class date.
            </p>

            <p>
              Rescheduling requests made with{" "}
              <span className="font-bold text-white">
                less than 24 hours’ notice
              </span>{" "}
              will result in the forfeiture of your class credit. In these cases,
              a new payment and deposit will be required to secure a spot in a
              future class.
            </p>

            <p>
              Missed class or range can also trigger a $55 makeup fee.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#8ea6ff]">
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
                <p className="leading-7 text-white/80">“{t.text}”</p>
                <div className="mt-4 text-sm font-bold uppercase tracking-[0.14em] text-[#8ea6ff]">
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
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#8ea6ff]">
              Contact
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase sm:text-4xl">
              Need Help Before Booking?
            </h2>
            <div className="mt-6 space-y-4 text-lg text-white/85">
              <p>
                <span className="font-bold text-white">Phone:</span> (224)
                248-7021
              </p>
              <p className="break-all">
                <span className="font-bold text-white">Email:</span>{" "}
                support@illinoisprotectiveservices.com
              </p>
              <p>
                <span className="font-bold text-white">Address:</span> 7601 S.
                Cicero Ave, Chicago, IL 60652
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
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#8ea6ff]">
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
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 text-sm text-white/55 md:flex-row md:items-center md:justify-between md:px-10">
          <p>© 2026 Illinois Protective Services. All rights reserved.</p>
          <p>Responsible training. Professional instruction. Convenient scheduling.</p>
        </div>
      </footer>
    </div>
  );
}