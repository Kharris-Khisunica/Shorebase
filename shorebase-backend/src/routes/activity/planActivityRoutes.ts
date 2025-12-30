import express from 'express';
import * as planActivityController from '../../controllers/activity/planActivityController'
import { keycloak } from '../../services/keycloak';
import { Token } from 'keycloak-connect';

const router = express.Router();
const viewAllPermission = (token:Token) => {return token.hasApplicationRole('shorebase-backend', 'activityPlan:view:all')}
const createPermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'activityPlan:create') }
const updatePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'activityPlan:update') }
const deletePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'activityPlan:delete') }


router.get('/', keycloak.protect(viewAllPermission), planActivityController.getPlanActivities)
      .get('/select-options', planActivityController.getPlanActivitySelectOptions)
      .get('/autofill-options', planActivityController.getPlanActivityAutofillOptions)
      .get('/:id', keycloak.protect(viewAllPermission), planActivityController.getPlanActivity)
      .post('/', keycloak.protect(createPermission), planActivityController.createPlanActivity)
      .post('/:id', keycloak.protect(updatePermission), planActivityController.updatePlanActivity)
      .delete('/:id', keycloak.protect(deletePermission), planActivityController.deletePlanActivity);

export default router;