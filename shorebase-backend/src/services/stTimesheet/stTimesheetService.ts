import { ETServer } from "../../components/EnterpriseTable";
import { STTimesheet } from "../../entity/summaryTimesheet/STTimesheet";

class STTimesheetET extends ETServer<STTimesheet> {
    constructor(){
        super(STTimesheet)
    }
}

const stTimesheetET = new STTimesheetET();

export default stTimesheetET;