import express from 'express';
import * as approvalWorkflowController from '../../controllers/position/approvalWorkflowController';

const router = express.Router();
router.get('/company/:companyId', approvalWorkflowController.getByCompany)
        .post('/', approvalWorkflowController.createWithStages)
        .post('/:workflowId/update', approvalWorkflowController.updateWithStages);

export default router;