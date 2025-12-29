// ===========================
// PROJECT.JS - Página do Projeto
// ===========================

// Dados mock de projeto
let currentProject = null;

// Participantes mock
const mockParticipants = [
    {
        id: 1,
        name: "Ana Silva",
        initials: "AS",
        role: "Pesquisa e Coleta de Dados",
        progress: 75,
        lastActivity: "há 2 horas"
    },
    {
        id: 2,
        name: "Bruno Costa",
        initials: "BC",
        role: "Escrita e Revisão",
        progress: 60,
        lastActivity: "há 5 horas"
    },
    {
        id: 3,
        name: "Carlos Mendes",
        initials: "CM",
        role: "Análise de Dados",
        progress: 45,
        lastActivity: "há 1 dia"
    }
];

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initializeProject();
});

function initializeProject() {
    loadProjectData();
    setupEventListeners();
}

// Carregar dados do projeto
function loadProjectData() {
    // Obter ID do projeto da URL ou localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id') || localStorage.getItem('currentProjectId');
    
    if (!projectId) {
        alert('Projeto não encontrado!');
        window.location.href = 'home.html';
        return;
    }
    
    // Buscar projeto nos dados (usar window.projectsData se disponível)
    const projects = window.projectsData || [
        {
            id: 1,
            title: "Aplicações Clínicas da Biomedicina Molecular",
            description: "Revisão acadêmica sobre técnicas moleculares aplicadas ao diagnóstico clínico.",
            status: "in-progress",
            progress: 65,
            participants: mockParticipants,
            lastActivity: "há 2 dias"
        }
    ];
    
    currentProject = projects.find(p => p.id == projectId);
    
    if (!currentProject) {
        alert('Projeto não encontrado!');
        window.location.href = 'home.html';
        return;
    }
    
    // Renderizar informações do projeto
    renderProjectInfo();
    renderParticipants();
}

// Renderizar informações do projeto
function renderProjectInfo() {
    // Título
    document.getElementById('project-title').textContent = currentProject.title;
    
    // Status
    const statusBadge = document.getElementById('project-status');
    let statusText = '';
    let statusEmoji = '';
    
    switch (currentProject.status) {
        case 'in-progress':
            statusText = 'Em andamento';
            statusEmoji = '🟢';
            break;
        case 'completed':
            statusText = 'Concluído';
            statusEmoji = '🔵';
            break;
        case 'delayed':
            statusText = 'Atrasado';
            statusEmoji = '🔴';
            break;
    }
    
    statusBadge.textContent = `${statusEmoji} ${statusText}`;
    
    // Progresso
    document.getElementById('project-progress-text').textContent = `${currentProject.progress}%`;
    document.getElementById('project-progress-bar').style.width = `${currentProject.progress}%`;
}

// Renderizar participantes
function renderParticipants() {
    const participantsGrid = document.getElementById('participants-grid');
    const participants = currentProject.participants || mockParticipants;
    
    // Atualizar contador
    document.getElementById('participant-count').textContent = `(${participants.length})`;
    
    // Limpar grid
    participantsGrid.innerHTML = '';
    
    // Renderizar cada participante
    participants.forEach(participant => {
        const card = createParticipantCard(participant);
        participantsGrid.appendChild(card);
    });
}

// Criar card de participante
function createParticipantCard(participant) {
    const card = document.createElement('div');
    card.className = 'participant-card';
    
    card.innerHTML = `
        <div class="participant-header">
            <div class="participant-avatar">${participant.initials}</div>
            <div class="participant-info">
                <h4>${participant.name}</h4>
                <p class="participant-role">${participant.role}</p>
            </div>
        </div>
        <div class="participant-progress">
            <div class="progress-label">
                <span>Progresso</span>
                <span class="progress-percentage">${participant.progress}%</span>
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar-fill" style="width: ${participant.progress}%"></div>
            </div>
        </div>
        <div class="participant-activity">
            <i class="fas fa-clock"></i> Última atividade: ${participant.lastActivity}
        </div>
    `;
    
    return card;
}

// Setup de Event Listeners
function setupEventListeners() {
    // Botão voltar
    document.getElementById('back-to-home').addEventListener('click', () => {
        window.location.href = 'home.html';
    });
    
    // Botão abrir estrutura
    document.getElementById('open-structure-btn').addEventListener('click', () => {
        alert('Funcionalidade de estrutura do trabalho em desenvolvimento!');
    });
    
    // Botão acessar documentos
    document.getElementById('open-documents-btn').addEventListener('click', () => {
        alert('Funcionalidade de documentos em desenvolvimento!');
    });
    
    // Navegação para home no ícone
    const homeBtn = document.getElementById('home-icon-btn');
    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            window.location.href = 'home.html';
        });
    }
}
