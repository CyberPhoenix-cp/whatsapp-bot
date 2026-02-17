import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// ENVIRONMENT VARIABLES
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// SEND WHATSAPP MESSAGE
async function sendMessage(to, text) {
  try {
    await axios.post(
      `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: to,
        text: { body: text },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("Send error:", err.response?.data || err.message);
  }
}

// Root route
app.get("/", (req, res) => {
  res.send("WhatsApp Bot is running 🚀");
});

// Webhook verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified successfully.");
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
});

// Receive messages
app.post("/webhook", async (req, res) => {
   ...
});

// MAIN BOT LOGIC (POST)
app.post("/webhook", async (req, res) => {
  const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (message?.text) {
    const from = message.from;
    const text = message.text.body.trim();

    // GREETING
    if (["hi", "hello", "hey"].includes(text.toLowerCase())) {
      await sendMessage(
        from,
        `👋 Hi! Welcome to *Cyber Phoenix*

🔥 Web Development
🔥 App Development
🔥 UI/UX Design
🔥 SEO & Marketing
🔥 AI Automation

Reply with:

1️⃣ About Us
2️⃣ Services
3️⃣ Portfolio
4️⃣ Get a Quote`
      );
    }

    // ABOUT US
    else if (text === "1") {
      await sendMessage(
        from,
        `🏢 *About Cyber Phoenix*\n\nWe help businesses grow with modern, reliable and affordable digital solutions.

Reply:
2️⃣ Our services
4️⃣ Get a quote`
      );
    }

    // SERVICES
    else if (text === "2") {
      await sendMessage(
        from,
        `🛠 *Our Services*

• Website Development
• Android/iOS Apps
• UI/UX Design
• SEO Optimization
• Custom Software
• AI Integrations

Reply:
3️⃣ Portfolio
4️⃣ Get a quote`
      );
    }

    // PORTFOLIO
    else if (text === "3") {
      await sendMessage(
        from,
        `📁 *Our Portfolio*

🌐 Web Projects: your-link
📱 Apps: your-link
🎨 UI/UX: your-link

Reply:
4️⃣ Get a quote`
      );
    }

    // QUOTE REQUEST
    else if (text === "4") {
      await sendMessage(
        from,
        `📝 Great! Please share your project requirements in one message.

Example:
"I need an e-commerce website with payment gateway."`
      );
    }

    // REQUIREMENT SHARED
    else if (text.length > 10) {
      await sendMessage(
        from,
        `👌 Got it!

💰 What is your budget?

A) Below ₹10,000
B) ₹10,000 - ₹25,000
C) ₹25,000 - ₹50,000
D) Above ₹50,000`
      );
    }

    // BUDGET
    else if (["A", "B", "C", "D"].includes(text.toUpperCase())) {
      await sendMessage(
        from,
        `⏳ Final question!

When do you want the project delivered?

E) 1 week
F) 2–3 weeks
G) 1 month
H) Flexible timeline`
      );
    }

    // FINAL CONFIRMATION
    else if (["E", "F", "G", "H"].includes(text.toUpperCase())) {
      await sendMessage(
        from,
        `🎉 Thank you!

Your enquiry has been recorded.
Our team will contact you shortly.

🔥 Cyber Phoenix — YOUR VISION | OUR TECHNOLOGY`
      );
    }

    // DEFAULT REPLY
    else {
      await sendMessage(
        from,
        `❓ Sorry, I didn't understand.

Reply:
1️⃣ About Us
2️⃣ Services
3️⃣ Portfolio
4️⃣ Get a Quote`
      );
    }
  }

  res.sendStatus(200);
});

// SERVER LISTEN
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on", PORT));

