// =======================================================
// ESTAÇÃO DE TESTES SENAI — MÓDULO DE VALIDADORES PURAS
// =======================================================
// Funções puras desacopladas para validação de regras de negócio,
// permitindo a prática de Testes Unitários com Vitest e Testes de Caixa Preta
// (Partição de Equivalência e Análise de Valor Limite - BVA).

/**
 * Valida se a senha atende ao comprimento mínimo exigido pelo requisito RF-002.
 * Regra: Mínimo de 6 caracteres.
 *
 * Partição de Equivalência:
 * - Inválida: < 6 caracteres (ex: 3 caracteres)
 * - Válida: >= 6 caracteres (ex: 8 caracteres)
 *
 * Análise de Valor Limite (BVA):
 * - 5 caracteres -> false (abaixo do limite)
 * - 6 caracteres -> true  (no limite)
 * - 7 caracteres -> true  (acima do limite)
 */
function validarSenha(senha) {
  if (!senha || typeof senha !== "string") return false;
  return senha.length >= 6;
}

// Comentário Teste

/**
 * Valida se o título do chamado atende ao tamanho mínimo exigido pelo requisito RF-003.
 * Regra: Mínimo de 5 caracteres.
 *
 * Partição de Equivalência:
 * - Inválida: Vazio ou < 5 caracteres
 * - Válida: >= 5 caracteres
 *
 * Análise de Valor Limite (BVA):
 * - 4 caracteres -> false (ex: "Erro")
 * - 5 caracteres -> true  (ex: "Mouse")
 * - 6 caracteres -> true  (ex: "Teclas")
 */
function validarTituloChamado(titulo) {
  if (!titulo || typeof titulo !== "string") return false;
  return titulo.trim().length >= 5;
}

/**
 * Valida a existência de e-mail duplicado no cadastro de usuários (RF-002).
 * Retorna true se o e-mail já existe (duplicado), false se está disponível.
 */
function validarEmailDuplicado(
  email,
  usuariosExistentes = [],
  caseSensitive = false,
) {
  if (!email || typeof email !== "string") return false;
  const emailLimpo = email.trim();
  if (caseSensitive) {
    return usuariosExistentes.some((u) => u.email === emailLimpo);
  }
  return usuariosExistentes.some(
    (u) => (u.email || "").toLowerCase() === emailLimpo.toLowerCase(),
  );
}

// Exportação universal (Browser e Node.js/Vitest)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    validarSenha,
    validarTituloChamado,
    validarEmailDuplicado,
  };
}
if (typeof window !== "undefined") {
  window.Validadores = {
    validarSenha,
    validarTituloChamado,
    validarEmailDuplicado,
  };
}
