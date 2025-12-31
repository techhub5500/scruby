// ===========================
// SCRIPT DE LOGIN TEMPORÁRIO
// ===========================
// Cole este script no console do navegador (F12) para fazer login temporário

console.log('🔐 SCRIPT DE LOGIN TEMPORÁRIO');
console.log('============================\n');

// PASSO 1: Configure seu usuário aqui
const mockUser = {
    _id: "677434f8dbe2515e3ca75682",  // ⚠️ SUBSTITUA COM SEU ID DO MONGODB!
    username: "joao",                   // Seu username
    fullName: "João Silva",            // Seu nome completo
    email: "joao@example.com"          // Seu email
};

console.log('📝 Configurando usuário:', mockUser.fullName);
console.log('🆔 ID:', mockUser._id);

// PASSO 2: Salvar no localStorage
try {
    localStorage.setItem('scruby_user', JSON.stringify(mockUser));
    console.log('✅ Usuário salvo no localStorage!');
    
    // Verificar
    const saved = JSON.parse(localStorage.getItem('scruby_user'));
    console.log('🔍 Verificação:', saved);
    
    if (saved && saved._id) {
        console.log('✅ LOGIN TEMPORÁRIO BEM-SUCEDIDO!');
        console.log('🔄 Recarregando página...');
        setTimeout(() => location.reload(), 1000);
    } else {
        console.error('❌ Erro: Dados não foram salvos corretamente');
    }
} catch (error) {
    console.error('❌ Erro ao salvar:', error);
}

// ===========================
// COMO USAR:
// ===========================
// 1. Substitua o _id com seu ID real do MongoDB
// 2. Cole todo este código no console
// 3. Pressione Enter
// 4. A página recarregará automaticamente
// 5. Agora você está "logado"!

// ===========================
// COMO OBTER SEU ID:
// ===========================
// Via MongoDB Compass:
//   - Abra Compass
//   - Collection "users"
//   - Copie o campo "_id"
//
// Via MongoDB Shell:
//   mongosh
//   use scruby
//   db.users.findOne({ username: "seu_username" })
//
// Via API (se já registrado):
//   Use a Opção 2 do documento COMO_FAZER_LOGIN.md
