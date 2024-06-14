/* eslint-disable space-before-function-paren */
import crypto from 'node:crypto';

import bcrypt from 'bcrypt';
import DBLocal from 'db-local';

import { SALT_ROUNDS } from './config/index.js';

const { Schema } = new DBLocal({ path: './db' });

const User = Schema('User', {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
});

export class UserRepository {
  static async create({ username, password }) {
    Validation.username(username);
    Validation.password(password);

    const user = User.findOne({ username });
    if (user) {
      throw new Error('username already exists');
    }

    const id = crypto.randomUUID();
    const hashPass = await bcrypt.hash(password, SALT_ROUNDS);

    User.create({ _id: id, username, password: hashPass }).save();

    return id;
  }

  static async login({ username, password }) {
    Validation.username(username);
    Validation.password(password);

    const user = User.findOne({ username });

    if (!user) {
      throw new Error('invalid username');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('invalid password');
    }

    const { password: _, ...publicUser } = user;

    return publicUser;
  }
}

class Validation {
  static username(username) {
    if (typeof username !== 'string') {
      throw new Error('username must be a string');
    }
    if (username.length < 3) {
      throw new Error('username must be at least 3 characters long');
    }
  }

  static password(password) {
    if (typeof password !== 'string') {
      throw new Error('password must be a string');
    }
    if (password.length < 6) {
      throw new Error('password must be at least 6 characters long');
    }
  }
}
