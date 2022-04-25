import express, { Router } from 'express';
import AuthController from '../controllers/auth.controller';

const AuthRouter: Router = express.Router();

AuthRouter.get('/config', AuthController.getAuth0Config);

export default AuthRouter;
