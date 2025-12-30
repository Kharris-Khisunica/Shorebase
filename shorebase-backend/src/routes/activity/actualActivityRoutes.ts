import express from 'express';
import * as actualActivityController from '../../controllers/activity/actualActivityController'
import { keycloak } from '../../services/keycloak';
import { Token } from 'keycloak-connect';

const router = express.Router();
const viewAllPermission = (token:Token) => {return token.hasApplicationRole('shorebase-backend', 'activityActual:view:all')}
const createPermission = (token: Token) => {return  token.hasApplicationRole('shorebase-backend', 'activityActual:create')}
const updatePermission = (token: Token) => {return  token.hasApplicationRole('shorebase-backend', 'activityActual:update')}
const deletePermission = (token: Token) => {return  token.hasApplicationRole('shorebase-backend', 'activityActual:delete')}


router.get('/', keycloak.protect(viewAllPermission), actualActivityController.getActualActivities)
      .get('/select-options', actualActivityController.getActualActivitySelectOptions)
      .get('/autofill-options', actualActivityController.getActualActivityAutofillOptions)
      .get('/:id', keycloak.protect(viewAllPermission), actualActivityController.getActualActivity)
      .post('/', keycloak.protect(createPermission), actualActivityController.createActualActivity)
      .post('/:id', keycloak.protect(updatePermission), actualActivityController.updateActualActivity)
      .delete('/:id', keycloak.protect(deletePermission), actualActivityController.deleteActualActivity);

export default router;