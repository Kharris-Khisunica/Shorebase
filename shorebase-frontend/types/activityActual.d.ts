import type { DateTime } from "luxon";

declare global{

    interface ActualActivity{
        id: number;
        planActivity: PlanActivity;
        timesheetType: TimesheetType;
        contractService: ContractService;
        subContractor: SubContractor;
        company: Company;
        shorebaseService: ShorebaseService;
        uom: UoM;
        description: string;
        code: string;
        status: ActivityStatus;
        remark: string;

        actualActivityMH: ActualActivityMH;
        actualActivityMeal: ActualActivityMeal;
        actualActivityAccomodation: ActualActivityAccomodation;
        actualActivityJetty: ActualActivityJeety;
    }
    
    // Include: Stevedoring, Cargodoring, Single Tonnage Lifting
    interface ActualActivityMH{
        id: number;
        actualActivity: ActualActivity;
        actualAmount: number; // Dalam MT / Sesuai uom service
        actualStartedAt: DateTime;
        actualEndedAt: DateTime;
        actualDescription: string;
        actualProduct: ShorebaseServiceProduct;
        actualProductQty: number;
        equipment: Equipment;
        actualRemark: string;
    }

    interface ActualActivityMeal{
        id: number;
        actualActivity: ActualActivity;
        actualStartDate: Date;
        actualEndDate: Date;
        actualPeopleCount: number;
        // Apakah ada ambil breakfast/lunch/dinner. True = Ambil. 
        actualBreakfast: boolean;
        actualLunch: boolean;
        actualDinner: boolean;
    }

    interface ActualActivityAccomodation{
        id: number;
        actualActivity: ActualActivity;
        actualCheckIn: DateTime;
        actualCheckOut: DateTime;
        actualRoomCount: number;
        actualRoomType: RoomType;
    }

    // Include: Birthing Operation, Birthing Standby
    interface ActualActivityJeety{
        id: number;
        actualActivity: ActualActivity;
        actualStartedAt: DateTime; // ?
        actualEndedAt: DateTime;
        ship: Ship;
        // actualJenisLayanan ?
    }
}