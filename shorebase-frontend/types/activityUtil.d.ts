import type { DateTime } from "luxon";

export { ActivityPlanned, ActivityActual, ActivityActualType };

declare global {
    interface Activity {
        id: number;
        activityStatus: ActivityStatus;
        timesheetType: TimesheetType;  
        
        planActivity: Activity?;

        contractService: ContractService?;
        subContractor: SubContractor?;
        company: Company?;
        shorebaseService: ShorebaseService?;
        uom: UoM?;
        shorebaseServiceProduct: ShorebaseServiceProduct?;
        productUom: UoM?;

        code: string;

        planProductQty: number?;
        planAmount: number?;
        planDate: Date?;
        planDescription: string?;

        actualProductQty: number;
        actualAmount: number;
        equipment: Equipment;
        actualStartedAt: DateTime?;
        actualEndedAt: DateTime?;
        actualDescription: string?;
    }

    // open / on process / closed
    interface ActivityStatus {
        code: string;
        name: string
    }

    interface Equipment{
        id: number;
        code: string;
        name: string;
    }

    interface RoomType{
        id: number;
        code: string; // Single or Double. 
        name: string;
    }

    interface Ship{
        id: number;
        code: string;
        name: string;
    }
}
