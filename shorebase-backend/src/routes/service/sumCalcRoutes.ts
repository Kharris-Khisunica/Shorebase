import express from 'express';
import * as sumCalcController from '../../controllers/shorebaseService/sumCalcController'
import { keycloak } from '../../services/keycloak';
import { Token } from 'keycloak-connect';

const router = express.Router();
const viewAllPermission = (token:Token) => {return token.hasApplicationRole('shorebase-backend', 'sumCalc:view:all')}
const createPermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'sumCalc:create')}
const updatePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'sumCalc:update')}
const deletePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'sumCalc:delete')}


router.get('/', keycloak.protect(viewAllPermission), sumCalcController.getSumCalcs)
      .get('/select-options', sumCalcController.getSumCalcSelectOptions)
      .get('/:code', keycloak.protect(viewAllPermission), sumCalcController.getSumCalc)
      .post('/', keycloak.protect(createPermission), sumCalcController.createSumCalc)
      .post('/:code', keycloak.protect(updatePermission), sumCalcController.updateSumCalc)
      .delete('/:code', keycloak.protect(deletePermission), sumCalcController.deleteSumCalc);

export default router;