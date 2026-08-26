# Contexto do Projeto: Estação de Testes de Chamados de TI (SENAI)

Este documento foi gerado para fornecer a qualquer agente de Inteligência Artificial ou desenvolvedor o contexto completo da arquitetura, objetivos pedagógicos, lógica de versionamento e catálogo de defeitos deste repositório.

---

## 1. Visão Geral e Propósito Pedagógico

O projeto **Test Station (Estação de Testes)** é um sistema web simulado desenvolvido para aulas práticas de **Testes de Sistemas** no **SENAI**.
Ele não é um sistema corporativo de produção, mas sim um **laboratório prático** para que estudantes atuem como Analistas de Qualidade (QA), exercitando todo o ciclo de testes:

$$\text{Elaboração de Casos de Teste} \longrightarrow \text{Execução Manual} \longrightarrow \text{Comparação (Esperado vs. Obtido)} \longrightarrow \text{Evidência} \longrightarrow \text{Relatório de Bugs} \longrightarrow \text{Reteste na Versão B} \longrightarrow \text{Testes de Regressão}$$

---

## 2. Arquitetura Técnica

- **Stack:** HTML5, CSS3 e JavaScript Vanilla (ES6+).
- **Sem Backend / Sem Dependências:** Não utiliza Node.js no runtime, npm, frameworks (React/Vue) ou bancos de dados SQL/NoSQL.
- **Persistência de Dados:** Memória do navegador via `localStorage`.
  - Chaves utilizadas:
    - `chamados`: Array de objetos de chamados (`id`, `title`, `description`, `category`, `priority`, `status`).
    - `usuarios`: Array de objetos de usuários (`id`, `nome`, `email`, `perfil`, `senha`).
    - `auth_token`: Token simples de autenticação (`token_valido`).
    - `app_version`: Versão pedagógica ativa (`'A'` ou `'B'`).
- **Navegação Multi-page:**
  - `index.html`: Login e acesso ao minigame educativo.
  - `dashboard.html`: Métricas e contagem de chamados por status.
  - `novo.html`: Formulário para abertura de novos chamados.
  - `consulta.html`: Tabela de listagem com busca por título, filtro por status e dropdown inline para alteração de status.
  - `usuarios.html`: Formulário de cadastro e tabela de listagem de usuários.
  - `minigame.html` / `minigame.js` / `minigame.css`: Jogo interativo em 4 fases sobre fundamentos de casos de teste e severidade.
  - `app.js`: Toda a lógica de autenticação, persistência, controle de versões e injeção dos comportamentos pedagógicos.
  - `style.css`: Estilização limpa, responsiva e alinhada à identidade visual do SENAI.

---

## 3. Mecanismo de Versões Pedagógicas (Versão A vs. Versão B)

O sistema possui duas versões de build controladas dinamicamente:

### 3.1. VERSÃO A (v1.0.0 — Build Inicial)
- Utilizada na primeira fase da aula prática.
- Contém **8 defeitos pedagógicos** intencionais (incluindo o caso do professor `CT-PRIORIDADE-001`).

### 3.2. VERSÃO B (v1.1.0 — Build Corrigida + Regressão)
- Utilizada na segunda fase da aula (reteste e regressão).
- **Corrige 4 defeitos antigos**:
  - `DEF-001` (Hardware + Alta agora salva como Alta com sucesso).
  - `DEF-003` (Senha passa a exigir no mínimo 6 caracteres).
  - `DEF-005` (Filtro "Em andamento" agora lista os chamados corretos).
  - `DEF-008` (Efeito Hidra removido ao encerrar chamados).
- **Introduz 2 novos efeitos colaterais (Bugs de Regressão)**:
  - `DEF-REG-001` (Ao alterar status para "Em andamento", a prioridade do chamado vira "Média").
  - `DEF-REG-002` (A busca por texto ignora e sobrepõe o filtro de status selecionado).

### 3.3. Alternância e Controle
- **Pela Interface:** Link/botão no rodapé pedagógico (`.pedagogical-notice`) em todas as páginas: `Alternar para Build B / Build A` e `Restaurar Dados Padrão`.
- **Pelo Console do Navegador (F12):**
  ```javascript
  setVersion('B');      // Alterna para Versão B
  setVersion('A');      // Retorna para Versão A
  getAppVersion();     // Retorna 'A' ou 'B'
  resetTestData();     // Restaura dados mockados iniciais
  ```

---

## 4. Matriz Completa de Defeitos

| ID | Módulo | Defeito | Versão A | Versão B | Efeito Colateral / Regressão | Causa no Código (`app.js`) |
|---|---|---|---|---|---|---|
| **DEF-001** | Novo Chamado | Categoria `Hardware` força prioridade `Baixa` (`CT-PRIORIDADE-001`) | **Ativo** | **Corrigido** | Não | `if (version === 'A' && categoria === 'Hardware') prioridade = 'Baixa';` |
| **DEF-002** | Usuários | E-mail duplicado aceito por sensibilidade a maiúsculas | **Ativo** | **Ativo** | Não | `u.email === email` (Case-sensitive) |
| **DEF-003** | Usuários | Aceita senha com apenas 1 caractere | **Ativo** | **Corrigido** | Não | Na Versão A só valida se `senha.length === 0`; na B exige `>= 6`. |
| **DEF-004** | Consulta | Busca por título sensível a maiúsculas/minúsculas | **Ativo** | **Corrigido** | Sim (`DEF-REG-002`) | Na Versão A `c.title.includes(term)`; na B `toLowerCase()`. |
| **DEF-005** | Consulta | Filtro de status "Em andamento" retorna vazio | **Ativo** | **Corrigido** | Sim (`DEF-REG-002`) | Na Versão A compara com `'andamento'`; na B com `'Em andamento'`. |
| **DEF-006** | Novo Chamado | Permite submissão de chamado com campos em branco | **Ativo** | **Corrigido** | Não | Na Versão A não valida `!titulo.trim()`; na B bloqueia. |
| **DEF-007** | Dashboard | Card "Abertos" desconsidera chamados com prioridade Baixa | **Ativo** | **Corrigido** | Não | Na Versão A: `if (st === 'aberto' && c.priority !== 'Baixa') abertos++;` |
| **DEF-008** | Consulta | Efeito Hidra: ao encerrar chamado, cria duplicata em aberto | **Ativo** | **Corrigido** | Sim (`DEF-REG-001`) | Na Versão A injeta novo chamado com `'Reabertura automática: '`. |
| **DEF-REG-001** | Edição Status | Ao mudar status para "Em andamento", prioridade vira "Média" | Inativo | **Ativo** | **Sim (Novo na B)** | Na Versão B: `if (newStatus === 'Em andamento') chamados[idx].priority = 'Média';` |
| **DEF-REG-002** | Filtro / Busca | Busca por texto ignora e sobrepõe o filtro de status selecionado | Inativo | **Ativo** | **Sim (Novo na B)** | Na Versão B: `if (term && statusF) filtered = filtered.filter(c => c.title.toLowerCase().includes(term.toLowerCase()));` |

---

## 5. Roteiro do Caso de Demonstração do Professor

### **CT-PRIORIDADE-001**
1. **Menu:** Abrir Chamado (`novo.html`).
2. **Dados:**
   - Título: `Impressora Sem Conexão`
   - Descrição: `Impressora da sala 02 não responde na rede.`
   - Categoria: `Hardware`
   - Prioridade: `Alta`
3. **Ação:** Clicar em **Abrir Chamado** e acessar **Consultar Chamados** (`consulta.html`).
4. **Comportamento Obtido (Versão A):** O chamado é registrado com prioridade **Baixa** (Defeito evidenciado).
5. **Comportamento em Reteste (Versão B):** O chamado é registrado e mantido com prioridade **Alta** (Correção confirmada).

---

## 6. Credenciais de Teste (Caminho Feliz)

- **Administrador:**
  - Login: `usuario.teste@senai.br`
  - Senha: `SenhaValida123`
- **Estudante:**
  - Login: `aluno`
  - Senha: `123`

---

## 7. Arquivos de Documentação do Projeto

- **`GABARITO_PROFESSOR.md`**: Gabarito confidencial contendo fichas detalhadas de defeitos, passos de reprodução, matriz comparativa de versões, casos que passam/falham, reteste e regressão.
- **`GUIA_DO_ALUNO.md`**: Manual de instruções para os estudantes realizarem os testes sem receberem pistas dos bugs.
- **`README.md`**: Visão geral do repositório, como executar localmente e dados de acesso.
- **`CONTEXTO_PROJETO_IA.md`**: Este próprio documento com o histórico e instruções técnicas para continuidade por agentes de IA.

---

## 8. Diretrizes para Futuras IAs e Desenvolvedores

1. **Integridade Pedagógica:** Nunca adicione textos na interface como "Aqui tem bug", "Erro intencional" ou comentários no HTML/CSS que entreguem as falhas. Os alunos devem descobrir o comportamento exclusivamente pelos casos de teste.
2. **Simplicidade:** Mantenha a arquitetura em Vanilla JS e `localStorage`. Não introduza dependências de build ou frameworks que exijam `npm install` ou servidor de backend.
3. **Sincronização:** Se alterar ou adicionar novos defeitos/comportamentos em `app.js`, atualize imediatamente a matriz em `GABARITO_PROFESSOR.md` e este documento `CONTEXTO_PROJETO_IA.md`.
