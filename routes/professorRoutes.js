const express = require('express');
const router = express.Router();
const professorController = require('../controllers/professorController');
const uploadSinglePdf = require('../middlewares/uploadPdf');
const authAdmin = require('../middlewares/authAdmin');

router.use(authAdmin);

router.post('/upload-pdf', uploadSinglePdf, professorController.uploadPdf);
router.post('/tarefas', professorController.criarTarefa);
router.put('/tarefas/:id', professorController.atualizarTarefa);
router.delete('/tarefas/:id', professorController.excluirTarefa);
router.post('/estudantes', professorController.cadastrarEstudantes);
router.get('/entregas', professorController.listarEntregasPorTurma);

module.exports = router;