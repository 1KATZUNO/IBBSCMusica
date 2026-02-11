import { useAuth } from '../../hooks/useAuth';

export default function CultoMusicians({ musicos, onAddMusician, onRemoveMusician }) {
  const { isAdmin } = useAuth();

  return (
    <div style={{
      background: "rgba(255,255,255,0.02)", borderRadius: 14,
      border: "1px solid rgba(255,255,255,0.05)", padding: "16px 18px",
      marginBottom: 28, animation: "fadeSlideIn 0.5s ease 0.1s both",
    }}>
      <div style={{
        color: "#888", fontSize: 10, textTransform: "uppercase",
        letterSpacing: 1.5, marginBottom: 10, fontWeight: 600,
      }}>🎸 Músicos</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {musicos?.map((m, i) => (
          <span key={m.pivot_id || i} style={{
            padding: "5px 12px", background: "rgba(255,255,255,0.04)",
            borderRadius: 20, fontSize: 12, color: "#bbb",
            border: "1px solid rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            {m.display}
            {isAdmin && onRemoveMusician && (
              <button onClick={() => onRemoveMusician(m.pivot_id)} style={{
                background: "none", border: "none", color: "#666", fontSize: 14,
                cursor: "pointer", padding: 0, lineHeight: 1,
              }}>×</button>
            )}
          </span>
        ))}
        {(!musicos || musicos.length === 0) && (
          <span style={{ color: "#555", fontSize: 13, fontStyle: "italic" }}>
            No hay músicos asignados aún
          </span>
        )}
      </div>
      {isAdmin && (
        <button onClick={onAddMusician} style={{
          marginTop: 10, padding: "5px 12px", background: "rgba(232,185,49,0.08)",
          border: "1px dashed rgba(232,185,49,0.25)", borderRadius: 20,
          color: "#E8B931", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
        }}>+ Agregar músico</button>
      )}
    </div>
  );
}
