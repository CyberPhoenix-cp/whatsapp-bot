import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// Your credentials
const VERIFY_TOKEN = VERIFY_TOKEN;
const WHATSAPP_TOKEN = WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = PHONE_NUMBER_ID;

// WHATSAPP SEND MESSAGE FUNCTION
async function sendMessage(to, text) {
  await axios.post(
    `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: { body: text },
    },
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
}

// WEBHOOK VERIFY
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
});

// MAIN BOT LOGIC
app.post("/webhook", async (req, res) => {
  const message = req.body.entry?.[0].changes?.[0].value?.messages?.[0];

  if (message && message.text) {
    const from = message.from;
    const text = message.text.body.trim();

    // 1. FIRST GREETING
    if (text.toLowerCase() === "hi" || text.toLowerCase() === "hello") {
      await sendMessage(
        from,
        `👋 Hi! Welcome to *Cyber Phoenix*\nYour trusted partner for:\n\n🔥 Web Development\n🔥 App Development\n🔥 UI/UX Design\n🔥 SEO & Marketing\n🔥 AI Automation\n\nReply with a number:\n\n1️⃣ About Us\n2️⃣ Our Services\n3️⃣ Portfolio\n4️⃣ Get a Quote\n5️⃣ Contact Support`
      );
    }

    // 2. ABOUT US
    else if (text === "1") {
      await sendMessage(
        from,
        `🏢 *About Cyber Phoenix*\nWe help businesses grow with modern, reliable and affordable digital solutions.\n\nOur mission is to empower every business with technology that works.\n\nReply:\n2️⃣ See our services\n4️⃣ Get a quote`
      );
    }

    // 3. SERVICES
    else if (text === "2") {
      await sendMessage(
        from,
        `🛠 *Our Services*\n\n• Website Development\n• Android/iOS App Development\n• UI/UX Design\n• SEO Optimization\n• Custom Software\n• AI Integrations\n\nReply:\n3️⃣ See portfolio\n4️⃣ Get a quote`
      );
    }

    // 4. PORTFOLIO
    else if (text === "3") {
      await sendMessage(
        from,
        `📁 *Portfolio*\nHere are some sample works:\n\n🌐 Web Projects: your-link-here\n📱 App Projects: your-link-here\n🎨 UI/UX: your-link-here\n\nReply:\n4️⃣ Get a quote`
      );
    }

    // 5. QUOTE COLLECTION
    else if (text === "4") {
      await sendMessage(
        from,
        `📝 *Let's get your project details!*\n\nPlease share your project requirement in one message.\nExample:\n"I need an ecommerce website with payment gateway."`
      );
    }

    // 6. AFTER REQUIREMENT
    else if (text.length > 5) {
      await sendMessage(
        from,
        `👌 Great! Got your requirements.\n\n💰 What is your budget range?\n\nReply:\nA) Below ₹10,000\nB) ₹10,000 - ₹25,000\nC) ₹25,000 - ₹50,000\nD) Above ₹50,000`
      );
    }

    // 7. BUDGET ANSWER
    else if (["A", "B", "C", "D"].includes(text.toUpperCase())) {
      await sendMessage(
        from,
        `⏳ Last step!\nHow soon do you want the project delivered?\n\n1) 1 week\n2) 2–3 weeks\n3) 1 month\n4) Flexible timeline`
      );
    }

    // 8. FINAL CONFIRMATION
    else if (["1", "2", "3", "4"].includes(text)) {
      await sendMessage(
        from,
        `🎉 Thanks! Your enquiry is recorded.\nOur team will contact you shortly.\n\nThank you for choosing *Cyber Phoenix*! 🔥`
      );
    }

    // DEFAULT
    else {
      await sendMessage(
        from,
        `🙏 Sorry, I didn't understand.\nPlease reply with:\n\n1️⃣ About Us\n2️⃣ Services\n3️⃣ Portfolio\n4️⃣ Get a Quote`
      );
    }
  }

  res.sendStatus(200);
});

// SERVER LISTEN
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
