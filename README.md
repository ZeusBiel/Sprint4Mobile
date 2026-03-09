# Challenge XP - Investment Portfolio App

# Integrantes

- Gabriel Oliveira Rodrigues RM98565 / ZeusBiel
- Gabriel Riqueto RM98685 / gabriel-riqueto
- Leonardo Mansur RM551659
- João Pedro de Souza Vieira Rm99805

## Iniciar Projeto

1. Instalar dependências

```bash
npm install
```

2. Iniciar servidor de desenvolvimento

```bash
npx expo start
```

3. Rodar no emulador/dispositivo

```bash
# Android
npx expo run:android

# iOS (Mac)
npx expo run:ios
```

## Regras recomendadas do Firestore

Para evitar erros de permissão (permission-denied) no envio do quiz ou atualizações do perfil, crie um arquivo `firestore.rules` com o conteúdo fornecido no repositório e publique no Console do Firebase ou via Firebase CLI.

## Funcionalidades implementadas
- Autenticação por e-mail (Firebase Auth)
- CRUD básico para perfil e investimentos (via `utils/firebaseOperations.ts`)
- Quiz de perfil que grava resultado no Firestore
- Tratamento de erros com mensagens ao usuário e logs
- Offline cache básico e retry automático para operações

## Testes e debug
- Logs de `AuthContext` e `saveQuizResults` são exibidos no console Metro — verifique ao reproduzir erros.

## Observações
- Se você receber `permission-denied` ao salvar o quiz, publique as regras do Firestore recomendadas em `firestore.rules`.

## Scripts úteis
- `npm start` - inicia o Metro/Expo
- `npm run android` - build Android (requer Android SDK)
- `npm run ios` - build iOS (Mac)

## Contato
- Projeto mantido por Gabriel Oliveira (ZeusBiel)
