import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Get IBM IAM token
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

app.post("/api/message", async (req, res) => {
  try {
    const { message } = req.body;
    console.log("User message:", message);

    const token = await getAccessToken();

    // Correct Watsonx endpoint and payload
    const watsonResponse = await axios.post(
      `${process.env.IBM_API_URL}/ml/v4/deployments/${process.env.IBM_DEPLOYMENT_ID}/predictions?version=${process.env.IBM_API_VERSION}`,
      {
        input_data: [
          { text: message } // Watsonx expects this format
        ],
      },
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Watsonx response received");

    // Extract text from Watsonx response
    const botText =
      watsonResponse.data.predictions?.[0]?.values?.[0]?.text ||
      "Sorry, I couldn't understand that.";

    // Wrap response to match frontend format
    res.json({
      output: [
        {
          content: botText,
        },
      ],
    });
  } catch (err) {
    console.error("❌ Error communicating with Watsonx:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to reach Watsonx chatbot" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
