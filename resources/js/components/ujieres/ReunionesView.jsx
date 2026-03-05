import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import ReunionModal from '../modals/ReunionModal';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';

export default function ReunionesView({
  cultoId, service, loading,
  fetchService, addReunion, updateReunion, removeReunion,
  showNotif,
}) {
  const { isAdmin } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingReunion, setEditingReunion] = useState(null);
  const [deletingReunionId, setDeletingReunionId] = useState(null);

  useEffect(() => {
    if (cultoId && !service) fetchService(cultoId);
  }, [cultoId]);

  const handleCreate = async (data) => {
    try {
      await addReunion(cultoId, data);
      setShowCreateModal(false);
      showNotif('Reunion creada');
    } catch (e) {
      showNotif('Error al crear reunion', 'error');
    }
  };

  const handleEdit = async (data) => {
    try {
      await updateReunion(editingReunion.id, data);
      setEditingReunion(null);
      showNotif('Reunion actualizada');
    } catch (e) {
      showNotif('Error al actualizar', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await removeReunion(deletingReunionId);
      setDeletingReunionId(null);
      showNotif('Reunion eliminada');
    } catch (e) {
      showNotif('Error al eliminar', 'error');
    }
  };

  if (loading && !service) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", color: "#555" }}>
        <div style={{
          width: 30, height: 30, border: "3px solid rgba(108,92,231,0.2)",
          borderTopColor: "#6C5CE7", borderRadius: "50%",
          animation: "spin 0.8s linear infinite", margin: "0 auto 12px",
        }} />
        Cargando...
      </div>
    );
  }

  const reuniones = service?.reuniones || [];

  return (
    <div style={{ padding: "24px", animation: "fadeUp 0.4s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600, color: "#fff", margin: 0 }}>
          Reuniones
        </h2>
        {isAdmin && (
          <button onClick={() => setShowCreateModal(true)} className="action-btn" style={{
            padding: "8px 16px", background: "rgba(108,92,231,0.12)",
            border: "1px solid rgba(108,92,231,0.25)", borderRadius: 10,
            color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
            fontFamily: "'Outfit', sans-serif",
          }}>+ Nueva Reunion</button>
        )}
      </div>

      {reuniones.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px 20px", color: "rgba(255,255,255,0.25)",
          fontSize: 14,
        }}>
          No hay reuniones programadas para este culto
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {reuniones.map(r => (
            <div key={r.id} style={{
              padding: "16px 18px", background: "rgba(108,92,231,0.04)",
              border: "1px solid rgba(108,92,231,0.12)", borderRadius: 12,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#E8E8E8", marginBottom: 8 }}>
                    {r.descripcion}
                  </div>
                  <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: r.asistentes ? 8 : 0 }}>
                    {r.hora && (
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
                        <span style={{ color: "rgba(108,92,231,0.7)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Hora </span>
                        {r.hora}
                      </div>
                    )}
                    {r.lugar && (
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
                        <span style={{ color: "rgba(108,92,231,0.7)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Lugar </span>
                        {r.lugar}
                      </div>
                    )}
                  </div>
                  {r.asistentes && (
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
                      <span style={{ color: "rgba(108,92,231,0.7)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Asistentes </span>
                      {r.asistentes}
                    </div>
                  )}
                </div>
                {isAdmin && (
                  <div style={{ display: "flex", gap: 6, marginLeft: 12, flexShrink: 0 }}>
                    <button onClick={() => setEditingReunion(r)} className="action-btn" style={btnStyle}>
                      Editar
                    </button>
                    <button onClick={() => setDeletingReunionId(r.id)} className="action-btn"
                      style={{ ...btnStyle, color: "#EF4444", borderColor: "rgba(239,68,68,0.2)" }}>
                      &#10005;
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <ReunionModal onClose={() => setShowCreateModal(false)} onSave={handleCreate} />
      )}
      {editingReunion && (
        <ReunionModal reunion={editingReunion} onClose={() => setEditingReunion(null)} onSave={handleEdit} />
      )}
      {deletingReunionId && (
        <ConfirmDeleteModal title="Eliminar Reunion" message="Eliminar esta reunion?"
          onClose={() => setDeletingReunionId(null)} onConfirm={handleDelete} />
      )}
    </div>
  );
}

const btnStyle = {
  padding: "4px 10px", background: "transparent",
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6,
  color: "rgba(255,255,255,0.5)", fontSize: 11, cursor: "pointer",
  fontFamily: "'Outfit', sans-serif",
};
