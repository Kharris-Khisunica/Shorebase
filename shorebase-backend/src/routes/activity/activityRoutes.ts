import express from 'express';
import * as activityController from '../../controllers/activity/activityController'
import { keycloak } from '../../services/keycloak';
import { Token } from 'keycloak-connect';

const router = express.Router();
const viewAllPermission = (token:Token) => {return token.hasApplicationRole('shorebase-backend', 'activityPlan:view:all') || token.hasApplicationRole('shorebase-backend', 'activityActual:view:all')}
const createPermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'activityPlan:create') || token.hasApplicationRole('shorebase-backend', 'activityActual:create')}
const updatePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'activityPlan:update') || token.hasApplicationRole('shorebase-backend', 'activityActual:update')}
const deletePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'activityPlan:delete') || token.hasApplicationRole('shorebase-backend', 'activityActual:delete')}


router.get('/', keycloak.protect(viewAllPermission), activityController.getActivities)
      .get('/select-options', activityController.getActivitySelectOptions)
      .get('/autofill-options', activityController.getActivityAutofillOptions)
      .get('/:id', keycloak.protect(viewAllPermission), activityController.getActivity)
      .post('/', keycloak.protect(createPermission), activityController.createActivity)
      .post('/:id', keycloak.protect(updatePermission), activityController.updateActivity)
      .delete('/:id', keycloak.protect(deletePermission), activityController.deleteActivity);

export default router;