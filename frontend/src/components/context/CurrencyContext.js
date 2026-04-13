import { createContext, useState, useEffect } from "react";
import useCurrency from "../../hooks/useCurrency";

export const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState("INR");

  const { rates } = useCurrency("INR");

  useEffect(() => {
    const saved = localStorage.getItem("currency");
    if (saved) setCurrency(saved);
  }, []);

  const changeCurrency = (cur) => {
    setCurrency(cur);
    localStorage.setItem("currency", cur);
  };

  // 💱 Convert to selected currency
  const convert = (amount) => {
    if (!rates[currency]) return amount;
    return amount * rates[currency];
  };

  // 💱 Convert to specific currency (USD, EUR, GBP)
  const convertTo = (amount, toCurrency) => {
    if (!rates[toCurrency]) return amount;
    return amount * rates[toCurrency];
  };

  return (
    <CurrencyContext.Provider
      value={{ currency, changeCurrency, convert, convertTo }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}