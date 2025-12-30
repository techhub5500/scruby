# 🚀 Como Usar o Novo Sistema de Criação de Projetos com IA

## ✅ Sistema Implementado com Sucesso!

O sistema agora usa o **DeepSeek AI** para criar projetos acadêmicos inteligentes baseados na descrição do usuário.

---

## 📋 O que foi Implementado

### 1. **Servidor do Agente de IA** (`agentServer.js`)
- Servidor dedicado rodando na **porta 3001**
- Conectado ao MongoDB para persistência
- API RESTful para processar projetos

### 2. **Módulo do Agente** (`agent.js`)
- Integração com DeepSeek API
- Processamento inteligente de descrições
- Geração automática de:
  - Título profissional
  - Descrição resumida
  - Estrutura do trabalho (seções, páginas, prazos)

### 3. **Frontend Atualizado** (`home.js`)
- Nova função `sendModalMessage()` que chama a API do agente
- Interface com feedback em tempo real
- Mensagens de sucesso/erro aprimoradas
- Função antiga descontinuada (comentada para referência)

---

## 🎯 Como Usar

### Passo 1: Iniciar os Servidores

#### Terminal 1 - Servidor Principal (porta 3000)
```bash
cd server
node serverOperacional.js
```

#### Terminal 2 - Servidor do Agente (porta 3001)
```bash
cd server
node agentServer.js
```

Ou use os scripts do npm:
```bash
npm run agent      # Iniciar servidor do agente
npm run agent:dev  # Com auto-reload
```

### Passo 2: Abrir a Aplicação
Abra no navegador: `http://localhost:3000/html/home.html`

### Passo 3: Criar um Projeto
1. Clique em **"Criar Projeto"** ou **"Criar Primeiro Projeto"**
2. Um modal será aberto com o prompt
3. Descreva seu projeto acadêmico detalhadamente, por exemplo:

```
Preciso fazer um trabalho sobre Inteligência Artificial aplicada à Medicina. 
O trabalho deve ter entre 15 e 20 páginas, incluindo introdução, desenvolvimento 
e conclusão. O professor exige pelo menos 10 referências bibliográficas atuais. 
Preciso abordar casos práticos de uso de IA em diagnósticos médicos. Prazo: 3 semanas.
```

4. Clique em **"Enviar"** ou pressione **Enter**
5. Aguarde o processamento (5-10 segundos)
6. O projeto será criado automaticamente com:
   - ✅ Título gerado pela IA
   - ✅ Descrição resumida
   - ✅ Estrutura sugerida
   - ✅ Status inicial: "Em andamento"
   - ✅ Progresso: 5%

---

## 🔍 Verificar se Está Funcionando

### 1. Testar Health Check do Agente
Abra no navegador: `http://localhost:3001/health`

Deve mostrar:
```json
{
  "status": "ok",
  "message": "Agent Server está rodando",
  "timestamp": "2025-12-30T..."
}
```

### 2. Testar API Diretamente (opcional)
Use o PowerShell ou terminal:

```powershell
$body = @{
    description = "Estudo sobre blockchain e criptomoedas na economia digital"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/agent/process-project" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body
```

### 3. Ver Console do Servidor
No terminal onde o agentServer está rodando, você verá logs como:

```
🚀 Nova requisição de processamento de projeto
📝 Descrição: Estudo sobre blockchain...
🤖 Iniciando processamento com DeepSeek...
✅ Resposta recebida do DeepSeek
✨ Projeto processado com sucesso
📌 Título: Blockchain e Criptomoedas na Economia Digital
💾 Projeto salvo no MongoDB com ID: 67...
```

---

## 📊 Diferenças: Sistema Antigo vs Novo

| Aspecto | Sistema Antigo | Sistema Novo com IA |
|---------|----------------|---------------------|
| **Título** | Primeiras 5 palavras da descrição | Gerado inteligentemente pela IA |
| **Descrição** | Truncado em 150 caracteres | Resumo profissional criado pela IA |
| **Estrutura** | Nenhuma | Seções, páginas e prazos sugeridos |
| **Processamento** | Simulado (3 segundos) | Real com DeepSeek (5-10 segundos) |
| **Persistência** | Apenas localStorage | MongoDB + localStorage |
| **Qualidade** | Básica | Profissional e contextualizada |

---

## 🎨 Interface do Modal

### Durante o Processamento:
```
🤖 Processando com IA...
O agente DeepSeek está analisando sua descrição e criando 
o projeto acadêmico estruturado. Isso pode levar alguns segundos...
```

### Após o Sucesso:
```
✨ Projeto Criado com Sucesso!

📌 [Título do Projeto]
[Descrição resumida]

📚 Estrutura Sugerida:
• Introdução
• Desenvolvimento
• Conclusão

[Botão: Ver Projeto]
```

### Em Caso de Erro:
```
❌ Erro ao Processar
[Mensagem de erro]

Verifique se o servidor do agente está rodando na porta 3001

[Botão: Tentar Novamente]
```

---

## 🛠️ Arquivos Modificados/Criados

### Novos Arquivos:
- ✅ `server/agentServer.js` - Servidor do agente
- ✅ `server/agent.js` - Lógica de IA com DeepSeek
- ✅ `server/README_AGENT.md` - Documentação técnica
- ✅ `INSTRUCOES_USO.md` - Este arquivo

### Arquivos Modificados:
- ✅ `client/js/home.js` - Nova função com IA, antiga comentada
- ✅ `server/package.json` - Scripts e dependência axios
- ✅ `server/.env` - Chave do DeepSeek (já estava)

### Arquivos NÃO Modificados:
- ✅ `project.js` - Continua funcionando normalmente
- ✅ `main.js` - Sem alterações
- ✅ `serverOperacional.js` - Sem alterações

---

## 🐛 Troubleshooting

### Erro: "Erro ao conectar com o serviço de IA"
**Solução**: Verifique se o agentServer está rodando:
```bash
cd server
node agentServer.js
```

### Erro: "DEEPSEEK_API_KEY não está configurada"
**Solução**: Verifique o arquivo `server/.env`:
```
DEEPSEEK_API_KEY=sk-0b7ff25f3e6b4e38886bdcd134b550ad
```

### Modal não abre ao clicar em "Criar Projeto"
**Solução**: 
1. Abra o DevTools (F12)
2. Verifique o console por erros
3. Confirme que `home.js` está carregado

### Projeto criado mas não aparece na tela
**Solução**: Atualize a página (F5)

---

## 📝 Exemplo de Uso Completo

1. **Iniciar Servidores**:
   ```bash
   # Terminal 1
   cd server && node serverOperacional.js
   
   # Terminal 2  
   cd server && node agentServer.js
   ```

2. **Abrir Aplicação**:
   ```
   http://localhost:3000/html/home.html
   ```

3. **Criar Projeto**:
   - Clique em "Criar Projeto"
   - Cole esta descrição:
   ```
   Análise das aplicações da biomedicina molecular no diagnóstico 
   de doenças genéticas raras. Trabalho de 20 páginas com estudos 
   de caso, metodologia quantitativa e revisão bibliográfica de 
   artigos dos últimos 5 anos. Prazo: 1 mês.
   ```
   - Enviar e aguardar

4. **Resultado Esperado**:
   - Título: "Aplicações da Biomedicina Molecular no Diagnóstico de Doenças Genéticas Raras"
   - Descrição: Resumo profissional gerado pela IA
   - Estrutura: Introdução, Metodologia, Estudos de Caso, Discussão, Conclusão
   - Estimativa: ~20 páginas, 4 semanas

---

## 🎓 Dicas para Melhores Resultados

### ✅ Descrições Detalhadas Funcionam Melhor:
- Mencione o tema principal
- Especifique páginas/tamanho esperado
- Inclua requisitos do professor
- Cite metodologia se relevante
- Mencione prazos

### ❌ Evite Descrições Muito Curtas:
- ❌ "Trabalho sobre IA"
- ✅ "Trabalho de 15 páginas sobre aplicações de IA na medicina, focando em diagnósticos precoces, com estudos de caso e análise crítica"

---

## 🚀 Próximos Passos

Agora você pode:
1. ✅ Criar projetos com IA
2. ✅ Ver projetos na home
3. ✅ Clicar em um projeto para ver detalhes
4. ✅ Deletar projetos

**Em Desenvolvimento**:
- 🔄 Editar estrutura do projeto
- 🔄 Adicionar participantes reais
- 🔄 Sistema de documentos
- 🔄 Editor colaborativo

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do servidor (terminal)
2. Abra DevTools (F12) e verifique o console
3. Confirme que ambos os servidores estão rodando
4. Teste o health check: `http://localhost:3001/health`

**Status Atual**: ✅ Sistema funcionando e pronto para uso!
