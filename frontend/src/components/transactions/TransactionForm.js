import { useState } from "react";
import API from "../../services/api";

export default function TransactionForm({ fetchTransactions }) {
  const [form, setForm] = useState({
    type: "expense",
    title: "",
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.amount || !form.date) {
      return setError("Title, amount and date are required");
    }

    try {
      setLoading(true);
      setError("");

      await API.post("/transactions", {
        ...form,
        amount: Number(form.amount),
        date: form.date // ✅ FIXED (send string)
      });

      setForm({
        type: "expense",
        title: "",
        category: "",
        amount: "",
        date: new Date().toISOString().split("T")[0]
      });

      fetchTransactions();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="card">
      <h3>Add Transaction</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <select name="type" value={form.type} onChange={handleChange}>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
      />

      <input
        name="category"
        placeholder="Category (optional)"
        value={form.category}
        onChange={handleChange}
      />

      <input
        name="amount"
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
      />

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
      />

      <button disabled={loading}>
        {loading ? "Adding..." : "Add Transaction"}
      </button>
    </form>
  );
}