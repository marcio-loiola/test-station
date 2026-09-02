# Contexto do Projeto: Estação de Testes de Chamados de TI (SENAI)

Este documento fornece a qualquer agente de Inteligência Artificial ou desenvolvedor o contexto completo da arquitetura, objetivos pedagógicos, lógica de versionamento, requisitos funcionais, catálogo de defeitos e suporte a testes automatizados com Vitest deste repositório.

---

## 1. Visão Geral e Propósito Pedagógico

O projeto **Test Station (Estação de Testes)** é um sistema web simulado desenvolvido para a aula final de **Testes de Sistemas** no **SENAI**.
Ele atua como um **laboratório prático investigativo** para que estudantes atuem como Analistas de Qualidade (QA), desenvolvendo a competência C8 e exercitando todo o ciclo de testes:

$$\text{Requisito} \longrightarrow \text{Selecionar Teste} \longrightarrow \text{Executar} \longrightarrow \text{Comparar (Esperado vs. Obtido)} \longrightarrow \text{Evidência} \longrightarrow \text{Relatório de Bugs} \longrightarrow \text{Reteste na Versão B} \longrightarrow \text{Testes de Regressão}$$

---

## 2. Requisitos Funcionais Mapeados

- **`RF-001` — Autenticação (Login):** Validação de credenciais de acesso para usuários cadastrados.
- **`RF-002` — Cadastro de Usuários:** Cadastro de novos usuários com e-mail único (case-insensitive) e validação de senha (mínimo de 6 caracteres - regra para BVA e Partição de Equivalência).
- **`RF-003` — Abertura de Chamados:** Criação de chamados com título (mínimo de 5 caracteres - regra para BVA), categoria, prioridade (sempre preservada) e descrição.
- **`RF-004` — Consulta e Edição de Chamados:** Listagem de chamados, busca por título (case-insensitive), filtro por status e atualização de status (sem recriação indevida ou perda de prioridade).
- **`RF-005` — Dashboard:** Métricas e contadores precisos de chamados Abertos, Em Andamento e Encerrados.

---

## 3. Arquitetura Técnica

- **Stack:** HTML5, CSS3 e JavaScript Vanilla (ES6+).
- **Sem Backend / Sem Dependências de Runtime:** Não necessita de Node.js para rodar a aplicação web (todos os dados persistem localmente via `localStorage`).
- **Testes Automatizados (Opcional para Demonstração Docente):**
  - Módulo: `validadores.js` (funções puras desacopladas).
  - Suite de Testes: `validadores.test.js` (executável via `npm test` com Vitest).
  - Configuração: `package.json`.
- **Persistência de Dados (`localStorage`):**
  - `chamados`: Array de objetos de chamados (`id`, `title`, `description`, `category`, `priority`, `status`).
  - `usuarios`: Array de objetos de usuários (`id`, `nome`, `email`, `perfil`, `senha`).
  - `auth_token`: Token simples de autenticação (`token_valido`).
  - `app_version`: Versão pedagógica ativa (`'A'` ou `'B'`).
- **Navegação:**
  - `index.html`: Login e link para o minigame.
  - `dashboard.html`: Indicadores visuais.
  - `novo.html`: Formulário de criação de chamado.
  - `consulta.html`: Tabela de listagem com busca, filtros e atualização inline.
  - `usuarios.html`: Cadastro e listagem de usuários.
  - `minigame.html` / `minigame.js` / `minigame.css`: Jogo educativo sobre casos de teste.
  - `validadores.js`: Regras puras para testes unitários.
  - `app.js`: Lógica de interface, controle de versões e injeção de comportamentos pedagógicos.
  - `style.css`: Estilização e componentes de modal.

---

## 4. Mecanismo de Versões Didáticas e Painel do Professor

- **VERSÃO A (v1.0.0 — Build Inicial):** Contém os 8 defeitos didáticos para identificação pelos alunos.
- **VERSÃO B (v1.1.0 — Build Corrigida + Regressão):** Corrige defeitos antigos (`DEF-001`, `DEF-003`, `DEF-005`, `DEF-008`) e introduz 2 novos efeitos colaterais (`DEF-REG-001` e `DEF-REG-002`).

### Controle Docente:
- **Pela Interface:** Botões no rodapé de todas as páginas e modal `⚙️ Painel do Professor` (`abrirPainelProfessor()`).
- **Pelo Console:**
  ```javascript
  setVersion('B');           // Ativa Versão B
  setVersion('A');           // Retorna para Versão A
  getAppVersion();          // Retorna 'A' ou 'B'
  resetTestData();          // Restaura dados mockados iniciais
  abrirPainelProfessor();   // Exibe o modal do professor
  ```

---

## 5. Mapa Pedagógico Final

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

## 6. Roteiro do Caso de Demonstração do Professor

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

## 7. Credenciais de Teste (Caminho Feliz)

- **Administrador:**
  - Login: `usuario.teste@senai.br`
  - Senha: `SenhaValida123`
- **Estudante:**
  - Login: `aluno`
  - Senha: `123`

---

## 8. Diretrizes para Futuras IAs e Desenvolvedores

1. **Integridade Pedagógica:** Nunca adicione textos na interface como "Aqui tem bug", "Erro intencional" ou comentários no HTML/CSS que entreguem as falhas. Os alunos devem descobrir o comportamento exclusivamente pelos casos de teste.
2. **Simplicidade:** Mantenha a arquitetura em Vanilla JS e `localStorage`. Não introduza dependências de build obrigatórias para execução da aplicação web.
3. **Sincronização:** Se alterar ou adicionar novos defeitos/comportamentos em `app.js` ou `validadores.js`, atualize imediatamente a matriz em `GABARITO_PROFESSOR.md` e este documento `CONTEXTO_PROJETO_IA.md`.
