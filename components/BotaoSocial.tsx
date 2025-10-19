import React from 'react';
import { StyleSheet } from 'react-native';

// Componente removido pois não há mais login social
const BotaoSocial: React.FC = () => null;

const styles = StyleSheet.create({
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f6fc',
    borderWidth: 1,
    borderColor: 'rgba(27, 31, 35, 0.15)',
    width: '100%',
    padding: 14,
    borderRadius: 6,
    height: 52,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  texto: {
    color: '#24292e',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default BotaoSocial;