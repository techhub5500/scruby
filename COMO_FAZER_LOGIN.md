# 🔐 Como Fazer Login para Testar o Sistema de Colaboração

## ⚡ Solução Rápida (Recomendada)

**Se você já tem um usuário no banco de dados, use esta solução rápida:**

1. **Abra o console do navegador** (F12) na página `home.html`

2. **Cole e execute este código:**

```javascript
// Substitua com SEU ID real do MongoDB
const mockUser = {
    _id: "677434f8dbe2515e3ca75682",  // ⚠️ SUBSTITUA COM SEU ID!
    username: "seu_username",
    fullName: "Seu Nome Completo",
    email: "seu@email.com"
};

// Salvar no localStorage
localStorage.setItem('scruby_user', JSON.stringify(mockUser));
console.log('✅ Usuário configurado:', mockUser.fullName);

// Recarregar
location.reload();
```

3. **Como encontrar seu ID:**
   - Abra MongoDB Compass
   - Collection `users` → Copie o `_id`
   - OU via terminal: `mongosh` → `use scruby` → `db.users.findOne()`

---

## Problema Identificado

O sistema de colaboração precisa que o usuário esteja **autenticado** para funcionar corretamente. Sem autenticação, os convites não podem ser enviados.

## Solução: Fazer Login

### Opção 1: Usar a Página de Login (Recomendado)

1. **Acesse a página de login:**
   ```
   http://127.0.0.1:3000/html/index.html
   ```
   
   **Importante:** Use exatamente esta URL, não outras variações!

2. **Faça login com suas credenciais**
   - Se não tiver conta, registre-se primeiro

3. **Após login bem-sucedido:**
   - O sistema salva o token e dados do usuário no localStorage
   - Chave: `scruby_user`
   - Você será redirecionado para home.html

4. **Agora você pode:**
   - Criar projetos
   - Adicionar colaboradores
   - Enviar convites ✅

---

### Opção 2: Login Temporário via Console (Para Testes Rápidos)

Se você só quer testar rapidamente e já tem um usuário no banco:

1. **Abra o console do navegador** (F12)

2. **Cole este código:**

```javascript
// ATENÇÃO: Substitua com seus dados reais do MongoDB
const mockUser = {
    _id: "SEU_USER_ID_AQUI",  // ID do MongoDB
    username: "seu_username",
    fullName: "Seu Nome Completo",
    email: "seu@email.com"
};

// Salvar no localStorage
localStorage.setItem('scruby_user', JSON.stringify(mockUser));
console.log('✅ Usuário logado temporariamente:', mockUser.fullName);

// Recarregar a página
location.reload();
```

3. **Como obter seu User ID do MongoDB:**

**Via MongoDB Compass:**
- Abra MongoDB Compass
- Conecte ao banco
- Vá para a collection `users`
- Copie o `_id` do seu usuário

**Via MongoDB Shell:**
```bash
mongosh
use scruby
db.users.findOne({ username: "seu_username" })
```

**Via Console (se já estiver registrado):**
```javascript
// Se você já fez registro mas não está logado
// Você pode buscar via API
fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        username: "seu_username",
        password: "sua_senha"
    })
})
.then(r => r.json())
.then(data => {
    if (data.token) {
        localStorage.setItem('scruby_auth_token', data.token);
        localStorage.setItem('scruby_user', JSON.stringify(data.user));
        console.log('✅ Login bem-sucedido!');
        location.reload();
    }
});
```

---

### Opção 3: Registrar Novo Usuário

1. **Acesse a página de registro**
2. **Preencha o formulário:**
   - Username (único)
   - Nome completo
   - Email
   - Senha

3. **Após registro:**
   - Você será automaticamente logado
   - Redirecionado para home.html

---

## Verificar se Está Logado

**No console do navegador (F12):**

```javascript
// Verificar dados do usuário
const user = JSON.parse(localStorage.getItem('scruby_user'));
console.log('Usuário logado:', user);

// Verificar se tem _id (obrigatório!)
if (user && user._id) {
    console.log('✅ AUTENTICADO! ID:', user._id);
} else {
    console.log('❌ NÃO AUTENTICADO!');
}
```

**Resultado esperado se LOGADO:**
```javascript
✅ AUTENTICADO! ID: 677434f8dbe2515e3ca75682
Usuário logado: {
    _id: "677434f8dbe2515e3ca75682",
    username: "joao",
    fullName: "João Silva",
    email: "joao@example.com"
}
```

**Resultado se NÃO logado:**
```javascript
❌ NÃO AUTENTICADO!
Usuário logado: null
```

---

## Fluxo Completo para Testar Colaboração

### Passo 1: Criar Dois Usuários

**Usuário A (Criador):**
1. Registre-se com username: `joao`
2. Após login, copie o ID:
```javascript
const user = JSON.parse(localStorage.getItem('scruby_user'));
console.log('Meu ID:', user._id);
// Copie este ID!
```

**Usuário B (Colaborador):**
1. Abra aba anônima ou outro navegador
2. Registre-se com username: `maria`
3. Copie o ID do mesmo modo

### Passo 2: Criar Projeto com Colaborador

**Como Usuário A:**
1. Vá para home.html
2. Clique em "Criar Novo Projeto"
3. Na seção "Adicionar Colaboradores":
   - Cole o **ID do Usuário B**
   - Clique "Buscar"
   - Clique "Adicionar"
4. Descreva o projeto
5. Envie
6. ✅ Convites serão enviados!

**Console deve mostrar:**
```
📨 Enviando 1 convites...
👤 Usuário atual: João Silva (ID: 6773...)
✅ Convite enviado para Maria Santos
✅ Todos os convites foram processados
```

### Passo 3: Aceitar Convite

**Como Usuário B:**
1. Veja o sino com badge vermelho
2. Clique no sino
3. Veja o convite
4. Clique "Aceitar"
5. Projeto aparece na lista ✅

---

## Troubleshooting

### ❌ "Usuário não autenticado"

**Causa:** Você não está logado

**Solução:**
1. Faça login na página de autenticação
2. OU use o login temporário via console (Opção 2)
3. Verifique com: `localStorage.getItem('scruby_user')`

### ❌ "Convites não enviados"

**Causa:** `_id` não existe no objeto do usuário

**Solução:**
1. Verifique se o usuário tem `_id`:
```javascript
const user = JSON.parse(localStorage.getItem('scruby_user'));
console.log('Tem _id?', !!user._id);
```
2. Se não tiver, faça login novamente pela página oficial

### ❌ "localStorage vazio"

**Causa:** Cookies/localStorage foram limpos

**Solução:** Faça login novamente

---

## Estrutura Correta do Usuário no localStorage

```javascript
{
    "_id": "677383ce3a1b2c4d5e6f7890",  // ✅ Obrigatório!
    "username": "joao",
    "fullName": "João Silva",
    "email": "joao@example.com",
    "createdAt": "2025-12-31T10:00:00.000Z"
}
```

**Campos obrigatórios:**
- ✅ `_id` - ID do MongoDB
- ✅ `username` - Nome de usuário
- ⚠️ `fullName` - Recomendado (fallback para username)

---

## Próximos Passos

Depois de fazer login e testar:

1. ✅ Sistema de colaboração funcionará perfeitamente
2. ✅ Convites serão enviados
3. ✅ Notificações aparecerão
4. ✅ Projetos compartilhados serão carregados

**Tudo pronto para uso!** 🎉
