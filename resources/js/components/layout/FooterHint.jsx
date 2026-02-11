export default function FooterHint() {
  return (
    <div style={{
      position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)",
      color: "#444", fontSize: 11, textAlign: "center",
      animation: "fadeSlideIn 1s ease 0.5s both",
    }}>
      ← Abre el panel lateral para ver más cultos o iniciar sesión
    </div>
  );
}
