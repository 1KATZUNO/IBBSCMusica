import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/formatDate';

function hexToRgb(hex) {
  const m = (hex || '#888888').replace("#", "").match(/.{2}/g);
  return m ? m.map(x => parseInt(x, 16)) : [100, 100, 100];
}

export default function Sidebar({ isOpen, onClose, cultos, selectedCulto, onSelectCulto, onCreateCulto, onDeleteCulto, onAdminNav, activeAdmin, showNotif, cultoDetail }) {
  const { isLoggedIn, isAdmin, logout, user } = useAuth();

  const cultoColor = cultoDetail?.color || '#6C5CE7';

  const handleLogout = async () => {
    await logout();
    showNotif('Sesion cerrada');
    onAdminNav(null);
  };

  const adminLinks = [
    { key: 'cantos', icon: '\u266B', label: 'Cantos' },
    { key: 'musicians', icon: '\uD83C\uDFB8', label: 'Musicos' },
    { key: 'types', icon: '\u25C9', label: 'Tipos' },
    { key: 'directors', icon: '\u25C8', label: 'Directores' },
    { key: 'servidores', icon: '\uD83D\uDE4F', label: 'Servidores' },
    { key: 'members', icon: '\uD83D\uDC65', label: 'Miembros' },
    { key: 'invitations', icon: '\u2709', label: 'Invitaciones' },
  ];

  return (
    <>
      {isOpen && <div onClick={onClose} style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(8px)", zIndex: 200,
        animation: "fadeIn 0.2s ease",
      }} />}

      <div style={{
        position: "fixed", top: 0, left: 0, width: 300, height: "100vh",
        background: "linear-gradient(180deg, #111113 0%, #0A0A0B 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        zIndex: 300,
        transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        display: "flex", flexDirection: "column",
        fontFamily: "'Outfit', sans-serif",
      }}>
        {/* Sidebar header */}
        <div style={{ padding: "28px 24px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img src="/logo.svg" alt="IBBSC" style={{ width: 32, height: 32 }} />
              <div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 600, color: "#fff" }}>
                  {user?.organization?.name || 'IBBSC'}
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 2, textTransform: "uppercase" }}>Ministerio Musica</div>
              </div>
            </div>
            <button onClick={onClose} style={{
              background: "rgba(255,255,255,0.06)", border: "none", color: "#888",
              width: 28, height: 28, borderRadius: 8, cursor: "pointer", fontSize: 14,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>&times;</button>
          </div>
        </div>

        {/* Cultos list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 12px" }}>
          <div style={{
            fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase", letterSpacing: 3, padding: "8px 12px", marginBottom: 4,
          }}>Esta Semana</div>

          {cultos.map(c => {
            const isSelected = selectedCulto === c.id && !activeAdmin;
            const [r, g, b] = hexToRgb(c.color);
            return (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 2 }}>
                <button className="sidebar-item" onClick={() => { onSelectCulto(c.id); onAdminNav(null); onClose(); }} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  flex: 1, textAlign: "left",
                  background: isSelected ? `rgba(${r},${g},${b},0.1)` : "transparent",
                  border: "none",
                  borderRadius: 10, padding: "12px", cursor: "pointer",
                  position: "relative", overflow: "hidden",
                }}>
                  {isSelected && <div style={{
                    position: "absolute", left: 0, top: "20%", bottom: "20%", width: 3,
                    borderRadius: "0 4px 4px 0", background: c.color,
                  }} />}
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: `linear-gradient(135deg, ${c.color}33, ${c.color}11)`,
                    border: `1px solid ${c.color}22`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, color: c.color, fontWeight: 700, flexShrink: 0,
                  }}>{c.tipo?.[0] || '?'}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      color: isSelected ? "#fff" : "#ccc", fontSize: 13, fontWeight: 600,
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>{c.tipo}</div>
                    <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginTop: 1 }}>
                      {formatDate(c.fecha)} · {c.hora}
                    </div>
                  </div>
                </button>
                {isAdmin && (
                  <button onClick={(e) => { e.stopPropagation(); onDeleteCulto(c.id); }}
                    title="Eliminar culto"
                    style={{
                      background: "none", border: "none", color: "rgba(255,255,255,0.15)", fontSize: 14,
                      cursor: "pointer", padding: "8px", borderRadius: 8, flexShrink: 0,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.15)'}
                  >&#x1F5D1;</button>
                )}
              </div>
            );
          })}

          {isAdmin && (
            <button onClick={() => { onCreateCulto(); }} className="action-btn" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              width: "100%", padding: 12, marginTop: 8,
              background: "transparent",
              border: "1px dashed rgba(255,255,255,0.1)",
              borderRadius: 10, color: "rgba(255,255,255,0.3)", fontSize: 12, cursor: "pointer",
              fontFamily: "'Outfit', sans-serif", fontWeight: 500,
            }}>
              <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Nuevo culto
            </button>
          )}

          {/* Admin section */}
          {isAdmin && (
            <>
              <div style={{
                fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.25)",
                textTransform: "uppercase", letterSpacing: 3, padding: "8px 12px", marginTop: 20, marginBottom: 4,
              }}>Administrar</div>
              {adminLinks.map(link => (
                <button key={link.key} className="sidebar-item" onClick={() => { onAdminNav(link.key); onClose(); }} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  width: "100%", textAlign: "left",
                  background: activeAdmin === link.key ? "rgba(255,255,255,0.06)" : "transparent",
                  border: "none",
                  borderRadius: 10, padding: "10px 12px", cursor: "pointer",
                  color: activeAdmin === link.key ? "#fff" : "rgba(255,255,255,0.45)",
                  fontSize: 13, fontFamily: "'Outfit', sans-serif",
                }}>
                  <span style={{ fontSize: 14, width: 20, textAlign: "center" }}>{link.icon}</span>
                  {link.label}
                </button>
              ))}
            </>
          )}
        </div>

        {/* User section */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "16px 20px" }}>
          {isLoggedIn && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: user?.avatar ? 'none' : `linear-gradient(135deg, ${cultoColor}, #E17055)`,
                  backgroundImage: user?.avatar ? `url(${user.avatar})` : 'none',
                  backgroundSize: 'cover',
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 12, fontWeight: 700,
                }}>{!user?.avatar && (user?.name?.[0] || 'U')}</div>
                <div>
                  <div style={{ color: "#ddd", fontSize: 12, fontWeight: 600 }}>{user?.name}</div>
                  <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 10 }}>
                    {user?.role === 'admin' ? 'Administrador' : 'Miembro'}
                  </div>
                </div>
              </div>
              <button onClick={handleLogout} style={{
                width: "100%", padding: "8px", background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
                color: "#888", fontSize: 12, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
              }}>
                Cerrar sesion
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
