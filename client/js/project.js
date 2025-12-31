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
    
    // Renderizar estrutura com categorias e atribuições (se disponível)
    renderProjectStructure();
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

// Renderizar estrutura do projeto com categorias e atribuições
function renderProjectStructure() {
    const structureContainer = document.getElementById('project-structure-container');
    
    // Se não existir container, criar após a seção de descrição
    if (!structureContainer) {
        const projectInfoSection = document.querySelector('.project-info-section');
        if (projectInfoSection) {
            const newContainer = document.createElement('div');
            newContainer.id = 'project-structure-container';
            newContainer.style.cssText = 'margin-top: 2rem;';
            projectInfoSection.appendChild(newContainer);
            return renderProjectStructure(); // Chamar novamente após criar
        }
        return;
    }
    
    const structure = currentProject.structure;
    
    // Verificar se tem estrutura com categorias
    if (!structure || !structure.categories || structure.categories.length === 0) {
        structureContainer.style.display = 'none';
        return;
    }
    
    structureContainer.style.display = 'block';
    
    // Construir HTML da estrutura
    let html = `
        <div style="background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 2rem;">
            <h3 style="margin: 0 0 1rem 0; color: #1C2A39; display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-sitemap"></i> Estrutura do Projeto
            </h3>
    `;
    
    // Informações gerais
    if (structure.estimatedPages || structure.suggestedDeadline) {
        html += `
            <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
        `;
        if (structure.estimatedPages) {
            html += `
                <div style="flex: 1;">
                    <span style="color: #666; font-size: 0.85rem;">📄 Páginas estimadas</span>
                    <div style="font-weight: 600; color: #1C2A39; font-size: 1.1rem;">${structure.estimatedPages}</div>
                </div>
            `;
        }
        if (structure.suggestedDeadline) {
            html += `
                <div style="flex: 1;">
                    <span style="color: #666; font-size: 0.85rem;">⏰ Prazo sugerido</span>
                    <div style="font-weight: 600; color: #1C2A39; font-size: 1.1rem;">${structure.suggestedDeadline}</div>
                </div>
            `;
        }
        html += `</div>`;
    }
    
    // Distribuição de carga de trabalho
    if (structure.workloadDistribution) {
        html += `
            <div style="padding: 1rem; background: #e8f4f8; border-left: 4px solid #4A90E2; border-radius: 4px; margin-bottom: 1.5rem;">
                <strong style="color: #1C2A39;">💡 Distribuição de Carga:</strong>
                <p style="margin: 0.5rem 0 0 0; color: #555; line-height: 1.6;">${structure.workloadDistribution}</p>
            </div>
        `;
    }
    
    // Categorias
    html += `<div style="display: flex; flex-direction: column; gap: 1rem;">`;
    
    structure.categories.forEach((category, index) => {
        const categoryColor = getCategoryColor(index);
        
        html += `
            <div style="border: 2px solid ${categoryColor}; border-radius: 12px; padding: 1.5rem; background: ${categoryColor}08;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div style="flex: 1;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #1C2A39; font-size: 1.1rem;">
                            📌 ${category.name}
                        </h4>
                        ${category.description ? `<p style="margin: 0; color: #666; font-size: 0.9rem;">${category.description}</p>` : ''}
                    </div>
                    <div style="background: ${categoryColor}; color: white; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 600; font-size: 0.85rem; white-space: nowrap; margin-left: 1rem;">
                        👤 ${category.assignedTo}
                    </div>
                </div>
                
                ${category.subcategories && category.subcategories.length > 0 ? `
                    <div style="margin-top: 1rem;">
                        <strong style="color: #555; font-size: 0.9rem;">Subcategorias (${category.subcategories.length}):</strong>
                        <div style="display: grid; gap: 0.75rem; margin-top: 0.75rem;">
                            ${category.subcategories.map(sub => `
                                <div style="background: white; padding: 0.75rem; border-radius: 8px; border-left: 3px solid ${categoryColor};">
                                    <div style="font-weight: 600; color: #1C2A39; margin-bottom: 0.25rem;">• ${sub.name}</div>
                                    ${sub.description ? `<div style="color: #666; font-size: 0.85rem; margin-left: 1rem;">${sub.description}</div>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    });
    
    html += `</div></div>`;
    
    structureContainer.innerHTML = html;
}

// Obter cor para cada categoria
function getCategoryColor(index) {
    const colors = [
        '#4A90E2', // Azul
        '#50C878', // Verde
        '#FF6B6B', // Vermelho
        '#FFA500', // Laranja
        '#9B59B6', // Roxo
        '#1ABC9C', // Turquesa
        '#E74C3C', // Vermelho escuro
        '#3498DB'  // Azul claro
    ];
    return colors[index % colors.length];
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
