import { useAuth } from '@/context/AuthContext';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AtivoCard from '../../../components/AtivoCard';
import { addInvestment, deleteInvestment, getUserInvestments, updateInvestment } from '../../../utils/firebaseOperations';

export default function SeusAtivosScreen() {
  const { user } = useAuth();
  const [ativos, setAtivos] = useState<any[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInvestments = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getUserInvestments(user.uid);
      if (!data) {
        console.log('Nenhum ativo encontrado');
        setAtivos([]);
        return;
      }
      // Garante que cada ativo tem campo id e valores padrão necessários
      const ativosComId = data.map((item: any, idx: number) => {
        const ativoProcessado = {
          id: item.id || item._id || item.key || String(idx),
          nome: item.nome || 'Ativo sem nome',
          ticker: item.ticker || 'NONE3',
          preco: item.valor || 0,
          variacao: item.variacao || 0,
          quantidade: item.quantidade || 0,
          valorAplicado: item.valorAplicado || 0,
          rendimento: item.rendimento || 0,
          tipo: item.tipo || 'Não definido',
          dataCompra: item.dataCompra || new Date().toISOString(),
          ...item
        };
        return ativoProcessado;
      });
      console.log('Ativos carregados:', ativosComId);
      setAtivos(ativosComId);
    } catch (err: any) {
      console.error('Erro ao carregar investimentos:', err);
      setError('Não foi possível carregar seus ativos. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInvestments();
  }, [user]);

  const handleAddSample = async () => {
    if (!user) return;
    const sample = {
      nome: 'Novo Ativo',
      ticker: 'XPTO3',
      preco: 100.0,
      variacao: 2.5,
      quantidade: 10,
      valorAplicado: 1000.0,
      rendimento: 25.0,
      tipo: 'Ação',
      dataCompra: new Date().toISOString(),
    };
    try {
      await addInvestment(user.uid, sample);
      await loadInvestments();
    } catch (err: any) {
      console.error('Erro ao adicionar investimento:', err);
      if (err?.code === 'permission-denied') {
        setError('Permissão negada ao adicionar ativo. Publique as regras do Firestore recomendadas.');
      } else {
        setError('Erro ao adicionar investimento: ' + (err?.message || 'Erro desconhecido'));
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    try {
      await deleteInvestment(user.uid, id);
      await loadInvestments();
    } catch (err) {
      console.error('Erro ao deletar investimento:', err);
      setError('Erro ao deletar investimento.');
    }
  };

  const totalAplicado = ativos.reduce((acc, ativo) => acc + (ativo.valorAplicado || 0), 0);
  const rendimentoTotal = ativos.reduce((acc, ativo) => acc + (ativo.rendimento || 0), 0);

  const handleEdit = (item: any) => {
    console.log('Editando ativo:', item);
    setEditId(item.id);
    setEditFields({ ...item });
  };

  const handleEditField = (field: string, value: string) => {
    setEditFields((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    if (!user || !editId) return;
    try {
      const updatePayload: any = {
        nome: editFields.nome,
        valor: Number(editFields.valor),
        tipo: editFields.tipo,
        quantidade: Number(editFields.quantidade),
      };
      if ('ticker' in editFields) updatePayload.ticker = editFields.ticker;
      console.log('Salvando edição:', { id: editId, updatePayload });
      await updateInvestment(user.uid, editId, updatePayload);
      setEditId(null);
      setEditFields({});
      await loadInvestments();
    } catch (err: any) {
      setError('Erro ao salvar edição: ' + (err?.message || 'Erro desconhecido'));
      console.error('Erro ao salvar edição:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditFields({});
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading ? (
        <ActivityIndicator size="large" style={{ marginTop: 80 }} />
      ) : (
        <FlatList
          data={ativos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View>
              {editId === item.id ? (
                <View style={[styles.card, { marginBottom: 16 }]}> 
                  <Text style={styles.editLabel}>Editar Ativo</Text>
                  <Text style={styles.editFieldLabel}>Nome</Text>
                  <TextInput style={styles.editInput} value={editFields.nome} onChangeText={(v: string) => handleEditField('nome', v)} />
                  <Text style={styles.editFieldLabel}>Ticker</Text>
                  <TextInput style={styles.editInput} value={editFields.ticker} onChangeText={(v: string) => handleEditField('ticker', v)} />
                  <Text style={styles.editFieldLabel}>Valor</Text>
                  <TextInput style={styles.editInput} value={String(editFields.valor)} keyboardType="numeric" onChangeText={(v: string) => handleEditField('valor', v)} />
                  <Text style={styles.editFieldLabel}>Tipo</Text>
                  <TextInput style={styles.editInput} value={editFields.tipo} onChangeText={(v: string) => handleEditField('tipo', v)} />
                  <Text style={styles.editFieldLabel}>Quantidade</Text>
                  <TextInput style={styles.editInput} value={String(editFields.quantidade)} keyboardType="numeric" onChangeText={(v: string) => handleEditField('quantidade', v)} />
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                    <TouchableOpacity onPress={handleSaveEdit} style={{ backgroundColor: '#238636', padding: 10, borderRadius: 8 }}>
                      <Text style={{ color: 'white' }}>Salvar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCancelEdit} style={{ backgroundColor: '#f85149', padding: 10, borderRadius: 8 }}>
                      <Text style={{ color: 'white' }}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <>
                  <AtivoCard ativo={item} />
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginRight: 24, marginBottom: 12, gap: 12 }}>
                    <TouchableOpacity onPress={() => handleEdit(item)}>
                      <Text style={{ color: '#58a6ff' }}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item.id)}>
                      <Text style={{ color: '#f85149' }}>Remover</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          )}
          style={styles.list}
          ListHeaderComponent={
            <View>
              <Text style={styles.title}>Seus Ativos</Text>
              <View style={styles.summaryContainer}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Valor Aplicado</Text>
                  <Text style={styles.summaryValue}>R$ {totalAplicado.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Rendimento Total</Text>
                  <Text style={[styles.summaryValue, {color: rendimentoTotal > 0 ? '#238636' : '#f85149'}]}>R$ {rendimentoTotal.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          }
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#161b22',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#30363d',
  },
  editLabel: {
    color: '#c9d1d9',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  editFieldLabel: {
    color: '#8b949e',
    fontSize: 14,
    marginTop: 8,
  },
  editInput: {
    backgroundColor: '#222',
    color: 'white',
    borderRadius: 6,
    padding: 8,
    marginTop: 2,
  },
  safeArea: { flex: 1, backgroundColor: '#0d1117' },
  list: {
    paddingHorizontal: 16,
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 70,
    marginBottom: 10,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#161b22',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#8b949e',
    fontSize: 14,
    marginBottom: 4,
  },
  summaryValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#f85149',
    textAlign: 'center',
    marginTop: 12,
  }
});