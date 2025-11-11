import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🧩 Step 1: Get IBM IAM access token
async function getAccessToken() {
  try {
    const response = await axios.post(
      "https://iam.cloud.ibm.com/identity/token",
      new URLSearchParams({
        grant_type: "urn:ibm:params:oauth:grant-type:apikey",
        apikey: process.env.IBM_API_KEY,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    console.log("✅ Token acquired");
    return response.data.access_token;
  } catch (err) {
    console.error("❌ Failed to get IAM token:", err.response?.data || err.message);
    throw err;
  }
}

// 🧠 Step 2: Message route for frontend
app.post("/api/message", async (req, res) => {
  try {
    const { message } = req.body;
    console.log("User message:", message);

    const token = await getAccessToken();

    // ✅ Correct Watsonx endpoint
    const endpoint = `https://us-south.ml.cloud.ibm.com/ml/v4/deployments/${process.env.IBM_DEPLOYMENT_ID}/ai_service?version=2021-05-01`;

    // ✅ Correct payload (matches the API reference you shared)
    const payload = {
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    };

    const watsonResponse = await axios.post(endpoint, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    console.log("✅ Watsonx response received");

    // ✅ Extract chatbot reply
    const botReply =
      watsonResponse.data?.choices?.[0]?.message?.content ||
      watsonResponse.data?.output?.[0]?.content ||
      watsonResponse.data?.results?.[0]?.generated_text ||
      "No reply";

    res.json({
      output: [{ content: botReply }],
    });
  } catch (err) {
    console.error("❌ Error communicating with Watsonx:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to reach Watsonx chatbot" });
  }
});

// 🚀 Step 3: Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
