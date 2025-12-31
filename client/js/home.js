// ===========================
// HOME.JS - Página Inicial
// ===========================

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
function deleteProject(projectId) {
    if (confirm('Tem certeza que deseja apagar este projeto?')) {
        // Remover do array
        projects = projects.filter(p => p.id !== projectId);
        
        // Salvar no localStorage
        localStorage.setItem('projects', JSON.stringify(projects));
        
        // Atualizar interface
        updateFilterCounts();
        renderProjects();
    }
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
        </div>
    `;
    
    const input = document.getElementById('modal-chat-input');
    input.value = '';
    input.style.height = 'auto';
    
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
