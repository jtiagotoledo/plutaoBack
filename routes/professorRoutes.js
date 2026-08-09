const express = require('express');
const router = express.Router();
const professorController = require('../controllers/professorController');
const uploadSinglePdf = require('../middlewares/uploadPdf');

router.post('/upload-pdf', uploadSinglePdf, professorController.uploadPdf);
router.post('/tarefas', professorController.criarTarefa);

module.exports = router;