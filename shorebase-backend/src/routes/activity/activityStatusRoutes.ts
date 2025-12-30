import express from 'express';
import * as activityStatusController from '../../controllers/activity/activityStatusController'
import { keycloak } from '../../services/keycloak';
import { Token } from 'keycloak-connect';

const router = express.Router();
const viewAllPermission = (token:Token) => {return token.hasApplicationRole('shorebase-backend', 'activityStatus:view:all')}
const createPermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'activityStatus:create')}
const updatePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'activityStatus:update')}
const deletePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'activityStatus:delete')}


router.get('/', keycloak.protect(viewAllPermission), activityStatusController.getActivityStatuses)
      .get('/select-options', activityStatusController.getActivityStatusSelectOptions)
      .get('/:code', keycloak.protect(viewAllPermission), activityStatusController.getActivityStatus)
      .post('/', keycloak.protect(createPermission), activityStatusController.createActivityStatus)
      .post('/:code', keycloak.protect(updatePermission), activityStatusController.updateActivityStatus)
      .delete('/:code', keycloak.protect(deletePermission), activityStatusController.deleteActivityStatus);

export default router;