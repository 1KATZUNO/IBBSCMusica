import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/formatDate';
import { formatTime } from '../../utils/formatTime';

function hexToRgb(hex) {
  const m = (hex || '#888888').replace("#", "").match(/.{2}/g);
  return m ? m.map(x => parseInt(x, 16)) : [100, 100, 100];
}

export default function CultoHeader({
  culto, isLive, allCompleted, elapsedSeconds,
  autoDeleteCountdown, onStartCulto, onStopCulto, onCancelAutoDelete,
}) {
  const { isAdmin } = useAuth();
  const cultoColor = culto.color || '#6C5CE7';
  const [cr, cg, cb] = hexToRgb(cultoColor);

  return (
    <div style={{
      position: "relative", padding: "40px 24px 32px",
      background: `linear-gradient(180deg, rgba(${cr},${cg},${cb},0.25) 0%, rgba(${cr},${cg},${cb},0.08) 50%, transparent 100%)`,
      animation: "fadeIn 0.6s ease",
      marginBottom: 0,
    }}>
      {/* Noise texture overlay */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Type badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16,
          animation: "fadeUp 0.5s ease 0.1s both",
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%", background: cultoColor,
            boxShadow: `0 0 12px ${cultoColor}88`,
          }} />
          <span style={{
            fontSize: 11, fontWeight: 700, color: cultoColor,
            textTransform: "uppercase", letterSpacing: 3,
          }}>{culto.tipo}</span>
        </div>

        {/* Date */}
        <h1 style={{
          fontFamily: "'Fraunces', serif", fontSize: 36, fontWeight: 800,
          color: "#fff", lineHeight: 1.1, marginBottom: 8, letterSpacing: -1,
          animation: "fadeUp 0.5s ease 0.15s both",
        }}>
          {formatDate(culto.fecha)}
        </h1>

        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          color: "rgba(255,255,255,0.4)", fontSize: 13,
          animation: "fadeUp 0.5s ease 0.2s both",
        }}>
          <span>{culto.hora}</span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
          <span>{culto.programa?.length || 0} items en el programa</span>
        </div>

        {/* Director */}
        {culto.director && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8, marginTop: 14,
            animation: "fadeUp 0.5s ease 0.25s both",
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: "50%",
              background: `linear-gradient(135deg, ${cultoColor}88, ${cultoColor}44)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 9, color: "#fff", fontWeight: 700,
            }}>{culto.director[0]}</div>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
              Dir. {culto.director}
            </span>
          </div>
        )}

        {/* Live / Start button */}
        <div style={{ marginTop: 20, animation: "fadeUp 0.5s ease 0.3s both" }}>
          {isAdmin && !isLive && (
            <button onClick={onStartCulto} className="action-btn" style={{
              padding: "12px 28px",
              background: `linear-gradient(135deg, ${cultoColor}, ${cultoColor}CC)`,
              border: "none", borderRadius: 50, color: "#fff", fontSize: 13,
              fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
              display: "flex", alignItems: "center", gap: 10,
              boxShadow: `0 4px 24px ${cultoColor}44`,
            }}>
              <span style={{ fontSize: 16 }}>&#9654;</span> Iniciar Culto en Vivo
            </button>
          )}

          {isLive && !allCompleted && (
            <div style={{
              display: "flex", alignItems: "center", gap: 16,
              padding: "10px 20px", borderRadius: 50,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(10px)",
              width: "fit-content",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%", background: "#EF4444",
                  animation: "pulse 1.5s ease-in-out infinite",
                }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#EF4444", letterSpacing: 2 }}>LIVE</span>
              </div>
              <span style={{
                fontSize: 18, fontWeight: 700, color: "#fff",
                fontVariantNumeric: "tabular-nums",
              }}>{formatTime(elapsedSeconds)}</span>
              {isAdmin && (
                <button onClick={onStopCulto} className="action-btn" style={{
                  padding: "6px 16px", background: "rgba(239,68,68,0.15)",
                  border: "1px solid rgba(239,68,68,0.3)", borderRadius: 20,
                  color: "#EF4444", fontSize: 11, fontWeight: 600, cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif",
                }}>Detener</button>
              )}
            </div>
          )}

          {isLive && allCompleted && (
            <div style={{
              padding: "14px 20px", borderRadius: 16,
              background: `rgba(${cr},${cg},${cb},0.08)`,
              border: `1px solid rgba(${cr},${cg},${cb},0.2)`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ color: cultoColor, fontSize: 16 }}>&#10003;</span>
                <span style={{ color: cultoColor, fontSize: 14, fontWeight: 700 }}>Programa completado</span>
              </div>
              {autoDeleteCountdown != null && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                    Auto-eliminacion en <span style={{
                      color: autoDeleteCountdown <= 60 ? "#EF4444" : "#fff",
                      fontWeight: 700,
                    }}>{formatTime(autoDeleteCountdown)}</span>
                  </span>
                  {isAdmin && (
                    <button onClick={onCancelAutoDelete} className="action-btn" style={{
                      padding: "5px 12px", background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
                      color: "rgba(255,255,255,0.5)", fontSize: 12, cursor: "pointer",
                      fontFamily: "'Outfit', sans-serif",
                    }}>Cancelar</button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
