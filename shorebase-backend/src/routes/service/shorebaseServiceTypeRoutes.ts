import express from 'express';
import { keycloak } from '../../services/keycloak';
import * as shorebaseServiceTypeController from '../../controllers/shorebaseService/shorebaseServiceTypeController';
import { Token } from 'keycloak-connect';

const router = express.Router();
// const viewAllPermission = (token:Token) => {return token.hasApplicationRole('shorebase-backend', 'shorebaseServiceType:view:all')}
// const createPermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'shorebaseServiceType:create')}
// const updatePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'shorebaseServiceType:update')}
// const deletePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'shorebaseServiceType:delete')}

router.get('/', 
        // keycloak.protect(viewAllPermission),
        shorebaseServiceTypeController.getShorebaseServiceTypes)
        .get('/select-options', shorebaseServiceTypeController.getShorebaseServiceTypeSelectOptions)
        .get('/:code', 
                // keycloak.protect(viewAllPermission),
        shorebaseServiceTypeController.getShorebaseServiceType)
        .post('/', 
                // keycloak.protect(createPermission), 
        shorebaseServiceTypeController.createShorebaseServiceType)
        .post('/:code',
                // keycloak.protect(updatePermission), 
                shorebaseServiceTypeController.updateShorebaseServiceType)
        .delete('/:code', 
                // keycloak.protect(deletePermission), 
                shorebaseServiceTypeController.deleteShorebaseServiceType);

export default router;