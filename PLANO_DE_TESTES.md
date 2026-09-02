# Plano Mestre de Testes - Estação de Testes SENAI

Este documento consolida todos os casos de teste previstos para o sistema, abrangendo testes manuais exploratórios (Caixa Preta) e testes unitários automatizados (via Vitest). Ele serve como guia definitivo para o aluno validar as entregas.

## 1. Testes Manuais Funcionais (Caixa Preta)

### Módulo de Autenticação e Gestão de Usuários
* **CT-MANUAL-001 (Caminho Feliz):** Login Válido (Usuário e senha corretos redirecionam para o Dashboard).
* **CT-MANUAL-002 (Caminho Feliz):** Criação de Novo Usuário Válido (Preenchimento correto adiciona usuário à tabela).
* **CT-MANUAL-003 (Exceção / Defeito):** Validação de E-mail Case-Sensitive (Sistema deve bloquear cadastro de `Aluno@...` se `aluno@...` já existir).
* **CT-MANUAL-004 (Exceção / Defeito):** Validação de Senha Curta (Testar recusa de senha com menos de 6 caracteres, ex: `1`).

### Módulo de Abertura de Chamados
* **CT-MANUAL-005 (Caminho Feliz):** Abertura de Chamado - Categoria Software com Prioridade Média.
* **CT-MANUAL-006 (Exceção / Defeito):** Abertura de Chamado - Categoria Hardware com Prioridade Alta (Garante que o sistema não rebaixará a prioridade para `Baixa`).
* **CT-MANUAL-007 (Exceção / Defeito):** Submissão de Chamado em Branco (Garante o bloqueio do formulário ao tentar enviar sem Título e Descrição).

### Módulo de Consulta, Filtros e Dashboard
* **CT-MANUAL-008 (Exceção / Defeito):** Busca Textual Case-Insensitive (Buscar por `monitor` em minúsculas deve retornar o chamado "Monitor não liga").
* **CT-MANUAL-009 (Exceção / Defeito):** Filtro de Status "Em andamento" (Deve retornar corretamente a listagem correspondente).
* **CT-MANUAL-010 (Exceção / Defeito):** Métrica de Chamados Abertos no Dashboard (Garante que o número total considera chamados de prioridade "Baixa").

### Módulo de Edição e Regressões
* **CT-MANUAL-011 (Regressão / Efeito Colateral):** Combinação de Filtro de Status e Busca Textual (Garante que a interseção `AND` funciona; a busca de texto não pode sobrescrever e anular o filtro de status).
* **CT-MANUAL-012 (Regressão / Efeito Colateral):** Edição de Status (Ao mudar um status para `Em andamento`, a prioridade original deve ser estritamente mantida, não resetada para `Média`).
* **CT-MANUAL-013 (Defeito Original / Efeito Hidra):** Alterar Status para `Encerrado` (Sistema não deve clonar/reabrir um novo chamado automático após encerramento).

---

## 2. Testes Unitários Automatizados (Vitest)

Os testes automatizados foram desenhados visando aplicar diretamente no código as metodologias de **Análise de Valor Limite (BVA)** e **Partição de Equivalência**. Todos devem ser validados rodando o comando correspondente no repositório.

### Regra 1: Validação de Senha (Mínimo de 6 Caracteres)
* **CT-UNIT-001 (Classe Inválida):** Deve retornar `false` ao receber senha vazia (`''`) ou nula.
* **CT-UNIT-002 (BVA - Limite Inferior):** Deve retornar `false` ao receber senha com 5 caracteres (`'12345'`).
* **CT-UNIT-003 (BVA - No Limite):** Deve retornar `true` ao receber senha com exatamente 6 caracteres (`'123456'`).
* **CT-UNIT-004 (BVA - Limite Superior):** Deve retornar `true` ao receber senha com 7 caracteres (`'1234567'`).
* **CT-UNIT-005 (Classe Válida):** Deve retornar `true` ao receber uma senha válida longa (`'SenhaForte123'`).

### Regra 2: Validação de Título de Chamado (Mínimo de 5 Caracteres)
* **CT-UNIT-006 (Classe Inválida):** Deve retornar `false` ao receber título em branco ou com apenas espaços em branco (`'   '`).
* **CT-UNIT-007 (BVA - Limite Inferior):** Deve retornar `false` ao receber título com 4 caracteres (`'Rede'`).
* **CT-UNIT-008 (BVA - No Limite):** Deve retornar `true` ao receber título com exatamente 5 caracteres (`'Mouse'`).
* **CT-UNIT-009 (BVA - Limite Superior):** Deve retornar `true` ao receber título com 6 caracteres (`'Teclas'`).

### Regra 3: Validação de Duplicidade de E-mail (Case-Insensitive)
* **CT-UNIT-010 (Comportamento Case-Insensitive):** O validador deve retornar `true` (duplicado) caso o e-mail inserido já conste na base, mesmo se digitado com variação de maiúsculas/minúsculas (Ex: Identificar `'Aluno@senai.br'` como duplicado caso `'aluno@senai.br'` exista).
* **CT-UNIT-011 (Comportamento Caminho Feliz):** O validador deve retornar `false` (disponível) ao validar um e-mail que é de fato inédito.
