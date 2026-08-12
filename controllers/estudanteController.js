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
    }).sort({ createdAt: -1 });

    const entregas = await Entrega.find({ estudanteId: estudante._id });

    const painel = tarefas.map(tarefa => {
      const entrega = entregas.find(e => e.tarefaId.toString() === tarefa._id.toString());
      return {
        tarefaId: tarefa._id,
        titulo: tarefa.titulo,
        classe: tarefa.classe,
        pdfUrl: tarefa.pdfUrl,
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
    const { hash, tarefaId } = req.body;

    if (!hash || !tarefaId) {
      return res.status(400).json({ erro: 'Hash e tarefaId são obrigatórios.' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ erro: 'Selecione ao menos 1 foto para enviar.' });
    }

    const estudante = await Estudante.findOne({ hash: hash.trim().toUpperCase() });
    if (!estudante) {
      return res.status(404).json({ erro: 'Estudante não encontrado.' });
    }

    const urlsFotos = req.files.map(
      file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
    );

    const entrega = await Entrega.findOneAndUpdate(
      { estudanteId: estudante._id, tarefaId: tarefaId },
      { conteudo: urlsFotos }, 
      { new: true, upsert: true }
    );

    return res.json({
      mensagem: 'Tarefa entregue com sucesso!',
      entrega,
    });
  } catch (error) {
    console.error('Erro ao enviar tarefa:', error);
    return res.status(500).json({ erro: 'Erro ao salvar a entrega.' });
  }
};

exports.atualizarEntrega = async (req, res) => {
  try {
    const { hash, tarefaId, conteudo } = req.body;

    if (!hash || !tarefaId || !conteudo) {
      return res.status(400).json({ erro: 'Hash, tarefaId e conteúdo são obrigatórios.' });
    }

    const estudante = await Estudante.findOne({ hash: hash.trim().toUpperCase() });
    if (!estudante) {
      return res.status(404).json({ erro: 'Estudante não encontrado com este hash.' });
    }

    const entrega = await Entrega.findOneAndUpdate(
      { estudanteId: estudante._id, tarefaId },
      { conteudo },
      { new: true } 
    );

    if (!entrega) {
      return res.status(404).json({ erro: 'Nenhuma entrega encontrada para este aluno nesta tarefa.' });
    }

    return res.json({
      mensagem: 'Entrega atualizada com sucesso!',
      entrega
    });

  } catch (error) {
    console.error('Erro ao atualizar entrega do aluno:', error);
    return res.status(500).json({ erro: 'Erro ao atualizar entrega.' });
  }
};

exports.excluirEntrega = async (req, res) => {
  try {
    const { hash, tarefaId } = req.body;

    if (!hash || !tarefaId) {
      return res.status(400).json({ erro: 'Hash e tarefaId são obrigatórios.' });
    }

    const estudante = await Estudante.findOne({ hash: hash.trim().toUpperCase() });
    if (!estudante) {
      return res.status(404).json({ erro: 'Estudante não encontrado com este hash.' });
    }

    const entregaDeletada = await Entrega.findOneAndDelete({ estudanteId: estudante._id, tarefaId });

    if (!entregaDeletada) {
      return res.status(404).json({ erro: 'Nenhuma entrega encontrada para remover.' });
    }

    return res.json({ mensagem: 'Entrega removida com sucesso. Você pode enviar novamente!' });

  } catch (error) {
    console.error('Erro ao excluir entrega do aluno:', error);
    return res.status(500).json({ erro: 'Erro ao remover entrega.' });
  }
};