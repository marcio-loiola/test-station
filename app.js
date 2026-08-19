// Mock Data Initializer
function initData() {
    if (!localStorage.getItem('chamados')) {
        const mockChamados = [
            { id: 1, title: 'Monitor não liga', description: 'Monitor da sala 3 está sem energia', category: 'Hardware', priority: 'Alta', status: 'Aberto' },
            { id: 2, title: 'Sistema lento', description: 'O sistema de RH está travando hoje', category: 'Software', priority: 'Média', status: 'Em andamento' },
            { id: 3, title: 'Teclado com defeito', description: 'Teclas falhando', category: 'Hardware', priority: 'Baixa', status: 'Encerrado' }
        ];
        localStorage.setItem('chamados', JSON.stringify(mockChamados));
    }

    if (!localStorage.getItem('usuarios')) {
        const mockUsuarios = [
            { id: 1, nome: 'Usuário Teste', email: 'usuario.teste@senai.br', perfil: 'Administrador', senha: 'SenhaValida123' },
            { id: 2, nome: 'Aluno', email: 'aluno', perfil: 'Estudante', senha: '123' }
        ];
        localStorage.setItem('usuarios', JSON.stringify(mockUsuarios));
    }
}

initData();

// Utility for fetching data
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

// Authentication Check
function checkAuth() {
    if (!localStorage.getItem('auth_token') && !window.location.pathname.endsWith('index.html') && window.location.pathname !== '/' && !window.location.pathname.endsWith('/')) {
        window.location.href = 'index.html';
    }
}

function logout() {
    localStorage.removeItem('auth_token');
    window.location.href = 'index.html';
}

checkAuth();

// ---- Page Specific Logic ----

document.addEventListener('DOMContentLoaded', () => {

    // 1. LOGIN PAGE
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('user').value;
            const pass = document.getElementById('pass').value;
            const errorMsg = document.getElementById('loginError');

            const usuarios = getUsuarios();
            const foundUser = usuarios.find(u => u.email === user);

            if (foundUser) {
                if (foundUser.senha === pass) {
                    localStorage.setItem('auth_token', 'token_valido');
                    window.location.href = 'dashboard.html';
                } else {
                    errorMsg.textContent = 'Usuário ou senha inválidos.';
                    errorMsg.style.display = 'block';
                }
            } else {
                errorMsg.textContent = 'Usuário ou senha inválidos.';
                errorMsg.style.display = 'block';
            }
        });
    }

    // 2. DASHBOARD PAGE
    const dashboardStats = document.getElementById('dashboardStats');
    if (dashboardStats) {
        const chamados = getChamados();
        
        let abertos = 0;
        let andamento = 0;
        let encerrados = 0;

        chamados.forEach(c => {
            if (c.status.toLowerCase() === 'aberto') abertos++;
            if (c.status.toLowerCase() === 'em andamento') andamento++;
            if (c.status.toLowerCase() === 'encerrado') encerrados++;
        });

        document.getElementById('countAbertos').textContent = abertos;
        document.getElementById('countAndamento').textContent = andamento;
        document.getElementById('countEncerrados').textContent = encerrados;
    }

    // 3. NOVO CHAMADO PAGE
    const formNovo = document.getElementById('formNovo');
    if (formNovo) {
        formNovo.addEventListener('submit', (e) => {
            e.preventDefault();
            const titulo = document.getElementById('titulo').value;
            const descricao = document.getElementById('descricao').value;
            const categoria = document.getElementById('categoria').value;
            let prioridade = document.getElementById('prioridade').value;

            // DEFEITO 4: NOVO CHAMADO — Prioridade (Rede sempre fica Baixa)
            if (categoria === 'Rede') {
                prioridade = 'Baixa';
            }

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
            if(!successMsg) {
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

    // 4. CONSULTA PAGE
    const tableBody = document.getElementById('tableBody');
    if (tableBody) {
        const renderTable = (chamadosList) => {
            tableBody.innerHTML = '';
            chamadosList.forEach(c => {
                const tr = document.createElement('tr');
                
                let cssStatus = 'status-aberto';
                if (c.status.toLowerCase() === 'em andamento') {
                    cssStatus = 'status-andamento';
                } else if (c.status.toLowerCase() === 'encerrado') {
                    cssStatus = 'status-encerrado';
                }

                tr.innerHTML = `
                    <td>#${c.id}</td>
                    <td>${c.title}</td>
                    <td>${c.category}</td>
                    <td>${c.priority}</td>
                    <td>
                        <select class="status-select ${cssStatus}" data-id="${c.id}" style="padding: 0.2rem; border-radius: 4px;">
                            <option value="Aberto" ${c.status === 'Aberto' ? 'selected' : ''}>Aberto</option>
                            <option value="Em andamento" ${c.status === 'Em andamento' ? 'selected' : ''}>Em andamento</option>
                            <option value="Encerrado" ${c.status === 'Encerrado' ? 'selected' : ''}>Encerrado</option>
                        </select>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
        };

        let currentChamados = getChamados();
        renderTable(currentChamados);

        const searchInput = document.getElementById('busca');
        const filterStatus = document.getElementById('filtroStatus');

        const applyFilters = () => {
            let filtered = getChamados();
            const term = searchInput.value;
            const statusF = filterStatus.value;

            if (term) {
                // DEFEITO 5: CONSULTA — Busca Sensível a Maiúsculas/Minúsculas
                filtered = filtered.filter(c => c.title.includes(term));
            }

            if (statusF) {
                // DEFEITO 6: FILTRO DE STATUS - "Em andamento" retorna vazio
                if (statusF === 'Em andamento') {
                    filtered = filtered.filter(c => c.status === 'andamento');
                } else {
                    filtered = filtered.filter(c => c.status === statusF);
                }
            }

            renderTable(filtered);
        };

        if (searchInput) searchInput.addEventListener('keyup', applyFilters);
        if (filterStatus) filterStatus.addEventListener('change', applyFilters);

        // Feature: Alteração de status
        tableBody.addEventListener('change', (e) => {
            if (e.target.classList.contains('status-select')) {
                const id = parseInt(e.target.getAttribute('data-id'));
                const newStatus = e.target.value;
                const chamados = getChamados();
                const idx = chamados.findIndex(c => c.id === id);
                if (idx !== -1) {
                    chamados[idx].status = newStatus;
                    saveChamados(chamados);
                    applyFilters();

                    // NOVO DEFEITO 1: EFEITO HIDRA (Ao encerrar, um novo é aberto automaticamente)
                    if (newStatus === 'Encerrado') {
                        const newId = chamados.length > 0 ? Math.max(...chamados.map(c => c.id)) + 1 : 1;
                        chamados.push({
                            id: newId,
                            title: 'Reabertura automática: ' + chamados[idx].title,
                            description: 'O sistema gerou este chamado sozinho por conta do Efeito Hidra.',
                            category: chamados[idx].category,
                            priority: chamados[idx].priority,
                            status: 'Aberto'
                        });
                        saveChamados(chamados);
                        applyFilters();
                    }
                }
            }
        });
    }

    // 5. USUÁRIOS PAGE
    const formUsuario = document.getElementById('formUsuario');
    if (formUsuario) {
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
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const perfil = document.getElementById('perfil').value;
            const senha = document.getElementById('senha').value;

            const errorMsg = document.getElementById('formError');
            const successMsg = document.getElementById('formSuccess');
            errorMsg.style.display = 'none';
            successMsg.style.display = 'none';

            // DEFEITO 3: CADASTRO - Validação de Campo de Senha (aceita 1 char)
            if (senha.length === 0) {
                errorMsg.textContent = 'A senha é obrigatória.';
                errorMsg.style.display = 'block';
                return;
            }

            const usuarios = getUsuarios();

            // DEFEITO 2: CADASTRO - E-mail Duplicado (Case-sensitive)
            const exists = usuarios.find(u => u.email === email);
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
