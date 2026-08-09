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