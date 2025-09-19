import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function DetalhesPerfilScreen() {
  const { userProfile } = useAuth();

  const formatCurrency = (value: number) => {
    if (typeof value !== 'number') return 'R$ 0,00';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (!userProfile) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.loadingText}>Carregando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Detalhes do Perfil</Text>
        
        <View style={styles.card}>
          <Text style={styles.label}>NOME COMPLETO</Text>
          <Text style={styles.value}>{userProfile.nome}</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.label}>CAPITAL TOTAL DECLARADO</Text>
          <Text style={styles.value}>{formatCurrency(userProfile.capitalTotal)}</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.label}>PERFIL DE INVESTIDOR</Text>
          <Text style={[styles.value, styles.profileValue]}>{userProfile.perfilInvestidor}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0d1117' },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 40,
  },
  loadingText: {
    color: '#c9d1d9',
    fontSize: 18,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#161b22',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 16,
  },
  label: {
    color: '#8b949e',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  value: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileValue: {
    color: '#58a6ff',
  },
});