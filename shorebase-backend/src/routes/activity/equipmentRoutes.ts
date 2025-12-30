import express from 'express';
import * as equipmentController from '../../controllers/activity/equipmentController'
import { keycloak } from '../../services/keycloak';
import { Token } from 'keycloak-connect';

const router = express.Router();
// const viewAllPermission = (token:Token) => {return token.hasApplicationRole('shorebase-backend', 'Equipment:view:all')}
// const createPermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'Equipment:create')}
// const updatePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'Equipment:update')}
// const deletePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'Equipment:delete')}


router.get('/', 
            // keycloak.protect(viewAllPermission), 
            equipmentController.getEquipments)
      .get('/select-options', equipmentController.getEquipmentSelectOptions)
      .get('/:id', 
            // keycloak.protect(viewAllPermission), 
      equipmentController.getEquipment)
      .post('/', 
            // keycloak.protect(createPermission), 
      equipmentController.createEquipment)
      .post('/:id', 
            // keycloak.protect(updatePermission), 
      equipmentController.updateEquipment)
      .delete('/:id', 
            // keycloak.protect(deletePermission), 
      equipmentController.deleteEquipment);

export default router;