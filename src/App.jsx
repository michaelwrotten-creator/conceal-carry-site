import { useEffect, useRef, useState } from "react";

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

const CHECKOUT_STORAGE_KEY = "ips_pending_checkout";
const SERVICE_ID_ALIASES = {
  "3hour": "renewal3",
  "8hour-veteran": "veteran8",
  "16hour": "ccl16",
};
const EMPTY_FORM_STATE = {
  firstName: "",
  lastName: "",
  name: "",
  phone: "",
  email: "",
  type: "",
  message: "",
  smsConsent: false,
};

function normalizeServiceId(serviceId) {
  const trimmed = String(serviceId || "").trim();
  return SERVICE_ID_ALIASES[trimmed] || trimmed;
}

function splitFullName(fullName) {
  const parts = String(fullName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" "),
  };
}

function getCustomerName(formData) {
  const combined = [formData?.firstName, formData?.lastName]
    .map((value) => String(value || "").trim())
    .filter(Boolean)
    .join(" ");

  return combined || String(formData?.name || "").trim();
}

function buildFormState(next = {}) {
  const merged = {
    ...EMPTY_FORM_STATE,
    ...next,
  };

  if (!merged.firstName && !merged.lastName && merged.name) {
    const split = splitFullName(merged.name);
    if (!merged.firstName) merged.firstName = split.firstName;
    if (!merged.lastName) merged.lastName = split.lastName;
  }

  merged.name = getCustomerName(merged);
  return merged;
}

function getApiBaseCandidates(apiBase) {
  const explicitBase = String(apiBase || "").trim().replace(/\/$/, "");
  const candidates = [];

  if (explicitBase) {
    candidates.push(explicitBase);
  }

  candidates.push("");

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (/^(localhost|127\.0\.0\.1)$/.test(host)) {
      candidates.push("http://localhost:4242");
    }
  }

  return [...new Set(candidates)];
}

function looksLikeHtmlError(text) {
  return /<!doctype html|<html|the page could not be found|not_found/i.test(
    String(text || "")
  );
}

async function postJsonWithFallback(
  apiBase,
  path,
  payload,
  unavailableMessage = "The backend is not available at this address."
) {
  let lastError = null;

  for (const base of getApiBaseCandidates(apiBase)) {
    try {
      const response = await fetch(`${base}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();

      let data = null;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        if (looksLikeHtmlError(text)) {
          lastError = new Error(unavailableMessage);
          continue;
        }
        throw new Error(`Backend did not return JSON. Response was: ${text}`);
      }

      if (!response.ok) {
        throw new Error(data?.error || "Request failed.");
      }

      return data;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Unable to reach the backend.");
}

const WHY_CHOOSE_IPS_REPLY =
  "You should choose Illinois Protective Services because the focus is on teaching responsible American citizens gun rights and firearm ownership with professionalism, courteous service, integrity, and transparency. The training is structured, safety-focused, and designed to help students leave more confident, better informed, and prepared to handle firearm ownership responsibly. If you want, I can also help you compare the classes and choose the right one for your situation.";

function HostedCheckoutPanel({
  paymentMode,
  selectedPrice,
  selectedDeposit,
  loading,
  errorMessage,
  paymentCompleted,
  onCheckout,
}) {
  const amount =
    paymentMode === "deposit" ? selectedDeposit : selectedPrice;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[#d9dee8] bg-[#f8fbff] p-5 text-[#374151]">
        <div className="text-xs font-black uppercase tracking-[0.16em] text-[#6b7280]">
          Stripe Checkout
        </div>
        <p className="mt-3 leading-7">
          Card entry opens on Stripe&apos;s secure hosted checkout page. This is
          the most reliable option for real purchases, especially in in-app
          browsers.
        </p>
        <div className="mt-4 rounded-2xl border border-[#d9dee8] bg-white p-4">
          <div className="text-sm uppercase tracking-[0.18em] text-[#6b7280]">
            Selected Payment
          </div>
          <div className="mt-2 text-lg font-black text-[#111111]">
            {paymentMode === "deposit" ? "Deposit" : "Full Payment"} — $
            {amount.toFixed(2)}
          </div>
        </div>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-[#e85b66]/20 bg-[#fff3f4] px-4 py-3 text-sm text-[#b42318]">
          {errorMessage}
        </div>
      ) : null}

      {paymentCompleted ? (
        <div className="rounded-2xl border border-[#4169e1]/20 bg-[#f5f8ff] px-4 py-3 text-sm text-[#3558c9]">
          Payment completed successfully. Review your details on the left, then
          finish booking.
        </div>
      ) : (
        <button
          type="button"
          onClick={onCheckout}
          disabled={loading}
          className="w-full rounded-2xl border border-[#4169e1]/40 bg-[#4169e1] px-6 py-4 text-base font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#3558c9] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Redirecting..." : "Continue to Secure Stripe Checkout"}
        </button>
      )}
    </div>
  );
}

function RequiredFieldLabel({ children }) {
  return (
    <label className="mb-2 block text-sm font-black uppercase tracking-[0.14em] text-[#6b7280]">
      {children} <span className="text-[#dc2626]">*</span>
    </label>
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
  imagePosition = "center top",
}) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-[#d9dee8] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
      <div className="relative bg-[#eceef2]">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="block h-[520px] w-full object-contain bg-[#eceef2]"
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
    <div className="relative h-full overflow-hidden rounded-[2rem] border border-[#d9dee8] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
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

const DEFAULT_ASSISTANT_MESSAGE =
  "Welcome to Illinois Protective Services. I can answer class questions, concealed carry questions, certificate questions, and many general questions clearly, then guide you to the right next step.";

const MISSED_CALL_ASSISTANT_MESSAGE =
  "Welcome back. I can help with class selection, pricing, booking, instructor questions, certificate replacement questions, concealed carry questions, and many general questions.";

function getAssistantDeposit(service) {
  if (!service?.price) return 0;
  return Math.round((service.price / 3) * 100) / 100;
}

function normalizeAssistantReply(text) {
  return String(text || "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

function SmartAIChat({
  apiBase,
  classServices,
  currentPage,
  faqs,
  instructors,
  navigateTo,
  setBookingStep,
  setSelectedService,
  selectedService,
  selectedDate,
  selectedTime,
  getSelectedService,
  getSelectedPrice,
  getSelectedDeposit,
  formatPrice,
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: DEFAULT_ASSISTANT_MESSAGE,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const recognitionRef = useRef(null);
  const handleSendRef = useRef(null);
  const scrollAnchorRef = useRef(null);
  const speechEnabledRef = useRef(false);

  const contactPhone = "(224) 248-7027";
  const contactEmail = "support@illinoisprotectiveservices.com";

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({
      behavior: messages.length > 2 ? "smooth" : "auto",
    });
  }, [messages, loading]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("ai") === "missedcall") {
      setOpen(true);
      setMessages([
        {
          role: "ai",
          text: MISSED_CALL_ASSISTANT_MESSAGE,
        },
      ]);
    }
  }, []);

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
      if (text) handleSendRef.current?.(text);
    };

    recognition.onerror = (event) => {
      setListening(false);

      const voiceErrorReply =
        {
          "not-allowed":
            "Microphone access is blocked right now. Please allow mic permission in your browser and try again.",
          "service-not-allowed":
            "Voice input is not allowed in this browser right now. Please use the keyboard or open the site in a browser that supports microphone access.",
          "audio-capture":
            "I could not detect a microphone. Please check your mic connection and try again.",
          "no-speech":
            "I did not hear anything that time. Please try the mic again or type your question.",
          aborted: "Voice input was canceled.",
        }[event?.error] ||
        "Voice input is unavailable right now. Please type your question and I will still help you.";

      setMessages((prev) => [...prev, { role: "ai", text: voiceErrorReply }]);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
  }, [loading]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!speechEnabledRef.current) return;
    if (!soundEnabled) {
      window.speechSynthesis?.cancel?.();
    }
  }, [soundEnabled]);

  function speakReply(text) {
    if (
      typeof window === "undefined" ||
      !soundEnabled ||
      !speechEnabledRef.current ||
      !("speechSynthesis" in window)
    ) {
      return;
    }

    const spokenText = String(text || "").trim();
    if (!spokenText) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  }

  function startVoice() {
    speechEnabledRef.current = true;

    if (listening) {
      recognitionRef.current?.stop?.();
      setListening(false);
      return;
    }

    if (!recognitionRef.current || loading) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Voice input is not supported in this browser. Please type your question and I will still help you.",
        },
      ]);
      return;
    }

    setListening(true);
    recognitionRef.current.start();
  }

  function findServiceByTerms(lower) {
    if (lower.includes("mini")) return classServices.find((s) => s.id === "mini");
    if (
      lower.includes("renewal") ||
      lower.includes("3-hour") ||
      lower.includes("3 hour")
    ) {
      return classServices.find((s) => s.id === "renewal3");
    }
    if (
      lower.includes("veteran") ||
      lower.includes("8-hour") ||
      lower.includes("8 hour")
    ) {
      return classServices.find((s) => s.id === "veteran8");
    }
    if (
      lower.includes("16-hour") ||
      lower.includes("16 hour") ||
      lower.includes("full class") ||
      lower.includes("full course") ||
      lower.includes("ccl")
    ) {
      return classServices.find((s) => s.id === "ccl16");
    }
    return null;
  }

  function formatAllServices() {
    return classServices
      .map(
        (s) =>
          `${s.title}: full payment ${formatPrice(
            s.price
          )}, deposit ${formatPrice(getAssistantDeposit(s))}`
      )
      .join("; ");
  }

  function currentBookingSummary() {
    const service = getSelectedService();
    if (!service) return "No class is currently selected.";

    return `${service.title} is selected. Full price is ${formatPrice(
      getSelectedPrice()
    )}. Deposit is ${formatPrice(getSelectedDeposit())}. Date: ${
      selectedDate || "not selected"
    }. Time: ${selectedTime || "not selected"}.`;
  }

  function getInstructorReply() {
    return instructors
      .map(
        (instructor) =>
          `${instructor.name} is our ${instructor.title}. ${instructor.summary}`
      )
      .join("\n\n");
  }

  function getServiceOverview(service) {
    if (!service) return "";

    const included = service.included?.slice(0, 3).join(", ");
    const requirements = service.requirements?.join(", ");

    return normalizeAssistantReply(
      `${service.title} is ${service.duration} and costs ${formatPrice(
        service.price
      )}, with a deposit of ${formatPrice(
        getAssistantDeposit(service)
      )}. ${service.description} ${service.audience} Included: ${included}. Requirements: ${requirements}.`
    );
  }

  function getLocalKnowledgeReply(text) {
    const lower = text.toLowerCase().trim();

    if (
      lower.includes("why should i choose illinois protective services") ||
      lower.includes("why choose illinois protective services") ||
      lower.includes("why should i choose your company") ||
      lower.includes("why choose your company") ||
      lower.includes("why choose you")
    ) {
      return WHY_CHOOSE_IPS_REPLY;
    }

    if (
      (lower.includes("lost") && lower.includes("certificate")) ||
      lower.includes("replacement certificate") ||
      lower.includes("replace my certificate") ||
      lower.includes("certificate replacement") ||
      lower.includes("replacement fee")
    ) {
      return "If you lost your certificate, the replacement fee is $75.00.";
    }

    if (
      lower.includes("certificate") ||
      lower.includes("completion certificate") ||
      lower.includes("certificate of completion") ||
      lower.includes("do i get a certificate") ||
      lower.includes("will i get a certificate")
    ) {
      return "Yes. Everyone who passes the class receives a certificate of completion at the end of class.";
    }

    if (
      lower.includes("conceal carry class") ||
      lower.includes("concealed carry class") ||
      lower.includes("concealed carry training") ||
      lower.includes("what is conceal carry") ||
      lower.includes("what is concealed carry") ||
      lower.includes("carry class for")
    ) {
      return "A concealed carry class is for learning how to carry and use a handgun responsibly, safely, and legally. It should cover safe handling, defensive mindset, situational awareness, lawful use-of-force basics, and range qualification. For most first-time students here, the 16-hour CCL course is the full training path, and everyone who passes the class receives a certificate of completion at the end of class.";
    }

    if (
      lower.includes("which class") ||
      lower.includes("what class do i need") ||
      lower.includes("what course do i need") ||
      lower.includes("which course should i take") ||
      lower.includes("what class should i take")
    ) {
      return "The 16-hour CCL course is usually the right choice for first-time concealed carry students. The 3-hour course is for renewals, the 8-hour class is for qualifying veterans, and the mini class is better for shorter guided instruction or refreshers.";
    }

    if (lower.includes("law") || lower.includes("legal") || lower.includes("permit")) {
      return "I can share general concealed carry information, but I do not want to guess about current laws. Permit rules, reciprocity, and restricted places can change, so please verify current Illinois requirements with the Illinois State Police and your instructor. If you want, I can still help you choose the right class or explain the training process.";
    }

    if (
      lower.includes("gun should i buy") ||
      lower.includes("choose a gun") ||
      lower.includes("best gun") ||
      lower.includes("what gun")
    ) {
      return "A good carry gun is one you can shoot accurately, operate safely, and carry consistently. The handbook recommends trying several options, focusing on comfort and reliability, and training until you can make safe, consistent hits instead of chasing hype or caliber alone. If you are new, our full 16-hour course is the best place to start.";
    }

    if (
      lower.includes("ammo") ||
      lower.includes("ammunition") ||
      lower.includes("hollow point") ||
      lower.includes("frangible")
    ) {
      return "For defensive use, the handbook favors reliable self-defense ammunition such as hollow-point rounds because they are designed to expand on impact and reduce over-penetration risk. The best choice still depends on your firearm, reliability testing, and local rules, so train with your setup and verify what is appropriate where you live.";
    }

    if (lower.includes("choose mini") || lower.includes("book mini") || lower.includes("select mini")) {
      return getServiceOverview(classServices.find((s) => s.id === "mini"));
    }

    if (
      lower.includes("holster") ||
      lower.includes("carry gear") ||
      lower.includes("edc") ||
      lower.includes("everyday carry")
    ) {
      return "Your carry setup should be comfortable, discreet, and secure enough to use every day. The handbook highlights a quality holster, safe on-body carry when possible, and everyday essentials like a flashlight, phone, and less-lethal option. Good gear should support safe carry, not make you avoid carrying responsibly.";
    }

    if (
      lower.includes("situational awareness") ||
      lower.includes("avoid a fight") ||
      lower.includes("de-escalat") ||
      lower.includes("conflict avoid")
    ) {
      return "The handbook is very clear that it is better to avoid a fight than to win one. Stay alert, limit distractions, notice who is watching you, and leave early when something feels wrong. Good awareness and conflict avoidance are part of responsible concealed carry.";
    }

    if (
      lower.includes("what to say to police") ||
      lower.includes("after a self-defense shooting") ||
      lower.includes("after defensive use") ||
      lower.includes("after using my gun")
    ) {
      return "The handbook says to call 911 immediately, report the incident, and cooperate physically with responding officers. It also emphasizes being careful with detailed statements because police will treat the scene seriously and laws vary by jurisdiction. For anything legal or state-specific, speak with an attorney and follow current local law.";
    }

    if (
      lower.includes("training") ||
      lower.includes("practice") ||
      lower.includes("how much should i train")
    ) {
      return "Permit training is a starting point, not the finish line. The handbook recommends ongoing professional instruction, regular safe practice, and continued study of self-defense law and responsible carry habits. Our courses are built to help students keep building those fundamentals.";
    }

    return "I can answer many general questions, class questions, booking questions, instructor questions, certificate questions, and concealed carry questions. Ask me something like “Which class do I need?”, “How much is a replacement certificate?”, or “What should I bring to class?”";
  }

  function getLocalAction(text) {
    const lower = text.toLowerCase().trim();

    if (
      lower.includes("why should i choose illinois protective services") ||
      lower.includes("why choose illinois protective services") ||
      lower.includes("why should i choose your company") ||
      lower.includes("why choose your company") ||
      lower.includes("why choose you")
    ) {
      return {
        type: "reply-only",
        reply: WHY_CHOOSE_IPS_REPLY,
      };
    }

    if (
      (lower.includes("lost") && lower.includes("certificate")) ||
      lower.includes("replacement certificate") ||
      lower.includes("replace my certificate") ||
      lower.includes("certificate replacement") ||
      lower.includes("replacement fee")
    ) {
      return {
        type: "reply-only",
        reply: "If you lost your certificate, the replacement fee is $75.00.",
      };
    }

    if (
      lower === "start booking" ||
      lower.includes("book now") ||
      lower.includes("i want to book") ||
      lower.includes("help me book")
    ) {
      return {
        type: "booking-start",
        serviceId: selectedService || null,
        reply: "I opened the booking flow for you. Step 1 is choosing the class that fits your training needs.",
      };
    }

    if (
      lower.includes("show classes") ||
      lower.includes("what classes") ||
      lower.includes("class options") ||
      lower.includes("services")
    ) {
      return {
        type: "reply-only",
        reply: `Here are the current class options: ${formatAllServices()}. If you want, I can also explain which course best fits your situation.`,
      };
    }

    if (
      lower.includes("price") ||
      lower.includes("cost") ||
      lower.includes("deposit") ||
      lower.includes("full payment")
    ) {
      const matched = findServiceByTerms(lower);
      if (matched) {
        return {
          type: "reply-only",
          reply: `${matched.title} costs ${formatPrice(
            matched.price
          )}. The deposit is ${formatPrice(
            getAssistantDeposit(matched)
          )}. If you want, I can also explain what is included in that class.`,
        };
      }

      return {
        type: "reply-only",
        reply: `Current pricing: ${formatAllServices()}.`,
      };
    }

    if (
      lower.includes("choose mini") ||
      lower.includes("book mini") ||
      lower.includes("select mini")
    ) {
      const service = classServices.find((s) => s.id === "mini");
      return {
        type: "booking-step-2",
        serviceId: service?.id,
        reply: `I selected ${service?.title} and moved you to Step 2 so you can choose a date and time.`,
      };
    }

    if (
      lower.includes("choose renewal") ||
      lower.includes("book renewal") ||
      lower.includes("select renewal")
    ) {
      const service = classServices.find((s) => s.id === "renewal3");
      return {
        type: "booking-step-2",
        serviceId: service?.id,
        reply: `I selected ${service?.title} and moved you to Step 2 so you can choose a date and time.`,
      };
    }

    if (
      lower.includes("choose veteran") ||
      lower.includes("book veteran") ||
      lower.includes("select veteran")
    ) {
      const service = classServices.find((s) => s.id === "veteran8");
      return {
        type: "booking-step-2",
        serviceId: service?.id,
        reply: `I selected ${service?.title} and moved you to Step 2 so you can choose a date and time.`,
      };
    }

    if (
      lower.includes("choose 16") ||
      lower.includes("book 16") ||
      lower.includes("select 16") ||
      lower.includes("book ccl") ||
      lower.includes("select ccl")
    ) {
      const service = classServices.find((s) => s.id === "ccl16");
      return {
        type: "booking-step-2",
        serviceId: service?.id,
        reply: `I selected ${service?.title} and moved you to Step 2 so you can choose a date and time.`,
      };
    }

    if (
      lower.includes("continue booking") ||
      lower.includes("go to payment") ||
      lower.includes("review and pay")
    ) {
      return {
        type: "booking-step-3",
        serviceId: selectedService || null,
        reply: "I moved you to Step 3. Review your booking details and choose deposit or full payment.",
      };
    }

    if (
      lower.includes("booking summary") ||
      lower.includes("what did i choose") ||
      lower.includes("selected class")
    ) {
      return {
        type: "reply-only",
        reply: currentBookingSummary(),
      };
    }

    if (
      lower.includes("what should i bring") ||
      lower.includes("what do i bring") ||
      lower.includes("bring to class")
    ) {
      return {
        type: "reply-only",
        reply:
          "Bring your state ID or driver’s license. If you are claiming veteran credit, bring your DD-214.",
      };
    }

    if (
      lower.includes("who is the instructor") ||
      lower.includes("who are the instructors") ||
      lower.includes("instructor")
    ) {
      return {
        type: "reply-only",
        reply: getInstructorReply(),
      };
    }

    if (
      lower.includes("certificate") ||
      lower.includes("completion certificate") ||
      lower.includes("certificate of completion")
    ) {
      return {
        type: "reply-only",
        reply:
          "Yes. Everyone who passes the class receives a certificate of completion at the end of class.",
      };
    }

    if (
      lower.includes("refund") ||
      lower.includes("reschedule") ||
      lower.includes("policy") ||
      lower.includes("miss class") ||
      lower.includes("missed class")
    ) {
      return {
        type: "reply-only",
        reply: "If you cannot attend, notify the instructor at least 24 hours in advance to keep credit toward a future class date. If you reschedule with less than 24 hours’ notice, class credit is forfeited and a new payment or deposit is required. Missed class or range sessions also carry a $55 makeup fee.",
      };
    }

    if (
      lower.includes("phone") ||
      lower.includes("email") ||
      lower.includes("contact")
    ) {
      return {
        type: "reply-only",
        reply: `You can contact Illinois Protective Services at ${contactPhone} or ${contactEmail}.`,
      };
    }

    if (
      lower.includes("pass") ||
      lower.includes("qualification score") ||
      lower.includes("30 hits") ||
      lower.includes("shooting qualification")
    ) {
      const qualificationFaq = faqs.find((item) =>
        item.q.toLowerCase().includes("pass shooting qualification")
      );

      return {
        type: "reply-only",
        reply:
          qualificationFaq?.a ||
          "Students must pass shooting qualification with at least 60 percent, which is at least 30 hits out of 50 rounds.",
      };
    }

    const matchedService = findServiceByTerms(lower);
    if (
      matchedService &&
      (lower.includes("tell me about") ||
        lower.includes("about the") ||
        lower.includes("explain") ||
        lower.includes("details"))
    ) {
      return {
        type: "reply-only",
        reply: getServiceOverview(matchedService),
      };
    }

    return null;
  }

  function runLocalAction(action) {
    if (!action) return;

    if (action.serviceId) {
      setSelectedService(normalizeServiceId(action.serviceId));
    }

    if (action.type === "booking-start") {
      navigateTo("booking");
      setBookingStep(1);
      return;
    }

    if (action.type === "booking-step-2") {
      navigateTo("booking");
      setBookingStep(2);
      return;
    }

    if (action.type === "booking-step-3") {
      navigateTo("booking");
      setBookingStep(3);
    }
  }

  async function requestAssistantReply(text, history) {
    try {
      const data = await postJsonWithFallback(
        apiBase,
        "/api/assistant",
        {
          message: text,
          history: history.slice(-8),
          siteContext: {
          page: currentPage,
          bookingSummary: currentBookingSummary(),
          classServices: classServices.map((service) => ({
            title: service.title,
            price: service.price,
            duration: service.duration,
            audience: service.audience,
            description: service.description,
            included: service.included,
            requirements: service.requirements,
            pricingNotes: service.pricingNotes,
          })),
          faqs,
          instructors,
          contact: {
            phone: contactPhone,
            email: contactEmail,
          },
          policies: {
            certificateReplacementFee: 75,
            certificateReplacementMessage:
              "If you lost your certificate, the replacement fee is $75.00.",
            certificateCompletionMessage:
              "Everyone who passes the class receives a certificate of completion at the end of class.",
            whyChooseMessage: WHY_CHOOSE_IPS_REPLY,
          },
        },
      },
        "The assistant backend is not available at this address."
      );

      const reply = normalizeAssistantReply(data?.reply);
      if (reply) {
        return reply;
      }

      throw new Error("Assistant returned an empty response.");
    } catch (error) {
      console.error("Assistant request failed:", error);
      return getLocalKnowledgeReply(text);
    }
  }

  async function handleSend(textOverride) {
    speechEnabledRef.current = true;
    const text = (textOverride ?? input).trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user", text }];
    setMessages(nextMessages);
    setInput("");

    const localAction = getLocalAction(text);
    if (localAction) {
      runLocalAction(localAction);
      setMessages((prev) => [...prev, { role: "ai", text: localAction.reply }]);
      speakReply(localAction.reply);
      return;
    }

    setLoading(true);
    const aiReply = await requestAssistantReply(text, nextMessages);
    setMessages((prev) => [...prev, { role: "ai", text: aiReply }]);
    speakReply(aiReply);
    setLoading(false);
  }

  handleSendRef.current = handleSend;

  const suggestions = [
    "Who are the instructors?",
    "Show class pricing",
    "Start booking",
    "What should I bring?",
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open training assistant chat"
        title="Open training assistant chat"
        className="fixed bottom-6 right-6 z-[999999] flex h-16 w-16 items-center justify-center rounded-full border border-[#4169e1]/40 bg-[#4169e1] text-white shadow-[0_0_30px_rgba(65,105,225,0.28)] transition hover:scale-105 hover:bg-[#3558c9]"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-7 w-7 fill-current"
        >
          <path d="M12 3C6.477 3 2 6.94 2 11.8c0 2.51 1.208 4.773 3.146 6.374L4 22l4.36-2.34c1.147.322 2.37.49 3.64.49 5.523 0 10-3.94 10-8.8S17.523 3 12 3Zm-4 6h8a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2Zm0 4h5a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2Z" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-x-4 bottom-24 top-24 z-[999999] flex flex-col overflow-hidden rounded-3xl border border-[#d9dee8] bg-white shadow-[0_25px_70px_rgba(0,0,0,0.22)] sm:inset-x-auto sm:right-6 sm:top-20 sm:w-[360px]">
          <div className="flex items-center justify-between bg-black px-5 py-4 text-white">
            <div>
              <div className="text-sm font-black uppercase tracking-[0.2em]">
                Training Assistant
              </div>
              <div className="text-xs text-white/80">
                Classes, certificates, and general help
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  speechEnabledRef.current = true;
                  setSoundEnabled((prev) => !prev);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 hover:bg-white/10"
                title={soundEnabled ? "Sound on" : "Sound off"}
              >
                {soundEnabled ? "🔊" : "🔇"}
              </button>
              <button
                type="button"
                onClick={startVoice}
                disabled={loading}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 hover:bg-white/10"
                title="Voice input"
              >
                {listening ? "🎤" : "🎙️"}
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

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#f8fbff] p-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[88%] whitespace-pre-wrap rounded-2xl border px-4 py-3 text-sm leading-6 ${
                  msg.role === "ai"
                    ? "border-[#bfd0ff] bg-[#eaf1ff] text-[#1f3f9e]"
                    : "ml-auto border-[#4169e1]/20 bg-[#4169e1] text-white"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading ? (
              <div className="max-w-[88%] rounded-2xl border border-[#bfd0ff] bg-[#eaf1ff] px-4 py-3 text-sm leading-6 text-[#1f3f9e]">
                Thinking through the best answer for you...
              </div>
            ) : null}
            <div ref={scrollAnchorRef} />
          </div>

          <div className="border-t border-[#d9dee8] bg-white p-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSend(suggestion)}
                  className="rounded-full border border-[#d9dee8] bg-[#f8fbff] px-3 py-1.5 text-xs font-bold text-[#3558c9] hover:bg-[#eef4ff]"
                >
                  {suggestion}
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
                placeholder="Ask about classes, certificates, or almost anything..."
                className="flex-1 rounded-xl border border-[#d9dee8] bg-white px-4 py-3 text-sm text-[#111111] outline-none placeholder:text-[#6b7280]"
              />
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={loading}
                className="rounded-xl bg-[#4169e1] px-4 py-3 text-sm font-black uppercase text-white hover:bg-[#3558c9] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function ConcealCarryTrainingWebsite() {
  const API_BASE = import.meta.env.VITE_API_BASE || "";
  const LOGO_SRC = "/ips-logo.png";

  const [showOpeningGate, setShowOpeningGate] = useState(() => {
    if (typeof window === "undefined") return true;
    return sessionStorage.getItem("ips_opened") !== "yes";
  });

  const [page, setPage] = useState("home");
  const [, setPageHistory] = useState(["home"]);
  const [bookingStep, setBookingStep] = useState(1);
  const [classesView, setClassesView] = useState("grid");

  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [paymentMode, setPaymentMode] = useState("deposit");
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loadingPaymentIntent, setLoadingPaymentIntent] = useState(false);
  const [paymentLoadError, setPaymentLoadError] = useState("");

  const [formData, setFormData] = useState(() => buildFormState());

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, bookingStep]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const checkoutStatus = params.get("checkout");
    const savedCheckout = sessionStorage.getItem(CHECKOUT_STORAGE_KEY);

    if (!checkoutStatus && !savedCheckout) return;

    let snapshot = null;

    if (savedCheckout) {
      try {
        snapshot = JSON.parse(savedCheckout);
      } catch {
        snapshot = null;
      }
    }

    if (snapshot) {
      setSelectedService(normalizeServiceId(snapshot.selectedService || ""));
      setSelectedDate(snapshot.selectedDate || "");
      setSelectedTime(snapshot.selectedTime || "");
      setPaymentMode(snapshot.paymentMode || "deposit");
      setFormData(buildFormState(snapshot.formData));
    }

    if (checkoutStatus === "success") {
      setPage("booking");
      setPageHistory(["home", "booking"]);
      setBookingStep(3);
      setPaymentCompleted(true);
      setPaymentLoadError("");

      if (snapshot?.formData?.smsConsent) {
        postJsonWithFallback(API_BASE, "/api/post-booking-sms", {
          customerName: getCustomerName(snapshot.formData || {}),
          customerPhone: snapshot.formData.phone || "",
          serviceTitle: snapshot.serviceTitle || "",
          bookingDate: snapshot.selectedDate || "",
          bookingTime: snapshot.selectedTime || "",
          smsConsent: snapshot.formData.smsConsent,
        }, "The SMS follow-up backend is not available at this address.").catch((error) => {
          console.error("SMS follow-up request failed:", error);
        });
      }

      sessionStorage.removeItem(CHECKOUT_STORAGE_KEY);
    }

    if (checkoutStatus === "cancelled") {
      setPage("booking");
      setPageHistory(["home", "booking"]);
      setBookingStep(3);
      setPaymentCompleted(false);
      setPaymentLoadError(
        "Stripe checkout was canceled before payment was completed."
      );
      sessionStorage.removeItem(CHECKOUT_STORAGE_KEY);
    }

    if (checkoutStatus) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [API_BASE]);

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
        "Basic firearm safety instruction",
        "Hands-on instructor support",
        "Certificate of completion for everyone who passes the class",
      ],
      requirements: ["State ID or driver's license"],
      pricingNotes: [
        "Deposit is one-third of class price",
        "Range fee may apply separately",
        "No refunds",
      ],
    },
    {
      id: "renewal3",
      title: "3-Hour Renewal Course",
      price: 75,
      duration: "3 hr",
      description:
        "Renewal training for qualified students who need a 3-hour concealed carry renewal course.",
      audience: "Best for renewal students needing required update training.",
      included: [
        "3-hour renewal instruction",
        "Certificate of completion for everyone who passes the class",
        "Structured classroom review",
      ],
      requirements: ["State ID or driver's license"],
      pricingNotes: [
        "Deposit is one-third of class price",
        "Late arrival may trigger a $55 makeup fee",
        "No refunds",
      ],
    },
    {
      id: "veteran8",
      title: "8-Hours Class Veteran",
      price: 100,
      duration: "8 hr",
      description:
        "Extended training course for veterans with structured instruction and state-credit considerations.",
      audience: "Designed for qualifying veterans needing 8-hour credit.",
      included: [
        "8-hour instruction",
        "Application assistance",
        "Structured training support",
        "Certificate of completion for everyone who passes the class",
      ],
      requirements: [
        "DD-214 showing honorable discharge",
        "State ID or driver's license",
      ],
      pricingNotes: [
        "Deposit is one-third of class price",
        "Range qualification standards apply",
        "No refunds",
      ],
    },
    {
      id: "ccl16",
      title: "16-Hour CCL Course",
      price: 225,
      duration: "16 hr",
      description:
        "Full concealed carry license training course for students who need complete instruction.",
      audience: "Best for first-time students needing full CCL training.",
      included: [
        "16-hour class instruction",
        "Hands-on training",
        "Certificate of completion for everyone who passes the class",
      ],
      requirements: ["State ID or driver's license"],
      pricingNotes: [
        "Deposit is one-third of class price",
        "Range fee may apply separately",
        "No refunds",
      ],
    },
  ];

  const classPhotos = [
    {
      src: "/training-action-user/IMG_4245.jpg",
      alt: "Illinois Protective Services training photo 1",
    },
    {
      src: "/training-action-user/C2C09DB7-97DB-4296-A03B-7D9C885469B0.jpg",
      alt: "Illinois Protective Services training photo 2",
    },
    {
      src: "/training-action-user/IMG_3702.jpg",
      alt: "Illinois Protective Services training photo 3",
    },
    {
      src: "/training-action-user/IMG_3788.jpg",
      alt: "Illinois Protective Services training photo 4",
    },
    {
      src: "/training-action-user/IMG_3835.jpg",
      alt: "Illinois Protective Services training photo 5",
    },
    {
      src: "/training-action-user/IMG_3840.jpg",
      alt: "Illinois Protective Services training photo 6",
    },
    {
      src: "/training-action-user/IMG_4142.jpg",
      alt: "Illinois Protective Services training photo 7",
    },
    {
      src: "/training-action-user/IMG_9509.jpg",
      alt: "Illinois Protective Services training photo 8",
    },
    {
      src: "/training-action-user/IMG_7730.jpg",
      alt: "Illinois Protective Services training photo 9",
    },
    {
      src: "/training-action-user/IMG_7731.jpg",
      alt: "Illinois Protective Services training photo 10",
    },
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
      a: "You do not need to bring paperwork to class. Bring a valid state ID or driver’s license, and veterans claiming credit should also bring a DD-214.",
    },
    {
      q: "What should I bring?",
      a: "Bring your state ID or driver’s license. If you are claiming veteran credit, bring your DD-214.",
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
      q: "Do I get a certificate of completion?",
      a: "Yes. Everyone who passes the class receives a certificate of completion at the end of class.",
    },
    {
      q: "How much is a replacement certificate?",
      a: "If you lost your certificate, the replacement fee is $75.00.",
    },
  ];

  const assistantInstructors = [
    {
      name: "Michael Wrotten-Simes",
      title: "CEO & Lead Instructor",
      summary:
        "He leads the academy with a safety-first, structured teaching style focused on responsible gun ownership, practical defensive training, and clear communication.",
    },
    {
      name: "Ron Austin",
      title: "Firearms Instructor",
      summary:
        "He emphasizes precision, awareness, and calm hands-on coaching so students can build confidence and proper technique on the range.",
    },
  ];

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
    const normalizedServiceId = normalizeServiceId(selectedService);
    return classServices.find((service) => service.id === normalizedServiceId);
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

  function updateFormFields(updates) {
    setFormData((prev) => buildFormState({ ...prev, ...updates }));
  }

  function updateSplitNameField(field, value) {
    setFormData((prev) =>
      buildFormState({
        ...prev,
        [field]: value,
      })
    );
  }

  function updateCombinedName(value) {
    const split = splitFullName(value);
    setFormData((prev) =>
      buildFormState({
        ...prev,
        name: value,
        firstName: split.firstName,
        lastName: split.lastName,
      })
    );
  }

  function resetBookingFlow() {
    setSelectedService("");
    setSelectedDate("");
    setSelectedTime("");
    setPaymentMode("deposit");
    setPaymentCompleted(false);
    setPaymentLoadError("");
    setBookingStep(1);
    setFormData((prev) =>
      buildFormState({
        ...prev,
        smsConsent: false,
      })
    );
  }

  async function startStripeCheckout(mode) {
    const normalizedServiceId = normalizeServiceId(selectedService);
    const preparedFormData = buildFormState(formData);
    const customerName = getCustomerName(preparedFormData);

    if (!normalizedServiceId || !selectedDate || !selectedTime) {
      alert("Please complete your booking details first.");
      return;
    }

    if (
      !preparedFormData.firstName.trim() ||
      !preparedFormData.lastName.trim() ||
      !preparedFormData.phone.trim() ||
      !preparedFormData.email.trim()
    ) {
      alert(
        "Please enter your first name, last name, phone number, and email before continuing."
      );
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        String(preparedFormData.email || "").trim()
      )
    ) {
      alert("Please enter a valid email address before loading payment.");
      return;
    }

    if (!preparedFormData.smsConsent) {
      alert("Please agree to receive booking-related SMS updates before continuing.");
      return;
    }

    setLoadingPaymentIntent(true);
    setPaymentLoadError("");
    setPaymentMode(mode);
    setPaymentCompleted(false);

    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        CHECKOUT_STORAGE_KEY,
        JSON.stringify({
          selectedService: normalizedServiceId,
          selectedDate,
          selectedTime,
          serviceTitle: getSelectedService()?.title || "",
          paymentMode: mode,
          formData: preparedFormData,
        })
      );
    }

    try {
      const data = await postJsonWithFallback(
        API_BASE,
        "/api/create-checkout-session",
        {
          serviceId: normalizedServiceId,
          paymentMode: mode,
          customerName,
          customerEmail: preparedFormData.email,
          customerPhone: preparedFormData.phone,
          bookingDate: selectedDate,
          bookingTime: selectedTime,
          origin: typeof window !== "undefined" ? window.location.origin : "",
          smsConsent: preparedFormData.smsConsent,
        },
        "The checkout backend is not available at this address."
      );

      if (!data.checkoutUrl) {
        throw new Error("Stripe checkout URL was not returned.");
      }

      window.location.assign(data.checkoutUrl);
    } catch (error) {
      console.error("startStripeCheckout error:", error);
      setPaymentLoadError(error.message || "Unable to load secure checkout.");
    } finally {
      setLoadingPaymentIntent(false);
    }
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
    if (
      !getCustomerName(formData) ||
      !formData.email ||
      !formData.phone ||
      !formData.type
    ) {
      alert("Please fill out your name, phone, email, and training type.");
      return;
    }

    setSubmitted(true);

    setFormData(buildFormState());
  }

  const navButtonClass =
    "rounded-full border px-4 py-2 tracking-[0.14em] transition";

  function getNavButtonClass(tab, isPrimary = false) {
    const isActive = page === tab;

    if (isPrimary) {
      return isActive
        ? `${navButtonClass} border-[#8ea6ff] bg-[#4169e1] text-white shadow-[0_0_20px_rgba(65,105,225,0.28)]`
        : `${navButtonClass} border-[#4169e1]/40 bg-[#4169e1] text-white hover:bg-[#3558c9]`;
    }

    return isActive
      ? `${navButtonClass} border-[#8ea6ff] bg-[#4169e1]/20 text-[#8ea6ff] shadow-[0_0_20px_rgba(65,105,225,0.18)]`
      : `${navButtonClass} border-white/10 bg-white/[0.03] text-white hover:border-[#4169e1]/50 hover:bg-[#4169e1]/10 hover:text-[#8ea6ff]`;
  }

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
            <button
              type="button"
              onClick={() => navigateTo("home")}
              className={getNavButtonClass("home")}
              aria-current={page === "home" ? "page" : undefined}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => navigateTo("about")}
              className={getNavButtonClass("about")}
              aria-current={page === "about" ? "page" : undefined}
            >
              About Us
            </button>
            <button
              type="button"
              onClick={() => navigateTo("classes")}
              className={getNavButtonClass("classes")}
              aria-current={page === "classes" ? "page" : undefined}
            >
              Classes
            </button>
            <button
              type="button"
              onClick={() => navigateTo("booking")}
              className={getNavButtonClass("booking")}
              aria-current={page === "booking" ? "page" : undefined}
            >
              Book Now
            </button>
            <button
              type="button"
              onClick={() => navigateTo("contact")}
              className={getNavButtonClass("contact", true)}
              aria-current={page === "contact" ? "page" : undefined}
            >
              Contact
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 px-4 pb-3 md:hidden">
          <button
            type="button"
            onClick={() => navigateTo("home")}
            className={getNavButtonClass("home")}
            aria-current={page === "home" ? "page" : undefined}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => navigateTo("about")}
            className={getNavButtonClass("about")}
            aria-current={page === "about" ? "page" : undefined}
          >
            About
          </button>
          <button
            type="button"
            onClick={() => navigateTo("classes")}
            className={getNavButtonClass("classes")}
            aria-current={page === "classes" ? "page" : undefined}
          >
            Classes
          </button>
          <button
            type="button"
            onClick={() => navigateTo("booking")}
            className={getNavButtonClass("booking")}
            aria-current={page === "booking" ? "page" : undefined}
          >
            Book
          </button>
          <button
            type="button"
            onClick={() => navigateTo("contact")}
            className={getNavButtonClass("contact", true)}
            aria-current={page === "contact" ? "page" : undefined}
          >
            Contact
          </button>
        </div>
      </div>
    );
  }

  const assistantProps = {
    apiBase: API_BASE,
    classServices,
    currentPage: page,
    faqs,
    instructors: assistantInstructors,
    navigateTo,
    setBookingStep,
    setSelectedService,
    selectedService,
    selectedDate,
    selectedTime,
    getSelectedService,
    getSelectedPrice,
    getSelectedDeposit,
    formatPrice,
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
        <NavBar />
        <SmartAIChat {...assistantProps} />

        <section className="mx-auto max-w-6xl px-6 py-16 md:px-10">
          <BackButton />

          <div className="max-w-4xl">
            <div className="inline-flex rounded-full border border-[#4169e1]/20 bg-[#f5f8ff] px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-[#4169e1]">
              About Us
            </div>

            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.06em] sm:text-5xl">
              Illinois Protective Services
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#4b5563]">
              Illinois Protective Services Goal Is To Teach Every Responsible
              American Citizen Gun Rights And Firearm Ownership. We Pride
              Ourselves On Professionalism, Courteous, Integrity, And
              Transparency. We Don&apos;t Just Aim To Shoot. We Aim To Please.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Professionalism",
              "Courteous",
              "Integrity",
              "Transparency",
            ].map((item) => (
              <div key={item} className={cardClass}>
                <ScanLine />
                <div className="flex items-center justify-center gap-3 text-center text-[#111111]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#4169e1]/20 bg-[linear-gradient(135deg,#fff3f4_0%,#f5f8ff_100%)] shadow-[0_8px_18px_rgba(15,23,42,0.08)]">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-5 w-5"
                    >
                      <path
                        d="M12 2.8l2.73 5.53 6.11.89-4.42 4.31 1.04 6.09L12 16.83 6.54 19.62l1.04-6.09-4.42-4.31 6.11-.89L12 2.8Z"
                        fill="#dc2626"
                        stroke="#4169e1"
                        strokeWidth="1.25"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div className="text-base font-bold tracking-[0.04em]">
                    {item}
                  </div>
                </div>
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
                imagePosition="center top"
                bio1="Michael Wrotten-Simes is the CEO and lead instructor of Illinois Protective Services, bringing a disciplined and professional approach to firearms training. His focus is on building responsible gun owners through structured instruction, safety-first standards, and practical defensive training."
                bio2="Known for clear communication and hands-on application assistance, Michael works to ensure students leave with confidence, knowledge, and a stronger understanding of firearm responsibility, personal protection, and Illinois training expectations."
              />

              <InstructorCard
                imageSrc="/instructor-ron.jpeg"
                imageAlt="Ron Austin instructor portrait"
                name="Ron Austin"
                title="Firearms Instructor"
                imagePosition="center top"
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
              At Illinois Protective Services, We Are Committed To Training
              Responsible, Confident, And Prepared Individuals. Our Mission Is
              To Provide Clear, Professional Instruction In A Safe And
              Structured Environment Where Every Student Is Treated With
              Respect.
            </p>

            <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-[#374151]">
              We Do Not Just Teach Firearm Use—We Teach Accountability,
              Awareness, And Discipline. Our Goal Is To Ensure Every Student
              Leaves Not Only Certified, But Fully Prepared To Protect
              Themselves And Their Loved Ones Responsibly.
            </p>
          </div>

          <div className="mt-14">
            <div className="inline-flex rounded-full border border-[#4169e1]/20 bg-[#f5f8ff] px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-[#4169e1]">
              Training In Action
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {classPhotos.map((photo, index) => (
                <a
                  key={index}
                  href={photo.src}
                  target="_blank"
                  rel="noreferrer"
                  className="group overflow-hidden rounded-[1.75rem] border border-[#d9dee8] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="h-[320px] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </a>
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
      <div className="min-h-screen bg-[linear-gradient(180deg,#fffdfd_0%,#f7f9ff_38%,#fffaf8_100%)] pb-24 text-[#111111] md:pb-0">
        <NavBar />
        <SmartAIChat {...assistantProps} />

        <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <BackButton />

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <div className="inline-flex rounded-full border border-[#b42318]/20 bg-[#fff3f4] px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-[#b42318]">
                Class Services
              </div>
              <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.06em] sm:text-5xl">
                Choose the Right Training Path
              </h1>
              <p className="mt-4 text-lg leading-8 text-[#4b5563]">
                Review class details with included items, requirements,
                and pricing before booking.
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
                  updateFormFields({ type: service.title });
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
      <div className="min-h-screen bg-[linear-gradient(180deg,#fffdfd_0%,#f7f9ff_38%,#fffaf8_100%)] pb-24 text-[#111111] md:pb-0">
        <NavBar />
        <SmartAIChat {...assistantProps} />

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
                            Deposit {formatPrice(Math.round((service.price / 3) * 100) / 100)}
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
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <RequiredFieldLabel>First Name</RequiredFieldLabel>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          updateSplitNameField("firstName", e.target.value)
                        }
                        placeholder="First Name"
                        className="w-full rounded-2xl border border-[#d9dee8] bg-white px-4 py-3 text-[#111111] outline-none"
                      />
                    </div>
                    <div>
                      <RequiredFieldLabel>Last Name</RequiredFieldLabel>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          updateSplitNameField("lastName", e.target.value)
                        }
                        placeholder="Last Name"
                        className="w-full rounded-2xl border border-[#d9dee8] bg-white px-4 py-3 text-[#111111] outline-none"
                      />
                    </div>
                    <div>
                      <RequiredFieldLabel>Phone Number</RequiredFieldLabel>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          updateFormFields({ phone: e.target.value })
                        }
                        placeholder="Phone Number"
                        className="w-full rounded-2xl border border-[#d9dee8] bg-white px-4 py-3 text-[#111111] outline-none"
                      />
                    </div>
                    <div>
                      <RequiredFieldLabel>Email Address</RequiredFieldLabel>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          updateFormFields({ email: e.target.value })
                        }
                        placeholder="Email Address"
                        className="w-full rounded-2xl border border-[#d9dee8] bg-white px-4 py-3 text-[#111111] outline-none"
                      />
                    </div>
                  </div>

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

                  <div className="rounded-2xl border border-[#d9dee8] bg-white p-4">
                    <label className="flex items-start gap-3 text-sm leading-6 text-[#374151]">
                      <input
                        type="checkbox"
                        checked={formData.smsConsent}
                        onChange={(e) =>
                          updateFormFields({ smsConsent: e.target.checked })
                        }
                        className="mt-1 h-4 w-4 rounded border-[#cbd5e1]"
                      />
                      <span>
                        I agree to receive SMS messages from Illinois Protective
                        Services related to my booking, including confirmations,
                        reminders, and schedule updates. Message frequency varies.
                        Message and data rates may apply. Reply STOP to opt out.
                      </span>
                    </label>
                  </div>

                  <div className="rounded-2xl border border-[#e85b66]/20 bg-[#fff3f4] p-4 text-sm text-[#b42318]">
                    No refunds. Rescheduling requests made with less than 24
                    hours’ notice will result in forfeiture of class credit and
                    require another class payment or deposit.
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-[#6b7280]">
                      Payment Option
                    </div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {[
                        {
                          value: "deposit",
                          label: `Deposit — ${formatPrice(getSelectedDeposit())}`,
                          detail: "Reserve your seat today",
                        },
                        {
                          value: "full",
                          label: `Full Amount — ${formatPrice(getSelectedPrice())}`,
                          detail: "Pay the full class amount now",
                        },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`cursor-pointer rounded-2xl border px-4 py-4 transition ${
                            paymentMode === option.value
                              ? "border-[#4169e1] bg-[#f5f8ff] text-[#111111]"
                              : "border-[#d9dee8] bg-white text-[#111111] hover:bg-[#f8fbff]"
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMode"
                            value={option.value}
                            checked={paymentMode === option.value}
                            onChange={() => {
                              setPaymentMode(option.value);
                              setPaymentLoadError("");
                            }}
                            className="sr-only"
                          />
                          <div className="text-xs font-black uppercase tracking-[0.16em] text-[#6b7280]">
                            {option.value === "deposit" ? "Deposit" : "Full Amount"}
                          </div>
                          <div className="mt-2 text-lg font-black">{option.label}</div>
                          <div className="mt-1 text-sm text-[#6b7280]">
                            {option.detail}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {paymentCompleted ? (
                    <div className="rounded-2xl border border-[#4169e1]/20 bg-[#f5f8ff] p-4 text-sm text-[#3558c9]">
                      Payment completed successfully.
                    </div>
                  ) : null}

                  {paymentCompleted ? (
                    <button
                      type="button"
                      onClick={confirmBooking}
                      className="mt-4 w-full rounded-2xl border border-[#4169e1]/40 bg-[#4169e1] px-6 py-4 text-center text-base font-black uppercase tracking-[0.16em] text-white hover:bg-[#3558c9]"
                    >
                      Confirm Booking
                    </button>
                  ) : null}
                </div>
              </div>

              <div className={cardClass}>
                <ScanLine />
                <h2 className="text-2xl font-black uppercase">Secure Payment</h2>

                {loadingPaymentIntent ? (
                  <div className="mt-6 rounded-2xl border border-[#d9dee8] bg-white p-5 text-[#6b7280]">
                    Redirecting to Stripe Checkout...
                  </div>
                ) : null}

                <div className="mt-6">
                  <HostedCheckoutPanel
                    paymentMode={paymentMode}
                    selectedPrice={getSelectedPrice()}
                    selectedDeposit={getSelectedDeposit()}
                    loading={loadingPaymentIntent}
                    errorMessage={paymentLoadError}
                    paymentCompleted={paymentCompleted}
                    onCheckout={() => startStripeCheckout(paymentMode)}
                  />
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    );
  }

  if (page === "contact") {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#fffdfd_0%,#f7f9ff_38%,#fffaf8_100%)] pb-24 text-[#111111] md:pb-0">
        <NavBar />
        <SmartAIChat {...assistantProps} />

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
                  248-7027
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
                  onChange={(e) => updateCombinedName(e.target.value)}
                  className="rounded-2xl border border-[#d9dee8] bg-white px-5 py-4 text-[#111111] placeholder:text-[#6b7280] outline-none"
                  placeholder="Full Name"
                />
                <input
                  value={formData.phone}
                  onChange={(e) => updateFormFields({ phone: e.target.value })}
                  className="rounded-2xl border border-[#d9dee8] bg-white px-5 py-4 text-[#111111] placeholder:text-[#6b7280] outline-none"
                  placeholder="Phone Number"
                />
                <input
                  value={formData.email}
                  onChange={(e) => updateFormFields({ email: e.target.value })}
                  className="rounded-2xl border border-[#d9dee8] bg-white px-5 py-4 text-[#111111] placeholder:text-[#6b7280] outline-none"
                  placeholder="Email Address"
                />
                <select
                  value={formData.type}
                  onChange={(e) => updateFormFields({ type: e.target.value })}
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
                    updateFormFields({ message: e.target.value })
                  }
                  className="min-h-[140px] rounded-2xl border border-[#d9dee8] bg-white px-5 py-4 text-[#111111] placeholder:text-[#6b7280] outline-none"
                  placeholder="Questions about paperwork, eligibility, scheduling, or training"
                />

                <label className="flex items-start gap-3 rounded-2xl border border-[#d9dee8] bg-white px-5 py-4 text-sm leading-6 text-[#374151]">
                  <input
                    type="checkbox"
                    checked={formData.smsConsent}
                    onChange={(e) =>
                      updateFormFields({ smsConsent: e.target.checked })
                    }
                    className="mt-1 h-4 w-4 rounded border-[#cbd5e1]"
                  />
                  <span>
                    By submitting this form, I agree to receive SMS messages from
                    Illinois Protective Services related to my booking or inquiry.
                    Message frequency varies. Message and data rates may apply.
                    Reply STOP to opt out.
                  </span>
                </label>

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
      text: "Every class is built around responsible handling, clear instruction, and real defensive awareness.",
    },
    {
      icon: "📘",
      title: "Application Assistance",
      text: "We help students understand requirements, qualification standards, and application steps before class day.",
    },
    {
      icon: "🎯",
      title: "CCL Range Qualifications",
      text: "Hands-on training and CCL range qualification support designed to build confidence, control, and consistency.",
    },
  ];

  const trustBadges = [
    "Certified Instructors",
    "Weekday Availability",
    "Application Assistance",
    "Supportive Environment",
  ];

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffdfd_0%,#f7f9ff_38%,#fffaf8_100%)] pb-24 text-[#111111] md:pb-0">
      <NavBar />
      <SmartAIChat {...assistantProps} />

      <section className="relative overflow-hidden border-b border-[#e5e7eb] bg-[linear-gradient(135deg,#fff1f1_0%,#ffffff_22%,#eef4ff_48%,#ffffff_70%,#fff4f4_100%)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.24),transparent_28%),radial-gradient(circle_at_top_right,rgba(65,105,225,0.22),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(220,38,38,0.10),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(65,105,225,0.12),transparent_28%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_9px,rgba(88,130,255,0.03)_10px)]" />

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
            Professional Illinois concealed carry instruction, practical
            training, and a clear path toward responsible firearm ownership.
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
              "Certified Instructors",
              "Weekday Classes",
              "CCL Range Qualifications",
              "Application Assistance",
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
                We help students move from interest to preparation with a clear
                process, practical instruction, and application assistance that
                keeps everything clear from booking through qualification.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {[
                "Beginner Friendly",
                "Professional Standards",
                "Application Assistance",
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
                <h3 className="mt-5 text-2xl font-black uppercase">{item.title}</h3>
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

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            "First-Time Students",
            "Renewal Students",
            "Veterans",
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
              <h3 className="mt-5 text-2xl font-black uppercase">{item.title}</h3>
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
              We understand that unexpected situations may arise. If you are unable
              to attend your scheduled class, please notify the instructor at
              least <span className="font-bold text-[#111111]">24 hours in advance</span>{" "}
              to retain full credit toward a future class date.
            </p>

            <p>
              Rescheduling requests made with{" "}
              <span className="font-bold text-[#111111]">
                less than 24 hours’ notice
              </span>{" "}
              will result in the forfeiture of your class credit. In these cases,
              a new payment and deposit will be required to secure a spot in a
              future class.
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
                248-7027
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
                <div>(224) 248-7027</div>
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
