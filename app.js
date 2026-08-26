// =======================================================
// ESTAÇÃO DE TESTES SENAI — SISTEMA DE CHAMADOS DE TI
// =======================================================

// 1. Controle de Versão Pedagógica (Versão A vs. Versão B)
function getAppVersion() {
    return localStorage.getItem('app_version') || 'A';
}

function setAppVersion(version) {
    const v = (version || 'A').toUpperCase() === 'B' ? 'B' : 'A';
    localStorage.setItem('app_version', v);
    window.location.reload();
}

// Funções utilitárias acessíveis globalmente no console
window.setVersion = setAppVersion;
window.getAppVersion = getAppVersion;
window.resetTestData = function () {
    localStorage.removeItem('chamados');
    localStorage.removeItem('usuarios');
    initData(true);
    window.location.reload();
};

// 2. Inicializador de Dados Mockados
function initData(force = false) {
    if (force || !localStorage.getItem('chamados')) {
        const mockChamados = [
            { id: 1, title: 'Monitor não liga', description: 'Monitor da sala 3 está sem energia', category: 'Hardware', priority: 'Alta', status: 'Aberto' },
            { id: 2, title: 'Sistema lento', description: 'O sistema de RH está travando hoje', category: 'Software', priority: 'Média', status: 'Em andamento' },
            { id: 3, title: 'Teclado com defeito', description: 'Teclas falhando', category: 'Hardware', priority: 'Baixa', status: 'Encerrado' }
        ];
        localStorage.setItem('chamados', JSON.stringify(mockChamados));
    }

    if (force || !localStorage.getItem('usuarios')) {
        const mockUsuarios = [
            { id: 1, nome: 'Usuário Teste', email: 'usuario.teste@senai.br', perfil: 'Administrador', senha: 'SenhaValida123' },
            { id: 2, nome: 'Aluno', email: 'aluno', perfil: 'Estudante', senha: '123' }
        ];
        localStorage.setItem('usuarios', JSON.stringify(mockUsuarios));
    }
}

initData();

// 3. Utilitários de Persistência
function getChamados() {
    return JSON.parse(localStorage.getItem('chamados') || '[]');
}

function saveChamados(chamados) {
    localStorage.setItem('chamados', JSON.stringify(chamados));
}

function getUsuarios() {
    return JSON.parse(localStorage.getItem('usuarios') || '[]');
}

function saveUsuarios(usuarios) {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

// 4. Controle de Autenticação
function checkAuth() {
    const path = window.location.pathname;
    const isLogin = path.endsWith('index.html') || path === '/' || path.endsWith('/');
    if (!localStorage.getItem('auth_token') && !isLogin) {
        window.location.href = 'index.html';
    }
}

function logout() {
    localStorage.removeItem('auth_token');
    window.location.href = 'index.html';
}

checkAuth();

// 5. Configuração do Rodapé Pedagógico (Alternador de Versão)
function setupPedagogicalNotice() {
    const version = getAppVersion();
    const notices = document.querySelectorAll('.pedagogical-notice');
    notices.forEach(notice => {
        const buildInfo = version === 'A' ? 'v1.0.0 (Build A)' : 'v1.1.0 (Build B)';
        const targetVersion = version === 'A' ? 'B' : 'A';
        const targetLabel = version === 'A' ? 'Build B (Versão Corrigida)' : 'Build A (Versão Inicial)';

        notice.innerHTML = `
            <span>Estação de Testes SENAI:</span> 
            <strong>${buildInfo}</strong> — 
            <button type="button" class="btn-version-toggle" onclick="setVersion('${targetVersion}')">Alternar para ${targetLabel}</button> | 
            <button type="button" class="btn-version-reset" onclick="resetTestData()">Restaurar Dados Padrão</button>
        `;
    });
}

// =======================================================
// LÓGICA ESPECÍFICA DE CADA PÁGINA
// =======================================================

document.addEventListener('DOMContentLoaded', () => {
    setupPedagogicalNotice();

    // ---------------------------------------------------
    // 1. TELA DE LOGIN (index.html)
    // ---------------------------------------------------
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('user').value.trim();
            const pass = document.getElementById('pass').value;
            const errorMsg = document.getElementById('loginError');

            const usuarios = getUsuarios();
            const foundUser = usuarios.find(u => u.email === user);

            if (foundUser && foundUser.senha === pass) {
                localStorage.setItem('auth_token', 'token_valido');
                window.location.href = 'dashboard.html';
            } else {
                errorMsg.textContent = 'Usuário ou senha inválidos.';
                errorMsg.style.display = 'block';
            }
        });
    }

    // ---------------------------------------------------
    // 2. DASHBOARD (dashboard.html)
    // ---------------------------------------------------
    const dashboardStats = document.getElementById('dashboardStats');
    if (dashboardStats) {
        const chamados = getChamados();
        const version = getAppVersion();

        let abertos = 0;
        let andamento = 0;
        let encerrados = 0;

        chamados.forEach(c => {
            const st = (c.status || '').toLowerCase();
            if (st === 'aberto') {
                // DEFEITO 7 (DEF-007): Na Versão A, o contador de Abertos ignora chamados com prioridade Baixa
                if (version === 'A') {
                    if (c.priority !== 'Baixa') {
                        abertos++;
                    }
                } else {
                    // VERSÃO B: Contagem correta
                    abertos++;
                }
            } else if (st === 'em andamento') {
                andamento++;
            } else if (st === 'encerrado') {
                encerrados++;
            }
        });

        const elAbertos = document.getElementById('countAbertos');
        const elAndamento = document.getElementById('countAndamento');
        const elEncerrados = document.getElementById('countEncerrados');

        if (elAbertos) elAbertos.textContent = abertos;
        if (elAndamento) elAndamento.textContent = andamento;
        if (elEncerrados) elEncerrados.textContent = encerrados;
    }

    // ---------------------------------------------------
    // 3. NOVO CHAMADO (novo.html)
    // ---------------------------------------------------
    const formNovo = document.getElementById('formNovo');
    if (formNovo) {
        formNovo.addEventListener('submit', (e) => {
            e.preventDefault();
            const tituloInput = document.getElementById('titulo');
            const descricaoInput = document.getElementById('descricao');
            const categoria = document.getElementById('categoria').value;
            let prioridade = document.getElementById('prioridade').value;
            const version = getAppVersion();

            const titulo = tituloInput ? tituloInput.value : '';
            const descricao = descricaoInput ? descricaoInput.value : '';

            // DEFEITO 6 (DEF-006): Na Versão A, permite submissão de chamado com título/descrição vazios
            if (version === 'B') {
                if (!titulo.trim() || !descricao.trim()) {
                    alert('Por favor, preencha todos os campos obrigatórios (Título e Descrição).');
                    return;
                }
            }

            // DEFEITO 1 (DEF-001 / CT-PRIORIDADE-001 — Demonstração do Professor):
            // Na Versão A, ao selecionar Categoria "Hardware", a prioridade é forçada para "Baixa"
            if (version === 'A') {
                if (categoria === 'Hardware') {
                    prioridade = 'Baixa';
                }
            }
            // Na Versão B: CORRIGIDO! Mantém a prioridade selecionada pelo usuário.

            const chamados = getChamados();
            const newId = chamados.length > 0 ? Math.max(...chamados.map(c => c.id)) + 1 : 1;

            const novo = {
                id: newId,
                title: titulo,
                description: descricao,
                category: categoria,
                priority: prioridade,
                status: 'Aberto'
            };

            chamados.push(novo);
            saveChamados(chamados);

            const successMsg = document.getElementById('formSuccess');
            if (!successMsg) {
                alert('Chamado criado com sucesso!');
            } else {
                successMsg.textContent = 'Chamado criado com sucesso!';
                successMsg.className = 'alert success';
                successMsg.style.display = 'block';
                formNovo.reset();
                setTimeout(() => { successMsg.style.display = 'none'; }, 3000);
            }
        });
    }

    // ---------------------------------------------------
    // 4. CONSULTA DE CHAMADOS (consulta.html)
    // ---------------------------------------------------
    const tableBody = document.getElementById('tableBody');
    if (tableBody) {
        const version = getAppVersion();

        const renderTable = (chamadosList) => {
            tableBody.innerHTML = '';

            if (chamadosList.length === 0) {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td colspan="5" style="text-align:center; color:#888; padding: 1.5rem;">Nenhum chamado encontrado.</td>`;
                tableBody.appendChild(tr);
                return;
            }

            chamadosList.forEach(c => {
                const tr = document.createElement('tr');
                
                let cssStatus = 'status-aberto';
                const st = (c.status || '').toLowerCase();
                if (st === 'em andamento') {
                    cssStatus = 'status-andamento';
                } else if (st === 'encerrado') {
                    cssStatus = 'status-encerrado';
                }

                tr.innerHTML = `
                    <td>#${c.id}</td>
                    <td>${c.title}</td>
                    <td>${c.category}</td>
                    <td>${c.priority}</td>
                    <td>
                        <select class="status-select ${cssStatus}" data-id="${c.id}" style="padding: 0.25rem 0.5rem; border-radius: 4px;">
                            <option value="Aberto" ${c.status === 'Aberto' ? 'selected' : ''}>Aberto</option>
                            <option value="Em andamento" ${c.status === 'Em andamento' ? 'selected' : ''}>Em andamento</option>
                            <option value="Encerrado" ${c.status === 'Encerrado' ? 'selected' : ''}>Encerrado</option>
                        </select>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
        };

        const searchInput = document.getElementById('busca');
        const filterStatus = document.getElementById('filtroStatus');

        const applyFilters = () => {
            let filtered = getChamados();
            const term = searchInput ? searchInput.value.trim() : '';
            const statusF = filterStatus ? filterStatus.value : '';

            if (version === 'A') {
                // VERSÃO A:
                // DEFEITO 4 (DEF-004): Busca sensível a maiúsculas/minúsculas (Case-sensitive)
                if (term) {
                    filtered = filtered.filter(c => c.title.includes(term));
                }

                // DEFEITO 5 (DEF-005): Filtro "Em andamento" compara com 'andamento' retornando vazio
                if (statusF) {
                    if (statusF === 'Em andamento') {
                        filtered = filtered.filter(c => c.status === 'andamento');
                    } else {
                        filtered = filtered.filter(c => c.status === statusF);
                    }
                }
            } else {
                // VERSÃO B:
                // DEF-004 e DEF-005 corrigidos.
                // NOVO EFEITO COLATERAL / REGRESSÃO (DEF-REG-002):
                // Quando há texto na busca e um filtro de status selecionado, a busca sobrepõe o status e busca em todos os chamados.
                if (term && statusF) {
                    filtered = filtered.filter(c => c.title.toLowerCase().includes(term.toLowerCase()));
                } else {
                    if (term) {
                        filtered = filtered.filter(c => c.title.toLowerCase().includes(term.toLowerCase()));
                    }
                    if (statusF) {
                        filtered = filtered.filter(c => c.status === statusF);
                    }
                }
            }

            renderTable(filtered);
        };

        let currentChamados = getChamados();
        renderTable(currentChamados);

        if (searchInput) searchInput.addEventListener('input', applyFilters);
        if (filterStatus) filterStatus.addEventListener('change', applyFilters);

        // Edição rápida de status na tabela
        tableBody.addEventListener('change', (e) => {
            if (e.target.classList.contains('status-select')) {
                const id = parseInt(e.target.getAttribute('data-id'), 10);
                const newStatus = e.target.value;
                const chamados = getChamados();
                const idx = chamados.findIndex(c => c.id === id);

                if (idx !== -1) {
                    chamados[idx].status = newStatus;

                    if (version === 'A') {
                        // DEFEITO 8 (DEF-008): EFEITO HIDRA
                        // Ao encerrar um chamado, o sistema cria automaticamente um novo chamado "Aberto" duplicado
                        if (newStatus === 'Encerrado') {
                            const newId = chamados.length > 0 ? Math.max(...chamados.map(c => c.id)) + 1 : 1;
                            chamados.push({
                                id: newId,
                                title: 'Reabertura automática: ' + chamados[idx].title,
                                description: 'Chamado gerado automaticamente pelo sistema.',
                                category: chamados[idx].category,
                                priority: chamados[idx].priority,
                                status: 'Aberto'
                            });
                        }
                    } else {
                        // VERSÃO B:
                        // DEF-008 CORRIGIDO (Efeito Hidra removido).
                        // NOVO EFEITO COLATERAL / REGRESSÃO (DEF-REG-001):
                        // Ao alterar o status de qualquer chamado para "Em andamento", a prioridade é resetada para "Média"
                        if (newStatus === 'Em andamento') {
                            chamados[idx].priority = 'Média';
                        }
                    }

                    saveChamados(chamados);
                    applyFilters();
                }
            }
        });
    }

    // ---------------------------------------------------
    // 5. USUÁRIOS (usuarios.html)
    // ---------------------------------------------------
    const formUsuario = document.getElementById('formUsuario');
    if (formUsuario) {
        const version = getAppVersion();

        const renderUsuarios = () => {
            const tbody = document.getElementById('tableUsuariosBody');
            if (!tbody) return;
            const usuariosList = getUsuarios();
            tbody.innerHTML = '';
            usuariosList.forEach(u => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>#${u.id}</td>
                    <td>${u.nome}</td>
                    <td>${u.email}</td>
                    <td>${u.perfil}</td>
                `;
                tbody.appendChild(tr);
            });
        };

        renderUsuarios();

        formUsuario.addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const perfil = document.getElementById('perfil').value;
            const senha = document.getElementById('senha').value;

            const errorMsg = document.getElementById('formError');
            const successMsg = document.getElementById('formSuccess');
            errorMsg.style.display = 'none';
            successMsg.style.display = 'none';

            // DEFEITO 3 (DEF-003): Validação de Senha Fraca
            if (version === 'A') {
                // Na Versão A, aceita senha com apenas 1 caractere
                if (senha.length === 0) {
                    errorMsg.textContent = 'A senha é obrigatória.';
                    errorMsg.style.display = 'block';
                    return;
                }
            } else {
                // Na Versão B (CORRIGIDO): Exige tamanho mínimo de 6 caracteres
                if (senha.length < 6) {
                    errorMsg.textContent = 'A senha deve conter no mínimo 6 caracteres.';
                    errorMsg.style.display = 'block';
                    return;
                }
            }

            const usuarios = getUsuarios();

            // DEFEITO 2 (DEF-002): E-mail Duplicado
            let exists = null;
            if (version === 'A') {
                // Na Versão A: Comparação sensível a maiúsculas/minúsculas (Case-sensitive)
                exists = usuarios.find(u => u.email === email);
            } else {
                // Na Versão B (CORRIGIDO): Comparação insensível (Case-insensitive)
                exists = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
            }

            if (exists) {
                errorMsg.textContent = 'Este e-mail já está em uso.';
                errorMsg.style.display = 'block';
                return;
            }

            const newId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
            usuarios.push({ id: newId, nome, email, perfil, senha });
            saveUsuarios(usuarios);

            successMsg.textContent = 'Usuário cadastrado com sucesso!';
            successMsg.style.display = 'block';
            formUsuario.reset();
            renderUsuarios();

            setTimeout(() => { successMsg.style.display = 'none'; }, 3000);
        });
    }
});
