import express from 'express';
import * as userController from '../../controllers/general/userController';

const router = express.Router();
router.get('/', userController.getUsers)
        .get('/select-options', userController.getUserSelectOptions)
        .get('/:id', userController.getUser);

export default router;