const crypto = require('crypto');

const Entrega = require('../models/Entrega');
const Estudante = require('../models/Estudante');
const Tarefa = require('../models/Tarefa');

const gerarHashUnico = () => {
  return crypto.randomBytes(2).toString('hex').toUpperCase();
};

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
      return res.status(400).json({ erro: 'Título e classe(s) são obrigatórios.' });
    }

    const turmasArray = Array.isArray(classe) ? classe : [classe];

    const tarefasParaInserir = turmasArray.map(turma => ({
      titulo,
      classe: turma.trim().toUpperCase(),
      pdfUrl: pdfUrl || null
    }));

    const tarefasCriadas = await Tarefa.insertMany(tarefasParaInserir);

    return res.status(201).json({
      mensagem: `Tarefa cadastrada com sucesso para ${tarefasCriadas.length} turma(s)!`,
      tarefas: tarefasCriadas
    });

  } catch (error) {
    console.error('Erro ao criar tarefa(s):', error);
    return res.status(500).json({ erro: 'Erro ao cadastrar a tarefa.' });
  }
};

exports.listarTarefas = async (req, res) => {
  try {
    const tarefas = await Tarefa.find().sort({ createdAt: -1 });
    res.status(200).json(tarefas);
  } catch (error) {
    console.error("Erro ao listar tarefas:", error);
    res.status(500).json({ message: "Erro ao buscar tarefas do servidor" });
  }
};

exports.atualizarTarefa = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, classe, pdfUrl } = req.body;

    const tarefa = await Tarefa.findById(id);
    if (!tarefa) {
      return res.status(404).json({ erro: 'Tarefa não encontrada.' });
    }

    if (titulo) tarefa.titulo = titulo;
    if (classe) tarefa.classe = classe.trim().toUpperCase();
    if (pdfUrl !== undefined) tarefa.pdfUrl = pdfUrl;

    await tarefa.save();

    return res.json({ mensagem: 'Tarefa atualizada com sucesso!', tarefa });
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    return res.status(500).json({ erro: 'Erro ao atualizar a tarefa.' });
  }
};

exports.excluirTarefa = async (req, res) => {
  try {
    const { id } = req.params;

    const tarefa = await Tarefa.findByIdAndDelete(id);
    if (!tarefa) {
      return res.status(404).json({ erro: 'Tarefa não encontrada.' });
    }

    await Entrega.deleteMany({ tarefaId: id });

    return res.json({ mensagem: 'Tarefa e suas entregas foram removidas com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir tarefa:', error);
    return res.status(500).json({ erro: 'Erro ao excluir a tarefa.' });
  }
};

exports.cadastrarEstudantes = async (req, res) => {
  try {
    let estudantes = req.body;

    if (Array.isArray(estudantes)) {
      const listaComHash = estudantes.map(e => ({
        ...e,
        hash: e.hash ? e.hash.trim().toUpperCase() : gerarHashUnico(),
        classe: e.classe.trim().toUpperCase()
      }));

      const novos = await Estudante.insertMany(listaComHash);
      return res.status(201).json({ mensagem: `${novos.length} estudantes cadastrados!`, estudantes: novos });
    }

    const { nome, classe, numero, hash } = estudantes;

    if (!nome || !classe || !numero) {
      return res.status(400).json({ erro: 'Campos nome, classe e numero são obrigatórios.' });
    }

    const novoEstudante = await Estudante.create({
      hash: hash ? hash.trim().toUpperCase() : gerarHashUnico(),
      nome,
      classe: classe.trim().toUpperCase(),
      numero
    });

    return res.status(201).json({ mensagem: 'Estudante cadastrado com sucesso!', estudante: novoEstudante });

  } catch (error) {
    console.error('Erro ao cadastrar estudante:', error);
    if (error.code === 11000) {
      return res.status(400).json({ erro: 'Já existe um estudante cadastrado com esse hash ou número na turma.' });
    }
    return res.status(500).json({ erro: 'Erro ao cadastrar estudante.' });
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
