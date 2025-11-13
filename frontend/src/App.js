import React, { useState, useRef, useEffect } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // ✅ Intro message on page load
  useEffect(() => {
    setChat([
      {
        sender: "Wellis",
        text: `I am an AI chatbot designed to help reduce the risks of diabetes and offer suggestions to improve your lifestyle. I can:

• Predict the chances of a user developing diabetes based on their lifestyle and health information
• Provide personalized recommendations to help users lower their risk of developing diabetes
• Offer tips and advice on healthy eating, exercise, and stress management
• Help users understand the importance of early detection and prevention of diabetes
• Provide information on the latest research and developments in diabetes prevention and management

To get started, I would need to know some information about you, such as your age, weight, height, family medical history, and current lifestyle habits. This will help me provide you with more accurate and personalized advice.

Would you like to share some information about yourself and get started?`
      },
    ]);
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { sender: "You", text: message };
    setChat((prev) => [...prev, userMsg]);
    setMessage("");
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:5000/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      const botResponse = data.output?.[0]?.content || "No reply from Wellis.";

      // ✅ Append bot reply only once
      setChat((prev) => [...prev, { sender: "Wellis", text: botResponse }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setChat((prev) => [
        ...prev,
        { sender: "Wellis", text: "⚠️ Error: Could not reach the server." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const formatText = (text) => {
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    const hasBullets = lines.some((l) =>
      l.trim().match(/^([-*•]|\d+\.)\s+/)
    );

    if (hasBullets) {
      return (
        <ul style={{ marginLeft: "20px", paddingLeft: "0" }}>
          {lines.map((line, i) =>
            line.trim().match(/^([-*•]|\d+\.)\s+/) ? (
              <li key={i} style={{ marginBottom: "4px", lineHeight: "1.4" }}>
                {line.replace(/^([-*•]|\d+\.)\s+/, "")}
              </li>
            ) : (
              <p key={i} style={{ margin: "6px 0", lineHeight: "1.5" }}>
                {line}
              </p>
            )
          )}
        </ul>
      );
    }

    return lines.map((line, i) => (
      <p key={i} style={{ margin: "6px 0", lineHeight: "1.5" }}>
        {line}
      </p>
    ));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100dvh",
        backgroundColor: "#f5f7fa",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Navigation Menu */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          marginBottom: "0px",
          padding: "0 20px",
          width: "100%",
        }}
      >
        <nav
          style={{
            alignSelf: "flex-start",
            marginTop: "20px",
            marginLeft: "20px",
            marginBottom: "20px",
            backgroundColor: "#0078D4",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <style>
            {`
              nav a {
                color: white;
                margin: 0 10px;
                text-decoration: none;
                font-weight: bold;
              }
              nav a:hover {
                text-decoration: underline;
              }
            `}
          </style>
          <a href="/Home" style={{ color: "white", margin: "0 10px" }}> Home</a>
          <a href="/Resources.html" style={{ color: "white", margin: "0 10px" }}>Resources </a>
        </nav>

        <div
          style={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              color: "#0078D4",
              marginLeft: "calc(0% - 200px)",
            }}
          >
            Welcome to WellisCareAI! 🩺
          </div>
        </div>
      </div>

      <div
        style={{
          width: "90%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            width: "80%",
            textAlign: "center",
            fontSize: "1.1rem",
            lineHeight: "1.5",
            color: "#0078D4",
            fontWeight: "500",
            border: "2px solid #0078D4",
            borderRadius: "12px",
            padding: "1px 15px",
            backgroundColor: "#fefefe",
          }}
        >
          <p style={{ marginBottom: "10px" }}>
            Meet <strong> Wellis </strong>, your AI healthcare assistant to predict diabetes risk, create diet and exercise plans, and give personalized advice to improve your lifestyle.
          </p>
          <p style={{ marginTop: "0px" }}>
            <strong>Enter details such as your age, weight, height, gender, and medical history to get started.</strong>
          </p>
        </div>
      </div>

      <div
        style={{
          width: "90dvw",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          height: "80dvh",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            backgroundColor: "#0078D4",
            color: "white",
            padding: "1rem",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
            textAlign: "center",
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          Healthcare Assistant
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {chat.map((c, i) => (
            <div
              key={i}
              style={{
                alignSelf: c.sender === "You" ? "flex-end" : "flex-start",
                backgroundColor: c.sender === "You" ? "#0078D4" : "#E8E8E8",
                color: c.sender === "You" ? "white" : "black",
                padding: "10px 14px",
                borderRadius: "16px",
                maxWidth: "75%",
                whiteSpace: "pre-wrap",
                lineHeight: "1.4",
              }}
            >
              <b>{c.sender}:</b>
              <div style={{ marginTop: "4px" }}>
                {c.sender === "Wellis" ? formatText(c.text) : c.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div
              style={{
                alignSelf: "flex-start",
                backgroundColor: "#E8E8E8",
                color: "black",
                padding: "10px 14px",
                borderRadius: "16px",
                maxWidth: "60%",
                fontStyle: "italic",
              }}
            >
              Wellis is typing...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            borderTop: "1px solid #ddd",
            padding: "0.8rem",
            backgroundColor: "#fafafa",
            borderBottomLeftRadius: "12px",
            borderBottomRightRadius: "12px",
          }}
        >
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
              minWidth: "50px",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              marginLeft: "8px",
              padding: "10px 16px",
              backgroundColor: "#0078D4",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              maxWidth: "100px",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
