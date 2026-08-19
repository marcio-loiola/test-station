# Estação de Testes SENAI - Guia do Aluno

Bem-vindo(a) à **Estação de Testes**! Este é um ambiente simulado construído especificamente para que você coloque em prática os conceitos de **Casos de Teste**, **Execução** e **Relatório de Defeitos**.

---

## 1. O que é este sistema?
O "Sistema Web de Controle de Chamados de TI" é uma aplicação simples onde usuários autenticados podem abrir, visualizar e organizar solicitações de suporte técnico. 

Embora o sistema seja estável em seus caminhos principais, ele contém **falhas intencionais** escondidas. O seu objetivo não é usar o sistema normalmente, mas sim atuar como um **Analista de Qualidade (QA)** para estressá-lo com dados mapeados e descobrir se os resultados batem com o esperado.

---

## 2. Bases do Sistema (Escopo para Testes)

Para criar seus **Casos de Teste**, baseie-se nas funcionalidades centrais que o sistema se propõe a fazer. Você deve escrever casos que explorem:

* **Autenticação:** O sistema deve permitir o acesso apenas com credenciais válidas.
* **Cadastro de Usuários:** Disponível apenas no painel interno. Deve criticar senhas fracas e não permitir e-mails duplicados.
* **Abertura de Chamados:** Todos os campos devem funcionar, e as regras de negócio de prioridade devem ser respeitadas.
* **Consulta e Filtros:** A tabela deve listar os chamados. As buscas de texto devem funcionar independentemente de letras maiúsculas ou minúsculas, e os filtros de status devem ser exatos.
* **Edição de Status:** Ao alterar o status de um chamado (ex: para Encerrado), o sistema deve fechar o chamado sem criar inconsistências.

*Dica: Você tem acesso à aba **"Teste o jogo"** no canto da tela de login. Use-a para revisar a estrutura obrigatória de um Caso de Teste antes de começar!*

---

## 3. Dados de Acesso Pré-Configurados

Para iniciar sua jornada de testes e acessar o painel principal, utilize um dos usuários já registrados no banco de dados da aplicação:

### Usuário Administrador
* **E-mail:** `usuario.teste@senai.br`
* **Senha:** `SenhaValida123`

### Usuário Estudante
* **E-mail:** `aluno`
* **Senha:** `123`

*(Nota: Você pode usar esses dados como "Pré-condição" nos seus casos de teste).*

---

## 4. O seu Desafio
1. **Escreva:** Elabore casos de teste cobrindo caminhos felizes (dados válidos) e caminhos de exceção (dados inválidos ou limites do sistema).
2. **Execute:** Siga o passo-a-passo que você mesmo(a) escreveu.
3. **Compare:** O Resultado Obtido foi igual ao Resultado Esperado?
4. **Reporte:** Se o sistema apresentar um comportamento inesperado (um *Bug*!), colete a evidência e preencha um "Relatório de Defeito".

**Boa caçada aos bugs!**
