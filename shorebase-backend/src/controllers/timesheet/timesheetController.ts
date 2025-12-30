import { Request, Response } from "express";
import { ETQuery } from "../../components/EnterpriseTable";
import timesheetET from "../../services/timesheet/timesheetService";
import { DATE_CONSTANT } from "../../constants/time_constants";
import { DateTime } from "luxon";
import { ESQuery } from "../../components/EnterpriseSelect";
import { Timesheet } from "../../entity/timesheet/Timesheet";
import { UoM } from "../../entity/contractService/UoM";

import { TimesheetType } from "../../entity/timesheet/TimesheetType";
import { ContractService } from "../../entity/contractService/ContractService";
import { SubContractor } from "../../entity/company/SubContractor";
import { Company } from "../../entity/company/Company";
import { ShorebaseService } from "../../entity/contractService/ShorebaseService";
import { time } from "console";
import { Activity } from "../../entity/activity/Activity";
import activityET from "../../services/activity/activityService";
import { In } from "typeorm";
import { TimesheetActivity } from "../../entity/timesheet/TimesheetActivity";
import timesheetActivityET from "../../services/timesheetActivity/timesheetActivityService";
import roman from 'roman-numerals'


export const getTimesheets = async (req: Request<{}, {}, {}, ETQuery>, res: Response) => {
    const result = await timesheetET.findAll(
        req.query,
        (qb) => qb
            .leftJoinAndSelect(`${qb.alias}.timesheetType`, `timesheetType`)
            .leftJoinAndSelect(`${qb.alias}.contractService`, `contractService`)
            .leftJoinAndSelect(`${qb.alias}.subContractor`, 'subContractor')
            .leftJoinAndSelect(`${qb.alias}.company`, 'company')
            .leftJoinAndSelect(`${qb.alias}.shorebaseService`, 'shorebaseService')
            .leftJoinAndSelect(`${qb.alias}.uom`,`uom`)
            .leftJoinAndSelect(`${qb.alias}.timesheetActivities`, 'timesheetActivities')
            .leftJoinAndSelect('timesheetActivities.activity', 'activity')
            .leftJoinAndSelect('activity.shorebaseService', 'activityShorebaseService')
    );
    res.send(result);
} 

// Get Company's Timesheet
// Route: /timesheet/company/:id
export const getCompanyTimesheets = async (req: Request<{companyId: string}, {}, {}, ETQuery>, res: Response) => {
    const result = await timesheetET.findAll(
        req.query,
        (qb) => qb
            .leftJoinAndSelect(`${qb.alias}.timesheetType`, `timesheetType`)
            .leftJoinAndSelect(`${qb.alias}.contractService`, `contractService`)
            .leftJoinAndSelect(`contractService.contract`, 'contract')
            .leftJoinAndSelect(`${qb.alias}.subContractor`, 'subContractor')
            .leftJoinAndSelect(`${qb.alias}.company`, 'company')
            .leftJoinAndSelect(`${qb.alias}.shorebaseService`, 'shorebaseService')
            .leftJoinAndSelect(`${qb.alias}.uom`,`uom`)
            .leftJoinAndSelect(`${qb.alias}.timesheetActivities`, 'timesheetActivities')
            .leftJoinAndSelect('timesheetActivities.activity', 'activity')
            .leftJoinAndSelect('activity.shorebaseService', 'activityShorebaseService')
            .leftJoinAndSelect('activity.uom', 'activityUom')
            .leftJoinAndSelect('activity.shorebaseServiceProduct', 'shorebaseServiceProduct')
            .where(`company.id = :companyId`, {companyId: parseInt(req.params.companyId)})
    );
    console.log('Timesheet company')
    console.log(result.data)
    res.send(result.data)
}

// Get One
export const getTimesheet = async(req: Request<{id: string}>, res: Response) => {
    const result = await timesheetET.findByPk({id: parseInt(req.params.id)}, {
      relations: [
        "timesheetType", "contractService", "contractService.contract","subContractor", "company", "shorebaseService", "uom",
        "timesheetActivities", "timesheetActivities.activity", "timesheetActivities.activity.shorebaseService",
        "timesheetActivities.activity.uom"
      ]
    });
    res.json(result);
}

// Get selected di options
export const getTimesheetSelectOptions = async(req: Request<{}, {}, {}, ESQuery>, res: Response) => {
    const result = await timesheetET.findSelectOptions(req.query)
    res.send(result)
}

export const createTimesheet = async(req: Request<{}, {}, {
    companyId?: string,
    shorebaseServiceId?: string,
    code: string,
    activities: {
        activityId: string,
        remark: string
    }[],
    issueDate: string,
    description: string,
}>, res: Response) => {
    console.log(`Masuk Create`)
    const timesheet = new Timesheet();

    // User inputed
    timesheet.company = {id: parseInt(req.body.companyId)} as Company // Dari params /timesheet/company/:id

    timesheet.shorebaseService = {id: parseInt(req.body.shorebaseServiceId)} as ShorebaseService
    timesheet.description = req.body.description
    
    // Asumsi
    // Activity yang dipilih adalah activity dengan startDate === activityDate
    // 1 Timesheet dipastikan memiliki activities dengan CS, SC, SS, UOM, dan TT yang sama. 

    // # Derived Value

    // Dari Activities -> CS, SC, SS, UOM, timesheetType
    const RequestedActivities = req.body.activities.map(act => parseInt(act.activityId)) // Ambil semua dari req

    const activities = await activityET.findAll({}, (qb) => qb.leftJoinAndSelect(`${qb.alias}.activityStatus`, `activityStatus`)
                    .leftJoinAndSelect(`${qb.alias}.timesheetType`, `timesheetType`)
                    .leftJoinAndSelect(`${qb.alias}.contractService`, `contractService`)
                    .leftJoinAndSelect(`${qb.alias}.subContractor`, 'subContractor')
                    .leftJoinAndSelect(`${qb.alias}.company`, 'company')
                    .leftJoinAndSelect(`${qb.alias}.shorebaseService`, 'shorebaseService')
                    .leftJoinAndSelect(`${qb.alias}.uom`,`uom`).where({id: In(RequestedActivities)}))
    console.log(`activites`)
    console.log(activities.data)
    if (!activities || activities.data.length === 0) {
        res.status(404).send({ error: "No matching activities found for the selected criteria. Cannot create timesheet." });
        return ;
    }
    const activity = activities.data[0]
    console.log('activity')
    console.log(activity)

    timesheet.timesheetType = activity.timesheetType
    timesheet.contractService = activity.contractService
    timesheet.subContractor = activity.subContractor
    timesheet.shorebaseService = activity.shorebaseService
    timesheet.uom = activity.uom
    

    // Total Amount -> Reduce dari activities.
    timesheet.totalAmount = activities.data.reduce((sum,act) => sum + act.actualAmount, 0)

    // Issue Date = Today
    timesheet.issueDate = req.body.issueDate;
    timesheet.createdAt = DateTime.now().toISO();

    timesheet.code = "";
    
    // Create TimesheetActivity
    if(req.body.activities && req.body.activities.length > 0){
        timesheet.timesheetActivities = req.body.activities.map(actDetail => {
            const timesheetActivity = new TimesheetActivity();

            timesheetActivity.activity = {id: parseInt(actDetail.activityId)} as Activity;
            timesheetActivity.remarks = actDetail.remark

            return timesheetActivity
        })

    
    }
    
    const createdTimesheet = await timesheetET.create(timesheet);

    // Ambil ID buat update code

    const createdAt = DateTime.fromISO(createdTimesheet.createdAt)
    const month = roman.toRoman(createdAt.month);
    const code = `${createdTimesheet.id}/TS-SHB/MBI/${month}/${createdAt.year}`
    createdTimesheet.code = code;

    const updatedTimesheet = await timesheetET.update(createdTimesheet)

    res.json(updatedTimesheet)
}

export const updateTimesheet = async(req: Request<{id: string}, {}, {
    companyId?: string,
    shorebaseServiceId?: string,
    code: string,
    activities: {
        activityId: string,
        remark: string
    }[],
    issueDate: string,
    description:string,
    
}>, res: Response) => {
    console.log("Ini Update")
    const timesheet = await timesheetET.findByPk({id: parseInt(req.params.id)}, {relations: {timesheetActivities: {activity: true}}});

    if(!timesheet){
       res.status(404).send({error: `timesheet not found`})
        return ;
    }

    // User inputed
    timesheet.company = {id: parseInt(req.body.companyId)} as Company // Dari params /timesheet/company/:id

    timesheet.shorebaseService = {id: parseInt(req.body.shorebaseServiceId)} as ShorebaseService
         timesheet.description = req.body.description
    
    // Asumsi
    // Activity yang dipilih adalah activity dengan startDate === activityDate
    // 1 Timesheet dipastikan memiliki activities dengan CS, SC, SS, UOM, dan TT yang sama. 

    // # Derived Value

    // Dari Activities -> CS, SC, SS, UOM, timesheetType
    const RequestedActivities = req.body.activities.map(act => parseInt(act.activityId)) // Ambil semua dari req

    const activities = await activityET.findAll({}, (qb) => qb.leftJoinAndSelect(`${qb.alias}.activityStatus`, `activityStatus`)
                    .leftJoinAndSelect(`${qb.alias}.timesheetType`, `timesheetType`)
                    .leftJoinAndSelect(`${qb.alias}.contractService`, `contractService`)
                    .leftJoinAndSelect(`${qb.alias}.subContractor`, 'subContractor')
                    .leftJoinAndSelect(`${qb.alias}.company`, 'company')
                    .leftJoinAndSelect(`${qb.alias}.shorebaseService`, 'shorebaseService')
                    .leftJoinAndSelect(`${qb.alias}.uom`,`uom`).where({id: In(RequestedActivities)}))
    console.log(`activites`)
    console.log(activities.data)
    if (!activities || activities.data.length === 0) {
        res.status(404).send({ error: "No matching activities found for the selected criteria. Cannot create timesheet." });
        return ;
    }
    const activity = activities.data[0]
    console.log('activity')
    console.log(activity)

    timesheet.timesheetType = activity.timesheetType
    timesheet.contractService = activity.contractService
    timesheet.subContractor = activity.subContractor
    timesheet.shorebaseService = activity.shorebaseService
    timesheet.uom = activity.uom


    // Total Amount -> Reduce dari activities.
    timesheet.totalAmount = activities.data.reduce((sum,act) => sum + act.actualAmount, 0)

    // Issue Date = Today
    timesheet.issueDate = req.body.issueDate;
    timesheet.createdAt = DateTime.now().toISO();

    
    // Update TimesheetActivity

    
    // Hapus 
    if (timesheet.timesheetActivities && timesheet.timesheetActivities.length > 0) {
        const deletePromises = timesheet.timesheetActivities.map(ta => timesheetActivityET.delete(ta));
        await Promise.all(deletePromises);
    }

    // Buat updated data
    timesheet.timesheetActivities = req.body.activities.map(actDetail => {
        const newTimesheetActivity = new TimesheetActivity();
        newTimesheetActivity.activity = { id: parseInt(actDetail.activityId) } as Activity;
        newTimesheetActivity.remarks = actDetail.remark;
        return newTimesheetActivity;
    }); 
    const data = await timesheetET.update(timesheet);
    console.log(`data = ${data}`)

    res.json(data)
}

export const deleteTimesheet = async(req: Request<{id: string}>, res: Response):Promise<void> => {
    console.log("Ini Delete")
     const timesheet = await timesheetET.findByPk({id: parseInt(req.params.id)}, {
        relations: {
            timesheetActivities: true
        }
    });

    if(!timesheet){
        res.status(404).send({error: `timesheet not found`})
        return ;
        
    }

    // hapus timesheetActivities dari Timesheet Activity
    if (timesheet.timesheetActivities && timesheet.timesheetActivities.length > 0) {
    const deleteActivityPromises = timesheet.timesheetActivities.map(
        ta => timesheetActivityET.delete(ta)
    );
    await Promise.all(deleteActivityPromises);
    }
    const data = await timesheetET.delete(timesheet)
    res.json(data)
}