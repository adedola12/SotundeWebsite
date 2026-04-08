/**
 * Seed Script — Run once to populate the Sotunde Website with content.
 * Usage:  node seed.js
 */
import "dotenv/config";
import dns from "node:dns";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

import { User } from "./models/User.js";
import About from "./models/AboutModel.js";
import Speech from "./models/SpeechModel.js";
import Blog from "./models/BlogModel.js";
import Video from "./models/VideoModel.js";

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) { console.error("MONGO_URI required"); process.exit(1); }

await mongoose.connect(MONGO_URI);
console.log("Connected to MongoDB:", mongoose.connection.name);

// ═══════════════════════════════════════════════════
// 1. ADMIN ACCOUNT
// ═══════════════════════════════════════════════════
const ADMIN_EMAIL = "admin@sotunde.com";
const ADMIN_PASSWORD = "Admin@2025";

const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
if (!existingAdmin) {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await User.create({ email: ADMIN_EMAIL, passwordHash, userType: "admin" });
  console.log(`✅ Admin created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
} else {
  console.log(`⏭️  Admin already exists: ${ADMIN_EMAIL}`);
}

// ═══════════════════════════════════════════════════
// 2. ABOUT SECTIONS
// ═══════════════════════════════════════════════════
const aboutSections = [
  {
    section: "hero",
    title: "Bolaji Sotunde",
    subtitle: "Quantity Surveyor • Project Manager • Corporate MC • Leader",
    content: "<p>Bolaji Sotunde's Lifework and Impact</p>",
  },
  {
    section: "biography",
    title: "About Bolaji Sotunde",
    content: `<p>Bolaji Sotunde is a resolute, determined, and results-focused professional who believes that nothing is impossible. Known for his ability to navigate complexity, Bolaji is the go-to person when challenges arise. He has an exceptional knack for finding solutions and taking projects from where they are to where they should be, with a dependable and unwavering commitment that has earned him a strong referral-based reputation.</p>
<p>With over 20 years of experience in construction, real estate, and corporate events hosting, Bolaji combines strong leadership, technical expertise, and analytical skills to deliver exceptional results. He is a certified Quantity Surveyor, Cost Management Consultant, Project Management Professional, and a Corporate Master of Ceremonies\u2014an uncommon blend that highlights his diverse talents and systematic approach to his work.</p>
<p>Throughout his career, Bolaji has held leadership roles overseeing high-profile projects in cost management consultancy, quantity surveying, and project management across both private and public sectors. His extensive experience includes successfully managing complex government-level projects and leading multidisciplinary teams to deliver innovative, cost-effective solutions that consistently meet and exceed client expectations.</p>
<p>A notable highlight of his career came in 2016 when Bolaji spearheaded a team of construction experts to the World Architectural Festival Awards in Berlin, Germany. Their artistic modern high-rise office project representing Lagos, Nigeria, earned second place among an international pool of competitors.</p>
<p>Beyond project management, Bolaji is passionate about leadership development, serving as a training consultant, facilitator, lead strategist, and public speaker\u2014dedicated to nurturing the growth of young professionals.</p>
<p>Bolaji is happily married to Bisi Sotunde, the CEO of the BusyBee Group, and they are blessed with two wonderful children.</p>
<p>Driven by a \u201cnothing is impossible\u201d mindset and a commitment to teamwork, Bolaji Sotunde continues to make an impact across multiple sectors, delivering solutions and driving progress every step of the way.</p>`,
  },
  {
    section: "business",
    title: "Leadership, Recognition & Professional Impact",
    content: `<p>Bolaji is a leader committed to advancing professional excellence and building future-ready leaders. With international certifications, industry recognitions, and years of service as a trainer and mentor, he combines technical expertise with a people-centred approach, helping organisations deliver impact while equipping individuals with the skills and confidence to grow into effective leaders.</p>
<h3>Professional Leadership & Contributions</h3>
<ul>
<li><strong>2025:</strong> Honouree \u2014 Men of Impact in Quantity Surveying and Project Management</li>
<li><strong>2022\u20132023:</strong> Secretary, Nigerian Institute of Quantity Surveyors</li>
<li><strong>2019:</strong> PMO Leader at the PMO Global Awards</li>
<li><strong>2016:</strong> Resource Person for Project Management at the Mandatory Refresher Course Programme of NIQS</li>
<li>Governor, New Managers Community Group, The Covenant Nation \u2014 supporting professionals transitioning into leadership roles</li>
</ul>
<h3>Credentials & Certifications</h3>
<ul>
<li>PRINCE2 Project Management Practitioner</li>
<li>Fellow, Institute of Leadership Management (UK)</li>
<li>Associate Member, Certified Institute of Cost Management of Nigeria</li>
<li>Associate Member, Commonwealth Association of Surveying & Land Economics (CASLE)</li>
<li>Member, Institute of Construction Industry Arbitrators</li>
</ul>`,
  },
  {
    section: "philanthropy",
    title: "Achievements & Recognition",
    content: `<h3>Investiture as Fellow of the Nigerian Institute of Quantity Surveyors (2023)</h3>
<p>Being elevated to the highest membership cadre is an incredible honour. Being a Quantity Surveying professional goes beyond a career; it\u2019s a commitment to precision, excellence, and shaping the future of construction and development.</p>
<h3>Award for Contributions to Quantity Surveying in Lagos State</h3>
<p>Recognised as one of the 50 Distinguished Members of the Nigerian Institute of Quantity Surveyors (NIQS), Lagos Chapter, who have contributed significantly to the Chapter\u2019s growth and impact. The recognition came during the 50th Anniversary Dinner & Awards of the NIQS Lagos Chapter.</p>
<h3>Honouree: Man of Impact in Quantity Surveying and Project Management</h3>
<p>Acknowledged for driving excellence and innovation in the fields of Quantity Surveying and Project Management.</p>`,
  },
  {
    section: "vision",
    title: "The Vision",
    content: `<p>Driven by a \u201cnothing is impossible\u201d mindset and a commitment to teamwork, Bolaji Sotunde continues to make an impact across multiple sectors. His vision is to advance professional excellence, build future-ready leaders, and drive transformative change in the construction industry and beyond.</p>`,
  },
  {
    section: "quote",
    title: "Bolaji Sotunde",
    content: "Nothing is impossible. With the right mindset, teamwork, and unwavering commitment, any challenge can be overcome and any goal can be achieved.",
  },
];

for (const s of aboutSections) {
  await About.findOneAndUpdate({ section: s.section }, s, { upsert: true, new: true });
}
console.log("✅ About sections seeded:", aboutSections.length);

// ═══════════════════════════════════════════════════
// 3. SPEECHES
// ═══════════════════════════════════════════════════
const speeches = [
  {
    title: "The African Quantity Surveying Week and Conference Lecture",
    slug: "african-qs-week-conference-lecture",
    excerpt: "Bolaji Sotunde's lecture at The African Quantity Surveying Week and Conference, sharing insights on the profession's future across the continent.",
    content: "<p>Bolaji Sotunde delivered a keynote lecture at The African Quantity Surveying Week and Conference, addressing the evolving landscape of quantity surveying across Africa and the opportunities for professional growth and collaboration.</p>",
    category: "Keynote",
    videoUrl: "https://www.youtube.com/embed/s7o7AGRHvKg",
    published: true,
    date: new Date("2024-06-15"),
  },
  {
    title: "The Role of Quantity Surveyors in Circular Economy Business Models in Construction",
    slug: "qs-role-circular-economy-construction",
    excerpt: "Panel session at the Big 5 Talks on how QS professionals can drive Circular Economy adoption in the construction industry.",
    content: `<p>Bolaji participated as a panelist at the Big 5 Talks session on \u201cThe Role of Quantity Surveyors in the Implementation of Circular Economy Business Models in Construction.\u201d He shared the stage with esteemed colleagues, including QS Bamidele Mafimidiwo FNIQS, Vice-President of the Nigerian Institute of Quantity Surveyors (NIQS).</p>
<p>During the panel session, Bolaji emphasised the importance for Quantity Surveyors to acquire in-depth knowledge of the availability, functional requirements, and costs associated with environmentally sustainable materials and services. This knowledge is essential for providing informed advice on adopting Circular Economy practices.</p>
<p>While the initial capital cost of adopting the Circular Economy model may be moderately higher than traditional linear construction methods, the overall lifecycle costing will reveal its long-term cost benefits. This makes it crucial for Quantity Surveyors to develop the necessary skills to effectively advise on these models.</p>
<p>He also noted that, although the Circular Economy model is a welcome shift, the speed of implementation in developing countries should not be compared to that of developed nations. Cultural biases and resistance to change pose significant barriers. However, with sincere government policies and targeted incentives, we can encourage broader adoption of Circular Economy practices.</p>`,
    category: "Panel",
    published: true,
    date: new Date("2024-03-10"),
  },
];

for (const s of speeches) {
  const exists = await Speech.findOne({ slug: s.slug });
  if (!exists) await Speech.create(s);
}
console.log("✅ Speeches seeded:", speeches.length);

// ═══════════════════════════════════════════════════
// 4. BLOG / THOUGHT LEADERSHIP ARTICLES
// ═══════════════════════════════════════════════════
const blogs = [
  {
    title: "Stepping Into Leadership: Common Pitfalls to Avoid as a New Manager",
    slug: "stepping-into-leadership-pitfalls-new-manager",
    excerpt: "A managerial role involves managing yourself first, as well as working productively with your team. Learn to avoid common mistakes new managers often make.",
    content: `<p>As a manager or team leader, getting to where you are today is most likely the result of your technical skills and educational background, which gave you an advantage over other applicants or team members. While these are crucial factors in your appointment, they do not necessarily cover what your role as a manager truly requires.</p>
<p>A managerial role involves managing yourself first, as well as working productively with your team. To carry out your duties effectively, you need to step into your position as a leader and intentionally cultivate, guide, and reinforce the same culture of excellence that helped you earn this role.</p>
<p>Below are some common mistakes to avoid as a new manager:</p>
<ul>
<li>Believing that what got you into a managerial position is all you need to excel in it.</li>
<li>Underestimating the scope and demands of your responsibilities.</li>
<li>Struggling to make the necessary mindset shift required for the role.</li>
<li>Poor time (and life) management.</li>
<li>Overlooking the importance of people management.</li>
<li>Lacking a clear approach to team coordination.</li>
</ul>
<p>I often tell those around me that avoiding these common mistakes can be the key to longevity and success in management.</p>
<p>As John C. Maxwell said, \u201cLeadership is not about titles, positions, or flowcharts. It is about one life influencing another.\u201d</p>`,
    author: "Bolaji Sotunde",
    category: "thought-leadership",
    tags: ["leadership", "management", "career"],
    published: true,
    featured: true,
  },
  {
    title: "How to Resolve Project Issues: The Importance of Contract Terms",
    slug: "resolve-project-issues-contract-terms",
    excerpt: "Before escalating concerns or making assumptions, reviewing the contract terms provides clarity, reduces disputes, and ensures a structured approach to resolution.",
    content: `<p>Project issues are common across construction projects and other complex environments, but many challenges can be avoided with proper contract management. Before escalating concerns or making assumptions, reviewing the contract terms provides clarity, reduces disputes, and ensures a structured approach to resolution.</p>
<p>In the fast-paced world of project management, particularly within the construction industry, challenges are inevitable. However, the first professional step to take when an issue arises is often overlooked: review the contract.</p>
<p>It is easy to allow emotions, assumptions, or past experiences to influence your response. Yet the contract remains the foundation of every project. It clearly defines the rights, responsibilities, timelines, and remedies available to all parties involved.</p>
<p>It is also important to recognize that resolving an issue one way on a previous project does not guarantee the same approach on another. Each project is unique, and the contract should always be your primary reference point for guidance and dispute resolution.</p>
<p>Be guided by the terms, not emotion. This simple discipline can significantly improve outcomes, reduce conflict, and strengthen professional credibility across every stage of the project lifecycle.</p>
<p><em>Effective project leaders rely on documentation, not assumption. Let the contract guide the way.</em></p>`,
    author: "Bolaji Sotunde",
    category: "thought-leadership",
    tags: ["project-management", "contracts", "construction"],
    published: true,
    featured: true,
  },
  {
    title: "NIQS 15th Distinguished Annual Lecture 2023",
    slug: "niqs-15th-distinguished-annual-lecture-2023",
    excerpt: "The discussion focused on the potential impact of removing the fuel subsidy on the construction industry and the Nigerian economy.",
    content: `<p>Bolaji joined colleagues in the Quantity Surveying profession in Lagos State, as well as other allied professionals in the built environment, at the 15th Annual Distinguished Lecture Series organised by the Nigerian Institute of Quantity Surveyors (Lagos Chapter). The discussion focused on the potential impact of removing the fuel subsidy on the construction industry and the Nigerian economy.</p>
<p>For this 15th edition, it was a timely decision by the state chapter to invite Dr Gabriel Ogbechie, Group Managing Director of RainOil Limited, as the keynote speaker, alongside an array of other key stakeholders in the industry.</p>
<p>While the general notion is that the removal of the fuel subsidy is a step in the right direction, the immediate impact on the construction industry has been significant. It has led to a sharp increase in construction project costs, an influx of fluctuation claims, and rising demands for upward adjustments in wages across the workforce.</p>
<p>Notwithstanding these challenges, there is potential for gains, particularly if the government diligently utilises the projected savings directed toward infrastructure development.</p>
<p>QS professionals across the nation must rise to the occasion, adopting strategies that analyse construction processes and procurement systems to reduce costs without compromising quality. In times like these, securing a QS is non-negotiable if you are embarking on a construction project.</p>`,
    author: "Bolaji Sotunde",
    category: "thought-leadership",
    tags: ["quantity-surveying", "construction", "nigeria", "fuel-subsidy"],
    published: true,
    featured: true,
  },
  {
    title: "The Importance of Tailored Approaches in Project and Cost Management",
    slug: "tailored-approaches-project-cost-management",
    excerpt: "No two projects are identical. Recognising and adapting to unique project characteristics is essential for maintaining client and investor confidence.",
    content: `<p>My recent reflections on the state of doing business in the current economy and the built environment, combined with recent and ongoing engagements with clients, have underscored a fundamental truth: no two projects are identical.</p>
<p>While overarching constraints such as cost, time, and risk affect all projects, the extent and impact of these constraints can vary significantly depending on the project\u2019s nature and the priorities set by clients and stakeholders.</p>
<p>The high cost of construction due to increased material prices, ever-changing government policies, and the necessity to advise clients on how best to navigate projected business opportunities have further highlighted the need to understand each project\u2019s peculiarities.</p>
<p>A one-size-fits-all methodology is often inadequate in addressing the diverse needs and priorities of different projects. For instance, a commercial construction project may prioritize cost efficiency and timely delivery, while a tech development project might place greater emphasis on innovation and quality assurance.</p>
<p>Collaboration with clients and stakeholders is critical in this customisation process. By engaging in open dialogues and gaining a clear understanding of what is most important to them, we can align strategies accordingly.</p>
<p>If we are to remain relevant as professionals in this industry, we must ensure adaptability and personalised management in the field of Project and Cost Management.</p>`,
    author: "Bolaji Sotunde",
    category: "thought-leadership",
    tags: ["project-management", "cost-management", "construction"],
    published: true,
    featured: true,
  },
  {
    title: "Addressing Escalating Construction Material Prices",
    slug: "addressing-escalating-construction-material-prices",
    excerpt: "The NIQS President took a proactive stance on addressing the pressing issue of escalating construction material prices plaguing the industry.",
    content: `<p>Earlier today, the President of the Nigerian Institute of Quantity Surveyors, QS Kene Christopher Nzekwe FNIQS, took a proactive stance on addressing the pressing issue of escalating construction material prices plaguing the industry. The institute convened a press conference to shed light on these challenges, showcasing the essence of quantity surveyors as construction cost professionals.</p>
<p>The initiative taken by the current leadership of NIQS is commendable, not only for bringing attention to the current issues but also for proposing viable solutions. One such solution emphasised during the press conference was the imperative to promote and support the local manufacturing of building materials.</p>
<p>I am making a call for state chapters to similarly involve themselves in dialogues with state authorities through the press. It is imperative to emphasise the need for transparency in project costing. Beyond the overall project cost, the institute should advocate for the inclusion of life cycle costing.</p>
<p>NIQS leadership\u2019s proactive involvement in addressing industry challenges and proposing solutions sets a commendable precedent for professional bodies.</p>`,
    author: "Q.Surv Bolaji Sotunde",
    category: "thought-leadership",
    tags: ["construction", "material-prices", "niqs", "nigeria"],
    published: true,
    featured: false,
    date: new Date("2024-02-29"),
  },
  {
    title: "The Construction Cost Crisis: A Call for Quantity Surveying Professionals",
    slug: "construction-cost-crisis-call-for-qs",
    excerpt: "The construction industry in Nigeria is grappling with a significant challenge in monitoring and controlling construction costs due to naira devaluation.",
    content: `<p>The construction industry in Nigeria is grappling with a significant challenge in monitoring and controlling construction costs due to irregularities in building material prices linked to the constant devaluation of the naira.</p>
<p>Unusual fluctuations in building material prices, such as the doubling of cement prices and a rapid surge in reinforcement costs, are causing distress. Industry professionals seek advice, and contractors express their inability to execute contracts awarded just a week ago.</p>
<p>Clients face discouragement, financial plans are in disarray, and many are struggling to meet investment deliverables, exacerbating the already substantial housing deficit.</p>
<p>This period calls for industry colleagues to unite, developing localised models adaptable to our construction methodology and procurement system. While government policies and interventions may address the root cause, Quantity Surveyors can implement solutions to mitigate the impact.</p>
<p>Though challenging, this moment offers an opportunity to elevate the values of Quantity Surveying professionals, emphasising their crucial role in ensuring stability and resilience in the face of industry disruptions.</p>`,
    author: "Bolaji Sotunde",
    category: "thought-leadership",
    tags: ["construction", "cost-management", "nigeria"],
    published: true,
    featured: false,
  },
  {
    title: "Men of Impact 2025: Empowering Men \u2014 Achieving Balance in a Fast-Paced World",
    slug: "men-of-impact-2025",
    excerpt: "Bolaji Sotunde named among Industry Men of Impact 2025 alongside other distinguished professionals.",
    content: `<p>Bolaji Sotunde has been named among the Industry Men of Impact 2025, alongside distinguished professionals including Akosile, Bolarinwa, and Akinyemiju.</p>
<p>The recognition celebrates men who are achieving balance in a fast-paced world while making significant contributions to their respective fields and communities.</p>`,
    author: "Bolaji Sotunde",
    category: "news",
    tags: ["awards", "recognition", "2025"],
    published: true,
    featured: true,
  },
];

for (const b of blogs) {
  const exists = await Blog.findOne({ slug: b.slug });
  if (!exists) await Blog.create(b);
}
console.log("✅ Blog articles seeded:", blogs.length);

// ═══════════════════════════════════════════════════
// 5. VIDEOS
// ═══════════════════════════════════════════════════
const videos = [
  {
    title: "Bolaji Sotunde at The African Quantity Surveying Week and Conference",
    videoUrl: "https://www.youtube.com/embed/s7o7AGRHvKg",
    description: "Lecture at The African Quantity Surveying Week and Conference",
    category: "Keynote",
    published: true,
    featured: true,
  },
];

for (const v of videos) {
  const exists = await Video.findOne({ videoUrl: v.videoUrl });
  if (!exists) await Video.create(v);
}
console.log("✅ Videos seeded:", videos.length);

// ═══════════════════════════════════════════════════
console.log("\n🎉 Seeding complete!");
console.log("════════════════════════════════════════");
console.log("Admin Login Credentials:");
console.log(`  Email:    ${ADMIN_EMAIL}`);
console.log(`  Password: ${ADMIN_PASSWORD}`);
console.log("════════════════════════════════════════");
console.log("Visit http://localhost:5173/admin-auth to sign in.");
console.log("Then go to http://localhost:5173/admin to manage content.\n");

await mongoose.disconnect();
process.exit(0);
