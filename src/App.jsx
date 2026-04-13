import { useState } from "react";

function AiHelperChat() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Welcome. I can help with booking, payment, class times, and contact details.",
    },
  ]);

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = { role: "user", text: trimmed };
    let reply =
      "I can help with booking, payment, class details, and contact information.";

    const lower = trimmed.toLowerCase();

    if (
      lower.includes("book") ||
      lower.includes("schedule") ||
      lower.includes("date")
    ) {
      reply =
        "Use the Booking page to choose your date and time, then continue to payment.";
    } else if (
      lower.includes("pay") ||
      lower.includes("deposit") ||
      lower.includes("fee")
    ) {
      reply =
        "Use the Payment page to choose Deposit or Full Payment. Your Square links are already connected.";
    } else if (lower.includes("price") || lower.includes("cost")) {
      reply = "The current range fee shown on the site is $75.";
    } else if (
      lower.includes("contact") ||
      lower.includes("phone") ||
      lower.includes("email")
    ) {
      reply =
        "You can contact Illinois Protective Services at (224) 248-7021 or info@illinoisprotectiveservices.com.";
    } else if (lower.includes("hours") || lower.includes("time")) {
      reply =
        "Booking times are Monday through Friday from 9:00 AM to 5:00 PM.";
    } else if (
      lower.includes("where") ||
      lower.includes("location") ||
      lower.includes("address")
    ) {
      reply =
        "Use the Contact page to request location details or contact the instructor directly before class.";
    }

    setMessages((prev) => [
      ...prev,
      userMessage,
      { role: "assistant", text: reply },
    ]);
    setInput("");
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {open && (
        <div className="mb-4 w-[360px] overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,#050505_0%,#0b1016_100%)] shadow-[0_25px_70px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between border-b border-red-500/20 bg-[linear-gradient(90deg,#7f1d1d_0%,#0f172a_100%)] px-5 py-4 text-white">
            <div>
              <div className="text-sm font-black uppercase tracking-[0.22em]">
                AI Navigator
              </div>
              <div className="text-xs font-semibold text-white/80">
                Booking, payment, and class support
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
                    placeholder="Ask about booking or payment..."
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
  const SQUARE_BOOKING_URL =
    "https://book.squareup.com/appointments/duxyj421attisk/location/LKSMBY77QKE4C";
  const SQUARE_DEPOSIT_URL = "https://square.link/u/qMU7S5Pb?src=sheet";
  const SQUARE_FULL_PAYMENT_URL = "https://square.link/u/qV8mK8e8?src=sheet";

  const [page, setPage] = useState("home");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
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

  const trainingOptions = [
    {
      title: "Illinois CCW Training",
      description: "Complete instruction, safety guidance, and range training.",
    },
    {
      title: "Private Group Sessions",
      description: "Book families, organizations, or private groups together.",
    },
    {
      title: "Refresher Training",
      description: "Sharpen handling, confidence, and practical skills.",
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
  ];

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

  const NavBar = () => (
    <div className="sticky top-0 z-50 border-b border-red-900/40 bg-[linear-gradient(180deg,rgba(0,0,0,0.95),rgba(10,10,10,0.92))] backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between md:px-10 lg:px-12">
        <button
          type="button"
          onClick={() => setPage("home")}
          className="text-left text-lg font-black uppercase tracking-[0.2em] text-white"
        >
          Illinois Protective Services
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

  if (page === "booking") {
    return (
      <div className="min-h-screen bg-black text-white">
        <NavBar />
        <AiHelperChat />

        <section className="mx-auto max-w-6xl px-6 py-16 md:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-red-500/20 bg-red-600/10 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-blue-300">
              Step 1
            </div>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.06em] sm:text-5xl">
              Choose Your Class Date
            </h1>
            <p className="mt-4 text-lg leading-8 text-white/75">
              Pick an available weekday and select your preferred time.
            </p>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
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
                  Available Times
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
                Step 2
              </div>
              <h2 className="mt-4 text-2xl font-black uppercase">
                Confirm Your Selection
              </h2>
              <div className="mt-6 space-y-4 text-white/80">
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
                    if (selectedDate && selectedTime) setPage("payment");
                  }}
                  disabled={!selectedDate || !selectedTime}
                  className="mt-4 w-full rounded-2xl border border-red-500/40 bg-red-600 px-6 py-4 text-center text-base font-black uppercase tracking-[0.16em] text-white shadow-[0_0_24px_rgba(220,38,38,0.18)] transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue to Payment
                </button>
                <a
                  href={SQUARE_BOOKING_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full rounded-2xl border border-blue-500/30 bg-blue-500/10 px-6 py-4 text-center text-base font-black uppercase tracking-[0.16em] text-blue-300 transition hover:bg-blue-500/20"
                >
                  Book with Square Instead
                </a>
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

        <section className="mx-auto max-w-4xl px-6 py-16 md:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-red-500/20 bg-red-600/10 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-blue-300">
              Step 2
            </div>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.06em] sm:text-5xl">
              Complete Payment
            </h1>
            <p className="mt-4 text-lg leading-8 text-white/75">
              Secure your seat by choosing a deposit or full payment option.
            </p>
          </div>

          <div className="mt-10 space-y-6">
            <div className="rounded-2xl border border-red-500/20 bg-red-600/10 p-5 text-white shadow-[0_12px_30px_rgba(0,0,0,0.28)]">
              <div className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
                Selected Appointment
              </div>
              <div className="mt-2 text-lg font-black">
                {formatSelectedDate()}
              </div>
              <div className="mt-1 text-white/90">
                {selectedTime || "No time selected"}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className={cardClass}>
                <h2 className="text-2xl font-black uppercase">Pay Deposit</h2>
                <p className="mt-3 text-white/70">
                  Reserve your class with a deposit.
                </p>
                <a
                  href={SQUARE_DEPOSIT_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 block rounded-xl border border-red-500/40 bg-red-600 py-4 text-center font-black uppercase tracking-[0.14em] text-white hover:bg-red-700"
                >
                  Pay Deposit
                </a>
              </div>

              <div className={cardClass}>
                <h2 className="text-2xl font-black uppercase">Pay Full Fee</h2>
                <p className="mt-3 text-white/70">
                  Pay the full class fee upfront.
                </p>
                <a
                  href={SQUARE_FULL_PAYMENT_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 block rounded-xl border border-blue-500/30 bg-blue-500/10 py-4 text-center font-black uppercase tracking-[0.14em] text-blue-300 hover:bg-blue-500/20"
                >
                  Pay Full Fee
                </a>
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
                  <option>Illinois CCW Training</option>
                  <option>Private Group Session</option>
                  <option>Refresher & Skills Practice</option>
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
          <div className="mb-4 inline-flex items-center rounded-full border border-red-500/30 bg-red-600/10 px-4 py-2 text-sm font-semibold tracking-[0.22em] text-blue-300 uppercase">
            Illinois Concealed Carry Training
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
              onClick={() => setPage("booking")}
              className="rounded-2xl border border-red-500/40 bg-red-600 px-6 py-4 text-center text-lg font-black uppercase tracking-[0.16em] text-white shadow-[0_0_24px_rgba(220,38,38,0.18)] transition hover:-translate-y-0.5 hover:bg-red-700"
            >
              Book Class
            </button>
            <button
              type="button"
              onClick={() => setPage("contact")}
              className="rounded-2xl border border-white/15 bg-white/[0.03] px-6 py-4 text-center text-lg font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
            >
              Contact Us
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
              Book in Three Simple Steps
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Choose Date",
                text: "Pick a weekday and choose your preferred class time.",
              },
              {
                step: "2",
                title: "Complete Payment",
                text: "Use deposit or full payment to secure your training slot.",
              },
              {
                step: "3",
                title: "Attend Class",
                text: "Arrive prepared and complete your instruction and range time.",
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
              Choose the booking path that works best for you. Use the Booking
              page for date selection, or go directly to Square.
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
                    Range Fee
                  </div>
                  <div className="mt-1 text-4xl font-black text-blue-300">
                    $75
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm uppercase tracking-[0.18em] text-white/50">
                    Contact
                  </div>
                  <div className="mt-1 text-xl font-bold">(224) 248-7021</div>
                  <div className="break-all text-base">
                    info@illinoisprotectiveservices.com
                  </div>
                </div>

                <div className="grid gap-3">
                  <button
                    type="button"
                    onClick={() => setPage("booking")}
                    className="rounded-2xl border border-red-500/40 bg-red-600 px-4 py-4 text-center text-base font-black uppercase tracking-[0.14em] text-white shadow-[0_0_24px_rgba(220,38,38,0.18)] transition hover:-translate-y-0.5 hover:bg-red-700"
                  >
                    Book Class
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage("contact")}
                    className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-4 py-4 text-center text-base font-black uppercase tracking-[0.14em] text-blue-300 transition hover:bg-blue-500/20"
                  >
                    Ask a Question
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="mx-auto max-w-6xl px-6 py-16 md:px-10"
        id="classes"
      >
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-400">
            Training Options
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase sm:text-4xl">
            Choose the Right Format
          </h2>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {trainingOptions.map((option) => (
            <div key={option.title} className={cardClass}>
              <div className="inline-flex rounded-full border border-red-500/20 bg-red-600/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
                Training
              </div>
              <h3 className="mt-4 text-2xl font-black uppercase">
                {option.title}
              </h3>
              <p className="mt-4 leading-7 text-white/75">
                {option.description}
              </p>
            </div>
          ))}
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