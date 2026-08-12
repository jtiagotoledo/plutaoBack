const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nomeUnico = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, nomeUnico);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 200 * 1024 
  },
  fileFilter: (req, file, cb) => {
    const extensoesAceitas = /jpeg|jpg|png|webp/;
    const mimeAceitos = /image\/(jpeg|jpg|png|webp|pjpeg|x-png)/;

    const extName = path.extname(file.originalname).toLowerCase();
    const extValida = extensoesAceitas.test(extName);
    const mimeValido = mimeAceitos.test(file.mimetype.toLowerCase());

    if (mimeValido || (extValida && mimeValido)) {
      return cb(null, true);
    }

    cb(new Error('Formato de imagem não suportado. Envie em JPG, PNG ou WebP.'));
  }
});

const uploadFotos = (req, res, next) => {
  upload.array('fotos', 2)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ erro: 'Cada foto excede o limite máximo permitido de 200 KB.' });
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ erro: 'Você pode enviar no máximo 2 fotos.' });
      }
      return res.status(400).json({ erro: err.message });
    } else if (err) {
      return res.status(400).json({ erro: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ erro: 'Nenhum arquivo enviado.' });
    }

    next();
  });
};

module.exports = uploadFotos;