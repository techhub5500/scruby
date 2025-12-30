// ===========================
// AGENT.JS - Agente de IA para Criação de Projetos
// ===========================

const axios = require('axios');
require('dotenv').config();

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

/**
 * Processa a descrição do projeto usando DeepSeek AI
 * @param {string} projectDescription - Descrição fornecida pelo usuário
 * @returns {Promise<{title: string, description: string, structure: object}>}
 */
async function processProjectWithAI(projectDescription) {
    try {
        console.log('🤖 Iniciando processamento com DeepSeek...');
        console.log('📝 Descrição recebida:', projectDescription.substring(0, 100) + '...');

        const prompt = `Você é um assistente especializado em projetos acadêmicos. 

Baseado na seguinte descrição de projeto acadêmico, gere:
1. Um título conciso e profissional (máximo 80 caracteres)
2. Uma descrição resumida e clara (máximo 200 caracteres)
3. Uma estrutura sugerida do trabalho

Descrição do usuário:
"${projectDescription}"

Responda APENAS com um JSON válido no seguinte formato (sem markdown, sem \`\`\`json):
{
  "title": "título aqui",
  "description": "descrição aqui",
  "structure": {
    "sections": [
      {"name": "Introdução", "description": "descrição breve"},
      {"name": "Desenvolvimento", "description": "descrição breve"},
      {"name": "Conclusão", "description": "descrição breve"}
    ],
    "estimatedPages": 10,
    "suggestedDeadline": "2 semanas"
  }
}`;

        const response = await axios.post(
            DEEPSEEK_API_URL,
            {
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: 'Você é um assistente especializado em projetos acadêmicos. Sempre responda com JSON válido, sem markdown.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
                }
            }
        );

        console.log('✅ Resposta recebida do DeepSeek');
        
        // Extrair conteúdo da resposta
        const content = response.data.choices[0].message.content.trim();
        console.log('📄 Conteúdo bruto:', content);

        // Tentar fazer parse do JSON (remover markdown se houver)
        let cleanContent = content;
        if (content.includes('```json')) {
            cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        } else if (content.includes('```')) {
            cleanContent = content.replace(/```\n?/g, '').trim();
        }

        const result = JSON.parse(cleanContent);
        
        console.log('✨ Projeto processado com sucesso');
        console.log('📌 Título:', result.title);
        console.log('📝 Descrição:', result.description);
        
        return result;

    } catch (error) {
        console.error('❌ Erro ao processar com DeepSeek:', error.message);
        
        if (error.response) {
            console.error('📛 Detalhes do erro:', error.response.data);
            throw new Error(`Erro na API DeepSeek: ${error.response.data.error?.message || 'Erro desconhecido'}`);
        } else if (error.message.includes('JSON')) {
            console.error('📛 Erro de parse JSON');
            throw new Error('Erro ao processar resposta da IA. Tente novamente.');
        } else {
            throw new Error('Erro ao conectar com o serviço de IA. Verifique sua conexão.');
        }
    }
}

/**
 * Valida se a chave da API está configurada
 */
function validateAPIKey() {
    if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY === '' || DEEPSEEK_API_KEY === 'sua_chave_aqui') {
        throw new Error('DEEPSEEK_API_KEY não está configurada no arquivo .env');
    }
    console.log('✅ Chave da API DeepSeek configurada');
}

module.exports = {
    processProjectWithAI,
    validateAPIKey
};
