export const currencies = {
  INR: { symbol: "₹", label: "Indian Rupee", locale: "en-IN", flag: "🇮🇳" },
  USD: { symbol: "$", label: "US Dollar", locale: "en-US", flag: "🇺🇸" },
  EUR: { symbol: "€", label: "Euro", locale: "de-DE", flag: "🇪🇺" },
  GBP: { symbol: "£", label: "British Pound", locale: "en-GB", flag: "🇬🇧" },
  JPY: { symbol: "¥", label: "Japanese Yen", locale: "ja-JP", flag: "🇯🇵" },
};


export const formatCurrency = (amount = 0, currency = "INR") => {
  try {
    const config = currencies[currency] || currencies.INR;

    return new Intl.NumberFormat(config.locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);

  } catch (error) {
    const symbol = currencies[currency]?.symbol || "₹";
    return `${symbol}${amount}`;
  }
};