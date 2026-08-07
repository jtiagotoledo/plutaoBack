const mongoose = require('mongoose');

const tarefaSchema = new mongoose.Schema({
    semana: {
        type: Number,
        required: true,
    },
    titulo: {
        type: String,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Tarefa', tarefaSchema);