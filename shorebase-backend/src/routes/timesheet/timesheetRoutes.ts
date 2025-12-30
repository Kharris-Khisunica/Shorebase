import express from 'express';
import * as timesheetController from '../../controllers/timesheet/timesheetController'
import { keycloak } from '../../services/keycloak';
import { Token } from 'keycloak-connect';

const router = express.Router();
const viewAllPermission = (token:Token) => {return token.hasApplicationRole('shorebase-backend', 'timesheet:view:all')}
const createPermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'timesheet:create')}
const updatePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'timesheet:update')}
const deletePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'timesheet:delete')}


router.get('/', keycloak.protect(viewAllPermission), timesheetController.getTimesheets)
      .get('/select-options', timesheetController.getTimesheetSelectOptions)
      .get('/:id', keycloak.protect(viewAllPermission), timesheetController.getTimesheet)
      .get('/company/:companyId', timesheetController.getCompanyTimesheets)
      .post('/',  timesheetController.createTimesheet)
      .post('/:id',  timesheetController.updateTimesheet)
      .delete('/:id', timesheetController.deleteTimesheet);

export default router;