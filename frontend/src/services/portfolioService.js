import api from "../api/axiosClient";

/**
 * Créer un nouveau portfolio
 * @param {string} porteFolioName
 */
export const createPortfolio = async (porteFolioName) => {
  const response = await api.post("/createPortefolio", null, {
    params: { porteFolioName },
  });
  return response.data;
};

/**
 * Récupérer les portfolios de l'utilisateur
 * @param {string} [num] - optionnel
 */
export const getPortfolios = async (num) => {
  const response = await api.get("/getPortfolio", {
    params: num ? { num } : {},
  });
  return response.data; // List<PortfolioResponse>
};