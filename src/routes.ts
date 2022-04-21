import express, { Router } from 'express';
import _Router from './routes/_.route';

const router: Router = express.Router();

router.use('/_', _Router);

export default router;
