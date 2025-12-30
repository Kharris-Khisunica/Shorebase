import { Request, Response } from "express";
import approvalWorkflowService, { ApprovalWorkflowCreateReqBody } from "../../services/position/approvalWorkflowService";

export const getByCompany = async (req: Request<{ companyId: string }, {}, {}, { date?: string }>, res: Response) => {
    const approvalWorkflows = await approvalWorkflowService.getByCompany(parseInt(req.params.companyId), req.query.date);
    res.send(approvalWorkflows);
}

export const createWithStages = async (req: Request<{}, {}, ApprovalWorkflowCreateReqBody>, res: Response) => {
    const approvalWorkflow = await approvalWorkflowService.createWithStages(req.body);

    res.send(approvalWorkflow);
};

export const updateWithStages = async (req: Request<{ workflowId: string }, {}, ApprovalWorkflowCreateReqBody>, res: Response) => {
    const approvalWorkflow = await approvalWorkflowService.updateWithStages(parseInt(req.params.workflowId), req.body);

    res.send(approvalWorkflow);
};