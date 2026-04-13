import { useMemo, useState } from "react";

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
        "Go to the Booking page to choose a date and time, or use the Book with Square button for direct scheduling.";
    } else if (
      lower.includes("pay") ||
      lower.includes("deposit") ||
      lower.includes("fee")
    ) {
      reply =
        "Use the Payment page to choose Deposit or Full Payment. Your Square links are already connected.";
    } else if (lower.includes("price") || lower.includes("cost")) {
      reply = "The current range fee displayed on the site is $75.";
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
      lower.includes("location") ||
      lower.includes("where") ||
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

  const upcomingDates = useMemo(() => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 21; i += 1) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const day = date.getDay();

      dates.push({
        value: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        }),
        isWeekend: day === 0 || day === 6,
      });
    }

    return dates;
  }, []);

  const highlights = [
    "Expert instruction with hands-on range training",
    "Certificate provided upon completion",
    "Flexible class times for busy schedules",
    "Discounts available for veterans and groups",
  ];

  const classOptions = [
    {
      title: "Illinois CCW Training",
      description:
        "A structured class covering firearm safety, legal responsibilities, mindset, and practical range instruction.",
      badge: "Primary Course",
    },
    {
      title: "Private Group Sessions",
      description:
        "Book a private training date for families, church groups, security teams, or community organizations.",
      badge: "Team Training",
    },
    {
      title: "Refresher & Skills Practice",
      description:
        "For prior students wanting to sharpen safe handling, confidence, and accuracy with guided coaching.",
      badge: "Skill Sustainment",
    },
  ];

  const steps = [
    "Choose your class date and submit your registration request.",
    "Receive class details, requirements, and confirmation by text or email.",
    "Attend instruction and complete the required range portion.",
    "Receive your completion certificate and next-step guidance.",
  ];

  const faqs = [
    {
      q: "Do I need prior experience?",
      a: "No. Classes can be beginner-friendly while still providing value for experienced attendees.",
    },
    {
      q: "Is registration required?",
      a: "Yes. Space is limited, so advance registration is recommended for every class.",
    },
    {
      q: "What should I bring?",
      a: "After registration, students receive a checklist with required ID, safety expectations, and range-related details.",
    },
    {
      q: "Are discounts available?",
      a: "Yes. Veterans and group bookings can qualify for discounted pricing.",
    },
  ];

  const testimonialData = [
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
    {
      name: "Anthony K.",
      text: "Worth every dollar. Organized, professional, and real-world training.",
    },
  ];

  function formatSelectedDate() {
    if (!selectedDate) return "No date selected";
    return new Date(`${selectedDate}T12:00:00`).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }

  function handleFormSubmit() {
    if (!formData.name || !formData.email || !formData.phone || !formData.type) {
      alert("Please fill out your name, phone, email, and training type.");
      return;
    }

    console.log("Registration submitted:", formData);
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

        <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="inline-flex rounded-full border border-red-500/20 bg-red-600/10 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-blue-300">
                About Us
              </div>

              <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.06em] sm:text-5xl lg:text-6xl">
                Professional Training Built on Safety, Confidence, and Responsibility
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">
                Illinois Protective Services provides concealed carry training
                designed for responsible gun owners, first-time students,
                returning students, and private groups who want structured
                instruction and a professional learning environment.
              </p>

              <p className="mt-4 max-w-3xl text-lg leading-8 text-white/75">
                Our goal is to help students understand safe firearm handling,
                legal awareness, decision-making, and practical confidence while
                creating a smooth path from registration to booking and payment.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  "Safety-first training approach",
                  "Beginner-friendly instruction",
                  "Professional classroom and range guidance",
                  "Private group options available",
                ].map((item) => (
                  <div key={item} className={cardClass}>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className={cardClass}>
                <h2 className="text-2xl font-black uppercase">Our Mission</h2>
                <p className="mt-4 leading-8 text-white/75">
                  To provide quality concealed carry training that is practical,
                  respectful, and focused on helping students become more
                  informed, prepared, and confident.
                </p>
              </div>

              <div className={cardClass}>
                <h2 className="text-2xl font-black uppercase">Who We Serve</h2>
                <ul className="mt-5 space-y-3 text-white/75">
                  <li>• First-time concealed carry students</li>
                  <li>• Experienced gun owners seeking formal instruction</li>
                  <li>• Families and church groups</li>
                  <li>• Private sessions and group training requests</li>
                </ul>
              </div>

              <div className="rounded-[2rem] border border-red-500/20 bg-red-600/10 p-7 shadow-[0_12px_30px_rgba(0,0,0,0.28)]">
                <h2 className="text-2xl font-black uppercase text-blue-300">
                  Contact Our Team
                </h2>
                <div className="mt-5 space-y-3 text-white/90">
                  <p>
                    <span className="font-bold">Phone:</span> (224) 248-7021
                  </p>
                  <p className="break-all">
                    <span className="font-bold">Email:</span>{" "}
                    info@illinoisprotectiveservices.com
                  </p>
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setPage("booking")}
                    className="rounded-2xl border border-white/15 bg-white/[0.03] px-5 py-3 font-black uppercase tracking-[0.14em] text-white hover:bg-white/10"
                  >
                    Book a Class
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage("home")}
                    className="rounded-2xl border border-red-500/40 bg-red-600 px-5 py-3 font-black uppercase tracking-[0.14em] text-white hover:bg-red-700"
                  >
                    Go to Home
                  </button>
                </div>
              </div>
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

        <div className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <div className="inline-flex rounded-full border border-red-500/20 bg-red-600/10 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-blue-300">
                  Training Schedule
                </div>

                <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.06em] sm:text-5xl">
                  Choose Your Class Date
                </h1>

                <p className="mt-4 max-w-2xl text-lg leading-8 text-white/75">
                  Pick an available weekday on the calendar, then choose a
                  training time between 9:00 AM and 5:00 PM before making your
                  payment.
                </p>

                <div className={cardClass + " mt-8"}>
                  <label className="text-sm font-bold uppercase tracking-[0.2em] text-red-400">
                    Select Date
                  </label>

                  <p className="mt-4 text-sm leading-7 text-white/60">
                    Weekday appointments are available Monday through Friday
                    only.
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {upcomingDates.map((date) => (
                      <button
                        key={date.value}
                        type="button"
                        onClick={() => {
                          if (!date.isWeekend) setSelectedDate(date.value);
                        }}
                        disabled={date.isWeekend}
                        className={`rounded-2xl border px-4 py-4 text-left text-sm font-black uppercase tracking-[0.12em] transition ${
                          date.isWeekend
                            ? "cursor-not-allowed border-white/10 bg-white/5 text-white/30 line-through"
                            : selectedDate === date.value
                              ? "border-red-500 bg-red-600 text-white"
                              : "border-white/15 bg-white/[0.03] text-white hover:bg-white/10"
                        }`}
                      >
                        <div>{date.label}</div>
                        <div className="mt-2 text-xs font-bold tracking-[0.2em]">
                          {date.isWeekend ? "Unavailable" : "Available"}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-8 rounded-[2rem] border border-red-500/20 bg-blue-500/10 p-6 shadow-[0_12px_30px_rgba(0,0,0,0.28)]">
                  <h2 className="text-2xl font-black uppercase text-blue-300">
                    Available Times
                  </h2>
                  <p className="mt-3 text-white/90">
                    Choose a time slot from 9:00 AM through 5:00 PM.
                  </p>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

                <div className={cardClass + " mt-8"}>
                  <h2 className="text-2xl font-black uppercase">
                    Selected Appointment
                  </h2>
                  <p className="mt-4 text-white/75">
                    {selectedDate ? formatSelectedDate() : "No date selected yet."}
                  </p>
                  <p className="mt-2 text-white/75">
                    {selectedTime ? selectedTime : "No time selected yet."}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedDate && selectedTime) setPage("payment");
                    }}
                    className="mt-6 rounded-2xl border border-red-500/40 bg-red-600 px-6 py-4 text-center text-base font-black uppercase tracking-[0.16em] text-white shadow-[0_0_24px_rgba(220,38,38,0.18)] transition hover:-translate-y-0.5 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!selectedDate || !selectedTime}
                  >
                    Continue to Payment
                  </button>
                </div>

                <div className="mt-10">
                  <h2 className="mb-4 text-2xl font-black uppercase">
                    Training Highlights
                  </h2>
                  <p className="mb-6 text-white/70">
                    Real students completing concealed carry training and range
                    instruction.
                  </p>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="flex aspect-square items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-sm text-white/40 shadow-[0_12px_30px_rgba(0,0,0,0.22)]"
                      >
                        Add Photo
                      </div>
                    ))}
                  </div>

                  <div className="mt-10">
                    <h3 className="mb-4 text-2xl font-black uppercase">
                      Student Testimonials
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {testimonialData.map((t) => (
                        <div key={t.name} className={cardClass}>
                          <p className="leading-7 text-white/80">“{t.text}”</p>
                          <div className="mt-4 text-sm font-bold uppercase tracking-[0.14em] text-blue-300">
                            — {t.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className={cardClass}>
                  <h2 className="text-2xl font-black uppercase">Booking Details</h2>
                  <ul className="mt-5 space-y-3 text-white/75">
                    <li>• Select a weekday date that works best for your schedule.</li>
                    <li>• Available booking hours are Monday through Friday, 9:00 AM to 5:00 PM.</li>
                    <li>• After choosing a date and time, continue to payment to secure your class.</li>
                    <li>• Replace these sample availability settings with your live calendar later.</li>
                  </ul>
                </div>

                <div className="rounded-[2rem] border border-red-500/20 bg-red-600/10 p-7 shadow-[0_12px_30px_rgba(0,0,0,0.28)]">
                  <h2 className="text-2xl font-black uppercase text-blue-300">
                    Need a Private Session?
                  </h2>
                  <p className="mt-4 leading-8 text-white/90">
                    For church groups, families, or private classes, contact
                    Illinois Protective Services to request a custom date.
                  </p>
                  <div className="mt-5 space-y-2 text-white/90">
                    <p>
                      <span className="font-bold">Phone:</span> (224) 248-7021
                    </p>
                    <p className="break-all">
                      <span className="font-bold">Email:</span>{" "}
                      info@illinoisprotectiveservices.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (page === "contact") {
    return (
      <div className="min-h-screen bg-black text-white">
        <NavBar />
        <AiHelperChat />

        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h1 className="text-4xl font-black uppercase tracking-[0.06em]">
            Contact Us
          </h1>

          <p className="mt-6 text-white/70">
            Reach out to book your class or ask questions.
          </p>

          <div className="mt-10 space-y-3 text-lg">
            <p>
              <strong>Phone:</strong> (224) 248-7021
            </p>
            <p>
              <strong>Email:</strong> info@illinoisprotectiveservices.com
            </p>
          </div>

          <a
            href={SQUARE_BOOKING_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-block rounded-xl border border-red-500/40 bg-red-600 px-6 py-4 font-black uppercase tracking-[0.14em] text-white shadow-[0_0_24px_rgba(220,38,38,0.18)] hover:bg-red-700"
          >
            Book Now
          </a>
        </div>
      </div>
    );
  }

  if (page === "payment") {
    return (
      <div className="min-h-screen bg-black text-white">
        <NavBar />
        <AiHelperChat />

        <div className="px-6 py-16">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-6 text-4xl font-black uppercase tracking-[0.06em]">
              Secure Your Training Slot
            </h1>

            <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-600/10 p-5 text-white shadow-[0_12px_30px_rgba(0,0,0,0.28)]">
              <div className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
                Selected Appointment
              </div>
              <div className="mt-2 text-lg font-black text-white">
                {formatSelectedDate()}
              </div>
              <div className="mt-1 text-white/90">
                {selectedTime || "No time selected"}
              </div>
            </div>

            <div className="grid gap-6">
              <div className="rounded-2xl border border-red-500/20 bg-blue-500/10 p-6 text-center shadow-[0_12px_30px_rgba(0,0,0,0.28)]">
                <h2 className="mb-2 text-2xl font-black uppercase text-blue-300">
                  Need to Change Your Date?
                </h2>
                <a
                  href={SQUARE_BOOKING_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block rounded-xl border border-white/20 bg-black px-6 py-3 font-black uppercase tracking-[0.14em] text-white transition hover:bg-white/10"
                >
                  View Dates in Square
                </a>
              </div>

              <div className={cardClass}>
                <h2 className="mb-3 text-2xl font-black">Deposit Option</h2>
                <p className="mb-4 text-white/70">Secure your seat with a deposit.</p>
                <a
                  href={SQUARE_DEPOSIT_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl border border-red-500/40 bg-red-600 py-4 text-center font-black uppercase tracking-[0.14em] text-white hover:bg-red-700"
                >
                  Pay Deposit
                </a>
              </div>

              <div className={cardClass}>
                <h2 className="mb-3 text-2xl font-black">Full Payment</h2>
                <p className="mb-4 text-white/70">Pay the full class fee upfront.</p>
                <a
                  href={SQUARE_FULL_PAYMENT_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl border border-blue-500/30 bg-blue-500/10 py-4 text-center font-black uppercase tracking-[0.14em] text-blue-300 hover:bg-blue-500/20"
                >
                  Pay Full Fee
                </a>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="mb-4 text-2xl font-black uppercase">
                Student Testimonials
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {testimonialData.map((t) => (
                  <div key={t.name} className={cardClass}>
                    <p className="leading-7 text-white/80">“{t.text}”</p>
                    <div className="mt-4 text-sm font-bold uppercase tracking-[0.14em] text-blue-300">
                      — {t.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
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

        <div className="relative mx-auto max-w-7xl px-6 py-16 text-center md:px-10 lg:px-12 lg:py-24">
          <div className="mb-4 inline-flex items-center rounded-full border border-red-500/30 bg-red-600/10 px-4 py-2 text-sm font-semibold tracking-[0.22em] text-blue-300 uppercase">
            Illinois Concealed Carry Training
          </div>

          <h1 className="mx-auto max-w-5xl text-5xl font-black uppercase tracking-[0.06em] text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.5)] sm:text-6xl lg:text-7xl">
            Train With Confidence. Carry With Responsibility.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/75 sm:text-xl">
            Professional concealed carry training with practical instruction,
            range experience, completion certificates, and convenient scheduling
            for individuals and groups.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => setPage("contact")}
              className="rounded-2xl border border-red-500/40 bg-red-600 px-6 py-4 text-center text-lg font-black uppercase tracking-[0.16em] text-white shadow-[0_0_24px_rgba(220,38,38,0.18)] transition hover:-translate-y-0.5 hover:bg-red-700"
            >
              Register Now
            </button>
            <a
              href="#classes"
              className="rounded-2xl border border-white/15 bg-white/[0.03] px-6 py-4 text-center text-lg font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
            >
              View Classes
            </a>
            <a
              href={SQUARE_BOOKING_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-6 py-4 text-center text-lg font-black uppercase tracking-[0.16em] text-blue-300 transition hover:bg-blue-500/20"
            >
              Book with Square
            </a>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
            {highlights.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-4 text-base font-medium text-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.22)] backdrop-blur"
              >
                <span className="mr-2 text-blue-400">★</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 md:px-10 lg:px-12">
        <div className="flex justify-center">
          <div className="sticky top-24 w-full max-w-md rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl">
            <div className="rounded-[1.5rem] border border-red-500/20 bg-[linear-gradient(180deg,#090909_0%,#10151b_100%)] p-6 text-center">
              <div className="mb-4 inline-flex rounded-full border border-red-500/30 bg-red-600 px-3 py-1 text-sm font-black uppercase tracking-[0.18em] text-white">
                Enrollment Open
              </div>

              <h2 className="text-3xl font-black uppercase tracking-[0.08em] text-white">
                Mission Ready Training
              </h2>

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

                <div className="grid gap-3 sm:grid-cols-2">
                  <a
                    href={SQUARE_BOOKING_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-red-500/40 bg-red-600 px-4 py-4 text-center text-base font-black uppercase tracking-[0.14em] text-white shadow-[0_0_24px_rgba(220,38,38,0.18)] transition hover:-translate-y-0.5 hover:bg-red-700"
                  >
                    Book with Square
                  </a>
                  <a
                    href={SQUARE_BOOKING_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-4 py-4 text-center text-base font-black uppercase tracking-[0.14em] text-blue-300 transition hover:bg-blue-500/20"
                  >
                    View Availability
                  </a>
                </div>

                <div className="rounded-2xl border border-red-500/20 bg-red-600/10 p-4 text-sm leading-7 text-white/90">
                  Limited class size. Early registration is strongly recommended.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12"
        id="classes"
      >
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-400">
              Training Options
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase sm:text-4xl">
              Choose the Right Class Format
            </h2>
          </div>
          <p className="max-w-2xl text-white/70">
            Built for first-time students, experienced gun owners seeking formal
            training, and private groups needing a professional instructor-led
            experience.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {classOptions.map((option) => (
            <div key={option.title} className={cardClass}>
              <div className="inline-flex rounded-full border border-red-500/20 bg-red-600/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
                {option.badge}
              </div>
              <h3 className="mt-4 text-2xl font-black uppercase">
                {option.title}
              </h3>
              <p className="mt-4 leading-7 text-white/75">
                {option.description}
              </p>
              <button
                type="button"
                onClick={() => setPage("contact")}
                className="mt-6 inline-block rounded-2xl border border-white/15 bg-white/[0.03] px-5 py-3 text-center font-bold uppercase tracking-[0.14em] text-white transition hover:bg-white/10"
              >
                Request Info
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:px-10 lg:grid-cols-2 lg:px-12">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-300">
              Why Train Here
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase sm:text-4xl">
              Professional, Structured, and Practical
            </h2>
            <p className="mt-5 max-w-2xl leading-8 text-white/75">
              This site is designed to highlight responsible firearms education
              with a strong focus on safety, practical instruction, and a smooth
              registration experience.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "Safety-first classroom environment",
                "Hands-on range component",
                "Beginner-friendly guidance",
                "Group and veteran discounts",
                "Convenient scheduling options",
                "Fast contact by text or email",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-neutral-900/70 p-4 text-white/85"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-neutral-900 p-8 shadow-[0_12px_30px_rgba(0,0,0,0.28)]">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-400">
              How It Works
            </p>
            <div className="mt-6 space-y-5">
              {steps.map((step, index) => (
                <div key={step} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-lg font-black text-white">
                    {index + 1}
                  </div>
                  <p className="pt-1 leading-7 text-white/80">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12"
        id="register"
      >
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(127,29,29,0.35),rgba(0,0,0,0.95))] p-8 shadow-[0_12px_30px_rgba(0,0,0,0.28)]">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-400">
              Reserve Your Seat
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase sm:text-4xl">
              Training Enrollment
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-white/80">
              Use this section for your form embed, booking link, or QR-code-based
              sign-up. It is ready to be connected to your preferred registration
              and payment system.
            </p>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => setPage("booking")}
                className="rounded-2xl border border-red-500/40 bg-red-600 px-6 py-4 text-center text-base font-black uppercase tracking-[0.16em] text-white shadow-[0_0_24px_rgba(220,38,38,0.18)] transition hover:-translate-y-0.5 hover:bg-red-700"
              >
                Choose Date First
              </button>
              <a
                href={SQUARE_BOOKING_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-6 py-4 text-center text-base font-black uppercase tracking-[0.16em] text-blue-300 transition hover:bg-blue-500/20"
              >
                Schedule with Square
              </a>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
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
                className="rounded-2xl border border-white/15 bg-black/20 px-5 py-4 text-white placeholder:text-white/40 outline-none sm:col-span-2"
                placeholder="Email Address"
              />

              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="rounded-2xl border border-white/15 bg-black/20 px-5 py-4 text-white outline-none sm:col-span-2"
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
                className="min-h-[140px] rounded-2xl border border-white/15 bg-black/20 px-5 py-4 text-white placeholder:text-white/40 outline-none sm:col-span-2"
                placeholder="Questions or preferred class dates"
              />

              <button
                type="button"
                onClick={handleFormSubmit}
                className="rounded-2xl border border-red-500/40 bg-red-600 px-6 py-4 text-lg font-black uppercase tracking-[0.16em] text-white shadow-[0_0_24px_rgba(220,38,38,0.18)] transition hover:-translate-y-0.5 hover:bg-red-700 sm:col-span-2"
              >
                Submit Registration Request
              </button>

              {submitted && (
                <div className="sm:col-span-2">
                  <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 px-5 py-4 font-bold text-blue-300">
                    Registration submitted successfully!
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className={cardClass}>
              <h3 className="text-2xl font-black uppercase">
                Contact Information
              </h3>
              <div className="mt-5 space-y-4 text-lg text-white/80">
                <p>
                  <span className="font-bold text-white">Phone:</span> (224)
                  248-7021
                </p>
                <p className="break-all">
                  <span className="font-bold text-white">Email:</span>{" "}
                  info@illinoisprotectiveservices.com
                </p>
                <p>
                  <span className="font-bold text-white">Business:</span> Illinois
                  Protective Services
                </p>
              </div>
            </div>

            <div className={cardClass}>
              <h3 className="text-2xl font-black uppercase">Class Notes</h3>
              <ul className="mt-5 space-y-3 text-white/75">
                <li>• Registration required before attendance.</li>
                <li>• Limited class sizes help keep instruction focused.</li>
                <li>• Contact the team for group pricing and special scheduling.</li>
                <li>• Replace this section with your live calendar, waiver link, or FAQ details.</li>
              </ul>
            </div>

            <div className="rounded-[2rem] border border-red-500/20 bg-red-600/10 p-7 shadow-[0_12px_30px_rgba(0,0,0,0.28)]">
              <h3 className="text-2xl font-black uppercase text-blue-300">
                Important
              </h3>
              <p className="mt-4 leading-8 text-white/90">
                This website template is for lawful training and safety education.
                Always follow all applicable federal, state, and local laws, range
                rules, and instructor requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-neutral-900/80">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-400">
              FAQ
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase sm:text-4xl">
              Common Questions
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.q} className={cardClass}>
                <h3 className="text-xl font-black">{faq.q}</h3>
                <p className="mt-3 leading-7 text-white/75">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 text-sm text-white/55 md:flex-row md:items-center md:justify-between md:px-10 lg:px-12">
          <p>© 2026 Illinois Protective Services. All rights reserved.</p>
          <p>Responsible training. Professional instruction. Convenient scheduling.</p>
        </div>
      </footer>
    </div>
  );
}