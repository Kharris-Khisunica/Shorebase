import express from 'express';
import { keycloak } from '../../services/keycloak';
import * as companyController from '../../controllers/general/companyController';
import { Token } from 'keycloak-connect';

const router = express.Router();
const viewAllPermission = (token:Token) => {return token.hasApplicationRole('shorebase-backend', 'company:view:all')}
const createPermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'company:create')}
const updatePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'company:update')}
const deletePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'company:delete')}

router.get('/', keycloak.protect(viewAllPermission),companyController.getCompanies)
        .get('/select-options', companyController.getCompanySelectOptions)
        .get('/:id', keycloak.protect(viewAllPermission),companyController.getCompany)
        .post('/', keycloak.protect(createPermission), companyController.createCompany)
        .post('/:id',keycloak.protect(updatePermission), companyController.updateCompany)
        .delete('/:id', keycloak.protect(deletePermission), companyController.deleteCompany);

export default router;