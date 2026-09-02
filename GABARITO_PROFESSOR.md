# Gabarito do Professor — Estação de Testes SENAI (Aula Final de Testes de Sistemas)

> **DOCUMENTO CONFIDENCIAL DO CORPO DOCENTE — NÃO COMPARTILHAR COM OS ALUNOS**
> Este guia é o material de referência definitivo para a aula prática de fechamento da Unidade Curricular de Testes de Sistemas. Contém o mapeamento completo de requisitos, matriz de rastreabilidade, mapa pedagógico, fichas técnicas de defeitos, técnicas de caixa preta (Partição de Equivalência e Análise de Valor Limite), níveis de teste, testes automatizados com Vitest, roteiro de demonstração do professor, casos de reteste e testes de regressão.

---

## 1. Visão Geral e Dinâmica da Aula Prática (50 min)

A aplicação foi desenvolvida e adaptada para atuar como um **objeto pedagógico de investigação**, permitindo aos estudantes praticar a seleção de procedimentos de teste (competência C8) e percorrer todo o fluxo profissional de Qualidade de Software:

$$\text{Requisito} \longrightarrow \text{Selecionar Teste} \longrightarrow \text{Executar} \longrightarrow \text{Comparar (Esperado vs. Obtido)} \longrightarrow \text{Encontrar Falha} \longrightarrow \text{Registrar Evidência} \longrightarrow \text{Retestar na Versão B} \longrightarrow \text{Verificar Regressão} \longrightarrow \text{Documentar}$$

### Estrutura de Versões Didáticas:
- **Versão A (Build 1.0.0 — Inicial com Falhas):** Os alunos executam os casos de teste planejados, descobrem discrepâncias entre resultado esperado e obtido e documentam relatórios de bugs.
- **Versão B (Build 1.1.0 — Corrigida + Regressão):** O professor/aluno avança a versão. Os alunos retestam os bugs antigos e executam testes de regressão para descobrir novos efeitos colaterais.

---

## 2. Rastreabilidade de Requisitos Funcionais

| Identificador | Requisito Funcional | Regra de Negócio / Critério de Aceite |
|---|---|---|
| **RF-001** | Autenticação (Login) | Acesso exclusivo com credenciais cadastradas. Exibição de mensagem clara de erro caso o usuário ou senha estejam incorretos. |
| **RF-002** | Cadastro de Usuários | Nome obrigatório (>= 3 chars). E-mail único e insensível a maiúsculas/minúsculas (case-insensitive). Senha obrigatória com **mínimo de 6 caracteres** (regra para BVA e Partição de Equivalência). |
| **RF-003** | Abertura de Chamados | Título obrigatório (**mínimo 5 caracteres** - regra para BVA). Descrição obrigatória (mínimo 10 caracteres). A prioridade selecionada deve ser rigorosamente respeitada para todas as categorias (Hardware, Software, Rede, Outros). |
| **RF-004** | Consulta e Edição de Chamados | Tabela de chamados com busca textual por título (case-insensitive) e filtro por status (Aberto, Em andamento, Encerrado). A alteração de status deve atualizar apenas o registro selecionado, preservando todos os demais atributos (como prioridade). |
| **RF-005** | Dashboard e Indicadores | Cards informativos com contagem precisa de chamados nos status: "Aberto", "Em andamento" e "Encerrado". |

---

## 3. Mapa Pedagógico Final da Aplicação

| Requisito | Funcionalidade | Tipo de Teste | Defeito Possível | Técnica de Caixa Preta | Reteste na Versão B | Regressão na Versão B |
|---|---|---|---|---|---|---|
| **RF-001** | Login | Sistema / Funcional | Credenciais inválidas aceitas ou erro genérico | Partição de Equivalência (Login válido vs inválido) | N/A (Estável) | Não |
| **RF-002** | Cadastro de Usuários | Sistema / Funcional | E-mail duplicado aceito com maiúsculas (`DEF-002`) | Partição de Equivalência (E-mail novo vs existente) | Permanece aberto | Não |
| **RF-002** | Cadastro de Usuários | Unitário / Sistema | Senha fraca com 1 caractere aceita (`DEF-003`) | **Análise de Valor Limite (BVA)** (5, 6, 7 chars) | **Sim (Aprovado)** | Não |
| **RF-003** | Abertura de Chamado | Sistema / Funcional | Hardware força prioridade Baixa (`DEF-001` / CT-PRIORIDADE-001) | Partição de Equivalência (Hardware/Alta vs outras) | **Sim (Aprovado)** | Não |
| **RF-003** | Abertura de Chamado | Unitário / Sistema | Permite título em branco ou < 5 chars (`DEF-006`) | **Análise de Valor Limite (BVA)** (4, 5, 6 chars no título) | **Sim (Aprovado)** | Não |
| **RF-004** | Consulta de Chamados | Sistema / Funcional | Busca por título case-sensitive (`DEF-004`) | Partição de Equivalência (Termo minúsculo vs maiúsculo) | **Sim (Aprovado)** | **Sim (`DEF-REG-002`)** |
| **RF-004** | Consulta de Chamados | Sistema / Funcional | Filtro "Em andamento" retorna lista vazia (`DEF-005`) | Partição de Equivalência (Status existente vs inexistente) | **Sim (Aprovado)** | **Sim (`DEF-REG-002`)** |
| **RF-004** | Edição de Chamados | Integração / Sistema | Efeito Hidra ao encerrar chamado (`DEF-008`) | Teste de Transição de Estado (Aberto $\to$ Encerrado) | **Sim (Aprovado)** | **Sim (`DEF-REG-001`)** |
| **RF-004** | Edição de Status *(Regressão)* | Integração / Regressão | Alterar status para "Em andamento" reseta prioridade para Média (`DEF-REG-001`) | Teste de Regressão / Preservação de Atributos | N/A | **Sim (Novo Bug na B)** |
| **RF-004** | Filtros Combinados *(Regressão)* | Sistema / Regressão | Busca por texto ignora e anula o filtro de status selecionado (`DEF-REG-002`) | Teste Combinatório / Regressão de Filtros | N/A | **Sim (Novo Bug na B)** |
| **RF-005** | Dashboard | Integração / Sistema | Card "Abertos" ignora chamados de prioridade Baixa (`DEF-007`) | Teste de Consistência de Dados (Soma de Itens) | **Sim (Aprovado)** | Não |

---

## 4. Fichas Detalhadas dos Defeitos (Autoauditoria)

### **DEF-001: Alteração Indevida de Prioridade em Chamados de Hardware (Caso do Professor)**
- **Requisito:** `RF-003` (Abertura de Chamados)
- **Funcionalidade:** Formulário de Novo Chamado (`novo.html`)
- **Comportamento Esperado:** O chamado deve ser gravado e exibido exatamente com a prioridade selecionada pelo usuário.
- **Comportamento Obtido (Versão A):** Ao selecionar categoria `Hardware` e prioridade `Alta`, o sistema grava `Baixa`.
- **Passos para Reprodução:**
  1. Acessar "Abrir Chamado".
  2. Informar Título: `Impressora Sem Conexão`.
  3. Categoria: `Hardware`.
  4. Prioridade: `Alta`.
  5. Descrição: `Impressora da sala 02 não responde na rede.`.
  6. Clicar em "Abrir Chamado".
  7. Ir em "Consultar Chamados" e inspecionar a coluna "Prioridade".
- **Dados Necessários:** Categoria Hardware + Prioridade Alta.
- **Severidade Sugerida:** Alta (Inconsistência de dado crítico para atendimento).
- **Prioridade Sugerida:** Alta.
- **Status:** Aberto na Versão A / Corrigido na Versão B.
- **Versão de Origem:** Versão A.
- **Versão de Correção:** Versão B.

---

### **DEF-002: Duplicação de E-mail por Falha de Comparação Case-Sensitive**
- **Requisito:** `RF-002` (Cadastro de Usuários)
- **Funcionalidade:** Tela de Usuários (`usuarios.html`)
- **Comportamento Esperado:** O sistema deve rejeitar cadastros com e-mail já existente, independentemente de maiúsculas/minúsculas (`aluno@senai.br` e `Aluno@senai.br` devem ser tratados como idênticos).
- **Comportamento Obtido (Versão A e B):** O sistema aceita a duplicação se houver variação de caixa.
- **Passos para Reprodução:**
  1. Ir em "Usuários".
  2. Cadastrar usuário com e-mail `aluno@senai.br`.
  3. Cadastrar outro usuário com e-mail `Aluno@senai.br`.
  4. Ambos os registros são criados na tabela.
- **Severidade Sugerida:** Alta (Inconsistência de identidade e integridade de contas).
- **Prioridade Sugerida:** Alta.
- **Status:** Aberto na Versão A e B.

---

### **DEF-003: Ausência de Validação de Tamanho Mínimo de Senha**
- **Requisito:** `RF-002` (Cadastro de Usuários)
- **Funcionalidade:** Tela de Usuários (`usuarios.html`)
- **Comportamento Esperado:** Exigir no mínimo 6 caracteres para a senha.
- **Comportamento Obtido (Versão A):** O sistema aceita senhas de apenas 1 caractere (ex: `1`).
- **Passos para Reprodução:**
  1. Acessar "Usuários".
  2. Preencher Nome, E-mail e Perfil.
  3. No campo Senha, digitar apenas `1`.
  4. Clicar em "Cadastrar Usuário".
  5. O cadastro é aceito com sucesso sem mensagens de validação.
- **Severidade Sugerida:** Alta (Vulnerabilidade de segurança).
- **Prioridade Sugerida:** Alta.
- **Status:** Aberto na Versão A / Corrigido na Versão B.
- **Versão de Origem:** Versão A.
- **Versão de Correção:** Versão B.

---

### **DEF-004: Busca de Chamados Sensível a Maiúsculas e Minúsculas**
- **Requisito:** `RF-004` (Consulta de Chamados)
- **Funcionalidade:** Campo de Busca por Título (`consulta.html`)
- **Comportamento Esperado:** A busca deve localizar registros independentemente de letras maiúsculas/minúsculas.
- **Comportamento Obtido (Versão A):** A busca exige correspondência exata de caixa ("monitor" não encontra "Monitor não liga").
- **Passos para Reprodução:**
  1. Ir em "Consultar Chamados".
  2. No campo de busca, digitar `monitor` (em minúsculas).
  3. O chamado `#1 - Monitor não liga` desaparece da tabela.
- **Severidade Sugerida:** Média (Dificulta a localização de dados).
- **Prioridade Sugerida:** Média.
- **Status:** Aberto na Versão A / Corrigido na Versão B.
- **Versão de Origem:** Versão A.
- **Versão de Correção:** Versão B.

---

### **DEF-005: Filtro por Status "Em andamento" Retorna Tabela Vazia**
- **Requisito:** `RF-004` (Consulta de Chamados)
- **Funcionalidade:** Dropdown "Filtrar por Status" (`consulta.html`)
- **Comportamento Esperado:** Exibir todos os chamados com status "Em andamento".
- **Comportamento Obtido (Versão A):** A listagem fica vazia devido à busca interna por `andamento` em vez de `Em andamento`.
- **Passos para Reprodução:**
  1. Acessar "Consultar Chamados".
  2. No filtro de status, selecionar `Em andamento`.
  3. A tabela exibe "Nenhum chamado encontrado".
- **Severidade Sugerida:** Média (Inutiliza o recurso de filtragem).
- **Prioridade Sugerida:** Média.
- **Status:** Aberto na Versão A / Corrigido na Versão B.
- **Versão de Origem:** Versão A.
- **Versão de Correção:** Versão B.

---

### **DEF-006: Submissão de Chamado com Campos Obrigatórios em Branco**
- **Requisito:** `RF-003` (Abertura de Chamados)
- **Funcionalidade:** Formulário de Novo Chamado (`novo.html`)
- **Comportamento Esperado:** O sistema deve validar e impedir a submissão de chamados sem Título e Descrição.
- **Comportamento Obtido (Versão A):** O formulário submete sem validação, gerando registros em branco no banco.
- **Passos para Reprodução:**
  1. Ir em "Abrir Chamado".
  2. Deixar Título e Descrição em branco.
  3. Clicar em "Abrir Chamado".
  4. O chamado vazio é criado com sucesso.
- **Severidade Sugerida:** Média (Corrupção de integridade).
- **Prioridade Sugerida:** Média.
- **Status:** Aberto na Versão A / Corrigido na Versão B.
- **Versão de Origem:** Versão A.
- **Versão de Correção:** Versão B.

---

### **DEF-007: Subcontagem de Chamados Abertos no Dashboard**
- **Requisito:** `RF-005` (Dashboard e Indicadores)
- **Funcionalidade:** Card "Chamados Abertos" (`dashboard.html`)
- **Comportamento Esperado:** Exibir o total exato de chamados com status "Aberto".
- **Comportamento Obtido (Versão A):** O contador de abertos descarta chamados com prioridade "Baixa", gerando divergência em relação à tabela de consulta.
- **Passos para Reprodução:**
  1. Verificar a listagem de chamados abertos.
  2. Acessar o "Dashboard".
  3. Notar a divergência numérica no card "Chamados Abertos".
- **Severidade Sugerida:** Média (Informação gerencial distorcida).
- **Prioridade Sugerida:** Média.
- **Status:** Aberto na Versão A / Corrigido na Versão B.
- **Versão de Origem:** Versão A.
- **Versão de Correção:** Versão B.

---

### **DEF-008: Efeito Hidra ao Encerrar Chamados**
- **Requisito:** `RF-004` (Consulta e Edição de Chamados)
- **Funcionalidade:** Seletor de Status na Tabela (`consulta.html`)
- **Comportamento Esperado:** Alterar o status do chamado selecionado para "Encerrado".
- **Comportamento Obtido (Versão A):** Ao alterar para "Encerrado", o sistema cria automaticamente um novo chamado "Aberto" prefixado com "Reabertura automática: ".
- **Passos para Reprodução:**
  1. Ir em "Consultar Chamados".
  2. No dropdown de status de qualquer chamado, selecionar `Encerrado`.
  3. Um novo chamado "Aberto" surge imediatamente na tabela.
- **Severidade Sugerida:** Alta (Impede encerramento real e polui o banco).
- **Prioridade Sugerida:** Alta.
- **Status:** Aberto na Versão A / Corrigido na Versão B.
- **Versão de Origem:** Versão A.
- **Versão de Correção:** Versão B.

---

### **DEF-REG-001: Efeito Colateral na Edição de Status (Regressão na Versão B)**
- **Requisito:** `RF-004` (Consulta e Edição de Chamados)
- **Funcionalidade:** Edição de Status na Tabela (`consulta.html`)
- **Comportamento Esperado:** Alterar apenas o status do chamado, preservando a prioridade original (`Alta` ou `Baixa`).
- **Comportamento Obtido (Versão B):** Ao alterar o status de qualquer chamado para "Em andamento", a prioridade do chamado é inadvertidamente sobrescrita para "Média".
- **Passos para Reprodução:**
  1. Estar na **Versão B**.
  2. Identificar o chamado `#1 - Monitor não liga` (Prioridade `Alta`, Status `Aberto`).
  3. Mudar o status na tabela para `Em andamento`.
  4. Observar que a prioridade do chamado muda automaticamente para `Média`.
- **Severidade Sugerida:** Alta (Corrupção colateral durante reteste).
- **Prioridade Sugerida:** Alta.
- **Status:** Novo defeito introduzido na Versão B (Efeito Colateral de Regressão).
- **Versão de Origem:** Versão B.

---

### **DEF-REG-002: Sobreposição do Filtro de Status pela Busca Textual (Regressão na Versão B)**
- **Requisito:** `RF-004` (Consulta de Chamados)
- **Funcionalidade:** Filtros Combinados (`consulta.html`)
- **Comportamento Esperado:** Ao aplicar busca por texto E filtro de status simultaneamente, exibir apenas registros que atendem aos dois critérios cumulativamente (`AND`).
- **Comportamento Obtido (Versão B):** Quando há texto no campo de busca, o filtro de status selecionado é completamente ignorado.
- **Passos para Reprodução:**
  1. Estar na **Versão B**.
  2. Selecionar o filtro de status: `Aberto`.
  3. No campo de busca, digitar `Sistema` (chamado cujo status é `Em andamento`).
  4. O chamado `#2 - Sistema lento` é exibido, violando o filtro ativo de status `Aberto`.
- **Severidade Sugerida:** Média (Inconsistência em consultas combinadas).
- **Prioridade Sugerida:** Média.
- **Status:** Novo defeito introduzido na Versão B (Efeito Colateral de Regressão).
- **Versão de Origem:** Versão B.

---

## 5. Técnicas de Caixa Preta: Partição de Equivalência e Análise de Valor Limite

### 5.1. Regra de Senha no Cadastro de Usuários (RF-002)
- **Regra de Negócio:** A senha deve conter **no mínimo 6 caracteres**.
- **Partição de Equivalência:**
  - *Classe Inválida:* Senhas com tamanho $< 6$ caracteres (ex: `123`, `abc`).
  - *Classe Válida:* Senhas com tamanho $\ge 6$ caracteres (ex: `Senha123`, `123456`).
- **Análise de Valor Limite (BVA):**
  - **5 caracteres:** Imediatamente abaixo do limite $\to$ **Resultado Esperado: Inválido (Erro)**.
  - **6 caracteres:** No limite da fronteira $\to$ **Resultado Esperado: Válido (Aceito)**.
  - **7 caracteres:** Imediatamente acima do limite $\to$ **Resultado Esperado: Válido (Aceito)**.

### 5.2. Regra de Título do Chamado (RF-003)
- **Regra de Negócio:** O título do chamado deve possuir **no mínimo 5 caracteres**.
- **Partição de Equivalência:**
  - *Classe Inválida:* Vazio ou $< 5$ caracteres (ex: `Rede`, `Bug`).
  - *Classe Válida:* $\ge 5$ caracteres (ex: `Mouse`, `Teclado falhando`).
- **Análise de Valor Limite (BVA):**
  - **4 caracteres:** Imediatamente abaixo $\to$ **Inválido / Rejeitado**.
  - **5 caracteres:** No limite $\to$ **Válido / Aceito**.
  - **6 caracteres:** Imediatamente acima $\to$ **Válido / Aceito**.

---

## 6. Níveis de Teste na Aplicação

1. **Teste Unitário (Função Isolada):**
   - Funções puras em `validadores.js` (`validarSenha`, `validarTituloChamado`, `validarEmailDuplicado`).
   - Testadas diretamente via Vitest (`validadores.test.js`).
2. **Teste de Integração (Interação entre Módulos/Componentes):**
   - Interação entre submissão de formulário, persistência no `localStorage` e renderização em tabela.
   - Exemplo: Atualizar status e verificar impacto no contador do Dashboard.
3. **Teste de Sistema / Caixa Preta (Comportamento Completo Observado pelo Usuário):**
   - Execução ponta a ponta dos fluxos de Login, Abertura e Consulta.
4. **Teste de Regressão (Verificação Pós-Correção):**
   - Execução de casos em módulos vizinhos após a transição para a Versão B.

---

## 7. Demonstração de Testes Automatizados com Vitest

O projeto inclui o módulo desacoplado `validadores.js` e a suíte `validadores.test.js`.

### Como Executar os Testes Unitários:
```bash
# Instalar dependências (uma única vez)
npm install

# Executar a suíte de testes com Vitest
npm test

# Executar em modo interativo/watch
npm run test:watch
```

### Demonstração Didática para Alunos (PASSOU $\to$ alteração $\to$ FALHOU):
1. Execute `npm test` e mostre que todos os testes unitários passaram.
2. No arquivo `validadores.js`, altere propositalmente a regra de senha para `senha.length >= 8`.
3. Execute `npm test` novamente e mostre aos alunos o teste `validarSenha('123456')` falhando com relatório detalhado de discrepância.

---

## 8. Roteiro de Demonstração do Caso do Professor (Abertura da Aula)

### **Caso de Teste: CT-PRIORIDADE-001**
- **Objetivo:** Verificar se o sistema mantém a prioridade escolhida ao criar um chamado.
- **Dados de Entrada:**
  - **Título:** `Impressora Sem Conexão`
  - **Descrição:** `Impressora da sala 02 não responde na rede.`
  - **Categoria:** `Hardware`
  - **Prioridade:** `Alta`
- **Passos de Execução:**
  1. Acessar **Abrir Chamado** (`novo.html`).
  2. Preencher os dados informados.
  3. Clicar em **Abrir Chamado**.
  4. Acessar **Consultar Chamados** (`consulta.html`).
  5. Inspecionar a coluna **Prioridade** do chamado criado.
- **Comportamento na VERSÃO A (Demonstração do Defeito):** A prioridade é registrada como **Baixa**.
- **Comportamento na VERSÃO B (Reteste):** A prioridade é registrada e mantida como **Alta**.

---

## 9. Matriz de Casos de Teste (Caminho Feliz, Falhas, Reteste e Regressão)

### 9.1. Casos Bons (Caminho Feliz — Devem Passar em Ambas as Versões)
| ID Caso | Requisito | Cenário | Dados de Teste | Resultado Esperado |
|---|---|---|---|---|
| **CT-LOGIN-001** | RF-001 | Login Administrador | `usuario.teste@senai.br` / `SenhaValida123` | Login aceito, redireciona ao Dashboard. |
| **CT-LOGIN-002** | RF-001 | Login Estudante | `aluno` / `123` | Login aceito, redireciona ao Dashboard. |
| **CT-CHAMADO-001** | RF-003 | Abertura Válida (Software) | Software, Média, Título >= 5 chars | Chamado salvo com prioridade Média. |
| **CT-CHAMADO-002** | RF-003 | Abertura Válida (Outros) | Outros, Baixa, Título >= 5 chars | Chamado salvo com prioridade Baixa. |
| **CT-USER-001** | RF-002 | Cadastro Válido | `carlos.qa@senai.br` / `Segura@2026` | Usuário cadastrado e listado na tabela. |

### 9.2. Casos que Devem Falhar na VERSÃO A
| ID Caso | Defeito | Cenário | Comportamento Obtido na Versão A |
|---|---|---|---|
| **CT-PRIORIDADE-001** | DEF-001 | Hardware + Alta | Prioridade vira `Baixa` (Falha) |
| **CT-USER-002** | DEF-002 | Email duplicado com maiúsculas | Cadastra duplicata indevida (Falha) |
| **CT-USER-003** | DEF-003 | Senha com 1 caractere (`1`) | Aceita senha fraca (Falha) |
| **CT-BUSCA-001** | DEF-004 | Busca por `monitor` minúsculo | Retorna tabela vazia (Falha) |
| **CT-FILTRO-001** | DEF-005 | Filtro "Em andamento" | Retorna tabela vazia (Falha) |
| **CT-CHAMADO-003** | DEF-006 | Formulário em branco | Salva chamado vazio (Falha) |
| **CT-DASH-001** | DEF-007 | Contagem de Abertos | Subcontagem ignorando prioridade Baixa (Falha) |
| **CT-STATUS-001** | DEF-008 | Mudar status para Encerrado | Reabre cópia automática aberta (Falha) |

### 9.3. Casos para Reteste na VERSÃO B
| ID Caso | Defeito Validado | Resultado Esperado na Versão B | Status do Reteste |
|---|---|---|---|
| **CT-PRIORIDADE-001** | DEF-001 | Hardware + Alta grava e exibe prioridade **Alta** | **Aprovado (Passou)** |
| **CT-USER-003** | DEF-003 | Rejeita senha < 6 caracteres com mensagem de erro | **Aprovado (Passou)** |
| **CT-FILTRO-001** | DEF-005 | Filtro "Em andamento" exibe chamado `#2 - Sistema lento` | **Aprovado (Passou)** |
| **CT-STATUS-001** | DEF-008 | Chamado é marcado como Encerrado sem gerar duplicatas | **Aprovado (Passou)** |

### 9.4. Casos para Teste de Regressão na VERSÃO B
| ID Caso | Módulo | Ação de Teste | Resultado Esperado | Efeito Colateral Detectado na Versão B |
|---|---|---|---|---|
| **CT-REG-001** | Edição de Status | Alterar chamado de `Aberto` para `Em andamento` | Preservar a prioridade original (`Alta` ou `Baixa`) | **Prioridade é sobrescrita para `Média` (DEF-REG-001)** |
| **CT-REG-002** | Filtro Combinado | Filtrar por status `Aberto` e buscar termo `Sistema` | Não exibir resultados (pois "Sistema" é `Em andamento`) | **Chamado "Sistema lento" aparece na tabela violando o filtro (DEF-REG-002)** |

---

## 10. Painel do Professor e Comandos de Operação

### Como Controlar o Ambiente durante a Aula:
1. **Pela Interface:** Clicar em `⚙️ Painel do Professor` no rodapé pedagógico de qualquer tela.
2. **Pelo Console do Navegador (F12):**
   ```javascript
   setVersion('A');          // Ativa Versão A (Inicial com falhas)
   setVersion('B');          // Ativa Versão B (Reteste e regressão)
   resetTestData();         // Restaura a base de dados original
   abrirPainelProfessor();  // Abre o modal de controle docente
   ```

---

## 11. Credenciais de Teste Pré-Configuradas

- **Administrador:** `usuario.teste@senai.br` / `SenhaValida123`
- **Estudante:** `aluno` / `123`
