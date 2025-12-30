export { ApprovalWorkflow }

declare global{
    type ApprovalTypeCode = 'T' | 'ST' | 'PIN' | 'IN';

    interface ApprovalWorkflow{
        id: number;
        typeCode: ApprovalTypeCode;
        type: ApprovalType?;
        timesheetTypeCode: TimesheetTypeCode;
        timesheetType: TimesheetType?;

        contract: Contract?;
        subContractor: SubContractor?;
        company: Company?;

        approvalWorkstages: ApprovalWorkflowStage[];
        
        startDate: Date;
        endDate: Date;
    }

    export interface ApprovalWorkflowStage {
        id: number;
        workflow?: ApprovalWorkflow;
        level: number;
        jobPosition?: JobPosition;
        userPosition?: UserPosition;
    }

    export interface ApprovalType {
        code: ApprovalTypeCode;
        name: string;
    }

    export interface ApprovalStatus{
        code: string;
        name: string;
    }

    export interface Approval{
        id: number;
        type: ApprovalType;
        timesheet: Timesheet?;
        summaryTimesheet: SummaryTimesheet?;
        performaInvoice: PerformaInvoice?;
        invoice: Invoice?;
        workflowStage: ApprovalWorkflowStage;
        status: ApprovalStatus;
        approverUser: User;
        approverUserPosition: JobPosition;
        signature: UserSignature;
        remark: string;
    }
}