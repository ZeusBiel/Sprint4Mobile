import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import BotaoPrincipal from '@/components/BotaoPrincipal';
import { useAuth } from '@/context/AuthContext';

export default function HomeScreen() {
  const { logout, userProfile } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.welcomeTitle}>Olá, {userProfile?.nome || 'Investidor'}</Text>
          <Text style={styles.welcomeSubtitle}>O que vamos fazer hoje?</Text>
        </View>

        <View style={styles.buttonContainer}>
          <BotaoPrincipal titulo="SUA CARTEIRA" rota="/carteira" style={styles.botao} />
          <BotaoPrincipal titulo="SEU PERFIL" rota="/perfil" style={styles.botao} />
        </View>
      </View>

      <TouchableOpacity onPress={logout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0d1117',
  },
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  header: {
    position: 'absolute',
    top: 80,
    alignSelf: 'center',
    alignItems: 'center',
  },
  welcomeTitle: {
    color: '#c9d1d9',
    fontSize: 28,
    fontWeight: 'bold',
  },
  welcomeSubtitle: {
    color: '#8b949e',
    fontSize: 16,
    marginTop: 8,
  },
  buttonContainer: {
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    width: '100%',
  },
  botao: {
    width: '80%',
    alignSelf: 'center',
  },
  logoutButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#21262d',
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#f85149',
    fontSize: 16,
    fontWeight: '600',
  },
});
