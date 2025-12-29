// ===========================
// HOME.JS - Página Inicial
// ===========================

// Dados mock de projetos
let projects = [
    {
        id: 1,
        title: "Aplicações Clínicas da Biomedicina Molecular",
        description: "Revisão acadêmica sobre técnicas moleculares aplicadas ao diagnóstico clínico.",
        status: "in-progress",
        progress: 65,
        participants: [
            { name: "Ana Silva", initials: "AS" },
            { name: "Bruno Costa", initials: "BC" },
            { name: "Carlos Mendes", initials: "CM" }
        ],
        lastActivity: "há 2 dias"
    },
    {
        id: 2,
        title: "Inteligência Artificial na Medicina",
        description: "Estudo sobre machine learning aplicado a diagnósticos médicos precoces.",
        status: "in-progress",
        progress: 42,
        participants: [
            { name: "Daniela Souza", initials: "DS" },
            { name: "Eduardo Lima", initials: "EL" }
        ],
        lastActivity: "há 5 horas"
    },
    {
        id: 3,
        title: "Sustentabilidade em Projetos Urbanos",
        description: "Análise de práticas sustentáveis em desenvolvimento urbano moderno.",
        status: "completed",
        progress: 100,
        participants: [
            { name: "Fernanda Reis", initials: "FR" },
            { name: "Gabriel Nunes", initials: "GN" },
            { name: "Helena Castro", initials: "HC" },
            { name: "Igor Alves", initials: "IA" }
        ],
        lastActivity: "há 1 semana"
    },
    {
        id: 4,
        title: "Narrativas Contemporâneas na Literatura",
        description: "Estudo comparativo entre autores contemporâneos brasileiros e estrangeiros.",
        status: "delayed",
        progress: 28,
        participants: [
            { name: "Julia Martins", initials: "JM" },
            { name: "Klaus Ferreira", initials: "KF" }
        ],
        lastActivity: "há 10 dias"
    },
    {
        id: 5,
        title: "Blockchain e Criptomoedas",
        description: "Análise técnica e econômica sobre a tecnologia blockchain.",
        status: "in-progress",
        progress: 55,
        participants: [
            { name: "Laura Oliveira", initials: "LO" },
            { name: "Marcos Silva", initials: "MS" },
            { name: "Natália Costa", initials: "NC" }
        ],
        lastActivity: "há 1 dia"
    }
];

let currentFilter = 'all';

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initializeHome();
});

function initializeHome() {
    renderProjects();
    updateFilterCounts();
    setupEventListeners();
}

// Setup de Event Listeners
function setupEventListeners() {
    // Filtros
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
            const filter = e.currentTarget.dataset.filter;
            setActiveFilter(filter);
        });
    });

    // Navegação do carousel
    document.getElementById('scroll-left').addEventListener('click', () => {
        scrollCarousel('left');
    });

    document.getElementById('scroll-right').addEventListener('click', () => {
        scrollCarousel('right');
    });

    // Botões de criar projeto
    document.getElementById('create-project-btn').addEventListener('click', createProject);
    document.getElementById('create-first-project-btn').addEventListener('click', createProject);

    // Navegação para home no ícone
    const homeBtn = document.getElementById('home-icon-btn');
    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            window.location.href = 'home.html';
        });
    }
}

// Renderizar projetos
function renderProjects() {
    const carousel = document.getElementById('projects-carousel');
    const emptyState = document.getElementById('empty-state');
    
    let filteredProjects = projects;
    
    if (currentFilter !== 'all') {
        filteredProjects = projects.filter(p => p.status === currentFilter);
    }
    
    // Verificar se há projetos
    if (filteredProjects.length === 0) {
        carousel.style.display = 'none';
        emptyState.classList.add('show');
        document.getElementById('scroll-left').style.display = 'none';
        document.getElementById('scroll-right').style.display = 'none';
        return;
    }
    
    carousel.style.display = 'grid';
    emptyState.classList.remove('show');
    
    // Limpar carousel
    carousel.innerHTML = '';
    
    // Renderizar cards
    filteredProjects.forEach(project => {
        const card = createProjectCard(project);
        carousel.appendChild(card);
    });
    
    // Mostrar/ocultar setas se necessário
    updateNavigationArrows();
}

// Criar card de projeto
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.projectId = project.id;
    
    // Status badge
    let statusClass = project.status;
    let statusText = '';
    let statusEmoji = '';
    
    switch (project.status) {
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
    
    // Participantes
    let participantsHTML = '';
    const maxVisible = 3;
    const visibleParticipants = project.participants.slice(0, maxVisible);
    const remainingCount = project.participants.length - maxVisible;
    
    visibleParticipants.forEach(participant => {
        participantsHTML += `<div class="avatar" title="${participant.name}">${participant.initials}</div>`;
    });
    
    if (remainingCount > 0) {
        participantsHTML += `<div class="avatar more-participants">+${remainingCount}</div>`;
    }
    
    card.innerHTML = `
        <div class="project-card-header">
            <h3 class="project-card-title">${project.title}</h3>
            <p class="project-card-description">${project.description}</p>
        </div>
        <span class="status-badge ${statusClass}">${statusEmoji} ${statusText}</span>
        <div class="progress-section">
            <div class="progress-label">
                <span>Progresso</span>
                <span class="progress-percentage">${project.progress}%</span>
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar-fill" style="width: ${project.progress}%"></div>
            </div>
        </div>
        <div class="participants">
            ${participantsHTML}
        </div>
        <div class="last-activity">
            <i class="fas fa-clock"></i> Última atualização: ${project.lastActivity}
        </div>
    `;
    
    // Adicionar evento de clique
    card.addEventListener('click', () => {
        openProject(project.id);
    });
    
    return card;
}

// Abrir projeto
function openProject(projectId) {
    // Salvar ID do projeto no localStorage
    localStorage.setItem('currentProjectId', projectId);
    // Redirecionar para página do projeto
    window.location.href = `project.html?id=${projectId}`;
}

// Filtros
function setActiveFilter(filter) {
    currentFilter = filter;
    
    // Atualizar visual dos chips
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.remove('active');
        if (chip.dataset.filter === filter) {
            chip.classList.add('active');
        }
    });
    
    renderProjects();
}

// Atualizar contadores dos filtros
function updateFilterCounts() {
    const counts = {
        all: projects.length,
        'in-progress': projects.filter(p => p.status === 'in-progress').length,
        completed: projects.filter(p => p.status === 'completed').length,
        delayed: projects.filter(p => p.status === 'delayed').length
    };
    
    document.querySelectorAll('.filter-chip').forEach(chip => {
        const filter = chip.dataset.filter;
        const countSpan = chip.querySelector('.chip-count');
        if (countSpan) {
            countSpan.textContent = counts[filter] || 0;
        }
    });
}

// Navegação do carousel
function scrollCarousel(direction) {
    const carousel = document.getElementById('projects-carousel');
    const scrollAmount = 400;
    
    if (direction === 'left') {
        carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

// Atualizar visibilidade das setas
function updateNavigationArrows() {
    const carousel = document.getElementById('projects-carousel');
    const leftArrow = document.getElementById('scroll-left');
    const rightArrow = document.getElementById('scroll-right');
    
    // Verificar se há overflow
    const hasOverflow = carousel.scrollWidth > carousel.clientWidth;
    
    if (hasOverflow) {
        leftArrow.style.display = 'flex';
        rightArrow.style.display = 'flex';
    } else {
        leftArrow.style.display = 'none';
        rightArrow.style.display = 'none';
    }
}

// Criar novo projeto (placeholder)
function createProject() {
    alert('Funcionalidade de criar projeto em desenvolvimento!\n\nEm breve você poderá criar novos projetos acadêmicos.');
}

// Listener para resize
window.addEventListener('resize', updateNavigationArrows);

// Exportar projetos para uso em outras páginas
window.projectsData = projects;
