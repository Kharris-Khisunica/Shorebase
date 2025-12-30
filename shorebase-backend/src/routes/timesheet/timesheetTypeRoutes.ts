import express from 'express';
import * as timesheetTypeController from '../../controllers/timesheet/timesheetTypeController'
import { keycloak } from '../../services/keycloak';
import { Token } from 'keycloak-connect';

const router = express.Router();
const viewAllPermission = (token:Token) => {return token.hasApplicationRole('shorebase-backend', 'timesheetType:view:all')}
const createPermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'timesheetType:create')}
const updatePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'timesheetType:update')}
const deletePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'timesheetType:delete')}


router.get('/', keycloak.protect(viewAllPermission), timesheetTypeController.getTimesheetTypes)
      .get('/select-options', timesheetTypeController.getTimesheetTypeSelectOptions)
      .get('/:code', keycloak.protect(viewAllPermission), timesheetTypeController.getTimesheetType)
      .post('/', keycloak.protect(createPermission), timesheetTypeController.createTimesheetType)
      .post('/:code', keycloak.protect(updatePermission), timesheetTypeController.updateTimesheetType)
      .delete('/:code', keycloak.protect(deletePermission), timesheetTypeController.deleteTimesheetType);

export default router;