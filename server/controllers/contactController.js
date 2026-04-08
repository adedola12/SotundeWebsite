import Contact from "../models/ContactModel.js";
import Subscriber from "../models/SubscriberModel.js";

// ─── Push to Google Sheets via Apps Script Web App ───
async function pushToGoogleSheet({ firstName, email, type, phone, message }) {
  const sheetUrl = process.env.GOOGLE_SHEET_WEBHOOK;
  if (!sheetUrl) {
    console.log("Google Sheet webhook not configured, skipping.");
    return;
  }
  try {
    const payload = {
      firstName: firstName || "",
      email: email || "",
      type: type || "SUBSCRIBER",
      phone: phone || "",
      message: message || "",
    };
    console.log("Pushing to Google Sheet:", payload);

    const res = await fetch(sheetUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(payload),
      redirect: "follow",
    });

    const text = await res.text();
    console.log("Google Sheet response:", res.status, text.slice(0, 200));
  } catch (err) {
    console.error("Google Sheet push error:", err.message);
  }
}

// ─── Contact Messages ───
export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email and message are required." });
    }
    const contact = await Contact.create(req.body);
    pushToGoogleSheet({ firstName: name, email, type: "CONTACT", phone: phone || "", message: message.slice(0, 200) });
    return res.status(201).json({ message: "Message sent successfully.", contact });
  } catch (err) {
    console.error("submitContact error:", err);
    return res.status(500).json({ message: "Failed to send message." });
  }
};

export const getAllContacts = async (_req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.json(contacts);
  } catch (err) {
    console.error("getAllContacts error:", err);
    return res.status(500).json({ message: "Failed to fetch contacts." });
  }
};

export const markContactRead = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!contact) return res.status(404).json({ message: "Contact not found." });
    return res.json(contact);
  } catch (err) {
    console.error("markContactRead error:", err);
    return res.status(500).json({ message: "Failed to update contact." });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found." });
    return res.json({ message: "Contact deleted." });
  } catch (err) {
    console.error("deleteContact error:", err);
    return res.status(500).json({ message: "Failed to delete contact." });
  }
};

// ─── Newsletter Subscribers ───
export const subscribe = async (req, res) => {
  try {
    const { firstName, email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required." });

    const existing = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (!existing.active) {
        existing.active = true;
        existing.firstName = firstName || existing.firstName;
        await existing.save();
        pushToGoogleSheet({ firstName, email, type: "SUBSCRIBER" });
        return res.json({ message: "Welcome back! You've been re-subscribed." });
      }
      return res.json({ message: "You are already subscribed." });
    }

    await Subscriber.create({ firstName, email: email.toLowerCase() });
    pushToGoogleSheet(firstName, email); // async, don't await
    return res.status(201).json({ message: "Subscribed successfully!" });
  } catch (err) {
    console.error("subscribe error:", err);
    return res.status(500).json({ message: "Failed to subscribe." });
  }
};

export const getAllSubscribers = async (_req, res) => {
  try {
    const subs = await Subscriber.find().sort({ createdAt: -1 });
    return res.json(subs);
  } catch (err) {
    console.error("getAllSubscribers error:", err);
    return res.status(500).json({ message: "Failed to fetch subscribers." });
  }
};
