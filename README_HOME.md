# Funcionalidade da Página Inicial - Scruby

## Arquivos Criados

### 1. **home.html** - Página Inicial com Cards de Projetos
- Filtros por status (Todos, Em andamento, Concluídos, Atrasados)
- Grid de cards de projetos com navegação horizontal
- Estado vazio para quando não há projetos
- Cards com informações completas: título, descrição, status, progresso, participantes e última atividade

### 2. **project.html** - Página Individual do Projeto
- Header com título, status e progresso geral
- Botões de ação: "Abrir estrutura do trabalho" e "Acessar documentos"
- Grid de participantes com informações detalhadas
- Seção de documentos (vazia por enquanto)

### 3. **home.css** - Estilos
- Design seguindo a identidade visual da plataforma
- Cores principais:
  - Azul Noite: `#1C2A39`
  - Branco Neve: `#FFFFFF`
  - Cinza Gelo: `#F2F2F2`
  - Cinza Médio: `#A6A6A6`
  - Preto Absoluto: `#000000`
- Animações suaves e hover effects
- Layout responsivo

### 4. **home.js** - Funcionalidade da Página Inicial
- Renderização dinâmica dos cards de projetos
- Sistema de filtros funcional
- Navegação horizontal com setas
- Dados mock de 5 projetos
- Gerenciamento de estado vazio

### 5. **project.js** - Funcionalidade da Página do Projeto
- Carregamento de dados do projeto via URL ou localStorage
- Renderização de participantes com progresso individual
- Navegação de volta para home
- Placeholders para funcionalidades futuras

## Funcionalidades Implementadas

### Página Inicial (home.html)
✅ **Filtros por Status**
- Todos os projetos
- Em andamento (🟢)
- Concluídos (🔵)
- Atrasados (🔴)
- Contadores dinâmicos

✅ **Cards de Projetos**
- 3 cards visíveis por vez (responsivo)
- Título e descrição
- Badge de status com emoji
- Barra de progresso
- Avatares de participantes (com "+X" para mais)
- Timestamp de última atividade
- Hover com elevação sutil
- Click em qualquer área abre o projeto

✅ **Navegação**
- Setas laterais para scroll horizontal
- Scroll suave
- Setas aparecem apenas quando necessário

✅ **Estado Vazio**
- Mensagem clara
- Botão para criar primeiro projeto
- Design convidativo

### Página do Projeto (project.html)
✅ **Header do Projeto**
- Título grande e claro
- Badge de status
- Card de progresso geral
- Botão voltar

✅ **Ações Principais**
- Botão: Abrir estrutura do trabalho (placeholder)
- Botão: Acessar documentos (placeholder)
- Hover effects modernos

✅ **Participantes**
- Grid responsivo
- Card para cada participante com:
  - Avatar com iniciais
  - Nome e papel
  - Barra de progresso individual
  - Última atividade
- Contador de participantes

✅ **Documentos**
- Seção preparada (vazia conforme solicitado)
- Estado vazio com ícone e mensagem

## Como Usar

1. **Acessar a Página Inicial:**
   - Clique no ícone de home 🏠 na sidebar esquerda
   - Será redirecionado para `home.html`

2. **Filtrar Projetos:**
   - Clique nos chips de filtro no topo
   - Os cards são filtrados automaticamente
   - Contadores são atualizados

3. **Navegar pelos Projetos:**
   - Use as setas laterais ← → para scroll horizontal
   - Ou arraste/scroll naturalmente

4. **Abrir um Projeto:**
   - Clique em qualquer área do card
   - Será redirecionado para `project.html` com os dados do projeto

5. **Voltar para Home:**
   - Clique no botão "← Voltar"
   - Ou clique no ícone de home na sidebar

## Dados Mock

O sistema inclui 5 projetos de exemplo:
1. Aplicações Clínicas da Biomedicina Molecular (65%)
2. Inteligência Artificial na Medicina (42%)
3. Sustentabilidade em Projetos Urbanos (100% - Concluído)
4. Narrativas Contemporâneas na Literatura (28% - Atrasado)
5. Blockchain e Criptomoedas (55%)

## Próximos Passos (Futuras Implementações)

- [ ] Integração com backend real
- [ ] Modal para criar novo projeto
- [ ] Edição de projetos existentes
- [ ] Sistema de busca funcional
- [ ] Upload e gestão de documentos
- [ ] Estrutura do trabalho (outline/sumário)
- [ ] Notificações de atividade
- [ ] Convite de participantes
- [ ] Gestão de permissões

## Identidade Visual

O design segue a paleta de cores da plataforma:
- **Azul Noite (#1C2A39)**: Botões primários, textos principais
- **Branco Neve (#FFFFFF)**: Backgrounds principais
- **Cinza Gelo (#F2F2F2)**: Backgrounds secundários
- **Cinza Médio (#A6A6A6)**: Textos secundários, bordas
- **Preto Absoluto (#000000)**: Estados hover, ênfase

Fonte: **Poppins** (400, 600, 700)

## Observações Técnicas

- Layout responsivo (mobile, tablet, desktop)
- Animações suaves (0.2s - 0.3s ease)
- Estados vazios bem definidos
- Código modular e comentado
- localStorage para persistência temporária
- URL params para compartilhamento de projetos
