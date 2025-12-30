import express from 'express';
import { keycloak } from '../../services/keycloak';
import * as contractController from '../../controllers/contract/contractController';
import { Token } from 'keycloak-connect';

const router = express.Router();
const viewAllPermission = (token:Token) => {return token.hasApplicationRole('shorebase-backend', 'contract:view:all')}
const createPermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'contract:create')}
const updatePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'contract:update')}
const deletePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'contract:delete')}

router.get('/', keycloak.protect(viewAllPermission),contractController.getContracts)
        .get('/select-options', contractController.getContractOptions)
        .get('/autofill-options', contractController.getContractAutofill)
        .get('/:id', keycloak.protect(viewAllPermission),contractController.getContract)
        .post('/', keycloak.protect(createPermission), contractController.createContract)
        .post('/:id',keycloak.protect(updatePermission), contractController.updateContract)
        .delete('/:id', keycloak.protect(deletePermission), contractController.deleteContract);

export default router;