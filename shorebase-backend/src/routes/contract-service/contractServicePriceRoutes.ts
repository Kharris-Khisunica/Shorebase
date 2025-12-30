import express from 'express'
import { Token } from 'keycloak-connect';
import { keycloak } from '../../services/keycloak';
import * as contractServicePriceController from '../../controllers/contractService/contractServicePriceController'

const router = express.Router();
const viewAllPermission = (token:Token) => {return token.hasApplicationRole('shorebase-backend', 'contractServicePrice:view:all')}
const createPermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'contractServicePrice:create')}
const updatePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'contractServicePrice:update')}
const deletePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'contractServicePrice:delete')}

router.get('/', keycloak.protect(viewAllPermission),contractServicePriceController.getContractServicePrices)
        .get('/:id', keycloak.protect(viewAllPermission),contractServicePriceController.getContractServicePrice)
        .post('/', keycloak.protect(createPermission), contractServicePriceController.createContractServicePrice)
        .post('/:id',keycloak.protect(updatePermission), contractServicePriceController.updateContractServicePrice)
        .delete('/:id', keycloak.protect(deletePermission), contractServicePriceController.deleteContractServicePrice)


export default router;