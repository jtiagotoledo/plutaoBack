const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads/pdf');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nomeUnico = `tarefa-${Date.now()}-${Math.round(Math.random() * 1E6)}${ext}`;
    cb(null, nomeUnico);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 
  },
  fileFilter: (req, file, cb) => {
    const extValida = path.extname(file.originalname).toLowerCase() === '.pdf';
    const mimeValido = file.mimetype === 'application/pdf';

    if (extValida && mimeValido) {
      return cb(null, true);
    }
    cb(new Error('Apenas arquivos no formato PDF são permitidos!'));
  }
});

const uploadSinglePdf = (req, res, next) => {
  upload.single('pdf')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ erro: 'O arquivo PDF excede o limite de 5 MB.' });
      }
      return res.status(400).json({ erro: err.message });
    } else if (err) {
      return res.status(400).json({ erro: err.message });
    }
    next();
  });
};

module.exports = uploadSinglePdf;