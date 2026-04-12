import { useState } from "react";

export default function ConcealCarryTrainingWebsite() {
  const [page, setPage] = useState("home");
  const availableDates = [
    {
      date: "Saturday, April 18",
      time: "9:00 AM – 1:00 PM",
      spots: "6 spots left",
      type: "Illinois CCW Training",
    },
    {
      date: "Sunday, April 19",
      time: "1:00 PM – 5:00 PM",
      spots: "4 spots left",
      type: "Beginner-Friendly Session",
    },
    {
      date: "Saturday, April 25",
      time: "10:00 AM – 2:00 PM",
      spots: "8 spots left",
      type: "Private Group Openings",
    },
    {
      date: "Sunday, April 26",
      time: "12:00 PM – 4:00 PM",
      spots: "5 spots left",
      type: "Refresher & Skills Practice",
    },
  ];
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

  if (page === "booking") {
    return (
      <div className="min-h-screen bg-neutral-950 text-white px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setPage("home")}
            className="mb-6 text-sm text-yellow-300 underline"
          >
            ← Back to Home
          </button>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm font-black uppercase tracking-wider text-yellow-300">
                Booking Page
              </div>
              <h1 className="mt-4 text-4xl font-black uppercase sm:text-5xl">
                Choose Your Class Date
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/75">
                Select an available training date below to reserve your seat. This page is designed to connect directly to your Calendly booking link or any scheduling tool you use.
              </p>

              <div className="mt-8 grid gap-5">
                {availableDates.map((session) => (
                  <div
                    key={`${session.date}-${session.time}`}
                    className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="text-sm font-bold uppercase tracking-[0.2em] text-red-300">
                          {session.type}
                        </div>
                        <h2 className="mt-2 text-2xl font-black uppercase">{session.date}</h2>
                        <p className="mt-2 text-lg text-white/75">{session.time}</p>
                        <p className="mt-2 text-sm font-bold uppercase tracking-[0.2em] text-yellow-300">
                          {session.spots}
                        </p>
                      </div>

                      <a
                        href="https://calendly.com"
                        className="rounded-2xl bg-yellow-400 px-6 py-4 text-center text-base font-black uppercase tracking-wide text-black transition hover:-translate-y-0.5"
                      >
                        Book This Date
                      </a>
                    </div>
                  </div>
                ))}

                {/* Student Training Gallery */}
                <div className="mt-10">
                  <h2 className="text-2xl font-black uppercase mb-4">Training Highlights</h2>
                  <p className="text-white/70 mb-6">Real students completing concealed carry training and range instruction.</p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[1,2,3,4,5,6].map((i) => (
                      <div key={i} className="aspect-square rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-white/40 text-sm">
                        Add Photo
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
                  <li>• Select the date that works best for your schedule.</li>
                  <li>• Complete your booking through your live calendar link.</li>
                  <li>• You can place address details, class requirements, and waiver instructions here.</li>
                  <li>• Replace sample dates with your real class calendar at any time.</li>
                </ul>
              </div>

              <div className="rounded-[2rem] border border-yellow-400/20 bg-yellow-400/10 p-7 shadow-xl">
                <h2 className="text-2xl font-black uppercase text-yellow-300">Need a Private Session?</h2>
                <p className="mt-4 leading-8 text-yellow-50/90">
                  For church groups, families, or private classes, contact Illinois Protective Services to request a custom date.
                </p>
                <div className="mt-5 space-y-2 text-yellow-50/90">
                  <p><span className="font-bold">Phone:</span> (224) 248-7021</p>
                  <p className="break-all"><span className="font-bold">Email:</span> info@illinoisprotectiveservices.com</p>
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
      <div className="min-h-screen bg-neutral-950 text-white px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setPage("home")}
            className="mb-6 text-sm text-yellow-300 underline"
          >
            ← Back to Home
          </button>

          <h1 className="text-4xl font-black uppercase mb-6">Complete Your Payment</h1>

          <div className="grid gap-6">
            <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-6 text-center">
              <h2 className="text-2xl font-black uppercase text-yellow-300 mb-2">
                Book Your Class Date
              </h2>
              <p className="text-yellow-50/90 mb-4">
                
              </p>
              <a
                href="https://calendly.com"
                className="inline-block rounded-xl bg-black text-white font-black px-6 py-3 uppercase border border-white/20 hover:bg-white/10 transition"
              >
                View Dates
              </a>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-black mb-3">Deposit Option</h2>
              <p className="text-white/70 mb-4">Secure your seat with a deposit.</p>
              <a
                onClick={() => setPage("payment")}
                className="block rounded-xl bg-yellow-400 text-black text-center font-black py-4 uppercase"
              >
                Pay Deposit
              </a>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-black mb-3">Full Payment</h2>
              <p className="text-white/70 mb-4">Pay the full class fee upfront.</p>
              <a
                onClick={() => setPage("payment")}
                className="block rounded-xl bg-red-600 text-white text-center font-black py-4 uppercase"
              >
                Pay Full Fee
              </a>
            </div>
          </div>

                {/* Testimonials */}
                <div className="mt-10">
                  <h3 className="text-2xl font-black uppercase mb-4">Student Testimonials</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { name: "Jessica R.", text: "Very professional and informative. I came in nervous and left confident and prepared." },
                      { name: "Marcus T.", text: "Hands-on training was excellent. Instructor made everything easy to understand." },
                      { name: "Danielle S.", text: "Great class for beginners. I feel much safer and more knowledgeable now." },
                      { name: "Anthony K.", text: "Worth every dollar. Organized, professional, and real-world training." },
                    ].map((t, i) => (
                      <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <p className="text-white/80 leading-7">“{t.text}”</p>
                        <div className="mt-4 text-sm font-bold uppercase tracking-wide text-yellow-300">— {t.name}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
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
              Professional concealed carry training with practical instruction, range experience,
              completion certificates, and convenient scheduling for individuals and groups.
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
              <a
                onClick={() => setPage("payment")}
                className="rounded-2xl bg-yellow-400 px-6 py-4 text-center text-lg font-black uppercase tracking-wide text-black transition hover:-translate-y-0.5"
              >
                Make Payment
              </a>
              <a
                onClick={() => setPage("booking")}
                className="rounded-2xl border border-yellow-400/30 bg-yellow-400/10 px-6 py-4 text-center text-lg font-black uppercase tracking-wide text-yellow-300 transition hover:bg-yellow-400/20"
              >
                Book a Class
              </a>
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
                    <div className="text-sm uppercase tracking-wider text-white/50">Range Fee</div>
                    <div className="mt-1 text-4xl font-black text-yellow-400">$75</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-sm uppercase tracking-wider text-white/50">Contact</div>
                    <div className="mt-1 text-xl font-bold">(224) 248-7021</div>
                    <div className="text-base break-all">info@illinoisprotectiveservices.com</div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <a
                      onClick={() => setPage("payment")}
                      className="rounded-2xl bg-yellow-400 px-4 py-4 text-center text-base font-black uppercase tracking-wide text-black transition hover:-translate-y-0.5"
                    >
                      Pay Deposit
                    </a>
                    <a
                      onClick={() => setPage("booking")}
                      className="rounded-2xl border border-yellow-400/30 bg-yellow-400/10 px-4 py-4 text-center text-base font-black uppercase tracking-wide text-yellow-300 transition hover:bg-yellow-400/20"
                    >
                      Book Online
                    </a>
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

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12" id="classes">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-400">Training Options</p>
            <h2 className="mt-2 text-3xl font-black uppercase sm:text-4xl">Choose the Right Class Format</h2>
          </div>
          <p className="max-w-2xl text-white/70">
            Built for first-time students, experienced gun owners seeking formal training, and private groups needing a professional instructor-led experience.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {classOptions.map((option) => (
            <div key={option.title} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl">
              <div className="inline-flex rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-yellow-300">
                {option.badge}
              </div>
              <h3 className="mt-4 text-2xl font-black uppercase">{option.title}</h3>
              <p className="mt-4 leading-7 text-white/75">{option.description}</p>
              <button className="mt-6 rounded-2xl border border-white/15 px-5 py-3 font-bold uppercase tracking-wide text-white transition hover:bg-white/10">
                Request Info
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:px-10 lg:grid-cols-2 lg:px-12">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-300">Why Train Here</p>
            <h2 className="mt-2 text-3xl font-black uppercase sm:text-4xl">Professional, Structured, and Practical</h2>
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
                <div key={item} className="rounded-2xl border border-white/10 bg-neutral-900/70 p-4 text-white/85">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-neutral-900 p-8 shadow-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-300">How It Works</p>
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

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12" id="register">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(127,29,29,0.4),rgba(17,24,39,0.9))] p-8 shadow-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-300">Reserve Your Seat</p>
            <h2 className="mt-2 text-3xl font-black uppercase sm:text-4xl">Simple Registration Call-To-Action</h2>
            <p className="mt-4 max-w-2xl leading-8 text-white/80">
              Use this section for your form embed, booking link, or QR-code-based sign-up. It is ready to be connected to your preferred registration and payment system.
            </p>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <a
                onClick={() => setPage("payment")}
                className="rounded-2xl bg-yellow-400 px-6 py-4 text-center text-base font-black uppercase tracking-wide text-black transition hover:-translate-y-0.5"
              >
                Pay Class Fee
              </a>
              <a
                onClick={() => setPage("booking")}
                className="rounded-2xl border border-white/15 bg-black/20 px-6 py-4 text-center text-base font-black uppercase tracking-wide text-white transition hover:bg-white/10"
              >
                Schedule Your Spot
              </a>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <input
                className="rounded-2xl border border-white/15 bg-black/20 px-5 py-4 text-white placeholder:text-white/40 outline-none"
                placeholder="Full Name"
              />
              <input
                className="rounded-2xl border border-white/15 bg-black/20 px-5 py-4 text-white placeholder:text-white/40 outline-none"
                placeholder="Phone Number"
              />
              <input
                className="rounded-2xl border border-white/15 bg-black/20 px-5 py-4 text-white placeholder:text-white/40 outline-none sm:col-span-2"
                placeholder="Email Address"
              />
              <select className="rounded-2xl border border-white/15 bg-black/20 px-5 py-4 text-white outline-none sm:col-span-2">
                <option>Select Training Type</option>
                <option>Illinois CCW Training</option>
                <option>Private Group Session</option>
                <option>Refresher / Skills Practice</option>
              </select>
              <textarea
                className="min-h-[140px] rounded-2xl border border-white/15 bg-black/20 px-5 py-4 text-white placeholder:text-white/40 outline-none sm:col-span-2"
                placeholder="Questions or preferred class dates"
              />
              <button className="rounded-2xl bg-yellow-400 px-6 py-4 text-lg font-black uppercase tracking-wide text-black transition hover:-translate-y-0.5 sm:col-span-2">
                Submit Registration Request
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7 shadow-xl">
              <h3 className="text-2xl font-black uppercase">Contact Information</h3>
              <div className="mt-5 space-y-4 text-lg text-white/80">
                <p><span className="font-bold text-white">Phone:</span> (224) 248-7021</p>
                <p className="break-all"><span className="font-bold text-white">Email:</span> info@illinoisprotectiveservices.com</p>
                <p><span className="font-bold text-white">Business:</span> Illinois Protective Services</p>
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
              <h3 className="text-2xl font-black uppercase text-yellow-300">Important</h3>
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
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-400">FAQ</p>
            <h2 className="mt-2 text-3xl font-black uppercase sm:text-4xl">Common Questions</h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
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
