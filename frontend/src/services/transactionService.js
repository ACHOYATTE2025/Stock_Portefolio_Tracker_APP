import api from "../api/axiosClient";

/**
 * Exécute une transaction BUY ou SELL
 * @param {{ symbol: string, type: "BUY"|"SELL", quantity: number }} data
 * @returns {TransactionResponse} { symbol, quantity, price, type }
 */
export const executeTransaction = async (data) => {
  try {
    console.log("TRANSACTION ENVOYÉE :", JSON.stringify(data));
    const response = await api.post("/transactions", data); // ✅ route corrigée
    console.log("RÉPONSE TRANSACTION :", response.data);
    return response.data;
  } catch (error) {
    console.error("Erreur transaction :", error.response?.data || error.message);
    throw error;
  }
};