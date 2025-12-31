// ===========================
// HOME.JS - Página Inicial
// ===========================

// Função helper para obter usuário atual
function getCurrentUser() {
    console.log('🔍 [DEBUG] Verificando autenticação...');
    console.log('🔍 [DEBUG] localStorage.scruby_user:', localStorage.getItem('scruby_user'));
    console.log('🔍 [DEBUG] localStorage.currentUser:', localStorage.getItem('currentUser'));
    
    let user = JSON.parse(localStorage.getItem('scruby_user'));
    if (!user) {
        user = JSON.parse(localStorage.getItem('currentUser'));
    }
    
    // Normalizar: garantir que _id existe (compatibilidade com backend MongoDB)
    if (user && user.id && !user._id) {
        user._id = user.id;
    }
    
    console.log('🔍 [DEBUG] Usuário retornado:', user);
    console.log('🔍 [DEBUG] Tem _id?', user ? !!user._id : 'null');
    console.log('🔍 [DEBUG] Tem id?', user ? !!user.id : 'null');
    
    return user;
}

// Dados de projetos (carregados do localStorage)
let projects = JSON.parse(localStorage.getItem('projects')) || [];

// Inicializar localStorage vazio se não existir
if (!localStorage.getItem('projects')) {
    localStorage.setItem('projects', JSON.stringify([]));
    projects = [];
}

let currentFilter = 'all';

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initializeHome();
    loadAllProjects(); // Carregar projetos próprios + compartilhados
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
    
    // Modal Chat
    const modalOverlay = document.getElementById('chat-modal');
    const modalSendBtn = document.getElementById('modal-send-chat-btn');
    const modalInput = document.getElementById('modal-chat-input');
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.style.display = 'none';
            }
        });
    }
    
    if (modalSendBtn) {
        modalSendBtn.addEventListener('click', sendModalMessage);
    }
    
    if (modalInput) {
        modalInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendModalMessage();
            }
        });
        
        modalInput.addEventListener('input', () => {
            autoResizeTextarea(modalInput);
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
            <div class="project-card-title-section">
                <h3 class="project-card-title">${project.title}</h3>
                <span class="delete-project" data-project-id="${project.id}">apagar</span>
            </div>
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
    
    // Adicionar evento de clique para apagar
    const deleteBtn = card.querySelector('.delete-project');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteProject(project.id);
    });
    
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

// Apagar projeto
async function deleteProject(projectId) {
    const project = projects.find(p => String(p.id) === String(projectId));
    
    if (!project) {
        alert('Projeto não encontrado!');
        return;
    }
    
    // Confirmação com digitação do título
    const confirmation = prompt(
        `⚠️ ATENÇÃO: Esta ação é irreversível!\n\n` +
        `Para confirmar a exclusão do projeto, digite o título exato:\n\n` +
        `"${project.title}"`
    );
    
    // Verificar se o usuário digitou o título corretamente
    if (confirmation === null) {
        // Usuário cancelou
        return;
    }
    
    if (confirmation.trim() !== project.title) {
        alert('❌ Título incorreto! O projeto não foi apagado.\n\nDigite o título exatamente como aparece no card.');
        return;
    }
    
    // Remover do array local
    projects = projects.filter(p => String(p.id) !== String(projectId));
    
    // Salvar no localStorage
    localStorage.setItem('projects', JSON.stringify(projects));
    
    // Se for um projeto compartilhado, remover do servidor também
    const currentUser = getCurrentUser();
    const userId = currentUser?._id || currentUser?.id;
    
    if (userId && project.isShared) {
        try {
            console.log('🗑️ Removendo projeto compartilhado do servidor...');
            const response = await fetch(`${COLLABORATION_API}/project/${projectId}/remove-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId })
            });
            
            const data = await response.json();
            
            if (data.success) {
                console.log('✅ Projeto removido do servidor');
            } else {
                console.warn('⚠️ Não foi possível remover do servidor:', data.error);
            }
        } catch (error) {
            console.error('❌ Erro ao remover projeto do servidor:', error);
        }
    }
    
    // Atualizar interface
    updateFilterCounts();
    renderProjects();
    
    // Feedback visual
    alert(`✅ Projeto "${project.title}" foi apagado com sucesso!`);
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
    const modal = document.getElementById('chat-modal');
    modal.style.display = 'flex';
    
    // Reset modal state
    const messagesContainer = document.getElementById('modal-chat-messages');
    messagesContainer.innerHTML = `
        <div class="project-description-prompt">
            <h3>Descreva seu projeto acadêmico</h3>
            <p>Descreva seu projeto acadêmico com o máximo de detalhes possíveis — tema, regras da disciplina, exigências do professor, formato, critérios de avaliação, prazos, número de alunos e referências permitidas. Quanto mais completa for a descrição, melhor o Scruby poderá organizar e estruturar todas as informações para você.</p>
            
            <!-- Seção de Colaboradores -->
            <div class="collaborators-section" style="margin-top: 2rem; border-top: 1px solid #e0e0e0; padding-top: 1.5rem;">
                <h4 style="margin-bottom: 1rem; color: #1C2A39; font-size: 1rem;">
                    <i class="fas fa-users"></i> Adicionar Colaboradores (Opcional)
                </h4>
                <div class="collaborator-search" style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                    <input 
                        type="text" 
                        id="collaborator-id-input" 
                        placeholder="Digite o ID do usuário" 
                        style="flex: 1; padding: 0.75rem; border: 2px solid #E8ECF0; border-radius: 8px; font-size: 0.9rem;"
                    >
                    <button 
                        id="search-collaborator-btn" 
                        style="padding: 0.75rem 1.5rem; background: #4A90E2; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: background 0.3s;"
                        onmouseover="this.style.background='#357ABD'"
                        onmouseout="this.style.background='#4A90E2'"
                    >
                        <i class="fas fa-search"></i> Buscar
                    </button>
                </div>
                <div id="collaborator-preview" style="display: none; padding: 1rem; background: #f8f9fa; border-radius: 8px; margin-bottom: 1rem;">
                    <!-- Preview do colaborador será inserido aqui -->
                </div>
                <div id="added-collaborators" style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    <!-- Colaboradores adicionados aparecerão aqui -->
                </div>
            </div>
        </div>
    `;
    
    const input = document.getElementById('modal-chat-input');
    input.value = '';
    input.style.height = 'auto';
    
    // Setup event listeners para colaboradores
    setupCollaboratorListeners();
    
    // Focar no input
    setTimeout(() => {
        input.focus();
    }, 100);
}

// Listener para resize
window.addEventListener('resize', updateNavigationArrows);

// Exportar projetos para uso em outras páginas
window.projectsData = projects;

// ===========================
// NOVA FUNÇÃO COM IA - Usando DeepSeek
// ===========================

// URL do servidor do agente
const AGENT_API_URL = 'http://localhost:3001/api/agent';

// Função para enviar mensagem no modal (NOVA - com IA)
async function sendModalMessage() {
    const input = document.getElementById('modal-chat-input');
    const messagesContainer = document.getElementById('modal-chat-messages');
    
    if (!input || !input.value.trim()) return;
    
    const projectDescription = input.value.trim();
    
    // Esconder o prompt e mostrar mensagem de processamento
    messagesContainer.innerHTML = `
        <div class="processing-message">
            <div class="processing-icon">
                <i class="fas fa-cog fa-spin"></i>
            </div>
            <h3>🤖 Processando com IA...</h3>
            <p>O agente DeepSeek está analisando sua descrição e criando o projeto acadêmico estruturado. Isso pode levar alguns segundos...</p>
        </div>
    `;
    
    try {
        // Chamar API do agente
        console.log('🚀 Enviando descrição para o agente de IA...');
        
        const response = await fetch(`${AGENT_API_URL}/process-project`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                description: projectDescription
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao processar projeto');
        }

        const data = await response.json();
        console.log('✅ Projeto criado pela IA:', data);

        // Criar projeto com os dados da IA
        const newProject = {
            id: data.project.id,
            title: data.project.title,
            description: data.project.description,
            fullDescription: data.project.fullDescription,
            status: data.project.status,
            progress: data.project.progress,
            participants: data.project.participants,
            structure: data.project.structure,
            lastActivity: data.project.lastActivity
        };
        
        // Adicionar ao array de projetos
        projects.push(newProject);
        
        // Salvar no localStorage
        localStorage.setItem('projects', JSON.stringify(projects));
        
        // Enviar convites aos colaboradores
        await sendCollaboratorInvites(newProject.id, newProject.title, newProject.description);
        
        // Atualizar interface
        updateFilterCounts();
        renderProjects();
        
        // Mostrar mensagem de sucesso
        messagesContainer.innerHTML = `
            <div class="success-message">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>✨ Projeto Criado com Sucesso!</h3>
                <div class="project-preview">
                    <h4>📌 ${newProject.title}</h4>
                    <p>${newProject.description}</p>
                    ${newProject.structure ? `
                        <div class="structure-preview">
                            <strong>📚 Estrutura Sugerida:</strong>
                            <ul>
                                ${newProject.structure.sections.map(s => `<li>${s.name}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
                <button id="close-success-btn" class="success-btn">Ver Projeto</button>
            </div>
        `;
        
        // Adicionar listener para fechar
        setTimeout(() => {
            const closeBtn = document.getElementById('close-success-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    document.getElementById('chat-modal').style.display = 'none';
                    // Resetar modal
                    setTimeout(() => {
                        messagesContainer.innerHTML = `
                            <div class="project-description-prompt">
                                <h3>Descreva seu projeto acadêmico</h3>
                                <p>Descreva seu projeto acadêmico com o máximo de detalhes possíveis — tema, regras da disciplina, exigências do professor, formato, critérios de avaliação, prazos, número de alunos e referências permitidas. Quanto mais completa for a descrição, melhor o Scruby poderá organizar e estruturar todas as informações para você.</p>
                            </div>
                        `;
                        input.value = '';
                        input.style.height = 'auto';
                    }, 300);
                });
            }
        }, 100);
        
    } catch (error) {
        console.error('❌ Erro ao criar projeto:', error);
        
        // Mostrar mensagem de erro
        messagesContainer.innerHTML = `
            <div class="error-message">
                <div class="error-icon">
                    <i class="fas fa-exclamation-circle"></i>
                </div>
                <h3>❌ Erro ao Processar</h3>
                <p>${error.message}</p>
                <p class="error-hint">Verifique se o servidor do agente está rodando na porta 3001</p>
                <button id="retry-btn" class="retry-btn">Tentar Novamente</button>
            </div>
        `;
        
        // Adicionar listener para retry
        setTimeout(() => {
            const retryBtn = document.getElementById('retry-btn');
            if (retryBtn) {
                retryBtn.addEventListener('click', () => {
                    messagesContainer.innerHTML = `
                        <div class="project-description-prompt">
                            <h3>Descreva seu projeto acadêmico</h3>
                            <p>Descreva seu projeto acadêmico com o máximo de detalhes possíveis — tema, regras da disciplina, exigências do professor, formato, critérios de avaliação, prazos, número de alunos e referências permitidas. Quanto mais completa for a descrição, melhor o Scruby poderá organizar e estruturar todas as informações para você.</p>
                        </div>
                    `;
                });
            }
        }, 100);
    }
}

// ===========================
// FUNÇÃO ANTIGA (DESCONTINUADA)
// ===========================
/*
function sendModalMessage_OLD() {
    // Esta função foi descontinuada e substituída pela versão com IA acima
    // Mantida aqui apenas para referência histórica
    
    const input = document.getElementById('modal-chat-input');
    const messagesContainer = document.getElementById('modal-chat-messages');
    
    if (!input || !input.value.trim()) return;
    
    const projectDescription = input.value.trim();
    
    messagesContainer.innerHTML = `
        <div class="processing-message">
            <div class="processing-icon">
                <i class="fas fa-cog fa-spin"></i>
            </div>
            <h3>Processando sua descrição...</h3>
            <p>Estamos estruturando seu projeto acadêmico baseado na descrição fornecida.</p>
        </div>
    `;
    
    setTimeout(() => {
        const projectTitle = generateProjectTitle(projectDescription);
        
        const newProject = {
            id: Date.now(),
            title: projectTitle,
            description: projectDescription.substring(0, 150) + (projectDescription.length > 150 ? '...' : ''),
            status: 'in-progress',
            progress: 10,
            participants: [
                { name: 'Você', initials: 'VC' }
            ],
            lastActivity: 'agora'
        };
        
        projects.push(newProject);
        localStorage.setItem('projects', JSON.stringify(projects));
        updateFilterCounts();
        renderProjects();
        document.getElementById('chat-modal').style.display = 'none';
        
        setTimeout(() => {
            messagesContainer.innerHTML = `
                <div class="project-description-prompt">
                    <h3>Descreva seu projeto acadêmico</h3>
                    <p>Descreva seu projeto acadêmico com o máximo de detalhes possíveis — tema, regras da disciplina, exigências do professor, formato, critérios de avaliação, prazos, número de alunos e referências permitidas. Quanto mais completa for a descrição, melhor o Scruby poderá organizar e estruturar todas as informações para você.</p>
                </div>
            `;
            input.value = '';
        }, 500);
        
        alert(`Projeto "${projectTitle}" criado com sucesso!`);
    }, 3000);
}
*/

// Função auxiliar para gerar título baseado na descrição
function generateProjectTitle(description) {
    // Lógica simples para extrair um título da descrição
    const words = description.split(' ');
    if (words.length > 5) {
        return words.slice(0, 5).join(' ') + '...';
    }
    return description;
}

// Função para auto-resize do textarea
function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = 120; // 250% da altura original aproximada
    const newHeight = Math.min(scrollHeight, maxHeight);
    textarea.style.height = newHeight + 'px';
}

// Função para esconder o prompt quando o usuário começar a digitar
function hidePromptIfNeeded() {
    const input = document.getElementById('modal-chat-input');
    const prompt = document.querySelector('.project-description-prompt');
    
    if (input && input.value.trim() && prompt) {
        prompt.style.display = 'none';
    } else if (input && !input.value.trim() && prompt) {
        prompt.style.display = 'flex';
    }
}

// ===========================
// SISTEMA DE COLABORAÇÃO
// ===========================

const COLLABORATION_API = 'http://localhost:3001/api/collaboration';
let selectedCollaborators = [];

// Setup event listeners para colaboradores
function setupCollaboratorListeners() {
    const searchBtn = document.getElementById('search-collaborator-btn');
    const idInput = document.getElementById('collaborator-id-input');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', searchCollaborator);
    }
    
    if (idInput) {
        idInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchCollaborator();
            }
        });
    }
}

// Buscar colaborador por ID
async function searchCollaborator() {
    const idInput = document.getElementById('collaborator-id-input');
    const userId = idInput.value.trim();
    
    if (!userId) {
        alert('Por favor, digite um ID de usuário');
        return;
    }
    
    const previewContainer = document.getElementById('collaborator-preview');
    
    try {
        previewContainer.style.display = 'block';
        previewContainer.innerHTML = `
            <div style="text-align: center; padding: 1rem;">
                <i class="fas fa-spinner fa-spin" style="font-size: 1.5rem; color: #4A90E2;"></i>
                <p style="margin-top: 0.5rem; color: #666;">Buscando usuário...</p>
            </div>
        `;
        
        const response = await fetch(`${COLLABORATION_API}/user/${userId}`);
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Usuário não encontrado');
        }
        
        const user = data.user;
        
        // Verificar se já foi adicionado
        if (selectedCollaborators.find(c => c.id === user.id)) {
            previewContainer.innerHTML = `
                <div style="text-align: center; color: #f39c12;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 1.5rem;"></i>
                    <p style="margin-top: 0.5rem;">Este usuário já foi adicionado!</p>
                </div>
            `;
            return;
        }
        
        // Mostrar preview do usuário
        previewContainer.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.2rem;">
                        ${user.initials}
                    </div>
                    <div>
                        <h4 style="margin: 0; color: #1C2A39; font-size: 1rem;">${user.fullName}</h4>
                        <p style="margin: 0.25rem 0 0 0; color: #666; font-size: 0.85rem;">@${user.username}</p>
                        <p style="margin: 0.25rem 0 0 0; color: #999; font-size: 0.8rem;">ID: ${user.id}</p>
                    </div>
                </div>
                <button 
                    onclick="addCollaborator('${user.id}', '${user.fullName.replace(/'/g, "\\'")}', '${user.username}', '${user.initials}')"
                    style="padding: 0.75rem 1.5rem; background: #27ae60; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: background 0.3s;"
                    onmouseover="this.style.background='#229954'"
                    onmouseout="this.style.background='#27ae60'"
                >
                    <i class="fas fa-plus"></i> Adicionar
                </button>
            </div>
        `;
        
        idInput.value = '';
        
    } catch (error) {
        console.error('Erro ao buscar colaborador:', error);
        previewContainer.innerHTML = `
            <div style="text-align: center; color: #e74c3c;">
                <i class="fas fa-times-circle" style="font-size: 1.5rem;"></i>
                <p style="margin-top: 0.5rem;">${error.message}</p>
            </div>
        `;
    }
}

// Adicionar colaborador à lista
window.addCollaborator = function addCollaborator(id, fullName, username, initials) {
    const collaborator = { id, fullName, username, initials };
    selectedCollaborators.push(collaborator);
    
    // Limpar preview
    const previewContainer = document.getElementById('collaborator-preview');
    previewContainer.style.display = 'none';
    previewContainer.innerHTML = '';
    
    // Renderizar lista de colaboradores
    renderAddedCollaborators();
}

// Remover colaborador da lista
window.removeCollaborator = function removeCollaborator(id) {
    selectedCollaborators = selectedCollaborators.filter(c => c.id !== id);
    renderAddedCollaborators();
}

// Renderizar colaboradores adicionados
function renderAddedCollaborators() {
    const container = document.getElementById('added-collaborators');
    
    if (selectedCollaborators.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = selectedCollaborators.map(collaborator => `
        <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: white; border: 2px solid #E8ECF0; border-radius: 20px;">
            <div style="width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.75rem;">
                ${collaborator.initials}
            </div>
            <span style="font-size: 0.9rem; color: #1C2A39; font-weight: 500;">${collaborator.fullName}</span>
            <button 
                onclick="removeCollaborator('${collaborator.id}')"
                style="background: none; border: none; color: #e74c3c; cursor: pointer; padding: 0.25rem; font-size: 0.9rem;"
                title="Remover"
            >
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

// Enviar convites para colaboradores
async function sendCollaboratorInvites(projectId, projectTitle, projectDescription) {
    console.log('🚀 [DEBUG] sendCollaboratorInvites chamada');
    console.log('🚀 [DEBUG] selectedCollaborators:', selectedCollaborators);
    
    if (selectedCollaborators.length === 0) {
        console.log('⚠️ [DEBUG] Nenhum colaborador selecionado');
        return;
    }
    
    console.log('🔐 [DEBUG] Chamando getCurrentUser()...');
    const currentUser = getCurrentUser();
    console.log('🔐 [DEBUG] currentUser retornado:', currentUser);
    
    // Aceitar tanto _id (MongoDB) quanto id (frontend)
    const userId = currentUser?._id || currentUser?.id;
    
    if (!currentUser || !userId) {
        console.error('❌ Usuário não autenticado - convites não serão enviados');
        console.log('⚠️ Faça login para enviar convites aos colaboradores');
        
        // Notificar usuário
        alert('Você precisa estar logado para enviar convites aos colaboradores.\n\nO projeto foi criado, mas os convites não foram enviados.');
        
        // Limpar colaboradores selecionados
        selectedCollaborators = [];
        return;
    }
    
    console.log(`📨 Enviando ${selectedCollaborators.length} convites...`);
    console.log(`👤 Usuário atual: ${currentUser.fullName || currentUser.name || currentUser.username} (ID: ${userId})`);
    
    const invitePromises = selectedCollaborators.map(async (collaborator) => {
        try {
            const response = await fetch(`${COLLABORATION_API}/invite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    projectId,
                    projectTitle,
                    projectDescription,
                    fromUserId: userId,
                    toUserId: collaborator.id
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                console.log(`✅ Convite enviado para ${collaborator.fullName}`);
            } else {
                console.error(`❌ Erro ao enviar convite para ${collaborator.fullName}:`, data.error);
            }
            
            return data;
        } catch (error) {
            console.error(`❌ Erro ao enviar convite para ${collaborator.fullName}:`, error);
            return null;
        }
    });
    
    await Promise.all(invitePromises);
    
    // Limpar lista de colaboradores selecionados
    selectedCollaborators = [];
    
    console.log('✅ Todos os convites foram processados');
}

// ===========================
// CARREGAR PROJETOS COMPARTILHADOS
// ===========================

// Carregar todos os projetos (próprios + compartilhados)
window.loadAllProjects = async function loadAllProjects() {
    const currentUser = getCurrentUser();
    const userId = currentUser?._id || currentUser?.id;
    
    if (!currentUser || !userId) {
        console.log('⚠️ Usuário não autenticado - carregando apenas projetos locais');
        return;
    }
    
    try {
        // Carregar projetos compartilhados do servidor
        const response = await fetch(`${COLLABORATION_API}/projects/${userId}`);
        const data = await response.json();
        
        if (data.success && data.sharedProjects.length > 0) {
            console.log(`📂 ${data.sharedProjects.length} projeto(s) compartilhado(s) encontrado(s)`);
            
            // Integrar projetos compartilhados com projetos locais
            data.sharedProjects.forEach(sharedProject => {
                // Verificar se o projeto já existe localmente
                const existingProject = projects.find(p => String(p.id) === String(sharedProject.projectId));
                
                if (!existingProject) {
                    // Adicionar projeto compartilhado com flag isShared
                    const newProject = {
                        id: sharedProject.projectId,
                        title: sharedProject.projectTitle,
                        description: sharedProject.projectDescription,
                        status: 'in-progress',
                        progress: 10,
                        participants: [
                            { name: 'Você', initials: 'VC' },
                            { name: sharedProject.sharedBy, initials: sharedProject.sharedBy.split(' ').map(n => n[0]).join('').toUpperCase() }
                        ],
                        lastActivity: 'recém compartilhado',
                        isShared: true // Marcar como compartilhado
                    };
                    
                    projects.push(newProject);
                } else if (!existingProject.isShared) {
                    // Se já existe mas não está marcado como compartilhado, marcar
                    existingProject.isShared = true;
                }
            });
            
            // Atualizar localStorage
            localStorage.setItem('projects', JSON.stringify(projects));
            
            // Atualizar interface
            updateFilterCounts();
            renderProjects();
        } else {
            console.log('📂 Nenhum projeto compartilhado encontrado');
        }
    } catch (error) {
        console.error('❌ Erro ao carregar projetos compartilhados:', error);
    }
}
