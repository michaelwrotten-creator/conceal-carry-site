import { useState } from "react";

function AiHelperChat() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Welcome to Illinois Protective Services. I can help with class options, pricing, booking, payment, refunds, what to bring, and general concealed carry training questions.",
    },
  ]);

  const knowledge = {
    services: [
      {
        title: "Mini Class",
        price: "$50.00",
        duration: "1 hr 30 min",
        summary:
          "A short-format class for focused instruction and quick skills review.",
      },
      {
        title: "3-Hour Class",
        price: "$150.00",
        duration: "3 hr",
        summary:
          "A condensed training option with structured instruction and safety review.",
      },
      {
        title: "8-Hours Class Veteran",
        price: "$100.00",
        duration: "8 hr",
        summary: "An extended training option with veteran pricing.",
      },
      {
        title: "16-Hour Classes",
        price: "$225.00",
        duration: "16 hr",
        summary:
          "A full-length concealed carry training option with complete instruction.",
      },
    ],
    hours: "Monday through Friday from 9:00 AM to 5:00 PM.",
    phone: "(224) 248-7021",
    email: "info@illinoisprotectiveservices.com",
    refundPolicy:
      "If you are unable to attend your scheduled class, notify the instructor at least 24 hours in advance to retain full credit toward a future class date. Rescheduling requests made with less than 48 hours’ notice will result in forfeiture of class credit, and a new payment and deposit will be required.",
    bringItems:
      "Students should be prepared to bring required identification, any required documentation, and follow all instructor guidance. Final class details should be confirmed directly before class.",
    beginnerInfo:
      "Beginner-friendly instruction is available. New students can still receive structured guidance and safety-focused training.",
    certificate:
      "Completion certificates are available for qualifying class services after the required training is completed.",
    groupInfo:
      "Private group sessions may be available for families, organizations, or teams. Contact the instructor directly to coordinate.",
    disclaimer:
      "I can provide general class information, but I do not provide legal advice.",
  };

  function getBroadResponse(message) {
    const lower = message.toLowerCase();
    const mentions = (...terms) => terms.some((term) => lower.includes(term));

    if (mentions("hello", "hi", "hey")) {
      return "Hello. I can help you compare classes, understand pricing, choose a booking option, review the refund policy, and answer general training questions.";
    }

    if (
      mentions(
        "what classes",
        "services",
        "class options",
        "available classes",
        "training options"
      )
    ) {
      return `Available services include: ${knowledge.services
        .map((s) => `${s.title} (${s.price}, ${s.duration})`)
        .join("; ")}.`;
    }

    if (mentions("mini class")) {
      return "The Mini Class is $50.00 and lasts 1 hour 30 minutes. It is a shorter-format option for focused instruction and a quick skills review.";
    }

    if (mentions("3-hour", "3 hour")) {
      return "The 3-Hour Class is $150.00 and lasts 3 hours. It is a condensed training option with structured instruction and safety review.";
    }

    if (mentions("8-hour", "8 hour", "veteran")) {
      return "The 8-Hours Class Veteran option is $100.00 and lasts 8 hours. It is an extended option with veteran pricing.";
    }

    if (mentions("16-hour", "16 hour", "full class")) {
      return "The 16-Hour Classes option is $225.00 and lasts 16 hours. It is the full-length concealed carry training option.";
    }

    if (mentions("book", "booking", "schedule", "appointment")) {
      return "To book a class, go to the Booking page, choose your service, then select an available date and time before continuing to payment.";
    }

    if (mentions("date", "dates", "availability", "available")) {
      return `Customers can view date availability on the Booking page. Current booking hours are ${knowledge.hours}`;
    }

    if (mentions("time", "times", "time frame", "time slot")) {
      return `Available class times are ${knowledge.hours}`;
    }

    if (
      mentions("pay", "payment", "deposit", "full payment", "price", "cost")
    ) {
      return "You can either pay a deposit or choose a full payment option for the selected service on the Payment page.";
    }

    if (mentions("refund", "reschedule", "rescheduling", "policy", "credit")) {
      return knowledge.refundPolicy;
    }

    if (
      mentions(
        "what should i bring",
        "bring",
        "bring to class",
        "items",
        "requirements"
      )
    ) {
      return knowledge.bringItems;
    }

    if (mentions("beginner", "new shooter", "first time", "no experience")) {
      return knowledge.beginnerInfo;
    }

    if (mentions("certificate", "certification", "completion")) {
      return knowledge.certificate;
    }

    if (
      mentions("group", "private class", "private session", "organization", "team")
    ) {
      return knowledge.groupInfo;
    }

    if (mentions("phone", "email", "contact", "call", "text")) {
      return `You can contact Illinois Protective Services at ${knowledge.phone} or ${knowledge.email}.`;
    }

    if (
      mentions(
        "concealed carry law",
        "legal advice",
        "illinois law",
        "permit law"
      )
    ) {
      return "I can provide general training information, but I do not provide legal advice. For legal questions, consult the instructor or a qualified legal professional.";
    }

    if (mentions("which class", "best class", "recommend")) {
      return "For a quick option, the Mini Class may fit best. For a condensed structured session, choose the 3-Hour Class. For extended instruction, choose the 8-Hours Class Veteran or the 16-Hour Classes option depending on your needs.";
    }

    if (mentions("range", "range training")) {
      return "Range guidance may be included depending on the selected service. Review the class service details and confirm specifics with the instructor before class.";
    }

    if (mentions("hours")) {
      return `Current booking hours are ${knowledge.hours}`;
    }

    if (mentions("thank you", "thanks")) {
      return "You’re welcome. I’m here if you want help choosing the best class or understanding the booking steps.";
    }

    return `${knowledge.disclaimer} I can help with services, pricing, booking steps, date availability, payment options, what to bring, refund policy, and contact details.`;
  }

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = { role: "user", text: trimmed };
    const reply = getBroadResponse(trimmed);

    setMessages((prev) => [
      ...prev,
      userMessage,
      { role: "assistant", text: reply },
    ]);
    setInput("");
  }

  const quickQuestions = [
    "What classes are available?",
    "How much is each class?",
    "What should I bring?",
    "What is the refund policy?",
  ];

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
              <div className="border-b border-white/10 p-3">
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => {
                        setMessages((prev) => [
                          ...prev,
                          { role: "user", text: question },
                          {
                            role: "assistant",
                            text: getBroadResponse(question),
                          },
                        ]);
                      }}
                      className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-xs font-bold text-blue-300 hover:bg-blue-500/20"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

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
                    placeholder="Ask about classes, booking, prices, policy..."
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

export default function ConcealCarryTrainingWebsite() {
  const LOGO_SRC = "/ips-logo.png";
  const SQUARE_BOOKING_URL =
    "https://book.squareup.com/appointments/duxyj421attisk/location/LKSMBY77QKE4C";
  const SQUARE_DEPOSIT_URL = "https://square.link/u/qMU7S5Pb?src=sheet";
  const SQUARE_FULL_PAYMENT_URL = "https://square.link/u/qV8mK8e8?src=sheet";

  const [page, setPage] = useState("home");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("16hour");
  const [paymentChoice, setPaymentChoice] = useState("");
  const [submitted, setSubmitted] = useState(false);

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
      duration: "1 hr 30 min",
      description:
        "Short-format training session for quick instruction and focused skill development.",
      includes: [
        "Focused instruction",
        "Short-format class",
        "Beginner-friendly option",
        "Quick skills review",
      ],
    },
    {
      id: "3hour",
      title: "3-Hour Class",
      price: 150,
      duration: "3 hr",
      description:
        "A condensed training option for students needing a shorter structured class.",
      includes: [
        "Structured instruction",
        "Safety review",
        "Classroom training",
        "Professional guidance",
      ],
    },
    {
      id: "8hour-veteran",
      title: "8-Hours Class Veteran",
      price: 100,
      duration: "8 hr",
      description:
        "Veteran-focused 8-hour class option with extended instruction time.",
      includes: [
        "Extended class session",
        "Veteran pricing",
        "Safety instruction",
        "Hands-on guidance",
      ],
    },
    {
      id: "16hour",
      title: "16-Hour Classes",
      price: 225,
      duration: "16 hr",
      description:
        "Full-length concealed carry training option with complete instruction and class coverage.",
      includes: [
        "Full training session",
        "Extended classroom instruction",
        "Range guidance",
        "Completion pathway",
      ],
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

  function getSelectedService() {
    return classServices.find((service) => service.id === selectedService);
  }

  function formatPrice(amount) {
    return `$${amount.toFixed(2)}`;
  }

  function formatSelectedDate() {
    if (!selectedDate) return "No date selected";
    const found = availableDates.find((d) => d.value === selectedDate);
    return found ? found.label : selectedDate;
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

  function goToPaymentFromBooking() {
    if (!selectedService) {
      alert("Please choose a service first.");
      return;
    }
    if (!selectedDate || !selectedTime) {
      alert("Please choose both a date and time first.");
      return;
    }
    setPage("payment");
  }

  function goToClassesAfterPaymentChoice() {
    if (!paymentChoice) {
      alert("Please choose Deposit or Full Payment before moving forward.");
      return;
    }
    setPage("classes");
  }

  const NavBar = () => (
    <div className="sticky top-0 z-50 border-b border-red-900/40 bg-[linear-gradient(180deg,rgba(0,0,0,0.95),rgba(10,10,10,0.92))] backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between md:px-10 lg:px-12">
        <button
          type="button"
          onClick={() => setPage("home")}
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
          <button
            type="button"
            onClick={() => setPage("home")}
            className={navButtonClass}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => setPage("about")}
            className={navButtonClass}
          >
            About Us
          </button>
          <button
            type="button"
            onClick={() => setPage("booking")}
            className={navButtonClass}
          >
            Booking
          </button>
          <button
            type="button"
            onClick={() => setPage("payment")}
            className={navButtonClass}
          >
            Payment
          </button>
          <button
            type="button"
            onClick={() => setPage("classes")}
            className={navButtonClass}
          >
            Classes
          </button>
          <button
            type="button"
            onClick={() => setPage("contact")}
            className="rounded-full border border-red-500/40 bg-red-600 px-4 py-2 text-white shadow-[0_0_18px_rgba(220,38,38,0.25)] hover:bg-red-700 transition"
          >
            Contact
          </button>
        </div>
      </div>
    </div>
  );

  if (page === "about") {
    return (
      <div className="min-h-screen bg-black text-white">
        <NavBar />
        <AiHelperChat />

        <section className="mx-auto max-w-6xl px-6 py-16 md:px-10">
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
              want professional, structured instruction.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "Safety-first instruction",
                "Beginner-friendly guidance",
                "Professional classroom and range training",
                "Private group options available",
              ].map((item) => (
                <div key={item} className={cardClass}>
                  {item}
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
      <div className="min-h-screen bg-black text-white">
        <NavBar />
        <AiHelperChat />

        <section className="mx-auto max-w-6xl px-6 py-16 md:px-10">
          <div className="max-w-4xl">
            <div className="inline-flex rounded-full border border-red-500/20 bg-red-600/10 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-blue-300">
              Class Services
            </div>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.06em] sm:text-5xl">
              Available Services for Booking
            </h1>
            <p className="mt-4 text-lg leading-8 text-white/75">
              Browse all current services before starting or continuing your booking flow.
            </p>

            {(selectedDate || selectedTime || selectedService) && (
              <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-600/10 p-5 text-white">
                <div className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
                  Current Booking
                </div>
                <div className="mt-3 space-y-2">
                  <div>
                    <span className="font-bold">Service:</span>{" "}
                    {getSelectedService()?.title || "None selected"}
                  </div>
                  <div>
                    <span className="font-bold">Price:</span>{" "}
                    {formatPrice(getSelectedService()?.price || 0)}
                  </div>
                  <div>
                    <span className="font-bold">Date:</span> {formatSelectedDate()}
                  </div>
                  <div>
                    <span className="font-bold">Time:</span>{" "}
                    {selectedTime || "No time selected"}
                  </div>
                  <div>
                    <span className="font-bold">Payment choice:</span>{" "}
                    {paymentChoice || "Not selected yet"}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {classServices.map((service) => (
              <div key={service.id} className={cardClass}>
                <div className="inline-flex rounded-full border border-red-500/20 bg-red-600/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
                  Bookable Service
                </div>
                <h2 className="mt-4 text-2xl font-black uppercase">
                  {service.title}
                </h2>
                <p className="mt-4 leading-7 text-white/75">
                  {service.description}
                </p>

                <div className="mt-4 space-y-2 text-white/80">
                  <div>
                    <span className="font-bold">Duration:</span> {service.duration}
                  </div>
                  <div>
                    <span className="font-bold">Price:</span>{" "}
                    {formatPrice(service.price)}
                  </div>
                </div>

                <ul className="mt-5 space-y-2 text-white/80">
                  {service.includes.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedService(service.id);
                      setPage("booking");
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
                      setPage("contact");
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
    return (
      <div className="min-h-screen bg-black text-white">
        <NavBar />
        <AiHelperChat />

        <section className="mx-auto max-w-6xl px-6 py-16 md:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-red-500/20 bg-red-600/10 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-blue-300">
              Step 2
            </div>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.06em] sm:text-5xl">
              Select Date and Time
            </h1>
            <p className="mt-4 text-lg leading-8 text-white/75">
              Choose your available class date and preferred time frame before continuing to payment.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-600/10 p-5 text-white shadow-[0_12px_30px_rgba(0,0,0,0.28)]">
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
              Selected Service
            </div>
            <div className="mt-2 text-lg font-black">
              {getSelectedService()?.title || "No service selected"}
            </div>
            <div className="mt-1 text-white/80">
              {getSelectedService()?.duration} • {formatPrice(getSelectedService()?.price || 0)}
            </div>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className={cardClass}>
                <h2 className="text-xl font-black uppercase">Available Dates</h2>
                <p className="mt-3 text-white/70">
                  Monday through Friday availability is shown below. Weekends are unavailable.
                </p>

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
                <p className="mt-3 text-white/75">
                  Select your preferred class time frame.
                </p>

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
                Booking Summary
              </div>

              <h2 className="mt-4 text-2xl font-black uppercase">
                Confirm Availability
              </h2>

              <div className="mt-6 space-y-4 text-white/80">
                <div>
                  <div className="text-sm uppercase tracking-[0.18em] text-white/50">
                    Service
                  </div>
                  <div className="mt-1 text-lg font-bold">
                    {getSelectedService()?.title || "No service selected"}
                  </div>
                </div>

                <div>
                  <div className="text-sm uppercase tracking-[0.18em] text-white/50">
                    Price
                  </div>
                  <div className="mt-1 text-lg font-bold">
                    {formatPrice(getSelectedService()?.price || 0)}
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
                    Time Frame
                  </div>
                  <div className="mt-1 text-lg font-bold">
                    {selectedTime || "No time selected"}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={goToPaymentFromBooking}
                  className="mt-4 w-full rounded-2xl border border-red-500/40 bg-red-600 px-6 py-4 text-center text-base font-black uppercase tracking-[0.16em] text-white shadow-[0_0_24px_rgba(220,38,38,0.18)] transition hover:bg-red-700"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (page === "payment") {
    return (
      <div className="min-h-screen bg-black text-white">
        <NavBar />
        <AiHelperChat />

        <section className="mx-auto max-w-5xl px-6 py-16 md:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-red-500/20 bg-red-600/10 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-blue-300">
              Step 3
            </div>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.06em] sm:text-5xl">
              Complete Payment
            </h1>
            <p className="mt-4 text-lg leading-8 text-white/75">
              Choose Deposit or a Full Payment option for your selected service.
            </p>
          </div>

          <div className="mt-10 space-y-6">
            <div className="rounded-2xl border border-red-500/20 bg-red-600/10 p-5 text-white shadow-[0_12px_30px_rgba(0,0,0,0.28)]">
              <div className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
                Selected Booking
              </div>
              <div className="mt-3 space-y-2">
                <div>
                  <span className="font-bold">Service:</span>{" "}
                  {getSelectedService()?.title}
                </div>
                <div>
                  <span className="font-bold">Duration:</span>{" "}
                  {getSelectedService()?.duration}
                </div>
                <div>
                  <span className="font-bold">Price:</span>{" "}
                  {formatPrice(getSelectedService()?.price || 0)}
                </div>
                <div>
                  <span className="font-bold">Date:</span> {formatSelectedDate()}
                </div>
                <div>
                  <span className="font-bold">Time:</span>{" "}
                  {selectedTime || "No time selected"}
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              <div className={cardClass}>
                <h2 className="text-2xl font-black uppercase">Pay Deposit</h2>
                <p className="mt-3 text-white/70">
                  Reserve your class with a deposit.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentChoice("deposit");
                    window.open(
                      SQUARE_DEPOSIT_URL,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }}
                  className="mt-6 block w-full rounded-xl border border-red-500/40 bg-red-600 py-4 text-center font-black uppercase tracking-[0.14em] text-white hover:bg-red-700"
                >
                  Pay Deposit
                </button>
              </div>

              <div className={cardClass}>
                <h2 className="text-2xl font-black uppercase">
                  Full Payment Options
                </h2>
                <p className="mt-3 text-white/70">
                  Choose the full payment option for your selected service.
                </p>

                <div className="mt-6 grid gap-3">
                  {classServices.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => {
                        setSelectedService(service.id);
                        setPaymentChoice(`full-${service.id}`);
                        window.open(
                          SQUARE_FULL_PAYMENT_URL,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      }}
                      className={`rounded-2xl border px-4 py-4 text-left transition ${
                        selectedService === service.id
                          ? "border-blue-500/40 bg-blue-500/10 text-blue-300"
                          : "border-white/15 bg-white/[0.03] text-white hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="text-base font-black uppercase">
                            {service.title}
                          </div>
                          <div className="mt-1 text-sm text-white/70">
                            {service.duration}
                          </div>
                        </div>
                        <div className="text-base font-black">
                          {formatPrice(service.price)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className={cardClass}>
                <h2 className="text-2xl font-black uppercase">
                  Optional Next Step
                </h2>
                <p className="mt-3 text-white/70">
                  After choosing Deposit or one of the Full Payment service options,
                  you can continue to the Classes page to review all services again.
                </p>
                <div className="mt-4 text-sm uppercase tracking-[0.18em] text-blue-300">
                  Current payment choice: {paymentChoice || "None selected"}
                </div>
                <button
                  type="button"
                  onClick={goToClassesAfterPaymentChoice}
                  className="mt-6 rounded-2xl border border-red-500/40 bg-red-600 px-6 py-4 text-base font-black uppercase tracking-[0.16em] text-white shadow-[0_0_24px_rgba(220,38,38,0.18)] hover:bg-red-700"
                >
                  Continue to Classes
                </button>
              </div>
            </div>
          </div>
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
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-red-500/20 bg-red-600/10 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-blue-300">
              Contact
            </div>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.06em] sm:text-5xl">
              Reach Out to Our Team
            </h1>
            <p className="mt-4 text-lg leading-8 text-white/75">
              Call, email, or send a quick message to get started.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
            <div className={cardClass}>
              <h2 className="text-2xl font-black uppercase">Contact Details</h2>
              <div className="mt-6 space-y-4 text-lg text-white/85">
                <p>
                  <span className="font-bold text-white">Phone:</span> (224)
                  248-7021
                </p>
                <p className="break-all">
                  <span className="font-bold text-white">Email:</span>{" "}
                  info@illinoisprotectiveservices.com
                </p>
              </div>

              <a
                href={SQUARE_BOOKING_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-block rounded-xl border border-red-500/40 bg-red-600 px-6 py-4 font-black uppercase tracking-[0.14em] text-white shadow-[0_0_24px_rgba(220,38,38,0.18)] hover:bg-red-700"
              >
                Book Now
              </a>
            </div>

            <div className={cardClass}>
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
                  <option>3-Hour Class</option>
                  <option>8-Hours Class Veteran</option>
                  <option>16-Hour Classes</option>
                </select>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="min-h-[140px] rounded-2xl border border-white/15 bg-black/20 px-5 py-4 text-white placeholder:text-white/40 outline-none"
                  placeholder="Questions or preferred class dates"
                />
                <button
                  type="button"
                  onClick={handleFormSubmit}
                  className="rounded-2xl border border-red-500/40 bg-red-600 px-6 py-4 text-lg font-black uppercase tracking-[0.16em] text-white shadow-[0_0_24px_rgba(220,38,38,0.18)] transition hover:bg-red-700"
                >
                  Send Request
                </button>

                {submitted && (
                  <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 px-5 py-4 font-bold text-blue-300">
                    Request submitted successfully.
                  </div>
                )}
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

          <h1 className="mx-auto max-w-5xl text-5xl font-black uppercase tracking-[0.06em] text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.5)] sm:text-6xl lg:text-7xl">
            Clear Training. Simple Booking. Professional Instruction.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/75 sm:text-xl">
            Concealed carry training with weekday scheduling, guided instruction,
            and a simple path from booking to payment.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => setPage("classes")}
              className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-6 py-4 text-center text-lg font-black uppercase tracking-[0.16em] text-blue-300 transition hover:bg-blue-500/20"
            >
              View Class Services
            </button>
            <button
              type="button"
              onClick={() => setPage("booking")}
              className="rounded-2xl border border-red-500/40 bg-red-600 px-6 py-4 text-center text-lg font-black uppercase tracking-[0.16em] text-white shadow-[0_0_24px_rgba(220,38,38,0.18)] transition hover:-translate-y-0.5 hover:bg-red-700"
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
            "Certificate provided",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-4 text-base font-medium text-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.22)]"
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
              Book in Four Simple Steps
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {[
              {
                step: "1",
                title: "View Services",
                text: "See all available classes before making a choice.",
              },
              {
                step: "2",
                title: "Select Date & Time",
                text: "Choose your preferred available class date and time frame.",
              },
              {
                step: "3",
                title: "Choose Payment",
                text: "Select Deposit or Full Payment on the payment page.",
              },
              {
                step: "4",
                title: "Complete Booking",
                text: "Finish your payment and prepare for class.",
              },
            ].map((item) => (
              <div key={item.step} className={cardClass}>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-xl font-black text-white">
                  {item.step}
                </div>
                <h3 className="mt-5 text-2xl font-black uppercase">
                  {item.title}
                </h3>
                <p className="mt-3 leading-7 text-white/75">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-300">
              Start Here
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase sm:text-4xl">
              Mission Ready Training
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-white/75">
              Browse services first, then choose your class date and time.
              When ready, continue to payment.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.55)]">
            <div className="rounded-[1.5rem] border border-red-500/20 bg-[linear-gradient(180deg,#090909_0%,#10151b_100%)] p-6 text-center">
              <div className="mb-4 inline-flex rounded-full border border-red-500/30 bg-red-600 px-3 py-1 text-sm font-black uppercase tracking-[0.18em] text-white">
                Enrollment Open
              </div>

              <h3 className="text-3xl font-black uppercase tracking-[0.08em] text-white">
                Book Your Training
              </h3>

              <div className="mt-6 space-y-4 text-white/80">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm uppercase tracking-[0.18em] text-white/50">
                    Starting Price
                  </div>
                  <div className="mt-1 text-4xl font-black text-blue-300">
                    $50.00
                  </div>
                </div>

                <div className="grid gap-3">
                  <button
                    type="button"
                    onClick={() => setPage("classes")}
                    className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-4 py-4 text-center text-base font-black uppercase tracking-[0.14em] text-blue-300 transition hover:bg-blue-500/20"
                  >
                    View Class Services
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage("booking")}
                    className="rounded-2xl border border-red-500/40 bg-red-600 px-4 py-4 text-center text-base font-black uppercase tracking-[0.14em] text-white shadow-[0_0_24px_rgba(220,38,38,0.18)] transition hover:-translate-y-0.5 hover:bg-red-700"
                  >
                    Book Class
                  </button>
                </div>

                <div className="rounded-2xl border border-red-500/20 bg-red-600/10 p-4 text-sm leading-7 text-white/90">
                  Customers can view all class services anytime. Booking still
                  requires choosing a service, date, time, and payment.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:px-10">
        <div className="rounded-[2rem] border border-red-500/20 bg-red-600/10 p-8 shadow-[0_12px_30px_rgba(0,0,0,0.28)]">
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
                <span className="font-bold text-white">Phone:</span> (224)
                248-7021
              </p>
              <p className="break-all">
                <span className="font-bold text-white">Email:</span>{" "}
                info@illinoisprotectiveservices.com
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPage("contact")}
              className="mt-8 rounded-xl border border-red-500/40 bg-red-600 px-6 py-4 font-black uppercase tracking-[0.14em] text-white shadow-[0_0_24px_rgba(220,38,38,0.18)] hover:bg-red-700"
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