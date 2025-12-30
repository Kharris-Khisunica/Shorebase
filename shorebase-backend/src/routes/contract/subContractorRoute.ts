import express from 'express';
import { keycloak } from '../../services/keycloak';
import * as subContractController from '../../controllers/contract/subContractorController';
import { Token } from 'keycloak-connect';

const router = express.Router();
const viewAllPermission = (token:Token) => {return token.hasApplicationRole('shorebase-backend', 'subContractor:view:all')}
const createPermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'subContractor:create')}
const updatePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'subContractor:update')}
const deletePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'subContractor:delete')}

router.get('/', keycloak.protect(viewAllPermission),subContractController.getSubContractors)
        .get('/select-options', subContractController.getSubContractorOptions)
        .get('/:id', keycloak.protect(viewAllPermission),subContractController.getSubContractor)
        .post('/', keycloak.protect(createPermission), subContractController.createSubContractor)
        .post('/:id',keycloak.protect(updatePermission), subContractController.updateSubContractor)
        .delete('/:id', keycloak.protect(deletePermission), subContractController.deleteSubContractor);

export default router;