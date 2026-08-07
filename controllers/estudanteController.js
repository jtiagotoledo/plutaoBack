const Estudante = require('../models/Estudante');
const Tarefa = require('../models/Tarefa');
const Entrega = require('../models/Entrega');

exports.obterPainelEstudante = async (req, res) => {
  try {
    const { hash } = req.body;

    if (!hash) {
      return res.status(400).json({ erro: 'O hash é obrigatório.' });
    }

    const estudante = await Estudante.findOne({ hash: hash.trim().toUpperCase() });
    if (!estudante) {
      return res.status(404).json({ erro: 'Código (hash) não encontrado.' });
    }

    const tarefas = await Tarefa.find({ 
      classe: { $in: [estudante.classe, 'TODAS'] } 
    }).sort({ createdAt: 1 }); 

    const entregas = await Entrega.find({ estudanteId: estudante._id });

    const painel = tarefas.map(tarefa => {
      const entrega = entregas.find(e => e.tarefaId.toString() === tarefa._id.toString());
      return {
        tarefaId: tarefa._id,
        titulo: tarefa.titulo,
        classe: tarefa.classe,
        dataCriacao: tarefa.createdAt, 
        entregue: !!entrega,
        conteudo: entrega ? entrega.conteudo : null,
        dataEntrega: entrega ? entrega.updatedAt : null
      };
    });

    return res.json({
      estudante: {
        id: estudante._id,
        nome: estudante.nome,
        classe: estudante.classe,
        numero: estudante.numero
      },
      tarefas: painel
    });

  } catch (error) {
    console.error('Erro no login por hash:', error);
    return res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
};

exports.enviarTarefa = async (req, res) => {
  try {
    const { hash, tarefaId, conteudo } = req.body;

    if (!hash || !tarefaId || !conteudo) {
      return res.status(400).json({ erro: 'Hash, tarefaId e conteúdo são obrigatórios.' });
    }

    const estudante = await Estudante.findOne({ hash: hash.trim().toUpperCase() });
    if (!estudante) {
      return res.status(404).json({ erro: 'Estudante não encontrado.' });
    }

    const entrega = await Entrega.findOneAndUpdate(
      { estudanteId: estudante._id, tarefaId: tarefaId },
      { conteudo: conteudo },
      { new: true, upsert: true }
    );

    return res.json({
      mensagem: 'Tarefa entregue com sucesso!',
      entrega
    });

  } catch (error) {
    console.error('Erro ao enviar tarefa:', error);
    return res.status(500).json({ erro: 'Erro ao salvar a entrega.' });
  }
};