// Estado da aplicação
let works = [];
let currentFilter = 'all';

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pouco para garantir que o main.js foi carregado
    setTimeout(() => {
        initializeApp();
        setupSidebarListeners();
    }, 100);
});

function setupSidebarListeners() {
    // Event listener para o botão home na sidebar
    const homeBtn = document.getElementById('home-icon-btn');
    console.log('Home button found:', homeBtn);
    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            console.log('Home button clicked');
            showWorksPage();
        });
    }

    // Event listener para fechar sidebar e mostrar works page
    const closeBtns = document.querySelectorAll('.close-sidebar-btn');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            showWorksPage();
        });
    });
}

function showWorksPage() {
    console.log('showWorksPage called');
    // Esconder editor
    const editor = document.getElementById('file-editor');
    if (editor) editor.style.display = 'none';
    
    // Carregar e mostrar página de trabalhos
    const content = document.getElementById('content');
    console.log('Content element:', content);
    if (content) {
        fetch('../html/works.html')
            .then(response => {
                console.log('Fetch response:', response);
                return response.text();
            })
            .then(html => {
                console.log('HTML loaded, length:', html.length);
                content.innerHTML = html;
                // Carregar dados e configurar listeners após carregar o HTML
                loadWorks();
                setupEventListeners();
            })
            .catch(error => console.error('Erro ao carregar works.html:', error));
    }
    
    // Fechar sidebar
    if (typeof closeLeftSidebar === 'function') {
        closeLeftSidebar();
    }
}

function initializeApp() {
    console.log('🚀 Initializing works app...');
    // Carregar informações do usuário do localStorage
    const userName = localStorage.getItem('userName') || 'Usuário';
    
    // Verificar se o main.js já carregou o fileSystem
    if (window.fileSystemData) {
        console.log('✅ FileSystem data already loaded');
    } else {
        console.log('⏳ Waiting for fileSystem to load...');
    }
    
    // Mostrar a página de trabalhos por padrão
    showWorksPage();
    
    // Carregar notificações
    updateNotifications();
}

function loadWorks() {
    // Carregar trabalhos do localStorage ou usar dados mockados
    const savedWorks = localStorage.getItem('works');
    
    if (savedWorks) {
        works = JSON.parse(savedWorks);
    } else {
        // Dados de exemplo
        works = [
            {
                id: 1,
                title: 'Aplicações Clínicas em Biomedicina',
                area: 'Biomedicina',
                deadline: '2025-03-15',
                description: 'Estudo sobre aplicações clínicas e laboratoriais em biomedicina',
                status: 'in-progress',
                progress: 45,
                role: 'admin',
                members: [
                    { name: 'João Silva', initials: 'JS' },
                    { name: 'Maria Santos', initials: 'MS' },
                    { name: 'Pedro Costa', initials: 'PC' },
                    { name: 'Ana Lima', initials: 'AL' }
                ],
                lastActivity: '2025-12-28T10:30:00',
                created: '2025-12-01'
            },
            {
                id: 2,
                title: 'Genética Molecular Aplicada',
                area: 'Genética',
                deadline: '2025-02-20',
                description: 'Pesquisa sobre DNA recombinante e terapia gênica',
                status: 'review',
                progress: 78,
                role: 'collaborator',
                members: [
                    { name: 'Carlos Souza', initials: 'CS' },
                    { name: 'Lucia Ferreira', initials: 'LF' },
                    { name: 'Roberto Alves', initials: 'RA' }
                ],
                lastActivity: '2025-12-27T15:20:00',
                created: '2025-11-15'
            },
            {
                id: 3,
                title: 'Imunologia e Vacinas',
                area: 'Imunologia',
                deadline: '2025-01-30',
                description: 'Estudo sobre desenvolvimento de vacinas e resposta imunológica',
                status: 'in-progress',
                progress: 60,
                role: 'admin',
                members: [
                    { name: 'Fernanda Costa', initials: 'FC' },
                    { name: 'Gabriel Rocha', initials: 'GR' }
                ],
                lastActivity: '2025-12-29T09:15:00',
                created: '2025-12-10'
            }
        ];
        saveWorks();
    }
    
    renderWorks();
}

function saveWorks() {
    localStorage.setItem('works', JSON.stringify(works));
}

function renderWorks() {
    const grid = document.getElementById('worksGrid');
    const emptyState = document.getElementById('emptyState');
    
    // Filtrar trabalhos
    let filteredWorks = works;
    
    if (currentFilter !== 'all') {
        filteredWorks = works.filter(w => {
            if (currentFilter === 'in-progress') return w.status === 'in-progress';
            if (currentFilter === 'review') return w.status === 'review';
            if (currentFilter === 'completed') return w.status === 'completed';
            return true;
        });
    }
    
    // Aplicar busca
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm) {
        filteredWorks = filteredWorks.filter(w => 
            w.title.toLowerCase().includes(searchTerm) ||
            w.area.toLowerCase().includes(searchTerm)
        );
    }
    
    if (filteredWorks.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        grid.style.display = 'grid';
        emptyState.style.display = 'none';
        
        grid.innerHTML = filteredWorks.map(work => createWorkCard(work)).join('');
        
        // Adicionar event listeners aos cards
        document.querySelectorAll('.work-card').forEach(card => {
            card.addEventListener('click', () => {
                const workId = parseInt(card.dataset.workId);
                openWork(workId);
            });
        });
    }
}

function createWorkCard(work) {
    const deadlineClass = getDeadlineClass(work.deadline);
    const deadlineText = formatDeadline(work.deadline);
    const statusClass = `status-${work.status}`;
    const statusText = getStatusText(work.status);
    
    const membersHTML = work.members.slice(0, 4).map(member => 
        `<div class="member-avatar" title="${member.name}">${member.initials}</div>`
    ).join('');
    
    const memberCountText = work.members.length > 1 
        ? `${work.members.length} membros` 
        : '1 membro';
    
    return `
        <div class="work-card" data-work-id="${work.id}">
            <div class="work-card-header">
                <h3 class="work-title">${work.title}</h3>
                <span class="work-area">${work.area}</span>
            </div>
            
            <div class="work-meta">
                <div class="meta-item ${deadlineClass}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    ${deadlineText}
                </div>
                
                <div class="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    ${formatLastActivity(work.lastActivity)}
                </div>
            </div>
            
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${work.progress}%"></div>
            </div>
            
            <div class="work-members">
                <div class="member-avatars">
                    ${membersHTML}
                </div>
                <span class="member-count">${memberCountText}</span>
            </div>
            
            <div class="work-footer">
                <span class="work-status ${statusClass}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="8"></circle>
                    </svg>
                    ${statusText}
                </span>
                <span class="work-role ${work.role === 'admin' ? 'role-admin' : ''}">
                    ${work.role === 'admin' ? 'Administrador' : 'Colaborador'}
                </span>
            </div>
        </div>
    `;
}

function getDeadlineClass(deadline) {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const daysLeft = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return 'deadline-danger';
    if (daysLeft <= 7) return 'deadline-danger';
    if (daysLeft <= 14) return 'deadline-warning';
    return '';
}

function formatDeadline(deadline) {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const daysLeft = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return `Atrasado ${Math.abs(daysLeft)} dias`;
    if (daysLeft === 0) return 'Hoje';
    if (daysLeft === 1) return 'Amanhã';
    if (daysLeft <= 7) return `${daysLeft} dias restantes`;
    
    return deadlineDate.toLocaleDateString('pt-BR');
}

function formatLastActivity(activity) {
    const now = new Date();
    const activityDate = new Date(activity);
    const diffMs = now - activityDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Agora mesmo';
    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    
    return activityDate.toLocaleDateString('pt-BR');
}

function getStatusText(status) {
    const statusMap = {
        'in-progress': 'Em Desenvolvimento',
        'review': 'Em Revisão',
        'completed': 'Concluído'
    };
    return statusMap[status] || status;
}

function openWork(workId) {
    // Salvar o ID do trabalho selecionado
    localStorage.setItem('currentWorkId', workId);
    
    // Redirecionar para a página do workspace (será criada depois)
    window.location.href = 'workspace.html';
}

function updateNotifications() {
    // Simular notificações
    const count = works.filter(w => {
        const deadline = new Date(w.deadline);
        const now = new Date();
        const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
        return daysLeft <= 7 && daysLeft >= 0;
    }).length;
    
    const badge = document.getElementById('notificationCount');
    badge.textContent = count;
    badge.style.display = count > 0 ? 'block' : 'none';
}

function setupEventListeners() {
    // Botões de criar trabalho
    document.getElementById('createWorkBtn').addEventListener('click', openCreateModal);
    document.getElementById('createWorkBtnEmpty').addEventListener('click', openCreateModal);
    
    // Modal
    document.getElementById('closeModalBtn').addEventListener('click', closeCreateModal);
    document.getElementById('cancelBtn').addEventListener('click', closeCreateModal);
    document.querySelector('.modal-overlay').addEventListener('click', closeCreateModal);
    
    // Form
    document.getElementById('createWorkForm').addEventListener('submit', handleCreateWork);
    
    // Filtros
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderWorks();
        });
    });
    
    // Busca
    document.getElementById('searchInput').addEventListener('input', renderWorks);
}

function openCreateModal() {
    document.getElementById('createWorkModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCreateModal() {
    document.getElementById('createWorkModal').classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('createWorkForm').reset();
}

function handleCreateWork(e) {
    e.preventDefault();
    
    const title = document.getElementById('workTitle').value;
    const area = document.getElementById('workArea').value;
    const deadline = document.getElementById('workDeadline').value;
    const description = document.getElementById('workDescription').value;
    
    const newWork = {
        id: Date.now(),
        title,
        area,
        deadline,
        description,
        status: 'in-progress',
        progress: 0,
        role: 'admin',
        members: [
            { 
                name: localStorage.getItem('userName') || 'Usuário', 
                initials: (localStorage.getItem('userName') || 'US').split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
            }
        ],
        lastActivity: new Date().toISOString(),
        created: new Date().toISOString()
    };
    
    works.unshift(newWork);
    saveWorks();
    renderWorks();
    updateNotifications();
    closeCreateModal();
    
    // Feedback visual
    alert('Trabalho criado com sucesso!');
}
