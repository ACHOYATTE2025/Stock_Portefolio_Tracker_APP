import { Link } from "react-router-dom";
import NavbarHome from "../components/NavbarHome";

// ── Ticker data ────────────────────────────────────────────────────
const TICKERS = [
  { symbol: "AAPL",  price: "188.40", change: "+1.24%",  up: true  },
  { symbol: "TSLA",  price: "241.10", change: "+3.07%",  up: true  },
  { symbol: "NVDA",  price: "870.00", change: "+2.54%",  up: true  },
  { symbol: "MSFT",  price: "412.50", change: "-0.38%",  up: false },
  { symbol: "AMZN",  price: "183.20", change: "+0.91%",  up: true  },
  { symbol: "GOOGL", price: "154.80", change: "-0.12%",  up: false },
  { symbol: "META",  price: "502.30", change: "+1.76%",  up: true  },
  { symbol: "S&P",   price: "5,218",  change: "+0.84%",  up: true  },
  { symbol: "NASDAQ",price: "16,420", change: "+1.12%",  up: true  },
  { symbol: "CAC40", price: "8,024",  change: "-0.23%",  up: false },
];

// ── Features ───────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: "◈",
    title: "Real-time portfolio",
    desc: "Track your positions, P&L and asset allocation with continuously updated data.",
    color: "#00d47a",
  },
  {
    icon: "◎",
    title: "Integrated wallet",
    desc: "Manage your available capital, deposit and withdraw funds directly from the interface.",
    color: "#00a8ff",
  },
  {
    icon: "⟁",
    title: "Fast transactions",
    desc: "Place your buy and sell orders in seconds with a complete history.",
    color: "#a78bfa",
  },
  {
    icon: "▲",
    title: "Performance analysis",
    desc: "Visualize your gains, losses and trends to optimize your investment decisions",
    color: "#f59e0b",
  },
];

// ── Stats ──────────────────────────────────────────────────────────
const STATS = [
  { value: "12,400+", label: "Active investors" },
  { value: "$2.4B",   label: "Volume processed" },
  { value: "99.9%",   label: "Availability" },
  { value: "0.01s",   label: "Average latency" },
];

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { width: 100%; min-height: 100vh; overflow-x: hidden; }

  @keyframes pulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:0.4; transform:scale(0.7); }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(24px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes tickerScroll {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes lineGrow {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
  @keyframes float {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-10px); }
  }
  @keyframes glowPulse {
    0%,100% { opacity: 0.5; }
    50%      { opacity: 1; }
  }
  @keyframes countUp {
    from { opacity:0; transform:translateY(8px); }
    to   { opacity:1; transform:translateY(0); }
  }

  .hero-cta:hover {
    opacity: 0.88 !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 10px 36px rgba(0,212,122,0.4) !important;
  }
  .hero-cta-ghost:hover {
    background: rgba(255,255,255,0.05) !important;
    border-color: rgba(255,255,255,0.2) !important;
    color: #e8f0f8 !important;
  }
  .feature-card:hover {
    border-color: rgba(255,255,255,0.12) !important;
    background: rgba(255,255,255,0.04) !important;
    transform: translateY(-3px);
  }
  .feature-card {
    transition: border-color 0.2s, background 0.2s, transform 0.2s !important;
  }
`;

// ── Mini candlestick SVG décoratif ─────────────────────────────────
function CandleChart() {
  const candles = [
    { x: 20,  open: 80, close: 60, high: 50, low: 90,  up: false },
    { x: 44,  open: 65, close: 45, high: 35, low: 75,  up: true  },
    { x: 68,  open: 50, close: 30, high: 20, low: 60,  up: true  },
    { x: 92,  open: 35, close: 55, high: 25, low: 65,  up: false },
    { x: 116, open: 50, close: 25, high: 15, low: 60,  up: true  },
    { x: 140, open: 30, close: 10, high: 5,  low: 40,  up: true  },
    { x: 164, open: 15, close: 35, high: 5,  low: 45,  up: false },
    { x: 188, open: 30, close: 20, high: 10, low: 40,  up: true  },
  ];
  return (
    <svg width="220" height="100" viewBox="0 0 220 100" style={{ opacity: 0.35 }}>
      {candles.map((c, i) => (
        <g key={i}>
          <line x1={c.x} y1={c.high} x2={c.x} y2={c.low}
            stroke={c.up ? "#00d47a" : "#ff6b7a"} strokeWidth="1" />
          <rect
            x={c.x - 7} y={Math.min(c.open, c.close)}
            width="14" height={Math.abs(c.open - c.close) || 2}
            fill={c.up ? "#00d47a" : "#ff6b7a"}
            opacity="0.8"
          />
        </g>
      ))}
      <polyline
        points="20,70 44,52 68,38 92,48 116,28 140,14 164,22 188,18"
        fill="none" stroke="#00a8ff" strokeWidth="1.5"
        strokeDasharray="4 2" opacity="0.5"
      />
    </svg>
  );
}

function Home() {
  const tickerDouble = [...TICKERS, ...TICKERS];

  return (
    <>
      <style>{CSS}</style>
      <div style={{
        width: "100vw",
        minHeight: "100vh",
        background: "linear-gradient(160deg, #070c1a 0%, #0a1020 40%, #080d18 100%)",
        color: "#e8f0f8",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        overflowX: "hidden",
        position: "relative",
      }}>

        {/* ── Background grid ── */}
        <div style={{
          position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
          backgroundImage: `
            linear-gradient(rgba(0,200,150,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,200,150,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }} />

        {/* ── Glow orbs ── */}
        <div style={{
          position: "fixed", width: "700px", height: "700px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,212,122,0.07) 0%, transparent 65%)",
          top: "-200px", right: "-200px", pointerEvents: "none", zIndex: 0,
          animation: "glowPulse 4s ease-in-out infinite",
        }} />
        <div style={{
          position: "fixed", width: "500px", height: "500px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,140,255,0.06) 0%, transparent 65%)",
          bottom: "-150px", left: "-150px", pointerEvents: "none", zIndex: 0,
        }} />
        <div style={{
          position: "fixed", width: "300px", height: "300px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(167,139,250,0.04) 0%, transparent 65%)",
          top: "40%", left: "30%", pointerEvents: "none", zIndex: 0,
        }} />

        {/* ── Navbar ── */}
        <NavbarHome />

        {/* ── Ticker band ── */}
        <div style={{
          position: "relative", zIndex: 2,
          marginTop: "60px",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          background: "rgba(0,0,0,0.25)",
          overflow: "hidden",
          padding: "10px 0",
        }}>
          <div style={{
            display: "flex",
            gap: "0",
            animation: "tickerScroll 30s linear infinite",
            width: "max-content",
          }}>
            {tickerDouble.map((t, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "0 28px",
                borderRight: "1px solid rgba(255,255,255,0.04)",
                flexShrink: 0,
              }}>
                <span style={{
                  fontSize: "11px", letterSpacing: "1.5px",
                  color: "#f0f4f8", fontFamily: "'Courier New', monospace",
                  fontWeight: "700",
                }}>{t.symbol}</span>
                <span style={{
                  fontSize: "11px", fontFamily: "'Courier New', monospace",
                  color: "rgba(160,185,210,0.6)",
                }}>{t.price}</span>
                <span style={{
                  fontSize: "10px", fontFamily: "'Courier New', monospace",
                  color: t.up ? "#00d47a" : "#ff6b7a",
                  fontWeight: "600",
                }}>{t.change}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── HERO ── */}
        <section style={{
          position: "relative", zIndex: 1,
          maxWidth: "1200px", margin: "0 auto",
          padding: "100px 40px 80px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "60px",
          alignItems: "center",
        }}>
          {/* Left */}
          <div style={{ animation: "fadeUp 0.7s ease 0.1s both" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(0,212,122,0.07)",
              border: "1px solid rgba(0,212,122,0.2)",
              borderRadius: "2px", padding: "6px 14px",
              marginBottom: "28px",
            }}>
              <div style={{
                width: "6px", height: "6px", borderRadius: "50%",
                background: "#00d47a", boxShadow: "0 0 8px #00d47a",
                animation: "pulse 2s infinite",
              }} />
              <span style={{
                fontSize: "10px", letterSpacing: "2.5px", color: "#00d47a",
                textTransform: "uppercase", fontFamily: "'Courier New', monospace",
                fontWeight: "700",
              }}>Opened market</span>
            </div>

            <h1 style={{
              fontSize: "clamp(36px, 5vw, 58px)",
              fontWeight: "normal",
              color: "#f0f4f8",
              lineHeight: "1.15",
              letterSpacing: "-0.5px",
              marginBottom: "24px",
            }}>
              Invest with{" "}
              <span style={{
                background: "linear-gradient(135deg, #00d47a, #00a8ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>precision</span>
              <br />& confidence
            </h1>

            <p style={{
              fontSize: "15px",
              color: "rgba(160,185,210,0.7)",
              lineHeight: "1.8",
              fontFamily: "'Courier New', monospace",
              marginBottom: "40px",
              maxWidth: "480px",
              letterSpacing: "0.2px",
            }}>
              Track, analyze, and optimize your investments in real time.
              A trading terminal designed for discerning investors.
            </p>

            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <Link to="/login" className="hero-cta" style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "14px 32px",
                background: "linear-gradient(135deg, #00d47a 0%, #00a8c8 100%)",
                border: "none", borderRadius: "2px",
                color: "#0a0f1e", fontSize: "12px",
                letterSpacing: "2.5px", textTransform: "uppercase",
                fontFamily: "'Courier New', monospace", fontWeight: "700",
                textDecoration: "none",
                boxShadow: "0 4px 24px rgba(0,212,122,0.3)",
                transition: "all 0.2s",
              }}>
                Start →
              </Link>
              <Link to="/login" className="hero-cta-ghost" style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "14px 28px",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "2px", color: "rgba(160,185,210,0.7)",
                fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase",
                fontFamily: "'Courier New', monospace", fontWeight: "600",
                textDecoration: "none",
                transition: "all 0.2s",
              }}>
                Log in
              </Link>
            </div>
          </div>

          {/* Right — terminal décoratif */}
          <div style={{
            animation: "fadeUp 0.7s ease 0.3s both",
            display: "flex", justifyContent: "center",
          }}>
            <div style={{
              width: "100%", maxWidth: "460px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "4px",
              overflow: "hidden",
              boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
              animation: "float 6s ease-in-out infinite",
            }}>
              {/* Terminal header */}
              <div style={{
                padding: "12px 18px",
                background: "rgba(255,255,255,0.03)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", gap: "8px",
              }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(255,95,87,0.7)" }} />
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(255,189,46,0.7)" }} />
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(39,201,63,0.7)" }} />
                <span style={{
                  marginLeft: "8px", fontSize: "10px", letterSpacing: "2px",
                  color: "rgba(160,185,210,0.3)", fontFamily: "'Courier New', monospace",
                  textTransform: "uppercase",
                }}>portfolio.terminal</span>
              </div>

              {/* Terminal body */}
              <div style={{ padding: "20px 22px" }}>
                {/* Chart */}
                <div style={{
                  background: "rgba(0,0,0,0.2)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  borderRadius: "2px", padding: "16px",
                  marginBottom: "16px",
                  display: "flex", justifyContent: "center",
                }}>
                  <CandleChart />
                </div>

                {/* Rows */}
                {[
                  { symbol: "AAPL",  val: "$188.40", chg: "+1.24%", up: true  },
                  { symbol: "NVDA",  val: "$870.00", chg: "+2.54%", up: true  },
                  { symbol: "MSFT",  val: "$412.50", chg: "-0.38%", up: false },
                ].map((row, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "9px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}>
                    <span style={{
                      fontSize: "12px", fontFamily: "'Courier New', monospace",
                      color: "#f0f4f8", fontWeight: "700", letterSpacing: "1px",
                    }}>{row.symbol}</span>
                    <span style={{
                      fontSize: "12px", fontFamily: "'Courier New', monospace",
                      color: "rgba(160,185,210,0.6)",
                    }}>{row.val}</span>
                    <span style={{
                      fontSize: "11px", fontFamily: "'Courier New', monospace",
                      color: row.up ? "#00d47a" : "#ff6b7a",
                      fontWeight: "600",
                    }}>{row.chg}</span>
                    <div style={{
                      width: "50px", height: "2px",
                      background: row.up
                        ? "linear-gradient(90deg, transparent, #00d47a)"
                        : "linear-gradient(90deg, transparent, #ff6b7a)",
                      borderRadius: "1px",
                    }} />
                  </div>
                ))}

                {/* Wallet badge */}
                <div style={{
                  marginTop: "14px", padding: "12px 16px",
                  background: "rgba(0,212,122,0.05)",
                  border: "1px solid rgba(0,212,122,0.15)",
                  borderRadius: "2px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <span style={{ fontSize: "10px", letterSpacing: "2px", color: "rgba(160,185,210,0.4)", fontFamily: "monospace", textTransform: "uppercase" }}>Wallet</span>
                  <span style={{ fontSize: "18px", color: "#00d47a", fontFamily: "'Courier New', monospace", fontWeight: "700", textShadow: "0 0 14px rgba(0,212,122,0.3)" }}>$12,450.00</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats band ── */}
        <div style={{
          position: "relative", zIndex: 1,
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(0,0,0,0.2)",
          padding: "36px 0",
          animation: "fadeUp 0.7s ease 0.4s both",
        }}>
          <div style={{
            maxWidth: "1200px", margin: "0 auto", padding: "0 40px",
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0",
          }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                textAlign: "center",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none",
                padding: "0 20px",
                animation: `countUp 0.5s ease ${0.5 + i * 0.1}s both`,
              }}>
                <div style={{
                  fontSize: "28px", fontFamily: "'Courier New', monospace",
                  color: "#00d47a", fontWeight: "700", letterSpacing: "1px",
                  textShadow: "0 0 20px rgba(0,212,122,0.3)",
                  marginBottom: "6px",
                }}>{s.value}</div>
                <div style={{
                  fontSize: "10px", letterSpacing: "2px", color: "rgba(160,185,210,0.35)",
                  textTransform: "uppercase", fontFamily: "'Courier New', monospace",
                }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Features ── */}
        <section style={{
          position: "relative", zIndex: 1,
          maxWidth: "1200px", margin: "0 auto",
          padding: "80px 40px",
          animation: "fadeUp 0.7s ease 0.5s both",
        }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{
              fontSize: "10px", letterSpacing: "3.5px", color: "#00d47a",
              textTransform: "uppercase", fontFamily: "'Courier New', monospace",
              marginBottom: "16px",
            }}>features</p>
            <h2 style={{
              fontSize: "clamp(24px, 3vw, 36px)", fontWeight: "normal",
              color: "#f0f4f8", letterSpacing: "0.3px",
            }}>
              Everything you need to invest
            </h2>
          </div>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px",
          }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card" style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "2px", padding: "28px 24px",
                animation: `fadeUp 0.5s ease ${0.6 + i * 0.1}s both`,
              }}>
                <div style={{
                  fontSize: "22px", color: f.color,
                  marginBottom: "16px",
                  textShadow: `0 0 16px ${f.color}55`,
                }}>{f.icon}</div>
                <h3 style={{
                  fontSize: "13px", fontWeight: "600", color: "#f0f4f8",
                  letterSpacing: "0.5px", marginBottom: "10px",
                  fontFamily: "'Courier New', monospace",
                }}>{f.title}</h3>
                <p style={{
                  fontSize: "12px", color: "rgba(160,185,210,0.55)",
                  lineHeight: "1.7", fontFamily: "'Courier New', monospace",
                  letterSpacing: "0.2px",
                }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA final ── */}
        <section style={{
          position: "relative", zIndex: 1,
          maxWidth: "700px", margin: "0 auto",
          padding: "60px 40px 100px",
          textAlign: "center",
          animation: "fadeUp 0.7s ease 0.7s both",
        }}>
          <div style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "2px", padding: "52px 48px",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, left: "15%", right: "15%", height: "2px",
              background: "linear-gradient(90deg, transparent, #00d47a, #00a8ff, transparent)",
            }} />
            <p style={{
              fontSize: "10px", letterSpacing: "3px", color: "#00d47a",
              textTransform: "uppercase", fontFamily: "'Courier New', monospace",
              marginBottom: "18px",
            }}>Ready to Start?</p>
            <h2 style={{
              fontSize: "28px", fontWeight: "normal", color: "#f0f4f8",
              marginBottom: "16px", letterSpacing: "0.3px",
            }}>
              Join thousands of investors
            </h2>
            <p style={{
              fontSize: "13px", color: "rgba(160,185,210,0.55)",
              fontFamily: "'Courier New', monospace", lineHeight: "1.7",
              marginBottom: "36px",
            }}>
            Create your free account and get started<br />
            to track your investments starting today.
            </p>
            <Link to="/login" className="hero-cta" style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              padding: "15px 40px",
              background: "linear-gradient(135deg, #00d47a 0%, #00a8c8 100%)",
              border: "none", borderRadius: "2px",
              color: "#0a0f1e", fontSize: "12px",
              letterSpacing: "2.5px", textTransform: "uppercase",
              fontFamily: "'Courier New', monospace", fontWeight: "700",
              textDecoration: "none",
              boxShadow: "0 4px 24px rgba(0,212,122,0.3)",
              transition: "all 0.2s",
            }}>
            Access the Portfolio →
            </Link>
          </div>
        </section>

       
      </div>
    </>
  );
}

export default Home;