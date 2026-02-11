import { formatDate } from '../../utils/formatDate';

export default function CultoHeader({ culto }) {
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
    </div>
  );
}
