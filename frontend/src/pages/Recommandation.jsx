import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPortfolios } from "../services/portfolioService";
import { getRecommendation } from "../services/recommandationService";

const ADVICE_CFG = {
  BUY:     { color: "#00d47a", bg: "rgba(0,212,122,0.08)",   border: "rgba(0,212,122,0.25)",   icon: "▲", label: "BUY"     },
  SELL:    { color: "#ff6b7a", bg: "rgba(255,107,122,0.08)", border: "rgba(255,107,122,0.25)", icon: "▼", label: "SELL"    },
  HOLD:    { color: "#f0c040", bg: "rgba(240,192,64,0.08)",  border: "rgba(240,192,64,0.25)",  icon: "◆", label: "HOLD"    },
  UNKNOWN: { color: "#8b949e", bg: "rgba(139,148,158,0.08)", border: "rgba(139,148,158,0.2)",  icon: "?", label: "UNKNOWN" },
};

const parseComment = (comment) => {
  const buyMatch    = comment?.match(/Purchase price\s*:\s*([\d.]+)\$/) ?? comment?.match(/Prix d'achat\s*:\s*([\d.]+)\$/);
  const currMatch   = comment?.match(/Current price\s*:\s*([\d.]+)\$/)  ?? comment?.match(/Prix actuel\s*:\s*([\d.]+)\$/);
  const changeMatch = comment?.match(/Change\s*:\s*([-\d.]+)%/)         ?? comment?.match(/Variation\s*:\s*([-\d.]+)%/);
  return {
    buyPrice:  buyMatch?.[1]    ?? "—",
    currPrice: currMatch?.[1]   ?? "—",
    change:    changeMatch?.[1] ?? "—",
  };
};

const STOCK_SYMBOLS = [
  { symbol: "AAPL",  name: "Apple Inc." },
  { symbol: "MSFT",  name: "Microsoft Corp." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN",  name: "Amazon.com Inc." },
  { symbol: "NVDA",  name: "NVIDIA Corp." },
  { symbol: "META",  name: "Meta Platforms Inc." },
  { symbol: "TSLA",  name: "Tesla Inc." },
  { symbol: "BRK.B", name: "Berkshire Hathaway" },
  { symbol: "JPM",   name: "JPMorgan Chase" },
  { symbol: "V",     name: "Visa Inc." },
  { symbol: "JNJ",   name: "Johnson & Johnson" },
  { symbol: "WMT",   name: "Walmart Inc." },
  { symbol: "XOM",   name: "Exxon Mobil Corp." },
  { symbol: "UNH",   name: "UnitedHealth Group" },
  { symbol: "MA",    name: "Mastercard Inc." },
  { symbol: "PG",    name: "Procter & Gamble" },
  { symbol: "HD",    name: "Home Depot Inc." },
  { symbol: "CVX",   name: "Chevron Corp." },
  { symbol: "ABBV",  name: "AbbVie Inc." },
  { symbol: "BAC",   name: "Bank of America" },
  { symbol: "KO",    name: "Coca-Cola Co." },
  { symbol: "AVGO",  name: "Broadcom Inc." },
  { symbol: "PFE",   name: "Pfizer Inc." },
  { symbol: "COST",  name: "Costco Wholesale" },
  { symbol: "DIS",   name: "Walt Disney Co." },
  { symbol: "NFLX",  name: "Netflix Inc." },
  { symbol: "ADBE",  name: "Adobe Inc." },
  { symbol: "CRM",   name: "Salesforce Inc." },
  { symbol: "AMD",   name: "Advanced Micro Devices" },
  { symbol: "INTC",  name: "Intel Corp." },
];

const S = {
  page: { width: "100vw", minHeight: "100vh", margin: 0, padding: 0, background: "#080d18", fontFamily: "'Georgia', 'Times New Roman', serif", position: "relative", overflowX: "hidden", color: "#e8f0f8" },
  gridOverlay: { position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(0,200,150,0.025) 1px, transparent 1px),linear-gradient(90deg, rgba(0,200,150,0.025) 1px, transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none", zIndex: 0 },
  orb1: { position: "fixed", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,212,122,0.07) 0%, transparent 65%)", top: "-180px", right: "-180px", pointerEvents: "none", zIndex: 0 },
  orb2: { position: "fixed", width: "450px", height: "450px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,140,255,0.06) 0%, transparent 65%)", bottom: "-120px", left: "-120px", pointerEvents: "none", zIndex: 0 },
  content: { position: "relative", zIndex: 1, paddingBottom: "80px" },
  header: { padding: "36px 40px 0", maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "flex-end", justifyContent: "space-between", animation: "fadeUp 0.5s ease forwards" },
  headerLeft: { display: "flex", flexDirection: "column", gap: "8px" },
  liveRow: { display: "flex", alignItems: "center", gap: "7px" },
  liveDot: { width: "7px", height: "7px", borderRadius: "50%", background: "#00d47a", boxShadow: "0 0 10px #00d47a", animation: "pulse 2s infinite" },
  liveLabel: { fontSize: "10px", letterSpacing: "3px", color: "#00d47a", textTransform: "uppercase", fontFamily: "'Courier New', monospace", fontWeight: "700" },
  pageTitle: { fontSize: "32px", fontWeight: "normal", color: "#f0f4f8", margin: 0, letterSpacing: "0.3px", lineHeight: 1 },
  pageDate: { fontSize: "12px", color: "rgba(160,185,210,0.35)", fontFamily: "'Courier New', monospace", letterSpacing: "0.8px", textTransform: "capitalize" },
  navLinks: { display: "flex", gap: "8px" },
  navLink: { display: "flex", alignItems: "center", gap: "6px", padding: "10px 16px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "2px", color: "rgba(160,185,210,0.55)", fontSize: "10px", letterSpacing: "1.8px", textTransform: "uppercase", fontFamily: "'Courier New', monospace", fontWeight: "600", cursor: "pointer", textDecoration: "none", transition: "border-color 0.2s, color 0.2s, background 0.2s", whiteSpace: "nowrap" },
  main: { maxWidth: "1280px", margin: "0 auto", padding: "32px 40px", display: "flex", flexDirection: "column", gap: "28px" },
  sectionTitle: { fontSize: "11px", letterSpacing: "2.5px", color: "rgba(160,185,210,0.4)", textTransform: "uppercase", fontFamily: "'Courier New', monospace", marginBottom: "14px", display: "flex", alignItems: "center", gap: "10px" },
  sectionLine: { flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" },
  formPanel: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "2px", overflow: "hidden" },
  formHeader: { padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: "10px" },
  formHeaderDot: { width: "5px", height: "5px", borderRadius: "50%", background: "#00d47a", boxShadow: "0 0 6px #00d47a" },
  formHeaderTitle: { fontSize: "10px", letterSpacing: "2.5px", color: "rgba(160,185,210,0.5)", textTransform: "uppercase", fontFamily: "'Courier New', monospace" },
  formBody: { padding: "24px", display: "flex", gap: "12px", alignItems: "flex-start", flexWrap: "wrap" },
  fieldWrap: { display: "flex", flexDirection: "column", gap: "7px", flex: 1, minWidth: "180px" },
  fieldLabel: { fontSize: "9px", letterSpacing: "2px", color: "rgba(160,185,210,0.45)", textTransform: "uppercase", fontFamily: "'Courier New', monospace" },
  select: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "2px", padding: "12px 16px", color: "#e8f0f8", fontSize: "14px", fontFamily: "'Courier New', monospace", outline: "none", width: "100%", boxSizing: "border-box", cursor: "pointer", transition: "border-color 0.2s, background 0.2s", appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2300d47a' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: "36px" },
  selectedHint: { fontSize: "10px", color: "rgba(0,212,122,0.55)", fontFamily: "'Courier New', monospace", letterSpacing: "0.4px", minHeight: "16px", marginTop: "4px" },
  analyzeBtn: { padding: "12px 32px", background: "linear-gradient(135deg, #00d47a 0%, #00a8c8 100%)", border: "none", borderRadius: "2px", color: "#080d18", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'Courier New', monospace", fontWeight: "700", cursor: "pointer", transition: "opacity 0.2s, transform 0.1s", boxShadow: "0 4px 18px rgba(0,212,122,0.2)", whiteSpace: "nowrap", flexShrink: 0 },
  resultCard: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "2px", overflow: "hidden", animation: "slideIn 0.4s ease forwards" },
  resultHeader: { padding: "20px 28px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" },
  resultTitleGroup: { display: "flex", alignItems: "center", gap: "14px" },
  symbolTag: { background: "rgba(0,168,255,0.08)", border: "1px solid rgba(0,168,255,0.18)", borderRadius: "2px", padding: "5px 12px", fontSize: "14px", color: "#78c8ff", fontFamily: "'Courier New', monospace", fontWeight: "700", letterSpacing: "2px" },
  portfolioTag: { fontSize: "13px", color: "rgba(160,185,210,0.5)", fontFamily: "'Courier New', monospace" },
  adviceBadge: { display: "flex", alignItems: "center", gap: "10px", padding: "10px 20px", borderRadius: "2px", fontFamily: "'Courier New', monospace", fontWeight: "700", fontSize: "15px", letterSpacing: "2px" },
  adviceIcon: { fontSize: "18px" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "rgba(255,255,255,0.04)" },
  statCell: { padding: "20px 28px", background: "#080d18", display: "flex", flexDirection: "column", gap: "6px" },
  statLabel: { fontSize: "9px", letterSpacing: "2px", color: "rgba(160,185,210,0.35)", textTransform: "uppercase", fontFamily: "'Courier New', monospace" },
  statValue: { fontSize: "22px", fontFamily: "'Courier New', monospace", fontWeight: "700", letterSpacing: "0.5px" },
  commentBox: { padding: "20px 28px", borderTop: "1px solid rgba(255,255,255,0.04)", background: "rgba(0,0,0,0.15)" },
  commentLabel: { fontSize: "9px", letterSpacing: "2px", color: "rgba(160,185,210,0.3)", textTransform: "uppercase", fontFamily: "'Courier New', monospace", marginBottom: "10px" },
  commentText: { fontSize: "13px", color: "rgba(200,220,240,0.6)", fontFamily: "'Courier New', monospace", letterSpacing: "0.4px", lineHeight: "1.7" },
  loadingBox: { padding: "56px 24px", textAlign: "center", color: "rgba(0,212,122,0.4)", fontFamily: "'Courier New', monospace", fontSize: "12px", letterSpacing: "2px" },
  errorBox: { background: "rgba(255,60,80,0.06)", border: "1px solid rgba(255,60,80,0.2)", borderRadius: "2px", padding: "14px 20px", color: "#ff8080", fontSize: "12px", fontFamily: "'Courier New', monospace", letterSpacing: "0.3px" },
  emptyBox: { padding: "56px 24px", textAlign: "center", color: "rgba(160,185,210,0.2)", fontFamily: "'Courier New', monospace", fontSize: "13px", letterSpacing: "1px" },
  emptyIcon: { fontSize: "36px", marginBottom: "16px", opacity: 0.15 },
  historyGrid: { display: "flex", flexDirection: "column", gap: "10px" },
  historyRow: { display: "flex", alignItems: "center", gap: "16px", padding: "14px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "2px", cursor: "pointer", transition: "border-color 0.2s, background 0.2s" },
  historySymbol: { fontFamily: "'Courier New', monospace", fontWeight: "700", fontSize: "13px", color: "#78c8ff", letterSpacing: "1.5px", minWidth: "60px" },
  historyPortfolio: { fontSize: "11px", color: "rgba(160,185,210,0.4)", fontFamily: "'Courier New', monospace", flex: 1 },
  historyAdvice: { fontSize: "10px", fontFamily: "'Courier New', monospace", fontWeight: "700", letterSpacing: "1.5px", padding: "3px 10px", borderRadius: "2px" },
  historyChange: { fontSize: "12px", fontFamily: "'Courier New', monospace", minWidth: "70px", textAlign: "right" },
};

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { width: 100%; min-height: 100vh; overflow-x: hidden; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.4;transform:scale(0.75);} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);} }
  @keyframes slideIn { from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);} }
  @keyframes spin { to { transform: rotate(360deg); } }
  .nav-link:hover { border-color:rgba(0,212,122,0.28)!important;color:#00d47a!important;background:rgba(0,212,122,0.04)!important; }
  .field-select:focus { border-color:rgba(0,212,122,0.45)!important;background:rgba(0,212,122,0.03)!important; }
  .analyze-btn:hover { opacity:0.85;transform:translateY(-1px); }
  .analyze-btn:active { transform:translateY(0); }
  .history-row:hover { border-color:rgba(0,212,122,0.2)!important;background:rgba(0,212,122,0.02)!important; }
`;

export default function Recommendation() {
  const [portfolios, setPortfolios]       = useState([]);
  const [portfolioName, setPortfolioName] = useState("");
  const [stockSymbol, setStockSymbol]     = useState("");
  const [result, setResult]               = useState(null);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState("");
  const [history, setHistory]             = useState([]);
  const navigate = useNavigate();

  const now     = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  // Derive symbols and full holdings from the selected portfolio
  const portfolioHoldings = (
    portfolios.find(p => p.name === portfolioName)?.stocks ??
    portfolios.find(p => p.name === portfolioName)?.positions ??
    portfolios.find(p => p.name === portfolioName)?.holdings ??
    []
  );
  const portfolioSymbols = portfolioHoldings
    .map(s => s.symbol ?? s.stockSymbol ?? s.ticker)
    .filter(Boolean);

  // Buy price of the currently selected stock from the portfolio
  const selectedHolding = portfolioHoldings.find(
    s => (s.symbol ?? s.stockSymbol ?? s.ticker) === stockSymbol
  );
  const buyPrice = selectedHolding
    ? parseFloat(selectedHolding.buyPrice ?? selectedHolding.purchasePrice ?? selectedHolding.avgPrice ?? selectedHolding.averagePrice ?? 0)
    : null;

  useEffect(() => {
    getPortfolios()
      .then(data => {
        setPortfolios(data || []);
        if (data?.length > 0) setPortfolioName(data[0].name);
      })
      .catch(() => {});
  }, []);

  // Reset selected symbol whenever portfolio changes
  useEffect(() => { setStockSymbol(""); }, [portfolioName]);

  const handleAnalyze = async () => {
    if (!portfolioName.trim() || !stockSymbol.trim()) {
      setError("Please select a portfolio and a stock symbol.");
      return;
    }
    setLoading(true); setError(""); setResult(null);
    try {
      const data = await getRecommendation(portfolioName.trim(), stockSymbol.trim().toUpperCase());
      setResult(data);
      setHistory(prev => {
        const filtered = prev.filter(h => !(h.portfolioName === data.portfolioName && h.stockSymbol === data.stockSymbol));
        return [data, ...filtered].slice(0, 8);
      });
      setTimeout(() => document.getElementById("rec-result")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.msg || err.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const replayHistory = (item) => {
    setPortfolioName(item.portfolioName);
    setStockSymbol(item.stockSymbol);
    setResult(item);
    setTimeout(() => document.getElementById("rec-result")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const cfg         = ADVICE_CFG[result?.advice] ?? ADVICE_CFG.UNKNOWN;
  const parsed      = parseComment(result?.comment);
  const changeNum   = parseFloat(parsed.change);
  const changeColor = isNaN(changeNum) ? "#8b949e" : changeNum >= 0 ? "#00d47a" : "#ff6b7a";

  return (
    <>
      <style>{CSS}</style>
      <div style={S.page}>
        <div style={S.gridOverlay} /><div style={S.orb1} /><div style={S.orb2} />
        <div style={S.content}>

          <div style={S.header}>
            <div style={S.headerLeft}>
              <div style={S.liveRow}><div style={S.liveDot} /><span style={S.liveLabel}>Analysis</span></div>
              <h1 style={S.pageTitle}>Recommendations</h1>
              <span style={S.pageDate}>{dateStr}</span>
            </div>
            <div style={S.navLinks}>
              <a className="nav-link" style={S.navLink} onClick={() => navigate("/portfolio")}><span>◈</span> Portfolios</a>
              <a className="nav-link" style={S.navLink} onClick={() => navigate("/transaction")}><span>≡</span> Transactions</a>
              <a className="nav-link" style={S.navLink} onClick={() => navigate("/wallet")}><span>◎</span> Wallet</a>
            </div>
          </div>

          <main style={S.main}>

            <div>
              <div style={S.sectionTitle}>New Analysis <span style={S.sectionLine} /></div>
              <div style={S.formPanel}>
                <div style={S.formHeader}>
                  <div style={S.formHeaderDot} />
                  <span style={S.formHeaderTitle}>Analyze a position</span>
                </div>
                <div style={S.formBody}>

                  <div style={S.fieldWrap}>
                    <label style={S.fieldLabel}>Portfolio</label>
                    {portfolios.length > 0 ? (
                      <select className="field-select" style={S.select} value={portfolioName} onChange={e => setPortfolioName(e.target.value)}>
                        {portfolios.map(p => <option key={p.id} value={p.name} style={{ background: "#0d1117" }}>{p.name}</option>)}
                      </select>
                    ) : (
                      <input className="field-select" style={S.select} type="text" placeholder="Portfolio name…" value={portfolioName} onChange={e => setPortfolioName(e.target.value)} />
                    )}
                    <span style={{ ...S.selectedHint, visibility: "hidden" }}>placeholder</span>
                  </div>

                  <div style={S.fieldWrap}>
                    <label style={S.fieldLabel}>Stock Symbol</label>
                    <select
                      className="field-select"
                      style={{ ...S.select, opacity: portfolioSymbols.length === 0 ? 0.45 : 1, cursor: portfolioSymbols.length === 0 ? "not-allowed" : "pointer" }}
                      value={stockSymbol}
                      onChange={e => { setStockSymbol(e.target.value); setError(""); }}
                      disabled={portfolioSymbols.length === 0}
                    >
                      <option value="" disabled style={{ background: "#0d1117" }}>
                        {portfolioSymbols.length === 0 ? "— No holdings in this portfolio —" : "— Select a symbol —"}
                      </option>
                      {portfolioSymbols.map(sym => (
                        <option key={sym} value={sym} style={{ background: "#0d1117" }}>{sym}</option>
                      ))}
                    </select>
                    <span style={S.selectedHint}>
                      {stockSymbol && buyPrice !== null && buyPrice > 0
                        ? `◈ Avg. buy price: $${buyPrice.toFixed(2)}`
                        : portfolioSymbols.length > 0 ? `${portfolioSymbols.length} holding${portfolioSymbols.length !== 1 ? "s" : ""} available` : ""}
                    </span>
                  </div>

                  <button className="analyze-btn" style={{ ...S.analyzeBtn, opacity: loading ? 0.5 : 1, marginTop: "23px" }} onClick={handleAnalyze} disabled={loading}>
                    {loading ? "Analyzing…" : "⟳ Analyze"}
                  </button>
                </div>
                {error && <div style={{ ...S.errorBox, margin: "0 24px 20px" }}>⚠ {error}</div>}
              </div>
            </div>

            <div id="rec-result">
              <div style={S.sectionTitle}>Result <span style={S.sectionLine} /></div>
              {loading ? (
                <div style={S.loadingBox}>
                  <div style={{ fontSize: "24px", marginBottom: "14px", display: "inline-block", animation: "spin 1s linear infinite" }}>◌</div>
                  <div>Querying real-time market data…</div>
                </div>
              ) : !result ? (
                <div style={S.emptyBox}><div style={S.emptyIcon}>◈</div><div>No analysis yet — run a query above</div></div>
              ) : (
                <div style={S.resultCard}>
                  <div style={S.resultHeader}>
                    <div style={S.resultTitleGroup}>
                      <span style={S.symbolTag}>{result.stockSymbol}</span>
                      <span style={S.portfolioTag}>/ {result.portfolioName}</span>
                    </div>
                    <div style={{ ...S.adviceBadge, background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}>
                      <span style={S.adviceIcon}>{cfg.icon}</span><span>{cfg.label}</span>
                    </div>
                  </div>
                  <div style={S.statsGrid}>
                    <div style={S.statCell}><span style={S.statLabel}>Purchase Price</span><span style={{ ...S.statValue, color: "rgba(200,220,240,0.8)" }}>${parsed.buyPrice}</span></div>
                    <div style={S.statCell}><span style={S.statLabel}>Current Price</span><span style={{ ...S.statValue, color: "#78c8ff" }}>${parsed.currPrice}</span></div>
                    <div style={S.statCell}><span style={S.statLabel}>Change</span><span style={{ ...S.statValue, color: changeColor }}>{!isNaN(changeNum) ? (changeNum >= 0 ? "▲ +" : "▼ ") : ""}{parsed.change}%</span></div>
                  </div>
                  <div style={S.commentBox}>
                    <div style={S.commentLabel}>Detailed Analysis</div>
                    <div style={S.commentText}>{result.comment}</div>
                  </div>
                </div>
              )}
            </div>

            {history.length > 0 && (
              <div>
                <div style={S.sectionTitle}>Session History ({history.length})<span style={S.sectionLine} /></div>
                <div style={S.historyGrid}>
                  {history.map((h, i) => {
                    const hcfg    = ADVICE_CFG[h.advice] ?? ADVICE_CFG.UNKNOWN;
                    const hParsed = parseComment(h.comment);
                    const hChange = parseFloat(hParsed.change);
                    const hColor  = isNaN(hChange) ? "#8b949e" : hChange >= 0 ? "#00d47a" : "#ff6b7a";
                    return (
                      <div key={i} className="history-row" style={{ ...S.historyRow, animation: `slideIn 0.3s ease ${0.05 * i}s both` }} onClick={() => replayHistory(h)} title="Click to review">
                        <span style={S.historySymbol}>{h.stockSymbol}</span>
                        <span style={S.historyPortfolio}>{h.portfolioName}</span>
                        <span style={{ ...S.historyAdvice, background: hcfg.bg, border: `1px solid ${hcfg.border}`, color: hcfg.color }}>{hcfg.icon} {h.advice}</span>
                        <span style={{ ...S.historyChange, color: hColor }}>{!isNaN(hChange) ? (hChange >= 0 ? "+" : "") : ""}{hParsed.change}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </>
  );
}