export default function Notification({ notification }) {
  if (!notification) return null;

  const isError = notification.type === 'error';

  return (
    <div style={{
      position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 300,
      background: isError ? "#B56357" : "#E8B931",
      color: isError ? "#fff" : "#1a1a1a",
      padding: "10px 24px", borderRadius: 10,
      fontSize: 13, fontWeight: 600, animation: "notifIn 0.3s ease",
      boxShadow: isError ? "0 4px 20px rgba(181,99,87,0.3)" : "0 4px 20px rgba(232,185,49,0.3)",
    }}>{notification.msg}</div>
  );
}
