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
    
    // Buscar projeto nos dados do localStorage
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    
    console.log('🔍 Buscando projeto com ID:', projectId);
    console.log('📦 Projetos disponíveis:', projects);
    
    currentProject = projects.find(p => String(p.id) === String(projectId));
    
    if (!currentProject) {
        console.error('❌ Projeto não encontrado com ID:', projectId);
        console.error('📦 Projetos disponíveis:', projects.map(p => ({ id: p.id, title: p.title })));
        alert('Projeto não encontrado! Você será redirecionado para a página inicial.');
        window.location.href = 'home.html';
        return;
    }
    
    console.log('✅ Projeto encontrado:', currentProject.title);
    
    // Renderizar informações do projeto
    renderProjectInfo();
    renderParticipants();
}

// Renderizar informações do projeto
function renderProjectInfo() {
    // Título
    document.getElementById('project-title').textContent = currentProject.title;
    
    // Descrição
    const descriptionElement = document.getElementById('project-description');
    if (descriptionElement) {
        // Usar fullDescription se disponível, senão usar description
        const description = currentProject.fullDescription || currentProject.description || 'Sem descrição disponível.';
        descriptionElement.textContent = description;
    }
    
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
    const participants = currentProject.participants || [];
    
    // Atualizar contador
    document.getElementById('participant-count').textContent = `(${participants.length})`;
    
    // Limpar grid
    participantsGrid.innerHTML = '';
    
    // Se não houver participantes, mostrar mensagem
    if (participants.length === 0) {
        participantsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #666;">
                <i class="fas fa-users" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                <p>Nenhum participante adicionado ainda.</p>
            </div>
        `;
        return;
    }
    
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
    
    const role = participant.role || 'Participante';
    const progress = participant.progress || 0;
    const lastActivity = participant.lastActivity || 'sem atividade recente';
    
    card.innerHTML = `
        <div class="participant-header">
            <div class="participant-avatar">${participant.initials}</div>
            <div class="participant-info">
                <h4>${participant.name}</h4>
                <p class="participant-role">${role}</p>
            </div>
        </div>
        <div class="participant-progress">
            <div class="progress-label">
                <span>Progresso</span>
                <span class="progress-percentage">${progress}%</span>
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar-fill" style="width: ${progress}%"></div>
            </div>
        </div>
        <div class="participant-activity">
            <i class="fas fa-clock"></i> Última atividade: ${lastActivity}
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
