import { useState, useContext, useCallback } from "react";
import API from "../services/api";
import { FinanceContext } from "../components/context/FinanceContext";

export default function useTransactions() {
  const {
    transactions,
    setTransactions,
    setBudgets,
    setInsights
  } = useContext(FinanceContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 📥 Fetch all data
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [txRes, budgetRes, insightRes] = await Promise.all([
        API.get("/transactions"),
        API.get("/budgets"),
        API.get("/insights")
      ]);

      setTransactions(txRes.data || []);
      setBudgets(budgetRes.data || []);
      setInsights(insightRes.data || {});

    } catch (err) {
      console.error("Fetch error:", err);
      setError(err?.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [setTransactions, setBudgets, setInsights]);

  // ➕ Add transaction
  const addTransaction = async (data) => {
    try {
      setError(null);
      await API.post("/transactions", data);
      await fetchAllData(); // ensure updated state
    } catch (err) {
      console.error("Add error:", err);
      setError(err?.response?.data?.message || "Failed to add transaction");
    }
  };

  // ❌ Delete transaction
  const deleteTransaction = async (id) => {
    try {
      setError(null);
      await API.delete(`/transactions/${id}`);
      await fetchAllData();
    } catch (err) {
      console.error("Delete error:", err);
      setError(err?.response?.data?.message || "Failed to delete transaction");
    }
  };

  return {
    transactions,
    loading,
    error,
    fetchAllData,
    addTransaction,
    deleteTransaction
  };
}