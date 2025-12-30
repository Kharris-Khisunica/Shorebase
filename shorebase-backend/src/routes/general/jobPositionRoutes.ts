import express from 'express';
import * as jobPositionController from '../../controllers/general/jobPositionController';
import { keycloak } from '../../services/keycloak';
import { Token } from 'keycloak-connect';
import { View } from 'typeorm';

const router = express.Router();

const viewAllPermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'jobPosition:view:all')}
const createPermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'jobPosition:create')}
const updatePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'jobPosition:update')}
const deletePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'jobPosition:delete')}

 
router.get('/', keycloak.protect(viewAllPermission),jobPositionController.getJobPositions)
        .get('/select-options', jobPositionController.getJobPositionSelectOptions)
        .get('/:id', keycloak.protect(viewAllPermission),jobPositionController.getJobPosition)
        .post('/', keycloak.protect(createPermission),jobPositionController.createJobPosition)
        .post('/:id', keycloak.protect(updatePermission),jobPositionController.updateJobPosition)
        .delete('/:id',keycloak.protect(deletePermission), jobPositionController.deleteJobPosition);

export default router;