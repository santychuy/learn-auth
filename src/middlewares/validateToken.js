import jwt from 'jsonwebtoken';

import { SECRET_JWT_KEY } from '../config/index.js';

export const validateToken = async (req, res, next) => {
  const token = req.cookies.access_token;

  req.session = { user: null };

  if (!token) {
    return res.status(403).send('Access not authorized');
  }

  const data = jwt.verify(token, SECRET_JWT_KEY);
  req.session.user = data;

  next();
};
