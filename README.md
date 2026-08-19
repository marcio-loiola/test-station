# Sistema de Chamados SENAI — Estação de Testes

Um pequeno sistema de chamados Web criado exclusivamente para **fins pedagógicos** em aulas de Testes de Sistemas. 

Este projeto contém **defeitos (bugs) inseridos intencionalmente** para que os alunos possam praticar a execução de testes manuais, comparação entre resultado esperado vs. obtido, e a criação de relatórios de bugs.

## 🚀 Como Executar

O sistema foi construído puramente com **HTML, CSS e JavaScript (Vanilla)**. Ele não possui banco de dados real e não necessita de backend (todos os dados ficam salvos localmente na memória do navegador via `localStorage`).

Você tem duas opções para rodar o projeto:

### Opção 1: Direto no Navegador (Mais simples)
Não exige nenhuma instalação ou linha de comando.
1. Abra a pasta do projeto (`/Users/marciob/Dev/TestStation/`).
2. Dê um duplo clique no arquivo `index.html`.
3. O sistema abrirá no seu navegador padrão e já estará pronto para uso.

### Opção 2: Usando um Servidor Local (Recomendado)
Se quiser simular um ambiente web real rodando em uma porta local (ex: `http://localhost:8000`), você pode iniciar um servidor rápido pelo terminal do Mac.

1. Abra o **Terminal**.
2. Navegue até a pasta do projeto:
   ```bash
   cd ~/Dev/TestStation/
   ```
3. Inicie o servidor usando o Python (nativo no macOS):
   ```bash
   python3 -m http.server 8000
   ```
4. Abra o navegador e acesse: [http://localhost:8000](http://localhost:8000)

## 🔑 Credenciais para Teste (Caminho Feliz)

Para passar pela tela de login caso necessário:
- **Usuário:** `aluno`
- **Senha:** `1234`

## ⚠️ Atenção Professor

Este sistema contém os seguintes arquivos principais:
- `index.html` (Login)
- `dashboard.html` (Métricas)
- `novo.html` (Criação)
- `consulta.html` (Tabela)
- `app.js` (Onde toda a lógica e os bugs intencionais foram programados)
- `style.css` (Visual)

**Não forneça o gabarito de erros aos alunos.** Deixe que eles explorem as missões e descubram as falhas de validação, filtros quebrados e mensagens inconsistentes por conta própria!
