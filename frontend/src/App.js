import React, { useState, useRef, useEffect } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

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
      const botResponse = data.output?.[0]?.content || "No reply from bot.";

      // ✅ Append bot reply only once
      setChat((prev) => [...prev, { sender: "Bot", text: botResponse }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setChat((prev) => [
        ...prev,
        { sender: "Bot", text: "⚠️ Error: Could not reach the server." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // ✅ Press Enter to send
  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  // ✅ Scrolls chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // ✅ Format text (detects bullet points, numbers, and paragraphs)
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
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        fontFamily: "Arial, sans-serif",
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: "420px",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          height: "600px",
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
          🩺 Healthcare Assistant
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
                {c.sender === "Bot" ? formatText(c.text) : c.text}
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
              Bot is typing...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div
          style={{
            display: "flex",
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
