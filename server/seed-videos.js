import "dotenv/config";
import dns from "node:dns";
import mongoose from "mongoose";
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
import Video from "./models/VideoModel.js";

await mongoose.connect(process.env.MONGO_URI);
console.log("Connected:", mongoose.connection.name);

await Video.deleteMany({});

const videos = [
  { title: "Bolaji Sotunde at The African Quantity Surveying Week and Conference", videoUrl: "https://www.youtube.com/embed/s7o7AGRHvKg", description: "Lecture at The African Quantity Surveying Week and Conference", category: "Keynote", published: true, featured: true, order: 1 },
  { title: "NIQS 15th Distinguished Annual Lecture Series — Lagos Chapter", videoUrl: "https://www.youtube.com/embed/s7o7AGRHvKg", description: "Annual lecture on the impact of fuel subsidy removal on the construction industry", category: "Lecture", published: true, featured: false, order: 2 },
  { title: "Big 5 Talks — The Role of QS in Circular Economy Construction", videoUrl: "https://www.youtube.com/embed/s7o7AGRHvKg", description: "Panel session on implementing circular economy business models in construction", category: "Panel", published: true, featured: false, order: 3 },
  { title: "Investiture Ceremony — Fellow of NIQS 2023", videoUrl: "https://www.youtube.com/embed/s7o7AGRHvKg", description: "Investiture as Fellow of the Nigerian Institute of Quantity Surveyors at the 30th Biennial Conference", category: "Ceremony", published: true, featured: false, order: 4 },
  { title: "NIQS Lagos 50th Anniversary Dinner & Awards", videoUrl: "https://www.youtube.com/embed/s7o7AGRHvKg", description: "50th Anniversary celebration and recognition of 50 Distinguished Members", category: "Awards", published: true, featured: false, order: 5 },
  { title: "Leadership Development Workshop — New Managers", videoUrl: "https://www.youtube.com/embed/s7o7AGRHvKg", description: "Training session on transitioning into leadership roles effectively", category: "Workshop", published: true, featured: false, order: 6 },
];

for (const v of videos) { await Video.create(v); console.log(`  + ${v.title}`); }
console.log(`\n\u2705 Seeded ${videos.length} videos.`);
await mongoose.disconnect();
process.exit(0);
