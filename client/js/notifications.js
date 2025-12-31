// ===========================
// NOTIFICATIONS.JS - Sistema de Notificações
// ===========================

const NOTIFICATIONS_API = 'http://localhost:3001/api/collaboration';
let notificationsCache = [];
let notificationsCheckInterval = null;

// Inicializar sistema de notificações
function initNotifications() {
    // Buscar usuário com a chave correta
    let currentUser = JSON.parse(localStorage.getItem('scruby_user'));
    if (!currentUser) {
        currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
    
    // Normalizar: garantir que _id existe
    if (currentUser && currentUser.id && !currentUser._id) {
        currentUser._id = currentUser.id;
    }
    
    const userId = currentUser?._id || currentUser?.id;
    
    if (!currentUser || !userId) {
        console.log('⚠️ Usuário não autenticado - notificações desabilitadas');
        return;
    }
    
    console.log('🔔 Inicializando sistema de notificações');
    
    // Carregar notificações iniciais
    loadNotifications();
    
    // Verificar novas notificações a cada 30 segundos
    notificationsCheckInterval = setInterval(() => {
        loadNotifications(true);
    }, 30000);
    
    // Setup event listeners
    setupNotificationListeners();
}

// Setup event listeners
function setupNotificationListeners() {
    const bell = document.getElementById('notification-bell');
    const dropdown = document.getElementById('notifications-dropdown');
    
    if (bell) {
        bell.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleNotificationsDropdown();
        });
    }
    
    // Fechar dropdown ao clicar fora
    document.addEventListener('click', (e) => {
        if (dropdown && !dropdown.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
    
    // Marcar todas como lidas
    const markAllReadBtn = document.getElementById('mark-all-read-btn');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', markAllAsRead);
    }
}

// Toggle dropdown de notificações
function toggleNotificationsDropdown() {
    const dropdown = document.getElementById('notifications-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
        
        // Se está abrindo, carregar notificações
        if (dropdown.classList.contains('show')) {
            loadNotifications();
        }
    }
}

// Carregar notificações do servidor
async function loadNotifications(silent = false) {
    let currentUser = JSON.parse(localStorage.getItem('scruby_user'));
    if (!currentUser) {
        currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
    
    // Normalizar: garantir que _id existe
    if (currentUser && currentUser.id && !currentUser._id) {
        currentUser._id = currentUser.id;
    }
    
    const userId = currentUser?._id || currentUser?.id;
    if (!currentUser || !userId) return;
    
    try {
        const response = await fetch(`${NOTIFICATIONS_API}/notifications/${userId}`);
        const data = await response.json();
        
        if (data.success) {
            notificationsCache = data.notifications;
            updateNotificationBadge(data.unreadCount);
            renderNotifications();
            
            if (!silent && data.unreadCount > 0) {
                console.log(`🔔 ${data.unreadCount} notificação(ões) não lida(s)`);
            }
        }
    } catch (error) {
        console.error('Erro ao carregar notificações:', error);
    }
}

// Atualizar badge de notificações
function updateNotificationBadge(count) {
    const badge = document.getElementById('notification-badge');
    if (badge) {
        if (count > 0) {
            badge.textContent = count > 9 ? '9+' : count;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

// Renderizar notificações
function renderNotifications() {
    const container = document.getElementById('notifications-list');
    if (!container) return;
    
    if (notificationsCache.length === 0) {
        container.innerHTML = `
            <div class="notifications-empty">
                <i class="fas fa-bell-slash"></i>
                <p>Nenhuma notificação</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = notificationsCache.map(notification => {
        return createNotificationItem(notification);
    }).join('');
    
    // Adicionar event listeners
    notificationsCache.forEach(notification => {
        if (notification.type === 'project_invite') {
            const acceptBtn = document.getElementById(`accept-${notification.id}`);
            const declineBtn = document.getElementById(`decline-${notification.id}`);
            
            if (acceptBtn) {
                acceptBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    handleInviteAction(notification, 'accept');
                });
            }
            
            if (declineBtn) {
                declineBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    handleInviteAction(notification, 'decline');
                });
            }
        }
        
        // Marcar como lida ao clicar
        const item = document.getElementById(`notification-${notification.id}`);
        if (item && !notification.read) {
            item.addEventListener('click', () => {
                markAsRead(notification.id);
            });
        }
    });
}

// Criar item de notificação
function createNotificationItem(notification) {
    const unreadClass = notification.read ? '' : 'unread';
    const timeAgo = getTimeAgo(notification.createdAt);
    
    let iconClass = 'invite';
    let icon = '📨';
    
    if (notification.type === 'invite_accepted') {
        iconClass = 'accepted';
        icon = '✅';
    }
    
    let actionsHTML = '';
    if (notification.type === 'project_invite' && !notification.read) {
        actionsHTML = `
            <div class="notification-actions">
                <button id="accept-${notification.id}" class="notification-action-btn accept">
                    <i class="fas fa-check"></i> Aceitar
                </button>
                <button id="decline-${notification.id}" class="notification-action-btn decline">
                    <i class="fas fa-times"></i> Recusar
                </button>
            </div>
        `;
    }
    
    return `
        <div id="notification-${notification.id}" class="notification-item ${unreadClass}">
            <div class="notification-content">
                <div class="notification-icon ${iconClass}">
                    ${icon}
                </div>
                <div class="notification-details">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${timeAgo}</div>
                    ${actionsHTML}
                </div>
            </div>
        </div>
    `;
}

// Lidar com ação de convite (aceitar/recusar)
async function handleInviteAction(notification, action) {
    let currentUser = JSON.parse(localStorage.getItem('scruby_user'));
    if (!currentUser) {
        currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
    
    // Normalizar: garantir que _id existe
    if (currentUser && currentUser.id && !currentUser._id) {
        currentUser._id = currentUser.id;
    }
    
    const userId = currentUser?._id || currentUser?.id;
    if (!currentUser || !userId) return;
    
    const invitationId = notification.data.invitationId;
    const endpoint = action === 'accept' ? 'accept' : 'decline';
    
    try {
        const response = await fetch(`${NOTIFICATIONS_API}/invite/${invitationId}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userId
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            if (action === 'accept') {
                console.log('✅ Convite aceito!');
                alert(`Você aceitou o convite para o projeto "${notification.data.projectTitle}"!\n\nO projeto já está disponível na sua lista.`);
                
                // Recarregar projetos
                if (typeof loadAllProjects === 'function') {
                    loadAllProjects();
                } else {
                    // Recarregar a página para atualizar a lista de projetos
                    window.location.reload();
                }
            } else {
                console.log('❌ Convite recusado');
                alert('Convite recusado.');
            }
            
            // Marcar notificação como lida
            await markAsRead(notification.id);
            
            // Recarregar notificações
            loadNotifications();
        } else {
            throw new Error(data.error || 'Erro ao processar convite');
        }
    } catch (error) {
        console.error('Erro ao processar convite:', error);
        alert('Erro ao processar convite. Tente novamente.');
    }
}

// Marcar notificação como lida
async function markAsRead(notificationId) {
    try {
        const response = await fetch(`${NOTIFICATIONS_API}/notifications/${notificationId}/read`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Atualizar cache
            const notification = notificationsCache.find(n => n.id === notificationId);
            if (notification) {
                notification.read = true;
            }
            
            // Atualizar interface
            loadNotifications(true);
        }
    } catch (error) {
        console.error('Erro ao marcar notificação como lida:', error);
    }
}

// Marcar todas como lidas
async function markAllAsRead() {
    const unreadNotifications = notificationsCache.filter(n => !n.read);
    
    if (unreadNotifications.length === 0) {
        return;
    }
    
    const promises = unreadNotifications.map(n => markAsRead(n.id));
    await Promise.all(promises);
    
    console.log('✅ Todas as notificações foram marcadas como lidas');
}

// Calcular tempo relativo
function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'agora';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `há ${hours} hora${hours > 1 ? 's' : ''}`;
    
    const days = Math.floor(hours / 24);
    if (days < 7) return `há ${days} dia${days > 1 ? 's' : ''}`;
    
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `há ${weeks} semana${weeks > 1 ? 's' : ''}`;
    
    const months = Math.floor(days / 30);
    return `há ${months} mês${months > 1 ? 'es' : ''}`;
}

// Limpar intervalo ao sair da página
window.addEventListener('beforeunload', () => {
    if (notificationsCheckInterval) {
        clearInterval(notificationsCheckInterval);
    }
});

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNotifications);
} else {
    initNotifications();
}
