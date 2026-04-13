export const formatCurrency = (amount = 0, currency = "INR") => {
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
};