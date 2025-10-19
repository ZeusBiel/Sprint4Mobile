import AuthLink from '@/components/AuthLink';
import BotaoPrincipalAuth from '@/components/BotaoPrincipalAuth';
import InputAuth from '@/components/InputAuth';
import Separator from '@/components/Separator';
import { useAuth } from '@/context/AuthContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { auth } from '../../firebaseConfig';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();
  const params = useLocalSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    if (params.successMessage) {
      setSuccessMessage(params.successMessage as string);
    }
  }, [params]);

  const handleLogin = async () => {
    setError('');
    if (!email || !senha) {
      setError('Por favor, preencha e-mail e senha.');
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      login(userCredential.user);
          router.push('/');
    } catch (error: any) {
      setError('E-mail ou senha inválidos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>XP Smart Advisor</Text>
        <View style={styles.formContainer}>
          {successMessage && <Text style={styles.successText}>{successMessage}</Text>}
          <Text style={styles.title}>Entrar</Text>
          <Text style={styles.subtitle}>Use o seu email para entrar em uma conta já existente</Text>
          <InputAuth placeholder="email@domain.com" value={email} onChangeText={setEmail} />
          <InputAuth placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <BotaoPrincipalAuth onPress={handleLogin} isLoading={isLoading} />
          <Separator />
          <AuthLink onPress={() => router.push('/cadastro')} textoNormal="Ainda não tem conta? Faça o seu" textoLink=" Cadastro." />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0d1117' },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 40, alignItems: 'center' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#58a6ff', marginBottom: 40 },
  formContainer: { width: '100%', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '600', color: '#c9d1d9', alignSelf: 'flex-start', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#8b949e', alignSelf: 'flex-start', marginBottom: 24 },
  errorText: { color: '#f85149', alignSelf: 'center', marginTop: 10,},
  successText: { color: '#3FB950', fontSize: 16, textAlign: 'center', marginBottom: 20, padding: 10, backgroundColor: 'rgba(63, 185, 80, 0.1)', borderRadius: 6, width: '100%'},
});