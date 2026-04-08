/**
 * Seed 12+ thought leadership articles.
 * Usage: node seed-blogs.js
 */
import "dotenv/config";
import dns from "node:dns";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

import Blog from "./models/BlogModel.js";

await mongoose.connect(process.env.MONGO_URI);
console.log("Connected:", mongoose.connection.name);

// Clear existing and re-seed for clean data
await Blog.deleteMany({});
console.log("Cleared existing blogs.");

const blogs = [
  {
    title: "Stepping Into Leadership: Common Pitfalls to Avoid as a New Manager",
    slug: "stepping-into-leadership-pitfalls-new-manager",
    excerpt: "As a manager or team leader, getting to where you are today is most likely the result of your technical skills and educational background. While these are crucial factors, they do not necessarily cover what your role as a manager truly requires.",
    content: `<p>As a manager or team leader, getting to where you are today is most likely the result of your technical skills and educational background, which gave you an advantage over other applicants or team members. While these are crucial factors in your appointment, they do not necessarily cover what your role as a manager truly requires.</p>
<p>A managerial role involves managing yourself first, as well as working productively with your team. To carry out your duties effectively, you need to step into your position as a leader and intentionally cultivate, guide, and reinforce the same culture of excellence that helped you earn this role.</p>
<p>This may feel overwhelming as a new manager, but you need to familiarise yourself with the responsibilities that come with the position. You can do this by creating a structured plan of action, part of which includes learning to avoid common mistakes new managers often make. Many of these mistakes seem minor, but can eventually become critical weaknesses.</p>
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
    published: true, featured: true,
    createdAt: new Date("2025-03-22"),
  },
  {
    title: "How to Resolve Project Issues: The Importance of Contract Terms",
    slug: "resolve-project-issues-contract-terms",
    excerpt: "Project issues are common across construction projects and other complex environments, but many challenges can be avoided with proper contract management. Before escalating concerns, reviewing the contract terms provides clarity.",
    content: `<p>Project issues are common across construction projects and other complex environments, but many challenges can be avoided with proper contract management. Before escalating concerns or making assumptions, reviewing the contract terms provides clarity, reduces disputes, and ensures a structured approach to resolution.</p>
<p>In the fast-paced world of project management, particularly within the construction industry, challenges are inevitable. However, the first professional step to take when an issue arises is often overlooked: review the contract.</p>
<p>It is easy to allow emotions, assumptions, or past experiences to influence your response. Yet the contract remains the foundation of every project. It clearly defines the rights, responsibilities, timelines, and remedies available to all parties involved. Before drawing conclusions or making decisions, always refer to the agreed terms.</p>
<p>It is also important to recognize that resolving an issue one way on a previous project does not guarantee the same approach on another. Each project is unique, and the contract should always be your primary reference point for guidance and dispute resolution.</p>
<p>Unfortunately, many professionals begin construction projects without clear documentation, leaving room for confusion, inconsistent expectations, and misinterpretation when challenges arise. Prioritizing well-drafted contracts, and consistently relying on them, is essential for successful project delivery.</p>
<p>Be guided by the terms, not emotion. This simple discipline can significantly improve outcomes, reduce conflict, and strengthen professional credibility across every stage of the project lifecycle.</p>
<p><em>Effective project leaders rely on documentation, not assumption. Let the contract guide the way.</em></p>`,
    author: "Bolaji Sotunde",
    category: "thought-leadership",
    tags: ["project-management", "contracts", "construction"],
    published: true, featured: true,
    createdAt: new Date("2025-03-12"),
  },
  {
    title: "The Importance of Tailored Approaches in Project and Cost Management",
    slug: "tailored-approaches-project-cost-management",
    excerpt: "No two projects are identical. While overarching constraints such as cost, time, and risk affect all projects, the extent and impact of these constraints can vary significantly.",
    content: `<p>My recent reflections on the state of doing business in the current economy and the built environment, combined with recent and ongoing engagements with clients, have underscored a fundamental truth: no two projects are identical.</p>
<p>While overarching constraints such as cost, time, and risk affect all projects, the extent and impact of these constraints can vary significantly depending on the project\u2019s nature and the priorities set by clients and stakeholders. Recognising and adapting to these unique project characteristics is essential for achieving the ultimate goal of maintaining client and investor confidence, as well as project satisfaction.</p>
<p>The high cost of construction due to increased material prices, ever-changing government policies, and the necessity to advise clients on how best to navigate projected business opportunities have further highlighted the need to understand each project\u2019s peculiarities. Each project carries its own set of specific requirements, challenges, and expectations that demand a tailored approach.</p>
<p>A one-size-fits-all methodology is often inadequate in addressing the diverse needs and priorities of different projects. For instance, a commercial construction project may prioritize cost efficiency and timely delivery, while a tech development project might place greater emphasis on innovation and quality assurance. Therefore, it is essential to be flexible, ready to develop and adapt processes that sometimes deviate from conventional practices.</p>
<p>The notion that we must continue doing things the way they have always been done is not a valuable approach in an ever-evolving era.</p>
<p>Collaboration with clients and stakeholders is critical in this customisation process. By engaging in open dialogues and gaining a clear understanding of what is most important to them\u2014be it minimising costs, meeting tight deadlines, or mitigating risks\u2014we can align strategies accordingly. This alignment not only fosters trust but also enhances the likelihood of meeting or exceeding client expectations.</p>
<p>Ultimately, the success of a project hinges on the ability to balance general constraints with the specific demands of the project. Understanding the unique characteristics of each project and tailoring processes to suit these specifics is not just a strategy, but a necessity.</p>
<p>If we are to remain relevant as professionals in this industry, we must ensure adaptability and personalised management in the field of Project and Cost Management.</p>`,
    author: "Bolaji Sotunde",
    category: "thought-leadership",
    tags: ["project-management", "cost-management"],
    published: true, featured: true,
    createdAt: new Date("2025-02-21"),
  },
  {
    title: "Addressing Escalating Construction Material Prices \u2014 A Call to Action",
    slug: "addressing-escalating-construction-material-prices",
    excerpt: "The President of NIQS took a proactive stance on addressing the pressing issue of escalating construction material prices plaguing the industry, convening a press conference to propose viable solutions.",
    content: `<p>Earlier today, the President of the Nigerian Institute of Quantity Surveyors, QS Kene Christopher Nzekwe FNIQS, took a proactive stance on addressing the pressing issue of escalating construction material prices plaguing the industry. In a well-timed and meticulously thought-out move, the institute convened a press conference to shed light on these challenges, showcasing the essence of quantity surveyors as construction cost professionals.</p>
<p>The decision to engage in national discourse from a position of professional authority exemplifies the core values that should underpin any respected profession. The initiative taken by the current leadership of NIQS is commendable, not only for bringing attention to the current issues but also for proposing viable solutions. One such solution emphasised during the press conference was the imperative to promote and support the local manufacturing of building materials, a strategic move to mitigate the impact of price escalations.</p>
<p>This proactive engagement shouldn\u2019t be confined solely to national discussions. I am making a call for state chapters to similarly involve themselves in dialogues with state authorities through the press. By doing so, they can contribute insights and solutions to issues that directly affect the state\u2019s built environment.</p>
<p>While acknowledging the positive trend of infrastructural projects being commissioned across the state, it is imperative to emphasise the need for transparency in project costing. Beyond the overall project cost, the institute should advocate for the inclusion of life cycle costing. This approach ensures a comprehensive understanding of not only the immediate expenses but also the long-term maintenance costs associated with these infrastructural developments.</p>
<p>NIQS leadership\u2019s proactive involvement in addressing industry challenges and proposing solutions sets a commendable precedent for professional bodies. Advocating for local manufacturing support, encouraging state-level engagements, and promoting life cycle costing all contribute to a more comprehensive and sustainable approach to managing the built environment.</p>`,
    author: "Q.Surv Bolaji Sotunde",
    category: "thought-leadership",
    tags: ["construction", "material-prices", "niqs"],
    published: true, featured: false,
    createdAt: new Date("2024-02-29"),
  },
  {
    title: "The Construction Cost Crisis: Navigating Price Volatility in Nigeria",
    slug: "construction-cost-crisis-nigeria",
    excerpt: "The construction industry in Nigeria is grappling with a significant challenge in monitoring and controlling construction costs due to irregularities in building material prices linked to the constant devaluation of the naira.",
    content: `<p>The construction industry in Nigeria is grappling with a significant challenge in monitoring and controlling construction costs due to irregularities in building material prices linked to the constant devaluation of the naira.</p>
<p>Unusual fluctuations in building material prices, such as the doubling of cement prices and a rapid surge in reinforcement costs, are causing distress. Industry professionals seek advice, and contractors express their inability to execute contracts awarded just a week ago.</p>
<p>Clients face discouragement, financial plans are in disarray, and many are struggling to meet investment deliverables, exacerbating the already substantial housing deficit. Amidst this confusion, it is an opportune time to turn to Quantity Surveying professionals for guidance in navigating this crisis.</p>
<p>This period calls for industry colleagues to unite, developing localised models adaptable to our construction methodology and procurement system. While government policies and interventions may address the root cause, Quantity Surveyors can implement solutions to mitigate the impact, preventing contractors from being scapegoats and safeguarding clients against arbitrary claims.</p>
<p>Though challenging, this moment offers an opportunity to elevate the values of Quantity Surveying professionals, emphasising their crucial role in ensuring stability and resilience in the face of industry disruptions.</p>`,
    author: "Bolaji Sotunde",
    category: "thought-leadership",
    tags: ["construction", "cost-management", "nigeria"],
    published: true, featured: false,
    createdAt: new Date("2024-01-15"),
  },
  {
    title: "Men of Impact 2025: Empowering Men \u2014 Achieving Balance in a Fast-Paced World",
    slug: "men-of-impact-2025",
    excerpt: "Akosile, Sotunde, Bolarinwa, Akinyemiju, others make Industry Men of Impact 2025 list, celebrating men achieving balance while making significant contributions.",
    content: `<p>Bolaji Sotunde has been named among the Industry Men of Impact 2025 alongside other distinguished professionals including Akosile, Bolarinwa, and Akinyemiju.</p>
<p>The recognition celebrates men who are achieving balance in a fast-paced world while making significant contributions to their respective fields and communities.</p>
<p>This honour is a testament to the commitment to excellence, leadership, and impact across multiple sectors.</p>`,
    author: "Bolaji Sotunde",
    category: "news",
    tags: ["awards", "recognition"],
    published: true, featured: true,
    createdAt: new Date("2025-02-01"),
  },
  {
    title: "NIQS 15th Distinguished Annual Lecture: Fuel Subsidy and Construction",
    slug: "niqs-15th-annual-lecture-fuel-subsidy-construction",
    excerpt: "The 15th Annual Distinguished Lecture focused on the potential impact of removing the fuel subsidy on the construction industry and the Nigerian economy.",
    content: `<p>Bolaji joined colleagues in the Quantity Surveying profession in Lagos State at the 15th Annual Distinguished Lecture Series organised by the Nigerian Institute of Quantity Surveyors (Lagos Chapter). The discussion focused on the potential impact of removing the fuel subsidy on the construction industry and the Nigerian economy.</p>
<p>For this 15th edition, it was a timely decision to invite Dr Gabriel Ogbechie, Group Managing Director of RainOil Limited, as the keynote speaker, alongside an array of other key stakeholders in the industry.</p>
<p>While the general notion is that the removal of the fuel subsidy is a step in the right direction, the immediate impact on the construction industry has been significant. It has led to a sharp increase in construction project costs, an influx of fluctuation claims, and rising demands for upward adjustments in wages.</p>
<p>QS professionals across the nation must rise to the occasion, adopting strategies that analyse construction processes and procurement systems to reduce costs without compromising quality.</p>`,
    author: "Bolaji Sotunde",
    category: "thought-leadership",
    tags: ["niqs", "fuel-subsidy", "construction"],
    published: true, featured: false,
    createdAt: new Date("2023-09-20"),
  },
  {
    title: "The Role of Quantity Surveyors in Circular Economy Construction Models",
    slug: "qs-circular-economy-construction",
    excerpt: "Panelist at the Big 5 Talks on how QS professionals can drive Circular Economy adoption, emphasising lifecycle costing and sustainable material knowledge.",
    content: `<p>Bolaji participated as a panelist at the Big 5 Talks session on \u201cThe Role of Quantity Surveyors in the Implementation of Circular Economy Business Models in Construction.\u201d</p>
<p>During the panel, he emphasised the importance for Quantity Surveyors to acquire in-depth knowledge of the availability, functional requirements, and costs associated with environmentally sustainable materials. This knowledge is essential for providing informed advice on adopting Circular Economy practices.</p>
<p>While the initial capital cost may be moderately higher, the overall lifecycle costing reveals long-term cost benefits. Cultural biases and resistance to change pose significant barriers, however, with sincere government policies and targeted incentives, broader adoption can be encouraged.</p>`,
    author: "Bolaji Sotunde",
    category: "thought-leadership",
    tags: ["circular-economy", "sustainability", "quantity-surveying"],
    published: true, featured: false,
    createdAt: new Date("2024-03-10"),
  },
  {
    title: "Investiture as Fellow of NIQS \u2014 A Milestone in Professional Excellence",
    slug: "investiture-fellow-niqs-milestone",
    excerpt: "Being elevated to the highest membership cadre of NIQS is a commitment to precision, excellence, and shaping the future of construction and development.",
    content: `<p>Thrilled to share the exciting news of my investiture as a Fellow of the Nigerian Institute of Quantity Surveyors during the prestigious 30th Biennial Conference and General Meeting!</p>
<p>Being elevated to the highest membership cadre is an incredible honour, and I\u2019m eager to embrace the responsibilities that come with it. Being a Quantity Surveying professional goes beyond a career; it\u2019s a commitment to precision, excellence, and shaping the future of construction and development.</p>
<p>The journey has been filled with challenges and triumphs, and this investiture marks a significant milestone in this incredible adventure.</p>
<p>In addition, I\u2019m humbled to have completed my 2-year tenure as the Secretary of International Affairs for the institute. Thank you for your unwavering support in achieving global relevance and visibility.</p>
<p>As I step into this new chapter, I\u2019m filled with gratitude for the past and excitement for the future. Here\u2019s to continued growth, collaboration, and making a lasting impact in the world of Quantity Surveying!</p>`,
    author: "Bolaji Sotunde",
    category: "thought-leadership",
    tags: ["niqs", "fellowship", "achievement"],
    published: true, featured: false,
    createdAt: new Date("2023-11-15"),
  },
  {
    title: "50 Distinguished Members: NIQS Lagos Chapter 50th Anniversary Recognition",
    slug: "niqs-lagos-50-distinguished-members-recognition",
    excerpt: "Recognised as one of the 50 Distinguished Members of NIQS Lagos Chapter during the 50th Anniversary Dinner & Awards \u2014 a truly memorable celebration.",
    content: `<p>I was honoured to receive an Award for my Contributions to the Growth and Development of Quantity Surveying in Lagos State, and to be recognised as one of the 50 Distinguished Members of the Nigerian Institute of Quantity Surveyors (NIQS), Lagos Chapter.</p>
<p>The recognition came during the 50th Anniversary Dinner & Awards of the NIQS Lagos Chapter \u2014 a truly memorable celebration of five decades of excellence and professionalism.</p>
<p>My sincere appreciation goes to QS Rilwon Balogun FNIQS, Chairman of NIQS Lagos Chapter, and the Senate Members for this honour. It was a privilege to receive the plaque from the President of NIQS, QS Kene C. Nzekwe, FNIQS.</p>
<p>It was equally a delight to serve as the Master of Ceremony for this historic event.</p>`,
    author: "Bolaji Sotunde",
    category: "thought-leadership",
    tags: ["niqs", "awards", "lagos"],
    published: true, featured: false,
    createdAt: new Date("2023-08-10"),
  },
  {
    title: "Building Future-Ready Leaders: The Power of Training and Mentorship",
    slug: "building-future-ready-leaders-training-mentorship",
    excerpt: "Beyond project management, Bolaji is passionate about leadership development, serving as a training consultant, facilitator, lead strategist, and public speaker.",
    content: `<p>Leadership development is not a one-time event \u2014 it is a continuous journey of growth, reflection, and intentional action. As a training consultant, facilitator, and public speaker, I have seen firsthand the transformative power of investing in people.</p>
<p>The most impactful leaders I have encountered share a common trait: they are committed to the growth of those around them. They understand that true leadership is not about personal achievement alone, but about equipping others with the skills, confidence, and vision to lead effectively.</p>
<p>In my role as Governor of the New Managers Community Group at The Covenant Nation, I have had the privilege of supporting professionals transitioning into leadership roles. The challenges they face are remarkably similar \u2014 managing teams, navigating organisational politics, building credibility, and maintaining work-life balance.</p>
<p>What I tell every new leader: your title gives you authority, but your character gives you influence. Invest in both.</p>
<p>The future of any industry depends on the quality of its leaders. Let us be intentional about building them.</p>`,
    author: "Bolaji Sotunde",
    category: "thought-leadership",
    tags: ["leadership", "mentorship", "training"],
    published: true, featured: true,
    createdAt: new Date("2025-01-10"),
  },
  {
    title: "Why Every Construction Project Needs a Quantity Surveyor",
    slug: "why-every-construction-project-needs-qs",
    excerpt: "In times of economic uncertainty and rising material costs, securing a Quantity Surveyor is non-negotiable if you are embarking on a construction project.",
    content: `<p>In times of economic uncertainty and rising material costs, the role of a Quantity Surveyor has never been more critical. Yet many developers and project owners still embark on construction projects without engaging QS professionals, often leading to cost overruns, disputes, and in the worst cases, abandoned projects.</p>
<p>A Quantity Surveyor brings discipline to the financial management of a construction project from inception to completion. Their expertise spans cost planning, procurement advisory, contract administration, valuation, variation management, and final account settlement.</p>
<p>The value of a QS is not just in counting costs \u2014 it is in providing strategic advice that protects the client\u2019s investment and ensures the project is delivered within budget without compromising quality.</p>
<p>For developers: engaging a QS early saves money in the long run. For contractors: a QS ensures fair payment and proper documentation. For the industry: widespread QS engagement raises professional standards and reduces the incidence of abandoned projects.</p>
<p>In times like these, securing a QS is non-negotiable if you are embarking on a construction project.</p>`,
    author: "Bolaji Sotunde",
    category: "thought-leadership",
    tags: ["quantity-surveying", "construction", "cost-management"],
    published: true, featured: false,
    createdAt: new Date("2024-06-20"),
  },
];

for (const b of blogs) {
  await Blog.create(b);
  console.log(`  + ${b.title.slice(0, 60)}...`);
}

console.log(`\n\u2705 Seeded ${blogs.length} articles. Total: ${await Blog.countDocuments()}`);
await mongoose.disconnect();
process.exit(0);
