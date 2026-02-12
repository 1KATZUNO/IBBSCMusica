import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useCultos } from './hooks/useCultos';
import { useCantos } from './hooks/useCantos';
import { useMusicians } from './hooks/useMusicians';
import { useNotification } from './hooks/useNotification';
import { useLiveMode } from './hooks/useLiveMode';
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
  const [deletingCulto, setDeletingCulto] = useState(false);

  const fetchProgramItemTypes = () => {
    api.get('/program-item-types').then(({ data }) => setProgramItemTypes(data));
  };

  // Initial data load
  useEffect(() => {
    fetchCultos();
    fetchProgramItemTypes();
  }, []);

  // Select first culto when list loads
  useEffect(() => {
    if (cultos.length > 0 && !selectedCultoId) {
      setSelectedCultoId(cultos[0].id);
    }
  }, [cultos]);

  // Fetch culto detail when selected
  useEffect(() => {
    if (selectedCultoId && !activeAdmin) {
      fetchCultoDetail(selectedCultoId);
      fetchCantos();
      fetchMusicians();
      fetchProgramItemTypes();
    }
  }, [selectedCultoId, activeAdmin]);

  // Auto-delete culto when countdown reaches 0
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
    try {
      await deleteCulto(selectedCultoId);
      setSelectedCultoId(cultos.find(c => c.id !== selectedCultoId)?.id || null);
      setDeletingCulto(false);
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

  return (
    <div style={{
      minHeight: "100vh",
      background: "#111",
      fontFamily: "'DM Sans', sans-serif",
      color: "#e0e0e0",
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
        onAdminNav={setActiveAdmin}
        activeAdmin={activeAdmin}
        showNotif={showNotif}
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

      {deletingCulto && (
        <ConfirmDeleteModal
          title="Eliminar Culto"
          message={`Eliminar este culto y todo su programa?`}
          onClose={() => setDeletingCulto(false)}
          onConfirm={handleDeleteCulto}
        />
      )}

      <Header onOpenSidebar={() => setSidebarOpen(true)} />

      <main style={{ maxWidth: 640, margin: "0 auto", padding: "24px 16px 80px" }}>
        {activeAdmin ? (
          <AdminPanel activePanel={activeAdmin} showNotif={showNotif} />
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
              <div style={{ marginBottom: 16, animation: "fadeSlideIn 0.5s ease 0.18s both" }}>
                <button onClick={() => setDeletingCulto(true)} style={{
                  padding: "6px 12px", background: "rgba(181,99,87,0.08)",
                  border: "1px solid rgba(181,99,87,0.2)", borderRadius: 8,
                  color: "#B56357", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
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
            />
          </>
        ) : cultoLoading ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#555" }}>
            <div style={{
              width: 30, height: 30, border: "3px solid rgba(232,185,49,0.2)",
              borderTopColor: "#E8B931", borderRadius: "50%",
              animation: "spin 0.8s linear infinite", margin: "0 auto 12px",
            }} />
            Cargando...
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#555" }}>
            Selecciona un culto del panel lateral
          </div>
        )}
      </main>

      {!isLoggedIn && <FooterHint />}
    </div>
  );
}
