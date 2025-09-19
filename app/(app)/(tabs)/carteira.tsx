import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import BotaoPrincipal from '@/components/BotaoPrincipal';

export default function CarteiraScreen() {
  const screenWidth = Dimensions.get('window').width;

  const data = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        data: [15000, 15250, 15100, 15800, 16100, 16500],
        color: (opacity = 1) => `rgba(35, 134, 54, ${opacity})`,
        strokeWidth: 3,
      },
    ],
    legend: ['Evolução Patrimonial'],
  };

  const chartConfig = {
    backgroundGradientFrom: '#161b22',
    backgroundGradientTo: '#161b22',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(201, 209, 217, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(139, 148, 158, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#238636',
    },
    useShadows: false,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sua Carteira</Text>
          <Text style={styles.totalValue}>R$ 17.253,50</Text>
          <Text style={styles.dailyPerformance}>+ R$ 152,10 (0,88%) hoje</Text>
        </View>

        <LineChart
          data={data}
          width={screenWidth - 32}
          height={250}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />

        <View style={styles.buttonContainer}>
          <BotaoPrincipal titulo="VER SEUS ATIVOS" rota="/seus-ativos" style={styles.botao} />
          <BotaoPrincipal titulo="VER RECOMENDAÇÕES" rota="/recomendacoes" style={styles.botao} />
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
    paddingTop: 70,
    paddingHorizontal: 16 
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: { 
    color: '#8b949e', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  totalValue: {
    color: '#c9d1d9',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 8,
  },
  dailyPerformance: {
    color: '#238636',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
  },
  chart: {
    borderRadius: 16,
    marginBottom: 40,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
    gap: 20,
    width: '100%',
  },
  botao: {
    width: '80%',
    alignSelf: 'center',
  },
});
