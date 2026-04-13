import { useState, useEffect } from "react";

export default function Filters({ transactions = [], setFiltered }) {
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let data = [...transactions];

    if (type !== "all") {
      data = data.filter((t) => t.type === type);
    }

    if (category.trim()) {
      data = data.filter((t) =>
        t.category?.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (search.trim()) {
      data = data.filter((t) =>
        t.title?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(data);
  }, [type, category, search, transactions, setFiltered]);

  const resetFilters = () => {
    setType("all");
    setCategory("");
    setSearch("");
  };

  return (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
      <select value={type} onChange={(e) => setType(e.target.value)} style={inputStyle}>
        <option value="all">All</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={inputStyle}
      />

      <input
        type="text"
        placeholder="Search title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={inputStyle}
      />

      <button onClick={resetFilters} style={resetBtn}>
        Reset
      </button>
    </div>
  );
}

const inputStyle = {
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "#fff",
};

const resetBtn = {
  padding: "8px 12px",
  borderRadius: "6px",
  background: "#ef4444",
  color: "#fff",
  border: "none",
  cursor: "pointer"
};