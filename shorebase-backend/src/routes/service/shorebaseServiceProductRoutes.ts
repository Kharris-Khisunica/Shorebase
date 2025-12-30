import express from 'express';
import { keycloak } from '../../services/keycloak';
import * as shorebaseServiceProductController from '../../controllers/shorebaseService/shorebaseServiceProductController';
import { Token } from 'keycloak-connect';

const router = express.Router();
// const viewAllPermission = (token:Token) => {return token.hasApplicationRole('shorebase-backend', 'shorebaseServiceProduct:view:all')}
// const createPermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'shorebaseServiceProduct:create')}
// const updatePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'shorebaseServiceProduct:update')}
// const deletePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'shorebaseServiceProduct:delete')}

router.get('/', 
        // keycloak.protect(viewAllPermission),
        shorebaseServiceProductController.getShorebaseServiceProducts)
        .get('/select-options', shorebaseServiceProductController.getShorebaseServiceProductOptions)
        .get('/autofill-options', shorebaseServiceProductController.getShorebaseServiceProductAutofill)
        .get('/:id', 
                // keycloak.protect(viewAllPermission),
                shorebaseServiceProductController.getShorebaseServiceProduct)
        .post('/', 
                // keycloak.protect(createPermission), 
        shorebaseServiceProductController.createShorebaseServiceProduct)
        .post('/:id',
                // keycloak.protect(updatePermission), 
        shorebaseServiceProductController.updateShorebaseServiceProduct)
        .delete('/:id', 
                // keycloak.protect(deletePermission), 
        shorebaseServiceProductController.deleteShorebaseServiceProduct);

export default router;