import express, { Router } from "express";
import _controller from "../controllers/_.controller"

let _Router:Router = express.Router();

_Router.get('/', _controller.index);

export default _Router;