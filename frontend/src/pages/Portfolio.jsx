import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWallet } from "../services/walletService.js";
import { createPortfolio, getPortfolios } from "../services/portfolioService";

// ─── Helpers ──────────────────────────────────────────────────────
const totalValue  = (holdings) => (holdings || []).reduce((s, h) => s + (h.amount || 0), 0);
const fmtUSD      = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);
const mockPnl     = (h) => ((h.currentPrice * h.quantity - h.amount) / h.amount * 100).toFixed(2);

// ─── Styles ───────────────────────────────────────────────────────
const S = {
  page: {
    width: "100vw", minHeight: "100vh",
    margin: 0, padding: 0,
    background: "#080d18",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    position: "relative", overflowX: "hidden",
    color: "#e8f0f8",
  },
  gridOverlay: {
    position: "fixed", inset: 0,
    backgroundImage: `
      linear-gradient(rgba(0,200,150,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,200,150,0.025) 1px, transparent 1px)
    `,
    backgroundSize: "48px 48px",
    pointerEvents: "none", zIndex: 0,
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
    padding: "36px 40px 0",
    maxWidth: "1280px", margin: "0 auto",
    display: "flex", alignItems: "flex-end", justifyContent: "space-between",
    animation: "fadeUp 0.5s ease forwards",
  },
  headerLeft: { display: "flex", flexDirection: "column", gap: "8px" },
  headerRight: { display: "flex", alignItems: "center", gap: "10px" },
  liveRow: { display: "flex", alignItems: "center", gap: "7px" },
  liveDot: {
    width: "7px", height: "7px", borderRadius: "50%",
    background: "#00d47a", boxShadow: "0 0 10px #00d47a",
    animation: "pulse 2s infinite",
  },
  liveLabel: {
    fontSize: "10px", letterSpacing: "3px", color: "#00d47a",
    textTransform: "uppercase", fontFamily: "'Courier New', monospace", fontWeight: "700",
  },
  pageTitle: { fontSize: "32px", fontWeight: "normal", color: "#f0f4f8", margin: 0, letterSpacing: "0.3px", lineHeight: 1 },
  pageDate: { fontSize: "12px", color: "rgba(160,185,210,0.35)", fontFamily: "'Courier New', monospace", letterSpacing: "0.8px", textTransform: "capitalize" },
  walletBadge: {
    display: "flex", alignItems: "center", gap: "10px",
    background: "rgba(0,212,122,0.06)", border: "1px solid rgba(0,212,122,0.18)",
    borderRadius: "2px", padding: "10px 18px",
    cursor: "pointer", transition: "border-color 0.2s, background 0.2s",
  },
  walletDot: { width: "6px", height: "6px", borderRadius: "50%", background: "#00d47a", boxShadow: "0 0 7px #00d47a", animation: "pulse 2s infinite", flexShrink: 0 },
  walletInfo: { display: "flex", flexDirection: "column", gap: "2px" },
  walletLabel: { fontSize: "9px", letterSpacing: "2px", color: "rgba(160,185,210,0.45)", textTransform: "uppercase", fontFamily: "'Courier New', monospace" },
  walletAmount: { fontSize: "18px", color: "#00d47a", fontFamily: "'Courier New', monospace", fontWeight: "700", textShadow: "0 0 14px rgba(0,212,122,0.3)" },
  walletArrow: { fontSize: "11px", color: "rgba(0,212,122,0.4)", fontFamily: "monospace" },
  navLinks: { display: "flex", gap: "8px" },
  navLink: {
    display: "flex", alignItems: "center", gap: "6px",
    padding: "10px 16px",
    background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "2px", color: "rgba(160,185,210,0.55)",
    fontSize: "10px", letterSpacing: "1.8px", textTransform: "uppercase",
    fontFamily: "'Courier New', monospace", fontWeight: "600",
    cursor: "pointer", textDecoration: "none",
    transition: "border-color 0.2s, color 0.2s, background 0.2s",
    whiteSpace: "nowrap",
  },
  main: { maxWidth: "1280px", margin: "0 auto", padding: "32px 40px", display: "flex", flexDirection: "column", gap: "32px" },
  sectionTitle: {
    fontSize: "11px", letterSpacing: "2.5px", color: "rgba(160,185,210,0.4)",
    textTransform: "uppercase", fontFamily: "'Courier New', monospace",
    marginBottom: "14px", display: "flex", alignItems: "center", gap: "10px",
  },
  sectionLine: { flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" },
  createPanel: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "2px", overflow: "hidden" },
  createHeader: { padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: "10px" },
  createHeaderDot: { width: "5px", height: "5px", borderRadius: "50%", background: "#00d47a", boxShadow: "0 0 6px #00d47a" },
  createHeaderTitle: { fontSize: "10px", letterSpacing: "2.5px", color: "rgba(160,185,210,0.5)", textTransform: "uppercase", fontFamily: "'Courier New', monospace" },
  createBody: { padding: "24px", display: "flex", gap: "12px", alignItems: "flex-end" },
  createFieldWrap: { display: "flex", flexDirection: "column", gap: "7px", flex: 1 },
  createLabel: { fontSize: "9px", letterSpacing: "2px", color: "rgba(160,185,210,0.45)", textTransform: "uppercase", fontFamily: "'Courier New', monospace" },
  createInput: {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "2px", padding: "12px 16px", color: "#e8f0f8", fontSize: "14px",
    fontFamily: "'Courier New', monospace", outline: "none",
    transition: "border-color 0.2s, background 0.2s", letterSpacing: "0.5px",
    width: "100%", boxSizing: "border-box",
  },
  createBtn: {
    padding: "12px 28px", background: "linear-gradient(135deg, #00d47a 0%, #00a8c8 100%)",
    border: "none", borderRadius: "2px", color: "#080d18", fontSize: "10px", letterSpacing: "2px",
    textTransform: "uppercase", fontFamily: "'Courier New', monospace", fontWeight: "700",
    cursor: "pointer", transition: "opacity 0.2s, transform 0.1s",
    boxShadow: "0 4px 18px rgba(0,212,122,0.2)", whiteSpace: "nowrap", flexShrink: 0,
  },
  successBanner: {
    display: "flex", alignItems: "center", gap: "10px",
    background: "rgba(0,212,122,0.07)", border: "1px solid rgba(0,212,122,0.25)",
    borderRadius: "2px", padding: "10px 16px", marginTop: "12px",
    fontSize: "12px", color: "#00d47a", fontFamily: "'Courier New', monospace", letterSpacing: "0.5px",
    animation: "fadeUp 0.3s ease forwards",
  },
  portfolioGrid: { display: "flex", flexDirection: "column", gap: "20px" },
  portfolioCard: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "2px", overflow: "hidden" },
  portfolioCardHeader: { padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", transition: "background 0.2s" },
  portfolioCardHeaderLeft: { display: "flex", alignItems: "center", gap: "14px" },
  portfolioIndex: { fontSize: "9px", letterSpacing: "2px", color: "rgba(160,185,210,0.3)", fontFamily: "'Courier New', monospace", minWidth: "24px" },
  portfolioName: { fontSize: "16px", color: "#f0f4f8", letterSpacing: "0.3px" },
  portfolioCreated: { fontSize: "10px", color: "rgba(160,185,210,0.3)", fontFamily: "'Courier New', monospace", letterSpacing: "0.5px" },
  portfolioCardHeaderRight: { display: "flex", alignItems: "center", gap: "24px" },
  portfolioTotal: { textAlign: "right" },
  portfolioTotalLabel: { fontSize: "9px", letterSpacing: "2px", color: "rgba(160,185,210,0.35)", textTransform: "uppercase", fontFamily: "'Courier New', monospace", marginBottom: "3px" },
  portfolioTotalValue: { fontSize: "20px", color: "#00d47a", fontFamily: "'Courier New', monospace", fontWeight: "700", textShadow: "0 0 16px rgba(0,212,122,0.25)" },
  chevron: { fontSize: "14px", color: "rgba(160,185,210,0.3)", fontFamily: "monospace", transition: "transform 0.25s", userSelect: "none" },
  holdingsWrap: { overflow: "hidden", transition: "max-height 0.35s ease" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { fontSize: "9px", letterSpacing: "2px", color: "rgba(160,185,210,0.3)", textTransform: "uppercase", fontFamily: "'Courier New', monospace", padding: "10px 24px", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.04)", fontWeight: "normal" },
  thRight: { fontSize: "9px", letterSpacing: "2px", color: "rgba(160,185,210,0.3)", textTransform: "uppercase", fontFamily: "'Courier New', monospace", padding: "10px 24px", textAlign: "right", borderBottom: "1px solid rgba(255,255,255,0.04)", fontWeight: "normal" },
  td: { fontSize: "12px", fontFamily: "'Courier New', monospace", padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.025)", color: "rgba(200,220,240,0.7)", letterSpacing: "0.3px", verticalAlign: "middle" },
  tdRight: { fontSize: "12px", fontFamily: "'Courier New', monospace", padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.025)", color: "rgba(200,220,240,0.7)", letterSpacing: "0.3px", textAlign: "right", verticalAlign: "middle" },
  symbolBadge: { display: "inline-flex", alignItems: "center", gap: "8px" },
  symbolTag: { background: "rgba(0,168,255,0.08)", border: "1px solid rgba(0,168,255,0.18)", borderRadius: "2px", padding: "3px 8px", fontSize: "11px", color: "#78c8ff", fontFamily: "'Courier New', monospace", fontWeight: "700", letterSpacing: "1px" },
  stockNameTd: { fontSize: "12px", color: "rgba(160,185,210,0.55)", fontFamily: "'Courier New', monospace" },
  pnlBadge: { display: "inline-block", padding: "3px 8px", borderRadius: "2px", fontSize: "10px", letterSpacing: "1px", fontFamily: "'Courier New', monospace", fontWeight: "700" },
  emptyPortfolios: { padding: "56px 24px", textAlign: "center", color: "rgba(160,185,210,0.25)", fontFamily: "'Courier New', monospace", fontSize: "13px", letterSpacing: "1px" },
  emptyIcon: { fontSize: "32px", marginBottom: "14px", opacity: 0.2 },
  holdingsFooter: { display: "flex", gap: "32px", padding: "14px 24px", borderTop: "1px solid rgba(0,212,122,0.08)", background: "rgba(0,212,122,0.025)", justifyContent: "flex-end" },
  footerStat: { display: "flex", flexDirection: "column", gap: "3px", alignItems: "flex-end" },
  footerStatLabel: { fontSize: "9px", letterSpacing: "1.8px", color: "rgba(160,185,210,0.35)", textTransform: "uppercase", fontFamily: "'Courier New', monospace" },
  footerStatValue: { fontSize: "13px", fontFamily: "'Courier New', monospace", fontWeight: "700", letterSpacing: "0.5px" },
  loadingBox: { padding: "56px 24px", textAlign: "center", color: "rgba(0,212,122,0.4)", fontFamily: "'Courier New', monospace", fontSize: "12px", letterSpacing: "2px" },
  errorBox: { background: "rgba(255,60,80,0.06)", border: "1px solid rgba(255,60,80,0.2)", borderRadius: "2px", padding: "12px 18px", color: "#ff8080", fontSize: "12px", fontFamily: "'Courier New', monospace", letterSpacing: "0.3px" },
  newCardHighlight: { borderColor: "rgba(0,212,122,0.45)", boxShadow: "0 0 20px rgba(0,212,122,0.08)" },
};

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { width: 100%; min-height: 100vh; overflow-x: hidden; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.4;transform:scale(0.75);} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);} }
  @keyframes slideIn { from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);} }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes glowIn { from{opacity:0;border-color:rgba(0,212,122,0.6);box-shadow:0 0 30px rgba(0,212,122,0.2);}to{opacity:1;border-color:rgba(0,212,122,0.25);box-shadow:none;} }
  .nav-link:hover { border-color: rgba(0,212,122,0.28)!important; color:#00d47a!important; background:rgba(0,212,122,0.04)!important; }
  .wallet-badge:hover { border-color:rgba(0,212,122,0.35)!important; background:rgba(0,212,122,0.09)!important; }
  .create-input:focus { border-color:rgba(0,212,122,0.45)!important; background:rgba(0,212,122,0.03)!important; }
  .create-btn:hover { opacity:0.85; transform:translateY(-1px); }
  .create-btn:active { transform:translateY(0); }
  .portfolio-header:hover { background:rgba(255,255,255,0.02)!important; }
  tr:hover td { background:rgba(255,255,255,0.015); color:rgba(220,235,250,0.9)!important; }
  .new-card { animation: glowIn 0.6s ease forwards; }
`;

// ─── Component ────────────────────────────────────────────────────
function Portfolio() {
  const [portfolios, setPortfolios]   = useState([]);
  const [newName, setNewName]         = useState("");
  const [creating, setCreating]       = useState(false);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [fetchError, setFetchError]   = useState("");
  const [openId, setOpenId]           = useState(null);
  const [walletBal, setWalletBal]     = useState(null);
  const [newlyCreatedId, setNewlyCreatedId] = useState(null);
  const [successMsg, setSuccessMsg]   = useState("");
  const navigate = useNavigate();

  const now     = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [portfolioData, walletData] = await Promise.allSettled([
          getPortfolios(),
          getWallet(),
        ]);

        if (portfolioData.status === "fulfilled") {
          setPortfolios(portfolioData.value);
          if (portfolioData.value.length > 0) {
            setOpenId(portfolioData.value[0].id);
          }
        } else {
          setFetchError("Unable to load portfolios");
        }

        if (walletData.status === "fulfilled") {
          setWalletBal(walletData.value.amount);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) { setError("Please enter a portfolio name"); return; }
    setCreating(true);
    setError("");
    setSuccessMsg("");
    try {
      await createPortfolio(name);

      const updated = await getPortfolios();
      setPortfolios(updated);
      setNewName("");

      const newest = updated[updated.length - 1];
      if (newest) {
        setOpenId(newest.id);
        setNewlyCreatedId(newest.id);
        setTimeout(() => setNewlyCreatedId(null), 3000);
        setTimeout(() => {
          document.getElementById("portfolio-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }

      setSuccessMsg(`Portfolio "${name}" created successfully`);
      setTimeout(() => setSuccessMsg(""), 4000);

    } catch (err) {
      setError(err.response?.data?.message || "Error creating portfolio");
    } finally {
      setCreating(false);
    }
  };

  const toggle = (id) => setOpenId(prev => (prev === id ? null : id));
  const grandTotal = portfolios.reduce((s, p) => s + totalValue(p.holdings || []), 0);

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
                <span style={S.liveLabel}>Portfolio</span>
              </div>
              <h1 style={S.pageTitle}>My Portfolio</h1>
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
                <a className="nav-link" style={S.navLink} onClick={() => navigate("/transaction")}>
                  <span>≡</span> Transactions
                </a>
                <a className="nav-link" style={S.navLink} onClick={() => navigate("/wallet")}>
                  <span>◎</span> Wallet
                </a>
              </div>
            </div>
          </div>

          <main style={S.main}>

            {/* ── Create section ── */}
            <div>
              <div style={S.sectionTitle}>
                New portfolio <span style={S.sectionLine} />
              </div>
              <div style={S.createPanel}>
                <div style={S.createHeader}>
                  <div style={S.createHeaderDot} />
                  <span style={S.createHeaderTitle}>Create a portfolio</span>
                </div>
                <div style={S.createBody}>
                  <div style={S.createFieldWrap}>
                    <label style={S.createLabel}>Portfolio name</label>
                    <input
                      className="create-input"
                      style={S.createInput}
                      type="text"
                      placeholder="e.g. Tech Growth, Dividends, Long Term…"
                      value={newName}
                      onChange={e => { setNewName(e.target.value); setError(""); }}
                      onKeyDown={e => e.key === "Enter" && handleCreate()}
                      disabled={creating}
                    />
                    {error && (
                      <span style={{ fontSize: "11px", color: "#ff8080", fontFamily: "'Courier New', monospace", letterSpacing: "0.3px" }}>
                        ⚠ {error}
                      </span>
                    )}
                    {successMsg && (
                      <div style={S.successBanner}>
                        <span>✓</span>
                        <span>{successMsg} — visible below</span>
                      </div>
                    )}
                  </div>
                  <button
                    className="create-btn"
                    style={{ ...S.createBtn, opacity: creating ? 0.5 : 1 }}
                    onClick={handleCreate}
                    disabled={creating}
                  >
                    {creating ? "Creating…" : "+ Create"}
                  </button>
                </div>
              </div>
            </div>

            {/* ── Portfolio list ── */}
            <div id="portfolio-list">
              <div style={S.sectionTitle}>
                {portfolios.length} portfolio{portfolios.length !== 1 ? "s" : ""}
                <span style={S.sectionLine} />
                <span style={{ fontSize: "12px", color: "#00d47a", fontFamily: "'Courier New', monospace", fontWeight: "700", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>
                  Total {fmtUSD(grandTotal)}
                </span>
              </div>

              {loading ? (
                <div style={S.loadingBox}>
                  <div style={{ fontSize: "20px", marginBottom: "12px", display: "inline-block", animation: "spin 1s linear infinite" }}>◌</div>
                  <div>Loading portfolios…</div>
                </div>
              ) : fetchError ? (
                <div style={S.errorBox}>⚠ {fetchError}</div>
              ) : portfolios.length === 0 ? (
                <div style={S.emptyPortfolios}>
                  <div style={S.emptyIcon}>◈</div>
                  <div>No portfolios yet</div>
                  <div style={{ fontSize: "11px", marginTop: "8px", opacity: 0.5 }}>
                    Create your first portfolio above
                  </div>
                </div>
              ) : (
                <div style={S.portfolioGrid}>
                  {portfolios.map((pf, idx) => {
                    const isOpen   = openId === pf.id;
                    const isNew    = newlyCreatedId === pf.id;
                    const holdings = pf.holdings || [];
                    const total    = totalValue(holdings);
                    const totalCurrentVal = holdings.reduce((s, h) => s + (h.currentPrice || 0) * (h.quantity || 0), 0);
                    const globalPnlPct    = total > 0 ? ((totalCurrentVal - total) / total * 100).toFixed(2) : "0.00";
                    const pnlPos   = parseFloat(globalPnlPct) >= 0;

                    return (
                      <div
                        key={pf.id}
                        className={isNew ? "new-card" : ""}
                        style={{
                          ...S.portfolioCard,
                          animation: isNew ? undefined : `slideIn 0.4s ease ${0.08 * idx + 0.1}s both`,
                          borderColor: isNew
                            ? "rgba(0,212,122,0.45)"
                            : isOpen
                              ? "rgba(0,212,122,0.2)"
                              : "rgba(255,255,255,0.07)",
                        }}
                      >
                        <div className="portfolio-header" style={S.portfolioCardHeader} onClick={() => toggle(pf.id)}>
                          <div style={S.portfolioCardHeaderLeft}>
                            <span style={S.portfolioIndex}>#{String(idx + 1).padStart(2, "0")}</span>
                            <div>
                              <div style={{ ...S.portfolioName, color: isNew ? "#00d47a" : "#f0f4f8" }}>
                                {pf.name}
                                {isNew && (
                                  <span style={{ marginLeft: "10px", fontSize: "9px", letterSpacing: "1.5px", background: "rgba(0,212,122,0.12)", border: "1px solid rgba(0,212,122,0.3)", borderRadius: "2px", padding: "2px 7px", color: "#00d47a", fontFamily: "'Courier New', monospace", verticalAlign: "middle" }}>
                                    NEW
                                  </span>
                                )}
                              </div>
                              <div style={S.portfolioCreated}>Created on {pf.createdAt}</div>
                            </div>
                          </div>
                          <div style={S.portfolioCardHeaderRight}>
                            <span style={{ fontSize: "10px", color: "rgba(0,168,255,0.45)", fontFamily: "monospace", letterSpacing: "1px" }}>
                              {holdings.length} position{holdings.length !== 1 ? "s" : ""}
                            </span>
                            {holdings.length > 0 && (
                              <span style={{ fontSize: "12px", color: pnlPos ? "#00d47a" : "#ff8080", fontFamily: "'Courier New', monospace", fontWeight: "700", letterSpacing: "0.5px" }}>
                                {pnlPos ? "▲" : "▼"} {Math.abs(parseFloat(globalPnlPct))}%
                              </span>
                            )}
                            <div style={S.portfolioTotal}>
                              <div style={S.portfolioTotalLabel}>Invested value</div>
                              <div style={S.portfolioTotalValue}>{fmtUSD(total)}</div>
                            </div>
                            <span style={{ ...S.chevron, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
                          </div>
                        </div>

                        <div style={{ ...S.holdingsWrap, maxHeight: isOpen ? "1000px" : "0px" }}>
                          {holdings.length === 0 ? (
                            <div style={{ padding: "32px 24px", textAlign: "center", color: "rgba(160,185,210,0.25)", fontFamily: "'Courier New', monospace", fontSize: "12px", letterSpacing: "1px" }}>
                              No positions in this portfolio
                            </div>
                          ) : (
                            <>
                              <table style={S.table}>
                                <thead>
                                  <tr>
                                    <th style={S.th}>Symbol</th>
                                    <th style={S.th}>Name</th>
                                    <th style={S.thRight}>Quantity</th>
                                    <th style={S.thRight}>Current Price</th>
                                    <th style={S.thRight}>Invested Amount</th>
                                    <th style={S.thRight}>Current Value</th>
                                    <th style={S.thRight}>P&amp;L</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {holdings.map((h) => {
                                    const currVal = (h.currentPrice || 0) * (h.quantity || 0);
                                    const pnl     = parseFloat(mockPnl(h));
                                    const pnlPos  = pnl >= 0;
                                    return (
                                      <tr key={h.stockSymbol}>
                                        <td style={S.td}>
                                          <div style={S.symbolBadge}>
                                            <span style={S.symbolTag}>{h.stockSymbol}</span>
                                          </div>
                                        </td>
                                        <td style={{ ...S.td, ...S.stockNameTd }}>{h.stockName}</td>
                                        <td style={S.tdRight}>{(h.quantity || 0).toLocaleString()}</td>
                                        <td style={{ ...S.tdRight, color: "#78c8ff" }}>{fmtUSD(h.currentPrice || 0)}</td>
                                        <td style={S.tdRight}>{fmtUSD(h.amount || 0)}</td>
                                        <td style={{ ...S.tdRight, color: "#f0f4f8", fontWeight: "600" }}>{fmtUSD(currVal)}</td>
                                        <td style={S.tdRight}>
                                          <span style={{ ...S.pnlBadge, background: pnlPos ? "rgba(0,212,122,0.1)" : "rgba(255,107,122,0.1)", border: `1px solid ${pnlPos ? "rgba(0,212,122,0.22)" : "rgba(255,107,122,0.22)"}`, color: pnlPos ? "#00d47a" : "#ff8080" }}>
                                            {pnlPos ? "▲" : "▼"} {Math.abs(pnl)}%
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                              <div style={S.holdingsFooter}>
                                <div style={S.footerStat}>
                                  <span style={S.footerStatLabel}>Invested</span>
                                  <span style={{ ...S.footerStatValue, color: "rgba(160,185,210,0.7)" }}>{fmtUSD(total)}</span>
                                </div>
                                <div style={S.footerStat}>
                                  <span style={S.footerStatLabel}>Current Value</span>
                                  <span style={{ ...S.footerStatValue, color: "#f0f4f8" }}>{fmtUSD(totalCurrentVal)}</span>
                                </div>
                                <div style={S.footerStat}>
                                  <span style={S.footerStatLabel}>Overall P&amp;L</span>
                                  <span style={{ ...S.footerStatValue, color: parseFloat(globalPnlPct) >= 0 ? "#00d47a" : "#ff8080" }}>
                                    {parseFloat(globalPnlPct) >= 0 ? "▲" : "▼"} {Math.abs(parseFloat(globalPnlPct))}%
                                    &nbsp;
                                    <span style={{ fontWeight: "normal", fontSize: "11px", opacity: 0.7 }}>
                                      ({fmtUSD(Math.abs(totalCurrentVal - total))})
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </main>
        </div>
      </div>
    </>
  );
}

export default Portfolio;