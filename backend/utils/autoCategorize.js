const autoCategorize = (title = "") => {
  const text = title.toLowerCase();

  if (text.includes("zomato") || text.includes("swiggy")) return "Food";
  if (text.includes("uber") || text.includes("ola")) return "Transport";
  if (text.includes("amazon") || text.includes("flipkart")) return "Shopping";
  if (text.includes("salary")) return "Income";

  return "Other";
};

module.exports = autoCategorize;