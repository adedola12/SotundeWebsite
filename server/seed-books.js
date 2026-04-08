import "dotenv/config";
import dns from "node:dns";
import mongoose from "mongoose";
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
import Book from "./models/BookModel.js";

await mongoose.connect(process.env.MONGO_URI);
console.log("Connected:", mongoose.connection.name);

await Book.deleteMany({});

const books = [
  // MY BOOKS (featured)
  { title: "The Seven Habits of Highly Effective People", author: "Stephen R. Covey", description: "A principle-centred approach for solving personal and professional problems. Covey presents a holistic, integrated approach to solving personal and professional problems through timeless principles of fairness, integrity, honesty, and human dignity.", order: 1, published: true },
  { title: "Atomic Habits", author: "James Clear", description: "An easy and proven way to build good habits and break bad ones. Clear reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.", order: 2, published: true },
  // CURRENTLY IN MY LIBRARY
  { title: "Execution: The Discipline of Getting Things Done", author: "Larry Bossidy and Ram Charan", description: "The book that shows how to get the job done and deliver results, whether you are running an entire company or in your first management job. Bossidy and Charan reveal the gap between what a company's leaders want and the ability of their organisation to deliver.", order: 3, published: true },
  { title: "Leading Change", author: "John P. Kotter", description: "What will it take to bring your organization successfully into the twenty-first century? The world's foremost expert on business leadership distills twenty-five years of experience and wisdom based on lessons learned from scores of organizations and businesses.", order: 4, published: true },
  { title: "Good to Great", author: "Jim C. Collins", description: "Why some companies make the leap and others don't. Collins and his research team identified a set of elite companies that made the leap to great results and sustained those results for at least fifteen years.", order: 5, published: true },
  { title: "Winning", author: "Jack Welch", description: "Jack Welch knows how to win. During his forty-year career at General Electric, he led the company to year-after-year success around the globe, in multiple markets, against brutal competition. His definitive management book distills his principles into a practical guide.", order: 6, published: true },
  { title: "The Creation of Wealth", author: "R.M. Lala", description: "The Tatas, from the 19th to the 21st century, have been at the forefront of nation-building. This book chronicles the remarkable saga of the House of Tatas and their contributions to the industrial and economic landscape.", order: 7, published: true },
  { title: "How Much Land Does a Man Need", author: "Leo Tolstoy", description: "A short story about a man who is offered all the land he can walk around in a day. He becomes so consumed by greed that he overexerts himself and dies. A timeless parable about the dangers of greed and the meaning of contentment.", order: 8, published: true },
  { title: "Shall We Tell the President?", author: "Jeffrey Archer", description: "A gripping political thriller about a plot to assassinate the president of the United States. FBI agent Mark Andrews has just six days to discover the identity of a mole inside the highest levels of government.", order: 9, published: true },
  { title: "Outliers: The Story of Success", author: "Malcolm Gladwell", description: "In this stunning new book, Malcolm Gladwell takes us on an intellectual journey through the world of outliers \u2014 the best and the brightest, the most famous and the most successful. He asks the question: what makes high-achievers different?", order: 10, published: true },
];

for (const b of books) { await Book.create(b); console.log(`  + ${b.title}`); }
console.log(`\n\u2705 Seeded ${books.length} books.`);
await mongoose.disconnect();
process.exit(0);
