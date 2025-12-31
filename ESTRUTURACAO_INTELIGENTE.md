# 🤖 Sistema de Estruturação Inteligente de Projetos

## 📋 Visão Geral

O sistema agora utiliza IA (DeepSeek) para estruturar projetos academicamente de forma inteligente, considerando o número de participantes e distribuindo as tarefas de maneira equilibrada.

## ✨ Funcionalidades Implementadas

### 1. **Análise de Participantes**
- A IA recebe informações sobre todos os participantes do projeto
- Considera o número total de membros para dimensionar a estrutura
- Identifica cada participante pelo nome e role (Criador/Colaborador)

### 2. **Estruturação em Categorias e Subcategorias**
- O projeto é dividido em **categorias principais** (macrotarefas)
- Cada categoria contém múltiplas **subcategorias** (tarefas específicas)
- Número de categorias: entre `max(3, n_participantes)` e `max(5, n_participantes + 2)`
- Cada categoria tem entre 2 e 6 subcategorias

### 3. **Distribuição Equilibrada**
A IA segue princípios rigorosos de distribuição:

✅ **Ninguém sobrecarregado**: Cada participante recebe carga de trabalho proporcional
✅ **Ninguém subutilizado**: Todos têm responsabilidades significativas
✅ **Complexidade balanceada**: Tarefas distribuídas considerando dificuldade
✅ **Atribuição específica**: Cada categoria é atribuída a um participante pelo nome

### 4. **Visualização no Frontend**
- Interface visual mostrando toda a estrutura do projeto
- Cada categoria aparece com:
  - Nome e descrição da categoria
  - Responsável atribuído (destacado com badge)
  - Lista de subcategorias
  - Cores diferentes para fácil identificação
- Informações adicionais:
  - Páginas estimadas
  - Prazo sugerido
  - Explicação da distribuição de carga

## 🔄 Fluxo de Funcionamento

```
1. Usuário descreve o projeto e adiciona colaboradores
   ↓
2. Frontend (home.js) envia para API:
   - Descrição do projeto
   - Número de participantes
   - Lista de participantes (nome, id, role)
   ↓
3. Backend (agentServer.js) recebe e processa
   ↓
4. Agente IA (agent.js) estrutura o projeto:
   - Gera título e descrição
   - Cria categorias equilibradas
   - Distribui categorias entre participantes
   - Define subcategorias para cada categoria
   ↓
5. Projeto criado com estrutura completa
   ↓
6. Frontend (project.js) exibe:
   - Estrutura visual organizada
   - Atribuições claras por participante
   - Subcategorias detalhadas
```

## 📊 Exemplo de Estrutura Gerada

Para um projeto com **3 participantes** (João, Maria, Marcos):

```json
{
  "title": "Sistema de Gestão Acadêmica",
  "description": "Desenvolvimento de sistema web para gestão de notas e frequência",
  "structure": {
    "categories": [
      {
        "name": "Pesquisa e Fundamentação Teórica",
        "assignedTo": "João",
        "description": "Levantamento bibliográfico e marco teórico",
        "subcategories": [
          {"name": "Revisão de literatura", "description": "..."},
          {"name": "Marco teórico", "description": "..."},
          {"name": "Metodologia de pesquisa", "description": "..."},
          {"name": "Estado da arte", "description": "..."}
        ]
      },
      {
        "name": "Desenvolvimento e Implementação",
        "assignedTo": "Maria",
        "description": "Codificação e testes do sistema",
        "subcategories": [
          {"name": "Arquitetura do sistema", "description": "..."},
          {"name": "Frontend", "description": "..."},
          {"name": "Backend", "description": "..."},
          {"name": "Banco de dados", "description": "..."},
          {"name": "Testes", "description": "..."}
        ]
      },
      {
        "name": "Análise de Resultados e Documentação",
        "assignedTo": "Marcos",
        "description": "Análise, conclusões e documentação final",
        "subcategories": [
          {"name": "Coleta de dados", "description": "..."},
          {"name": "Análise estatística", "description": "..."},
          {"name": "Conclusões", "description": "..."}
        ]
      }
    ],
    "estimatedPages": 45,
    "suggestedDeadline": "8 semanas",
    "workloadDistribution": "João: 4 tarefas (pesquisa); Maria: 5 tarefas (desenvolvimento); Marcos: 3 tarefas (análise)"
  }
}
```

## 🎨 Visualização no Frontend

Cada categoria é exibida com:
- **Cor específica** para fácil identificação
- **Badge do responsável** em destaque
- **Lista de subcategorias** organizada
- **Descrições** de cada item

## 📁 Arquivos Modificados

### 1. **client/js/home.js**
- `sendModalMessage()`: Envia participantes para a API
- Coleta informações de todos colaboradores selecionados
- Passa lista completa para processamento

### 2. **server/agentServer.js**
- Rota `/api/agent/process-project`: Recebe participantes
- Schema do MongoDB: Atualizado com nova estrutura de categories
- Salva participantes com userId para tracking

### 3. **server/agent.js**
- `processProjectWithAI()`: Nova assinatura com participantes
- Prompt aprimorado com instruções de distribuição equilibrada
- Sistema de validação de carga de trabalho

### 4. **client/js/project.js**
- `renderProjectStructure()`: Nova função para exibir estrutura
- `getCategoryColor()`: Sistema de cores para categorias
- Interface visual completa com todas as informações

## 🚀 Como Testar

1. **Criar novo projeto** na página home
2. **Adicionar colaboradores** (pelo menos 2-3)
3. **Descrever o projeto** detalhadamente
4. **Aguardar processamento** da IA
5. **Abrir o projeto** criado
6. **Visualizar** a estrutura com categorias e atribuições

## 💡 Princípios da Distribuição

A IA segue estes princípios ao distribuir tarefas:

1. **Equilíbrio quantitativo**: Número similar de subcategorias por pessoa
2. **Equilíbrio qualitativo**: Complexidade distribuída proporcionalmente
3. **Coerência temática**: Categorias relacionadas ao mesmo responsável
4. **Clareza de responsabilidades**: Cada categoria tem um único responsável
5. **Rastreabilidade**: Cada participante sabe exatamente suas tarefas

## 🎯 Benefícios

✅ **Organização automática** do trabalho acadêmico
✅ **Distribuição justa** de responsabilidades
✅ **Clareza** sobre quem faz o quê
✅ **Visão completa** da estrutura do projeto
✅ **Economia de tempo** no planejamento
✅ **Redução de conflitos** sobre divisão de tarefas

## 🔮 Próximas Melhorias Possíveis

- [ ] Permitir reatribuição manual de categorias
- [ ] Sistema de progresso por categoria/subcategoria
- [ ] Notificações quando uma categoria é concluída
- [ ] Relatórios de carga de trabalho individual
- [ ] Timeline automática baseada na estrutura
- [ ] Sugestões de dependências entre categorias

---

**Data de Implementação**: 31 de Dezembro de 2025
**Status**: ✅ Implementado e funcional
