import API from "./api";

// GET ALL
export const getTransactions = async () => {
  const res = await API.get("/transactions");
  return res.data;
};

// ADD
export const addTransaction = async (data) => {
  const res = await API.post("/transactions", data);
  return res.data;
};

// DELETE
export const deleteTransaction = async (id) => {
  const res = await API.delete(`/transactions/${id}`);
  return res.data;
};