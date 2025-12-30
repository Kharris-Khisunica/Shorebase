import express from 'express';
import { keycloak } from '../../services/keycloak';
import * as shorebaseServicePriceController from '../../controllers/shorebaseService/shorebaseServicePriceController';
import { Token } from 'keycloak-connect';

const router = express.Router();
const viewAllPermission = (token:Token) => {return token.hasApplicationRole('shorebase-backend', 'shorebaseServicePrice:view:all')}
const createPermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'shorebaseServicePrice:create')}
const updatePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'shorebaseServicePrice:update')}
const deletePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'shorebaseServicePrice:delete')}

router.get('/', keycloak.protect(viewAllPermission),shorebaseServicePriceController.getShorebaseServicePrices)
        .get('/:id', keycloak.protect(viewAllPermission),shorebaseServicePriceController.getShorebaseServicePrice)
        .post('/', keycloak.protect(createPermission), shorebaseServicePriceController.createShorebaseServicePrice)
        .post('/:id',keycloak.protect(updatePermission), shorebaseServicePriceController.updateShorebaseServicePrice)
        .delete('/:id', keycloak.protect(deletePermission), shorebaseServicePriceController.deleteShorebaseServicePrice);

export default router;