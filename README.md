# Sistema de Chamados SENAI — Estação Didática de Testes de Sistemas

Sistema web de controle de chamados de TI desenvolvido exclusivamente para **aulas práticas de Testes de Sistemas do SENAI**, atuando como um laboratório completo para aplicação de técnicas de teste funcional, caixa preta, reteste e regressão.

---

## 🎯 Objetivos de Aprendizagem

Os estudantes vivenciam na prática o ciclo completo de Qualidade de Software (QA):
$$\text{Requisito} \longrightarrow \text{Selecionar Procedimento} \longrightarrow \text{Executar Teste} \longrightarrow \text{Comparar (Esperado vs. Obtido)} \longrightarrow \text{Evidenciar e Reportar Bug} \longrightarrow \text{Retestar na Versão B} \longrightarrow \text{Testar Regressão}$$

---

## 📋 Requisitos Funcionais Mapeados

- **`RF-001` — Autenticação (Login):** Validação de credenciais de acesso para usuários cadastrados.
- **`RF-002` — Cadastro de Usuários:** Cadastro de novos usuários com e-mail único e validação de senha (mínimo de 6 caracteres).
- **`RF-003` — Abertura de Chamados:** Criação de chamados com título (mínimo de 5 caracteres), categoria, prioridade e descrição.
- **`RF-004` — Consulta e Edição de Chamados:** Listagem de chamados, busca por título, filtro por status e atualização de status.
- **`RF-005` — Dashboard:** Métricas e contadores de chamados Abertos, Em Andamento e Encerrados.

---

## 🚀 Como Executar a Aplicação

A aplicação foi construída com **HTML5, CSS3 e JavaScript Vanilla (ES6+)**, armazenando todos os dados no `localStorage` do navegador.

### Opção 1: Direto no Navegador (Sem Instalação)
1. Dê um duplo clique no arquivo `index.html`.
2. O sistema abrirá diretamente no seu navegador padrão e estará 100% funcional.

### Opção 2: Servidor Local Simples (Opcional)
```bash
# Com Python 3:
python -m http.server 8000
```
Acesse no navegador: [http://localhost:8000](http://localhost:8000)

---

## 🧪 Testes Automatizados com Vitest (Nível Unitário)

Para demonstrar testes unitários automatizados e técnicas de caixa preta em código:

```bash
# Instalar dependências de teste (apenas uma vez, caso deseje rodar Vitest)
npm install

# Executar a suíte de testes unitários
npm test

# Executar em modo interativo
npm run test:watch
```

Os testes cobrem:
- **Partição de Equivalência:** Entradas válidas vs inválidas para senha e título de chamado.
- **Análise de Valor Limite (BVA):** Valores de fronteira ($5$, $6$, $7$ caracteres para senha; $4$, $5$, $6$ caracteres para título).

---

## 🔄 Versões Didáticas e Painel do Professor

O sistema possui duas versões de build controladas em tempo real:

- **Versão A (Build 1.0.0 — Inicial com Falhas):** Contém os defeitos pedagógicos para identificação pelos alunos durante a primeira etapa.
- **Versão B (Build 1.1.0 — Corrigida + Regressão):** Corrige defeitos antigos e introduz efeitos colaterais para a prática de reteste e testes de regressão.

### Como Controlar o Ambiente:
1. **Pela Interface:** Use os botões no rodapé de qualquer página (`Alternar para Build B / Build A`, `⚙️ Painel do Professor` e `Restaurar Dados`).
2. **Pelo Console do Navegador (F12):**
   ```javascript
   setVersion('B');           // Ativa a Versão B
   setVersion('A');           // Retorna para a Versão A
   resetTestData();          // Restaura o banco de dados original
   abrirPainelProfessor();   // Abre o modal de controle docente
   ```

---

## 🔑 Credenciais de Teste Pré-Configuradas

- **Administrador:**
  - Login: `usuario.teste@senai.br`
  - Senha: `SenhaValida123`
- **Estudante:**
  - Login: `aluno`
  - Senha: `123`

---

## 📁 Estrutura de Documentos

- **`GABARITO_PROFESSOR.md`:** *(Confidencial)* Mapa pedagógico completo, fichas técnicas de bugs, roteiro do caso do professor e guia de regressão.
- **`GUIA_DO_ALUNO.md`:** Guia prático com os passos para elaboração de casos de teste, execução e relatório de defeitos.
- **`CONTEXTO_PROJETO_IA.md`:** Documento consolidado para continuidade do projeto por agentes de IA.
- **`validadores.js` / `validadores.test.js`:** Módulo de regras puras e suite de testes com Vitest.
