import { Request, Response } from "express";
import { ETQuery } from "../../components/EnterpriseTable";
import activityET from "../../services/activity/activityService";
import { DATE_CONSTANT } from "../../constants/time_constants";
import { DateTime } from "luxon";
import { ESQuery } from "../../components/EnterpriseSelect";
import { Activity } from "../../entity/activity/Activity";
import { UoM } from "../../entity/contractService/UoM";
import { ActivityStatus } from "../../entity/activity/ActivityStatus";
import { TimesheetType } from "../../entity/timesheet/TimesheetType";
import { ContractService } from "../../entity/contractService/ContractService";
import { SubContractor } from "../../entity/company/SubContractor";
import { Company } from "../../entity/company/Company";
import { ShorebaseService } from "../../entity/contractService/ShorebaseService";
import { AppDataSource } from "../../dataSource";
import { Equipment } from "../../entity/activity/Equipment";
import { ShorebaseServiceProduct } from "../../entity/contractService/ShorebaseServiceProduct";

// Get ALL
export const getActivities = async (req: Request<{}, {}, {}, ETQuery>, res: Response) => {
    const result = await activityET.findAll(
        req.query,
        (qb) =>qb.leftJoinAndSelect(`${qb.alias}.activityStatus`, `activityStatus`)
                    .leftJoinAndSelect(`${qb.alias}.timesheetType`, `timesheetType`)
                    .leftJoinAndSelect(`${qb.alias}.contractService`, `contractService`)
                    .leftJoinAndSelect(`contractService.contract`, `contract_alias`)
                    .leftJoinAndSelect(`${qb.alias}.subContractor`, 'subContractor')
                    .leftJoinAndSelect(`${qb.alias}.company`, 'company')
                    .leftJoinAndSelect(`${qb.alias}.shorebaseService`, 'shorebaseService')
                    .leftJoinAndSelect(`${qb.alias}.shorebaseServiceProduct`, 'shorebaseServiceProduct')
                    .leftJoinAndSelect(`${qb.alias}.uom`,`uom`)
                    .leftJoinAndSelect(`${qb.alias}.equipment`, 'equipment')
                    // .leftJoinAndSelect(`${qb.alias}.planActivity`, 'planActivity')            
    );

    res.send(result);
} 

// Get One
export const getActivity = async(req: Request<{id: string}>, res: Response) => {
    const result = await activityET.findByPk({id: parseInt(req.params.id)})
    res.json(result)
}

// Get selected di options
export const getActivitySelectOptions = async(req: Request<{}, {}, {}, ESQuery>, res: Response) => {
    const result = await activityET.findSelectOptions(req.query)
    res.send(result)
}

export const getActivityAutofillOptions = async(req: Request<{}, {}, {},ESQuery>, res: Response) => {
    const result = await activityET.findSelectObject(req.query)
    res.send(result);
} 

export const createActivity = async(req: Request<{}, {}, {
    statusCode: string,
    typeCode: string,
    planActivityId?: string,
    contractServiceId?: string,
    subContractorId?: string,
    companyId?: string,
    shorebaseServiceId?: string,
    shorebaseServiceProductId?: string,
    contractId: string,
    uomCode?: string,
    // code: string,
    planProductQty?:number,
    planAmount?: number,
    planDate?: string,
    planDescription?: string,
    actualProductQty?: number,
    actualAmount?: number,
    actualStartedAt?: string,
    actualEndedAt?: string,
    actualDescription?: string,
    equipmentId?: string
}>, res: Response) => {
    const activity = new Activity();
    

    activity.activityStatus = {code: req.body.statusCode} as ActivityStatus
    activity.timesheetType = {code: req.body.typeCode} as TimesheetType
    activity.planActivityId = req.body.planActivityId;


    // Isi Contract Service berdasarkan service dan contract dari FE. 
    const csRepo = AppDataSource.getRepository(ContractService);
    const selectedCS = await csRepo.findOne({
        where:{
            contract: {id: parseInt(req.body.contractId)},
            shorebaseService: {id: parseInt(req.body.shorebaseServiceId)}
        }
    })
    activity.contractService = selectedCS ? selectedCS : undefined;

    // activity.contractService = (activity.timesheetType.code === 'C' || activity.timesheetType.code === 'S')? {id: parseInt(req.body.contractServiceId)} as ContractService : undefined
    activity.subContractor = (activity.timesheetType.code === 'S') ? {id: parseInt(req.body.subContractorId)} as SubContractor : undefined
    activity.company = {id: parseInt(req.body.companyId)} as Company
    activity.shorebaseService =  {id: parseInt(req.body.shorebaseServiceId)} as ShorebaseService 
    activity.uom = {code: req.body.uomCode} as UoM 
    activity.shorebaseServiceProduct = {id: parseInt(req.body.shorebaseServiceProductId)} as ShorebaseServiceProduct

    activity.code = ""; 
    
    activity.planProductQty = (activity.activityStatus.code === 'P') ? req.body.planProductQty : undefined;
    activity.planAmount = (activity.activityStatus.code === 'P') ? req.body.planAmount : undefined;
    activity.planDate = (activity.activityStatus.code === 'P') ? req.body.planDate || DateTime.now().toISODate() : undefined;
    activity.planDescription = (activity.activityStatus.code === 'P') ? req.body.planDescription || "" : undefined;

    activity.actualProductQty = (activity.activityStatus.code === 'A') ? req.body.actualProductQty : undefined;
    activity.actualAmount = (activity.activityStatus.code === 'A') ? req.body.actualAmount : undefined;
    activity.actualStartedAt = (activity.activityStatus.code === 'A') ? req.body.actualStartedAt || activity.contractService.startDate || DateTime.now().toISO() : undefined;
    activity.actualEndedAt = (activity.activityStatus.code === 'A') ? req.body.actualEndedAt || activity.contractService.endDate : undefined;
    activity.actualDescription = (activity.activityStatus.code === 'A') ? req.body.actualDescription || "": undefined ;
    activity.equipment = (activity.activityStatus.code === 'A') ? {id: parseInt(req.body.equipmentId)} as Equipment : undefined ;    

    // if(req.body.planActivityId && activity.activityStatus.code === 'A'){
    //     const selectedPlannedActivity = await activityET.findByPk({id: parseInt(req.body.planActivityId)});
    //     if(selectedPlannedActivity){
    //     const data = await activityET.delete(selectedPlannedActivity);
    //     res.json(data)
    //     }
    // }
    const createdActivity = await activityET.create(activity);

    // Ambil ID buat update code

    const shorebaseServiceName = createdActivity.shorebaseService.name;
    const activityStatus = createdActivity.activityStatus.code;
    const type = createdActivity.timesheetType.name;
    const contractorName = createdActivity.company.name;
    const subContractorName = createdActivity.subContractor?.company?.name || "";
    const createdAt = DateTime.fromISO(createdActivity.actualStartedAt)
    const date = createdAt.toISODate()
    const code = `${createdActivity.id}/${activityStatus}/ACT/${shorebaseServiceName}/${type}/${contractorName}/${date}`
    createdActivity.code = code;

    const updatedActivity = await activityET.update(createdActivity)
    res.json(updatedActivity)
}

export const updateActivity = async(req: Request<{id: string}, {}, {
    statusCode: string,
    typeCode: string,
    // contractServiceId?: string,
    contractId?: string
    subContractorId?: string,
    companyId?: string,
    shorebaseServiceId?: string,
    uomCode?: string,
    shorebaseServiceProductId?: string,
    // code: string,
    planProductQty?:number,
    planAmount?: number,
    planDate?: string,
    planDescription?: string,
    actualProductQty?: number,
    actualAmount?: number,
    actualStartedAt?: string,
    actualEndedAt?: string,
    actualDescription?: string,
    equipmentId?: string

}>, res: Response) => {
    console.log("Ini masuk update")
    console.log("Req.body: ")
    console.log(req.body);
    const activity = await activityET.findByPk({id: parseInt(req.params.id)});

    if(!activity){
       res.status(404).send({error: `activity not found`})
        return ;
    }

    activity.activityStatus = {code: req.body.statusCode} as ActivityStatus
    activity.timesheetType = {code: req.body.typeCode} as TimesheetType
    

    const csRepo = AppDataSource.getRepository(ContractService);
    const selectedCS = await csRepo.findOne({
        where:{
            contract: {id: parseInt(req.body.contractId)},
            shorebaseService: {id: parseInt(req.body.shorebaseServiceId)}
        }
    })
    activity.contractService = selectedCS ? selectedCS : undefined;

    activity.subContractor = (activity.timesheetType.code === 'S') ? {id: parseInt(req.body.subContractorId)} as SubContractor : undefined
    activity.company = {id: parseInt(req.body.companyId)} as Company
    activity.shorebaseService = {id: parseInt(req.body.shorebaseServiceId)} as ShorebaseService 
    activity.uom = {code: req.body.uomCode} as UoM 
    activity.shorebaseServiceProduct = {id: parseInt(req.body.shorebaseServiceProductId)} as ShorebaseServiceProduct

    // activity.code = req.body.code 
    
    activity.planProductQty = (activity.activityStatus.code === 'P') ? req.body.planProductQty : undefined;
    activity.planAmount = (activity.activityStatus.code === 'P') ? req.body.planAmount : undefined;
    activity.planDate = (activity.activityStatus.code === 'P') ? req.body.planDate || DateTime.now().toISODate() : undefined;
    activity.planDescription = (activity.activityStatus.code === 'P') ? req.body.planDescription || "" : undefined;

    activity.actualProductQty = (activity.activityStatus.code === 'A') ? req.body.actualProductQty : undefined;
    activity.actualAmount = (activity.activityStatus.code === 'A') ? req.body.actualAmount : undefined;
    activity.actualStartedAt = (activity.activityStatus.code === 'A') ? req.body.actualStartedAt || activity.contractService.startDate || DateTime.now().toISO() : undefined;
    activity.actualEndedAt = (activity.activityStatus.code === 'A') ? req.body.actualEndedAt || activity.contractService.endDate : undefined;
    activity.actualDescription = (activity.activityStatus.code === 'A') ? req.body.actualDescription || "": undefined ;
    activity.equipment = (activity.activityStatus.code === 'A') ? {id: parseInt(req.body.equipmentId)} as Equipment : undefined ;    

    const data = await activityET.update(activity);
    res.json(data)
}

export const deleteActivity = async(req: Request<{id: string}>, res: Response):Promise<void> => {
    console.log("Ini masuk delete")
    console.log("Req.params")
    console.log(req.params)
    const activity = await activityET.findByPk({id: parseInt(req.params.id)});

    if(!activity){
        res.status(404).send({error: `activity not found`})
        return ;
        
    }

    const data = await activityET.delete(activity)
    res.json(data)
}
