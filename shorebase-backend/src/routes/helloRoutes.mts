import { Router } from "express";

import { getHello } from "../controllers/helloController.mjs";

const router = Router();

router.get('/', getHello);

export default router;
