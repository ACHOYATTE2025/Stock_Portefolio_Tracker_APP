function Footer() {
  return (
    <footer style={{
      position: "relative",
      zIndex: 1,
      borderTop: "1px solid rgba(255,255,255,0.06)",
      padding: "28px 40px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "10px",
      background: "rgba(10, 15, 30, 0.6)",
      fontFamily: "'Courier New', monospace",
    }}>

      {/* Ligne principale */}
      <span style={{
        fontSize: "11px",
        color: "rgba(160,185,210,0.45)",
        letterSpacing: "1.5px",
        textTransform: "uppercase",
      }}>
        © 2026 Stock<span style={{ color: "#00d47a" }}>Port</span> — Portfolio management platform
      </span>

      {/* Auteur + email */}
      <span style={{
        fontSize: "10px",
        color: "rgba(160,185,210,0.3)",
        letterSpacing: "1px",
      }}>
        Auteur&nbsp;:&nbsp;
        <span style={{ color: "rgba(0, 212, 122, 0.5)" }}>ACHO YATTE DEIVY CONSTANT</span>
        &nbsp;·&nbsp;
        <a
          href="mailto:acho.quebec@gmail.com"
          style={{
            color: "rgba(0, 168, 255, 0.5)",
            textDecoration: "none",
            letterSpacing: "0.5px",
            transition: "color 0.2s",
          }}
          onMouseEnter={e => e.target.style.color = "rgba(0,168,255,0.85)"}
          onMouseLeave={e => e.target.style.color = "rgba(0,168,255,0.5)"}
        >
          acho.quebec@gmail.com
        </a>
      </span>

      {/* Disclaimer */}
      <span style={{
        fontSize: "9px",
        color: "rgba(160,185,210,0.2)",
        letterSpacing: "0.8px",
        textAlign: "center",
        maxWidth: "600px",
        lineHeight: "1.6",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        paddingTop: "10px",
        marginTop: "2px",
      }}>
       ⚠️ DEMO APPLICATION ONLY — NOT INVESTMENT ADVICE.
        The data displayed is fictitious and provided for educational purposes only.
      </span>

    </footer>
  );
}

export default Footer;