import React, { useEffect, useState } from 'react';
import {
  View, FlatList, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useEnsayos } from '../../hooks/useEnsayos';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { AppButton } from '../../components/common/AppButton';
import { AppInput } from '../../components/common/AppInput';
import { Toast } from '../../components/common/Toast';
import { colors } from '../../theme/colors';
import { fonts, fontSizes, fontWeights } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';
import { formatDate, formatHora } from '../../utils/formatDate';
import api from '../../api/client';

export function EnsayoDetailScreen({ route, navigation }: any) {
  const { ensayoId } = route.params || {};
  const { ensayoDetail, loading, fetchEnsayoDetail, addCanto, removeCanto, addAsistente, removeAsistente } = useEnsayos();
  const { isAdmin } = useAuth();
  const { notification, showNotif } = useNotification();

  const [cantos, setCantos] = useState<any[]>([]);
  const [musicians, setMusicians] = useState<any[]>([]);
  const [cantoSearch, setCantoSearch] = useState('');
  const [showAddCanto, setShowAddCanto] = useState(false);
  const [showAddAsistente, setShowAddAsistente] = useState(false);

  useEffect(() => {
    if (ensayoId) fetchEnsayoDetail(ensayoId);
  }, [ensayoId]);

  useEffect(() => {
    if (showAddCanto) api.get('/cantos').then(({ data }) => setCantos(data)).catch(() => {});
    if (showAddAsistente) api.get('/musicians').then(({ data }) => setMusicians(data)).catch(() => {});
  }, [showAddCanto, showAddAsistente]);

  if (loading || !ensayoDetail) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  const ensayoCantos = ensayoDetail.cantos || [];
  const asistentes = ensayoDetail.asistentes || [];
  const existingCantoIds = ensayoCantos.map((c: any) => c.id);
  const existingAsistenteIds = asistentes.map((a: any) => a.id);
  const filteredCantos = cantos.filter(c =>
    !existingCantoIds.includes(c.id) &&
    c.nombre.toLowerCase().includes(cantoSearch.toLowerCase()),
  );
  const availableMusicians = musicians.filter(m => !existingAsistenteIds.includes(m.id));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.title}>{formatDate(ensayoDetail.fecha)}</Text>
          <Text style={styles.subtitle}>{formatHora(ensayoDetail.hora)} - {ensayoDetail.duracion} min</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        {/* Cantos section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cantos ({ensayoCantos.length})</Text>
            {isAdmin && (
              <TouchableOpacity onPress={() => setShowAddCanto(!showAddCanto)}>
                <Icon name={showAddCanto ? 'close' : 'plus'} size={20} color={colors.accent} />
              </TouchableOpacity>
            )}
          </View>

          {showAddCanto && (
            <View style={styles.addSection}>
              <AppInput value={cantoSearch} onChangeText={setCantoSearch} placeholder="Buscar canto..." />
              {filteredCantos.slice(0, 8).map(c => (
                <TouchableOpacity
                  key={c.id}
                  style={styles.addOption}
                  onPress={async () => {
                    try {
                      await addCanto(ensayoId, c.id);
                      showNotif('Canto agregado');
                    } catch { showNotif('Error', 'error'); }
                  }}>
                  <Text style={styles.addOptionText}>{c.nombre}</Text>
                  <Icon name="plus" size={16} color={colors.accent} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {ensayoCantos.map((c: any) => (
            <View key={c.id} style={styles.listItem}>
              <Icon name="music" size={18} color={colors.accent} />
              <Text style={styles.listItemText}>{c.nombre}</Text>
              {isAdmin && (
                <TouchableOpacity onPress={async () => {
                  try { await removeCanto(ensayoId, c.id); showNotif('Canto removido'); }
                  catch { showNotif('Error', 'error'); }
                }}>
                  <Icon name="close" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>
          ))}
          {ensayoCantos.length === 0 && <Text style={styles.empty}>Sin cantos</Text>}
        </View>

        {/* Asistentes section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Asistentes ({asistentes.length})</Text>
            {isAdmin && (
              <TouchableOpacity onPress={() => setShowAddAsistente(!showAddAsistente)}>
                <Icon name={showAddAsistente ? 'close' : 'plus'} size={20} color={colors.accent} />
              </TouchableOpacity>
            )}
          </View>

          {showAddAsistente && (
            <View style={styles.addSection}>
              {availableMusicians.map(m => (
                <TouchableOpacity
                  key={m.id}
                  style={styles.addOption}
                  onPress={async () => {
                    try {
                      await addAsistente(ensayoId, m.id);
                      showNotif('Asistente agregado');
                    } catch { showNotif('Error', 'error'); }
                  }}>
                  <Text style={styles.addOptionText}>{m.nombre}</Text>
                  <Icon name="plus" size={16} color={colors.accent} />
                </TouchableOpacity>
              ))}
              {availableMusicians.length === 0 && <Text style={styles.empty}>Sin músicos disponibles</Text>}
            </View>
          )}

          {asistentes.map((a: any) => (
            <View key={a.id} style={styles.listItem}>
              <Icon name="account" size={18} color={colors.textSecondary} />
              <Text style={styles.listItemText}>{a.nombre}</Text>
              {isAdmin && (
                <TouchableOpacity onPress={async () => {
                  try { await removeAsistente(ensayoId, a.id); showNotif('Asistente removido'); }
                  catch { showNotif('Error', 'error'); }
                }}>
                  <Icon name="close" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>
          ))}
          {asistentes.length === 0 && <Text style={styles.empty}>Sin asistentes</Text>}
        </View>
      </ScrollView>
      <Toast notification={notification} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.lg, paddingTop: spacing.xl,
  },
  headerInfo: { flex: 1 },
  title: { fontFamily: fonts.serif, fontSize: fontSizes.xl, fontWeight: fontWeights.bold, color: colors.text },
  subtitle: { fontFamily: fonts.sans, fontSize: fontSizes.sm, color: colors.textSecondary },
  section: { marginBottom: spacing.xxl },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontFamily: fonts.sans, fontSize: fontSizes.md, fontWeight: fontWeights.semibold, color: colors.text,
  },
  addSection: {
    backgroundColor: colors.surface, borderRadius: borderRadius.md,
    padding: spacing.md, marginBottom: spacing.md,
  },
  addOption: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: spacing.sm, paddingHorizontal: spacing.xs,
  },
  addOptionText: { fontFamily: fonts.sans, fontSize: fontSizes.md, color: colors.text },
  listItem: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.surface, borderRadius: borderRadius.sm,
    padding: spacing.md, marginBottom: spacing.xs,
  },
  listItemText: { fontFamily: fonts.sans, fontSize: fontSizes.md, color: colors.text, flex: 1 },
  empty: {
    fontFamily: fonts.sans, fontSize: fontSizes.sm, color: colors.textMuted,
    textAlign: 'center', marginVertical: spacing.md,
  },
});
