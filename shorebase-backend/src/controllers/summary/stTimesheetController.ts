import { ETQuery } from "../../components/EnterpriseTable";
import { Request, Response } from "express";
import stTimesheetET from "../../services/stTimesheet/stTimesheetService";
import { STTimesheet } from "../../entity/summaryTimesheet/STTimesheet";
import { Timesheet } from "../../entity/timesheet/Timesheet";
import { STComponent } from "../../entity/summaryTimesheet/STComponent";


export const getSTTimesheets = async (req: Request<{}, {},{}, ETQuery>, res:Response) => {
    const result = await stTimesheetET.findAll(
        req.query,
        (qb) => qb.leftJoinAndSelect(`${qb.alias}.stComponent`, "stComponent")
        .leftJoinAndSelect(`${qb.alias}.timesheet`, "timesheet")
    )
    res.send(result);
}

export const getSTTimesheet = async (req: Request<{id: string}>, res: Response) => {
    const result = await stTimesheetET.findByPk({id: parseInt(req.params.id)})
    res.json(result)
}

export const createSTTimesheet  = async (req: Request<{}, {}, {timesheetId: number, stComponentId: number}>, res: Response) => {
    const stTimesheet = new STTimesheet();

    stTimesheet.timesheet = {id: req.body.timesheetId} as Timesheet;
    stTimesheet.stComponent = {id: req.body.stComponentId} as STComponent;

    const data = stTimesheetET.create(stTimesheet);
    res.json(data);
}

export const updateSTTimesheet = async (req: Request<{id: string}, {}, {timesheetId: number, stComponentId: number}>, res: Response) => {
    const stTimesheet = await stTimesheetET.findByPk({id: parseInt(req.params.id)});

    if(!stTimesheet){
        res.status(404).send({error: "ST Timesheet not found"});
        return ;
    }

    stTimesheet.timesheet = {id: req.body.timesheetId} as Timesheet;
    stTimesheet.stComponent = {id: req.body.stComponentId} as STComponent;

    const data = stTimesheetET.update(stTimesheet);
    res.json(data);
}

export const deleteSTTimesheet = async (req: Request<{id: string}>, res: Response) => {
    const stTimesheet = await stTimesheetET.findByPk({id: parseInt(req.params.id)});

    if(!stTimesheet){
        res.status(404).send({error: "ST Timesheet not found"});
        return ;
    }

    const data = stTimesheetET.delete(stTimesheet);
    res.json(data)
}