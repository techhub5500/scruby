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
    console.log('🏗️ renderProjectStructure() chamada');
    console.log('📊 currentProject:', currentProject);
    
    const structureContainer = document.getElementById('project-structure-container');
    
    if (!structureContainer) {
        console.warn('⚠️ Container project-structure-container não encontrado');
        return;
    }
    
    const structure = currentProject?.structure;
    console.log('📋 Estrutura do projeto:', structure);
    
    // Verificar se tem estrutura com categorias
    if (!structure || !structure.categories || structure.categories.length === 0) {
        console.warn('⚠️ Projeto não tem categorias definidas');
        structureContainer.style.display = 'none';
        return;
    }
    
    console.log(`✅ Renderizando ${structure.categories.length} categorias`);
    structureContainer.style.display = 'block';
    
    // Construir HTML da estrutura
    let html = `
        <div style="background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 4px 12px rgba(0,0,0,0.08); margin-bottom: 2rem; border: 1px solid #E8ECF0;">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 2px solid #f0f0f0;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-sitemap" style="color: white; font-size: 1.5rem;"></i>
                </div>
                <div>
                    <h2 style="margin: 0; color: #1C2A39; font-size: 1.5rem; font-weight: 700;">Estrutura do Projeto</h2>
                    <p style="margin: 0.25rem 0 0 0; color: #666; font-size: 0.9rem;">Organização detalhada de categorias e responsáveis</p>
                </div>
            </div>
    `;
    
    // Informações gerais
    if (structure.estimatedPages || structure.suggestedDeadline) {
        html += `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
        `;
        if (structure.estimatedPages) {
            html += `
                <div style="background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); padding: 1.25rem; border-radius: 12px; border: 2px solid #667eea30;">
                    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                            <span style="font-size: 1.25rem;">📄</span>
                        </div>
                        <div>
                            <div style="color: #666; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Páginas Estimadas</div>
                            <div style="font-weight: 700; color: #1C2A39; font-size: 1.5rem;">${structure.estimatedPages}</div>
                        </div>
                    </div>
                </div>
            `;
        }
        if (structure.suggestedDeadline) {
            html += `
                <div style="background: linear-gradient(135deg, #f093fb15 0%, #f5576c15 100%); padding: 1.25rem; border-radius: 12px; border: 2px solid #f093fb30;">
                    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                            <span style="font-size: 1.25rem;">⏰</span>
                        </div>
                        <div>
                            <div style="color: #666; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Prazo Sugerido</div>
                            <div style="font-weight: 700; color: #1C2A39; font-size: 1.5rem;">${structure.suggestedDeadline}</div>
                        </div>
                    </div>
                </div>
            `;
        }
        html += `</div>`;
    }
    
    // Distribuição de carga de trabalho
    if (structure.workloadDistribution) {
        html += `
            <div style="padding: 1.25rem; background: linear-gradient(135deg, #e8f4f8 0%, #d4e9f2 100%); border-left: 5px solid #4A90E2; border-radius: 10px; margin-bottom: 2rem; box-shadow: 0 2px 6px rgba(74, 144, 226, 0.15);">
                <div style="display: flex; align-items: start; gap: 1rem;">
                    <div style="width: 36px; height: 36px; background: #4A90E2; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <span style="font-size: 1.1rem;">💡</span>
                    </div>
                    <div>
                        <strong style="color: #1C2A39; font-size: 1rem; display: block; margin-bottom: 0.5rem;">Distribuição de Carga de Trabalho</strong>
                        <p style="margin: 0; color: #555; line-height: 1.7; font-size: 0.95rem;">${structure.workloadDistribution}</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Categorias
    html += `<div style="display: flex; flex-direction: column; gap: 1.5rem;">`;
    
    structure.categories.forEach((category, index) => {
        const categoryColor = getCategoryColor(index);
        const subcategoriesCount = category.subcategories?.length || 0;
        
        html += `
            <div style="border: 3px solid ${categoryColor}; border-radius: 16px; padding: 1.75rem; background: linear-gradient(135deg, ${categoryColor}08 0%, ${categoryColor}03 100%); box-shadow: 0 3px 10px ${categoryColor}20; transition: transform 0.2s, box-shadow 0.2s;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
                    <div style="flex: 1; min-width: 250px;">
                        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
                            <div style="width: 42px; height: 42px; background: ${categoryColor}; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
                                📌
                            </div>
                            <h3 style="margin: 0; color: #1C2A39; font-size: 1.25rem; font-weight: 700; line-height: 1.3;">
                                ${category.name}
                            </h3>
                        </div>
                        ${category.description ? `<p style="margin: 0 0 0 3.5rem; color: #666; font-size: 0.95rem; line-height: 1.6;">${category.description}</p>` : ''}
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-end;">
                        <div style="background: ${categoryColor}; color: white; padding: 0.65rem 1.25rem; border-radius: 25px; font-weight: 700; font-size: 0.9rem; white-space: nowrap; box-shadow: 0 2px 8px ${categoryColor}40; display: flex; align-items: center; gap: 0.5rem;">
                            <span style="font-size: 1.1rem;">👤</span>
                            <span>${category.assignedTo}</span>
                        </div>
                        <div style="background: white; color: ${categoryColor}; padding: 0.4rem 1rem; border-radius: 20px; font-weight: 600; font-size: 0.85rem; border: 2px solid ${categoryColor}40;">
                            ${subcategoriesCount} ${subcategoriesCount === 1 ? 'subcategoria' : 'subcategorias'}
                        </div>
                    </div>
                </div>
                
                ${category.subcategories && category.subcategories.length > 0 ? `
                    <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 2px dashed ${categoryColor}30;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                            <strong style="color: #1C2A39; font-size: 1rem;">📋 Tarefas da Categoria</strong>
                            <span style="background: ${categoryColor}20; color: ${categoryColor}; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; font-weight: 700;">${subcategoriesCount}</span>
                        </div>
                        <div style="display: grid; gap: 1rem;">
                            ${category.subcategories.map((sub, subIndex) => `
                                <div style="background: white; padding: 1.25rem; border-radius: 12px; border-left: 4px solid ${categoryColor}; box-shadow: 0 2px 6px rgba(0,0,0,0.05); transition: transform 0.2s;">
                                    <div style="display: flex; align-items: start; gap: 0.75rem;">
                                        <div style="width: 28px; height: 28px; background: ${categoryColor}15; border: 2px solid ${categoryColor}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 700; color: ${categoryColor}; font-size: 0.85rem; flex-shrink: 0;">
                                            ${subIndex + 1}
                                        </div>
                                        <div style="flex: 1;">
                                            <div style="font-weight: 700; color: #1C2A39; margin-bottom: 0.4rem; font-size: 1rem; line-height: 1.4;">${sub.name}</div>
                                            ${sub.description ? `<div style="color: #666; font-size: 0.9rem; line-height: 1.6;">${sub.description}</div>` : ''}
                                        </div>
                                    </div>
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
