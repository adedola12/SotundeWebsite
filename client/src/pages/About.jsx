import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { fetchJson } from "../api/http";

const PLACEHOLDER_IMG = (label) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='800'%3E%3Crect fill='%23D5D0C8' width='600' height='800'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='16'%3E${encodeURIComponent(label)}%3C/text%3E%3C/svg%3E`;

// Timeline data — admin can update the About sections via dashboard
const timelineFallback = [
  {
    num: "01",
    label: "EARLY LIFE",
    years: "1980\n-2003",
    title: "Education and the Beginning of a Career",
    text: "Born and raised in Nigeria, Bolaji Sotunde developed a passion for construction and the built environment early in life. He pursued his education with determination, earning qualifications in Quantity Surveying and setting the foundation for a career defined by precision, excellence, and an unwavering commitment to professional growth.",
    text2: "His early years were marked by a deep curiosity about how things are built and a desire to ensure that every project is delivered with integrity. This mindset would become the cornerstone of his professional identity.",
  },
  {
    num: "02",
    label: "EARLY CAREER",
    years: "2003\n-2015",
    title: "The Cost Management Professional",
    text: "Bolaji began his professional journey in cost management consultancy and quantity surveying, quickly establishing himself as a dependable and results-focused professional. His ability to navigate complexity and find solutions earned him a strong referral-based reputation across both private and public sectors.",
    text2: "During this period, he held leadership roles overseeing high-profile projects, leading multidisciplinary teams to deliver innovative, cost-effective solutions that consistently met and exceeded client expectations. His systematic approach to every engagement set him apart in the industry.",
  },
  {
    num: "03",
    label: "RECOGNITION",
    years: "2016\n-2020",
    title: "International Stage & Leadership",
    text: "A notable highlight came in 2016 when Bolaji spearheaded a team of construction experts to the World Architectural Festival Awards in Berlin, Germany. Their artistic modern high-rise office project representing Lagos, Nigeria, earned second place among an international pool of competitors.",
    text2: "In 2019, he was recognised as PMO Leader at the PMO Global Awards, demonstrating exceptional project management office leadership. He also served as Resource Person for Project Management at the Mandatory Refresher Course Programme of the Nigerian Institute of Quantity Surveyors (NIQS).",
  },
  {
    num: "04",
    label: "FELLOWSHIP",
    years: "2021\n-2025",
    title: "Fellow of NIQS & Industry Impact",
    text: "In 2023, Bolaji was elevated to the highest membership cadre — Fellow of the Nigerian Institute of Quantity Surveyors (FNIQS) — during the prestigious 30th Biennial Conference. He also completed a 2-year tenure as Secretary of International Affairs for the institute.",
    text2: "He was recognised as one of the 50 Distinguished Members of NIQS Lagos Chapter during the 50th Anniversary celebrations, and in 2025 was named among the Industry Men of Impact in Quantity Surveying and Project Management. He continues to serve as Governor of the New Managers Community Group at The Covenant Nation.",
  },
];

export default function About() {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetchJson("/api/about")
      .then((d) => setSections(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  const bio = sections.find((s) => s.section === "biography");
  const business = sections.find((s) => s.section === "business");

  return (
    <div className="bg-white text-gray-900">
      {/* ═══════════════════════════════════════
          HERO — Title + Bio + Portrait
          ═══════════════════════════════════════ */}
      <section className="pt-10 pb-16 px-4">
        <div className="mx-auto max-w-7xl">
          {/* Tagline */}
          <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-gray-400 font-medium mb-4">
            Quantity Surveyor. Project Manager. Corporate MC. Leader.
          </p>

          {/* Large italic name */}
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-light italic leading-[1.1] text-gray-900 mb-12" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            Bolaji<br />
            Oluwatoyin<br />
            Sotunde
          </h1>

          {/* Bio + Image side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left — biography text */}
            <div className="text-[14px] text-gray-500 leading-relaxed space-y-4">
              {bio?.content ? (
                <div dangerouslySetInnerHTML={{ __html: bio.content }} />
              ) : (
                <>
                  <p>Bolaji Sotunde is a resolute, determined, and results-focused professional who believes that nothing is impossible. Known for his ability to navigate complexity, Bolaji is the go-to person when challenges arise. He has an exceptional knack for finding solutions and taking projects from where they are to where they should be.</p>
                  <p>With over 20 years of experience in construction, real estate, and corporate events hosting, Bolaji combines strong leadership, technical expertise, and analytical skills to deliver exceptional results. He is a certified Quantity Surveyor, Cost Management Consultant, Project Management Professional, and a Corporate Master of Ceremonies.</p>
                  <p>Throughout his career, Bolaji has held leadership roles overseeing high-profile projects in cost management consultancy, quantity surveying, and project management across both private and public sectors.</p>
                  <p>Beyond project management, Bolaji is passionate about leadership development, serving as a training consultant, facilitator, lead strategist, and public speaker — dedicated to nurturing the growth of young professionals.</p>
                  <p>Bolaji is happily married to Bisi Sotunde, the CEO of the BusyBee Group, and they are blessed with two wonderful children.</p>
                </>
              )}
            </div>

            {/* Right — B&W portrait */}
            <div className="flex justify-center lg:justify-end">
              <img
                src={bio?.imageUrl || PLACEHOLDER_IMG("Portrait Photo")}
                alt="Bolaji Sotunde"
                className="w-full max-w-md rounded-sm"
                style={{ filter: "grayscale(80%) contrast(1.05)" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TIMELINE — Scrolling sections with large years
          ═══════════════════════════════════════ */}
      {timelineFallback.map((item, i) => (
        <TimelineSection key={i} item={item} index={i} />
      ))}

      {/* ═══════════════════════════════════════
          CREDENTIALS — Bottom section
          ═══════════════════════════════════════ */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">Credentials & Certifications</p>
              <ul className="space-y-3 text-sm text-gray-600">
                {[
                  "PRINCE2 Project Management Practitioner",
                  "Fellow, Nigerian Institute of Quantity Surveyors (FNIQS)",
                  "Fellow, Institute of Leadership Management (UK)",
                  "Associate Member, Certified Institute of Cost Management of Nigeria",
                  "Associate Member, Commonwealth Association of Surveying & Land Economics (CASLE)",
                  "Member, Institute of Construction Industry Arbitrators",
                ].map((c, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">Professional Philosophy</p>
              <blockquote className="text-xl sm:text-2xl font-light italic text-gray-700 leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
                "Nothing is impossible. With the right mindset, teamwork, and unwavering commitment, any challenge can be overcome and any goal can be achieved."
              </blockquote>
              <p className="mt-4 text-sm text-gray-400">— Bolaji Sotunde</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════
   TIMELINE SECTION COMPONENT
   Large years on left, content on right
   with scroll-triggered animations
   ═══════════════════════════════════════ */
function TimelineSection({ item, index }) {
  const isEven = index % 2 === 0;

  return (
    <section className={`py-16 sm:py-24 px-4 ${isEven ? "bg-white" : "bg-gray-50"}`}>
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* LEFT — Number + Label + Large Year */}
          <div className="flex flex-col">
            {/* Section number + label */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="text-sm text-gray-400">{item.num}</span>
              <span className="w-8 h-[1px] bg-gray-400" />
              <span className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium">
                {item.label}
              </span>
            </motion.div>

            {/* Large year numbers */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-[80px] sm:text-[120px] lg:text-[160px] font-bold leading-[0.85] text-gray-900 tracking-tighter"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              {item.years.split("\n").map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — Title + Text + Image */}
          <div className="flex flex-col justify-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl sm:text-3xl font-light text-gray-900 mb-6"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {item.title}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-4"
            >
              <p className="text-[14px] text-gray-500 leading-relaxed">{item.text}</p>

              {/* Image placeholder */}
              <div className="my-6">
                <img
                  src={PLACEHOLDER_IMG(`${item.label} Photo`)}
                  alt={item.title}
                  className="w-full max-w-md rounded-sm"
                  style={{ filter: "grayscale(70%)" }}
                />
              </div>

              <p className="text-[14px] text-gray-500 leading-relaxed">{item.text2}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
