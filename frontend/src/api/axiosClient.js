import axios from "axios";
import { getAccessToken, getRefreshToken, setTokens, removeTokens, removeUsername } from "../utils/tokenStorage";

const api = axios.create({
  baseURL: "http://localhost:8080/api/stockportefoliotracker/v1",
});

// ─── Intercepteur REQUEST ─────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = getAccessToken();

  const publicRoutes = ["/login", "/register", "/refreshtoken"];
  const isPublicRoute = publicRoutes.some((route) => config.url.endsWith(route));

  if (token && !isPublicRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  console.log("Requête envoyée :", config.method.toUpperCase(), config.url, config.data);
  return config;
});

// ─── Intercepteur RESPONSE ────────────────────────────────────────
let isRefreshing = false;         // évite plusieurs appels refresh simultanés
let failedQueue = [];             // file des requêtes en attente du nouveau token

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    console.log("Réponse API :", response.data);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // ✅ Si 401 ET pas déjà une tentative de retry ET pas la route refresh elle-même
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.endsWith("/refreshtoken")
    ) {
      // Si un refresh est déjà en cours → mettre en file d'attente
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const currentRefreshToken = getRefreshToken();
        if (!currentRefreshToken) throw new Error("Pas de refresh token");

        // ✅ Appel refresh
        const response = await axios.post(
        "http://localhost:8080/api/stockportefoliotracker/v1/refreshtoken",
        { refreshToken: currentRefreshToken }
      );

        const newToken =
          response.data.token ??
          response.data.accessToken ??
          response.data.jwt;

        const newRefreshToken =
          response.data.refreshToken ??
          response.data.refresh ??
          response.data.refreshtoken ??
          currentRefreshToken;

        if (!newToken) throw new Error("Aucun token reçu au refresh");

        // ✅ Sauvegarder les nouveaux tokens
        setTokens(newToken, newRefreshToken);
        console.log("✅ Token rafraîchi avec succès");

        // ✅ Débloquer la file d'attente
        processQueue(null, newToken);

        // ✅ Rejouer la requête originale avec le nouveau token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        console.error("❌ Refresh token échoué, déconnexion :", refreshError.message);
        processQueue(refreshError, null);

        // ✅ Déconnecter l'utilisateur et rediriger vers login
        removeTokens();
        removeUsername();
        window.location.href = "/login";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    console.error("Erreur API :", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;