export default function FooterHint() {
  return (
    <div style={{
      position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)",
      color: "rgba(255,255,255,0.2)", fontSize: 11, textAlign: "center",
      animation: "fadeUp 1s ease 0.5s both",
      fontFamily: "'Outfit', sans-serif",
    }}>
      Abre el panel lateral para ver mas cultos o iniciar sesion
    </div>
  );
}
