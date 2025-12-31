# 🤝 Sistema de Colaboração - Scruby

## Visão Geral

O Sistema de Colaboração permite que usuários trabalhem juntos em projetos acadêmicos através de convites e notificações.

## Funcionalidades Implementadas

### 1. **Adicionar Colaboradores ao Criar Projeto**

Quando você cria um novo projeto, pode adicionar colaboradores:

1. Clique em "Criar Novo Projeto"
2. Descreva seu projeto
3. Na seção "Adicionar Colaboradores":
   - Digite o **ID do usuário** que deseja convidar
   - Clique em "Buscar"
   - Visualize o perfil do usuário (nome + ícone)
   - Clique em "Adicionar" para confirmar
   - Repita para adicionar mais colaboradores
4. Envie a descrição do projeto
5. Os convites serão enviados automaticamente

### 2. **Sistema de Notificações**

#### Ícone de Notificações no Header
- **Sino azul**: Clique para ver suas notificações
- **Badge vermelho**: Mostra o número de notificações não lidas

#### Tipos de Notificações

**📨 Convite de Projeto**
- Receba quando alguém te convidar para um projeto
- Ações disponíveis:
  - ✅ **Aceitar**: Você entrará no projeto
  - ❌ **Recusar**: O convite será descartado

**✅ Convite Aceito**
- Receba quando alguém aceitar seu convite
- Notifica o criador do projeto

### 3. **Gerenciar Notificações**

- **Ver Todas**: Clique no sino no header
- **Marcar como Lida**: Clique na notificação
- **Marcar Todas como Lidas**: Botão no topo do dropdown
- **Atualização Automática**: A cada 30 segundos

### 4. **Projetos Compartilhados**

Quando você aceita um convite:
- O projeto aparece automaticamente na sua lista
- Marcado como "compartilhado"
- Você vê todos os participantes
- Acesso às mesmas funcionalidades do projeto

## Fluxo Completo

### Criador do Projeto

1. Cria novo projeto
2. Adiciona colaboradores por ID
3. Envia descrição do projeto
4. Recebe notificação quando colaboradores aceitam

### Colaborador Convidado

1. Recebe notificação de convite
2. Clica no sino para ver notificações
3. Visualiza detalhes do convite
4. Aceita ou recusa o convite
5. Se aceitar, projeto aparece na lista

## API Endpoints (Backend)

### Colaboração

```
GET  /api/collaboration/user/:userId
     → Buscar usuário por ID

POST /api/collaboration/invite
     → Enviar convite de colaboração

GET  /api/collaboration/invitations/:userId
     → Listar convites pendentes

POST /api/collaboration/invite/:invitationId/accept
     → Aceitar convite

POST /api/collaboration/invite/:invitationId/decline
     → Recusar convite

GET  /api/collaboration/projects/:userId
     → Listar projetos compartilhados
```

### Notificações

```
GET  /api/collaboration/notifications/:userId
     → Listar notificações

POST /api/collaboration/notifications/:notificationId/read
     → Marcar como lida
```

## Estrutura de Dados

### Convite (Invitation)

```javascript
{
  id: string,
  projectId: string,
  projectTitle: string,
  projectDescription: string,
  fromUserId: string,
  fromUserName: string,
  toUserId: string,
  toUserName: string,
  status: 'pending' | 'accepted' | 'declined',
  createdAt: string,
  acceptedAt?: string,
  declinedAt?: string
}
```

### Notificação (Notification)

```javascript
{
  id: string,
  userId: string,
  type: 'project_invite' | 'invite_accepted',
  title: string,
  message: string,
  data: object,
  read: boolean,
  createdAt: string,
  readAt?: string
}
```

## Arquivos Criados/Modificados

### Novos Arquivos

- `server/routes/collaboration.js` - Rotas de colaboração e notificações
- `client/js/notifications.js` - Sistema de notificações no cliente
- `client/css/notifications.css` - Estilos para notificações

### Arquivos Modificados

- `server/agentServer.js` - Adicionadas rotas de colaboração
- `client/js/home.js` - Adicionar colaboradores + carregar projetos compartilhados
- `client/html/home.html` - Interface de notificações
- `client/html/project.html` - Interface de notificações

## Como Usar

### 1. Iniciar o Servidor

```bash
cd server
node agentServer.js
```

O servidor deve estar rodando na porta **3001**.

### 2. Obter ID de Usuário

Para convidar alguém, você precisa do **ID do usuário**:

- O ID é gerado quando o usuário se registra
- Está disponível no MongoDB (campo `_id`)
- Em produção, adicione uma forma de compartilhar IDs (ex: perfil do usuário)

### 3. Criar Projeto com Colaboradores

1. Acesse a página inicial
2. Clique em "Criar Novo Projeto"
3. Digite o ID do colaborador
4. Busque e adicione
5. Descreva o projeto
6. Envie

### 4. Aceitar Convites

1. Veja o sino com badge vermelho
2. Clique no sino
3. Veja o convite
4. Clique em "Aceitar"
5. Projeto aparece na sua lista

## Recursos Futuros

- [ ] Buscar usuários por nome ou email (não apenas ID)
- [ ] Notificações push (tempo real via WebSocket)
- [ ] Mensagens diretas entre colaboradores
- [ ] Permissões de colaboradores (visualizar/editar)
- [ ] Remover colaboradores de projetos
- [ ] Histórico de atividades do projeto
- [ ] Notificações por email

## Troubleshooting

### Notificações não aparecem
- Verifique se está autenticado (localStorage tem currentUser)
- Verifique se o servidor está rodando (porta 3001)
- Abra o console do navegador para ver logs

### Convite não chega
- Verifique se o ID do usuário está correto
- Verifique logs do servidor
- Certifique-se de que o MongoDB está conectado

### Projeto não aparece após aceitar
- Recarregue a página (F5)
- Verifique localStorage (`projects`)
- Verifique console para erros

## Segurança

⚠️ **Nota de Desenvolvimento**: Este é um protótipo. Em produção:

- Implemente autenticação JWT adequada
- Valide permissões de usuário
- Use HTTPS
- Sanitize entradas de usuário
- Implemente rate limiting
- Use banco de dados para convites/notificações (não armazenamento em memória)

## Suporte

Para problemas ou dúvidas, consulte os logs:
- **Cliente**: Console do navegador (F12)
- **Servidor**: Terminal rodando agentServer.js
