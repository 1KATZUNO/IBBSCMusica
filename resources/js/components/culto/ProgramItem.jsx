import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { formatTime } from '../../utils/formatTime';

const YOUTUBE_ICON = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

function extractRgb(bg) {
  const m = bg?.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  return m ? [+m[1], +m[2], +m[3]] : [100, 100, 100];
}

export default function ProgramItem({
  item, index, onEdit, onRemove, onMoveUp, onMoveDown, isFirst, isLast,
  isLive, isActive, isCompleted, itemElapsedSeconds, onComplete, onUncomplete,
}) {
  const { isAdmin } = useAuth();
  const [hovered, setHovered] = useState(false);
  const [ir, ig, ib] = extractRgb(item.bg_color);
  const itemColor = `rgb(${ir},${ig},${ib})`;
  const overTime = isActive && item.duracion && itemElapsedSeconds > item.duracion * 60;
  const progress = isActive && item.duracion ? Math.min((itemElapsedSeconds / (item.duracion * 60)) * 100, 100) : 0;

  return (
    <div
      className="track-row"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "grid", gridTemplateColumns: "32px 1fr 50px 40px",
        alignItems: "center", gap: 12,
        padding: "10px 8px",
        borderRadius: 8,
        opacity: isCompleted ? 0.35 : 1,
        transition: "all 0.3s ease",
        animation: `fadeUp 0.4s ease ${0.45 + index * 0.04}s both`,
        overflow: "hidden",
      }}>
      {/* Progress bar background */}
      {isActive && (
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: `${progress}%`,
          background: `linear-gradient(90deg, rgba(${ir},${ig},${ib},0.08), rgba(${ir},${ig},${ib},0.03))`,
          transition: "width 1s linear",
          borderRadius: 8,
        }} />
      )}

      {/* Number / Equalizer / Check */}
      <div style={{
        textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.25)",
        position: "relative", zIndex: 1,
      }}>
        {isActive ? (
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 2, height: 18 }}>
            <div className="eq-bar" style={{ width: 3, borderRadius: 1, background: itemColor, animationDelay: "0s" }} />
            <div className="eq-bar" style={{ width: 3, borderRadius: 1, background: itemColor, animationDelay: "0.2s" }} />
            <div className="eq-bar" style={{ width: 3, borderRadius: 1, background: itemColor, animationDelay: "0.4s" }} />
          </div>
        ) : isCompleted ? (
          <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 14 }}>&#10003;</span>
        ) : isLive && hovered && isAdmin ? (
          <button onClick={onComplete} style={{
            background: "none", border: "none", color: itemColor,
            fontSize: 14, cursor: "pointer", padding: 0,
          }}>&#10003;</button>
        ) : (
          <span style={{ fontVariantNumeric: "tabular-nums" }}>{index + 1}</span>
        )}
      </div>

      {/* Title */}
      <div style={{ minWidth: 0, position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            display: "inline-block",
            padding: "3px 10px", borderRadius: 6,
            background: `rgba(${ir},${ig},${ib},0.15)`,
            color: itemColor, fontSize: 11, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: 0.5,
            flexShrink: 0,
          }}>
            {item.emoji} {item.tipo_label}
          </span>
          {item.canto?.youtube_url && (
            <a href={item.canto.youtube_url} target="_blank" rel="noopener noreferrer" style={{
              color: "#FF4444", opacity: hovered ? 0.8 : 0, transition: "opacity 0.2s",
              display: "flex", flexShrink: 0,
            }}>
              <YOUTUBE_ICON />
            </a>
          )}
        </div>
        <div style={{
          fontSize: 15, fontWeight: isActive ? 700 : 600,
          color: isActive ? itemColor : isCompleted ? "rgba(255,255,255,0.3)" : "#fff",
          marginTop: 4,
          textDecoration: isCompleted ? "line-through" : "none",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          transition: "color 0.3s ease",
        }}>
          {item.canto ? item.canto.nombre : item.titulo || item.tipo_label}
        </div>
        {item.responsable && (
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2, fontWeight: 500 }}>
            {item.responsable}
          </div>
        )}
        {isActive && item.duracion && (
          <div style={{
            fontSize: 11, fontWeight: 600, marginTop: 3,
            color: overTime ? "#EF4444" : itemColor,
          }}>
            {overTime
              ? `+${formatTime(itemElapsedSeconds - item.duracion * 60)} sobre tiempo`
              : `${formatTime(item.duracion * 60 - itemElapsedSeconds)} restante`
            }
          </div>
        )}

        {/* Edit controls (non-live) */}
        {!isLive && isAdmin && hovered && (
          <div style={{ marginTop: 6, display: "flex", gap: 6 }}>
            {onMoveUp && !isFirst && (
              <button onClick={onMoveUp} className="action-btn" style={{
                padding: "3px 8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 6, color: "rgba(255,255,255,0.4)", fontSize: 11, cursor: "pointer",
                fontFamily: "'Outfit', sans-serif",
              }}>&#8593;</button>
            )}
            {onMoveDown && !isLast && (
              <button onClick={onMoveDown} className="action-btn" style={{
                padding: "3px 8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 6, color: "rgba(255,255,255,0.4)", fontSize: 11, cursor: "pointer",
                fontFamily: "'Outfit', sans-serif",
              }}>&#8595;</button>
            )}
            <button onClick={onEdit} className="action-btn" style={{
              padding: "3px 10px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 6, color: "rgba(255,255,255,0.6)", fontSize: 11, cursor: "pointer",
              fontFamily: "'Outfit', sans-serif",
            }}>Editar</button>
            <button onClick={onRemove} className="action-btn" style={{
              padding: "3px 10px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 6, color: "#EF4444", fontSize: 11, cursor: "pointer",
              fontFamily: "'Outfit', sans-serif",
            }}>Quitar</button>
          </div>
        )}

        {/* Uncomplete button (live, completed) */}
        {isLive && isCompleted && isAdmin && hovered && (
          <div style={{ marginTop: 6 }}>
            <button onClick={onUncomplete} className="action-btn" style={{
              padding: "3px 12px", background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6,
              color: "rgba(255,255,255,0.4)", fontSize: 11, cursor: "pointer",
              fontFamily: "'Outfit', sans-serif",
            }}>Desmarcar</button>
          </div>
        )}
      </div>

      {/* Duration */}
      <div style={{
        textAlign: "right", fontSize: 12, color: "rgba(255,255,255,0.2)",
        fontVariantNumeric: "tabular-nums", position: "relative", zIndex: 1,
      }}>
        {item.duracion ? `${item.duracion}:00` : '-'}
      </div>

      {/* Action */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        {!isLive && hovered && (
          <button style={{
            background: "none", border: "none", color: "rgba(255,255,255,0.3)",
            fontSize: 16, cursor: "pointer", padding: 0,
          }}>&hellip;</button>
        )}
      </div>
    </div>
  );
}
