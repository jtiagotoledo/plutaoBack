module.exports = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'];
  const chaveCorreta = process.env.ADMIN_SECRET_KEY || 'minhaChaveSuperSecreta123';

  if (!adminKey || adminKey !== chaveCorreta) {
    return res.status(403).json({ erro: 'Acesso negado. Chave administrativa inválida ou ausente.' });
  }

  next();
};