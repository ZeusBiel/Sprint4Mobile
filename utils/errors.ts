type AnyError = unknown;

export function safeMessage(err: AnyError): string {
  const raw = (err as any)?.message?.toString?.() ?? "";

  if (/network|timeout|conexao|conexão|offline/i.test(raw)) {
    return "Falha de conexão. Verifique sua internet e tente novamente.";
  }
  if (/auth|invalid|senha|password|unauthorized|permission|denied/i.test(raw)) {
    return "Credenciais inválidas ou acesso negado.";
  }
  if (/not[-\s]?found|nao encontrado|não encontrado/i.test(raw)) {
    return "Recurso não encontrado.";
  }

  // Mensagem padrão
  return "Não foi possível concluir a operação. Tente novamente em instantes.";
}

/**
 * Logger interno (para desenvolvimento). Evite enviar dados pessoais aqui.
 * Em produção, prefira um serviço de crash reporting com filtros.
 */
export function logError(err: AnyError, context?: string) {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${context ?? "app"}:`, err);
  }
}
