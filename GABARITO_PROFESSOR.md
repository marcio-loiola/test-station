# Gabarito do Professor — Estação de Testes SENAI (Controle de Chamados TI)

> **DOCUMENTO CONFIDENCIAL DO PROFESSOR — NÃO COMPARTILHAR COM OS ALUNOS**
> Este material contém o mapeamento completo dos comportamentos, defeitos pedagógicos, casos de teste (positivos e negativos), roteiro de demonstração, plano de reteste e testes de regressão.

---

## 1. Visão Geral da Dinâmica Pedagógica

O sistema foi modelado para proporcionar aos alunos a vivência real do ciclo de Qualidade de Software:
$$\text{Caso de Teste} \longrightarrow \text{Execução} \longrightarrow \text{Resultado Esperado vs. Obtido} \longrightarrow \text{Evidência} \longrightarrow \text{Registro de Bug} \longrightarrow \text{Reteste} \longrightarrow \text{Regressão}$$

- **Versão A (Build 1.0.0)**: Estado inicial com 8 defeitos distribuídos entre autenticação, cadastro, abertura, consulta, métricas e edição.
- **Versão B (Build 1.1.0)**: Nova versão que corrige 4 defeitos antigos (incluindo a demonstração do professor), mas introduz 2 efeitos colaterais (regressão) para ilustrar a importância do reteste amplo.

---

## 2. Caso de Teste do Professor (Demonstração Inicial)

### **CT-PRIORIDADE-001**
- **Objetivo:** Verificar se o sistema mantém a prioridade escolhida ao criar um chamado.
- **Pré-condição:** Usuário autenticado no sistema.
- **Dados de Entrada:**
  - **Título:** `Impressora Sem Conexão`
  - **Descrição:** `Impressora da sala 02 não responde na rede.`
  - **Categoria:** `Hardware`
  - **Prioridade:** `Alta`
- **Passos de Execução:**
  1. Acessar o menu **"Abrir Chamado"** (`novo.html`).
  2. Preencher o campo *Título* com `Impressora Sem Conexão`.
  3. Selecionar a *Categoria* `Hardware`.
  4. Selecionar a *Prioridade* `Alta`.
  5. Preencher a *Descrição* com `Impressora da sala 02 não responde na rede.`.
  6. Clicar no botão **"Abrir Chamado"**.
  7. Acessar o menu **"Consultar Chamados"** (`consulta.html`).
  8. Localizar o chamado recém-criado na tabela e inspecionar a coluna **Prioridade**.
- **Resultado Esperado:** A prioridade exibida na listagem deve ser **Alta**.
- **Comportamento Obtido na VERSÃO A (Defeito):** A prioridade é registrada e exibida como **Baixa**.
- **Comportamento Obtido na VERSÃO B (Corrigido):** A prioridade é registrada e mantida como **Alta**.

---

## 3. Matriz Consolidada de Defeitos

| ID | Funcionalidade | Defeito | Versão A | Corrigido na B | Novo efeito | Passos |
|---|---|---|---|---|---|---|
| **DEF-001** | Abertura de Chamado | Categoria `Hardware` força prioridade para `Baixa` | **Sim** (CT-PRIORIDADE-001) | **Sim** (Mantém Alta) | Não | 1. Abrir chamado com Hardware + Alta.<br>2. Salvar e checar na consulta. |
| **DEF-002** | Cadastro de Usuários | E-mail duplicado permitido por sensibilidade a maiúsculas (Case-sensitive) | **Sim** | Não (Permanece) | Não | 1. Cadastrar `aluno@senai.br`.<br>2. Tentar cadastrar `Aluno@senai.br`. |
| **DEF-003** | Cadastro de Usuários | Validação inexistente de comprimento de senha (aceita 1 caractere) | **Sim** | **Sim** (Exige $\ge$ 6 chars) | Não | 1. Cadastrar usuário com senha `1`.<br>2. Clicar em salvar. |
| **DEF-004** | Consulta de Chamados | Busca textual no título é sensível a maiúsculas/minúsculas | **Sim** | **Sim** (Busca case-insensitive) | Sim (Ver DEF-REG-002) | 1. Buscar `monitor` minúsculo para o chamado "Monitor não liga". |
| **DEF-005** | Consulta de Chamados | Filtro por status "Em andamento" retorna lista vazia | **Sim** | **Sim** (Filtra status corretamente) | Sim (Ver DEF-REG-002) | 1. Selecionar filtro "Em andamento".<br>2. Tabela fica vazia. |
| **DEF-006** | Abertura de Chamado | Permite envio com Título e Descrição vazios | **Sim** | **Sim** (Bloqueia campos vazios) | Não | 1. Clicar em "Abrir Chamado" com campos em branco. |
| **DEF-007** | Dashboard | Contador de "Chamados Abertos" desconsidera prioridade Baixa | **Sim** | **Sim** (Contagem normalizada) | Não | 1. Comparar número do card "Abertos" com chamados abertos na consulta. |
| **DEF-008** | Edição de Chamados | Efeito Hidra: ao marcar status "Encerrado", gera nova cópia "Aberto" | **Sim** | **Sim** (Encerra sem duplicar) | Sim (Ver DEF-REG-001) | 1. Mudar status de um chamado para "Encerrado" na consulta. |
| **DEF-REG-001** | Edição de Chamados *(Regressão)* | Ao mudar status para "Em andamento", a prioridade do chamado é resetada para "Média" | Não | N/A | **Sim (Novo na B)** | 1. Mudar status de um chamado Alta/Baixa para "Em andamento".<br>2. Prioridade vira Média. |
| **DEF-REG-002** | Consulta / Filtros *(Regressão)* | Busca por texto sobrepõe e ignora o filtro de status selecionado | Não | N/A | **Sim (Novo na B)** | 1. Filtrar por status "Aberto".<br>2. Digitar "Sistema" (chamado Em andamento). |

---

## 4. Autoauditoria e Fichas Detalhadas de Defeitos

### **DEF-001: Alteração Involuntária de Prioridade em Chamados de Hardware**
- **Funcionalidade:** Abertura de Novo Chamado (`novo.html`)
- **Comportamento Esperado:** O chamado deve ser gravado e exibido exatamente com a prioridade selecionada pelo usuário.
- **Comportamento Atual (Versão A):** Ao selecionar categoria `Hardware` e prioridade `Alta`, o sistema grava `Baixa`.
- **Passos para Reprodução:**
  1. Ir em "Abrir Chamado".
  2. Informar Título: `Impressora Sem Conexão`.
  3. Categoria: `Hardware`.
  4. Prioridade: `Alta`.
  5. Descrição: `Impressora da sala 02 não responde na rede.`.
  6. Clicar em "Abrir Chamado".
  7. Ir em "Consultar Chamados" e verificar a coluna "Prioridade".
- **Dados Necessários:** Categoria Hardware + Prioridade Alta.
- **Severidade:** Alta (Inconsistência direta no dado crítico de atendimento).
- **Prioridade de Correção:** Alta.
- **Status:** Aberto na Versão A / Corrigido na Versão B.
- **Versão em que existe:** Versão A.
- **Versão em que foi corrigido:** Versão B.

---

### **DEF-002: Duplicação de Contas de Usuário por E-mail Case-Sensitive**
- **Funcionalidade:** Cadastro de Usuários (`usuarios.html`)
- **Comportamento Esperado:** O sistema deve rejeitar o cadastro de um e-mail já existente, independentemente de letras maiúsculas ou minúsculas (`aluno@senai.br` e `Aluno@senai.br` devem ser tratados como o mesmo e-mail).
- **Comportamento Atual (Versão A e B):** A verificação compara strings com sensibilidade à caixa, permitindo cadastrar contas duplicadas se houver variação de maiúsculas.
- **Passos para Reprodução:**
  1. Acessar a tela "Usuários".
  2. Cadastrar usuário com e-mail `aluno@senai.br`.
  3. Cadastrar outro usuário com e-mail `Aluno@senai.br`.
  4. O sistema aceita e cria os dois registros na tabela.
- **Dados Necessários:** `aluno@senai.br` e `Aluno@senai.br`.
- **Severidade:** Alta (Inconsistência de contas e integridade de usuários).
- **Prioridade de Correção:** Alta.
- **Status:** Aberto nas Versões A e B.
- **Versão em que existe:** Versão A e B.
- **Versão em que foi corrigido:** Não corrigido nesta iteração.

---

### **DEF-003: Ausência de Validação de Tamanho Mínimo de Senha**
- **Funcionalidade:** Cadastro de Usuários (`usuarios.html`)
- **Comportamento Esperado:** O sistema deve exigir no mínimo 6 caracteres para senhas de novos usuários.
- **Comportamento Atual (Versão A):** O sistema aceita qualquer senha não vazia, inclusive senhas de 1 único caractere como `1`.
- **Passos para Reprodução:**
  1. Ir em "Usuários".
  2. Preencher Nome, E-mail e Perfil.
  3. No campo Senha digitar apenas `1`.
  4. Clicar em "Cadastrar Usuário".
  5. O usuário é aceito com sucesso sem alerta de erro.
- **Dados Necessários:** Senha com 1 caractere (`1`).
- **Severidade:** Alta (Vulnerabilidade de segurança).
- **Prioridade de Correção:** Alta.
- **Status:** Aberto na Versão A / Corrigido na Versão B.
- **Versão em que existe:** Versão A.
- **Versão em que foi corrigido:** Versão B.

---

### **DEF-004: Campo de Busca por Título Sensível a Caixa (Case-Sensitive)**
- **Funcionalidade:** Consulta de Chamados (`consulta.html`)
- **Comportamento Esperado:** A busca por texto no título deve ser insensível a maiúsculas/minúsculas. Digitar "monitor" deve localizar "Monitor não liga".
- **Comportamento Atual (Versão A):** A busca só retorna correspondências exatas de caracteres. "monitor" não encontra "Monitor não liga".
- **Passos para Reprodução:**
  1. Ir em "Consultar Chamados".
  2. No campo de busca, digitar `monitor` (em minúsculas).
  3. O chamado `#1 - Monitor não liga` desaparece da listagem.
- **Dados Necessários:** Termo `monitor`.
- **Severidade:** Média (Frustração do usuário na localização de registros).
- **Prioridade de Correção:** Média.
- **Status:** Aberto na Versão A / Corrigido na Versão B.
- **Versão em que existe:** Versão A.
- **Versão em que foi corrigido:** Versão B.

---

### **DEF-005: Filtro de Status "Em andamento" Retorna Listagem Vazia**
- **Funcionalidade:** Consulta de Chamados (`consulta.html`)
- **Comportamento Esperado:** Ao selecionar o filtro "Em andamento", devem ser listados todos os chamados com status "Em andamento".
- **Comportamento Atual (Versão A):** A tabela exibe "Nenhum chamado encontrado" devido à busca interna pela string `andamento` em vez de `Em andamento`.
- **Passos para Reprodução:**
  1. Ir em "Consultar Chamados".
  2. No dropdown "Filtrar por Status", selecionar `Em andamento`.
  3. A tabela é esvaziada, mesmo havendo chamados com esse status no banco.
- **Dados Necessários:** Seleção do filtro `Em andamento`.
- **Severidade:** Média (Quebra uma funcionalidade central de filtragem).
- **Prioridade de Correção:** Média.
- **Status:** Aberto na Versão A / Corrigido na Versão B.
- **Versão em que existe:** Versão A.
- **Versão em que foi corrigido:** Versão B.

---

### **DEF-006: Submissão de Chamados com Campos Obrigatórios Vazios**
- **Funcionalidade:** Abertura de Novo Chamado (`novo.html`)
- **Comportamento Esperado:** O sistema deve validar e impedir a gravação de chamados sem Título e Descrição preenchidos.
- **Comportamento Atual (Versão A):** O formulário submete sem validar campos em branco, gerando chamados sem título na listagem.
- **Passos para Reprodução:**
  1. Acessar "Abrir Chamado".
  2. Deixar Título e Descrição vazios.
  3. Clicar em "Abrir Chamado".
  4. Mensagem de sucesso é exibida e o registro vazio é salvo.
- **Dados Necessários:** Formulário em branco.
- **Severidade:** Média (Corrupção de integridade dos dados na base).
- **Prioridade de Correção:** Média.
- **Status:** Aberto na Versão A / Corrigido na Versão B.
- **Versão em que existe:** Versão A.
- **Versão em que foi corrigido:** Versão B.

---

### **DEF-007: Divergência na Métrica de Chamados Abertos do Dashboard**
- **Funcionalidade:** Painel Dashboard (`dashboard.html`)
- **Comportamento Esperado:** O card "Chamados Abertos" deve refletir exatamente o número total de chamados com status "Aberto".
- **Comportamento Atual (Versão A):** O contador de abertos descarta chamados abertos que possuam prioridade "Baixa", gerando divergência entre o total numérico do painel e os registros reais.
- **Passos para Reprodução:**
  1. Criar um chamado com prioridade Baixa (ou verificar chamados abertos existentes).
  2. Acessar o "Dashboard".
  3. Notar que o número do card "Chamados Abertos" não bate com a contagem da tabela de consulta.
- **Dados Necessários:** Chamado com status Aberto e Prioridade Baixa.
- **Severidade:** Média (Informação gerencial incorreta).
- **Prioridade de Correção:** Média.
- **Status:** Aberto na Versão A / Corrigido na Versão B.
- **Versão em que existe:** Versão A.
- **Versão em que foi corrigido:** Versão B.

---

### **DEF-008: Efeito Hidra na Mudança de Status para Encerrado**
- **Funcionalidade:** Consulta e Edição de Status (`consulta.html`)
- **Comportamento Esperado:** Ao alterar o status de um chamado para "Encerrado", o sistema deve apenas atualizar o status do chamado selecionado.
- **Comportamento Atual (Versão A):** Ao mudar para "Encerrado", o sistema atualiza o item, mas cria automaticamente um novo chamado com status "Aberto" prefixado com "Reabertura automática: ".
- **Passos para Reprodução:**
  1. Ir em "Consultar Chamados".
  2. Selecionar o dropdown de status de um chamado e escolher `Encerrado`.
  3. Observar que uma nova linha surge na tabela com status `Aberto`.
- **Dados Necessários:** Alteração de status para Encerrado.
- **Severidade:** Alta (Impede o encerramento efetivo e polui o banco).
- **Prioridade de Correção:** Alta.
- **Status:** Aberto na Versão A / Corrigido na Versão B.
- **Versão em que existe:** Versão A.
- **Versão em que foi corrigido:** Versão B.

---

### **DEF-REG-001: Efeito Colateral na Edição de Status (Regressão na Versão B)**
- **Funcionalidade:** Consulta e Edição de Status (`consulta.html`)
- **Comportamento Esperado:** A alteração de status de um chamado deve modificar unicamente o campo de status, preservando a prioridade original (`Alta` ou `Baixa`).
- **Comportamento Atual (Versão B):** Ao alterar o status de qualquer chamado para "Em andamento", a prioridade desse chamado é sobrescrita acidentalmente para "Média".
- **Passos para Reprodução:**
  1. Estar na **Versão B**.
  2. Identificar o chamado `#1 - Monitor não liga` (Prioridade `Alta`, Status `Aberto`).
  3. No seletor de status da tabela, mudar de `Aberto` para `Em andamento`.
  4. Observar que a prioridade do chamado muda automaticamente de `Alta` para `Média`.
- **Severidade:** Alta (Corrupção colateral de dados durante o reteste).
- **Prioridade de Correção:** Alta.
- **Status:** Novo defeito introduzido na Versão B (Efeito Colateral).
- **Versão em que existe:** Versão B.

---

### **DEF-REG-002: Sobreposição do Filtro de Status pela Busca Textual (Regressão na Versão B)**
- **Funcionalidade:** Consulta de Chamados (`consulta.html`)
- **Comportamento Esperado:** Ao aplicar simultaneamente uma busca por texto e um filtro de status, a tabela deve exibir apenas os chamados que atendem aos DOIS critérios cumulativos (interseção lógica `AND`).
- **Comportamento Atual (Versão B):** Quando há texto no campo de busca, o filtro de status selecionado é completamente ignorado pelo algoritmo, retornando registros com qualquer status.
- **Passos para Reprodução:**
  1. Estar na **Versão B**.
  2. Na tela de consulta, selecionar no filtro de status: `Aberto`.
  3. No campo de busca, digitar `Sistema` (referente ao chamado `#2 - Sistema lento`, cujo status é `Em andamento`).
  4. O chamado `#2` é exibido na tela, violando o filtro ativo de status `Aberto`.
- **Severidade:** Média (Inconsistência de consulta avançada).
- **Prioridade de Correção:** Média.
- **Status:** Novo defeito introduzido na Versão B (Efeito Colateral).
- **Versão em que existe:** Versão B.

---

## 5. Matriz de Casos de Teste

### 5.1. Casos Bons (Caminho Feliz — Devem Passar em Ambas as Versões)
| ID Caso | Funcionalidade | Pré-condição / Dados | Passos Principais | Resultado Esperado |
|---|---|---|---|---|
| **CT-LOGIN-001** | Autenticação | Usuário: `usuario.teste@senai.br`<br>Senha: `SenhaValida123` | Preencher login e clicar em Entrar. | Login aceito com redirecionamento para o Dashboard. |
| **CT-LOGIN-002** | Autenticação | Usuário: `aluno`<br>Senha: `123` | Preencher login e clicar em Entrar. | Login aceito com redirecionamento para o Dashboard. |
| **CT-CHAMADO-001** | Abertura | Categoria: `Software`<br>Prioridade: `Média` | Preencher dados válidos e salvar. | Chamado gravado com categoria Software e prioridade Média. |
| **CT-CHAMADO-002** | Abertura | Categoria: `Outros`<br>Prioridade: `Baixa` | Preencher dados válidos e salvar. | Chamado gravado com prioridade Baixa. |
| **CT-USER-001** | Usuários | Nome: `Carlos QA`<br>Email: `carlos.qa@senai.br`<br>Senha: `Segura@2026` | Preencher formulário e cadastrar. | Usuário salvo com sucesso e listado na tabela. |

---

### 5.2. Casos que Devem Falhar na VERSÃO A
| ID Caso | Defeito Associado | Cenário | Comportamento Esperado vs. Obtido na Versão A |
|---|---|---|---|
| **CT-PRIORIDADE-001** | DEF-001 | Hardware + Alta | Esperado: `Alta` \| Obtido: `Baixa` (Falha) |
| **CT-USER-002** | DEF-002 | Email duplicado com maiúsculas | Esperado: `Bloquear` \| Obtido: `Cadastra duplicado` (Falha) |
| **CT-USER-003** | DEF-003 | Senha de 1 caractere (`1`) | Esperado: `Exigir >= 6` \| Obtido: `Aceita senha 1` (Falha) |
| **CT-BUSCA-001** | DEF-004 | Busca por `monitor` minúsculo | Esperado: `Exibir chamado 1` \| Obtido: `Lista vazia` (Falha) |
| **CT-FILTRO-001** | DEF-005 | Filtro `Em andamento` | Esperado: `Exibir chamado 2` \| Obtido: `Lista vazia` (Falha) |
| **CT-CHAMADO-003** | DEF-006 | Envio de formulário vazio | Esperado: `Alerta de validação` \| Obtido: `Grava chamado vazio` (Falha) |
| **CT-DASH-001** | DEF-007 | Contagem de chamados abertos | Esperado: `Total real` \| Obtido: `Subcontagem` (Falha) |
| **CT-STATUS-001** | DEF-008 | Mudar status para Encerrado | Esperado: `Apenas encerra` \| Obtido: `Reabre chamado duplicado` (Falha) |

---

### 5.3. Casos para Reteste na VERSÃO B
| ID Caso | Defeito Validado | Objetivo do Reteste | Resultado Esperado na Versão B | Status |
|---|---|---|---|---|
| **CT-PRIORIDADE-001** | DEF-001 | Confirmar se Hardware + Alta grava Alta | Prioridade gravada e exibida como **Alta** | **Aprovado (Passou)** |
| **CT-USER-003** | DEF-003 | Confirmar se senha curta é rejeitada | Alerta "A senha deve conter no mínimo 6 caracteres" | **Aprovado (Passou)** |
| **CT-FILTRO-001** | DEF-005 | Confirmar listagem de "Em andamento" | Chamado `#2 - Sistema lento` é exibido corretamente | **Aprovado (Passou)** |
| **CT-STATUS-001** | DEF-008 | Confirmar encerramento de chamado | Chamado é marcado como Encerrado sem criar duplicatas | **Aprovado (Passou)** |

---

### 5.4. Casos para Teste de Regressão na VERSÃO B
| ID Caso | Módulo Afetado | Ação de Teste | Resultado Esperado | Efeito Colateral Detectado na Versão B |
|---|---|---|---|---|
| **CT-REG-001** | Edição de Status | Alterar chamado de `Aberto` para `Em andamento` | Manter a prioridade original (`Alta` ou `Baixa`) | **Prioridade é forçada para `Média` (DEF-REG-001)** |
| **CT-REG-002** | Filtro Combinado | Filtrar por status `Aberto` e buscar termo `Sistema` | Não exibir resultados (pois "Sistema" é `Em andamento`) | **Chamado "Sistema lento" aparece na tabela ignorando o filtro (DEF-REG-002)** |

---

## 6. Guia Operacional para o Professor

### Como Alternar as Versões Durante a Aula:
1. **Via Interface:** No rodapé pedagógico de qualquer página, clicar no link:
   - `Alternar para Build B (Versão Corrigida)` ou `Alternar para Build A (Versão Inicial)`.
2. **Via Console do Navegador (F12):**
   ```javascript
   setVersion('B'); // Para carregar a Versão B
   setVersion('A'); // Para retornar à Versão A
   ```

### Como Restaurar os Dados Iniciais de Teste:
- Clicar em **"Restaurar Dados Padrão"** no rodapé pedagógico, ou executar no console:
  ```javascript
  resetTestData();
  ```

