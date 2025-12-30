import express from 'express';
import * as uomController from '../../controllers/shorebaseService/uomController'
import { keycloak } from '../../services/keycloak';
import { Token } from 'keycloak-connect';

const router = express.Router();
const viewAllPermission = (token:Token) => {return token.hasApplicationRole('shorebase-backend', 'uom:view:all')}
const createPermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'uom:create')}
const updatePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'uom:update')}
const deletePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'uom:delete')}


router.get('/', keycloak.protect(viewAllPermission), uomController.getUOMs)
      .get('/select-options', uomController.getUomSelectOptions)
      .get('/:code', keycloak.protect(viewAllPermission), uomController.getUOM)
      .post('/', keycloak.protect(createPermission), uomController.createUOM)
      .post('/:code', keycloak.protect(updatePermission), uomController.updateUOM)
      .delete('/:code', keycloak.protect(deletePermission), uomController.deleteUOM);

export default router;