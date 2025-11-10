import React, { useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { sender: "You", text: message };
    setChat([...chat, userMsg]);

    const res = await fetch("http://localhost:5000/api/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    const botResponse = data.output?.[0]?.content || "No reply";

    setChat((prev) => [...prev, { sender: "Bot", text: botResponse }]);
    setMessage("");
  };

  return (
    <div style={{ width: "400px", margin: "auto", paddingTop: "2rem" }}>
      <h2>Healthcare Bot</h2>
      <div
        style={{
          border: "1px solid gray",
          height: "300px",
          overflowY: "auto",
          padding: "10px",
        }}
      >
        {chat.map((c, i) => (
          <p key={i}>
            <b>{c.sender}:</b> {c.text}
          </p>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        style={{ width: "75%", marginTop: "10px" }}
      />
      <button onClick={sendMessage} style={{ width: "20%", marginLeft: "5px" }}>
        Send
      </button>
    </div>
  );
}

export default App;
