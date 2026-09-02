# Estação de Testes SENAI — Guia do Aluno

Bem-vindo(a) à **Estação de Testes de Sistemas**! Este é um ambiente simulado construído para que você coloque em prática as competências de um **Analista de Qualidade de Software (QA)**.

---

## 1. O Percurso do Analista de Testes

Durante a aula prática, você irá vivenciar o ciclo completo de QA:

$$\text{Requisito} \longrightarrow \text{Planejar Casos de Teste} \longrightarrow \text{Executar} \longrightarrow \text{Comparar (Esperado vs. Obtido)} \longrightarrow \text{Registrar Evidência} \longrightarrow \text{Reportar Defeito} \longrightarrow \text{Retestar} \longrightarrow \text{Testar Regressão}$$

---

## 2. Escopo do Sistema (Requisitos para Testes)

Você deve basear seus casos de teste nas funcionalidades descritas a seguir:

* **RF-001 — Autenticação:** Apenas usuários cadastrados devem ter acesso ao sistema.
* **RF-002 — Cadastro de Usuários:** O sistema deve validar e-mails duplicados e exigir senhas seguras (mínimo de 6 caracteres).
* **RF-003 — Abertura de Chamados:** Todos os campos são obrigatórios. O título deve conter no mínimo 5 caracteres e a prioridade selecionada deve ser rigorosamente respeitada para todas as categorias.
* **RF-004 — Consulta e Filtros:** A listagem deve filtrar chamados por status e por busca de texto (independentemente de maiúsculas/minúsculas). A alteração de status deve apenas atualizar o chamado em questão.
* **RF-005 — Dashboard:** Os números exibidos nos cartões devem corresponder exatamente à contagem de chamados nos respectivos status.

---

## 3. Técnicas de Caixa Preta para Aplicar

### 3.1. Partição de Equivalência
Agrupe as entradas de dados em duas categorias:
- **Classes Válidas:** Dados que devem ser aceitos pelo sistema.
- **Classes Inválidas:** Dados que devem ser rejeitados com mensagem de alerta.

### 3.2. Análise de Valor Limite (BVA)
Quando um campo tiver regras de tamanho (por exemplo, tamanho mínimo de senha ou título), teste os valores de fronteira:
- **Imediatamente abaixo do limite** (deve falhar/ser rejeitado);
- **No limite exato** (deve passar/ser aceito);
- **Imediatamente acima do limite** (deve passar/ser aceito).

---

## 4. Dados de Acesso Pré-Configurados

Para autenticar e iniciar os testes:

### Usuário Administrador
- **E-mail:** `usuario.teste@senai.br`
- **Senha:** `SenhaValida123`

### Usuário Estudante
- **E-mail:** `aluno`
- **Senha:** `123`

*(Dica: Você pode usar essas credenciais como pré-condição nos seus casos de teste).*

---

## 5. O Desafio em Duas Etapas

### Etapa 1: Versão Inicial (Versão A)
1. Execute seus casos de teste planejados.
2. Identifique divergências entre o **Resultado Esperado** e o **Resultado Obtido**.
3. Capture a evidência (captura de tela ou texto) e preencha o **Relatório de Defeito (Bug Report)** com Severidade e Prioridade.

### Etapa 2: Reteste e Regressão (Versão B)
Quando o professor anunciar a liberação da nova versão:
1. **Reteste:** Verifique se o defeito que você encontrou foi realmente corrigido.
2. **Teste de Regressão:** Execute outros casos de teste em funcionalidades conectadas para descobrir se as alterações provocaram novos efeitos colaterais!

**Boa caçada aos bugs e excelente prática de testes!**
