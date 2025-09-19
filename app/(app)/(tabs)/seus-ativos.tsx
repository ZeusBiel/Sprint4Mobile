import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import AtivoCard from '../../../components/AtivoCard';

const MOCK_ATIVOS = [
  { id: '1', nome: 'XP Investimentos', ticker: 'XPBR31', preco: 105.42, variacao: -0.12, quantidade: 40, valorAplicado: 8888.16, rendimento: 843.38 },
  { id: '2', nome: 'Petrobras', ticker: 'PETR4', preco: 31.75, variacao: 0.13, quantidade: 30, valorAplicado: 3842.51, rendimento: 197.52 },
  { id: '3', nome: 'Apple', ticker: 'AAPL34', preco: 57.10, variacao: -0.71, quantidade: 45, valorAplicado: 4878.41, rendimento: 132.54 },
];

export default function SeusAtivosScreen() {
  const totalAplicado = MOCK_ATIVOS.reduce((acc, ativo) => acc + ativo.valorAplicado, 0);
  const rendimentoTotal = MOCK_ATIVOS.reduce((acc, ativo) => acc + ativo.rendimento, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
        <FlatList
          data={MOCK_ATIVOS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AtivoCard ativo={item} />}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
});