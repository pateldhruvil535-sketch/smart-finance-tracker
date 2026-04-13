import API from "./api";

// GET INSIGHTS DATA
export const getInsights = async () => {
  const res = await API.get("/insights");
  return res.data;
};