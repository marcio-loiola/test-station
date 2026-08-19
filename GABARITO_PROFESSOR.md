# Gabarito do Professor - Estação de Testes (Defeitos Intencionais)

Este documento descreve os 7 defeitos intencionalmente introduzidos na aplicação para fins didáticos de prática de testes funcionais.

---

## Defeito 1: Efeito Hidra ao Encerrar Chamados
- **ID Interno:** DEF-001
- **Funcionalidade Afetada:** Consulta e Edição de Chamados
- **Comportamento Esperado:** Ao alterar o status de um chamado para "Encerrado", o sistema deve simplesmente salvar o novo status sem criar novos registros.
- **Comportamento Defeituoso:** Ao marcar um chamado como "Encerrado", o sistema sofre de um "Efeito Hidra": o chamado é encerrado, mas o sistema automaticamente abre um novo chamado idêntico com status "Aberto", prefixado com "Reabertura automática: ".
- **Passos para Reprodução:** 
  1. Acessar a tela "Consultar Chamados".
  2. Identificar qualquer chamado na lista.
  3. Mudar o status na coluna correspondente para "Encerrado".
  4. Observar que, imediatamente, um novo chamado surge na tabela com o status "Aberto".
- **Severidade Sugerida:** Alta (Gera lixo no banco de dados e impede a finalização real de chamados).
- **Prioridade Sugerida:** Alta.

---

## Defeito 2: E-mail Duplicado no Cadastro de Usuário
- **ID Interno:** DEF-002
- **Funcionalidade Afetada:** Cadastro de Usuários
- **Comportamento Esperado:** O sistema deve impedir o cadastro de um novo usuário caso o e-mail informado já esteja em uso, independentemente de letras maiúsculas ou minúsculas (case-insensitive).
- **Comportamento Defeituoso:** O sistema permite o cadastro do mesmo e-mail caso haja diferença entre letras maiúsculas e minúsculas (a busca é case-sensitive). Ex: `aluno` e `Aluno` são considerados diferentes.
- **Passos para Reprodução:**
  1. Autenticar no sistema e acessar a aba "Usuários".
  2. Cadastrar um usuário com e-mail `aluno@senai.br` e salvar.
  3. Tentar cadastrar um novo usuário com e-mail `Aluno@senai.br` (com 'A' maiúsculo).
  4. Observar que o sistema aceita o cadastro e cria a duplicata na tabela.
- **Severidade Sugerida:** Alta (Permite inconsistência de dados de autenticação e contas duplicadas).
- **Prioridade Sugerida:** Alta.

---

## Defeito 3: Validação Inexistente do Tamanho da Senha
- **ID Interno:** DEF-003
- **Funcionalidade Afetada:** Cadastro de Usuários
- **Comportamento Esperado:** O campo de senha deve exigir um tamanho mínimo de caracteres (ex: 6 ou 8) por questões de segurança.
- **Comportamento Defeituoso:** O campo aceita qualquer string não vazia, permitindo senhas de apenas 1 ou 2 caracteres.
- **Passos para Reprodução:**
  1. Acessar a aba "Usuários".
  2. Preencher os dados de um novo usuário.
  3. No campo "Senha", digitar apenas `1`.
  4. Clicar em "Cadastrar Usuário".
  5. O usuário é cadastrado com sucesso.
- **Severidade Sugerida:** Alta (Vulnerabilidade de segurança).
- **Prioridade Sugerida:** Alta.

---

## Defeito 4: Alteração Indevida de Prioridade em Chamados de Rede
- **ID Interno:** DEF-004
- **Funcionalidade Afetada:** Abertura de Novo Chamado
- **Comportamento Esperado:** A prioridade salva no sistema deve ser exatamente a selecionada pelo usuário na interface.
- **Comportamento Defeituoso:** Caso a categoria selecionada seja "Rede", a prioridade é forçada para "Baixa" no momento da gravação, ignorando a seleção do usuário.
- **Passos para Reprodução:**
  1. Acessar "Abrir Chamado".
  2. Preencher título e descrição.
  3. Selecionar Categoria "Rede".
  4. Selecionar Prioridade "Alta".
  5. Salvar o chamado e ir para "Consultar Chamados".
  6. Observar que na listagem a prioridade do chamado aparece como "Baixa".
- **Severidade Sugerida:** Média (O dado é salvo de forma inconsistente, prejudicando a triagem correta dos problemas).
- **Prioridade Sugerida:** Média.

---

## Defeito 5: Busca de Chamados Sensível a Maiúsculas e Minúsculas
- **ID Interno:** DEF-005
- **Funcionalidade Afetada:** Consulta de Chamados (Filtro por texto)
- **Comportamento Esperado:** A busca por texto no título deve encontrar os chamados independentemente de letras maiúsculas ou minúsculas (case-insensitive).
- **Comportamento Defeituoso:** A busca é sensível à caixa (case-sensitive). "Impressora" e "impressora" retornam resultados diferentes.
- **Passos para Reprodução:**
  1. Acessar "Consultar Chamados".
  2. Identificar um chamado (ex: "Monitor não liga").
  3. No campo de busca, digitar "monitor" (em letras minúsculas).
  4. O chamado desaparece da lista, não sendo encontrado.
- **Severidade Sugerida:** Baixa (O recurso de busca funciona parcialmente e frustra o usuário, mas não corrompe dados).
- **Prioridade Sugerida:** Baixa/Média.

---

## Defeito 6: Filtro de Status "Em andamento" Falho
- **ID Interno:** DEF-006
- **Funcionalidade Afetada:** Consulta de Chamados (Filtro por status)
- **Comportamento Esperado:** Ao selecionar o filtro de status "Em andamento", a tabela deve exibir apenas os chamados com esse status.
- **Comportamento Defeituoso:** Ao selecionar "Em andamento", a lista fica vazia, pois internamente o código tenta buscar chamados com status "andamento" em vez de "Em andamento".
- **Passos para Reprodução:**
  1. Acessar "Consultar Chamados".
  2. Certificar-se de que existem chamados com o status "Em andamento" (se não houver, crie um ou mude o status de um existente).
  3. No seletor de "Filtrar por Status", escolher "Em andamento".
  4. A tabela ficará vazia.
- **Severidade Sugerida:** Média (Quebra o recurso de filtragem de uma funcionalidade principal).
- **Prioridade Sugerida:** Média.
