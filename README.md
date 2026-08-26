# Sistema de Chamados SENAI — Estação de Testes

Um sistema web de chamados de TI criado exclusivamente para **fins pedagógicos** em aulas de Testes de Sistemas do SENAI.

Este projeto contém **defeitos intencionais controlados** organizados em duas versões pedagógicas (**Versão A** e **Versão B**), permitindo que os alunos pratiquem todo o ciclo de qualidade: elaboração de casos de teste, execução manual, registro de evidências, documentação de defeitos, reteste de correções e testes de regressão.

## 🚀 Como Executar

O sistema foi construído puramente com **HTML, CSS e JavaScript Vanilla (ES6+)**. Ele não depende de bibliotecas externas, compiladores ou backend (todos os dados persistem localmente na memória do navegador via `localStorage`).

### Opção 1: Direto no Navegador (Sem instalação)
1. Dê um duplo clique no arquivo `index.html`.
2. O sistema abrirá no seu navegador padrão e já estará pronto para uso.

### Opção 2: Servidor Local (Opcional)
Se preferir rodar em um servidor web local:
```bash
# Com Python 3:
python -m http.server 8000
```
Acesse no navegador: [http://localhost:8000](http://localhost:8000)

## 🔑 Credenciais para Teste (Caminho Feliz)

Para autenticar no sistema:
- **Administrador:**
  - Usuário: `usuario.teste@senai.br`
  - Senha: `SenhaValida123`
- **Estudante:**
  - Usuário: `aluno`
  - Senha: `123`

## 🔄 Alternância entre VERSÃO A e VERSÃO B

O sistema possui um controle de versões pedagógicas:
- **Versão A (v1.0.0 — Build A):** Versão inicial da aula contendo os 8 defeitos didáticos para serem identificados pelos alunos (incluindo o caso do professor `CT-PRIORIDADE-001`).
- **Versão B (v1.1.0 — Build B):** Versão atualizada que corrige defeitos antigos e introduz efeitos colaterais controlados para a prática de reteste e testes de regressão.

A alternância pode ser feita:
1. Pelo link no rodapé pedagógico de qualquer tela (**"Alternar para Build B / Build A"**).
2. Pelo console do navegador via comando: `setVersion('B')` ou `setVersion('A')`.
3. Para restaurar a base de dados original: clique em **"Restaurar Dados Padrão"** no rodapé ou execute `resetTestData()`.

## ⚠️ Atenção Professor

Consulte o arquivo **`GABARITO_PROFESSOR.md`** para a matriz completa de defeitos, fichas técnicas, roteiro da demonstração do caso `CT-PRIORIDADE-001`, casos de reteste e testes de regressão.

> **Importante:** Mantenha o arquivo `GABARITO_PROFESSOR.md` restrito ao corpo docente. Deixe que os alunos descubram os comportamentos e inconsistências através de seus próprios casos de teste!
