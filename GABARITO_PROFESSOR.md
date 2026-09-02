# Gabarito do Professor — Estação de Testes SENAI (Aula Final de Testes de Sistemas)

> **DOCUMENTO CONFIDENCIAL DO CORPO DOCENTE — NÃO COMPARTILHAR COM OS ALUNOS**
> Este guia contém o mapeamento completo de requisitos, casos de teste, técnicas de caixa preta (Partição de Equivalência e Valor Limite), níveis de teste, testes automatizados com Vitest, catálogo de defeitos, plano de reteste e testes de regressão.

---

## 1. Visão Geral e Dinâmica da Aula Prática (50 min)

A aplicação foi estruturada como um **objeto pedagógico de investigação** para a aula de fechamento da Unidade Curricular de Testes de Sistemas, desenvolvendo a competência C8 (Seleção de procedimentos de teste) e todo o ciclo:

$$\text{Requisito} \longrightarrow \text{Selecionar Teste} \longrightarrow \text{Executar} \longrightarrow \text{Comparar (Esperado vs. Obtido)} \longrightarrow \text{Encontrar Falha} \longrightarrow \text{Registrar Evidência} \longrightarrow \text{Retestar na Versão B} \longrightarrow \text{Verificar Regressão} \longrightarrow \text{Documentar}$$

### Estrutura de Versões Didáticas:
- **Versão A (Build 1.0.0 — Inicial com Falhas):** Os alunos executam os casos de teste planejados, descobrem discrepâncias entre resultado esperado e obtido e documentam relatórios de bugs.
- **Versão B (Build 1.1.0 — Corrigida + Efeitos Colaterais):** O professor/aluno avança a versão. Os alunos retestam os bugs antigos e executam testes de regressão para descobrir novos efeitos colaterais.

---

## 2. Rastreabilidade de Requisitos Funcionais

| Identificador | Requisito Funcional | Regra de Negócio / Critério de Aceite |
|---|---|---|
| **RF-001** | Autenticação (Login) | Acesso exclusivo com credenciais cadastradas. Mensagem clara em caso de falha. |
| **RF-002** | Cadastro de Usuários | Nome obrigatório (>= 3 chars). E-mail único (case-insensitive). Senha obrigatória com **mínimo de 6 caracteres** (regra para BVA). |
| **RF-003** | Abertura de Chamados | Título obrigatório (**mínimo 5 caracteres** - regra para BVA). Descrição obrigatória. A prioridade selecionada deve ser rigorosamente respeitada para todas as categorias. |
| **RF-004** | Consulta e Edição de Chamados | Tabela de chamados com busca por título (case-insensitive) e filtro por status. Alteração de status deve apenas atualizar o registro selecionado. |
| **RF-005** | Dashboard e Indicadores | Cards com contagem precisa de chamados nos status: "Aberto", "Em andamento" e "Encerrado". |

---

## 3. Mapa Pedagógico Final da Aplicação

| Requisito | Funcionalidade | Tipo de Teste | Defeito Possível | Técnica de Caixa Preta | Reteste na Versão B | Regressão na Versão B |
|---|---|---|---|---|---|---|
| **RF-001** | Login | Sistema / Funcional | Credenciais inválidas aceitas ou erro genérico | Partição de Equivalência (Login válido vs inválido) | N/A (Estável) | Não |
| **RF-002** | Cadastro de Usuários | Sistema / Funcional | E-mail duplicado aceito com maiúsculas (`DEF-002`) | Partição de Equivalência (E-mail novo vs existente) | Permanece aberto | Não |
| **RF-002** | Cadastro de Usuários | Unitário / Sistema | Senha fraca com 1 caractere aceita (`DEF-003`) | **Análise de Valor Limite (BVA)** (5, 6, 7 chars) | **Sim (Aprovado)** | Não |
| **RF-003** | Abertura de Chamado | Sistema / Funcional | Hardware força prioridade Baixa (`DEF-001` / CT-PRIORIDADE-001) | Partição de Equivalência (Hardware/Alta vs outras) | **Sim (Aprovado)** | Não |
| **RF-003** | Abertura de Chamado | Unitário / Sistema | Permite título em branco ou < 5 chars (`DEF-006`) | **Análise de Valor Limite (BVA)** (4, 5, 6 chars no título) | **Sim (Aprovado)** | Não |
| **RF-004** | Consulta de Chamados | Sistema / Funcional | Busca por título case-sensitive (`DEF-004`) | Partição de Equivalência (Termo minúsculo vs maiúsculo) | **Sim (Aprovado)** | **Sim (Efeito DEF-REG-002)** |
| **RF-004** | Consulta de Chamados | Sistema / Funcional | Filtro "Em andamento" retorna lista vazia (`DEF-005`) | Partição de Equivalência (Status existente vs inexistente) | **Sim (Aprovado)** | **Sim (Efeito DEF-REG-002)** |
| **RF-004** | Edição de Chamados | Integração / Sistema | Efeito Hidra ao encerrar chamado (`DEF-008`) | Teste de Transição de Estado (Aberto -> Encerrado) | **Sim (Aprovado)** | **Sim (Efeito DEF-REG-001)** |
| **RF-004** | Edição de Status *(Regressão)* | Integração / Regressão | Alterar status para "Em andamento" reseta prioridade para Média (`DEF-REG-001`) | Teste de Regressão / Preservação de Atributos | N/A | **Sim (Novo Bug na B)** |
| **RF-004** | Filtros Combinados *(Regressão)* | Sistema / Regressão | Busca por texto ignora e anula o filtro de status selecionado (`DEF-REG-002`) | Teste Combinatório / Regressão de Filtros | N/A | **Sim (Novo Bug na B)** |
| **RF-005** | Dashboard | Integração / Sistema | Card "Abertos" ignora chamados de prioridade Baixa (`DEF-007`) | Teste de Consistência de Dados (Soma de Itens) | **Sim (Aprovado)** | Não |

---

## 4. Técnicas de Caixa Preta: Partição de Equivalência e Análise de Valor Limite

### 4.1. Regra de Senha no Cadastro de Usuários (RF-002)
- **Regra:** A senha deve conter **no mínimo 6 caracteres**.
- **Partição de Equivalência:**
  - *Classe Inválida:* Senhas com tamanho menor que 6 caracteres (ex: `123`, `abc`).
  - *Classe Válida:* Senhas com 6 ou mais caracteres (ex: `Senha123`, `123456`).
- **Análise de Valor Limite (BVA):**
  - **5 caracteres:** Imediatamente abaixo do limite $\to$ **Resultado Esperado: Inválido (Erro)**.
  - **6 caracteres:** No limite da fronteira $\to$ **Resultado Esperado: Válido (Aceito)**.
  - **7 caracteres:** Imediatamente acima do limite $\to$ **Resultado Esperado: Válido (Aceito)**.

### 4.2. Regra de Título do Chamado (RF-003)
- **Regra:** O título deve possuir **no mínimo 5 caracteres**.
- **Partição de Equivalência:**
  - *Classe Inválida:* Vazio ou $< 5$ caracteres (ex: `Rede`, `Bug`).
  - *Classe Válida:* $\ge 5$ caracteres (ex: `Mouse`, `Teclado falhando`).
- **Análise de Valor Limite (BVA):**
  - **4 caracteres:** Imediatamente abaixo $\to$ **Inválido**.
  - **5 caracteres:** No limite $\to$ **Válido**.
  - **6 caracteres:** Imediatamente acima $\to$ **Válido**.

---

## 5. Demonstração de Testes Automatizados com Vitest

O projeto inclui o módulo desacoplado `validadores.js` e a suite de testes `validadores.test.js`.

### Como Executar os Testes Unitários:
```bash
# Executar a suíte de testes com Vitest
npm test

# Executar em modo interativo/watch
npm run test:watch
```

### Demonstração Didática (Passou $\to$ Alteração $\to$ Falhou):
1. Execute `npm test` e mostre aos alunos que todos os testes unitários passaram.
2. Altere propositalmente em `validadores.js` a regra de senha para `senha.length >= 8`.
3. Rode `npm test` novamente e mostre o teste `validarSenha('123456')` **falhando com relatório detalhado de discrepância**.

---

## 6. Demonstração do Caso do Professor (Abertura da Aula)

### **CT-PRIORIDADE-001**
- **Objetivo:** Verificar se o sistema mantém a prioridade escolhida ao criar um chamado.
- **Dados:**
  - Título: `Impressora Sem Conexão`
  - Descrição: `Impressora da sala 02 não responde na rede.`
  - Categoria: `Hardware`
  - Prioridade: `Alta`
- **Passos:**
  1. Acessar **Abrir Chamado** (`novo.html`).
  2. Preencher os dados informados.
  3. Clicar em **Abrir Chamado**.
  4. Ir em **Consultar Chamados** (`consulta.html`) e inspecionar a coluna **Prioridade**.
- **Versão A (Defeito):** A prioridade é registrada como **Baixa**.
- **Versão B (Reteste):** A prioridade é mantida como **Alta**.

---

## 7. Painel do Professor e Gestão do Ambiente

Para facilitar o controle em sala de aula sem atrapalhar a experiência dos estudantes:
- **Pela Interface:** Clicar em `⚙️ Painel do Professor` no rodapé de qualquer página.
- **Pelo Console (F12):**
  - `setVersion('B')` $\to$ Ativa a Versão B.
  - `setVersion('A')` $\to$ Retorna à Versão A.
  - `resetTestData()` $\to$ Restaura a massa de dados inicial.
  - `abrirPainelProfessor()` $\to$ Abre o modal de controle.

---

## 8. Credenciais Padrão Pré-Configuradas

- **Administrador:** `usuario.teste@senai.br` / Senha: `SenhaValida123`
- **Estudante:** `aluno` / Senha: `123`
