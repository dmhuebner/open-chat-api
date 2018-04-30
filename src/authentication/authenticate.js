function ensureToken(req, res, next) {
  if (req.method !== 'OPTIONS') {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader) {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      req.token = bearerToken;
      next();
    } else {
      res.sendStatus(403);
    }
  } else {
    next();
  }
}

module.exports = ensureToken;