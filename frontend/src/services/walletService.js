import api from "../api/axiosClient";

/**
 * Récupère le solde du wallet de l'utilisateur connecté
 */
export const getWallet = async () => {
  try {
    const response = await api.get("/walletAmount");
    console.log("RÉPONSE WALLET :", response.data);

    // Gère nombre brut OU objet { amount }
    const amount = typeof response.data === "number"
      ? response.data
      : response.data?.amount ?? 0;

    return { amount };
  } catch (error) {
    console.error("Erreur getWallet:", error);
    throw error;
  }
};

/**
 * Effectue une transaction sur le wallet
 * @param {"REFUND"|"DROP"} transact - REFUND pour déposer, DROP pour retirer
 * @param {number} amount - montant de la transaction
 */
export const updateWallet = async (transact, amount) => {
  try {
    const response = await api.post("/Wallet", {
      transact,   // ✅ "REFUND" ou "DROP" — correspond à l'enum WalletTransaction Java
      amount,     // ✅ BigDecimal côté Java accepte un number JS
    });
    console.log("RÉPONSE UPDATE WALLET :", response.data);

    // Le backend renvoie { status: 201, message: ..., data: "STOCK DONE" }
    // On recharge le solde depuis /walletAmount pour avoir la valeur à jour
    const walletData = await api.get("/walletAmount");
    const newBalance = typeof walletData.data === "number"
      ? walletData.data
      : walletData.data?.amount ?? 0;

    return newBalance;
  } catch (error) {
    console.error("Erreur updateWallet:", error);
    throw error;
  }
};