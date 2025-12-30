# 🚀 Scruby Server - Guia Rápido

## 📦 Instalação

```bash
cd server
npm install
```

## 🎯 Como Iniciar os Servidores

### ⭐ Opção Recomendada: Iniciar Tudo de Uma Vez

Este comando inicia **ambos os servidores** com **auto-reload**:

```bash
npm run start:all
```

Isso vai iniciar:
- 🌐 **Servidor Principal** na porta **3000** (serverOperacional.js)
- 🤖 **Servidor do Agente de IA** na porta **3001** (agentServer.js)

**Ambos servidores reiniciam automaticamente quando você salvar mudanças nos arquivos!**

### 📋 Outras Opções

#### Iniciar Apenas o Servidor Principal
```bash
# Sem auto-reload
npm start

# Com auto-reload
npm run dev
```

#### Iniciar Apenas o Servidor do Agente
```bash
# Sem auto-reload
npm run agent

# Com auto-reload
npm run agent:dev
```

## 🔍 O que cada servidor faz?

### Servidor Principal (porta 3000)
- Serve arquivos estáticos do frontend
- Rotas de autenticação (`/api/auth`)
- Sistema de arquivos (`/api/filesystem`)
- Acesso: `http://localhost:3000`

### Servidor do Agente (porta 3001)
- Processamento de projetos com IA (DeepSeek)
- Rotas do agente (`/api/agent/*`)
- Health check: `http://localhost:3001/health`

## 📊 Visualização no Terminal

Quando você roda `npm run start:all`, verá algo assim:

```
[SERVER] Server is running on port 3000
[SERVER] Connected to MongoDB
[AGENT] 🤖 AGENT SERVER - Servidor de IA
[AGENT] 🌐 Rodando na porta: 3001
[AGENT] ✅ Conectado ao MongoDB
```

## 🔄 Auto-Reload

O **nodemon** monitora mudanças em:
- ✅ Todos os arquivos `.js` na raiz
- ✅ Arquivos em `/models`
- ✅ Arquivos em `/routes`
- ✅ Arquivo `.env`

**Ignora:**
- ❌ `node_modules`
- ❌ Arquivos de teste

**Delay de 1 segundo** antes de reiniciar (evita múltiplos reloads)

## ⚙️ Configuração

### Variáveis de Ambiente (.env)
```env
MONGO_URI=mongodb+srv://...
PORT=3001
DEEPSEEK_API_KEY=sk-...
```

### Nodemon (nodemon.json)
Você pode editar `nodemon.json` para customizar o comportamento do auto-reload.

## 🛑 Parar os Servidores

Pressione **Ctrl+C** no terminal para parar ambos os servidores.

## 📝 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run start:all` | ⭐ Inicia ambos servidores com auto-reload |
| `npm start` | Inicia servidor principal (sem reload) |
| `npm run dev` | Inicia servidor principal (com reload) |
| `npm run agent` | Inicia servidor do agente (sem reload) |
| `npm run agent:dev` | Inicia servidor do agente (com reload) |

## 🐛 Troubleshooting

### Erro: "Port already in use"
Mate o processo na porta:
```powershell
# Encontrar processo na porta 3000 ou 3001
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Matar processo (substitua <PID>)
taskkill /PID <PID> /F
```

### Mudanças não são detectadas
1. Verifique se o arquivo está sendo monitorado no `nodemon.json`
2. Salve o arquivo novamente
3. Reinicie manualmente: Ctrl+C e rode `npm run start:all` novamente

### DeepSeek API não funciona
Verifique se a chave está correta no `.env`:
```env
DEEPSEEK_API_KEY=sk-0b7ff25f3e6b4e38886bdcd134b550ad
```

## ✨ Recursos

- ✅ Auto-reload em ambos servidores
- ✅ Um único comando para iniciar tudo
- ✅ Logs coloridos (SERVER em cyan, AGENT em magenta)
- ✅ Configuração centralizada do nodemon
- ✅ Delay para evitar múltiplos reloads
- ✅ Ignora arquivos desnecessários

## 🎓 Começar a Desenvolver

1. **Instalar dependências:**
   ```bash
   cd server
   npm install
   ```

2. **Configurar .env:**
   - Copie `.env.example` para `.env` (se houver)
   - Ou crie `.env` com as variáveis necessárias

3. **Iniciar servidores:**
   ```bash
   npm run start:all
   ```

4. **Abrir aplicação:**
   - Frontend: `http://localhost:3000/html/home.html`
   - Agent Health: `http://localhost:3001/health`

5. **Fazer mudanças:**
   - Edite qualquer arquivo `.js`
   - Salve (Ctrl+S)
   - Observe os servidores reiniciando automaticamente!

Pronto! Agora você pode desenvolver com produtividade máxima! 🚀
