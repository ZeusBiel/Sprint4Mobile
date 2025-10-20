# Política de Privacidade e Proteção de Dados – Sprint4Mobile

Este documento descreve como os dados pessoais são tratados no projeto, em conformidade com a **Lei Geral de Proteção de Dados (LGPD – Lei 13.709/2018)** e boas práticas de privacidade em aplicações móveis.

---

## 1. Princípios de Tratamento de Dados Pessoais (LGPD Art. 6)

O projeto adota os seguintes princípios:

| Princípio        | Como é aplicado no projeto |
|------------------|---------------------------|
| **Finalidade**   | Dados são coletados exclusivamente para autenticação, personalização da experiência e funcionalidades do aplicativo. |
| **Necessidade**  | Coletamos apenas os dados mínimos (ex.: e-mail e senha). |
| **Transparência**| O usuário é informado sobre o uso dos dados e deve consentir. |
| **Segurança**    | Tokens são armazenados com `expo-secure-store` e comunicação ocorre apenas via HTTPS. |
| **Prevenção**    | Implementação de varreduras automáticas de vulnerabilidades e validação de código seguro (SSDLC). |
| **Não discriminação** | Nenhum dado é usado para fins discriminatórios. |

---

## 2. Dados coletados

| Tipo de dado     | Exemplos          | Base legal (LGPD)  | Justificativa técnica |
|------------------|------------------|---------------------|------------------------|
| Identificação    | e-mail, nome     | Art. 7, V – Execução de contrato | Necessário para login e criação de conta |
| Autenticação     | Token Firebase   | Consentimento ou contrato | Manter sessão do usuário de forma segura |
| Consentimento    | Aceite de termos | Art. 7, I – Consentimento | Necessário para registrar autorização |

---

## 3. Armazenamento e Segurança dos Dados

- **Em trânsito:** Todos os dados trafegam via HTTPS (TLS).
- **Em repouso:** Tokens e informações sensíveis são armazenados em `expo-secure-store`, protegidos por criptografia no dispositivo.
- Dados nunca são salvos em `AsyncStorage` ou localStorage (não seguro para dados sensíveis).
- O repositório contém regras de SAST (Semgrep) para detectar qualquer violação automaticamente no pipeline.

---

## 4. Direitos do Titular (LGPD Art. 18)

O usuário tem direito de:

- Confirmar se seus dados são tratados.
- Acessar seus dados pessoais.
- Solicitar correção ou exclusão.
- Solicitar portabilidade (exportação dos dados).
- Revogar consentimento a qualquer momento.

*Implementação técnica:* disponível no arquivo `security/dataSubject.ts`, com funções para exportar e excluir dados.

---

## 5. Consentimento e Registro de Aceite

- O usuário deve aceitar os termos na primeira autenticação.
- O aceite é registrado com:
  - UID do usuário
  - Data e hora do aceite (ISO timestamp)
  - Versão do termo
- Esse registro pode ser armazenado no Firebase (ex.: `users/{uid}/consents/{version}`).

---

## 6. Compartilhamento de Dados

- O projeto **não compartilha dados com terceiros**, exceto com provedores necessários (ex.: Firebase Authentication).
- O Firebase atua como **operador de dados** segundo a LGPD.

---

## 7. Eliminação de Dados

- Ao solicitar exclusão da conta, todos os dados associados serão apagados do banco de dados e o usuário será removido do provedor de autenticação.
- Implementação documentada em `security/dataSubject.ts`.

---

## 8. Medidas de Segurança Complementares

- CI/CD com validação de segurança (SSDLC).
- Semgrep detecta código inseguro e tokens expostos.
- Dependabot/Snyk monitoram dependências vulneráveis.
- Proibição de logs de dados sensíveis em produção.

---

## 9. Versão e Histórico de Atualizações

| Versão | Data       | Descrição da alteração |
|--------|-----------|------------------------|
| 1.0    | 2025-10-20 | Versão inicial da política de privacidade. |

---

## 10. Contato para questões de privacidade

Caso tenha dúvidas ou queira exercer seus direitos, entre em contato pelo e-mail indicado na seção de segurança do projeto ou abra uma solicitação via aplicativo.

