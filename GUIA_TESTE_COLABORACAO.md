# 🧪 Guia de Teste - Sistema de Colaboração

## Pré-requisitos

1. ✅ MongoDB rodando e conectado
2. ✅ Servidor agente rodando na porta 3001
3. ✅ Pelo menos 2 usuários registrados no sistema

## Passo a Passo para Testar

### 1. Preparar Usuários de Teste

#### Usuário A (Criador)
1. Registre-se ou faça login
2. Copie o **ID do usuário** (visível no console do navegador ou MongoDB)

#### Usuário B (Colaborador)
1. Em outra aba/navegador (modo anônimo), registre outro usuário
2. Copie o **ID deste usuário**

### 2. Criar Projeto com Colaborador

**Como Usuário A:**

1. Vá para a página inicial
2. Clique em **"Criar Novo Projeto"**
3. Você verá um modal com:
   - Campo de descrição do projeto
   - Seção "Adicionar Colaboradores"
4. Na seção de colaboradores:
   - Cole o **ID do Usuário B** no campo
   - Clique em **"Buscar"**
   - Deve aparecer o perfil do Usuário B (nome + ícone)
   - Clique em **"Adicionar"**
   - O colaborador aparece na lista de adicionados
5. Descreva o projeto no campo de texto
6. Clique no botão de enviar (ícone de avião)
7. Aguarde o processamento da IA
8. Projeto criado! ✅

**O que acontece nos bastidores:**
- Convite é enviado para Usuário B
- Notificação é criada para Usuário B

### 3. Receber e Aceitar Convite

**Como Usuário B:**

1. Recarregue a página ou aguarde 30 segundos
2. Veja o **sino de notificações** no header
3. Deve ter um **badge vermelho** com número "1"
4. Clique no sino
5. Veja o convite:
   - Título: "Novo convite de projeto"
   - Mensagem: "[Nome do Usuário A] convidou você..."
   - Botões: "Aceitar" e "Recusar"
6. Clique em **"Aceitar"**
7. Você verá um alert confirmando
8. A página recarregará
9. O projeto agora aparece na sua lista! ✅

**O que acontece nos bastidores:**
- Convite marcado como aceito
- Notificação enviada ao Usuário A
- Projeto adicionado à lista do Usuário B

### 4. Verificar Notificação de Aceite

**Como Usuário A:**

1. Veja o sino de notificações
2. Badge vermelho aparece (nova notificação)
3. Clique no sino
4. Veja: "Convite aceito"
5. Mensagem: "[Nome do Usuário B] aceitou o convite..."

## Cenários de Teste

### ✅ Teste 1: Adicionar Múltiplos Colaboradores
- Adicione 2-3 colaboradores ao mesmo projeto
- Verifique se todos recebem convites

### ✅ Teste 2: Recusar Convite
- Como colaborador, clique em "Recusar"
- Projeto NÃO deve aparecer na lista
- Notificação marcada como lida

### ✅ Teste 3: Buscar Usuário Inexistente
- Digite um ID inválido
- Deve mostrar erro: "Usuário não encontrado"

### ✅ Teste 4: Adicionar Mesmo Usuário Duas Vezes
- Tente adicionar o mesmo colaborador novamente
- Deve mostrar: "Este usuário já foi adicionado!"

### ✅ Teste 5: Marcar Notificações como Lidas
- Clique em uma notificação
- Ela deve mudar de cor (sem fundo azul)
- Badge atualiza o número

### ✅ Teste 6: Marcar Todas como Lidas
- Com várias notificações não lidas
- Clique em "Marcar todas como lidas"
- Badge desaparece

## Console Logs para Verificar

### Cliente (Navegador - F12)

```
🔔 Inicializando sistema de notificações
🔔 1 notificação(ões) não lida(s)
📨 Enviando 1 convites...
✅ Convite enviado para [Nome]
✅ Todos os convites foram processados
✅ Convite aceito!
```

### Servidor (Terminal)

```
🔍 Buscando usuário: [ID]
📨 Enviando convite: { projectId, projectTitle, ... }
✅ Convite enviado com sucesso
✅ Aceitando convite: [invitationId]
✅ Convite aceito com sucesso
🔔 Listando notificações para usuário: [userId]
```

## Troubleshooting

### ❌ "Usuário não autenticado"
**Solução:** Faça login novamente

### ❌ Notificações não aparecem
**Soluções:**
1. Verifique se o servidor está rodando (porta 3001)
2. Verifique console para erros
3. Recarregue a página

### ❌ Convite não chega
**Soluções:**
1. Verifique o ID do usuário (deve ser exato do MongoDB)
2. Verifique logs do servidor
3. Certifique-se de que ambos os usuários existem

### ❌ Projeto não aparece após aceitar
**Soluções:**
1. Recarregue a página (F5)
2. Limpe o localStorage e faça login novamente
3. Verifique console do navegador

## Ferramentas Úteis

### Ver localStorage
No console do navegador:
```javascript
// Ver todos os projetos
JSON.parse(localStorage.getItem('projects'))

// Ver usuário atual
JSON.parse(localStorage.getItem('currentUser'))
```

### Ver Dados no MongoDB

```javascript
// No MongoDB Shell ou Compass
db.users.find()           // Ver todos os usuários
db.projects.find()        // Ver todos os projetos
```

### Limpar Cache (Se Necessário)

```javascript
// No console do navegador
localStorage.clear()
location.reload()
```

## Checklist de Funcionalidades

- [ ] Buscar usuário por ID
- [ ] Adicionar colaborador ao criar projeto
- [ ] Remover colaborador antes de enviar
- [ ] Criar projeto e enviar convites
- [ ] Receber notificação de convite
- [ ] Aceitar convite
- [ ] Recusar convite
- [ ] Ver projeto compartilhado na lista
- [ ] Notificação de aceite para criador
- [ ] Marcar notificação como lida
- [ ] Marcar todas como lidas
- [ ] Badge de notificações não lidas
- [ ] Atualização automática de notificações

## Próximos Passos

Após testar e validar:

1. **Melhorar UI/UX**
   - Animações mais suaves
   - Feedback visual melhor
   - Design mais polido

2. **Adicionar Persistência**
   - Salvar convites no MongoDB
   - Salvar notificações no MongoDB
   - Sincronizar entre sessões

3. **Recursos Avançados**
   - Notificações em tempo real (WebSocket)
   - Buscar usuários por nome
   - Sistema de permissões
   - Chat do projeto

4. **Segurança**
   - Validação de permissões
   - Proteção contra CSRF
   - Rate limiting
