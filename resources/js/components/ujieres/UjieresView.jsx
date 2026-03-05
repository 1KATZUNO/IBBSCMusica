import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import AssignUjierModal from '../modals/AssignUjierModal';
import EditAssignmentModal from '../modals/EditAssignmentModal';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';

const infoCardStyle = {
  padding: "12px 16px", background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10,
};
const infoLabelStyle = {
  fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "uppercase",
  letterSpacing: 1.2, fontWeight: 600, marginBottom: 4,
};
const infoValueStyle = { fontSize: 13, color: "#E8E8E8" };

export default function UjieresView({
  cultoId, service, loading,
  fetchService, updateService,
  addAssignment, updateAssignment, removeAssignment,
  showNotif,
}) {
  const { isAdmin } = useAuth();
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [deletingAssignmentId, setDeletingAssignmentId] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [fieldValue, setFieldValue] = useState('');

  useEffect(() => {
    if (cultoId) fetchService(cultoId);
  }, [cultoId]);

  const handleSaveField = async (field) => {
    try {
      await updateService(cultoId, { [field]: fieldValue.trim() || null });
      setEditingField(null);
      showNotif('Actualizado');
    } catch (e) {
      showNotif('Error al actualizar', 'error');
    }
  };

  const startEdit = (field, currentValue) => {
    if (!isAdmin) return;
    setEditingField(field);
    setFieldValue(currentValue || '');
  };

  const handleAssign = async (data) => {
    try {
      await addAssignment(cultoId, data);
      setShowAssignModal(false);
      showNotif('Ujier agregado');
    } catch (e) {
      showNotif('Error al agregar', 'error');
    }
  };

  const handleEditAssignment = async (id, data) => {
    try {
      await updateAssignment(id, data);
      setEditingAssignment(null);
      showNotif('Actualizado');
    } catch (e) {
      showNotif('Error al actualizar', 'error');
    }
  };

  const handleDeleteAssignment = async () => {
    try {
      await removeAssignment(deletingAssignmentId);
      setDeletingAssignmentId(null);
      showNotif('Eliminado');
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

  if (!service) return null;

  const renderTextField = (field, label, placeholder) => {
    const value = service[field];
    if (editingField === field) {
      return (
        <div style={infoCardStyle}>
          <div style={infoLabelStyle}>{label}</div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input value={fieldValue} onChange={e => setFieldValue(e.target.value)}
              placeholder={placeholder} autoFocus
              onKeyDown={e => { if (e.key === 'Enter') handleSaveField(field); if (e.key === 'Escape') setEditingField(null); }}
              style={{
                background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.15)",
                color: "#E8E8E8", fontSize: 13, fontFamily: "'Outfit', sans-serif",
                outline: "none", width: "100%", padding: "0 0 2px",
              }} />
            <button onClick={() => handleSaveField(field)} style={{
              background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 4,
              color: "#fff", fontSize: 11, padding: "2px 8px", cursor: "pointer", fontFamily: "'Outfit', sans-serif",
            }}>OK</button>
          </div>
        </div>
      );
    }
    return (
      <div style={{ ...infoCardStyle, cursor: isAdmin ? "pointer" : "default" }}
        onClick={() => startEdit(field, value)}>
        <div style={infoLabelStyle}>{label}</div>
        <div style={infoValueStyle}>
          {value || <span style={{ color: "rgba(255,255,255,0.15)" }}>{isAdmin ? placeholder : '—'}</span>}
        </div>
      </div>
    );
  };

  const renderTimeField = () => {
    const value = service.hora_llegada;
    if (editingField === 'hora_llegada') {
      return (
        <div style={infoCardStyle}>
          <div style={infoLabelStyle}>Hora de Llegada</div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input type="time" value={fieldValue} onChange={e => setFieldValue(e.target.value)}
              autoFocus
              style={{
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 6, color: "#E8E8E8", fontSize: 13, fontFamily: "'Outfit', sans-serif",
                outline: "none", padding: "4px 8px",
              }} />
            <button onClick={() => handleSaveField('hora_llegada')} style={{
              background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 4,
              color: "#fff", fontSize: 11, padding: "4px 10px", cursor: "pointer", fontFamily: "'Outfit', sans-serif",
            }}>OK</button>
            <button onClick={() => setEditingField(null)} style={{
              background: "transparent", border: "none",
              color: "rgba(255,255,255,0.3)", fontSize: 11, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
            }}>Cancelar</button>
          </div>
        </div>
      );
    }
    return (
      <div style={{ ...infoCardStyle, cursor: isAdmin ? "pointer" : "default" }}
        onClick={() => startEdit('hora_llegada', value)}>
        <div style={infoLabelStyle}>Hora de Llegada</div>
        <div style={infoValueStyle}>
          {value || <span style={{ color: "rgba(255,255,255,0.15)" }}>{isAdmin ? 'Definir hora' : '—'}</span>}
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: "24px", animation: "fadeUp 0.4s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600, color: "#fff", margin: 0 }}>
          Ujieres
        </h2>
        <button onClick={() => window.print()} className="action-btn" style={{
          padding: "6px 14px", background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
          color: "rgba(255,255,255,0.6)", fontSize: 12, cursor: "pointer",
          fontFamily: "'Outfit', sans-serif",
        }}>Imprimir</button>
      </div>

      {/* Info cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
        {renderTimeField()}
        {renderTextField('vestimenta', 'Vestimenta', 'Ej: Formal')}
      </div>

      {/* Notas generales */}
      <div style={{ marginBottom: 20 }}>
        {renderTextField('notas', 'Notas Generales', 'Ej: Servicio pre/post culto. Rondas en pareja...')}
      </div>

      {/* Assignments table */}
      <div className="printable-area">
        <div style={{ display: "none" }} className="print-header">
          <h1 style={{ fontSize: 18, marginBottom: 4 }}>{service.nombre}</h1>
          <p style={{ fontSize: 12, color: "#666" }}>{new Date(service.fecha).toLocaleDateString()}</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)", margin: 0, textTransform: "uppercase", letterSpacing: 1 }}>
            Asignaciones
          </h3>
          {isAdmin && (
            <button onClick={() => setShowAssignModal(true)} className="action-btn" style={{
              padding: "6px 14px", background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
              color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
              fontFamily: "'Outfit', sans-serif",
            }}>+ Agregar Ujier</button>
          )}
        </div>

        {(!service.assignments || service.assignments.length === 0) ? (
          <div style={{
            textAlign: "center", padding: "30px 20px", color: "rgba(255,255,255,0.2)",
            fontSize: 13, background: "rgba(255,255,255,0.02)", borderRadius: 10,
            border: "1px dashed rgba(255,255,255,0.06)",
          }}>
            No hay ujieres asignados
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid rgba(255,255,255,0.1)" }}>
                  <th style={thStyle}>Nombre</th>
                  <th style={thStyle}>Responsabilidades</th>
                  <th style={thStyle}>Observaciones</th>
                  <th style={thStyle}>Detalles</th>
                  {isAdmin && <th style={{ ...thStyle, width: 80 }}></th>}
                </tr>
              </thead>
              <tbody>
                {service.assignments.map(a => (
                  <tr key={a.id} className="track-row" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ ...tdStyle, fontWeight: 600, whiteSpace: "nowrap" }}>{a.nombre}</td>
                    <td style={tdStyle}>{a.responsabilidades}</td>
                    <td style={{ ...tdStyle, color: "rgba(255,255,255,0.5)" }}>{a.observaciones || '—'}</td>
                    <td style={{ ...tdStyle, color: "rgba(255,255,255,0.5)" }}>{a.detalles || '—'}</td>
                    {isAdmin && (
                      <td style={tdStyle}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => setEditingAssignment(a)} className="action-btn" style={actionBtnStyle}>
                            Editar
                          </button>
                          <button onClick={() => setDeletingAssignmentId(a.id)} className="action-btn"
                            style={{ ...actionBtnStyle, color: "#EF4444", borderColor: "rgba(239,68,68,0.2)" }}>
                            &#10005;
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAssignModal && (
        <AssignUjierModal onClose={() => setShowAssignModal(false)} onAssign={handleAssign} />
      )}
      {editingAssignment && (
        <EditAssignmentModal assignment={editingAssignment} onClose={() => setEditingAssignment(null)} onSave={handleEditAssignment} />
      )}
      {deletingAssignmentId && (
        <ConfirmDeleteModal title="Eliminar Ujier" message="Eliminar esta asignacion?"
          onClose={() => setDeletingAssignmentId(null)} onConfirm={handleDeleteAssignment} />
      )}
    </div>
  );
}

const thStyle = {
  textAlign: "left", padding: "10px 12px",
  color: "rgba(255,255,255,0.35)", fontSize: 11,
  textTransform: "uppercase", letterSpacing: 1, fontWeight: 600,
};
const tdStyle = { padding: "12px", color: "#E8E8E8", fontSize: 13 };
const actionBtnStyle = {
  padding: "4px 10px", background: "transparent",
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6,
  color: "rgba(255,255,255,0.5)", fontSize: 11, cursor: "pointer",
  fontFamily: "'Outfit', sans-serif",
};
