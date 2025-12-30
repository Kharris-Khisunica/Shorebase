
declare global{

    interface PerformaInvoice{
        id: number;
        summaryTimesheet: SummaryTimesheet;
        issueDate: Date;
    }

    interface Invoice{
        id: number;
        performaInvoice: PerformaInvoice;
        issueDate: Date;
        taxPercentage: number;
    }
}