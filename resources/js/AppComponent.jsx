import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useCultos } from './hooks/useCultos';
import { useCantos } from './hooks/useCantos';
import { useMusicians } from './hooks/useMusicians';
import { useNotification } from './hooks/useNotification';
import { useLiveMode } from './hooks/useLiveMode';
import { formatTime } from './utils/formatTime';
import api from './api/client';

import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Notification from './components/layout/Notification';
import FooterHint from './components/layout/FooterHint';
import CultoHeader from './components/culto/CultoHeader';
import CultoMusicians from './components/culto/CultoMusicians';
import CultoDirector from './components/culto/CultoDirector';
import ProgramList from './components/culto/ProgramList';
import AdminPanel from './components/admin/AdminPanel';

import CreateCultoModal from './components/modals/CreateCultoModal';
import AddItemModal from './components/modals/AddItemModal';
import EditItemModal from './components/modals/EditItemModal';
import AssignMusicianModal from './components/modals/AssignMusicianModal';
import ConfirmDeleteModal from './components/modals/ConfirmDeleteModal';

function extractRgb(bg) {
  const m = bg?.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  return m ? [+m[1], +m[2], +m[3]] : [100, 100, 100];
}

export default function App() {
  const { isLoggedIn, isAdmin } = useAuth();
  const { notification, showNotif } = useNotification();
  const {
    cultos, cultoDetail, loading: cultoLoading,
    fetchCultos, fetchCultoDetail, setCultoDetail,
    createCulto, deleteCulto,
    addProgramItem, updateProgramItem, removeProgramItem, reorderProgramItems,
    addMusician, removeMusician,
  } = useCultos();
  const { cantos, fetchCantos } = useCantos();
  const { musicians, fetchMusicians } = useMusicians();

  const {
    isLive, allCompleted, elapsedSeconds, autoDeleteCountdown,
    activeItemId, getItemElapsedSeconds,
    startCulto, stopCulto, completeItem, uncompleteItem, cancelAutoDelete,
  } = useLiveMode(cultoDetail, setCultoDetail, fetchCultoDetail);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCultoId, setSelectedCultoId] = useState(null);
  const [activeAdmin, setActiveAdmin] = useState(null);
  const [programItemTypes, setProgramItemTypes] = useState([]);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showAssignMusician, setShowAssignMusician] = useState(false);
  const [deletingCultoId, setDeletingCultoId] = useState(null);

  const fetchProgramItemTypes = () => {
    api.get('/program-item-types').then(({ data }) => setProgramItemTypes(data));
  };

  useEffect(() => {
    fetchCultos();
    fetchProgramItemTypes();
  }, []);

  useEffect(() => {
    if (cultos.length > 0 && !selectedCultoId) {
      setSelectedCultoId(cultos[0].id);
    }
  }, [cultos]);

  useEffect(() => {
    if (selectedCultoId && !activeAdmin) {
      fetchCultoDetail(selectedCultoId);
      fetchCantos();
      fetchMusicians();
      fetchProgramItemTypes();
    }
  }, [selectedCultoId, activeAdmin]);

  useEffect(() => {
    if (autoDeleteCountdown === 0 && cultoDetail?.id) {
      (async () => {
        try {
          await deleteCulto(cultoDetail.id);
          setSelectedCultoId(cultos.find(c => c.id !== cultoDetail.id)?.id || null);
          showNotif('Culto finalizado y eliminado');
        } catch (e) {
          showNotif('Error al eliminar culto', 'error');
        }
      })();
    }
  }, [autoDeleteCountdown]);

  const handleSelectCulto = (id) => {
    setSelectedCultoId(id);
    setActiveAdmin(null);
  };

  const handleCreateCulto = async (data) => {
    try {
      const newCulto = await createCulto(data);
      setSelectedCultoId(newCulto.id);
      setShowCreateModal(false);
      showNotif(`Culto "${data.tipo}" creado`);
    } catch (e) {
      showNotif('Error al crear culto', 'error');
    }
  };

  const handleDeleteCulto = async () => {
    const idToDelete = deletingCultoId;
    try {
      await deleteCulto(idToDelete);
      if (selectedCultoId === idToDelete) {
        setSelectedCultoId(cultos.find(c => c.id !== idToDelete)?.id || null);
      }
      setDeletingCultoId(null);
      showNotif('Culto eliminado');
    } catch (e) {
      showNotif('Error al eliminar', 'error');
    }
  };

  const handleAddItem = async (itemData) => {
    try {
      await addProgramItem(selectedCultoId, itemData);
      setShowAddItemModal(false);
      showNotif('Item agregado al programa');
    } catch (e) {
      showNotif('Error al agregar item', 'error');
    }
  };

  const handleEditItem = async (itemId, itemData) => {
    try {
      await updateProgramItem(selectedCultoId, itemId, itemData);
      setEditingItem(null);
      showNotif('Item actualizado');
    } catch (e) {
      showNotif('Error al actualizar', 'error');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeProgramItem(selectedCultoId, itemId);
      showNotif('Item removido');
    } catch (e) {
      showNotif('Error al remover', 'error');
    }
  };

  const handleMoveItem = async (index, direction) => {
    const programa = cultoDetail?.programa;
    if (!programa) return;

    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= programa.length) return;

    const items = programa.map((p, i) => {
      if (i === index) return { id: p.id, orden: programa[newIndex].orden };
      if (i === newIndex) return { id: p.id, orden: programa[index].orden };
      return { id: p.id, orden: p.orden };
    });

    try {
      await reorderProgramItems(selectedCultoId, items);
    } catch (e) {
      showNotif('Error al reordenar', 'error');
    }
  };

  const handleAssignMusician = async (musicianId, roleId) => {
    try {
      await addMusician(selectedCultoId, musicianId, roleId);
      setShowAssignMusician(false);
      showNotif('Musico asignado');
    } catch (e) {
      showNotif('Error al asignar musico', 'error');
    }
  };

  const handleRemoveMusician = async (pivotId) => {
    try {
      await removeMusician(selectedCultoId, pivotId);
      showNotif('Musico removido');
    } catch (e) {
      showNotif('Error al remover musico', 'error');
    }
  };

  const handleStartCulto = async () => {
    try {
      await startCulto(selectedCultoId);
      showNotif('Culto iniciado en vivo');
    } catch (e) {
      showNotif('Error al iniciar culto', 'error');
    }
  };

  const handleStopCulto = async () => {
    try {
      await stopCulto(selectedCultoId);
      showNotif('Culto detenido');
    } catch (e) {
      showNotif('Error al detener culto', 'error');
    }
  };

  const handleCompleteItem = async (itemId) => {
    try {
      await completeItem(selectedCultoId, itemId);
    } catch (e) {
      showNotif('Error al completar item', 'error');
    }
  };

  const handleUncompleteItem = async (itemId) => {
    try {
      await uncompleteItem(selectedCultoId, itemId);
    } catch (e) {
      showNotif('Error al desmarcar item', 'error');
    }
  };

  // Get active program item for Now Playing bar
  const activeProgItem = isLive && cultoDetail?.programa
    ? cultoDetail.programa.find(p => p.id === activeItemId)
    : null;

  const activeItemElapsed = activeProgItem && getItemElapsedSeconds
    ? getItemElapsedSeconds(activeProgItem)
    : 0;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0A0B",
      fontFamily: "'Outfit', sans-serif",
      color: "#E8E8E8",
      position: "relative",
      overflow: "hidden",
    }}>
      <Notification notification={notification} />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        cultos={cultos}
        selectedCulto={selectedCultoId}
        onSelectCulto={handleSelectCulto}
        onCreateCulto={() => setShowCreateModal(true)}
        onDeleteCulto={(id) => setDeletingCultoId(id)}
        onAdminNav={setActiveAdmin}
        activeAdmin={activeAdmin}
        showNotif={showNotif}
        cultoDetail={cultoDetail}
      />

      {showCreateModal && (
        <CreateCultoModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateCulto}
        />
      )}

      {showAddItemModal && (
        <AddItemModal
          onClose={() => setShowAddItemModal(false)}
          onAdd={handleAddItem}
          cantos={cantos}
          programItemTypes={programItemTypes}
        />
      )}

      {editingItem && (
        <EditItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleEditItem}
          cantos={cantos}
          programItemTypes={programItemTypes}
        />
      )}

      {showAssignMusician && (
        <AssignMusicianModal
          onClose={() => setShowAssignMusician(false)}
          onAssign={handleAssignMusician}
          musicians={musicians}
          currentMusicos={cultoDetail?.musicos || []}
        />
      )}

      {deletingCultoId && (
        <ConfirmDeleteModal
          title="Eliminar Culto"
          message={`Eliminar este culto y todo su programa?`}
          onClose={() => setDeletingCultoId(null)}
          onConfirm={handleDeleteCulto}
        />
      )}

      <Header onOpenSidebar={() => setSidebarOpen(true)} />

      <main style={{ maxWidth: 680, margin: "0 auto", position: "relative" }}>
        <div style={{ padding: "0 0 120px" }}>
          {activeAdmin ? (
            <div style={{ padding: "24px 24px 0" }}>
              <AdminPanel activePanel={activeAdmin} showNotif={showNotif} />
            </div>
          ) : cultoDetail ? (
            <>
              <CultoHeader
                culto={cultoDetail}
                isLive={isLive}
                allCompleted={allCompleted}
                elapsedSeconds={elapsedSeconds}
                autoDeleteCountdown={autoDeleteCountdown}
                onStartCulto={handleStartCulto}
                onStopCulto={handleStopCulto}
                onCancelAutoDelete={cancelAutoDelete}
              />

              <CultoMusicians
                musicos={cultoDetail.musicos}
                onAddMusician={() => setShowAssignMusician(true)}
                onRemoveMusician={handleRemoveMusician}
              />

              <CultoDirector
                directorName={cultoDetail.director}
                directorId={cultoDetail.director_id}
                cultoId={cultoDetail.id}
                onDirectorChanged={() => fetchCultoDetail(selectedCultoId)}
              />

              {isAdmin && !isLive && (
                <div style={{ padding: "0 24px", marginBottom: 16, animation: "fadeUp 0.5s ease 0.18s both" }}>
                  <button onClick={() => setDeletingCultoId(selectedCultoId)} className="action-btn" style={{
                    padding: "6px 14px", background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8,
                    color: "#EF4444", fontSize: 11, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                  }}>Eliminar este culto</button>
                </div>
              )}

              <ProgramList
                programa={cultoDetail.programa}
                onAddItem={() => setShowAddItemModal(true)}
                onEditItem={setEditingItem}
                onRemoveItem={handleRemoveItem}
                onMoveUp={(i) => handleMoveItem(i, -1)}
                onMoveDown={(i) => handleMoveItem(i, 1)}
                isLive={isLive}
                activeItemId={activeItemId}
                getItemElapsedSeconds={getItemElapsedSeconds}
                onCompleteItem={handleCompleteItem}
                onUncompleteItem={handleUncompleteItem}
                cultoColor={cultoDetail.color}
              />
            </>
          ) : cultoLoading ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#555" }}>
              <div style={{
                width: 30, height: 30, border: "3px solid rgba(108,92,231,0.2)",
                borderTopColor: "#6C5CE7", borderRadius: "50%",
                animation: "spin 0.8s linear infinite", margin: "0 auto 12px",
              }} />
              Cargando...
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#555" }}>
              Selecciona un culto del panel lateral
            </div>
          )}
        </div>
      </main>

      {/* Now Playing Bar */}
      {isLive && activeProgItem && (
        <NowPlayingBar
          item={activeProgItem}
          culto={cultoDetail}
          elapsed={activeItemElapsed}
          onComplete={() => handleCompleteItem(activeProgItem.id)}
        />
      )}

      {!isLoggedIn && <FooterHint />}
    </div>
  );
}

function NowPlayingBar({ item, culto, elapsed, onComplete }) {
  const [ir, ig, ib] = extractRgb(item.bg_color);
  const itemColor = `rgb(${ir},${ig},${ib})`;
  const progress = item.duracion ? Math.min((elapsed / (item.duracion * 60)) * 100, 100) : 0;

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "rgba(18,18,20,0.95)",
      backdropFilter: "blur(24px)",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      zIndex: 150,
      animation: "fadeUp 0.4s ease",
    }}>
      {/* Progress bar */}
      {item.duracion && (
        <div style={{ height: 2, background: "rgba(255,255,255,0.04)" }}>
          <div style={{
            height: "100%",
            width: `${progress}%`,
            background: itemColor,
            transition: "width 1s linear",
            boxShadow: `0 0 8px rgba(${ir},${ig},${ib},0.5)`,
          }} />
        </div>
      )}

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 24px",
        maxWidth: 680, margin: "0 auto",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
          {/* Equalizer icon */}
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: `rgba(${ir},${ig},${ib},0.15)`,
            display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 2,
            padding: "0 0 8px",
            flexShrink: 0,
          }}>
            {[0, 0.2, 0.4].map((d, i) => (
              <div key={i} className="eq-bar" style={{
                width: 3, borderRadius: 1,
                background: itemColor,
                animationDelay: `${d}s`,
              }} />
            ))}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: 13, fontWeight: 600, color: "#fff",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {item.canto?.nombre || item.titulo}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
              {item.tipo_label} {culto ? `· ${culto.tipo}` : ''}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
          <span style={{
            fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)",
            fontVariantNumeric: "tabular-nums",
          }}>{formatTime(elapsed)}</span>
          <button onClick={onComplete} className="action-btn" style={{
            width: 32, height: 32, borderRadius: "50%",
            background: `rgba(${ir},${ig},${ib},0.2)`,
            border: `2px solid rgba(${ir},${ig},${ib},0.5)`,
            color: itemColor,
            fontSize: 14, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>&#10003;</button>
        </div>
      </div>
    </div>
  );
}
