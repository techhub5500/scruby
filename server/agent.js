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
 * @param {number} participantCount - Número total de participantes
 * @param {Array} participants - Lista de participantes com nome e role
 * @returns {Promise<{title: string, description: string, structure: object}>}
 */
async function processProjectWithAI(projectDescription, participantCount = 1, participants = []) {
    try {
        console.log('🤖 Iniciando processamento com DeepSeek...');
        console.log('📝 Descrição recebida:', projectDescription.substring(0, 100) + '...');
        console.log('👥 Participantes:', participantCount);

        // Construir lista de nomes dos participantes
        const participantNames = participants.map(p => p.name).join(', ');
        const participantsInfo = participantCount > 1 
            ? `\n\nParticipantes do projeto (${participantCount} pessoas): ${participantNames}\n\nIMPORTANTE: Distribua as categorias de forma EQUILIBRADA entre todos os ${participantCount} participantes. Cada categoria deve ter um responsável específico. Garanta que ninguém fique sobrecarregado ou subutilizado.`
            : '';

        const prompt = `Você é um assistente especializado em projetos acadêmicos. ${participantsInfo}

Baseado na seguinte descrição de projeto acadêmico, gere:
1. Um título conciso e profissional (máximo 80 caracteres)
2. Uma descrição resumida e clara (máximo 200 caracteres)
3. Uma estrutura DETALHADA do trabalho dividida em CATEGORIAS e SUBCATEGORIAS
4. Atribuição de cada CATEGORIA a um participante específico

Descrição do usuário:
"${projectDescription}"

PRINCÍPIOS PARA DISTRIBUIÇÃO:
- Divida o trabalho em ${Math.max(3, participantCount)} a ${Math.max(5, participantCount + 2)} categorias principais
- Cada categoria deve ter entre 2 e 6 subcategorias
- Distribua as categorias de forma EQUILIBRADA (ninguém sobrecarregado ou subutilizado)
- Considere a complexidade e carga de trabalho de cada categoria
- Cada categoria deve ser atribuída a um participante específico pelo nome

Responda APENAS com um JSON válido no seguinte formato (sem markdown, sem \`\`\`json):
{
  "title": "título aqui",
  "description": "descrição aqui",
  "structure": {
    "categories": [
      {
        "name": "Nome da Categoria",
        "assignedTo": "${participants[0]?.name || 'Criador'}",
        "description": "descrição breve (máx 100 caracteres)",
        "subcategories": [
          {"name": "Subcategoria 1", "description": "descrição breve (máx 80 caracteres)"},
          {"name": "Subcategoria 2", "description": "descrição breve (máx 80 caracteres)"}
        ]
      }
    ],
    "estimatedPages": 10,
    "suggestedDeadline": "2 semanas",
    "workloadDistribution": "descrição concisa de como o trabalho foi distribuído (máx 150 caracteres)"
  }
}

IMPORTANTE: Mantenha descrições CONCISAS para garantir resposta completa.`;

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
                max_tokens: 3000
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
        
        // Validar estrutura mínima
        if (!result.title || !result.description || !result.structure) {
            throw new Error('Resposta da IA incompleta. Estrutura inválida.');
        }
        
        console.log('✨ Projeto processado com sucesso');
        console.log('📌 Título:', result.title);
        console.log('📝 Descrição:', result.description);
        console.log('📊 Categorias:', result.structure.categories?.length || 0);
        
        return result;

    } catch (error) {
        console.error('❌ Erro ao processar com DeepSeek:', error.message);
        
        if (error.response) {
            console.error('📛 Detalhes do erro:', error.response.data);
            throw new Error(`Erro na API DeepSeek: ${error.response.data.error?.message || 'Erro desconhecido'}`);
        } else if (error.message.includes('JSON') || error.message.includes('Unterminated')) {
            console.error('📛 Erro de parse JSON - Resposta possivelmente truncada');
            console.error('💡 Dica: Aumente max_tokens ou simplifique a descrição');
            throw new Error('Resposta da IA foi truncada. Tente uma descrição mais concisa ou aguarde e tente novamente.');
        } else if (error.message.includes('incompleta')) {
            throw error; // Re-lançar erro de validação
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
