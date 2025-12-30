export {Timesheet, TimesheetActivity, TimesheetAproval, TimesheetApprovalWorkflow, TimesheetApprovalWorkflowStage, TimesheetAprovalStatus, SummaryTimesheet}

declare global{
    type TimesheetTypeCode = 'C' | 'S' | 'I';
    interface TimesheetType{
        code: TimesheetTypeCode;
        name: string;
    }

    interface Timesheet{
        id: number;
        timesheetType: TimesheetType;
        contractService: ContractService?;
        subContractor: SubContractor?;
        company: Company?;
        shorebaseService: ShorebaseService?;
        uom: UoM?;
        totalAmount: number;
        issueDate: Date;
        code: string;
        timesheetActivities: TimesheetActivity[];
        sttimesheet: STTimesheet;
        description:string;
    }

    interface TimesheetActivity{
        id: number;
        activity: Activity;
        timesheet: Timesheet;
        remarks: string;
    }

    interface STTimesheet{
        id: number;
        stComponent: STComponent;
        timesheet: Timesheet;
    }

    interface STComponent{
        id: number;
        summaryTimesheet: SummaryTimesheet;
        contractService: ContractService?;
        shorebaseService: ShorebaseService?;
        uom: UoM?;
        pricePerUomContract: ContractServicePrice?;
        pricePerUomIndependent: ShorebaseServicePrice?;
        actualPricePerUom: number;
        aggAmount: number;
        remark:string;
        sttimesheets: STTimesheet[];
        
    }

    interface SummaryTimesheet{
        id: number;
        type: TimesheetType;
        contract: Contract;
        company: Company;
        periodStartDate: Date;
        periodEndDate: Date;
        issueDate: Date;
        code: string;
        stComponents: STComponent[];
    }
}