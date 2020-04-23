import express from 'express';
import { login, signUp } from '../controllers/userController';
import { userSignupValidator, userLoginValidator } from '../middleware/joi';

const authRouter = express.Router();

authRouter.post('/signup', userSignupValidator, signUp);

authRouter.post('/login', userLoginValidator, login);

// Return authRouter
export default authRouter;
