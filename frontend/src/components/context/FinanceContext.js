import { createContext, useState, useEffect } from "react";

export const FinanceContext = createContext();

export function FinanceProvider({ children }) {

  const [transactions, setTransactions] = useState([]);

  const [currency, setCurrency] = useState(
    localStorage.getItem("currency") || "INR"
  );

  // 🌍 AUTO DETECT COUNTRY
  useEffect(() => {
    const detectCurrency = async () => {
      try {
        // Only detect if not already set
        if (!localStorage.getItem("currency")) {

          const res = await fetch("https://ipapi.co/json/");
          const data = await res.json();

          if (data.currency) {
            setCurrency(data.currency);
            localStorage.setItem("currency", data.currency);
          }

        }
      } catch (err) {
        console.error("Currency detection failed:", err);
      }
    };

    detectCurrency();
  }, []);

  // 💾 Save manually selected currency
  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        setTransactions,
        currency,
        setCurrency,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}