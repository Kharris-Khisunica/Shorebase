import express from 'express';
import * as stTimesheetController from '../../controllers/summary/stTimesheetController'
import { keycloak } from '../../services/keycloak';
import { Token } from 'keycloak-connect';

const router = express.Router();
const viewAllPermission = (token:Token) => {return token.hasApplicationRole('shorebase-backend', 'STTimesheet:view:all')}
const createPermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'STTimesheet:create')}
const updatePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'STTimesheet:update')}
const deletePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'STTimesheet:delete')}


router.get('/', keycloak.protect(viewAllPermission), stTimesheetController.getSTTimesheets)
      .get('/:id', keycloak.protect(viewAllPermission), stTimesheetController.getSTTimesheet)
      .post('/', keycloak.protect(createPermission), stTimesheetController.createSTTimesheet)
      .post('/:id', keycloak.protect(updatePermission), stTimesheetController.updateSTTimesheet)
      .delete('/:id', keycloak.protect(deletePermission), stTimesheetController.deleteSTTimesheet);

export default router;