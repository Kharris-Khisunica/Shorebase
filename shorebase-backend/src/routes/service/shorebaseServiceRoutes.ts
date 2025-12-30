import express from 'express';
import { keycloak } from '../../services/keycloak';
import * as shorebaseServiceController from '../../controllers/shorebaseService/shorebaseServiceController';
import { Token } from 'keycloak-connect';

const router = express.Router();
const viewAllPermission = (token:Token) => {return token.hasApplicationRole('shorebase-backend', 'shorebaseService:view:all')}
const createPermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'shorebaseService:create')}
const updatePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'shorebaseService:update')}
const deletePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'shorebaseService:delete')}

router.get('/', keycloak.protect(viewAllPermission),shorebaseServiceController.getShorebaseServices)
        .get('/select-options', shorebaseServiceController.getShorebaseServiceOptions)
        .get('/autofill-options', shorebaseServiceController.getShorebaseServiceAutofill)
        .get('/:id', keycloak.protect(viewAllPermission),shorebaseServiceController.getShorebaseService)
        .post('/', keycloak.protect(createPermission), shorebaseServiceController.createShorebaseService)
        .post('/:id',keycloak.protect(updatePermission), shorebaseServiceController.updateShorebaseService)
        .delete('/:id', keycloak.protect(deletePermission), shorebaseServiceController.deleteShorebaseService);

export default router;