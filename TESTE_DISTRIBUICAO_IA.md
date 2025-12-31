# 🧪 Guia de Teste - Distribuição Inteligente de Tarefas

## 🎯 Objetivo do Teste

Validar que a IA está estruturando projetos corretamente e distribuindo tarefas de forma equilibrada entre os participantes.

## 📋 Pré-requisitos

1. ✅ Servidor backend rodando (`node server/agentServer.js`)
2. ✅ Servidor frontend rodando (`node server/serverOperacional.js`)
3. ✅ Pelo menos 3 usuários cadastrados no sistema
4. ✅ Chave da API DeepSeek configurada no `.env`

## 🔄 Passo a Passo do Teste

### Teste 1: Projeto com 3 Participantes

1. **Login** com usuário principal
2. **Ir para Home** e clicar em "Criar Novo Projeto"
3. **Adicionar 2 colaboradores** via busca por ID
4. **Descrever o projeto**:
   ```
   Desenvolvimento de um sistema web de e-commerce para venda de livros acadêmicos. 
   O sistema deve incluir: cadastro de usuários, catálogo de produtos, carrinho de compras, 
   sistema de pagamento, área administrativa, relatórios de vendas e sistema de avaliações.
   Requisitos: frontend responsivo, backend em Node.js, banco de dados MongoDB, 
   autenticação JWT. Prazo: 10 semanas. O projeto deve seguir padrões acadêmicos 
   e incluir documentação completa.
   ```
5. **Enviar** e aguardar processamento
6. **Verificar** se projeto foi criado
7. **Abrir projeto** e analisar estrutura

#### ✅ Validações Esperadas:
- [ ] Título gerado é coerente com a descrição
- [ ] Descrição resumida está clara
- [ ] Estrutura tem entre 3 e 5 categorias principais
- [ ] **Cada categoria está atribuída a um participante diferente**
- [ ] Cada categoria tem entre 2 e 6 subcategorias
- [ ] Distribuição parece equilibrada (ninguém com muito mais/menos tarefas)
- [ ] Há explicação sobre a distribuição de carga
- [ ] Interface exibe tudo corretamente com cores e badges

### Teste 2: Projeto com 4 Participantes

1. **Criar novo projeto** com 3 colaboradores (total: 4 pessoas)
2. **Descrever projeto acadêmico complexo**:
   ```
   Pesquisa sobre impacto da inteligência artificial na educação brasileira. 
   Incluir: revisão sistemática de literatura, análise de dados de 500 instituições, 
   desenvolvimento de framework de avaliação, estudo de caso em 5 universidades, 
   análise estatística avançada, proposta de políticas públicas. 
   Metodologia mista (qualitativa e quantitativa). 80 páginas. Prazo: 16 semanas.
   ```

#### ✅ Validações Esperadas:
- [ ] Estrutura tem 4-6 categorias (proporcional ao número de pessoas)
- [ ] **Cada participante aparece como responsável por pelo menos uma categoria**
- [ ] Distribuição leva em conta complexidade (categorias de pesquisa vs implementação)
- [ ] Subcategorias são detalhadas e específicas
- [ ] Prazo e páginas estimadas são razoáveis

### Teste 3: Projeto Solo (1 Participante)

1. **Criar projeto SEM adicionar colaboradores**
2. **Descrever projeto simples**:
   ```
   Análise comparativa de frameworks JavaScript modernos. 
   Focar em React, Vue e Angular. Incluir exemplos práticos 
   e análise de performance. 25 páginas. Prazo: 4 semanas.
   ```

#### ✅ Validações Esperadas:
- [ ] Estrutura tem 3-5 categorias
- [ ] **Todas as categorias atribuídas ao criador**
- [ ] Estrutura é simplificada mas completa
- [ ] Prazo e tamanho condizem com projeto individual

## 🐛 Problemas Comuns e Soluções

### Problema: "Erro ao processar projeto com IA"
**Solução**: Verificar se DEEPSEEK_API_KEY está configurada corretamente no `.env`

### Problema: Participantes não aparecem nas categorias
**Solução**: Verificar console do navegador e do servidor para erros

### Problema: Estrutura não aparece na página do projeto
**Solução**: 
1. Abrir DevTools (F12)
2. Verificar se `currentProject.structure.categories` existe
3. Verificar console por erros de JavaScript

### Problema: Distribuição desigual (uma pessoa com muitas tarefas)
**Solução**: Reportar descrição do projeto e resultado obtido para ajustar prompt da IA

## 📊 Checklist Final

Após todos os testes, validar:

- [ ] IA gera títulos coerentes e profissionais
- [ ] Descrições resumidas são claras e objetivas
- [ ] Estrutura de categorias é lógica e bem organizada
- [ ] **Distribuição é equilibrada (princípio chave)**
- [ ] Cada participante tem responsabilidades claras
- [ ] Subcategorias são específicas e acionáveis
- [ ] Interface visual é clara e informativa
- [ ] Cores ajudam na identificação de categorias
- [ ] Badges de responsáveis são visíveis
- [ ] Informações extras (páginas, prazo) são razoáveis

## 🎨 Exemplo Visual Esperado

Na página do projeto, você deve ver algo como:

```
┌─────────────────────────────────────────┐
│ 📌 Pesquisa e Fundamentação Teórica     │
│ 👤 João                                  │
├─────────────────────────────────────────┤
│ Subcategorias (4):                       │
│ • Revisão de literatura                  │
│ • Marco teórico                          │
│ • Metodologia                            │
│ • Estado da arte                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 📌 Desenvolvimento Técnico               │
│ 👤 Maria                                 │
├─────────────────────────────────────────┤
│ Subcategorias (5):                       │
│ • Arquitetura                            │
│ • Frontend                               │
│ • Backend                                │
│ • Banco de dados                         │
│ • Testes                                 │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 📌 Análise e Documentação                │
│ 👤 Marcos                                │
├─────────────────────────────────────────┤
│ Subcategorias (3):                       │
│ • Coleta de dados                        │
│ • Análise de resultados                  │
│ • Conclusões e relatório                 │
└─────────────────────────────────────────┘
```

## 📞 Suporte

Se encontrar problemas:
1. Verificar logs do servidor (console onde rodou `node agentServer.js`)
2. Verificar logs do navegador (F12 → Console)
3. Consultar arquivo `ESTRUTURACAO_INTELIGENTE.md` para detalhes técnicos

---

**Lembre-se**: O objetivo é garantir que **ninguém seja sobrecarregado ou subutilizado** ✨
