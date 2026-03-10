import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout as logoutService } from "../services/authService";
import { getAccessToken } from "../utils/tokenStorage";

const styles = {
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    width: "100%",
    background: "rgba(10, 15, 30, 0.92)",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    backdropFilter: "blur(20px)",
    fontFamily: "'Courier New', monospace",
  },
  topLine: {
    height: "2px",
    background: "linear-gradient(90deg, transparent 0%, #00d47a 30%, #00a8ff 70%, transparent 100%)",
  },
  inner: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 24px",
    height: "56px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    flexShrink: 0,
  },
  brandDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#00d47a",
    boxShadow: "0 0 10px #00d47a",
    animation: "navPulse 2s infinite",
  },
  brandText: {
    fontSize: "13px",
    letterSpacing: "2.5px",
    color: "#e8f0f8",
    textTransform: "uppercase",
    fontWeight: "700",
  },
  brandAccent: {
    color: "#00d47a",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    flex: 1,
    justifyContent: "center",
  },
  link: {
    padding: "6px 14px",
    borderRadius: "2px",
    fontSize: "11px",
    letterSpacing: "1.8px",
    textTransform: "uppercase",
    textDecoration: "none",
    color: "rgba(160, 185, 210, 0.65)",
    border: "1px solid transparent",
    transition: "color 0.2s, border-color 0.2s, background 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  linkActive: {
    color: "#00d47a",
    borderColor: "rgba(0, 212, 122, 0.25)",
    background: "rgba(0, 212, 122, 0.06)",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexShrink: 0,
  },
  loginBtn: {
    padding: "7px 18px",
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
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    boxShadow: "0 2px 12px rgba(0, 212, 122, 0.2)",
    transition: "opacity 0.2s, transform 0.15s",
  },
  logoutBtn: {
    padding: "7px 16px",
    background: "transparent",
    border: "1px solid rgba(255, 80, 80, 0.3)",
    borderRadius: "2px",
    color: "rgba(255, 110, 110, 0.75)",
    fontSize: "11px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    fontFamily: "'Courier New', monospace",
    fontWeight: "600",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    transition: "all 0.2s",
  },
  mobileToggle: {
    background: "none",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "2px",
    padding: "6px 10px",
    color: "rgba(160, 185, 210, 0.7)",
    cursor: "pointer",
    fontSize: "16px",
    display: "none",
    fontFamily: "'Courier New', monospace",
  },
};

const keyframes = `
  @keyframes navPulse {
    0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 10px #00d47a; }
    50% { opacity: 0.5; transform: scale(0.75); box-shadow: 0 0 4px #00d47a; }
  }
  .nav-link:hover {
    color: #e8f0f8 !important;
    border-color: rgba(255,255,255,0.12) !important;
    background: rgba(255,255,255,0.04) !important;
  }
  .logout-btn:hover {
    background: rgba(255, 80, 80, 0.08) !important;
    border-color: rgba(255, 80, 80, 0.5) !important;
    color: #ff6b7a !important;
  }
  .login-btn:hover {
    opacity: 0.85;
    transform: translateY(-1px);
  }
  @media (max-width: 680px) {
    .nav-links-desktop { display: none !important; }
    .mobile-toggle { display: flex !important; }
  }
`;

const icons = {
  portfolio: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="1"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
    </svg>
  ),
  wallet: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/>
      <circle cx="17" cy="16" r="1" fill="currentColor"/>
    </svg>
  ),
  transaction: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
      <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
    </svg>
  ),
  // ✅ Icône recommandations
  recommendation: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  login: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
    </svg>
  ),
  logout: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
};

// ✅ Recommandations ajouté
const NAV_LINKS = [
  { to: "/portfolio",       label: "Portfolio",       icon: icons.portfolio       },
  { to: "/wallet",          label: "Wallet",          icon: icons.wallet          },
  { to: "/transaction",     label: "Transaction",     icon: icons.transaction     },
  { to: "/recommendations", label: "Recommandations", icon: icons.recommendation  },
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(!!getAccessToken());

  const handleLogout = () => {
    logoutService();
    setLoggedIn(false);
    navigate("/");
  };

  return (
    <>
      <style>{keyframes}</style>
      <nav style={styles.nav}>
        <div style={styles.topLine} />
        <div style={styles.inner}>

          {/* ── Brand ── */}
          <Link to="/" style={styles.brand}>
            <div style={styles.brandDot} />
            <span style={styles.brandText}>
              Stock<span style={styles.brandAccent}>Port</span>
            </span>
          </Link>

          {/* ── Nav links (desktop) ── */}
          <div className="nav-links-desktop" style={styles.links}>
            {NAV_LINKS.map(({ to, label, icon }) => {
              const active = location.pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className="nav-link"
                  style={{ ...styles.link, ...(active ? styles.linkActive : {}) }}
                >
                  {icon}
                  {label}
                </Link>
              );
            })}
          </div>

          {/* ── Right actions ── */}
          <div style={styles.right}>
            {loggedIn ? (
              <button
                className="logout-btn"
                style={styles.logoutBtn}
                onClick={handleLogout}
              >
                {icons.logout}
                Logout
              </button>
            ) : (
              <Link to="/login" className="login-btn" style={styles.loginBtn}>
                {icons.login}
                Login
              </Link>
            )}

            <button
              className="mobile-toggle"
              style={styles.mobileToggle}
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Menu"
            >
              {mobileOpen ? "✕" : "≡"}
            </button>
          </div>

        </div>

        {/* ── Mobile dropdown ── */}
        {mobileOpen && (
          <div style={{
            background: "rgba(10,15,30,0.98)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "12px 24px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}>
            {NAV_LINKS.map(({ to, label, icon }) => {
              const active = location.pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className="nav-link"
                  style={{ ...styles.link, ...(active ? styles.linkActive : {}), justifyContent: "flex-start" }}
                  onClick={() => setMobileOpen(false)}
                >
                  {icon}
                  {label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;