const Entrega = require('../models/Entrega');
const Estudante = require('../models/Estudante');
const Tarefa = require('../models/Tarefa');

exports.uploadPdf = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ erro: 'Nenhum arquivo PDF foi enviado.' });
    }

    const urlPdf = `${req.protocol}://${req.get('host')}/uploads/pdf/${req.file.filename}`;

    return res.json({
      mensagem: 'Upload do PDF realizado com sucesso!',
      pdfUrl: urlPdf
    });
  } catch (error) {
    console.error('Erro no upload de PDF:', error);
    return res.status(500).json({ erro: 'Erro ao salvar o arquivo PDF.' });
  }
};

exports.criarTarefa = async (req, res) => {
  try {
    const { titulo, classe, pdfUrl } = req.body;

    if (!titulo || !classe) {
      return res.status(400).json({ erro: 'Título e classe são obrigatórios.' });
    }

    const novaTarefa = await Tarefa.create({
      titulo,
      classe: classe.trim().toUpperCase(),
      pdfUrl: pdfUrl || null
    });

    return res.status(201).json({
      mensagem: 'Tarefa cadastrada com sucesso!',
      tarefa: novaTarefa
    });

  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    return res.status(500).json({ erro: 'Erro ao cadastrar a tarefa.' });
  }
};

exports.listarEntregasPorTurma = async (req, res) => {
  try {
    const { classe } = req.query;

    if (!classe) {
      return res.status(400).json({ erro: 'A classe é obrigatória.' });
    }

    const turma = classe.trim().toUpperCase();

    const estudantes = await Estudante.find({ classe: turma }).sort({ numero: 1, nome: 1 });

    const tarefas = await Tarefa.find({ classe: { $in: [turma, 'TODAS'] } }).sort({ createdAt: 1 });

    const estudanteIds = estudantes.map(e => e._id);
    const entregas = await Entrega.find({ estudanteId: { $in: estudanteIds } });

    const alunosRelatorio = estudantes.map(aluno => {
      const tarefasMap = {};

      tarefas.forEach(tarefa => {
        const entrega = entregas.find(
          e => e.estudanteId.toString() === aluno._id.toString() && 
               e.tarefaId.toString() === tarefa._id.toString()
        );

        tarefasMap[tarefa._id] = {
          entregue: !!entrega,
          conteudo: entrega ? entrega.conteudo : null,
          dataEntrega: entrega ? entrega.updatedAt : null
        };
      });

      return {
        estudanteId: aluno._id,
        numero: aluno.numero,
        nome: aluno.nome,
        entregas: tarefasMap 
      };
    });

    return res.json({
      classe: turma,
      colunasTarefas: tarefas.map(t => ({
        id: t._id,
        titulo: t.titulo,
        dataCriacao: t.createdAt
      })),
      alunos: alunosRelatorio
    });

  } catch (error) {
    console.error('Erro ao gerar matriz de entregas:', error);
    return res.status(500).json({ erro: 'Erro ao gerar relatório.' });
  }
};