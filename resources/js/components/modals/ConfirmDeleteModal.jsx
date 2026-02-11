import { useState } from 'react';

export default function ConfirmDeleteModal({ title, message, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#222", borderRadius: 16, padding: "28px",
        width: 380, maxWidth: "90vw", border: "1px solid rgba(255,255,255,0.08)",
      }}>
        <h3 style={{ color: "#B56357", fontFamily: "'Playfair Display', serif", fontSize: 20, margin: "0 0 12px" }}>
          {title || 'Confirmar'}
        </h3>
        <p style={{ color: "#999", fontSize: 14, marginBottom: 20 }}>
          {message || '¿Estás seguro de que deseas eliminar este elemento?'}
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "10px", background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
            color: "#888", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          }}>Cancelar</button>
          <button onClick={handleConfirm} disabled={deleting} style={{
            flex: 1, padding: "10px", background: "rgba(181,99,87,0.2)",
            border: "1px solid rgba(181,99,87,0.4)", borderRadius: 8,
            color: "#B56357", fontSize: 13, fontWeight: 700, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", opacity: deleting ? 0.7 : 1,
          }}>{deleting ? 'Eliminando...' : 'Eliminar'}</button>
        </div>
      </div>
    </div>
  );
}
