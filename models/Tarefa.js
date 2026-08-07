const mongoose = require('mongoose');

const tarefaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
    },
    classe: {
        type: String,
        required: true,
        index: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Tarefa', tarefaSchema);