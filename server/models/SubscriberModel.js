import mongoose from "mongoose";

const SubscriberSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Subscriber", SubscriberSchema);
