import api from "../api/axiosClient";
import { setTokens, getRefreshToken, removeTokens, removeUsername, setUsername } from "../utils/tokenStorage";

/**
 * Register a new user — backend renvoie void
 */
export const register = async ({ username, email, password }) => {
  try {
    await api.post("/register", { username, email, password });
    // ✅ void — pas de token, redirection vers login ensuite
    return true;
  } catch (err) {
    console.error("Erreur inscription :", err.response?.data || err.message);
    throw err;
  }
};

/**
 * Login user
 */
export const login = async (email, password) => {
  try {
    const response = await api.post("/login", { email, password });
    console.log("RÉPONSE LOGIN COMPLÈTE :", JSON.stringify(response.data));

    const token        = response.data.token        ?? response.data.accessToken ?? response.data.jwt;
    const refreshToken = response.data.refreshToken ?? response.data.refresh     ?? response.data.refreshtoken;

    if (!token) throw new Error("Aucun token reçu du backend au login");

    setTokens(token, refreshToken ?? null);
    setUsername(email);

    return response.data;
  } catch (err) {
    console.error("Erreur login :", err.response?.data || err.message);
    throw err;
  }
};

/**
 * Refresh JWT token
 */
export const refreshAccessToken = async () => {
  try {
    const currentRefreshToken = getRefreshToken();
    if (!currentRefreshToken) throw new Error("Pas de refresh token disponible");

    const response = await api.post("/refreshtoken", { refreshToken: currentRefreshToken });
    console.log("RÉPONSE REFRESH COMPLÈTE :", JSON.stringify(response.data));

    const token        = response.data.token        ?? response.data.accessToken ?? response.data.jwt;
    const refreshToken = response.data.refreshToken ?? response.data.refresh     ?? response.data.refreshtoken;

    if (!token) throw new Error("Aucun token reçu du backend au refresh");

    setTokens(token, refreshToken ?? currentRefreshToken);

    return token;
  } catch (err) {
    console.error("Erreur refresh token :", err.response?.data || err.message);
    removeTokens();
    throw err;
  }
};

/**
 * Logout user
 */
export const logout = () => {
  removeUsername();
  removeTokens();
  console.log("Utilisateur déconnecté");
};