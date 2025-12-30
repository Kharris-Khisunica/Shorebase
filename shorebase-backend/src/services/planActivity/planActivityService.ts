import { Between, FindOptionsWhere, In, IsNull, Like, Not } from "typeorm";
import { ESOption, ESQuery, ESServer } from "../../components/EnterpriseSelect";
import { ETResult, ETServer } from "../../components/EnterpriseTable";
import { EAServer } from "../../components/EnterpriseAutofill";
import { PlanActivity } from "../../entity/planActivity/PlanActivity";

const getProperty = (obj: any, path: string): any => {
    return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
}

class PlanActivityET extends ETServer<PlanActivity> implements ESServer<PlanActivity>, EAServer<PlanActivity>{

    constructor(){
        super(PlanActivity)
    }

    toValueLabel(item: PlanActivity): ESOption {
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

    async findSelectObject(query: ESQuery): Promise<ETResult<PlanActivity & ESOption>> {
        const pageIndex = parseInt(query.pageIndex)  || 0;
        const pageSize = parseInt(query.pageSize) || 25;
                
        const valueField = query.valueField || "id"
        const labelField = query.labelField || "code"
                
        const qb = this.repository.createQueryBuilder("planActivity");

        // Add plan Activity relation
        qb
        .leftJoinAndSelect("planActivity.timesheetType", "timesheetType")
        .leftJoinAndSelect("planActivity.subContractor", "subContractor")
        .leftJoinAndSelect("planActivity.contractService", "contractService")
        .leftJoinAndSelect("contractService.company", "company")
        .leftJoinAndSelect("contractService.shorebaseService", "shorebaseService")
        .leftJoinAndSelect("shorebaseService.uom", "uom")
        .leftJoinAndSelect("contractService.contract", "contract")
            
        // Add spesific based on service's type. 
        

        // Handle custom filters
        if (query.customFilter) {
            const customFilter = JSON.parse(query.customFilter);
                    
        // if (customFilter.actualStartedAt) {
        //     const date = DateTime.fromISO(customFilter.actualStartedAt);
        //     qb.andWhere("activity.actualStartedAt BETWEEN :start AND :end", {
        //         start: date.startOf('day').toISO(),
        //         end: date.endOf('day').toISO()
        //     });
        // }
        if (customFilter.companyId) {
            // Filter directly on the foreign key for simplicity and reliability
            qb.andWhere("activity.companyId = :companyId", { companyId: customFilter.companyId });
        }
        if (customFilter.shorebaseServiceId) {
            // Filter directly on the foreign key
            qb.andWhere("activity.shorebaseServiceId = :shorebaseServiceId", { shorebaseServiceId: customFilter.shorebaseServiceId });
        }
        
        // if (customFilter.isNotUsedForTimesheet) {
        //     // The subquery to get used IDs remains the same
        //     const usedActivities = await AppDataSource.getRepository(TimesheetActivity)
        //         .createQueryBuilder("tsa")
        //         .select("tsa.activityId", "activityId")
        //         .where("tsa.activityId IS NOT NULL")
        //         .getRawMany();

        //     const usedActivityIds = usedActivities.map(a => a.activityId);

        //     if (usedActivityIds.length > 0) {
        //         // Use the NOT IN clause within the QueryBuilder
        //         qb.andWhere("activity.id NOT IN (:...usedActivityIds)", { usedActivityIds });
        //         }
        //     }
        // }
        }

        const [data, total] = await qb
            .skip(pageIndex * pageSize)
            .take(pageSize)
            .getManyAndCount();   

    
        const autofillData = data.map(c=>{
            const value = getProperty(c, valueField);
            const label = getProperty(c, labelField);

            // const planDateTime = c.planDate ? DateTime.fromISO(c.planDate).startOf("day").toFormat("yyyy-MM-dd'T'HH:mm") : undefined;

            return {
                ...c,
                value: value !== undefined && value !== null ? String(value) : "",
                label: label !== undefined && label !== null ?  String(label) : "",
                // planDateTime
            }
        })


    return{
        total,
        pageIndex,
        pageSize,
        data: autofillData
     }
    
           
    }

    async findDetailById(id: number): Promise<PlanActivity | null> {
        return this.repository.findOne({
            where: { id },
            relations: {
                timesheetType: true,
                company: true,
                shorebaseService: { ssType: true, uom: true},
                contractService: { contract: true },
                subContractor: {company: true},
                uom: true,
                status: true,
                // Relasi ke spesialisasi
                planActivityAccomodation: { planRoomType: true },
                planActivityMeal: true,
                planActivityMH: { planProduct: {uom: true} },
                planActivityJetty: { ship: true }
            }
        });
    }
}

const planActivityET = new PlanActivityET();

export default planActivityET;