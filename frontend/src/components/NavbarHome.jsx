import { Link } from "react-router-dom";

const styles = {
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    background: "rgba(8, 13, 24, 0.7)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    backdropFilter: "blur(24px)",
    fontFamily: "'Courier New', monospace",
  },
  topLine: {
    height: "2px",
    background: "linear-gradient(90deg, transparent 0%, #00d47a 30%, #00a8ff 70%, transparent 100%)",
  },
  inner: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 32px",
    height: "58px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
  },
  brandDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#00d47a",
    boxShadow: "0 0 12px #00d47a",
    animation: "navPulse 2s infinite",
  },
  brandText: {
    fontSize: "13px",
    letterSpacing: "3px",
    color: "#e8f0f8",
    textTransform: "uppercase",
    fontWeight: "700",
  },
  brandAccent: { color: "#00d47a" },
  loginBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "9px 22px",
    background: "linear-gradient(135deg, #00d47a 0%, #00a8c8 100%)",
    border: "none",
    borderRadius: "2px",
    color: "#0a0f1e",
    fontSize: "11px",
    letterSpacing: "2.5px",
    textTransform: "uppercase",
    fontFamily: "'Courier New', monospace",
    fontWeight: "700",
    textDecoration: "none",
    boxShadow: "0 2px 16px rgba(0,212,122,0.25)",
    transition: "opacity 0.2s, transform 0.15s, box-shadow 0.2s",
  },
};

const css = `
  @keyframes navPulse {
    0%,100% { opacity:1; transform:scale(1); box-shadow:0 0 12px #00d47a; }
    50%      { opacity:0.4; transform:scale(0.7); box-shadow:0 0 4px #00d47a; }
  }
  .home-login-btn:hover {
    opacity: 0.85 !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 6px 24px rgba(0,212,122,0.35) !important;
  }
`;

const ArrowIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
    <polyline points="10 17 15 12 10 7"/>
    <line x1="15" y1="12" x2="3" y2="12"/>
  </svg>
);

function NavbarHome() {
  return (
    <>
      <style>{css}</style>
      <nav style={styles.nav}>
        <div style={styles.topLine} />
        <div style={styles.inner}>
          <Link to="/" style={styles.brand}>
            <div style={styles.brandDot} />
            <span style={styles.brandText}>
              Stock<span style={styles.brandAccent}>Port</span>
            </span>
          </Link>
          <Link to="/login" className="home-login-btn" style={styles.loginBtn}>
            <ArrowIcon />
            Login
          </Link>
        </div>
      </nav>
    </>
  );
}

export default NavbarHome;