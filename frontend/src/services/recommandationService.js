import api from "../api/axiosClient"; // ✅ même instance que walletService

const API_BASE = "/recommendations";

/**
 * Récupère une recommandation pour une position donnée.
 * GET /recommendations/{portfolioName}/{stockSymbol}
 *
 * @param {string} portfolioName  - Nom exact du portfolio
 * @param {string} stockSymbol    - Symbole de l'action (ex: AAPL)
 * @returns {Promise<RecommendationResponse>} { portfolioName, stockSymbol, advice, comment }
 */
export const getRecommendation = async (portfolioName, stockSymbol) => {
  const response = await api.get(
    `${API_BASE}/${encodeURIComponent(portfolioName)}/${encodeURIComponent(stockSymbol)}`
  );
  return response.data;
};