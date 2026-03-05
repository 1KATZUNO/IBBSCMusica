import { useAuth } from '../../hooks/useAuth';

export default function Header({ onOpenSidebar }) {
  const { isLoggedIn, user } = useAuth();

  return (
    <header style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "16px 20px",
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(10,10,11,0.85)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.04)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={onOpenSidebar} style={{
          background: "rgba(255,255,255,0.06)", border: "none",
          width: 36, height: 36, borderRadius: 10, cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3.5,
        }}>
          <div style={{ width: 16, height: 1.5, background: "#aaa", borderRadius: 2 }} />
          <div style={{ width: 12, height: 1.5, background: "#aaa", borderRadius: 2 }} />
          <div style={{ width: 16, height: 1.5, background: "#aaa", borderRadius: 2 }} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/logo.svg" alt="IBBSC" style={{ width: 28, height: 28 }} />
          <span style={{
            fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 600,
            color: "#fff", letterSpacing: -0.3,
          }}>
            {user?.organization?.name || 'Programa de Culto'}
          </span>
        </div>
      </div>
      {isLoggedIn && (
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: user?.avatar ? 'none' : "linear-gradient(135deg, #6C5CE7, #E17055)",
          backgroundImage: user?.avatar ? `url(${user.avatar})` : 'none',
          backgroundSize: 'cover',
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 11, fontWeight: 700,
        }}>{!user?.avatar && (user?.name?.[0] || 'A')}</div>
      )}
    </header>
  );
}
