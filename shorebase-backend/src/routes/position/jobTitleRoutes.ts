import express from 'express';
import * as jobTitleController from '../../controllers/position/jobTitleController';
import { keycloak } from '../../services/keycloak';
import { Token } from 'keycloak-connect';

const router = express.Router();
const viewAllPermission = (token:Token) => {return token.hasApplicationRole('shorebase-backend', 'jobTitle:view:all')}
const createPermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'jobTitle:create')}
const updatePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'jobTitle:update')}
const deletePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'jobTitle:delete')}


router.get('/', keycloak.protect(viewAllPermission), jobTitleController.getJobTitles)
      .get('/select-options', jobTitleController.getJobTitleSelectOptions)
      .get('/:id', keycloak.protect(viewAllPermission), jobTitleController.getJobTitle)
      .post('/', keycloak.protect(createPermission), jobTitleController.createJobTitle)
      .post('/:id', keycloak.protect(updatePermission), jobTitleController.updateJobTitle)
      .delete('/:id', keycloak.protect(deletePermission), jobTitleController.deleteJobTitle);

export default router;