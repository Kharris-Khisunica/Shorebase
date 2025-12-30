import type { DateTime } from "luxon";

declare global{

    interface PlanActivity{
        id: number;
        timesheetType: TimesheetType;
        contractService: ContractService;
        subContractor: SubContractor;
        company: Company;
        shorebaseServiceType: ShorebaseServiceType;
        shorebaseService: ShorebaseService;
        uom: UoM;
        description: string;
        remark: string;
        code: string;
        status: ActivityStatus;

        planActivityMH: PlanActivityMH;
        planActivityMeal: PlanActivityMeal;
        planActivityAccomodation: PlanActivityAccomodation;
        planActivityJetty: PlanActivityJeety;
    }
    
    // Include: Stevedoring, Cargodoring, Single Tonnage Lifting
    interface PlanActivityMH{
        id: number;
        planActivity: PlanActivity;
        planStartDate: Date;
        planProduct: ShorebaseServiceProduct;
        planProductQty: number;
    }

    interface PlanActivityMeal{
        id: number;
        planActivity: PlanActivity;
        planStartDate: Date;
        planEndDate: Date;
        planPeopleCount: number;
        // Apakah ada ambil breakfast/lunch/dinner. True = Ambil. 
        planBreakfast: boolean;
        planLunch: boolean;
        planDinner: boolean;
    }

    interface PlanActivityAccomodation{
        id: number;
        planActivity: PlanActivity;
        planCheckIn: DateTime;
        planCheckOut: DateTime;
        planRoomCount: number;
        planRoomType: RoomType;
    }

    // Include: Birthing Operation, Birthing Standby
    interface PlanActivityJeety{
        id: number;
        planActivity: PlanActivity;
        planStartedAt: DateTime;
        ship: Ship;
        // planJenisLayanan ?
    }
}