import QuizOption from '@/components/QuizOption';
import SuccessModal from '@/components/SuccessModal';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { saveQuizResults } from '../../../utils/firebaseOperations';

const QUIZ_DATA = [
  { id: 'q1', title: 'Questão 1: Por quanto tempo você pretende manter seus investimentos antes de precisar do dinheiro?', answers: [ { id: 'a11', text: 'Menos de 1 ano (Curto prazo).', score: 1 }, { id: 'a12', text: 'Entre 1 e 5 anos (Médio prazo).', score: 2 }, { id: 'a13', text: 'Mais de 5 anos (Longo prazo).', score: 3 }, ], },
  { id: 'q2', title: 'Questão 2: Qual destes cenários te deixa mais confortável?', answers: [ { id: 'a21', text: 'Ganhar menos, mas com baixíssimo risco de perder o valor principal.', score: 1 }, { id: 'a22', text: 'Um equilíbrio entre segurança e possibilidade de ganhos maiores.', score: 2 }, { id: 'a23', text: 'Buscar o máximo de ganho possível, mesmo que isso signifique arriscar parte do valor principal.', score: 3 }, ], },
  { id: 'q3', title: 'Questão 3: Se seus investimentos caíssem 20% em um mês, o que você faria?', answers: [ { id: 'a31', text: 'Venderia tudo para não perder mais.', score: 1 }, { id: 'a32', text: 'Manteria a posição, pois entendo que o mercado oscila.', score: 2 }, { id: 'a33', text: 'Compraria mais, aproveitando os preços baixos.', score: 3 }, ], },
  { id: 'q4', title: 'Questão 4: Qual seu nível de conhecimento sobre o mercado financeiro?', answers: [ { id: 'a41', text: 'Iniciante, estou começando a aprender agora.', score: 1 }, { id: 'a42', text: 'Intermediário, já conheço alguns produtos de investimento.', score: 2 }, { id: 'a43', text: 'Avançado, invisto regularmente e conheço estratégias complexas.', score: 3 }, ], },
  { id: 'q5', title: 'Questão 5: Qual porcentagem da sua renda você está disposto a investir regularmente?', answers: [ { id: 'a51', text: 'Até 10%', score: 1 }, { id: 'a52', text: 'Entre 10% e 30%', score: 2 }, { id: 'a53', text: 'Mais de 30%', score: 3 }, ], },
];

export default function QuizPerfilScreen() {
  const { user, refreshUserProfile } = useAuth();
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [calculatedProfile, setCalculatedProfile] = useState('');
  const [shouldNavigateBack, setShouldNavigateBack] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (shouldNavigateBack) {
      router.push('/');
    }
  }, [shouldNavigateBack]);

  const handleSelectAnswer = (questionId: string, answerId: string) => {
    setValidationError(null);
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answerId }));
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length < QUIZ_DATA.length) {
      setValidationError('Por favor, responda a todas as perguntas para continuar.');
      return;
    }

    if (!user) {
      setValidationError('Você precisa estar logado para enviar o quiz.');
      return;
    }

    let totalScore = 0;
    QUIZ_DATA.forEach(question => {
        const answer = question.answers.find(a => a.id === selectedAnswers[question.id]);
        if (answer) totalScore += answer.score;
    });
    
    let perfil = 'Conservador';
    if (totalScore > 7 && totalScore <= 12) perfil = 'Moderado';
    else if (totalScore > 12) perfil = 'Arrojado';

    try {
      // Salvar resultados do quiz usando função utilitária
      await saveQuizResults(user.uid, { perfilInvestidor: perfil, updatedAt: new Date().toISOString() });
      await refreshUserProfile();
      setCalculatedProfile(perfil);
      setModalVisible(true);
    } catch (error: any) {
      console.error('Erro ao salvar quiz:', error);
      const code = error?.code || error?.name || null;
      if (code === 'permission-denied') {
        setValidationError('Permissão negada ao salvar seu perfil. Verifique as regras do Firestore ou contate o suporte.');
      } else {
        const message = error?.message || 'Não foi possível salvar seu perfil. Tente novamente.';
        setValidationError(`Erro ao salvar perfil: ${message}`);
      }
    }
  };
  
  const handleCloseModal = () => {
    setModalVisible(false);
    setShouldNavigateBack(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>Quiz de Perfil de Investidor</Text>
        <Text style={styles.subHeader}>Responda as perguntas para definirmos seu perfil.</Text>

        {QUIZ_DATA.map((question) => (
          <View key={question.id} style={styles.questionBlock}>
            <Text style={styles.questionTitle}>{question.title}</Text>
            {question.answers.map((answer) => (
              <QuizOption key={answer.id} text={answer.text} isSelected={selectedAnswers[question.id] === answer.id} onPress={() => handleSelectAnswer(question.id, answer.id)} />
            ))}
          </View>
        ))}
        
        {validationError && <Text style={styles.errorText}>{validationError}</Text>}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Finalizar e Ver Perfil</Text>
        </TouchableOpacity>
      </ScrollView>

      <SuccessModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        title="Quiz Finalizado!"
        message={`Seu perfil de investidor é: ${calculatedProfile}`}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0d1117' },
  container: { paddingHorizontal: 24, paddingTop: 70, paddingBottom: 40 },
  headerTitle: { color: 'white', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subHeader: { color: '#8b949e', fontSize: 16, textAlign: 'center', marginBottom: 40 },
  questionBlock: { 
    marginBottom: 24,
    backgroundColor: '#161b22',
    borderRadius: 12,
    padding: 20,
  },
  questionTitle: { color: '#c9d1d9', fontSize: 18, fontWeight: '600', marginBottom: 16, lineHeight: 24 },
  submitButton: { 
    backgroundColor: '#238636', 
    borderRadius: 8, 
    paddingVertical: 16, 
    alignItems: 'center', 
    marginTop: 20 
  },
  submitButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  errorText: {
    color: '#f85149',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 16,
  },
});