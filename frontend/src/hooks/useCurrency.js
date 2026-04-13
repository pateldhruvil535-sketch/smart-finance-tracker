import { useEffect, useState } from "react";

export default function useCurrency(base = "INR") {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${base}`
        );
        const data = await res.json();
        setRates(data.rates);
      } catch (err) {
        console.error("Currency fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [base]);

  return { rates, loading };
}