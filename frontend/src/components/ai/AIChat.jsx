import { useState, useRef, useEffect, useContext } from "react";
import { CurrencyContext } from "../context/CurrencyContext";
import { formatCurrency } from "../../utils/currency";

function AIChat({ transactions = [] }) {
  const { convert, currency } = useContext(CurrencyContext);

  const [messages, setMessages] = useState([
    { text: "Hi 👋 I'm your AI finance assistant!", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const chatRef = useRef();

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // ================= DATA =================
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + convert(b.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + convert(b.amount), 0);

  const balance = income - expense;

  const categoryMap = {};
  transactions.forEach((t) => {
    if (t.type === "expense") {
      const key = t.category || "General";
      categoryMap[key] =
        (categoryMap[key] || 0) + convert(t.amount);
    }
  });

  const topCategory =
    Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0];

  // ================= AI LOGIC =================
  const getAIResponse = (q) => {
    const text = q.toLowerCase();

    if (text.includes("balance"))
      return `Your balance is ${formatCurrency(balance, currency)} 💰`;

    if (text.includes("income"))
      return `Total income: ${formatCurrency(income, currency)}`;

    if (text.includes("expense"))
      return `Total expenses: ${formatCurrency(expense, currency)}`;

    if (text.includes("save"))
      return balance > 0
        ? `You're saving ${formatCurrency(balance, currency)} 🎉`
        : "You're spending more than you earn 😬";

    if (text.includes("highest") || text.includes("category"))
      return topCategory
        ? `Highest spending: ${topCategory[0]} (${formatCurrency(
            topCategory[1],
            currency
          )})`
        : "No category data available.";

    if (text.includes("advice"))
      return expense > income
        ? "⚠️ Try reducing unnecessary expenses."
        : "✅ Great job! Consider investing your savings.";

    return "Try asking about balance, income, expenses, or advice 💡";
  };

  // ================= TYPEWRITER =================
  const typeMessage = (text) => {
    let i = 0;
    let temp = "";

    const interval = setInterval(() => {
      temp += text[i];
      i++;

      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.sender === "bot") {
          return [...prev.slice(0, -1), { text: temp, sender: "bot" }];
        }
        return [...prev, { text: temp, sender: "bot" }];
      });

      if (i === text.length) {
        clearInterval(interval);
      }
    }, 20);
  };

  // ================= SEND =================
  const handleSend = (customText) => {
    const text = customText || input;
    if (!text.trim()) return;

    const userMsg = { text, sender: "user" };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const response = getAIResponse(text);

      setTyping(false);
      typeMessage(response);
    }, 600);
  };

  // ================= CLEAR CHAT =================
  const clearChat = () => {
    const confirmClear = window.confirm("Clear all chat messages?");
    if (!confirmClear) return;

    setMessages([
      { text: "Hi 👋 I'm your AI finance assistant!", sender: "bot" }
    ]);
  };

  // ================= SUGGESTIONS =================
  const suggestions = [
    "What is my balance?",
    "Show my expenses",
    "Am I saving money?",
    "Where do I spend most?",
    "Give me advice"
  ];

  // ================= UI =================
  return (
    <div className="chat-container">

      {/* 🔥 HEADER WITH CLEAR BUTTON */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <h3 className="chat-title">🤖 Smart AI Assistant</h3>

        <button
          onClick={clearChat}
          style={{
            padding: "6px 10px",
            borderRadius: "8px",
            border: "none",
            background: "#ef4444",
            color: "#fff",
            cursor: "pointer",
            fontSize: "12px"
          }}
        >
          Clear 🗑
        </button>
      </div>

      {/* 💬 CHAT */}
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-row ${msg.sender}`}>
            <div className="chat-bubble">
              {msg.text}
            </div>
          </div>
        ))}

        {/* 🟢 Typing */}
        {typing && (
          <div className="chat-row bot">
            <div className="chat-bubble typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}

        <div ref={chatRef} />
      </div>

      {/* 💡 SUGGESTIONS */}
      <div className="chat-suggestions">
        {suggestions.map((s, i) => (
          <button key={i} onClick={() => handleSend(s)}>
            {s}
          </button>
        ))}
      </div>

      {/* ⌨ INPUT */}
      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Ask about your finances..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button onClick={() => handleSend()}>➤</button>
      </div>
    </div>
  );
}

export default AIChat;