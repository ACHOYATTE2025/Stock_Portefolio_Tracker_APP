import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login as loginService } from "../services/authService";


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
  welcomeSection: {
    marginBottom: "36px",
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
  welcomeTitle: {
    fontSize: "28px",
    fontWeight: "normal",
    color: "#f0f4f8",
    margin: "0 0 10px",
    letterSpacing: "0.5px",
    lineHeight: "1.2",
  },
  welcomeSubtitle: {
    fontSize: "13px",
    color: "rgba(160, 185, 210, 0.7)",
    margin: 0,
    letterSpacing: "0.3px",
    lineHeight: "1.6",
    fontFamily: "'Courier New', monospace",
  },
  divider: {
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
    margin: "28px 0",
  },
  formTitle: {
    fontSize: "13px",
    letterSpacing: "2px",
    color: "rgba(160, 185, 210, 0.5)",
    textTransform: "uppercase",
    marginBottom: "24px",
    fontFamily: "'Courier New', monospace",
  },
  fieldGroup: {
    marginBottom: "18px",
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
  submitBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #00d47a 0%, #00a8c8 100%)",
    border: "none",
    borderRadius: "2px",
    color: "#0a0f1e",
    fontSize: "12px",
    letterSpacing: "2.5px",
    textTransform: "uppercase",
    fontFamily: "'Courier New', monospace",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "8px",
    transition: "opacity 0.2s, transform 0.1s",
    boxShadow: "0 4px 20px rgba(0, 212, 122, 0.25)",
  },
  footer: {
    marginTop: "28px",
    textAlign: "center",
    fontSize: "12px",
    color: "rgba(160, 185, 210, 0.5)",
    fontFamily: "'Courier New', monospace",
  },
  registerLink: {
    color: "#00d47a",
    textDecoration: "none",
    letterSpacing: "0.3px",
    borderBottom: "1px solid rgba(0, 212, 122, 0.3)",
    paddingBottom: "1px",
  },
  statsRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "32px",
    paddingTop: "20px",
    borderTop: "1px solid rgba(255,255,255,0.05)",
  },
  statItem: {
    textAlign: "center",
    flex: 1,
  },
  statValue: {
    fontSize: "14px",
    color: "#00d47a",
    fontFamily: "'Courier New', monospace",
    fontWeight: "600",
    letterSpacing: "0.5px",
  },
  statLabel: {
    fontSize: "9px",
    color: "rgba(160, 185, 210, 0.4)",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    fontFamily: "'Courier New', monospace",
    marginTop: "3px",
  },
  statDivider: {
    width: "1px",
    background: "rgba(255,255,255,0.06)",
    alignSelf: "stretch",
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
  input:focus {
    border-color: rgba(0, 212, 122, 0.5) !important;
    background: rgba(0, 212, 122, 0.04) !important;
  }
  button:hover {
    opacity: 0.88;
    transform: translateY(-1px);
  }
  button:active {
    transform: translateY(0);
  }
`;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginService(email, password);
      navigate("/portfolio");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Credentials");
    }
  };

  return (
    <>
      
      <style>{keyframesStyle}</style>
      <div style={styles.page}>
        <div style={styles.gridOverlay} />
        <div style={styles.glowOrb1} />
        <div style={styles.glowOrb2} />

        <div style={{ ...styles.card, animation: "fadeIn 0.6s ease forwards" }}>
          <div style={styles.topAccent} />

          {/* Welcome Section */}
          <div style={styles.welcomeSection}>
            <div style={styles.ticker}>
              <div style={styles.tickerDot} />
              <span style={styles.tickerText}>Market Open</span>
            </div>

            <h1 style={styles.welcomeTitle}>
              Stock Portfolio
            </h1>
            <p style={styles.welcomeSubtitle}>
              Monitor, analyze, and optimize<br />
              Realtime Investments
            </p>
          </div>

          <div style={styles.divider} />

          {/* Login Form */}
          <p style={styles.formTitle}>Connexion</p>

          {error && <div style={styles.errorBox}>⚠ {error}</div>}

          <form onSubmit={handleLogin}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}> e-mail</label>
              <input
                style={styles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                required
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button style={styles.submitBtn} type="submit">
               Portfolio Access→
            </button>
          </form>

          <div style={styles.footer}>
            No account yet ?{" "}
            <Link to="/register" style={styles.registerLink}>
              Create account
            </Link>
          </div>

          {/* Mini stats bar */}
          <div style={styles.statsRow}>
            <div style={styles.statItem}>
              <div style={styles.statValue}>S&amp;P</div>
              <div style={styles.statLabel}>+0.84%</div>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <div style={styles.statValue}>NASDAQ</div>
              <div style={styles.statLabel}>+1.12%</div>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <div style={styles.statValue}>CAC 40</div>
              <div style={styles.statLabel}>−0.23%</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;