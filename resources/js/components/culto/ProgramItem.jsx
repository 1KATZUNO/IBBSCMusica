import { useAuth } from '../../hooks/useAuth';

const YOUTUBE_ICON = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

// Extract a solid accent color from the rgba bg_color
function accentFromBg(bgColor) {
  if (!bgColor) return '#888';
  const m = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return '#888';
  return `rgb(${m[1]}, ${m[2]}, ${m[3]})`;
}

function bgFromBg(bgColor, opacity) {
  if (!bgColor) return 'rgba(255,255,255,0.03)';
  const m = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return 'rgba(255,255,255,0.03)';
  return `rgba(${m[1]}, ${m[2]}, ${m[3]}, ${opacity})`;
}

export default function ProgramItem({ item, index, onEdit, onRemove, onMoveUp, onMoveDown, isFirst, isLast }) {
  const { isAdmin } = useAuth();
  const accent = accentFromBg(item.bg_color);

  return (
    <div style={{
      display: "flex", alignItems: "stretch", gap: 0, marginBottom: 6,
      animation: `fadeSlideIn 0.4s ease ${index * 0.05}s both`,
    }}>
      {/* Timeline */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 40, flexShrink: 0 }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: bgFromBg(item.bg_color, 0.2),
          border: `2px solid ${bgFromBg(item.bg_color, 0.4)}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, flexShrink: 0,
        }}>{item.emoji}</div>
        {!isLast && <div style={{ flex: 1, width: 1.5, background: "rgba(255,255,255,0.05)", minHeight: 12 }} />}
      </div>

      {/* Content card */}
      <div style={{
        flex: 1, padding: "10px 14px", borderRadius: 10, marginLeft: 6, marginBottom: 2,
        background: bgFromBg(item.bg_color, 0.05),
        borderLeft: `3px solid ${bgFromBg(item.bg_color, 0.35)}`,
      }}>
        <div style={{
          display: "inline-block",
          padding: "2px 10px", borderRadius: 10, marginBottom: 6,
          background: bgFromBg(item.bg_color, 0.12),
          color: accent, fontSize: 10, fontWeight: 700,
          textTransform: "uppercase", letterSpacing: 1,
        }}>
          {item.emoji} {item.tipo_label}
        </div>

        {item.canto ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#e0e0e0", fontSize: 15, fontWeight: 500 }}>{item.canto.nombre}</span>
            {item.canto.youtube_url && (
              <a href={item.canto.youtube_url} target="_blank" rel="noopener noreferrer"
                style={{ color: "#ff4444", opacity: 0.7, transition: "opacity 0.2s", display: "flex" }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0.7}>
                <YOUTUBE_ICON />
              </a>
            )}
          </div>
        ) : (
          <div>
            {item.titulo && <div style={{ color: "#e0e0e0", fontSize: 15, fontWeight: 500 }}>{item.titulo}</div>}
            {item.responsable && (
              <div style={{ color: "#999", fontSize: 13, marginTop: 2 }}>
                <span style={{ color: "#666", fontSize: 11 }}>Responsable:</span> {item.responsable}
              </div>
            )}
          </div>
        )}

        {isAdmin && (
          <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
            {onMoveUp && !isFirst && (
              <button onClick={onMoveUp} style={{
                padding: "4px 8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 6, color: "#888", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              }}>↑</button>
            )}
            {onMoveDown && !isLast && (
              <button onClick={onMoveDown} style={{
                padding: "4px 8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 6, color: "#888", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              }}>↓</button>
            )}
            <button onClick={onEdit} style={{
              padding: "4px 10px", background: "rgba(232,185,49,0.1)", border: "1px solid rgba(232,185,49,0.2)",
              borderRadius: 6, color: "#E8B931", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}>Editar</button>
            <button onClick={onRemove} style={{
              padding: "4px 10px", background: "rgba(181,99,87,0.1)", border: "1px solid rgba(181,99,87,0.2)",
              borderRadius: 6, color: "#B56357", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}>Quitar</button>
          </div>
        )}
      </div>
    </div>
  );
}
