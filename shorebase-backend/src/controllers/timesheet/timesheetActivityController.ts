import { Request, Response } from "express"
import { ETQuery } from "../../components/EnterpriseTable"
import timesheetActivityET from "../../services/timesheetActivity/timesheetActivityService"
import { Timesheet } from "../../entity/timesheet/Timesheet"
import { Activity } from "../../entity/activity/Activity"
import { TimesheetActivity } from "../../entity/timesheet/TimesheetActivity"
import { error, time } from "console"


export const getTimesheetActivities = async (req: Request<{}, {}, {}, ETQuery>, res: Response) => {
    const result = await timesheetActivityET.findAll(req.query, 
        (qb) => qb.leftJoinAndSelect(`${qb.alias}.timesheet`, "timesheet").leftJoinAndSelect(`${qb.alias}.activity`, "activity"))
    
        res.send(result);
}

export const getTimesheetActivity = async (req: Request<{id: string}>, res: Response) => {
    const result = await timesheetActivityET.findByPk({id: parseInt(req.params.id)}, {relations: {timesheet: true, activity: true}})

    res.json(result);
}   

export const createTimesheetActivity = async (req: Request<{}, {}, {timesheetId: number, activityId: number, remark: string}>, res: Response) => {
    const timesheetActivity = new TimesheetActivity();
    timesheetActivity.timesheet = {id: req.body.timesheetId} as Timesheet;
    timesheetActivity.activity = {id: req.body.activityId} as Activity;
    timesheetActivity.remarks = req.body.remark;

    const data = timesheetActivityET.create(timesheetActivity);
    res.json(data);
}

export const updateTimesheetActivity = async (req: Request<{id: string}, {}, {timesheetId: number, activityId: number, remark: string}>, res: Response) => {
    
    
    const timesheetActivity = await timesheetActivityET.findByPk({id: parseInt(req.params.id)});

    if(!timesheetActivity){
        res.status(404).send({error: "Timesheet Activity Not Found"})
        return ;
    }

    timesheetActivity.timesheet = {id: req.body.timesheetId} as Timesheet;
    timesheetActivity.activity = {id: req.body.activityId} as Activity;
    timesheetActivity.remarks = req.body.remark;

    const data = timesheetActivityET.update(timesheetActivity);
    res.json(data);
}

export const deleteTimesheetActivity = async (req: Request<{id: string}>, res: Response) => {
    const timesheetActivity = await timesheetActivityET.findByPk({id: parseInt(req.params.id)});

    if(!timesheetActivity){
        res.status(404).send({error: "Timesheet Activity Not Found"})
        return ;
    }

    const data = timesheetActivityET.delete(timesheetActivity);
    res.json(data);
}