import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const HERO_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1400' height='700'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0.3' y2='1'%3E%3Cstop offset='0%25' stop-color='%23343'/%3E%3Cstop offset='100%25' stop-color='%23232'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='1400' height='700'/%3E%3Ctext fill='%23676' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='22'%3EQuantity Surveying Hero — Replace via Admin%3C/text%3E%3C/svg%3E";

const PLACEHOLDER = (t) => `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='350'%3E%3Crect fill='%23DFE4E8' width='500' height='350'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='14'%3E${encodeURIComponent(t)}%3C/text%3E%3C/svg%3E`;

const gallery = [
  { name: "NIQS Fellowship Investiture 2023", img: PLACEHOLDER("NIQS Fellowship") },
  { name: "World Architectural Festival, Berlin", img: PLACEHOLDER("WAF Berlin") },
  { name: "NIQS Lagos 50th Anniversary", img: PLACEHOLDER("NIQS Lagos 50th") },
  { name: "Big 5 Talks Panel Session", img: PLACEHOLDER("Big 5 Talks") },
  { name: "NIQS Annual Lecture Series", img: PLACEHOLDER("NIQS Lecture") },
  { name: "Men of Impact 2025 Recognition", img: PLACEHOLDER("Men of Impact") },
];

export default function AboutQuantitySurveying() {
  const [slideIdx, setSlideIdx] = useState(0);
  const visible = 3;
  const maxIdx = Math.max(0, gallery.length - visible);

  useEffect(() => {
    const timer = setInterval(() => setSlideIdx((p) => (p >= maxIdx ? 0 : p + 1)), 4000);
    return () => clearInterval(timer);
  }, [maxIdx]);

  return (
    <div className="bg-white text-gray-900">
      {/* ═══ HERO IMAGE ═══ */}
      <section className="relative w-full" style={{ height: "65vh", minHeight: 420 }}>
        <img src={HERO_IMG} alt="Quantity Surveying" className="w-full h-full object-cover" />
      </section>

      {/* ═══ QUOTE + INTRO ═══ */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium mb-6">
            QUANTITY SURVEYING
          </p>

          <h2
            className="text-3xl sm:text-4xl lg:text-[42px] font-light italic leading-[1.25] text-gray-900 mb-12"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            "Being a Quantity Surveying professional goes beyond a career; it's a commitment to precision,
            excellence, and shaping the future of construction."
          </h2>

          <div className="flex gap-8 items-start">
            <div className="hidden sm:block w-24 h-[1px] bg-gray-300 mt-3 shrink-0" />
            <div className="text-[14px] text-gray-500 leading-relaxed space-y-4">
              <p>
                Bolaji Sotunde is a Fellow of the Nigerian Institute of Quantity Surveyors (FNIQS) — the highest membership cadre — elevated during the prestigious 30th Biennial Conference and General Meeting. He is a certified Quantity Surveyor and Cost Management Consultant with extensive experience across both private and public sectors.
              </p>
              <p>
                His expertise spans cost planning, procurement advisory, contract administration, bills of quantities, valuation, variation management, and final account settlement. He combines technical mastery with a people-centred approach, helping organisations deliver impact while equipping individuals with the skills and confidence to grow into effective professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ GALLERY CAROUSEL ═══ */}
      <section className="py-12 px-4 bg-white overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-end gap-2 mb-6">
            <button
              onClick={() => setSlideIdx((p) => Math.max(0, p - 1))}
              className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
            >
              <FiChevronLeft size={18} />
            </button>
            <button
              onClick={() => setSlideIdx((p) => Math.min(maxIdx, p + 1))}
              className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
            >
              <FiChevronRight size={18} />
            </button>
          </div>

          <div className="overflow-hidden">
            <motion.div
              className="flex gap-4"
              animate={{ x: `-${slideIdx * (100 / visible)}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {gallery.map((p, i) => (
                <div key={i} className="shrink-0" style={{ width: `calc(${100 / visible}% - 12px)` }}>
                  <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="mt-3 text-sm text-gray-600 italic" style={{ fontFamily: "Georgia, serif" }}>
                    {p.name}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: maxIdx + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideIdx(i)}
                className={`w-2 h-2 rounded-full transition ${i === slideIdx ? "bg-gray-800" : "bg-gray-300"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DETAILS + RECOGNITION ═══ */}
      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-4xl">
          <div className="text-[14px] text-gray-500 leading-relaxed space-y-4 mb-12">
            <p>
              In 2023, Bolaji was honoured with an Award for his Contributions to the Growth and Development of Quantity Surveying in Lagos State, recognised as one of the 50 Distinguished Members of the NIQS Lagos Chapter during the 50th Anniversary Dinner & Awards — a truly memorable celebration of five decades of excellence and professionalism.
            </p>
            <p>
              He served as Secretary of International Affairs for the Nigerian Institute of Quantity Surveyors from 2022 to 2023, championing global relevance and visibility for the profession. In 2025, he was named among the Industry Men of Impact in Quantity Surveying and Project Management.
            </p>
            <p>
              Bolaji is a strong advocate for Quantity Surveyors playing a central role in addressing industry challenges — from escalating construction material prices to implementing circular economy business models. He emphasises that in times of economic uncertainty, securing a QS is non-negotiable for any construction project.
            </p>
            <p>
              He also served as Resource Person for Project Management at the Mandatory Refresher Course Programme of NIQS, and participated as panelist at the Big 5 Talks on the role of Quantity Surveyors in circular economy construction models.
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-sm font-medium tracking-wider text-gray-600 hover:text-gray-900 transition"
            >
              LEARN MORE <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
