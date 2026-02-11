import { useAuth } from '../../hooks/useAuth';

export default function Header({ onOpenSidebar }) {
  const { isLoggedIn, user } = useAuth();

  return (
    <header style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)",
      background: "rgba(17,17,17,0.95)", backdropFilter: "blur(10px)",
      position: "sticky", top: 0, zIndex: 50,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={onOpenSidebar} style={{
          background: "none", border: "none", color: "#e0e0e0", fontSize: 20, cursor: "pointer",
          display: "flex", flexDirection: "column", gap: 4, padding: 4,
        }}>
          <div style={{ width: 20, height: 2, background: "#e0e0e0", borderRadius: 1 }} />
          <div style={{ width: 15, height: 2, background: "#e0e0e0", borderRadius: 1 }} />
          <div style={{ width: 20, height: 2, background: "#e0e0e0", borderRadius: 1 }} />
        </button>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#E8B931" }}>
          ♪ Programa de Culto
        </span>
      </div>
      {isLoggedIn && (
        <div style={{
          width: 30, height: 30, borderRadius: "50%",
          background: "linear-gradient(135deg, #E8B931, #B56357)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 12, fontWeight: 700,
        }}>{user?.name?.[0] || 'A'}</div>
      )}
    </header>
  );
}
