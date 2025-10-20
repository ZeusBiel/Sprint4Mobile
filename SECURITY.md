# Politica de segurança – Sprint4Mobile

Este documento descreve como tratamos segurança neste repositório (React Native/Expo, módulo Android e Firebase).

---

## 1) Contatos e divulgação responsável

- Para reportar vulnerabilidades, **abra uma issue marcada `security`** ou envie e-mail ao mantenedor (rm98565@fiap.com.br).
- Siga **divulgação responsável**: não publique PoC explorável antes de avaliarmos/corrigirmos.
- Não inclua dados sensíveis reais em issues, logs ou PRs (use dados fictícios).

---

## 2) SSDLC no CI/CD

Implementamos controles automáticos executados em **Pull Requests** e na **main**:

- **Lint & Test**: `npm run lint` e `npm test` (Jest) como pré-requisito de build.
- **SAST – Semgrep**: regras públicas + regras customizadas em `.semgrep/rules.yml` (busca segredos, código inseguro, uso de `Math.random()`, etc.).  
  - Upload de resultados para **Code scanning alerts** (GitHub).
- **SCA – Dependências**  
  - **Dependabot** cria PRs de atualização e alerta CVEs.  
  - **Snyk** (opcional): se `SNYK_TOKEN` estiver nos Secrets, roda `snyk test` e **quebra build em `high`**.  
  - Fallback automático: `npm audit --audit-level=high`.
- **DAST – OWASP ZAP** (opcional): se `DAST_TARGET_URL` estiver setado, roda baseline scan contra API dev/staging.

Arquivos:
- `.github/workflows/security-ci.yml`
- `.semgrep/rules.yml`
- `.github/dependabot.yml`

---

## 3) Proteção de branches e regras de PR

- **Branch `main` protegida**: exige PR e **status checks** do workflow de segurança.  
- **Sem `force-push`/delete** na `main`.  
- Recomendações de PR:  
  - Descrever a ameaça mitigada / CVE tratado.  
  - Anexar prints dos painéis *Security* quando a alteração for de segurança.

---

## 4) Gestão de segredos

- Nunca commitar segredos (API keys, tokens, certificados, `.env*`).  
- Usar **GitHub Secrets/Environments** para variáveis do pipeline.  
- Para **mobile (Expo/React Native)**:
  - Tokens/sessões **não** em `AsyncStorage`/`localStorage`; usar **`expo-secure-store`**.
  - Configs públicas (ex.: `firebaseConfig`) devem ter **regras de segurança server-side** (ex.: Firestore Rules, restrição de domínio/cliente).

---

## 5) Padrões de codificação segura

- **Entrada de usuário**: validar e normalizar (ex.: `zod`) antes de enviar ao backend.  
- **Erros**: não vazar stack/objeto de exceção em UI ou logs; usar mensagens genéricas ao usuário.  
- **Transporte**: somente HTTPS/TLS. Requisições `http://` são bloqueadas por SAST.  
- **Cripto**: não usar `Math.random()` para fins de segurança; preferir APIs criptográficas.  
- **Logs**: evitar `console.log`/`console.error` com dados pessoais/segredos; remover para produção.

---

## 6) LGPD (visão técnica)

- **Minimização**: coletar apenas dados necessários (e-mail e campos essenciais).  
- **Consentimento**: registrar aceite com versão e timestamp (ex.: `users/{uid}/consents/{version}`).  
- **Direitos do titular**: rotinas para **exportar** e **excluir** dados (ver `security/dataSubject.ts`).  
- **Criptografia em repouso**: tokens em `expo-secure-store`.  
- **Controle de acesso**: aplicar RBAC/regra por usuário no backend (ex.: `firestore.rules`).  
- **Testes de conformidade**: ver `__tests__/lgpd.test.ts`.

---

## 7) Triagem e priorização de vulnerabilidades

- Priorização por **CVSS** (GitHub/Snyk).  
- Criticidade **High/Critical**: bloquear merge até mitigação.  
- Dependências: aceitar PRs do Dependabot; preferir *patch/minor*; avaliar *major* caso a caso.

---

## 8) Checklist de revisão (antes de aprovar PR)

- [ ] Build e testes passaram.  
- [ ] Semgrep sem `ERROR` e alertas relevantes tratados.  
- [ ] Nenhum segredo em diff.  
- [ ] Mudanças de dependência revisadas (changelog/CVE).  
- [ ] Se tocar dados pessoais: checar itens da LGPD (consentimento, minimização, acesso).

---

## 9) Roadmap de hardening (próximos passos)

- CodeQL adicional para TS/JS (opcional).  
- Assinatura de commits (GPG).  
- Política de releases + SBOM (CycloneDX/Syft).  
- Monitoramento de runtime (crashes/privacidade).
