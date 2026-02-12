import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/formatDate';
import { formatTime } from '../../utils/formatTime';

export default function CultoHeader({
  culto, isLive, allCompleted, elapsedSeconds,
  autoDeleteCountdown, onStartCulto, onStopCulto, onCancelAutoDelete,
}) {
  const { isAdmin } = useAuth();

  return (
    <div style={{ marginBottom: 28, animation: "fadeSlideIn 0.5s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: culto.color }} />
        <span style={{
          color: culto.color, fontSize: 12, fontWeight: 600,
          textTransform: "uppercase", letterSpacing: 1.5,
        }}>{culto.tipo}</span>
      </div>
      <h1 style={{
        fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700,
        color: "#f0f0f0", lineHeight: 1.2, marginBottom: 6,
      }}>
        {formatDate(culto.fecha)}
      </h1>
      <div style={{ color: "#666", fontSize: 14 }}>
        {culto.hora} · {culto.programa?.length || 0} items en el programa
      </div>

      {/* Live mode controls */}
      {isAdmin && !isLive && (
        <button onClick={onStartCulto} style={{
          marginTop: 14, padding: "10px 20px",
          background: "linear-gradient(135deg, #4CAF50, #388E3C)",
          border: "none", borderRadius: 10, color: "#fff", fontSize: 14,
          fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ fontSize: 18 }}>&#9654;</span> Iniciar Culto
        </button>
      )}

      {isLive && (
        <div style={{
          marginTop: 14, padding: "12px 16px", borderRadius: 12,
          background: allCompleted ? "rgba(232,185,49,0.08)" : "rgba(76,175,80,0.08)",
          border: `1px solid ${allCompleted ? "rgba(232,185,49,0.2)" : "rgba(76,175,80,0.2)"}`,
        }}>
          {!allCompleted ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="live-dot" style={{
                  width: 10, height: 10, borderRadius: "50%", background: "#4CAF50",
                  animation: "pulse 1.5s ease-in-out infinite",
                }} />
                <span style={{ color: "#4CAF50", fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>EN VIVO</span>
                <span style={{
                  color: "#e0e0e0", fontSize: 20, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
                  marginLeft: 8,
                }}>{formatTime(elapsedSeconds)}</span>
              </div>
              {isAdmin && (
                <button onClick={onStopCulto} style={{
                  padding: "6px 14px", background: "rgba(181,99,87,0.15)",
                  border: "1px solid rgba(181,99,87,0.3)", borderRadius: 8,
                  color: "#B56357", fontSize: 12, fontWeight: 600, cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}>Detener</button>
              )}
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ color: "#E8B931", fontSize: 16 }}>&#10003;</span>
                <span style={{ color: "#E8B931", fontSize: 14, fontWeight: 700 }}>Programa completado</span>
              </div>
              {autoDeleteCountdown != null && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ color: "#999", fontSize: 13 }}>
                    Auto-eliminacion en <span style={{
                      color: autoDeleteCountdown <= 60 ? "#B56357" : "#e0e0e0",
                      fontWeight: 700,
                    }}>{formatTime(autoDeleteCountdown)}</span>
                  </span>
                  {isAdmin && (
                    <button onClick={onCancelAutoDelete} style={{
                      padding: "5px 12px", background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
                      color: "#999", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    }}>Cancelar</button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
