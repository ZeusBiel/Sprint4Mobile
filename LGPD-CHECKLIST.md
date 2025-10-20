# Checklist de Conformidade com a LGPD – Sprint4Mobile

Este documento comprova que o projeto está alinhado com os requisitos técnicos da LGPD, conforme exigência do ciclo de desenvolvimento seguro (SSDLC) e do slide de conformidade com privacidade.

---

## 1. Princípios Atendidos

| Item LGPD                                    | Status | Evidência Técnica                                 |
|---------------------------------------------|--------|---------------------------------------------------|
| Minimização de dados                        | ok   | Apenas e-mail e campos essenciais são coletados  |
| Finalidade específica                        |ok     | Dados usados somente para autenticação e uso do app |
| Consentimento expresso                      | ok    | Rotina de aceite declarada no primeiro login     |
| Segurança da informação                     |ok     | Tokens criptografados em `expo-secure-store`     |
| Prevenção e monitoramento                   | ok     | Pipeline com Semgrep, Dependabot e Snyk          |
| Direito de exclusão e portabilidade         |ok     | Funções implementadas em `security/dataSubject.ts` |

---

## 2. Segurança dos Dados

| Controle de Segurança | Implementação |
|----------------------|----------------|
| Criptografia em trânsito | HTTPS (Firebase + APIs) |
| Criptografia em repouso  | `expo-secure-store` para tokens |
| Armazenamento seguro     | Nenhum dado sensível em AsyncStorage/localStorage |
| Monitoramento automático | CI/CD com SAST (Semgrep) e SCA (Dependabot/Snyk) |
| Alertas de vulnerabilidade | Habilitados no GitHub Security Dashboard |

---

## 3. Automatização no Pipeline (Slide 3 – “LGPD no CI/CD”)

| Validação       | Ferramenta         | Status |
|-----------------|-------------------|--------|
| Código inseguro  | Semgrep SAST       | Ativo e automatizado |
| Bibliotecas com CVE | Dependabot/Snyk  | Monitoramento contínuo |
| Teste de conformidade LGPD | `__tests__/lgpd.test.ts` | Incluído |

---

## 4. Direitos do Titular

| Direito do usuário             | Implementado | Como acessar |
|------------------------------|--------------|--------------|
| Confirmar tratamento         | ok        | Tela de conta / API |
| Acessar seus dados           | ok            | Função exportMyData() |
| Excluir dados e conta        | ok            | Função deleteMyData() |
| Revogar consentimento        | ok           | Atualização de consentimento via interface |
| Portabilidade                | ok            | Exportação JSON em security/dataSubject.ts |

---

## 5. Registro de Consentimento

- O usuário deve aceitar os termos no cadastro.
- O aceite é armazenado com:
  - **UID do usuário**
  - **Data e hora**
  - **Versão do termo**
- Evidências em `PRIVACY.md` e rotina técnica no código.

---

## 6. Regras de Acesso (RBAC)

- Apenas o usuário autenticado pode acessar seus próprios dados.
- Acesso é controlado por regras do Firebase ou backend.
- Proibição de acesso anônimo ou indevido é validada automaticamente no SAST.

---
