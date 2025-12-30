import express from 'express';
import * as roomTypeController from '../../controllers/activity/roomTypeController'
import { keycloak } from '../../services/keycloak';
import { Token } from 'keycloak-connect';

const router = express.Router();
const viewAllPermission = (token:Token) => {return token.hasApplicationRole('shorebase-backend', 'roomType:view:all')}
const createPermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'roomType:create')}
const updatePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'roomType:update')}
const deletePermission = (token: Token) => {return token.hasApplicationRole('shorebase-backend', 'roomType:delete')}


router.get('/', keycloak.protect(viewAllPermission), roomTypeController.getRoomTypes)
      .get('/select-options', roomTypeController.getRoomTypeSelectOptions)
      .get('/:id', keycloak.protect(viewAllPermission), roomTypeController.getRoomType)
      .post('/', keycloak.protect(createPermission), roomTypeController.createRoomType)
      .post('/:id', keycloak.protect(updatePermission), roomTypeController.updateRoomType)
      .delete('/:id', keycloak.protect(deletePermission), roomTypeController.deleteRoomType);

export default router;