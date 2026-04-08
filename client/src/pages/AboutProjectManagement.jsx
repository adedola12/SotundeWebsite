import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const HERO_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1400' height='700'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0.5' y2='1'%3E%3Cstop offset='0%25' stop-color='%23334'/%3E%3Cstop offset='100%25' stop-color='%23223'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='1400' height='700'/%3E%3Ctext fill='%23667' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='22'%3EProject Management Hero — Replace via Admin%3C/text%3E%3C/svg%3E";

const PLACEHOLDER = (t) => `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='350'%3E%3Crect fill='%23E8E4DF' width='500' height='350'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='14'%3E${encodeURIComponent(t)}%3C/text%3E%3C/svg%3E`;

const projects = [
  { name: "High-Rise Office Complex", img: PLACEHOLDER("High-Rise Office") },
  { name: "Government Infrastructure Programme", img: PLACEHOLDER("Govt Infrastructure") },
  { name: "Commercial Real Estate Dev.", img: PLACEHOLDER("Commercial RE") },
  { name: "Multi-Phase Residential", img: PLACEHOLDER("Residential Project") },
  { name: "Industrial Facility", img: PLACEHOLDER("Industrial Facility") },
  { name: "Public Sector Development", img: PLACEHOLDER("Public Sector") },
];

export default function AboutProjectManagement() {
  const [slideIdx, setSlideIdx] = useState(0);
  const visible = 3;
  const maxIdx = Math.max(0, projects.length - visible);

  useEffect(() => {
    const timer = setInterval(() => setSlideIdx((p) => (p >= maxIdx ? 0 : p + 1)), 4000);
    return () => clearInterval(timer);
  }, [maxIdx]);

  return (
    <div className="bg-white text-gray-900">
      {/* ═══ HERO IMAGE ═══ */}
      <section className="relative w-full" style={{ height: "65vh", minHeight: 420 }}>
        <img src={HERO_IMG} alt="Project Management" className="w-full h-full object-cover" />
      </section>

      {/* ═══ QUOTE + INTRO ═══ */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium mb-6">
            PROJECT MANAGEMENT
          </p>

          <h2
            className="text-3xl sm:text-4xl lg:text-[42px] font-light italic leading-[1.25] text-gray-900 mb-12"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            "A one-size-fits-all methodology is often inadequate. Each project carries its own set of
            specific requirements that demand a tailored approach."
          </h2>

          <div className="flex gap-8 items-start">
            <div className="hidden sm:block w-24 h-[1px] bg-gray-300 mt-3 shrink-0" />
            <div className="text-[14px] text-gray-500 leading-relaxed space-y-4">
              <p>
                With over 20 years of experience in construction and real estate, Bolaji Sotunde combines strong leadership, technical expertise, and analytical skills to deliver exceptional project management results. He is a certified Project Management Professional and PRINCE2 Practitioner.
              </p>
              <p>
                Throughout his career, Bolaji has held leadership roles overseeing high-profile projects in cost management consultancy, quantity surveying, and project management across both private and public sectors. His extensive experience includes successfully managing complex government-level projects and leading multidisciplinary teams to deliver innovative, cost-effective solutions that consistently meet and exceed client expectations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PROJECT CAROUSEL ═══ */}
      <section className="py-12 px-4 bg-white overflow-hidden">
        <div className="mx-auto max-w-7xl">
          {/* Carousel nav */}
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

          {/* Slides */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-4"
              animate={{ x: `-${slideIdx * (100 / visible)}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {projects.map((p, i) => (
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

          {/* Dots */}
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

      {/* ═══ DETAILS + CREDENTIALS ═══ */}
      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-4xl">
          <div className="text-[14px] text-gray-500 leading-relaxed space-y-4 mb-12">
            <p>
              A notable highlight of his career came in 2016 when Bolaji spearheaded a team of construction experts to the World Architectural Festival Awards in Berlin, Germany. Their artistic modern high-rise office project representing Lagos, Nigeria, earned second place among an international pool of competitors.
            </p>
            <p>
              In 2019, he was recognised as PMO Leader at the PMO Global Awards for demonstrating exceptional project management office leadership and delivery excellence. His systematic approach to every engagement — combining cost efficiency with quality assurance — has earned him a strong referral-based reputation across the industry.
            </p>
            <p>
              Collaboration with clients and stakeholders is critical in his approach. By engaging in open dialogues and gaining a clear understanding of what is most important — be it minimising costs, meeting tight deadlines, or mitigating risks — strategies are aligned accordingly. This approach not only fosters trust but also enhances the likelihood of meeting or exceeding expectations.
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
