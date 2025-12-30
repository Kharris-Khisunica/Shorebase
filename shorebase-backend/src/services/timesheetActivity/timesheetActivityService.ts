import { EAServer } from "../../components/EnterpriseAutofill"
import { ESOption, ESServer } from "../../components/EnterpriseSelect"
import { ETServer } from "../../components/EnterpriseTable"
import { TimesheetActivity } from "../../entity/timesheet/TimesheetActivity"



class TimesheetActivityET extends ETServer<TimesheetActivity> {

    constructor(){
        super(TimesheetActivity);
    }

}

const timesheetActivityET = new TimesheetActivityET();

export default timesheetActivityET;