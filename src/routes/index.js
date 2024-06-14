import { Router } from 'express';

import { validateToken } from '../middlewares/validateToken.js';
import {
  HomeController,
  LoginController,
  RegisterController,
  LogoutController,
  ProtectedController
} from '../controllers/index.js';

const router = Router();

router.get('/', validateToken, HomeController);

router.post('/login', LoginController);
router.post('/register', RegisterController);
router.post('/logout', LogoutController);

router.get('/protected', validateToken, ProtectedController);

export default router;
