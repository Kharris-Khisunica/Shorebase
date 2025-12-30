import express from 'express';
import * as summaryTimesheetController from '../../controllers/summary/summaryTimesheetController'
import { keycloak } from '../../services/keycloak';
import { Token } from 'keycloak-connect';

const router = express.Router();
const viewAllPermission = (token:Token) => {return token.hasApplicationRole('shorebase-backend', 'SummaryTimesheet:view:all')}
const createPermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'SummaryTimesheet:create')}
const updatePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'SummaryTimesheet:update')}
const deletePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'SummaryTimesheet:delete')}


router.get('/', keycloak.protect(viewAllPermission), summaryTimesheetController.getSummaryTimesheets)
      .get('/company/:companyId', summaryTimesheetController.getCompanySummaryTimesheet)
      .get('/:stId', summaryTimesheetController.getSummaryTimesheet)
      .post('/', summaryTimesheetController.createSummaryTimesheet)
      .post('/:id', summaryTimesheetController.updateSummaryTimesheet)
      .delete('/:id', summaryTimesheetController.deleteSummaryTimesheet);

export default router;