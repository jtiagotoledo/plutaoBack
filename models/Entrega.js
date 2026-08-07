const mongoose = require('mongoose');

const entregaSchema = new mongoose.Schema({
    estudanteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Estudante',
        required: true,
    },
    tarefaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tarefa',
        required: true,
    },
    conteudo: {
        type: String,
        required: true,
    }
}, { timestamps: true });

entregaSchema.index({estudanteId:1,tarefaId:1},{unique:true});

module.exports = mongoose.model('Entrega', entregaSchema);