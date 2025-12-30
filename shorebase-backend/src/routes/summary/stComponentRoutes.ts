import express from 'express';
import * as stComponentController from '../../controllers/summary/stComponentController'
import { keycloak } from '../../services/keycloak';
import { Token } from 'keycloak-connect';

const router = express.Router();
const viewAllPermission = (token:Token) => {return token.hasApplicationRole('shorebase-backend', 'STComponent:view:all')}
const createPermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'STComponent:create')}
const updatePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'STComponent:update')}
const deletePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'STComponent:delete')}


router.get('/', keycloak.protect(viewAllPermission), stComponentController.getSTComponents)
      .get('/:id', keycloak.protect(viewAllPermission), stComponentController.getSTComponent)
      .post('/', keycloak.protect(createPermission), stComponentController.createSTComponent)
      .post('/:id', keycloak.protect(updatePermission), stComponentController.updateSTComponent)
      .delete('/:id', keycloak.protect(deletePermission), stComponentController.deleteSTComponent);

export default router;