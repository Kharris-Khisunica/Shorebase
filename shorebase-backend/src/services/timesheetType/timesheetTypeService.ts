import { Like } from "typeorm";
import { ESOption, ESQuery, ESServer } from "../../components/EnterpriseSelect";
import { ETResult, ETServer } from "../../components/EnterpriseTable";
import { TimesheetType } from "../../entity/timesheet/TimesheetType";

class TimesheetTypeET extends ETServer<TimesheetType> implements ESServer<TimesheetType>{
    constructor(){
        super(TimesheetType);
    }    

    toValueLabel(item: TimesheetType): ESOption {
        return {value: item.code, label: item.name}
    }

    async findSelectOptions(query: ESQuery): Promise<ETResult<ESOption>> {
        const pageIndex = parseInt(query.pageIndex)  || 0;
                const pageSize = parseInt(query.pageSize) || 25;
        
                const [data,total] = await this.repository.findAndCount({
                    where: {
                        name: Like(`%${query.search}%`)
                    },
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
const timesheetTypeET = new TimesheetTypeET();

export default timesheetTypeET;