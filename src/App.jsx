import { useMemo, useState } from "react";

export default function ConcealCarryTrainingWebsite() {
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
      badge: "Most Popular",
    },
    {
      title: "Private Group Sessions",
      description:
        "Book a private training date for families, church groups, security teams, or community organizations.",
      badge: "Group Discount",
    },
    {
      title: "Refresher & Skills Practice",
      description:
        "For prior students wanting to sharpen safe handling, confidence, and accuracy with guided coaching.",
      badge: "Skill Builder",
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

  const NavBar = () => (
    <div className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between md:px-10 lg:px-12">
        <button
          type="button"
          onClick={() => setPage("home")}
          className="text-left text-lg font-black uppercase tracking-[0.2em] text-white"
        >
          Illinois Protective Services
        </button>

        <div className="flex flex-wrap gap-3 text-sm font-bold uppercase tracking-wide">
          <button type="button" onClick={() => setPage("home")} className="rounded-full border border-white/15 px-4 py-2 text-white/80 hover:bg-white/10">
            Home
          </button>
          <button type="button" onClick={() => setPage("about")} className="rounded-full border border-white/15 px-4 py-2 text-white/80 hover:bg-white/10">
            About Us
          </button>
          <button type="button" onClick={() => setPage("booking")} className="rounded-full border border-white/15 px-4 py-2 text-white/80 hover:bg-white/10">
            Booking
          </button>
          <button type="button" onClick={() => setPage("payment")} className="rounded-full border border-white/15 px-4 py-2 text-white/80 hover:bg-white/10">
            Payment
          </button>
          <a href="#register" className="rounded-full bg-yellow-400 px-4 py-2 text-center text-black">
            Contact
          </a>
        </div>
      </div>
    </div>
  );

  if (page === "about") {
    return (
      <div className="min-h-screen bg-neutral-950 text-white">
        <NavBar />
        <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="inline-flex rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm font-black uppercase tracking-wider text-yellow-300">
                About Us
              </div>
              <h1 className="mt-4 text-4xl font-black uppercase sm:text-5xl lg:text-6xl">
                Professional Training Built on Safety, Confidence, and Responsibility
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">
                Illinois Protective Services provides concealed carry training designed for responsible gun owners, first-time students, returning students, and private groups who want structured instruction and a professional learning environment.
              </p>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-white/75">
                Our goal is to help students understand safe firearm handling, legal awareness, decision-making, and practical confidence while creating a smooth path from registration to booking and payment.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  "Safety-first training approach",
                  "Beginner-friendly instruction",
                  "Professional classroom and range guidance",
                  "Private group options available",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white/85">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7 shadow-xl">
                <h2 className="text-2xl font-black uppercase">Our Mission</h2>
                <p className="mt-4 leading-8 text-white/75">
                  To provide quality concealed carry training that is practical, respectful, and focused on helping students become more informed, prepared, and confident.
                </p>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7 shadow-xl">
                <h2 className="text-2xl font-black uppercase">Who We Serve</h2>
                <ul className="mt-5 space-y-3 text-white/75">
                  <li>• First-time concealed carry students</li>
                  <li>• Experienced gun owners seeking formal instruction</li>
                  <li>• Families and church groups</li>
                  <li>• Private sessions and group training requests</li>
                </ul>
              </div>

              <div className="rounded-[2rem] border border-yellow-400/20 bg-yellow-400/10 p-7 shadow-xl">
                <h2 className="text-2xl font-black uppercase text-yellow-300">Contact Our Team</h2>
                <div className="mt-5 space-y-3 text-yellow-50/90">
                  <p><span className="font-bold">Phone:</span> (224) 248-7021</p>
                  <p className="break-all"><span className="font-bold">Email:</span> info@illinoisprotectiveservices.com</p>
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button type="button" onClick={() => setPage("booking")} className="rounded-2xl bg-black px-5 py-3 font-black uppercase tracking-wide text-white border border-white/20 hover:bg-white/10">
                    Book a Class
                  </button>
                  <button type="button" onClick={() => setPage("home")} className="rounded-2xl bg-yellow-400 px-5 py-3 font-black uppercase tracking-wide text-black">
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
      <div className="min-h-screen bg-neutral-950 text-white">
        <NavBar />
        <div className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <div className="inline-flex rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm font-black uppercase tracking-wider text-yellow-300">
                  Booking Page
                </div>

                <h1 className="mt-4 text-4xl font-black uppercase sm:text-5xl">
                  Choose Your Class Date
                </h1>

                <p className="mt-4 max-w-2xl text-lg leading-8 text-white/75">
                  Pick an available weekday on the calendar, then choose a training time between 9:00 AM and 5:00 PM before making your payment.
                </p>

                <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl">
                  <label className="text-sm font-bold uppercase tracking-[0.2em] text-red-300">
                    Select Date
                  </label>

                  <p className="mt-4 text-sm leading-7 text-white/60">
                    Weekday appointments are available Monday through Friday only.
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
                        className={`rounded-2xl border px-4 py-4 text-left text-sm font-black uppercase tracking-wide transition ${
                          date.isWeekend
                            ? "cursor-not-allowed border-white/10 bg-white/5 text-white/30 line-through"
                            : selectedDate === date.value
                              ? "border-yellow-300 bg-yellow-400 text-black"
                              : "border-white/15 bg-black/20 text-white hover:bg-white/10"
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

                <div className="mt-8 rounded-[2rem] border border-yellow-400/20 bg-yellow-400/10 p-6">
                  <h2 className="text-2xl font-black uppercase text-yellow-300">
                    Available Times
                  </h2>
                  <p className="mt-3 text-yellow-50/90">
                    Choose a time slot from 9:00 AM through 5:00 PM.
                  </p>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {availableTimes.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`rounded-2xl border px-4 py-4 text-center text-sm font-black uppercase tracking-wide transition ${
                        selectedTime === slot
                          ? "border-yellow-300 bg-yellow-400 text-black"
                          : "border-yellow-400/30 bg-yellow-400/10 text-yellow-300 hover:bg-yellow-400/20"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl">
                  <h2 className="text-2xl font-black uppercase">Selected Appointment</h2>
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
                    className="mt-6 rounded-2xl bg-yellow-400 px-6 py-4 text-center text-base font-black uppercase tracking-wide text-black transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
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
                    Real students completing concealed carry training and range instruction.
                  </p>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="flex aspect-square items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm text-white/40"
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
                        <div
                          key={t.name}
                          className="rounded-2xl border border-white/10 bg-white/5 p-5"
                        >
                          <p className="leading-7 text-white/80">“{t.text}”</p>
                          <div className="mt-4 text-sm font-bold uppercase tracking-wide text-yellow-300">
                            — {t.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7 shadow-xl">
                  <h2 className="text-2xl font-black uppercase">Booking Details</h2>
                  <ul className="mt-5 space-y-3 text-white/75">
                    <li>• Select a weekday date that works best for your schedule.</li>
                    <li>• Available booking hours are Monday through Friday, 9:00 AM to 5:00 PM.</li>
                    <li>• After choosing a date and time, continue to payment to secure your class.</li>
                    <li>• Replace these sample availability settings with your live calendar later.</li>
                  </ul>
                </div>

                <div className="rounded-[2rem] border border-yellow-400/20 bg-yellow-400/10 p-7 shadow-xl">
                  <h2 className="text-2xl font-black uppercase text-yellow-300">
                    Need a Private Session?
                  </h2>
                  <p className="mt-4 leading-8 text-yellow-50/90">
                    For church groups, families, or private classes, contact Illinois Protective Services to request a custom date.
                  </p>
                  <div className="mt-5 space-y-2 text-yellow-50/90">
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

  if (page === "payment") {
    return (
      <div className="min-h-screen bg-neutral-950 text-white">
        <NavBar />
        <div className="px-6 py-16">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-6 text-4xl font-black uppercase">
              Complete Your Payment
            </h1>

            <div className="mb-6 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-5 text-yellow-50">
              <div className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-300">
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
              <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-6 text-center">
                <h2 className="mb-2 text-2xl font-black uppercase text-yellow-300">
                  Need to Change Your Date?
                </h2>
                <button
                  type="button"
                  onClick={() => setPage("booking")}
                  className="inline-block rounded-xl border border-white/20 bg-black px-6 py-3 font-black uppercase text-white transition hover:bg-white/10"
                >
                  View Dates
                </button>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="mb-3 text-2xl font-black">Deposit Option</h2>
                <p className="mb-4 text-white/70">Secure your seat with a deposit.</p>
                <a
                  href="https://square.link/u/qMU7S5Pb?src=sheet"
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl bg-yellow-400 py-4 text-center font-black uppercase text-black"
                >
                  Pay Deposit
                </a>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="mb-3 text-2xl font-black">Full Payment</h2>
                <p className="mb-4 text-white/70">Pay the full class fee upfront.</p>
                <a
                  href="https://square.link/u/qV8mK8e8?src=sheet"
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl bg-red-600 py-4 text-center font-black uppercase text-white"
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
                  <div
                    key={t.name}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <p className="leading-7 text-white/80">“{t.text}”</p>
                    <div className="mt-4 text-sm font-bold uppercase tracking-wide text-yellow-300">
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
    <div className="min-h-screen bg-neutral-950 text-white">
      <NavBar />
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.35),transparent_35%),radial-gradient(circle_at_top_right,rgba(37,99,235,0.25),transparent_30%),linear-gradient(180deg,#111827_0%,#0a0a0a_100%)]">
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full bg-[linear-gradient(135deg,transparent_0%,transparent_47%,rgba(255,255,255,0.07)_47%,rgba(255,255,255,0.07)_53%,transparent_53%,transparent_100%)]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 md:px-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-12 lg:py-24">
          <div>
            <div className="mb-4 inline-flex items-center rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold tracking-wide text-red-200">
              Illinois Concealed Carry Training
            </div>

            <h1 className="max-w-4xl text-5xl font-black uppercase tracking-tight sm:text-6xl lg:text-7xl">
              Train With Confidence. Carry With Responsibility.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80 sm:text-xl">
              Professional concealed carry training with practical instruction, range experience, completion certificates, and convenient scheduling for individuals and groups.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#register"
                className="rounded-2xl bg-red-600 px-6 py-4 text-center text-lg font-bold uppercase tracking-wide shadow-2xl shadow-red-900/30 transition hover:-translate-y-0.5"
              >
                Register Now
              </a>
              <a
                href="#classes"
                className="rounded-2xl border border-white/20 bg-white/5 px-6 py-4 text-center text-lg font-bold uppercase tracking-wide transition hover:bg-white/10"
              >
                View Classes
              </a>
              <button
                type="button"
                onClick={() => setPage("booking")}
                className="rounded-2xl bg-yellow-400 px-6 py-4 text-center text-lg font-black uppercase tracking-wide text-black transition hover:-translate-y-0.5"
              >
                Make Payment
              </button>
              <button
                type="button"
                onClick={() => setPage("booking")}
                className="rounded-2xl border border-yellow-400/30 bg-yellow-400/10 px-6 py-4 text-center text-lg font-black uppercase tracking-wide text-yellow-300 transition hover:bg-yellow-400/20"
              >
                Book a Class
              </button>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-base font-medium text-white/90 backdrop-blur"
                >
                  <span className="mr-2 text-red-400">●</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-full rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
              <div className="rounded-[1.5rem] border border-yellow-400/20 bg-neutral-900 p-6">
                <div className="mb-4 inline-flex rounded-full bg-yellow-400 px-3 py-1 text-sm font-black uppercase tracking-wider text-black">
                  Enrollment Open
                </div>
                <h2 className="text-3xl font-black uppercase">Get Started Today</h2>
                <div className="mt-6 space-y-4 text-white/80">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-sm uppercase tracking-wider text-white/50">
                      Range Fee
                    </div>
                    <div className="mt-1 text-4xl font-black text-yellow-400">
                      $75
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-sm uppercase tracking-wider text-white/50">
                      Contact
                    </div>
                    <div className="mt-1 text-xl font-bold">(224) 248-7021</div>
                    <div className="break-all text-base">
                      info@illinoisprotectiveservices.com
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setPage("booking")}
                      className="rounded-2xl bg-yellow-400 px-4 py-4 text-center text-base font-black uppercase tracking-wide text-black transition hover:-translate-y-0.5"
                    >
                      Choose Date First
                    </button>
                    <button
                      type="button"
                      onClick={() => setPage("booking")}
                      className="rounded-2xl border border-yellow-400/30 bg-yellow-400/10 px-4 py-4 text-center text-base font-black uppercase tracking-wide text-yellow-300 transition hover:bg-yellow-400/20"
                    >
                      Book Online
                    </button>
                  </div>
                  <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
                    Registration is required and class space is limited. Early sign-up is strongly recommended.
                  </div>
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
            Built for first-time students, experienced gun owners seeking formal training, and private groups needing a professional instructor-led experience.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {classOptions.map((option) => (
            <div
              key={option.title}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl"
            >
              <div className="inline-flex rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-yellow-300">
                {option.badge}
              </div>
              <h3 className="mt-4 text-2xl font-black uppercase">{option.title}</h3>
              <p className="mt-4 leading-7 text-white/75">{option.description}</p>
              <a
                href="#register"
                className="mt-6 inline-block rounded-2xl border border-white/15 px-5 py-3 text-center font-bold uppercase tracking-wide text-white transition hover:bg-white/10"
              >
                Request Info
              </a>
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
              This site is designed to highlight responsible firearms education with a strong focus on safety, practical instruction, and a smooth registration experience.
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

          <div className="rounded-[2rem] border border-white/10 bg-neutral-900 p-8 shadow-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-300">
              How It Works
            </p>
            <div className="mt-6 space-y-5">
              {steps.map((step, index) => (
                <div key={step} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-lg font-black">
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
          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(127,29,29,0.4),rgba(17,24,39,0.9))] p-8 shadow-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-300">
              Reserve Your Seat
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase sm:text-4xl">
              Simple Registration Call-To-Action
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-white/80">
              Use this section for your form embed, booking link, or QR-code-based sign-up. It is ready to be connected to your preferred registration and payment system.
            </p>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => setPage("booking")}
                className="rounded-2xl bg-yellow-400 px-6 py-4 text-center text-base font-black uppercase tracking-wide text-black transition hover:-translate-y-0.5"
              >
                Choose Date First
              </button>
              <button
                type="button"
                onClick={() => setPage("booking")}
                className="rounded-2xl border border-white/15 bg-black/20 px-6 py-4 text-center text-base font-black uppercase tracking-wide text-white transition hover:bg-white/10"
              >
                Schedule Your Spot
              </button>
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
                className="rounded-2xl bg-yellow-400 px-6 py-4 text-lg font-black uppercase tracking-wide text-black transition hover:-translate-y-0.5 sm:col-span-2"
              >
                Submit Registration Request
              </button>

              {submitted && (
                <div className="sm:col-span-2">
                  <div className="rounded-2xl border border-green-400/20 bg-green-500/10 px-5 py-4 font-bold text-green-300">
                    Registration submitted successfully!
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7 shadow-xl">
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

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7 shadow-xl">
              <h3 className="text-2xl font-black uppercase">Class Notes</h3>
              <ul className="mt-5 space-y-3 text-white/75">
                <li>• Registration required before attendance.</li>
                <li>• Limited class sizes help keep instruction focused.</li>
                <li>• Contact the team for group pricing and special scheduling.</li>
                <li>• Replace this section with your live calendar, waiver link, or FAQ details.</li>
              </ul>
            </div>

            <div className="rounded-[2rem] border border-yellow-400/20 bg-yellow-400/10 p-7 shadow-xl">
              <h3 className="text-2xl font-black uppercase text-yellow-300">
                Important
              </h3>
              <p className="mt-4 leading-8 text-yellow-50/90">
                This website template is for lawful training and safety education. Always follow all applicable federal, state, and local laws, range rules, and instructor requirements.
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
              <div
                key={faq.q}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-6"
              >
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
