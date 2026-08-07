const mongoose = require('mongoose');

const entregaSchema = mongoose.Schema({
    estudanteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Estudante',
        require: true,
    },
    tarefaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tarefa',
        require: true,
    },
    conteudo: {
        type: String,
        require: true,
    }
}, { timestamps: true });

entregaSchema.index({estudanteId:1,tarefaId:1},{unique:true});

module.exports = mongoose.model('Entrega', entregaSchema);