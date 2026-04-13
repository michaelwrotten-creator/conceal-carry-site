import { useState } from "react";

export default function App() {
  const [page, setPage] = useState("home");

  const SQUARE_BOOKING_URL = "https://book.squareup.com/appointments/duxyj421attisk/location/LKSMBY77QKE4C";

  const NavBar = () => (
    <div className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">

        <button
          onClick={() => setPage("home")}
          className="text-lg font-black uppercase tracking-widest"
        >
          Illinois Protective Services
        </button>

        <div className="flex flex-wrap gap-3 text-sm font-bold uppercase tracking-wide">
          <button onClick={() => setPage("home")} className="rounded-full border px-4 py-2 text-white/80 hover:bg-white/10">
            Home
          </button>

          <button onClick={() => setPage("about")} className="rounded-full border px-4 py-2 text-white/80 hover:bg-white/10">
            About Us
          </button>

          <a href={SQUARE_BOOKING_URL} target="_blank" rel="noreferrer" className="rounded-full border px-4 py-2 text-white/80 hover:bg-white/10">
            Booking
          </a>

          <a href={SQUARE_BOOKING_URL} target="_blank" rel="noreferrer" className="rounded-full border px-4 py-2 text-white/80 hover:bg-white/10">
            Payment
          </a>

          <a href="#register" className="rounded-full bg-yellow-400 px-4 py-2 text-black">
            Contact
          </a>
        </div>
      </div>
    </div>
  );

  if (page === "about") {
    return (
      <div className="min-h-screen bg-black text-white">
        <NavBar />
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-black uppercase">About Us</h1>
          <p className="mt-6 text-white/70 text-lg">
            Professional concealed carry training focused on safety, confidence,
            and real-world readiness.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />

      {/* HERO */}
      <section className="text-center px-6 py-20">
        <h1 className="text-6xl font-black uppercase">
          Train With Confidence
        </h1>

        <p className="mt-6 text-white/70 max-w-2xl mx-auto">
          Professional concealed carry training with real-world instruction.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a href="#register" className="bg-red-600 px-6 py-4 font-bold uppercase">
            Register
          </a>

          <a href={SQUARE_BOOKING_URL} target="_blank" rel="noreferrer" className="border px-6 py-4 uppercase">
            Book Now
          </a>
        </div>

        {/* HIGHLIGHTS */}
        <div className="mt-12 grid gap-4 max-w-3xl mx-auto sm:grid-cols-2">
          {[
            "Hands-on training",
            "Certificate included",
            "Flexible schedule",
            "Group discounts"
          ].map((item) => (
            <div key={item} className="border p-4 rounded-xl bg-white/5">
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* 🔥 PREMIUM ENROLLMENT CARD */}
      <section className="px-6 pb-20">
        <div className="flex justify-center">
          <div className="sticky top-28 w-full max-w-lg">

            <div className="rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-[2px] shadow-[0_20px_80px_rgba(0,0,0,0.6)]">

              <div className="rounded-[2.5rem] bg-neutral-900 px-8 py-10 text-center">

                <div className="mx-auto mb-5 inline-flex rounded-full bg-yellow-400 px-4 py-1 text-xs font-black uppercase text-black">
                  Enrollment Open
                </div>

                <h2 className="text-3xl font-black uppercase">
                  Book Your Training
                </h2>

                <div className="mx-auto my-6 h-[2px] w-16 bg-yellow-400/60"></div>

                <div className="mb-6">
                  <div className="text-sm text-white/50">Range Fee</div>
                  <div className="text-5xl font-black text-yellow-400">$75</div>
                </div>

                <div className="mb-8 text-white/80">
                  <div>(224) 248-7021</div>
                  <div>info@illinoisprotectiveservices.com</div>
                </div>

                <div className="flex flex-col gap-3">
                  <a
                    href={SQUARE_BOOKING_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-yellow-400 py-4 font-black uppercase text-black rounded-xl"
                  >
                    Book & Pay Now
                  </a>

                  <a
                    href={SQUARE_BOOKING_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="border border-yellow-400 py-4 font-black uppercase text-yellow-300 rounded-xl"
                  >
                    View Availability
                  </a>
                </div>

                <div className="mt-6 text-sm text-red-300">
                  Limited spots available
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="register" className="text-center px-6 py-20">
        <h2 className="text-4xl font-black uppercase">Contact</h2>
        <p className="mt-4 text-white/70">
          Call or email to get started today.
        </p>
      </section>

    </div>
  );
}