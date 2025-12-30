import { Like } from "typeorm";
import { EAServer } from "../../components/EnterpriseAutofill";
import { ESOption, ESQuery, ESServer } from "../../components/EnterpriseSelect";
import { ETResult, ETServer } from "../../components/EnterpriseTable";
import { SummaryTimesheet } from "../../entity/summaryTimesheet/SummaryTimesheet";

const getProperty = (obj: any, path: string): any => {
    return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
}

class SummaryTimesheetET extends ETServer<SummaryTimesheet> implements ESServer<SummaryTimesheet>, EAServer<SummaryTimesheet>{
    constructor(){
        super(SummaryTimesheet)
    }

    toValueLabel(item: SummaryTimesheet): ESOption {
        return {value: item.id.toString(), label: item.code}
    }

    async findSelectOptions(query: ESQuery): Promise<ETResult<ESOption>> {
        const pageIndex = parseInt(query.pageIndex)  || 0;
        const pageSize = parseInt(query.pageSize) || 25;
        const [data,total] = await this.repository.findAndCount({
            where: {
                code: Like(`%${query.search}%`)
            },
            relations: {
                timesheetType: true,
                contract: true, 
                company: true
            },
            take: pageSize,
            skip: pageIndex * pageSize
        });
        console.log("Summary Timesheet data = ")
        console.log(data.values)
        const options = data.map(c=>this.toValueLabel(c))
        return{
                total,
                pageIndex,
                pageSize,
                data: options
        }
    }

    async findSelectObject(query: ESQuery): Promise<ETResult<SummaryTimesheet & ESOption>> {
        const pageIndex = parseInt(query.pageIndex)  || 0;
        const pageSize = parseInt(query.pageSize) || 25;
        const valueField = query.valueField || "id"
        const labelField = query.labelField || "code"
                
        const [data,total] = await this.repository.findAndCount({
            where: {
                code: Like(`%${query.search}%`)
            },
            relations: {
                timesheetType: true,
                contract: true, 
                company: true
            },
            take: pageSize,
            skip: pageIndex * pageSize
        });
        console.log("Summary Timesheet data = ")
        console.log(data.values)
        const autofillData = data.map(c=>{
            const value = getProperty(c, valueField);
            const label = getProperty(c, labelField);
            return {
                    ...c,
                    value: value !== undefined && value !== null ? String(value) : "",
                    label: label !== undefined && label !== null ?  String(label) : "",       
            }
        })
        return{
                total,
                pageIndex,
                pageSize,
                data: autofillData
        }
    }
    
}

const summaryTimesheetET = new SummaryTimesheetET();

export default summaryTimesheetET;