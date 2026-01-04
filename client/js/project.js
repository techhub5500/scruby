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
        scrollToStructure();
    });
    
    // Botão acessar documentos
    document.getElementById('open-documents-btn').addEventListener('click', () => {
        showDocumentsByUser();
    });
    
    // Navegação para home no ícone
    const homeBtn = document.getElementById('home-icon-btn');
    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            window.location.href = 'home.html';
        });
    }
}

// Scroll suave até a estrutura
function scrollToStructure() {
    const structureContainer = document.getElementById('project-structure-container');
    if (structureContainer) {
        structureContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ===========================
// SISTEMA DE DOCUMENTOS POR USUÁRIO
// ===========================

/**
 * Exibe documentos organizados por usuário com base nas categorias atribuídas
 */
async function showDocumentsByUser() {
    const container = document.getElementById('documents-by-user-container');
    
    if (!container) {
        console.error('❌ Container de documentos não encontrado');
        return;
    }
    
    // Mostrar loading
    container.style.display = 'block';
    container.innerHTML = `
        <div style="text-align: center; padding: 3rem;">
            <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #4A90E2;"></i>
            <p style="margin-top: 1rem; color: #666;">Carregando documentos...</p>
        </div>
    `;
    
    // Scroll até a seção
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Buscar estrutura do projeto
    const structure = currentProject?.structure;
    
    console.log('🔍 Projeto atual:', currentProject);
    console.log('📋 Estrutura do projeto:', structure);
    console.log('👥 Participantes do projeto:', currentProject?.participants);
    
    if (!structure || !structure.categories || structure.categories.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; background: white; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                <i class="fas fa-folder-open" style="font-size: 3rem; color: #ddd;"></i>
                <h3 style="margin-top: 1rem; color: #666;">Nenhum documento disponível</h3>
                <p style="color: #999;">O projeto ainda não possui categorias ou documentos.</p>
            </div>
        `;
        return;
    }
    
    console.log('📂 Total de categorias:', structure.categories.length);
    console.log('📝 Categorias:', structure.categories.map(c => ({ name: c.name, assignedTo: c.assignedTo })));
    
    // Agrupar categorias por usuário
    const userCategories = {};
    
    structure.categories.forEach(category => {
        const assignedUser = category.assignedTo;
        if (!userCategories[assignedUser]) {
            userCategories[assignedUser] = [];
        }
        userCategories[assignedUser].push(category);
    });
    
    console.log('📊 Categorias agrupadas por usuário:', userCategories);
    console.log('🔢 Total de usuários com categorias:', Object.keys(userCategories).length);
    
    // Buscar fileSystem de cada usuário
    const usersData = await Promise.all(
        Object.keys(userCategories).map(async (userName) => {
            console.log(`\n🔍 Processando usuário: "${userName}"`);
            
            // Encontrar participante pelo nome
            // Se o userName é "Você", precisa encontrar o criador
            let participant;
            
            if (userName === 'Você') {
                // Buscar o criador do projeto
                participant = currentProject.participants.find(p => p.role === 'Criador');
                console.log('🎯 Buscando criador:', participant);
            } else {
                // Buscar participante pelo nome normal
                participant = currentProject.participants.find(p => p.name === userName);
                console.log('👤 Buscando participante normal:', participant);
            }
            
            if (!participant) {
                console.warn(`⚠️ Participante ${userName} não encontrado`);
                return null;
            }
            
            // Buscar ID do usuário
            const userId = await getUserIdByName(userName, participant);
            
            if (!userId) {
                console.warn(`⚠️ ID do usuário ${userName} não encontrado`);
                return { userName, categories: userCategories[userName], files: null, lastUpdate: 'Desconhecido' };
            }
            
            // Buscar fileSystem do usuário
            const fileSystemData = await fetchUserFileSystem(userId);
            console.log(`📊 FileSystem obtido para ${userName}:`, fileSystemData);
            
            // Usar nome real do participante, não "Você"
            const displayName = participant.name || userName;
            
            const userData = {
                userName: displayName, // Usar nome real
                userId,
                categories: userCategories[userName],
                files: fileSystemData,
                lastUpdate: fileSystemData ? getLastUpdateDate(fileSystemData) : 'Sem atualizações'
            };
            
            console.log(`👤 Dados finais para ${userName}:`, userData);
            
            return userData;
        })
    );
    
    // Filtrar usuários válidos
    const validUsers = usersData.filter(u => u !== null);
    
    console.log('✅ Total de usuários válidos:', validUsers.length);
    console.log('📋 Usuários válidos:', validUsers);
    
    if (validUsers.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; background: white; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #f39c12;"></i>
                <h3 style="margin-top: 1rem; color: #666;">Nenhum documento encontrado</h3>
                <p style="color: #999;">Os participantes ainda não criaram seus documentos.</p>
            </div>
        `;
        return;
    }
    
    // Renderizar cards dos usuários
    renderUserDocumentCards(validUsers);
}

/**
 * Busca ID do usuário pelo nome
 */
async function getUserIdByName(userName, participant) {
    console.log('🔍 Buscando ID para:', userName);
    console.log('📋 Participante recebido:', participant);
    console.log('🎯 currentProject.participants:', currentProject?.participants);
    
    // Se o participante já tem ID, usar diretamente (verificar id e userId)
    if (participant) {
        const participantId = participant.userId || participant.id || participant._id;
        if (participantId) {
            console.log('✅ ID encontrado no participante direto:', participantId);
            return participantId;
        }
    }
    
    // Verificar se é o usuário atual
    const currentUser = getCurrentUser();
    console.log('👤 Usuário atual:', currentUser);
    
    if (currentUser) {
        // Comparar com fullName, name ou username
        if (currentUser.fullName === userName || 
            currentUser.name === userName || 
            currentUser.username === userName ||
            userName === 'Você') {
            const userId = currentUser._id || currentUser.id;
            console.log('✅ É o usuário atual, ID:', userId);
            return userId;
        }
    }
    
    // Buscar nos participantes do projeto atual (MAIS COMPLETO)
    if (currentProject && currentProject.participants) {
        console.log('🔎 Buscando em currentProject.participants...');
        
        // Tentar todas as possíveis combinações
        for (const p of currentProject.participants) {
            console.log(`   Comparando com participante:`, p);
            
            if (p.name === userName || 
                p.fullName === userName || 
                p.username === userName ||
                (userName === 'Você' && p.role === 'Criador')) {
                
                const participantId = p.userId || p.id || p._id;
                if (participantId) {
                    console.log('✅ ID encontrado nos participantes do projeto:', participantId);
                    return participantId;
                } else {
                    console.warn('⚠️ Participante encontrado mas sem ID:', p);
                }
            }
        }
    }
    
    // Buscar nos colaboradores selecionados (se disponível)
    const storedCollaborators = JSON.parse(sessionStorage.getItem('project_collaborators') || '[]');
    console.log('📦 Colaboradores armazenados:', storedCollaborators);
    
    const collaborator = storedCollaborators.find(c => 
        c.fullName === userName || c.name === userName || c.username === userName
    );
    
    if (collaborator) {
        const collaboratorId = collaborator.userId || collaborator.id || collaborator._id;
        if (collaboratorId) {
            console.log('✅ ID encontrado nos colaboradores:', collaboratorId);
            return collaboratorId;
        }
    }
    
    console.error('❌ ID não encontrado para:', userName);
    console.error('❌ Dados disponíveis:');
    console.error('   - Participante:', participant);
    console.error('   - Usuário atual:', currentUser);
    console.error('   - Participantes do projeto:', currentProject?.participants);
    console.error('   - Colaboradores armazenados:', storedCollaborators);
    
    return null;
}

/**
 * Obtém usuário atual
 */
function getCurrentUser() {
    let user = JSON.parse(localStorage.getItem('scruby_user'));
    if (!user) {
        user = JSON.parse(localStorage.getItem('currentUser'));
    }
    return user;
}

/**
 * Busca fileSystem do usuário no servidor
 */
async function fetchUserFileSystem(userId) {
    try {
        console.log(`📡 Buscando fileSystem para userId: ${userId}`);
        const url = `${window.API_URL}/filesystem/${userId}`;
        console.log(`📍 URL completa: ${url}`);
        
        const response = await fetch(url);
        console.log(`📨 Resposta do servidor - Status: ${response.status}`);
        
        if (!response.ok) {
            console.warn(`⚠️ FileSystem não encontrado para usuário ${userId} - Status: ${response.status}`);
            return null;
        }
        
        const data = await response.json();
        console.log(`✅ Dados recebidos para ${userId}:`, data);
        
        const fileSystem = data.fileSystem || data;
        console.log(`📂 FileSystem processado:`, fileSystem);
        
        return fileSystem;
    } catch (error) {
        console.error(`❌ Erro ao buscar fileSystem do usuário ${userId}:`, error);
        return null;
    }
}

/**
 * Obtém data da última atualização do fileSystem
 */
function getLastUpdateDate(fileSystem) {
    // Por enquanto, retornar data atual
    // TODO: Implementar timestamps no servidor
    return new Date().toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Renderiza cards de documentos por usuário
 */
function renderUserDocumentCards(usersData) {
    const container = document.getElementById('documents-by-user-container');
    
    const html = `
        <div style="background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 4px 12px rgba(0,0,0,0.08); margin-bottom: 2rem;">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 2px solid #f0f0f0;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-folder-open" style="color: white; font-size: 1.5rem;"></i>
                </div>
                <div>
                    <h2 style="margin: 0; color: #1C2A39; font-size: 1.5rem; font-weight: 700;">Documentos do Projeto</h2>
                    <p style="margin: 0.25rem 0 0 0; color: #666; font-size: 0.9rem;">Visualização organizada por participante</p>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem;">
                ${usersData.map(userData => createUserDocumentCard(userData)).join('')}
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Adicionar event listeners para abrir arquivos
    attachFileOpenListeners();
}

/**
 * Cria card de documento para um usuário
 */
function createUserDocumentCard(userData) {
    const { userName, categories, files, lastUpdate } = userData;
    
    // Obter iniciais do usuário
    const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    
    // Contar total de arquivos
    let totalFiles = 0;
    if (files && files.children) {
        files.children.forEach(folder => {
            if (folder.type === 'folder' && folder.children) {
                totalFiles += folder.children.length;
            }
        });
    }
    
    return `
        <div style="background: #f8f9fa; border-radius: 12px; padding: 1.5rem; border: 2px solid #E8ECF0; transition: all 0.3s;" onmouseover="this.style.boxShadow='0 6px 20px rgba(0,0,0,0.1)'" onmouseout="this.style.boxShadow='none'">
            <!-- Header do Card -->
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 2px solid #e0e0e0;">
                <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.2rem;">
                    ${initials}
                </div>
                <div style="flex: 1;">
                    <h3 style="margin: 0; color: #1C2A39; font-size: 1.1rem; font-weight: 600;">${userName}</h3>
                    <p style="margin: 0.25rem 0 0 0; color: #666; font-size: 0.85rem;">
                        <i class="fas fa-clock"></i> Atualizado: ${lastUpdate}
                    </p>
                </div>
                <div style="text-align: right;">
                    <div style="background: #4A90E2; color: white; padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">
                        ${totalFiles} ${totalFiles === 1 ? 'arquivo' : 'arquivos'}
                    </div>
                </div>
            </div>
            
            <!-- Categorias e Arquivos -->
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${categories.map((category, idx) => {
                    const categoryFolder = files?.children?.find(f => f.name === category.name && f.type === 'folder');
                    const categoryFiles = categoryFolder?.children || [];
                    
                    return `
                        <div style="background: white; border-radius: 8px; padding: 1rem; border: 1px solid #e0e0e0;">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
                                <i class="fas fa-folder" style="color: ${getCategoryColor(idx)}; font-size: 1.1rem;"></i>
                                <h4 style="margin: 0; color: #1C2A39; font-size: 0.95rem; font-weight: 600;">${category.name}</h4>
                                <span style="background: #f0f0f0; color: #666; padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.75rem; margin-left: auto;">
                                    ${categoryFiles.length} ${categoryFiles.length === 1 ? 'arquivo' : 'arquivos'}
                                </span>
                            </div>
                            
                            ${categoryFiles.length > 0 ? `
                                <div style="display: flex; flex-direction: column; gap: 0.5rem; padding-left: 1.5rem;">
                                    ${categoryFiles.map(file => `
                                        <div class="file-item-readonly" data-user-id="${userData.userId}" data-file-path="${category.name}/${file.name}" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; background: #f8f9fa; border-radius: 6px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#e8f4fd'" onmouseout="this.style.background='#f8f9fa'">
                                            <i class="fas fa-file-alt" style="color: #4A90E2; font-size: 0.9rem;"></i>
                                            <span style="color: #555; font-size: 0.9rem; flex: 1;">${file.name}</span>
                                            <i class="fas fa-eye" style="color: #999; font-size: 0.8rem;" title="Visualizar (somente leitura)"></i>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : `
                                <p style="margin: 0; padding-left: 1.5rem; color: #999; font-size: 0.85rem; font-style: italic;">
                                    Nenhum arquivo nesta categoria
                                </p>
                            `}
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

/**
 * Adiciona event listeners para abrir arquivos em modo leitura
 */
function attachFileOpenListeners() {
    const fileItems = document.querySelectorAll('.file-item-readonly');
    
    fileItems.forEach(item => {
        item.addEventListener('click', async () => {
            const userId = item.getAttribute('data-user-id');
            const filePath = item.getAttribute('data-file-path');
            
            await openFileReadOnly(userId, filePath);
        });
    });
}

/**
 * Abre arquivo em modo somente leitura
 */
async function openFileReadOnly(userId, filePath) {
    try {
        // Buscar fileSystem do usuário
        const fileSystemData = await fetchUserFileSystem(userId);
        
        if (!fileSystemData) {
            alert('❌ Não foi possível carregar o arquivo.');
            return;
        }
        
        // Navegar até o arquivo
        const pathParts = filePath.split('/');
        const folderName = pathParts[0];
        const fileName = pathParts[1];
        
        const folder = fileSystemData.children.find(f => f.name === folderName && f.type === 'folder');
        
        if (!folder) {
            alert('❌ Pasta não encontrada.');
            return;
        }
        
        const file = folder.children.find(f => f.name === fileName && f.type === 'file');
        
        if (!file) {
            alert('❌ Arquivo não encontrado.');
            return;
        }
        
        // Criar modal de visualização
        showFileReadOnlyModal(file, userId, filePath);
        
    } catch (error) {
        console.error('❌ Erro ao abrir arquivo:', error);
        alert('Erro ao abrir arquivo.');
    }
}

/**
 * Exibe modal com conteúdo do arquivo em modo leitura
 */
function showFileReadOnlyModal(file, userId, filePath) {
    // Criar modal
    const modal = document.createElement('div');
    modal.id = 'file-readonly-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.2s;
    `;
    
    const content = file.content || `# ${file.name}\n\nEste arquivo está vazio.`;
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 16px; width: 90%; max-width: 900px; max-height: 85vh; display: flex; flex-direction: column; box-shadow: 0 8px 32px rgba(0,0,0,0.2);">
            <!-- Header -->
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 1.5rem; border-bottom: 2px solid #f0f0f0;">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-file-alt" style="color: white; font-size: 1.2rem;"></i>
                    </div>
                    <div>
                        <h3 style="margin: 0; color: #1C2A39; font-size: 1.2rem; font-weight: 600;">${file.name}</h3>
                        <p style="margin: 0.25rem 0 0 0; color: #999; font-size: 0.85rem;">
                            <i class="fas fa-lock"></i> Modo somente leitura
                        </p>
                    </div>
                </div>
                <button id="close-readonly-modal" style="background: none; border: none; color: #999; cursor: pointer; font-size: 1.5rem; padding: 0.5rem; transition: color 0.2s;" onmouseover="this.style.color='#e74c3c'" onmouseout="this.style.color='#999'">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <!-- Content -->
            <div style="flex: 1; overflow-y: auto; padding: 2rem; background: #f8f9fa;">
                <div style="background: white; padding: 2rem; border-radius: 8px; border: 1px solid #e0e0e0; min-height: 400px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; white-space: pre-wrap; word-wrap: break-word;">
                    ${escapeHtml(content)}
                </div>
            </div>
            
            <!-- Footer -->
            <div style="padding: 1rem 1.5rem; border-top: 2px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; background: #f8f9fa;">
                <div style="color: #666; font-size: 0.85rem;">
                    <i class="fas fa-info-circle"></i> Este documento não pode ser editado
                </div>
                <button id="refresh-readonly-btn" style="padding: 0.75rem 1.5rem; background: #4A90E2; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: background 0.3s;" onmouseover="this.style.background='#357ABD'" onmouseout="this.style.background='#4A90E2'">
                    <i class="fas fa-sync-alt"></i> Atualizar
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners
    document.getElementById('close-readonly-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    document.getElementById('refresh-readonly-btn').addEventListener('click', async () => {
        // Recarregar arquivo
        const refreshBtn = document.getElementById('refresh-readonly-btn');
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Atualizando...';
        refreshBtn.disabled = true;
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Fechar modal atual
        document.body.removeChild(modal);
        
        // Reabrir com dados atualizados
        await openFileReadOnly(userId, filePath);
    });
    
    // Fechar ao clicar fora
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

/**
 * Escapa HTML para prevenção de XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
