# 🆔 Como Obter IDs de Usuários para Teste

## Opção 1: Via Console do Navegador (Mais Fácil)

### Passo a Passo

1. **Faça login no Scruby**
2. **Abra o Console** (F12 ou Ctrl+Shift+I)
3. **Cole este código:**

```javascript
// Ver seu próprio ID
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
console.log('🆔 Meu ID:', currentUser._id);
console.log('👤 Meu Nome:', currentUser.fullName);
console.log('📧 Meu Email:', currentUser.email);

// Copiar ID para clipboard
navigator.clipboard.writeText(currentUser._id);
console.log('✅ ID copiado para o clipboard!');
```

4. **Cole para enviar a alguém via WhatsApp/Email**

---

## Opção 2: Via MongoDB Compass (Visual)

### Passo a Passo

1. **Abra MongoDB Compass**
2. **Conecte ao seu banco de dados**
3. **Selecione o database** (geralmente `scruby` ou `test`)
4. **Clique na collection `users`**
5. **Veja a lista de usuários**
6. **Copie o campo `_id`**

Exemplo:
```json
{
  "_id": "677383ce3a1b2c4d5e6f7890",
  "username": "maria",
  "fullName": "Maria Santos",
  "email": "maria@example.com"
}
```

---

## Opção 3: Via MongoDB Shell (Terminal)

### Listar Todos os Usuários

```bash
# Conectar ao MongoDB
mongosh

# Usar o database
use scruby

# Listar todos os usuários
db.users.find().pretty()
```

### Buscar Usuário Específico

```bash
# Por username
db.users.findOne({ username: "maria" })

# Por email
db.users.findOne({ email: "maria@example.com" })

# Por nome
db.users.findOne({ fullName: /maria/i })
```

### Copiar Apenas o ID

```bash
# Pegar apenas o _id
db.users.findOne({ username: "maria" })._id
```

---

## Opção 4: Via API (Avançado)

### Criar Endpoint de Consulta Temporário

No `agentServer.js`, adicione:

```javascript
// ENDPOINT TEMPORÁRIO PARA TESTES
app.get('/api/test/users', async (req, res) => {
    try {
        const users = await User.find().select('_id username fullName email');
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

Depois acesse: `http://localhost:3001/api/test/users`

---

## Opção 5: Adicionar Display de ID na Interface

### Modificar a Interface para Mostrar o ID

No `home.html`, adicione ao header:

```html
<div class="header-right">
    <span class="user-display-name" id="user-display-name"></span>
    <span class="user-id-display" id="user-id-display" 
          style="font-size: 0.75rem; color: #999; cursor: pointer;" 
          title="Clique para copiar">
        ID: <span id="user-id-text">...</span>
    </span>
    <!-- resto do header -->
</div>
```

No `home.js`, adicione:

```javascript
// Mostrar ID do usuário no header
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('user-id-text').textContent = currentUser._id;
        
        // Copiar ao clicar
        document.getElementById('user-id-display').addEventListener('click', () => {
            navigator.clipboard.writeText(currentUser._id);
            alert('ID copiado: ' + currentUser._id);
        });
    }
});
```

---

## 🧪 Cenário de Teste Completo

### Preparar 2 Usuários

#### Usuário A (Criador)
1. Registre com:
   - Nome: "João Silva"
   - Email: "joao@test.com"
   - Username: "joao"
   - Senha: "123456"

2. Copie o ID:
```javascript
// No console
JSON.parse(localStorage.getItem('currentUser'))._id
// Resultado: "677383ce3a1b2c4d5e6f7890"
```

#### Usuário B (Colaborador)
1. Em aba anônima/outro navegador, registre:
   - Nome: "Maria Santos"
   - Email: "maria@test.com"
   - Username: "maria"
   - Senha: "123456"

2. Copie o ID:
```javascript
// No console
JSON.parse(localStorage.getItem('currentUser'))._id
// Resultado: "677383cf3b2c3d4e5f6a7b91"
```

### Executar Teste

**Como João:**
1. Criar novo projeto
2. Adicionar Maria usando o ID: `677383cf3b2c3d4e5f6a7b91`
3. Enviar projeto

**Como Maria:**
1. Ver notificação (badge vermelho)
2. Aceitar convite
3. Ver projeto na lista

---

## 💡 Dicas

### Criar Arquivo de IDs de Teste

Crie um arquivo `test-users.json`:

```json
{
  "users": [
    {
      "name": "João Silva",
      "username": "joao",
      "email": "joao@test.com",
      "id": "677383ce3a1b2c4d5e6f7890"
    },
    {
      "name": "Maria Santos",
      "username": "maria",
      "email": "maria@test.com",
      "id": "677383cf3b2c3d4e5f6a7b91"
    },
    {
      "name": "Pedro Costa",
      "username": "pedro",
      "email": "pedro@test.com",
      "id": "677383d03c3d4e5f6a7b8c92"
    }
  ]
}
```

### Comando Rápido para Ver Todos os IDs

```javascript
// No console do navegador
fetch('http://localhost:3001/api/test/users')
  .then(r => r.json())
  .then(data => {
    console.table(data.users);
    console.log('IDs:');
    data.users.forEach(u => {
      console.log(`${u.fullName}: ${u._id}`);
    });
  });
```

---

## ⚠️ Importante

### Em Produção

- **NÃO** exponha IDs publicamente
- Use sistema de busca por nome/email
- Implemente sistema de amigos/contatos
- Adicione privacidade e permissões

### Para Testes

- IDs são essenciais para testar colaboração
- Use ambiente de desenvolvimento separado
- Crie usuários dummy para testes
- Documente os IDs de teste

---

## 🎯 Quick Start para Teste

```bash
# 1. Registre 2 usuários no navegador
# 2. No console do usuário A:
console.log('Meu ID:', JSON.parse(localStorage.getItem('currentUser'))._id);

# 3. No console do usuário B:
console.log('Meu ID:', JSON.parse(localStorage.getItem('currentUser'))._id);

# 4. Como usuário A, copie o ID do usuário B
# 5. Crie projeto e adicione o ID do usuário B
# 6. Como usuário B, aceite o convite
```

**Pronto! Sistema de colaboração testado com sucesso!** ✅
