import { Like } from "typeorm";
import { ESOption, ESQuery, ESServer } from "../../components/EnterpriseSelect";
import { ETResult, ETServer } from "../../components/EnterpriseTable";
import { Timesheet } from "../../entity/timesheet/Timesheet";

class TimesheetET extends ETServer<Timesheet> implements ESServer<Timesheet>{
    constructor(){
        super(Timesheet);
    }    

    toValueLabel(item: Timesheet): ESOption {
        return {value: item.id.toString(), label: item.code}
    }

    async findSelectOptions(query: ESQuery): Promise<ETResult<ESOption>> {
        const pageIndex = parseInt(query.pageIndex)  || 0;
                const pageSize = parseInt(query.pageSize) || 25;
        
                const [data,total] = await this.repository.findAndCount({
                    where: {
                        code: Like(`%${query.search}%`)
                    },
                    relations: ["timesheetType", "contractService", "subContractor", "company", "shorebaseService", "uom"],
                    take: pageSize,
                    skip: pageIndex * pageSize
                });
        
                const options = data.map(c=>this.toValueLabel(c))
                return{
                    total,
                    pageIndex,
                    pageSize,
                    data: options
                }
    }
    
}
const timesheetET = new TimesheetET();

export default timesheetET;