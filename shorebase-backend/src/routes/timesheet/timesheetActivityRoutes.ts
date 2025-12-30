import express from 'express';
import * as timesheetActivityController from '../../controllers/timesheet/timesheetActivityController'
import { keycloak } from '../../services/keycloak';
import { Token } from 'keycloak-connect';

const router = express.Router();
const viewAllPermission = (token:Token) => {return token.hasApplicationRole('shorebase-backend', 'timesheetActivity:view:all')}
const createPermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'timesheetActivity:create')}
const updatePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'timesheetActivity:update')}
const deletePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'timesheetActivity:delete')}


router.get('/', keycloak.protect(viewAllPermission), timesheetActivityController.getTimesheetActivities)
      .get('/:id', keycloak.protect(viewAllPermission), timesheetActivityController.getTimesheetActivity)
      .post('/', keycloak.protect(createPermission), timesheetActivityController.createTimesheetActivity)
      .post('/:id', keycloak.protect(updatePermission), timesheetActivityController.updateTimesheetActivity)
      .delete('/:id', keycloak.protect(deletePermission), timesheetActivityController.deleteTimesheetActivity);

export default router;