import { Router } from "express";
import { getHello } from "../controllers/helloController.mjs";
var router = Router();
router.get('/', getHello);
export default router;
