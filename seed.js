require('dotenv').config();
const mongoose = require('mongoose');
const Estudante = require('./models/Estudante');
const Tarefa = require('./models/Tarefa');

async function povoarBanco() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado ao MongoDB para inserção de dados.');

        await Estudante.deleteMany({});
        await Tarefa.deleteMany({});

        const estudantes = await Estudante.create([
            {
                hash: 'FIS101',
                nome: 'João Silva',
                classe: '1A',
                numero: 12
            },
            {
                hash: 'FIS102',
                nome: 'Maria Souza',
                classe: '1A',
                numero: 25
            }
        ]);

        const tarefas = await Tarefa.create([
            {
                titulo: 'Exercícios sobre Primeira Lei de Ohm',
                classe: '1A'
            },
            {
                titulo: 'Relatório de Laboratório - Circuitos Elétricos',
                classe: '1A'
            }
        ]);

        console.log('Banco de dados povoado com sucesso!');
        console.log('Estudantes de teste criados:');
        estudantes.forEach(e => console.log(` - ${e.nome} (Classe ${e.classe}, N° ${e.numero}): Hash = ${e.hash}`));

        process.exit(0);
    } catch (error) {
        console.error('Erro ao povoar o banco:', error);
        process.exit(1);
    }
}

povoarBanco();