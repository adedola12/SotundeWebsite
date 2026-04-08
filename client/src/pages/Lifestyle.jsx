import { useEffect, useState, useRef } from "react";
import { fetchJson } from "../api/http";
import { FaArrowRight } from "react-icons/fa";

// ─── Placeholder images ───
const PH = (label, w = 600, h = 700, bg = "D5D5D5") =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'%3E%3Crect fill='%23${bg}' width='${w}' height='${h}'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='16'%3E${encodeURIComponent(label)}%3C/text%3E%3C/svg%3E`;

// Business / Travel slideshow images (admin can replace these)
const defaultBusinessSlides = [
  { url: PH("Business Photo 1", 500, 700, "C8C8C8"), caption: "" },
  { url: PH("Business Photo 2", 500, 700, "BABABA"), caption: "" },
  { url: PH("Business Photo 3", 500, 700, "ADADAD"), caption: "" },
];

const defaultBusinessSide = PH("Side Photo", 250, 400, "D0D0D0");

// Events placeholder images
const defaultEventsSlides = [
  { url: PH("Events Photo 1", 500, 600, "C0B8B0"), caption: "" },
  { url: PH("Events Photo 2", 500, 600, "B8B0A8"), caption: "" },
];

// Personal photos placeholders
const defaultPersonalPhotos = [
  { url: PH("Family moment", 400, 400, "E0D8D0"), caption: "Family time" },
  { url: PH("With colleagues", 400, 500, "D8D0C8"), caption: "Professional connections" },
  { url: PH("At the office", 400, 400, "D0C8C0"), caption: "Everyday excellence" },
  { url: PH("Community work", 400, 350, "C8C0B8"), caption: "Giving back" },
  { url: PH("Team building", 500, 400, "E0D8D0"), caption: "The Sotunde team" },
];

export default function Lifestyle() {
  const [about, setAbout] = useState([]);

  useEffect(() => {
    fetchJson("/api/about")
      .then((d) => setAbout(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  // Admin can set social links via about sections (ctaLink field)
  const linkedinUrl = "https://www.linkedin.com"; // admin replaces via About tab
  const instagramUrl = "https://www.instagram.com"; // admin replaces via About tab

  return (
    <div className="bg-white text-gray-900">
      {/* ══════════════════════════════════════════
          SECTION 1: BUSINESS / TRAVEL
          Large image slideshow + side image + big text
          ══════════════════════════════════════════ */}
      <BusinessSection linkedinUrl={linkedinUrl} />

      {/* ══════════════════════════════════════════
          SECTION 2: EVENTS
          Overlapping images + title on right
          ══════════════════════════════════════════ */}
      <EventsSection instagramUrl={instagramUrl} />

      {/* ══════════════════════════════════════════
          SECTION 3: PERSONAL — Work-life balance
          Photo grid with zoom hover
          ══════════════════════════════════════════ */}
      <PersonalSection />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   BUSINESS SECTION — Animated slideshow + side photo
   ═══════════════════════════════════════════════════ */
function BusinessSection({ linkedinUrl }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = defaultBusinessSlides;
  const timerRef = useRef(null);

  // Auto-advance every 5s
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [slides.length]);

  return (
    <section className="py-0">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left side — small side image */}
          <div className="hidden lg:block shrink-0 self-start mt-16">
            <img
              src={defaultBusinessSide}
              alt="Travel"
              className="w-44 h-64 object-cover"
            />
          </div>

          {/* Center — large slideshow image with crossfade */}
          <div className="relative w-full max-w-md shrink-0 aspect-[3/4] overflow-hidden bg-gray-100">
            {slides.map((slide, i) => (
              <img
                key={i}
                src={slide.url}
                alt={`Business ${i + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  i === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}

            {/* Slide indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentSlide ? "bg-white w-4" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right — text content */}
          <div className="flex-1 lg:pl-4">
            <p className="text-sm text-gray-400 tracking-[0.2em] uppercase mb-4">
              BUSINESS
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-light leading-[1.15] text-gray-900 mb-8">
              I travel all over
              <br />
              the world,
              <br />
              promoting the
              <br />
              construction
              <br />
              industry's huge
              <br />
              potential.
            </h2>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 tracking-[0.15em] uppercase transition-colors"
            >
              SEE MORE <FaArrowRight size={11} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   EVENTS SECTION — Overlapping images + text right
   ═══════════════════════════════════════════════════ */
function EventsSection({ instagramUrl }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = defaultEventsSlides;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Left — overlapping images with slideshow */}
          <div className="relative w-full max-w-lg shrink-0" style={{ minHeight: 450 }}>
            {/* Back image */}
            <div className="absolute top-0 left-0 w-[65%] aspect-[3/4] overflow-hidden bg-gray-200 z-0">
              <img
                src={slides[0]?.url || PH("Event 1")}
                alt="Events"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Front overlapping image with slideshow */}
            <div className="relative ml-auto w-[60%] aspect-[3/4] overflow-hidden bg-gray-200 z-10 mt-12">
              {slides.map((slide, i) => (
                <img
                  key={i}
                  src={slide.url}
                  alt={`Event ${i + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                    i === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right — text */}
          <div className="flex-1">
            <p className="text-sm text-gray-400 tracking-[0.2em] uppercase mb-4">
              EVENTS
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-light leading-[1.15] text-gray-900 mb-8">
              Work Hard,
              <br />
              Play Hard.
            </h2>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 tracking-[0.15em] uppercase transition-colors"
            >
              SEE MORE <FaArrowRight size={11} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   PERSONAL SECTION — Photo grid with zoom hover
   ═══════════════════════════════════════════════════ */
function PersonalSection() {
  const photos = defaultPersonalPhotos;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20">
        <p className="text-sm text-gray-400 tracking-[0.2em] uppercase mb-2">
          PERSONAL
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-10">
          Work-life balance
        </h2>

        {/* Photo Grid — first row 3 cols, second row 2 cols (matching TOE layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {photos.slice(0, 3).map((photo, i) => (
            <PhotoCard key={i} photo={photo} />
          ))}
        </div>

        {photos.length > 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {photos.slice(3, 5).map((photo, i) => (
              <PhotoCard key={i + 3} photo={photo} />
            ))}
          </div>
        )}

        {photos.length === 0 && (
          <p className="text-gray-400 text-center py-12">
            Personal photos will appear here. Add them from the admin Gallery tab.
          </p>
        )}
      </div>
    </section>
  );
}

/* ── Photo Card with zoom hover effect ── */
function PhotoCard({ photo }) {
  return (
    <div className="group overflow-hidden bg-gray-100">
      {/* Image with zoom on hover */}
      <div className="overflow-hidden">
        <img
          src={photo.url}
          alt={photo.caption || ""}
          className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
      </div>
      {/* Caption */}
      {photo.caption && (
        <p className="mt-2 mb-4 px-1 text-[13px] text-gray-400 italic">
          {photo.caption}
        </p>
      )}
    </div>
  );
}
