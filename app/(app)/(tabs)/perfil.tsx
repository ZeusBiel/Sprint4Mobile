import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import BotaoPrincipal from '@/components/BotaoPrincipal';
import { useAuth } from '@/context/AuthContext';

export default function PerfilScreen() {
  const { userProfile } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.userName}>{userProfile?.nome || 'Seu Perfil'}</Text>
          <Text style={styles.userProfile}>
            Perfil de Investidor: {userProfile?.perfilInvestidor || 'Não definido'}
          </Text>
        </View>

        <View style={styles.content}>
          <BotaoPrincipal titulo="DETALHES DO PERFIL" rota="/detalhes-perfil" style={styles.botao} />
          <BotaoPrincipal titulo="ATUALIZAR QUIZ DE PERFIL" rota="/quiz-perfil" style={styles.botao} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0d1117' },
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    position: 'absolute',
    top: 80,
    alignItems: 'center',
    marginBottom: 40,
  },
  userName: {
    color: '#c9d1d9',
    fontSize: 28,
    fontWeight: 'bold',
  },
  userProfile: {
    color: '#58a6ff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    backgroundColor: 'rgba(88, 166, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  content: { 
    width: '100%', 
    alignItems: 'center',
    gap: 20,
    marginTop: 80,
  },
  botao: {
    width: '80%',
    alignSelf: 'center',
  },
});
