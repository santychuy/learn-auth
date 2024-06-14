import jwt from 'jsonwebtoken';

import { SECRET_JWT_KEY } from '../config/index.js';
import { UserRepository } from '../user-repository.js';

export const HomeController = (req, res) => {
  const { user } = req.session;

  return res.json({ message: 'Hello!', user });
};

export const LoginController = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserRepository.login({ username, password });
    const token = jwt.sign(
      { id: user._id, username: user.username },
      SECRET_JWT_KEY,
      { expiresIn: '1h' }
    );

    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000
      })
      .json({ user, token });
  } catch (error) {
    // TODO: Handle error more properly, extending a class of Error separately
    res.status(401).send({ error: error.message });
  }
};

export const RegisterController = async (req, res) => {
  const { username, password } = req.body;

  try {
    const id = await UserRepository.create({ username, password });
    res.send({ id });
  } catch (error) {
    // TODO: Handle error more properly, extending a class of Error separately
    res.status(400).send({ error: error.message });
  }
};

export const LogoutController = (_req, res) => {
  res.clearCookie('access_token').send('Logged out');
};

export const ProtectedController = async (req, res) => {
  const { user } = req.session;

  if (!user) {
    return res.status(403).send('Access not authorized');
  }

  res.json({ message: 'Protected' });
};
