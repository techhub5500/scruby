# 🤖 Agent Server - Servidor de IA para Criação de Projetos

## 📋 Descrição
Este é o servidor dedicado ao agente de IA que utiliza a API do DeepSeek para processar descrições de projetos acadêmicos e gerar automaticamente:
- **Título** profissional e conciso
- **Descrição** resumida e clara
- **Estrutura** sugerida do trabalho (seções, páginas estimadas, prazos)

## 🚀 Como Iniciar

### 1. Instalar Dependências
```bash
cd server
npm install
```

### 2. Configurar Variáveis de Ambiente
Certifique-se de que o arquivo `.env` contém:
```
DEEPSEEK_API_KEY=sk-0b7ff25f3e6b4e38886bdcd134b550ad
MONGO_URI=mongodb+srv://...
PORT=3001
```

### 3. Iniciar o Servidor do Agente
```bash
npm run agent
```

Ou com auto-reload (desenvolvimento):
```bash
npm run agent:dev
```

### 4. Verificar se está Funcionando
Abra o navegador em: `http://localhost:3001/health`

Você deve ver:
```json
{
  "status": "ok",
  "message": "Agent Server está rodando",
  "timestamp": "2025-12-30T..."
}
```

## 📡 Endpoints da API

### POST `/api/agent/process-project`
Processa a descrição do projeto usando IA

**Request Body:**
```json
{
  "description": "Análise das aplicações clínicas da biomedicina molecular..."
}
```

**Response:**
```json
{
  "success": true,
  "project": {
    "id": "...",
    "title": "Aplicações Clínicas da Biomedicina Molecular",
    "description": "Revisão acadêmica sobre técnicas moleculares...",
    "fullDescription": "descrição completa...",
    "status": "in-progress",
    "progress": 5,
    "participants": [...],
    "structure": {
      "sections": [...],
      "estimatedPages": 10,
      "suggestedDeadline": "2 semanas"
    }
  }
}
```

### GET `/api/agent/projects`
Lista todos os projetos salvos no banco

### GET `/api/agent/projects/:id`
Busca um projeto específico por ID

### DELETE `/api/agent/projects/:id`
Deleta um projeto

## 🔧 Arquitetura

```
server/
├── agentServer.js      # Servidor Express dedicado
├── agent.js            # Lógica do agente (DeepSeek)
├── package.json        # Dependências
└── .env               # Variáveis de ambiente
```

## 🧪 Testando a API

### Usando curl:
```bash
curl -X POST http://localhost:3001/api/agent/process-project \
  -H "Content-Type: application/json" \
  -d '{"description": "Estudo sobre inteligência artificial na medicina"}'
```

### Usando JavaScript (no navegador):
```javascript
fetch('http://localhost:3001/api/agent/process-project', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    description: 'Análise de blockchain e criptomoedas'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

## ⚠️ Notas Importantes

1. **Porta 3001**: O servidor do agente roda na porta 3001 (diferente do servidor principal na 3000)
2. **DeepSeek API**: Requer chave válida no `.env`
3. **MongoDB**: Opcional - se não conectado, funciona sem persistência
4. **CORS**: Habilitado para permitir requests do frontend

## 🔄 Fluxo de Funcionamento

1. Usuário preenche descrição no modal (frontend)
2. Frontend envia POST para `/api/agent/process-project`
3. Servidor chama `agent.js` → `processProjectWithAI()`
4. Agent envia request para DeepSeek API
5. DeepSeek processa e retorna JSON estruturado
6. Agent cria objeto do projeto
7. Servidor salva no MongoDB (se conectado)
8. Resposta é enviada ao frontend
9. Frontend exibe o projeto criado

## 🐛 Troubleshooting

### Erro: "DEEPSEEK_API_KEY não está configurada"
→ Verifique o arquivo `.env`

### Erro: "MongoDB connection error"
→ Verifique o `MONGO_URI` ou rode sem banco (funciona mesmo assim)

### Erro: "EADDRINUSE: address already in use"
→ Porta 3001 já está em uso. Mude no `.env` ou mate o processo:
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Erro: "fetch failed" no frontend
→ Certifique-se de que o agentServer está rodando na porta 3001

## 📝 Próximos Passos

- [ ] Adicionar autenticação de usuários
- [ ] Implementar rate limiting para API do DeepSeek
- [ ] Adicionar cache de respostas
- [ ] Melhorar prompt para IA gerar estruturas mais detalhadas
- [ ] Adicionar websockets para feedback em tempo real
