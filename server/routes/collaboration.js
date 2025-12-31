// ===========================
// COLLABORATION ROUTES
// ===========================

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Armazenamento temporário de convites (em produção, usar banco de dados)
let invitations = [];
let notifications = [];

/**
 * GET /api/collaboration/user/:userId
 * Buscar informações de um usuário por ID
 */
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        console.log('🔍 Buscando usuário:', userId);
        
        // Buscar usuário
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Usuário não encontrado'
            });
        }
        
        // Gerar iniciais de forma segura
        let initials = 'U';
        const fullName = user.fullName || user.username || 'Usuário';
        
        if (fullName) {
            const nameParts = fullName.trim().split(' ').filter(n => n.length > 0);
            if (nameParts.length > 0) {
                initials = nameParts.map(n => n[0]).join('').toUpperCase().substring(0, 2);
            }
        }
        
        // Retornar apenas informações públicas
        res.json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                fullName: fullName,
                initials: initials
            }
        });
        
    } catch (error) {
        console.error('❌ Erro ao buscar usuário:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao buscar usuário'
        });
    }
});

/**
 * POST /api/collaboration/invite
 * Enviar convite de colaboração
 */
router.post('/invite', async (req, res) => {
    try {
        const { projectId, projectTitle, fromUserId, toUserId, projectDescription } = req.body;
        
        console.log('📨 Enviando convite:', { projectId, projectTitle, fromUserId, toUserId });
        
        // Validações
        if (!projectId || !projectTitle || !fromUserId || !toUserId) {
            return res.status(400).json({
                success: false,
                error: 'Dados incompletos'
            });
        }
        
        // Verificar se usuários existem
        const fromUser = await User.findById(fromUserId);
        const toUser = await User.findById(toUserId);
        
        if (!fromUser || !toUser) {
            return res.status(404).json({
                success: false,
                error: 'Usuário não encontrado'
            });
        }
        
        // Obter nomes de forma segura
        const fromUserName = fromUser.fullName || fromUser.username || 'Usuário';
        const toUserName = toUser.fullName || toUser.username || 'Usuário';
        
        // Verificar se já existe convite pendente
        const existingInvite = invitations.find(
            inv => inv.projectId === projectId && 
                   inv.toUserId === toUserId && 
                   inv.status === 'pending'
        );
        
        if (existingInvite) {
            return res.status(400).json({
                success: false,
                error: 'Convite já enviado para este usuário'
            });
        }
        
        // Criar convite
        const invitation = {
            id: Date.now().toString(),
            projectId,
            projectTitle,
            projectDescription: projectDescription || '',
            fromUserId,
            fromUserName: fromUserName,
            toUserId,
            toUserName: toUserName,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        invitations.push(invitation);
        
        // Criar notificação
        const notification = {
            id: Date.now().toString(),
            userId: toUserId,
            type: 'project_invite',
            title: 'Novo convite de projeto',
            message: `${fromUserName} convidou você para participar do projeto "${projectTitle}"`,
            data: {
                invitationId: invitation.id,
                projectId,
                projectTitle,
                fromUserId,
                fromUserName: fromUserName
            },
            read: false,
            createdAt: new Date().toISOString()
        };
        
        notifications.push(notification);
        
        console.log('✅ Convite enviado com sucesso');
        
        res.json({
            success: true,
            invitation,
            notification
        });
        
    } catch (error) {
        console.error('❌ Erro ao enviar convite:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao enviar convite'
        });
    }
});

/**
 * GET /api/collaboration/invitations/:userId
 * Listar convites pendentes de um usuário
 */
router.get('/invitations/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        console.log('📋 Listando convites para usuário:', userId);
        
        // Filtrar convites pendentes do usuário
        const userInvitations = invitations.filter(
            inv => inv.toUserId === userId && inv.status === 'pending'
        );
        
        res.json({
            success: true,
            invitations: userInvitations
        });
        
    } catch (error) {
        console.error('❌ Erro ao listar convites:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao listar convites'
        });
    }
});

/**
 * POST /api/collaboration/invite/:invitationId/accept
 * Aceitar convite de colaboração
 */
router.post('/invite/:invitationId/accept', async (req, res) => {
    try {
        const { invitationId } = req.params;
        const { userId } = req.body;
        
        console.log('✅ Aceitando convite:', invitationId);
        
        // Buscar convite
        const invitation = invitations.find(inv => inv.id === invitationId);
        
        if (!invitation) {
            return res.status(404).json({
                success: false,
                error: 'Convite não encontrado'
            });
        }
        
        // Verificar se é o usuário correto
        if (invitation.toUserId !== userId) {
            return res.status(403).json({
                success: false,
                error: 'Não autorizado'
            });
        }
        
        // Atualizar status do convite
        invitation.status = 'accepted';
        invitation.acceptedAt = new Date().toISOString();
        
        // Criar notificação para o criador do projeto
        const notification = {
            id: Date.now().toString(),
            userId: invitation.fromUserId,
            type: 'invite_accepted',
            title: 'Convite aceito',
            message: `${invitation.toUserName} aceitou o convite para o projeto "${invitation.projectTitle}"`,
            data: {
                projectId: invitation.projectId,
                userId: invitation.toUserId,
                userName: invitation.toUserName
            },
            read: false,
            createdAt: new Date().toISOString()
        };
        
        notifications.push(notification);
        
        console.log('✅ Convite aceito com sucesso');
        
        res.json({
            success: true,
            invitation,
            notification
        });
        
    } catch (error) {
        console.error('❌ Erro ao aceitar convite:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao aceitar convite'
        });
    }
});

/**
 * POST /api/collaboration/invite/:invitationId/decline
 * Recusar convite de colaboração
 */
router.post('/invite/:invitationId/decline', async (req, res) => {
    try {
        const { invitationId } = req.params;
        const { userId } = req.body;
        
        console.log('❌ Recusando convite:', invitationId);
        
        // Buscar convite
        const invitation = invitations.find(inv => inv.id === invitationId);
        
        if (!invitation) {
            return res.status(404).json({
                success: false,
                error: 'Convite não encontrado'
            });
        }
        
        // Verificar se é o usuário correto
        if (invitation.toUserId !== userId) {
            return res.status(403).json({
                success: false,
                error: 'Não autorizado'
            });
        }
        
        // Atualizar status do convite
        invitation.status = 'declined';
        invitation.declinedAt = new Date().toISOString();
        
        console.log('✅ Convite recusado');
        
        res.json({
            success: true,
            invitation
        });
        
    } catch (error) {
        console.error('❌ Erro ao recusar convite:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao recusar convite'
        });
    }
});

/**
 * GET /api/collaboration/notifications/:userId
 * Listar notificações de um usuário
 */
router.get('/notifications/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { unreadOnly } = req.query;
        
        console.log('🔔 Listando notificações para usuário:', userId);
        
        // Filtrar notificações do usuário
        let userNotifications = notifications.filter(n => n.userId === userId);
        
        // Filtrar apenas não lidas se solicitado
        if (unreadOnly === 'true') {
            userNotifications = userNotifications.filter(n => !n.read);
        }
        
        // Ordenar por data (mais recentes primeiro)
        userNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        res.json({
            success: true,
            notifications: userNotifications,
            unreadCount: notifications.filter(n => n.userId === userId && !n.read).length
        });
        
    } catch (error) {
        console.error('❌ Erro ao listar notificações:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao listar notificações'
        });
    }
});

/**
 * POST /api/collaboration/notifications/:notificationId/read
 * Marcar notificação como lida
 */
router.post('/notifications/:notificationId/read', async (req, res) => {
    try {
        const { notificationId } = req.params;
        
        console.log('✅ Marcando notificação como lida:', notificationId);
        
        // Buscar notificação
        const notification = notifications.find(n => n.id === notificationId);
        
        if (!notification) {
            return res.status(404).json({
                success: false,
                error: 'Notificação não encontrada'
            });
        }
        
        // Marcar como lida
        notification.read = true;
        notification.readAt = new Date().toISOString();
        
        res.json({
            success: true,
            notification
        });
        
    } catch (error) {
        console.error('❌ Erro ao marcar notificação:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao marcar notificação'
        });
    }
});

/**
 * GET /api/collaboration/projects/:userId
 * Listar todos os projetos de um usuário (criados + compartilhados)
 */
router.get('/projects/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        console.log('📂 Listando projetos compartilhados para usuário:', userId);
        
        // Buscar convites aceitos onde o usuário foi convidado
        const acceptedInvites = invitations.filter(
            inv => inv.toUserId === userId && inv.status === 'accepted'
        );
        
        // Retornar IDs dos projetos
        const sharedProjectIds = acceptedInvites.map(inv => inv.projectId);
        
        res.json({
            success: true,
            sharedProjects: acceptedInvites.map(inv => ({
                projectId: inv.projectId,
                projectTitle: inv.projectTitle,
                projectDescription: inv.projectDescription,
                sharedBy: inv.fromUserName,
                sharedAt: inv.acceptedAt
            }))
        });
        
    } catch (error) {
        console.error('❌ Erro ao listar projetos:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao listar projetos'
        });
    }
});

/**
 * GET /api/collaboration/project/:projectId/participants
 * Buscar todos os participantes de um projeto (todos que aceitaram)
 */
router.get('/project/:projectId/participants', async (req, res) => {
    try {
        const { projectId } = req.params;
        
        console.log(`👥 Buscando participantes do projeto ${projectId}`);
        
        // Buscar todos os convites aceitos para este projeto
        const acceptedInvites = invitations.filter(inv => 
            String(inv.projectId) === String(projectId) && 
            inv.status === 'accepted'
        );
        
        console.log(`✅ Encontrados ${acceptedInvites.length} participante(s)`);
        
        // Buscar informações dos usuários
        const participantsPromises = acceptedInvites.map(async (inv) => {
            try {
                const user = await User.findById(inv.toUserId);
                if (user) {
                    const fullName = user.fullName || user.username || 'Usuário';
                    const nameParts = fullName.trim().split(' ').filter(n => n.length > 0);
                    let initials = 'U';
                    if (nameParts.length > 0) {
                        initials = nameParts.map(n => n[0]).join('').toUpperCase().substring(0, 2);
                    }
                    
                    return {
                        id: user._id,
                        name: fullName,
                        username: user.username,
                        initials: initials
                    };
                }
                return null;
            } catch (error) {
                console.error('Erro ao buscar usuário:', error);
                return null;
            }
        });
        
        const participants = (await Promise.all(participantsPromises)).filter(p => p !== null);
        
        res.json({
            success: true,
            participants
        });
        
    } catch (error) {
        console.error('❌ Erro ao buscar participantes:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao buscar participantes'
        });
    }
});

/**
 * POST /api/collaboration/project/:projectId/remove-user
 * Remover usuário de um projeto compartilhado
 */
router.post('/project/:projectId/remove-user', async (req, res) => {
    try {
        const { projectId } = req.params;
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'userId é obrigatório'
            });
        }
        
        console.log(`🗑️ Removendo usuário ${userId} do projeto ${projectId}`);
        
        // Remover todos os convites aceitos para este projeto e usuário
        const beforeLength = invitations.length;
        invitations = invitations.filter(inv => 
            !(String(inv.projectId) === String(projectId) && 
              String(inv.toUserId) === String(userId) && 
              inv.status === 'accepted')
        );
        
        const removedCount = beforeLength - invitations.length;
        
        console.log(`✅ ${removedCount} compartilhamento(s) removido(s)`);
        
        res.json({
            success: true,
            message: 'Usuário removido do projeto',
            removedCount
        });
        
    } catch (error) {
        console.error('❌ Erro ao remover usuário do projeto:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao remover usuário do projeto'
        });
    }
});

module.exports = router;
