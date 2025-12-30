import express from 'express';
import * as userPositionController from '../../controllers/position/userPositionController';
import { keycloak } from '../../services/keycloak';
import { Token } from 'keycloak-connect';

const router = express.Router();
const viewAllPermission = (token:Token) => {return token.hasApplicationRole('shorebase-backend', 'jobTitle:view:all')}
const createPermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'jobTitle:create')}
const updatePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'jobTitle:update')}
const deletePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'jobTitle:delete')}


router.get('/', keycloak.protect(viewAllPermission), userPositionController.getUserPositions)
      .get('/select-options', userPositionController.getSelectOptions)
      .get('/:id', keycloak.protect(viewAllPermission), userPositionController.getUserPosition)
      .post('/', keycloak.protect(createPermission), userPositionController.createUserPosition)
      .post('/:id', keycloak.protect(updatePermission), userPositionController.updateUserPosition)
      .delete('/:id', keycloak.protect(deletePermission), userPositionController.deleteUserPosition);

export default router;