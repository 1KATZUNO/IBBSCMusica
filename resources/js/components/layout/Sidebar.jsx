import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/formatDate';

export default function Sidebar({ isOpen, onClose, cultos, selectedCulto, onSelectCulto, onCreateCulto, onDeleteCulto, onAdminNav, activeAdmin, showNotif }) {
  const { isLoggedIn, isAdmin, login, logout, user } = useAuth();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !pass) return;
    setLoginLoading(true);
    try {
      await login(email, pass);
      setEmail('');
      setPass('');
      showNotif('Sesión iniciada como Director');
    } catch (e) {
      showNotif(e.response?.data?.message || 'Error al iniciar sesión', 'error');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    showNotif('Sesión cerrada');
    onAdminNav(null);
  };

  const adminLinks = [
    { key: 'cantos', label: '🎵 Cantos' },
    { key: 'musicians', label: '🎸 Músicos' },
    { key: 'types', label: '📋 Tipos de Programa' },
    { key: 'directors', label: '👤 Directores' },
  ];

  return (
    <>
      {isOpen && <div onClick={onClose} style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 90,
        backdropFilter: "blur(4px)", transition: "opacity 0.3s"
      }} />}
      <div style={{
        position: "fixed", top: 0, left: isOpen ? 0 : -340, width: 320,
        height: "100vh", background: "#1a1a1a", zIndex: 100,
        transition: "left 0.35s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {/* Header */}
        <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#E8B931", fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700 }}>
              ♪ Ministerio Música
            </span>
            <button onClick={onClose} style={{
              background: "none", border: "none", color: "#888", fontSize: 22, cursor: "pointer"
            }}>✕</button>
          </div>
        </div>

        {/* Cultos list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
          <div style={{ color: "#666", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, padding: "8px", marginBottom: 4 }}>
            Próximos Cultos
          </div>
          {cultos.map(c => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
              <button onClick={() => { onSelectCulto(c.id); onAdminNav(null); onClose(); }}
                style={{
                  display: "block", flex: 1, textAlign: "left",
                  background: selectedCulto === c.id && !activeAdmin ? "rgba(232,185,49,0.1)" : "transparent",
                  border: selectedCulto === c.id && !activeAdmin ? "1px solid rgba(232,185,49,0.2)" : "1px solid transparent",
                  borderRadius: 10, padding: "12px 14px", cursor: "pointer",
                  transition: "all 0.2s",
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%", background: c.color, flexShrink: 0
                  }} />
                  <div>
                    <div style={{ color: "#e0e0e0", fontSize: 14, fontWeight: 600 }}>{c.tipo}</div>
                    <div style={{ color: "#777", fontSize: 12, marginTop: 2 }}>{formatDate(c.fecha)} · {c.hora}</div>
                  </div>
                </div>
              </button>
              {isAdmin && (
                <button onClick={(e) => { e.stopPropagation(); onDeleteCulto(c.id); }}
                  title="Eliminar culto"
                  style={{
                    background: "none", border: "none", color: "#666", fontSize: 14,
                    cursor: "pointer", padding: "8px", borderRadius: 8, flexShrink: 0,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#B56357'}
                  onMouseLeave={e => e.currentTarget.style.color = '#666'}
                >&#x1F5D1;</button>
              )}
            </div>
          ))}

          {isAdmin && (
            <button onClick={() => { onCreateCulto(); }} style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              width: "100%", padding: "12px", marginTop: 8,
              background: "rgba(232,185,49,0.08)", border: "1px dashed rgba(232,185,49,0.3)",
              borderRadius: 10, color: "#E8B931", fontSize: 13, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
            }}>
              + Crear nuevo culto
            </button>
          )}

          {/* Admin section */}
          {isAdmin && (
            <>
              <div style={{ color: "#666", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, padding: "8px", marginTop: 16, marginBottom: 4 }}>
                Administración
              </div>
              {adminLinks.map(link => (
                <button key={link.key} onClick={() => { onAdminNav(link.key); onClose(); }}
                  style={{
                    display: "block", width: "100%", textAlign: "left",
                    background: activeAdmin === link.key ? "rgba(232,185,49,0.1)" : "transparent",
                    border: activeAdmin === link.key ? "1px solid rgba(232,185,49,0.2)" : "1px solid transparent",
                    borderRadius: 10, padding: "10px 14px", marginBottom: 2, cursor: "pointer",
                    color: activeAdmin === link.key ? "#E8B931" : "#bbb",
                    fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                    transition: "all 0.2s",
                  }}>
                  {link.label}
                </button>
              ))}
            </>
          )}
        </div>

        {/* Login section */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "16px 20px" }}>
          {isLoggedIn ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #E8B931, #B56357)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 14, fontWeight: 700
                }}>{user?.name?.[0] || 'A'}</div>
                <div>
                  <div style={{ color: "#e0e0e0", fontSize: 13, fontWeight: 600 }}>Director de Música</div>
                  <div style={{ color: "#666", fontSize: 11 }}>Modo edición activo</div>
                </div>
              </div>
              <button onClick={handleLogout} style={{
                width: "100%", padding: "8px", background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
                color: "#888", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              }}>
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div>
              <div style={{ color: "#666", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 10 }}>
                🔒 Acceso Director
              </div>
              <input value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Email" type="email" style={{
                  width: "100%", padding: "9px 12px", marginBottom: 6,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8, color: "#e0e0e0", fontSize: 13, outline: "none",
                  fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
                }} />
              <input value={pass} onChange={e => setPass(e.target.value)}
                type="password" placeholder="Contraseña"
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                style={{
                  width: "100%", padding: "9px 12px", marginBottom: 10,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8, color: "#e0e0e0", fontSize: 13, outline: "none",
                  fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
                }} />
              <button onClick={handleLogin} disabled={loginLoading} style={{
                width: "100%", padding: "10px",
                background: "linear-gradient(135deg, #E8B931, #d4a72a)",
                border: "none", borderRadius: 8, color: "#1a1a1a", fontSize: 13,
                fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                opacity: loginLoading ? 0.7 : 1,
              }}>
                {loginLoading ? 'Iniciando...' : 'Iniciar Sesión'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
