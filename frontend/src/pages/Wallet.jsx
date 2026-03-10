import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getWallet, updateWallet } from "../services/walletService.js";

const styles = {
  page: {
    width: "100vw",
    minHeight: "100vh",
    margin: 0,
    padding: 0,
    background: "linear-gradient(135deg, #0a0f1e 0%, #0d1b2a 50%, #0a1628 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    position: "relative",
    overflow: "hidden",
    transition: "opacity 0.6s ease",
  },
  gridOverlay: {
    position: "absolute",
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(0, 200, 150, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 200, 150, 0.04) 1px, transparent 1px)
    `,
    backgroundSize: "40px 40px",
    pointerEvents: "none",
  },
  glowOrb1: {
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(0, 210, 120, 0.08) 0%, transparent 70%)",
    top: "-100px",
    right: "-100px",
    pointerEvents: "none",
  },
  glowOrb2: {
    position: "absolute",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(0, 140, 255, 0.07) 0%, transparent 70%)",
    bottom: "-80px",
    left: "-80px",
    pointerEvents: "none",
  },
  card: {
    position: "relative",
    width: "100%",
    maxWidth: "440px",
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "2px",
    padding: "48px 44px 44px",
    backdropFilter: "blur(20px)",
    boxShadow: "0 32px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
    animation: "fadeIn 0.6s ease forwards",
    transition: "opacity 0.5s ease, transform 0.5s ease",
  },
  topAccent: {
    position: "absolute",
    top: 0,
    left: "10%",
    right: "10%",
    height: "2px",
    background: "linear-gradient(90deg, transparent, #00d47a, #00a8ff, transparent)",
    borderRadius: "0 0 2px 2px",
  },
  headerSection: {
    marginBottom: "32px",
    textAlign: "center",
  },
  ticker: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    marginBottom: "20px",
  },
  tickerDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#00d47a",
    boxShadow: "0 0 8px #00d47a",
    animation: "pulse 2s infinite",
  },
  tickerText: {
    fontSize: "11px",
    letterSpacing: "3px",
    color: "#00d47a",
    textTransform: "uppercase",
    fontFamily: "'Courier New', monospace",
    fontWeight: "600",
  },
  pageTitle: {
    fontSize: "28px",
    fontWeight: "normal",
    color: "#f0f4f8",
    margin: "0 0 10px",
    letterSpacing: "0.5px",
  },
  pageSubtitle: {
    fontSize: "13px",
    color: "rgba(160, 185, 210, 0.7)",
    fontFamily: "'Courier New', monospace",
    letterSpacing: "0.3px",
    lineHeight: "1.6",
  },
  balanceBox: {
    background: "rgba(0, 212, 122, 0.05)",
    border: "1px solid rgba(0, 212, 122, 0.15)",
    borderRadius: "2px",
    padding: "20px 24px",
    textAlign: "center",
    marginBottom: "28px",
  },
  balanceLabel: {
    fontSize: "10px",
    letterSpacing: "2.5px",
    color: "rgba(160, 185, 210, 0.5)",
    textTransform: "uppercase",
    fontFamily: "'Courier New', monospace",
    marginBottom: "8px",
  },
  balanceAmount: {
    fontSize: "36px",
    color: "#00d47a",
    fontFamily: "'Courier New', monospace",
    fontWeight: "600",
    letterSpacing: "1px",
    textShadow: "0 0 20px rgba(0, 212, 122, 0.3)",
  },
  divider: {
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
    margin: "24px 0",
  },
  formTitle: {
    fontSize: "13px",
    letterSpacing: "2px",
    color: "rgba(160, 185, 210, 0.5)",
    textTransform: "uppercase",
    marginBottom: "20px",
    fontFamily: "'Courier New', monospace",
  },
  fieldGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "11px",
    letterSpacing: "1.5px",
    color: "rgba(160, 185, 210, 0.6)",
    textTransform: "uppercase",
    marginBottom: "8px",
    fontFamily: "'Courier New', monospace",
  },
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "2px",
    padding: "12px 14px",
    color: "#e8f0f8",
    fontSize: "14px",
    fontFamily: "'Courier New', monospace",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, background 0.2s",
    letterSpacing: "0.5px",
  },
  btnRow: {
    display: "flex",
    gap: "12px",
    marginTop: "4px",
  },
  btnRefund: {
    flex: 1,
    padding: "13px",
    background: "linear-gradient(135deg, #00d47a 0%, #00a8c8 100%)",
    border: "none",
    borderRadius: "2px",
    color: "#0a0f1e",
    fontSize: "11px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    fontFamily: "'Courier New', monospace",
    fontWeight: "700",
    cursor: "pointer",
    transition: "opacity 0.2s, transform 0.1s",
    boxShadow: "0 4px 16px rgba(0, 212, 122, 0.2)",
  },
  btnDraw: {
    flex: 1,
    padding: "13px",
    background: "transparent",
    border: "1px solid rgba(255, 100, 100, 0.35)",
    borderRadius: "2px",
    color: "#ff8080",
    fontSize: "11px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    fontFamily: "'Courier New', monospace",
    fontWeight: "700",
    cursor: "pointer",
    transition: "opacity 0.2s, transform 0.1s, background 0.2s",
  },
  errorBox: {
    background: "rgba(255, 60, 80, 0.08)",
    border: "1px solid rgba(255, 60, 80, 0.25)",
    borderRadius: "2px",
    padding: "10px 14px",
    marginBottom: "18px",
    color: "#ff6b7a",
    fontSize: "12px",
    fontFamily: "'Courier New', monospace",
    letterSpacing: "0.3px",
  },
  successBox: {
    background: "rgba(0, 212, 122, 0.06)",
    border: "1px solid rgba(0, 212, 122, 0.2)",
    borderRadius: "2px",
    padding: "14px",
    marginBottom: "18px",
    color: "#00d47a",
    fontSize: "12px",
    fontFamily: "'Courier New', monospace",
    letterSpacing: "0.3px",
  },
  redirectMsg: {
    fontSize: "10px",
    color: "rgba(0, 212, 122, 0.55)",
    fontFamily: "'Courier New', monospace",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    marginTop: "6px",
  },
  progressBar: {
    height: "2px",
    background: "rgba(0, 212, 122, 0.12)",
    borderRadius: "2px",
    marginTop: "12px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #00d47a, #00a8ff)",
    borderRadius: "2px",
    animation: "progressFill 2.5s linear forwards",
  },
  navLinks: {
    display: "flex",
    gap: "10px",
    marginTop: "28px",
  },
  navLink: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    padding: "11px 10px",
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "2px",
    color: "rgba(160, 185, 210, 0.65)",
    fontSize: "10px",
    letterSpacing: "1.8px",
    textTransform: "uppercase",
    fontFamily: "'Courier New', monospace",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "none",
    transition: "border-color 0.2s, color 0.2s, background 0.2s",
  },
  navLinkIcon: {
    fontSize: "13px",
    lineHeight: 1,
  },
};

const keyframesStyle = `
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  html, body, #root {
    width: 100%;
    height: 100%;
    min-height: 100vh;
    overflow-x: hidden;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes progressFill {
    from { width: 0%; }
    to { width: 100%; }
  }
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input:focus {
    border-color: rgba(0, 212, 122, 0.5) !important;
    background: rgba(0, 212, 122, 0.04) !important;
  }
  button:hover:not(:disabled) {
    opacity: 0.85;
    transform: translateY(-1px);
  }
  button:active {
    transform: translateY(0);
  }
  button:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
  .nav-link:hover {
    border-color: rgba(0, 212, 122, 0.3) !important;
    color: #00d47a !important;
    background: rgba(0, 212, 122, 0.04) !important;
  }
`;

function Wallet() {
  const [balance, setBalance] = useState(null); // ✅ null au lieu de 0 pour distinguer "pas encore chargé"
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [leaving, setLeaving] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ état de chargement
  const navigate = useNavigate();

  useEffect(() => {
    getWallet()
      .then(data => {
        // ✅ Gère nombre brut ou objet { amount }
        const val = typeof data === "number" ? data : data?.amount;
        setBalance(val ?? 0);
      })
      .catch(() => setError("Unable to load wallet"))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (type) => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      setError("Please enter a valid amount");
      setSuccess("");
      return;
    }
    try {
      const newBalance = await updateWallet(type, value);
      // ✅ Gère nombre brut ou objet
      const val = typeof newBalance === "number" ? newBalance : newBalance?.amount ?? newBalance?.newBalance ?? 0;
      setBalance(val);
      setSuccess(`Transaction successful — New balance : $${parseFloat(val).toFixed(2)}`);
      setError("");
      setAmount("");

      setTimeout(() => {
        setLeaving(true);
        setTimeout(() => navigate("/portfolio"), 600);
      }, 2500);

    } catch (err) {
      setError(err.response?.data?.message || "Error during transaction");
      setSuccess("");
    }
  };

  const handleNav = (path) => {
    setLeaving(true);
    setTimeout(() => navigate(path), 500);
  };

  return (
    <>
      <style>{keyframesStyle}</style>
      <div style={{ ...styles.page, opacity: leaving ? 0 : 1 }}>
        <div style={styles.gridOverlay} />
        <div style={styles.glowOrb1} />
        <div style={styles.glowOrb2} />

        <div style={{
          ...styles.card,
          ...(leaving && { opacity: 0, transform: "translateY(-14px)" }),
        }}>
          <div style={styles.topAccent} />

          {/* Header */}
          <div style={styles.headerSection}>
            <div style={styles.ticker}>
              <div style={styles.tickerDot} />
              <span style={styles.tickerText}>Balance available</span>
            </div>
            <h1 style={styles.pageTitle}>My Wallet</h1>
            <p style={styles.pageSubtitle}>
              Manage your deposits and withdrawals<br />
             safely
            </p>
          </div>

          {/* Balance — ✅ protégé contre null/undefined */}
          <div style={styles.balanceBox}>
            <div style={styles.balanceLabel}>Current balance</div>
            <div style={styles.balanceAmount}>
              {loading
                ? "—"
                : `$${(balance ?? 0).toFixed(2)}`
              }
            </div>
          </div>

          <div style={styles.divider} />

          <p style={styles.formTitle}>New transaction</p>

          {error && <div style={styles.errorBox}>⚠ {error}</div>}

          {success && (
            <div style={styles.successBox}>
              <div>✓ {success}</div>
              <div style={styles.redirectMsg}>↗ Redirecting to the Portfolios…</div>
              <div style={styles.progressBar}>
                <div style={styles.progressFill} />
              </div>
            </div>
          )}

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Amount (USD)</label>
            <input
              style={styles.input}
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
              disabled={!!success}
            />
          </div>

          <div style={styles.btnRow}>
            <button
              style={styles.btnRefund}
              onClick={() => handleUpdate("REFUND")}
              disabled={!!success || loading}
            >
              + Deposit
            </button>
            <button
              style={styles.btnDraw}
              onClick={() => handleUpdate("DROP")}
              disabled={!!success || loading}
            >
              − Withdraw
            </button>
          </div>

          {/* Navigation */}
          <div style={styles.divider} />
          <div style={styles.navLinks}>
            <a
              className="nav-link"
              style={styles.navLink}
              onClick={() => handleNav("/portfolio")}
            >
              <span style={styles.navLinkIcon}>◈</span>
              Portfolio
            </a>
            <a
              className="nav-link"
              style={styles.navLink}
              onClick={() => handleNav("/transaction")}
            >
              <span style={styles.navLinkIcon}>≡</span>
              Transactions
            </a>
          </div>

        </div>
      </div>
    </>
  );
}

export default Wallet;