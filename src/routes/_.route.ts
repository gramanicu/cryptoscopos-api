/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Router } from 'express';
import _controller from '../controllers/_.controller';

const _Router: Router = express.Router();

_Router.get('/:query', _controller.index);

export default _Router;
