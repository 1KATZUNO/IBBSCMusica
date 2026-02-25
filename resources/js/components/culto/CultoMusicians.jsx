import { useAuth } from '../../hooks/useAuth';

const MUSICIAN_COLORS = ['#6C5CE7', '#E17055', '#00B894', '#74B9FF', '#FDCB6E', '#A29BFE', '#FD79A8', '#55EFC4'];

function hexToRgb(hex) {
  const m = (hex || '#888888').replace("#", "").match(/.{2}/g);
  return m ? m.map(x => parseInt(x, 16)) : [100, 100, 100];
}

export default function CultoMusicians({ musicos, onAddMusician, onRemoveMusician }) {
  const { isAdmin } = useAuth();

  return (
    <div style={{
      padding: "20px 24px 8px",
      animation: "fadeUp 0.5s ease 0.3s both",
    }}>
      <div style={{
        fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.25)",
        textTransform: "uppercase", letterSpacing: 3, marginBottom: 12,
      }}>Musicos asignados</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {musicos?.map((m, i) => {
          const color = MUSICIAN_COLORS[i % MUSICIAN_COLORS.length];
          const [r, g, b] = hexToRgb(color);
          const displayName = m.display?.split(' - ') || [m.display];
          const name = displayName[0] || 'Musico';
          const role = displayName[1] || '';

          return (
            <div key={m.pivot_id || i} className="chip" style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "6px 14px 6px 6px",
              background: `rgba(${r},${g},${b},0.08)`,
              border: `1px solid rgba(${r},${g},${b},0.15)`,
              borderRadius: 50, cursor: "default",
              animation: `fadeUp 0.4s ease ${0.35 + i * 0.05}s both`,
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%",
                background: `linear-gradient(135deg, ${color}, ${color}88)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, color: "#fff", fontWeight: 700,
              }}>{name[0]}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#ddd", lineHeight: 1.2 }}>{name}</div>
                {role && <div style={{ fontSize: 9, color: `rgba(${r},${g},${b},0.7)`, fontWeight: 500 }}>{role}</div>}
              </div>
              {isAdmin && onRemoveMusician && (
                <button onClick={() => onRemoveMusician(m.pivot_id)} style={{
                  background: "none", border: "none", color: "rgba(255,255,255,0.2)", fontSize: 14,
                  cursor: "pointer", padding: 0, lineHeight: 1, marginLeft: 2,
                  transition: "color 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
                >&times;</button>
              )}
            </div>
          );
        })}

        {(!musicos || musicos.length === 0) && (
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 13, fontStyle: "italic" }}>
            No hay musicos asignados
          </span>
        )}

        {isAdmin && (
          <button onClick={onAddMusician} className="chip" style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            border: "1px dashed rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.3)", fontSize: 18, cursor: "pointer",
            animation: "fadeUp 0.4s ease 0.6s both",
          }}>+</button>
        )}
      </div>
    </div>
  );
}
