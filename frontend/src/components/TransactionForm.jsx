import { useState, useEffect } from "react";
import { executeTransaction } from "../services/transactionService";
import { getPortfolios } from "../services/portfolioService";

const S = {
  form: { display: "flex", flexDirection: "column", gap: "18px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "7px" },
  label: {
    fontSize: "9px", letterSpacing: "2px", color: "rgba(160,185,210,0.45)",
    textTransform: "uppercase", fontFamily: "'Courier New', monospace",
  },
  input: {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "2px", padding: "11px 14px", color: "#e8f0f8",
    fontSize: "14px", fontFamily: "'Courier New', monospace",
    outline: "none", width: "100%", boxSizing: "border-box",
    transition: "border-color 0.2s, background 0.2s", letterSpacing: "0.5px",
  },
  select: {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "2px", padding: "11px 14px", color: "#e8f0f8",
    fontSize: "13px", fontFamily: "'Courier New', monospace",
    outline: "none", width: "100%", boxSizing: "border-box",
    cursor: "pointer", letterSpacing: "0.5px",
    transition: "border-color 0.2s",
    appearance: "none",
  },
  selectDisabled: {
    opacity: 0.4, cursor: "not-allowed",
  },
  typeRow: { display: "flex", gap: "8px" },
  typeBtn: (active, isBuy) => ({
    flex: 1, padding: "11px", borderRadius: "2px", cursor: "pointer",
    fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase",
    fontFamily: "'Courier New', monospace", fontWeight: "700",
    transition: "all 0.2s",
    background: active
      ? (isBuy ? "rgba(0,212,122,0.15)" : "rgba(255,107,122,0.15)")
      : "rgba(255,255,255,0.03)",
    border: active
      ? `1px solid ${isBuy ? "rgba(0,212,122,0.5)" : "rgba(255,107,122,0.5)"}`
      : "1px solid rgba(255,255,255,0.08)",
    color: active
      ? (isBuy ? "#00d47a" : "#ff8080")
      : "rgba(160,185,210,0.4)",
  }),
  submitBtn: (loading, isBuy) => ({
    width: "100%", padding: "13px",
    background: loading ? "rgba(255,255,255,0.05)"
      : isBuy
        ? "linear-gradient(135deg, #00d47a 0%, #00a8c8 100%)"
        : "linear-gradient(135deg, #ff6b7a 0%, #ff4060 100%)",
    border: "none", borderRadius: "2px",
    color: loading ? "rgba(160,185,210,0.4)" : "#080d18",
    fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase",
    fontFamily: "'Courier New', monospace", fontWeight: "700",
    cursor: loading ? "not-allowed" : "pointer",
    transition: "opacity 0.2s, transform 0.1s",
    boxShadow: loading ? "none"
      : isBuy ? "0 4px 16px rgba(0,212,122,0.2)" : "0 4px 16px rgba(255,107,122,0.2)",
    marginTop: "4px",
  }),
  errorBox: {
    background: "rgba(255,60,80,0.08)", border: "1px solid rgba(255,60,80,0.25)",
    borderRadius: "2px", padding: "10px 14px", color: "#ff6b7a",
    fontSize: "11px", fontFamily: "'Courier New', monospace", letterSpacing: "0.3px",
  },
  successBox: {
    background: "rgba(0,212,122,0.06)", border: "1px solid rgba(0,212,122,0.2)",
    borderRadius: "2px", padding: "10px 14px", color: "#00d47a",
    fontSize: "11px", fontFamily: "'Courier New', monospace", letterSpacing: "0.3px",
  },
  divider: {
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
  },
  summaryBox: {
    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "2px", padding: "12px 14px",
    display: "flex", flexDirection: "column", gap: "6px",
  },
  summaryRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  summaryLabel: {
    fontSize: "9px", letterSpacing: "1.8px", color: "rgba(160,185,210,0.35)",
    textTransform: "uppercase", fontFamily: "'Courier New', monospace",
  },
  summaryValue: {
    fontSize: "12px", fontFamily: "'Courier New', monospace",
    color: "rgba(200,220,240,0.7)", letterSpacing: "0.5px",
  },
  loadingText: {
    fontSize: "11px", color: "rgba(160,185,210,0.35)",
    fontFamily: "'Courier New', monospace", letterSpacing: "1px",
    padding: "10px 0",
  },
};

const inputFocusCSS = `
  .tx-input:focus {
    border-color: rgba(0,212,122,0.45) !important;
    background: rgba(0,212,122,0.03) !important;
  }
  .tx-select:focus {
    border-color: rgba(0,212,122,0.45) !important;
  }
  .tx-select option {
    background: #0d1b2a;
    color: #e8f0f8;
  }
  .tx-submit:hover:not(:disabled) {
    opacity: 0.85;
    transform: translateY(-1px);
  }
  .tx-submit:active { transform: translateY(0); }
`;

function TransactionForm({ onSuccess }) {
  const [portfolios,   setPortfolios]   = useState([]);
  const [portfolioId,  setPortfolioId]  = useState("");
  const [loadingPf,    setLoadingPf]    = useState(true);
  const [symbol,       setSymbol]       = useState("");
  const [quantity,     setQuantity]     = useState("");
  const [type,         setType]         = useState("BUY");
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [success,      setSuccess]      = useState("");

  // ✅ Charger les portfolios de l'utilisateur
  useEffect(() => {
    getPortfolios()
      .then(data => {
        setPortfolios(data ?? []);
        if (data?.length > 0) setPortfolioId(data[0].id); // sélectionner le premier par défaut
      })
      .catch(() => setError("Impossible de charger les portfolios"))
      .finally(() => setLoadingPf(false));
  }, []);

  const isBuy = type === "BUY";
  const qty   = parseInt(quantity, 10);
  const valid = symbol.trim().length > 0 && qty > 0 && portfolioId !== "";

  const handleSubmit = async () => {
    if (!valid) { setError("Veuillez remplir tous les champs"); return; }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // ✅ Le backend attend "porteFolioName" (nom du portfolio, pas l'id)
      const selectedPortfolio = portfolios.find(p => p.id == portfolioId);
      const result = await executeTransaction({
        porteFolioName: selectedPortfolio?.name,
        symbol:         symbol.trim().toUpperCase(),
        quantity:       qty,
        type,
      });

      setSuccess(`${isBuy ? "Achat" : "Vente"} de ${qty} × ${symbol.toUpperCase()} à $${parseFloat(result.price).toFixed(2)}`);
      setSymbol("");
      setQuantity("");

      if (onSuccess) onSuccess(result);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.response?.data?.errorMessage || err.response?.data?.message || "Erreur lors de la transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{inputFocusCSS}</style>
      <div style={S.form}>

        {/* ── Type BUY / SELL ── */}
        <div style={S.fieldGroup}>
          <span style={S.label}>Order Type</span>
          <div style={S.typeRow}>
            <button style={S.typeBtn(isBuy, true)}  onClick={() => setType("BUY")}>▲ BUYING</button>
            <button style={S.typeBtn(!isBuy, false)} onClick={() => setType("SELL")}>▼ SELLING </button>
          </div>
        </div>

        {/* ── Portfolio ── */}
        <div style={S.fieldGroup}>
          <label style={S.label}>Portfolio</label>
          {loadingPf ? (
            <div style={S.loadingText}>Portfolios Loading…</div>
          ) : portfolios.length === 0 ? (
            <div style={S.errorBox}>⚠ No portfolio — create one first</div>
          ) : (
            <select
              className="tx-select"
              style={S.select}
              value={portfolioId}
              onChange={(e) => setPortfolioId(e.target.value)}
              disabled={loading}
            >
              {portfolios.map(pf => (
                <option key={pf.id} value={pf.id}>
                  {pf.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* ── Symbole ── */}
        <div style={S.fieldGroup}>
          <label style={S.label}>Symbole</label>
          <input
            className="tx-input"
            style={S.input}
            placeholder="ex : AAPL, TSLA, NVDA…"
            value={symbol}
            onChange={(e) => { setSymbol(e.target.value.toUpperCase()); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            disabled={loading}
          />
        </div>

        {/* ── Quantité ── */}
        <div style={S.fieldGroup}>
          <label style={S.label}>Quantity</label>
          <input
            className="tx-input"
            style={S.input}
            type="number"
            placeholder="0"
            min="1"
            value={quantity}
            onChange={(e) => { setQuantity(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            disabled={loading}
          />
        </div>

        {/* ── Résumé ── */}
        {valid && (
          <div style={S.summaryBox}>
            <div style={S.summaryRow}>
              <span style={S.summaryLabel}>Ordre</span>
              <span style={{ ...S.summaryValue, color: isBuy ? "#00d47a" : "#ff8080", fontWeight: "700" }}>
                {isBuy ? "▲ BUYING" : "▼ SELLING"}
              </span>
            </div>
            <div style={S.divider} />
            <div style={S.summaryRow}>
              <span style={S.summaryLabel}>Portfolio</span>
              <span style={{ ...S.summaryValue, color: "rgba(160,185,210,0.6)" }}>
                {portfolios.find(p => p.id == portfolioId)?.name ?? "—"}
              </span>
            </div>
            <div style={S.summaryRow}>
              <span style={S.summaryLabel}>Symbol</span>
              <span style={{ ...S.summaryValue, color: "#78c8ff" }}>{symbol}</span>
            </div>
            <div style={S.summaryRow}>
              <span style={S.summaryLabel}>Quantity</span>
              <span style={S.summaryValue}>{qty} stock{qty > 1 ? "s" : ""}</span>
            </div>
          </div>
        )}

        {/* ── Erreur / Succès ── */}
        {error   && <div style={S.errorBox}>⚠ {error}</div>}
        {success && <div style={S.successBox}>✓ {success}</div>}

        {/* ── Submit ── */}
        <button
          className="tx-submit"
          style={S.submitBtn(loading || !valid, isBuy)}
          onClick={handleSubmit}
          disabled={loading || !valid}
        >
          {loading ? "Processing…" : isBuy ? "▲ Place the purchase" : "▼ Place the selling"}
        </button>

      </div>
    </>
  );
}

export default TransactionForm;