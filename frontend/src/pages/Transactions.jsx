import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TransactionForm from "../components/TransactionForm";
import { executeTransaction } from "../services/transactionService";
import { getWallet } from "../services/walletService.js";
import api from "../api/axiosClient";

// ─── Styles ───────────────────────────────────────────────────────
const S = {
  page: {
    width: "100vw", minHeight: "100vh", margin: 0, padding: 0,
    background: "#080d18",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    position: "relative", overflowX: "hidden", color: "#e8f0f8",
  },
  gridOverlay: {
    position: "fixed", inset: 0,
    backgroundImage: `
      linear-gradient(rgba(0,200,150,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,200,150,0.025) 1px, transparent 1px)
    `,
    backgroundSize: "48px 48px", pointerEvents: "none", zIndex: 0,
  },
  orb1: {
    position: "fixed", width: "600px", height: "600px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(0,212,122,0.07) 0%, transparent 65%)",
    top: "-180px", right: "-180px", pointerEvents: "none", zIndex: 0,
  },
  orb2: {
    position: "fixed", width: "450px", height: "450px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(0,140,255,0.06) 0%, transparent 65%)",
    bottom: "-120px", left: "-120px", pointerEvents: "none", zIndex: 0,
  },
  content: { position: "relative", zIndex: 1, paddingBottom: "80px" },
  header: {
    padding: "36px 40px 0", maxWidth: "1280px", margin: "0 auto",
    display: "flex", alignItems: "flex-end", justifyContent: "space-between",
    animation: "fadeUp 0.6s ease forwards",
  },
  headerLeft: { display: "flex", flexDirection: "column", gap: "8px" },
  headerRight: { display: "flex", alignItems: "center", gap: "10px" },
  liveRow: { display: "flex", alignItems: "center", gap: "7px" },
  liveDot: {
    width: "7px", height: "7px", borderRadius: "50%",
    background: "#00a8ff", boxShadow: "0 0 10px #00a8ff", animation: "pulse 2s infinite",
  },
  liveLabel: {
    fontSize: "10px", letterSpacing: "3px", color: "#00a8ff",
    textTransform: "uppercase", fontFamily: "'Courier New', monospace", fontWeight: "700",
  },
  pageTitle: { fontSize: "32px", fontWeight: "normal", color: "#f0f4f8", margin: 0, letterSpacing: "0.3px", lineHeight: 1 },
  pageDate: { fontSize: "12px", color: "rgba(160,185,210,0.35)", fontFamily: "'Courier New', monospace", letterSpacing: "0.8px", textTransform: "capitalize" },
  walletBadge: {
    display: "flex", alignItems: "center", gap: "10px",
    background: "rgba(0,212,122,0.06)", border: "1px solid rgba(0,212,122,0.18)",
    borderRadius: "2px", padding: "10px 18px", cursor: "pointer",
    transition: "border-color 0.2s, background 0.2s",
  },
  walletDot: { width: "6px", height: "6px", borderRadius: "50%", background: "#00d47a", boxShadow: "0 0 7px #00d47a", animation: "pulse 2s infinite", flexShrink: 0 },
  walletInfo: { display: "flex", flexDirection: "column", gap: "2px" },
  walletLabel: { fontSize: "9px", letterSpacing: "2px", color: "rgba(160,185,210,0.45)", textTransform: "uppercase", fontFamily: "'Courier New', monospace" },
  walletAmount: { fontSize: "18px", color: "#00d47a", fontFamily: "'Courier New', monospace", fontWeight: "700", letterSpacing: "0.5px", textShadow: "0 0 14px rgba(0,212,122,0.3)" },
  walletArrow: { fontSize: "11px", color: "rgba(0,212,122,0.4)", fontFamily: "monospace" },
  navLinks: { display: "flex", gap: "8px" },
  navLink: {
    display: "flex", alignItems: "center", gap: "6px", padding: "10px 16px",
    background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "2px", color: "rgba(160,185,210,0.55)",
    fontSize: "10px", letterSpacing: "1.8px", textTransform: "uppercase",
    fontFamily: "'Courier New', monospace", fontWeight: "600",
    cursor: "pointer", textDecoration: "none",
    transition: "border-color 0.2s, color 0.2s, background 0.2s", whiteSpace: "nowrap",
  },
  main: { maxWidth: "1280px", margin: "0 auto", padding: "32px 40px", display: "flex", flexDirection: "column", gap: "32px" },
  sectionTitle: {
    fontSize: "11px", letterSpacing: "2.5px", color: "rgba(160,185,210,0.4)",
    textTransform: "uppercase", fontFamily: "'Courier New', monospace",
    marginBottom: "14px", display: "flex", alignItems: "center", gap: "10px",
  },
  sectionLine: { flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" },
  grid: { display: "grid", gridTemplateColumns: "1fr 400px", gap: "24px", alignItems: "start" },
  panel: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "2px", overflow: "hidden" },
  panelHeader: { padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" },
  panelTitle: { fontSize: "10px", letterSpacing: "2.5px", color: "rgba(160,185,210,0.5)", textTransform: "uppercase", fontFamily: "'Courier New', monospace" },
  panelBody: { padding: "20px 22px" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { fontSize: "9px", letterSpacing: "2px", color: "rgba(160,185,210,0.35)", textTransform: "uppercase", fontFamily: "'Courier New', monospace", padding: "10px 14px", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.05)", fontWeight: "normal" },
  td: { fontSize: "12px", fontFamily: "'Courier New', monospace", padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.03)", color: "rgba(200,220,240,0.75)", letterSpacing: "0.3px" },
  badge: { display: "inline-block", padding: "3px 10px", borderRadius: "2px", fontSize: "9px", letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "'Courier New', monospace", fontWeight: "700" },
  emptyState: { padding: "48px 22px", textAlign: "center", color: "rgba(160,185,210,0.3)", fontFamily: "'Courier New', monospace", fontSize: "12px", letterSpacing: "1px" },
  emptyIcon: { fontSize: "28px", marginBottom: "12px", opacity: 0.3 },
  loadingBox: { padding: "48px 22px", textAlign: "center", color: "rgba(0,212,122,0.4)", fontFamily: "'Courier New', monospace", fontSize: "12px", letterSpacing: "2px" },
  errorBox: { background: "rgba(255,60,80,0.06)", border: "1px solid rgba(255,60,80,0.2)", borderRadius: "2px", padding: "12px 18px", color: "#ff8080", fontSize: "12px", fontFamily: "'Courier New', monospace" },
};

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { width: 100%; min-height: 100vh; overflow-x: hidden; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.4;transform:scale(0.75);} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);} }
  @keyframes slideIn { from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);} }
  @keyframes spin { to { transform: rotate(360deg); } }
  tr:hover td { background: rgba(255,255,255,0.02); color: rgba(220,235,250,0.9) !important; }
  .nav-link:hover { border-color: rgba(0,212,122,0.28)!important; color:#00d47a!important; background:rgba(0,212,122,0.04)!important; }
  .wallet-badge:hover { border-color:rgba(0,212,122,0.35)!important; background:rgba(0,212,122,0.09)!important; }
`;

function Transactions() {
  const [history, setHistory]       = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError]     = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [walletBal, setWalletBal]   = useState(null);
  const navigate = useNavigate();

  const now     = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  // ✅ Charger historique des transactions depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txRes, walletData] = await Promise.allSettled([
          api.get("/transactions"),   // ✅ GET /transactions — à adapter si route différente
          getWallet(),
        ]);

        if (txRes.status === "fulfilled") {
          setHistory(txRes.value.data ?? []);
        } else {
          setHistoryError("Unable to load history");
        }

        if (walletData.status === "fulfilled") {
          setWalletBal(walletData.value.amount);
        }
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Après une transaction réussie : ajoute à l'historique + rafraîchit le wallet
  const handleTransactionSuccess = async (newTx) => {
    if (newTx) {
      // Transformer la réponse backend en format affichage
      const entry = {
        id:     Date.now(),
        date:   new Date().toISOString().split("T")[0],
        symbol: newTx.symbol,
        type:   newTx.type,
        qty:    newTx.quantity,
        price:  parseFloat(newTx.price),
        total:  parseFloat(newTx.price) * newTx.quantity,
      };
      setHistory(prev => [entry, ...prev]);
    }

    // Rafraîchir le solde wallet
    try {
      const walletData = await getWallet();
      setWalletBal(walletData.amount);
    } catch (_) {}

    setSuccessMsg("Transaction successfully completed !");
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  return (
    <>
      <style>{CSS}</style>
      <div style={S.page}>
        <div style={S.gridOverlay} />
        <div style={S.orb1} />
        <div style={S.orb2} />

        <div style={S.content}>
          {/* ── Header ── */}
          <div style={S.header}>
            <div style={S.headerLeft}>
              <div style={S.liveRow}>
                <div style={S.liveDot} />
                <span style={S.liveLabel}>Transactions</span>
              </div>
              <h1 style={S.pageTitle}>My Transactions</h1>
              <span style={S.pageDate}>{dateStr}</span>
            </div>

            <div style={S.headerRight}>
              <div className="wallet-badge" style={S.walletBadge} onClick={() => navigate("/wallet")} title="Access the wallet">
                <div style={S.walletDot} />
                <div style={S.walletInfo}>
                  <span style={S.walletLabel}>Wallet</span>
                  <span style={S.walletAmount}>
                    {walletBal !== null ? `$${parseFloat(walletBal).toFixed(2)}` : "—"}
                  </span>
                </div>
                <span style={S.walletArrow}>↗</span>
              </div>
              <div style={S.navLinks}>
                <a className="nav-link" style={S.navLink} onClick={() => navigate("/portfolio")}>
                  <span>◈</span> Portfolio
                </a>
                <a className="nav-link" style={S.navLink} onClick={() => navigate("/wallet")}>
                  <span>◎</span> Wallet
                </a>
              </div>
            </div>
          </div>

          <main style={S.main}>

            {/* ── Message succès ── */}
            {successMsg && (
              <div style={{
                background: "rgba(0,212,122,0.07)", border: "1px solid rgba(0,212,122,0.22)",
                borderRadius: "2px", padding: "12px 18px", color: "#00d47a",
                fontSize: "12px", fontFamily: "'Courier New', monospace",
                letterSpacing: "0.5px", animation: "fadeUp 0.3s ease forwards",
              }}>
                ✓ {successMsg}
              </div>
            )}

            {/* ── Grille principale ── */}
            <div style={{ animation: "slideIn 0.5s ease 0.1s both" }}>
              <div style={S.sectionTitle}>
                Place an order <span style={S.sectionLine} />
              </div>

              <div style={S.grid}>
                {/* ── Historique ── */}
                <div style={S.panel}>
                  <div style={S.panelHeader}>
                    <span style={S.panelTitle}>Historique</span>
                    <span style={{ fontSize: "10px", color: "rgba(0,168,255,0.5)", fontFamily: "monospace", letterSpacing: "1px" }}>
                      {history.length} ordre{history.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {loadingHistory ? (
                    <div style={S.loadingBox}>
                      <div style={{ fontSize: "20px", marginBottom: "12px", display: "inline-block", animation: "spin 1s linear infinite" }}>◌</div>
                      <div>Loading…</div>
                    </div>
                  ) : historyError ? (
                    <div style={{ padding: "16px" }}><div style={S.errorBox}>⚠ {historyError}</div></div>
                  ) : history.length === 0 ? (
                    <div style={S.emptyState}>
                      <div style={S.emptyIcon}>◎</div>
                      <div>No transactions yet</div>
                    </div>
                  ) : (
                    <table style={S.table}>
                      <thead>
                        <tr>
                          {["Date", "Symbol", "Type", "Qty", "Unit Price.", "Total"].map(h => (
                            <th key={h} style={S.th}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {history.map((tx, i) => (
                          <tr key={tx.id ?? i}>
                            <td style={S.td}>{tx.date ?? "—"}</td>
                            <td style={{ ...S.td, color: "#f0f4f8", fontWeight: "600" }}>{tx.symbol}</td>
                            <td style={S.td}>
                              <span style={{
                                ...S.badge,
                                background: tx.type === "BUY" ? "rgba(0,212,122,0.1)" : "rgba(255,107,122,0.1)",
                                border: `1px solid ${tx.type === "BUY" ? "rgba(0,212,122,0.25)" : "rgba(255,107,122,0.25)"}`,
                                color: tx.type === "BUY" ? "#00d47a" : "#ff8080",
                              }}>
                                {tx.type === "BUY" ? "▲ BUY" : "▼ SELL"}
                              </span>
                            </td>
                            <td style={S.td}>{tx.qty ?? tx.quantity}</td>
                            <td style={S.td}>${parseFloat(tx.price ?? 0).toFixed(2)}</td>
                            <td style={{ ...S.td, color: tx.type === "BUY" ? "rgba(0,212,122,0.8)" : "rgba(255,128,128,0.8)", fontWeight: "600" }}>
                              ${parseFloat(tx.total ?? (tx.price * (tx.qty ?? tx.quantity))).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* ── Formulaire ── */}
                <div style={S.panel}>
                  <div style={S.panelHeader}>
                    <span style={S.panelTitle}>New order</span>
                  </div>
                  <div style={S.panelBody}>
                    <TransactionForm onSuccess={handleTransactionSuccess} />
                  </div>
                </div>
              </div>
            </div>

          </main>
        </div>
      </div>
    </>
  );
}

export default Transactions;