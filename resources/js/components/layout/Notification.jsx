export default function Notification({ notification }) {
  if (!notification) return null;

  const isError = notification.type === 'error';

  return (
    <div style={{
      position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 300,
      background: isError ? "rgba(239,68,68,0.9)" : "rgba(255,255,255,0.12)",
      backdropFilter: "blur(20px)",
      color: isError ? "#fff" : "#fff",
      padding: "10px 24px", borderRadius: 50,
      fontSize: 13, fontWeight: 600, animation: "notifIn 0.3s ease",
      boxShadow: isError ? "0 4px 20px rgba(239,68,68,0.3)" : "0 4px 20px rgba(0,0,0,0.3)",
      border: isError ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.1)",
      fontFamily: "'Outfit', sans-serif",
    }}>{notification.msg}</div>
  );
}
