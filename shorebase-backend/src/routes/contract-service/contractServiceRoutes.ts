import express from 'express';
import { keycloak } from '../../services/keycloak';
import * as contractServiceController from '../../controllers/contractService/contractServiceController';
import { Token } from 'keycloak-connect';

const router = express.Router();
const viewAllPermission = (token:Token) => {return token.hasApplicationRole('shorebase-backend', 'contractService:view:all')}
const createPermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'contractService:create')}
const updatePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'contractService:update')}
const deletePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'contractService:delete')}

router.get('/', keycloak.protect(viewAllPermission),contractServiceController.getContractServices)
        .get('/select-options', contractServiceController.getContractServiceOptions)
        .get('/autofill-options', contractServiceController.getContractServiceAutofill)
        .get('/:id', keycloak.protect(viewAllPermission),contractServiceController.getContractService)
        .post('/', keycloak.protect(createPermission), contractServiceController.createContractService)
        .post('/:id',keycloak.protect(updatePermission), contractServiceController.updateContractService)
        .delete('/:id', keycloak.protect(deletePermission), contractServiceController.deleteContractService);

export default router;