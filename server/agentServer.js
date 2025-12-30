// ===========================
// AGENT SERVER - Servidor Dedicado ao Agente de IA
// ===========================

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const { processProjectWithAI, validateAPIKey } = require('./agent');

const app = express();
const PORT = process.env.PORT || 3001;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

// Middleware
app.use(cors());
app.use(express.json());

// Validar chave da API na inicialização
try {
    validateAPIKey();
} catch (error) {
    console.error('⚠️ AVISO:', error.message);
}

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
if (mongoURI) {
    mongoose.connect(mongoURI)
        .then(() => console.log('✅ Conectado ao MongoDB'))
        .catch(err => console.error('❌ Erro ao conectar no MongoDB:', err.message));
} else {
    console.warn('⚠️ MONGO_URI não configurado. Servidor funcionará sem banco de dados.');
}

// Schema para projetos
const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    fullDescription: { type: String },
    status: { type: String, default: 'in-progress' },
    progress: { type: Number, default: 0 },
    participants: [{
        name: String,
        initials: String,
        role: String,
        progress: Number
    }],
    structure: {
        sections: [{
            name: String,
            description: String
        }],
        estimatedPages: Number,
        suggestedDeadline: String
    },
    createdAt: { type: Date, default: Date.now },
    lastActivity: String
});

const Project = mongoose.model('Project', projectSchema);

// ===========================
// ROTAS
// ===========================

// Rota de health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Agent Server está rodando',
        timestamp: new Date().toISOString()
    });
});

// Rota para processar descrição do projeto com IA
app.post('/api/agent/process-project', async (req, res) => {
    try {
        const { description } = req.body;

        if (!description || description.trim() === '') {
            return res.status(400).json({ 
                error: 'Descrição do projeto é obrigatória' 
            });
        }

        console.log('\n🚀 Nova requisição de processamento de projeto');
        console.log('📝 Descrição:', description.substring(0, 100) + '...');

        // Processar com IA
        const aiResult = await processProjectWithAI(description);

        // Criar objeto do projeto
        const projectData = {
            title: aiResult.title,
            description: aiResult.description,
            fullDescription: description,
            status: 'in-progress',
            progress: 5,
            participants: [
                { 
                    name: 'Você', 
                    initials: 'VC',
                    role: 'Criador do Projeto',
                    progress: 5
                }
            ],
            structure: aiResult.structure,
            lastActivity: 'agora',
            createdAt: new Date()
        };

        // Salvar no MongoDB se conectado
        if (mongoose.connection.readyState === 1) {
            const newProject = new Project(projectData);
            const savedProject = await newProject.save();
            console.log('💾 Projeto salvo no MongoDB com ID:', savedProject._id);
            
            res.json({
                success: true,
                project: {
                    id: savedProject._id,
                    ...projectData
                },
                message: 'Projeto criado com sucesso!'
            });
        } else {
            // Retornar sem salvar no banco
            console.log('⚠️ Projeto criado mas não foi salvo (MongoDB não conectado)');
            res.json({
                success: true,
                project: {
                    id: Date.now(),
                    ...projectData
                },
                message: 'Projeto criado com sucesso! (Não persistido)'
            });
        }

    } catch (error) {
        console.error('❌ Erro ao processar projeto:', error.message);
        res.status(500).json({ 
            error: error.message || 'Erro ao processar projeto com IA'
        });
    }
});

// Rota para listar todos os projetos
app.get('/api/agent/projects', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ 
                error: 'Banco de dados não conectado' 
            });
        }

        const projects = await Project.find().sort({ createdAt: -1 });
        res.json({ success: true, projects });
    } catch (error) {
        console.error('❌ Erro ao listar projetos:', error.message);
        res.status(500).json({ 
            error: 'Erro ao listar projetos' 
        });
    }
});

// Rota para buscar um projeto específico
app.get('/api/agent/projects/:id', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ 
                error: 'Banco de dados não conectado' 
            });
        }

        const project = await Project.findById(req.params.id);
        
        if (!project) {
            return res.status(404).json({ 
                error: 'Projeto não encontrado' 
            });
        }

        res.json({ success: true, project });
    } catch (error) {
        console.error('❌ Erro ao buscar projeto:', error.message);
        res.status(500).json({ 
            error: 'Erro ao buscar projeto' 
        });
    }
});

// Rota para deletar projeto
app.delete('/api/agent/projects/:id', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ 
                error: 'Banco de dados não conectado' 
            });
        }

        const result = await Project.findByIdAndDelete(req.params.id);
        
        if (!result) {
            return res.status(404).json({ 
                error: 'Projeto não encontrado' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Projeto deletado com sucesso' 
        });
    } catch (error) {
        console.error('❌ Erro ao deletar projeto:', error.message);
        res.status(500).json({ 
            error: 'Erro ao deletar projeto' 
        });
    }
});

// Tratamento de erros global
app.use((err, req, res, next) => {
    console.error('❌ Erro não tratado:', err);
    res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: err.message 
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    const apiKeyStatus = DEEPSEEK_API_KEY && DEEPSEEK_API_KEY !== '' ? '✅ Configurada' : '❌ Não configurada';
    const mongoStatus = mongoose.connection.readyState === 1 ? '✅ Conectado' : '⏳ Conectando...';
    
    console.log('\n🤖 ================================');
    console.log('   AGENT SERVER - Servidor de IA');
    console.log('   ================================');
    console.log(`   🌐 Rodando na porta: ${PORT}`);
    console.log(`   📡 URL: http://localhost:${PORT}`);
    console.log(`   🔑 DeepSeek API: ${apiKeyStatus}`);
    console.log(`   💾 MongoDB: ${mongoStatus}`);
    console.log('   ================================\n');
});

module.exports = app;
