/**
 * Seed additional speeches from the Sotunde document.
 * Usage: node seed-speeches.js
 */
import "dotenv/config";
import dns from "node:dns";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

import Speech from "./models/SpeechModel.js";

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) { console.error("MONGO_URI required"); process.exit(1); }

await mongoose.connect(MONGO_URI);
console.log("Connected to MongoDB:", mongoose.connection.name);

const speeches = [
  {
    title: "The African Quantity Surveying Week and Conference Lecture",
    slug: "african-qs-week-conference-lecture",
    excerpt: "Bolaji Sotunde's lecture at The African Quantity Surveying Week and Conference, sharing insights on the profession's future across the continent.",
    content: `<p>Bolaji Sotunde delivered a keynote lecture at The African Quantity Surveying Week and Conference, addressing the evolving landscape of quantity surveying across Africa and the opportunities for professional growth and collaboration.</p>
<p>The lecture covered key themes including the modernisation of QS practices, the adoption of technology in cost management, and the importance of cross-border collaboration among African QS professionals.</p>
<p>As the construction industry across Africa continues to grow, the role of Quantity Surveyors becomes increasingly critical in ensuring cost-effective and sustainable development.</p>`,
    category: "Keynote",
    videoUrl: "https://www.youtube.com/embed/s7o7AGRHvKg",
    published: true,
    date: new Date("2024-06-15"),
    location: "Africa",
  },
  {
    title: "The Role of Quantity Surveyors in Circular Economy Business Models in Construction",
    slug: "qs-role-circular-economy-construction",
    excerpt: "Panel session at the Big 5 Talks on how QS professionals can drive Circular Economy adoption in the construction industry.",
    content: `<p>Bolaji participated as a panelist at the Big 5 Talks session on "The Role of Quantity Surveyors in the Implementation of Circular Economy Business Models in Construction." He shared the stage with esteemed colleagues, including QS Bamidele Mafimidiwo FNIQS, Vice-President of the Nigerian Institute of Quantity Surveyors (NIQS).</p>
<p>During the panel session, Bolaji emphasised the importance for Quantity Surveyors to acquire in-depth knowledge of the availability, functional requirements, and costs associated with environmentally sustainable materials and services. This knowledge is essential for providing informed advice on adopting Circular Economy practices.</p>
<p>While the initial capital cost of adopting the Circular Economy model may be moderately higher than traditional linear construction methods, the overall lifecycle costing will reveal its long-term cost benefits. This makes it crucial for Quantity Surveyors to develop the necessary skills to effectively advise on these models.</p>
<p>He also noted that, although the Circular Economy model is a welcome shift, the speed of implementation in developing countries should not be compared to that of developed nations, which benefit from advanced infrastructure and financial frameworks. Cultural biases and resistance to change also pose significant barriers. However, with sincere government policies and targeted incentives, we can encourage broader adoption of Circular Economy practices.</p>`,
    category: "Panel Discussion",
    published: true,
    date: new Date("2024-03-10"),
    location: "Lagos, Nigeria",
  },
  {
    title: "NIQS 15th Distinguished Annual Lecture — Impact of Fuel Subsidy Removal on Construction",
    slug: "niqs-15th-annual-lecture-fuel-subsidy",
    excerpt: "The discussion focused on the potential impact of removing the fuel subsidy on the construction industry and the Nigerian economy, with Dr Gabriel Ogbechie as keynote speaker.",
    content: `<p>Bolaji joined colleagues in the Quantity Surveying profession in Lagos State, as well as other allied professionals in the built environment, at the 15th Annual Distinguished Lecture Series organised by the Nigerian Institute of Quantity Surveyors (Lagos Chapter).</p>
<p>The discussion focused on the potential impact of removing the fuel subsidy on the construction industry and the Nigerian economy.</p>
<p>The annual lecture, organised by the state chapter, has hosted distinguished personalities in the past, including the renowned economist Prof. Pat Utomi and the legal luminary Barrister Femi Falana as keynote speakers. For this 15th edition, it was indeed a timely decision by the state chapter to invite Dr Gabriel Ogbechie, Group Managing Director of RainOil Limited, as the keynote speaker.</p>
<p>While the general notion is that the removal of the fuel subsidy is a step in the right direction — largely due to the anticipated government savings (estimated at around N400 billion monthly) — the immediate impact on the construction industry has been significant. It has led to a sharp increase in construction project costs, an influx of fluctuation claims, and rising demands for upward adjustments in wages across the workforce.</p>
<p>Notwithstanding these challenges, there is potential for gains, particularly if the government diligently utilises the projected savings. If directed toward infrastructure development, these funds could create opportunities for increased engagement of Quantity Surveying professionals in effective cost management services.</p>
<p>QS professionals across the nation must rise to the occasion, adopting strategies that analyse construction processes and procurement systems to reduce costs without compromising quality. In times like these, securing a QS is non-negotiable if you are embarking on a construction project.</p>`,
    category: "Lecture",
    published: true,
    date: new Date("2023-09-20"),
    location: "Lagos, Nigeria",
  },
  {
    title: "Investiture as Fellow of the Nigerian Institute of Quantity Surveyors",
    slug: "investiture-fellow-niqs-2023",
    excerpt: "Being elevated to the highest membership cadre of NIQS is an incredible honour and a commitment to precision, excellence, and shaping the future of construction.",
    content: `<p>Thrilled to share the exciting news of my investiture as a Fellow of the Nigerian Institute of Quantity Surveyors during the prestigious 30th Biennial Conference and General Meeting!</p>
<p>Being elevated to the highest membership cadre is an incredible honour, and I'm eager to embrace the responsibilities that come with it.</p>
<p>Being a Quantity Surveying professional goes beyond a career; it's a commitment to precision, excellence, and shaping the future of construction and development.</p>
<p>The journey has been filled with challenges and triumphs, and this investiture marks a significant milestone in this incredible adventure.</p>
<p>In addition, I'm humbled to have completed my 2-year tenure as the Secretary of International Affairs for the institute. Thank you for your unwavering support in achieving global relevance and visibility. Together, we've made strides in showcasing the excellence of Quantity Surveyors on the international stage.</p>
<p>As I step into this new chapter, I'm filled with gratitude for the past and excitement for the future. Here's to continued growth, collaboration, and making a lasting impact in the world of Quantity Surveying!</p>`,
    category: "Achievement",
    published: true,
    date: new Date("2023-11-15"),
    location: "Nigeria",
  },
  {
    title: "50 Distinguished Members Award — NIQS Lagos Chapter 50th Anniversary",
    slug: "niqs-lagos-50-distinguished-members",
    excerpt: "Recognised as one of the 50 Distinguished Members of NIQS Lagos Chapter who have contributed significantly to the Chapter's growth and impact.",
    content: `<p>I was honoured to receive an Award for my Contributions to the Growth and Development of Quantity Surveying in Lagos State, and to be recognised as one of the 50 Distinguished Members of the Nigerian Institute of Quantity Surveyors (NIQS), Lagos Chapter, who have contributed significantly to the Chapter's growth and impact.</p>
<p>The recognition came during the 50th Anniversary Dinner & Awards of the NIQS Lagos Chapter — a truly memorable celebration of five decades of excellence and professionalism.</p>
<p>My sincere appreciation goes to QS Rilwon Balogun FNIQS, Chairman of NIQS Lagos Chapter, and the Senate Members for this honour. It was a privilege to receive the plaque from the President of NIQS, QS Kene C. Nzekwe, FNIQS — a moment of pride and reflection.</p>
<p>It was equally a delight to serve as the Master of Ceremony for this historic event celebrating the remarkable journey of our profession in Lagos.</p>
<p>Together, we will continue to uphold the values of our profession and contribute to the continuous growth of Quantity Surveying in Lagos and beyond.</p>`,
    category: "Award",
    published: true,
    date: new Date("2023-08-10"),
    location: "Lagos, Nigeria",
  },
  {
    title: "Men of Impact 2025: Empowering Men — Achieving Balance in a Fast-Paced World",
    slug: "men-of-impact-2025-empowering-men",
    excerpt: "Akosile, Sotunde, Bolarinwa, Akinyemiju, others make Industry Men of Impact 2025 list, empowering men to achieve balance in a fast-paced world.",
    content: `<p>Bolaji Sotunde has been named among the Industry Men of Impact 2025 alongside other distinguished professionals including Akosile, Bolarinwa, and Akinyemiju.</p>
<p>The recognition celebrates men who are achieving balance in a fast-paced world while making significant contributions to their respective fields and communities.</p>
<p>This honour is a testament to the commitment to excellence, leadership, and impact across multiple sectors.</p>`,
    category: "Recognition",
    published: true,
    date: new Date("2025-02-01"),
    location: "Nigeria",
  },
  {
    title: "Addressing Escalating Construction Material Prices — NIQS Press Conference",
    slug: "niqs-press-conference-material-prices",
    excerpt: "The NIQS President took a proactive stance on addressing the pressing issue of escalating construction material prices plaguing the industry.",
    content: `<p>Earlier today, the President of the Nigerian Institute of Quantity Surveyors, QS Kene Christopher Nzekwe FNIQS, took a proactive stance on addressing the pressing issue of escalating construction material prices plaguing the industry. In a well-timed and meticulously thought-out move, the institute convened a press conference to shed light on these challenges, showcasing the essence of quantity surveyors as construction cost professionals.</p>
<p>The decision to engage in national discourse from a position of professional authority exemplifies the core values that should underpin any respected profession. The initiative taken by the current leadership of NIQS is commendable, not only for bringing attention to the current issues but also for proposing viable solutions. One such solution emphasised during the press conference was the imperative to promote and support the local manufacturing of building materials, a strategic move to mitigate the impact of price escalations.</p>
<p>This proactive engagement shouldn't be confined solely to national discussions. I am making a call for state chapters to similarly involve themselves in dialogues with state authorities through the press.</p>
<p>While acknowledging the positive trend of infrastructural projects being commissioned across the state, it is imperative to emphasise the need for transparency in project costing. Beyond the overall project cost, the institute should advocate for the inclusion of life cycle costing.</p>`,
    category: "Industry",
    published: true,
    date: new Date("2024-02-29"),
    location: "Nigeria",
  },
  {
    title: "The Construction Cost Crisis: A Call for Quantity Surveying Professionals",
    slug: "construction-cost-crisis-call-for-qs",
    excerpt: "The construction industry in Nigeria is grappling with a significant challenge in monitoring and controlling construction costs due to naira devaluation.",
    content: `<p>The construction industry in Nigeria is grappling with a significant challenge in monitoring and controlling construction costs due to irregularities in building material prices linked to the constant devaluation of the naira.</p>
<p>Unusual fluctuations in building material prices, such as the doubling of cement prices and a rapid surge in reinforcement costs, are causing distress. Industry professionals seek advice, and contractors express their inability to execute contracts awarded just a week ago.</p>
<p>Clients face discouragement, financial plans are in disarray, and many are struggling to meet investment deliverables, exacerbating the already substantial housing deficit. Amidst this confusion, it is an opportune time to turn to Quantity Surveying professionals for guidance in navigating this crisis.</p>
<p>This period calls for industry colleagues to unite, developing localised models adaptable to our construction methodology and procurement system. While government policies and interventions may address the root cause, Quantity Surveyors can implement solutions to mitigate the impact, preventing contractors from being scapegoats and safeguarding clients against arbitrary claims.</p>
<p>Though challenging, this moment offers an opportunity to elevate the values of Quantity Surveying professionals, emphasising their crucial role in ensuring stability and resilience in the face of industry disruptions.</p>`,
    category: "Industry",
    published: true,
    date: new Date("2024-01-15"),
    location: "Nigeria",
  },
  {
    title: "The Importance of Tailored Approaches in Project and Cost Management",
    slug: "tailored-approaches-project-cost-management",
    excerpt: "No two projects are identical. Recognising and adapting to unique project characteristics is essential for maintaining client and investor confidence.",
    content: `<p>My recent reflections on the state of doing business in the current economy and the built environment, combined with recent and ongoing engagements with clients, have underscored a fundamental truth: no two projects are identical.</p>
<p>While overarching constraints such as cost, time, and risk affect all projects, the extent and impact of these constraints can vary significantly depending on the project's nature and the priorities set by clients and stakeholders. Recognising and adapting to these unique project characteristics is essential for achieving the ultimate goal of maintaining client and investor confidence, as well as project satisfaction.</p>
<p>A one-size-fits-all methodology is often inadequate in addressing the diverse needs and priorities of different projects. For instance, a commercial construction project may prioritize cost efficiency and timely delivery, while a tech development project might place greater emphasis on innovation and quality assurance. Therefore, it is essential to be flexible, ready to develop and adapt processes that sometimes deviate from conventional practices.</p>
<p>Collaboration with clients and stakeholders is critical in this customisation process. By engaging in open dialogues and gaining a clear understanding of what is most important to them — be it minimising costs, meeting tight deadlines, or mitigating risks — we can align strategies accordingly.</p>
<p>If we are to remain relevant as professionals in this industry, we must ensure adaptability and personalised management in the field of Project and Cost Management.</p>`,
    category: "Thought Leadership",
    published: true,
    date: new Date("2024-04-10"),
    location: "Lagos, Nigeria",
  },
];

let added = 0;
for (const s of speeches) {
  const exists = await Speech.findOne({ slug: s.slug });
  if (!exists) {
    await Speech.create(s);
    added++;
    console.log(`  + ${s.title}`);
  } else {
    // Update content if it exists
    await Speech.findOneAndUpdate({ slug: s.slug }, s);
    console.log(`  ~ Updated: ${s.title}`);
  }
}

console.log(`\n✅ Speeches seeded: ${added} new, ${speeches.length - added} updated`);
console.log(`Total speeches in DB: ${await Speech.countDocuments()}`);

await mongoose.disconnect();
process.exit(0);
