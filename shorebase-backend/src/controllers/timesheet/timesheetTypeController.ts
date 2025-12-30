import { Request, Response } from "express";
import { ETQuery } from "../../components/EnterpriseTable";
import timesheetTypeET from "../../services/timesheetType/timesheetTypeService";
import { TimesheetType } from "../../entity/timesheet/TimesheetType";
import { ESQuery } from "../../components/EnterpriseSelect";

export const getTimesheetTypes = async (req: Request<{}, {}, {}, ETQuery>, res: Response) => {
    const result = await timesheetTypeET.findAll(req.query)
    res.send(result)
}

export const getTimesheetTypeSelectOptions = async (req: Request<{}, {}, {}, ESQuery>, res: Response) => {
    const result = await timesheetTypeET.findSelectOptions(req.query);
    res.send(result);
}

export const getTimesheetType = async (req: Request<{code: string}>, res: Response) => {
   const code = req.params.code
    const result = await timesheetTypeET.findByPk({code: code})
    res.json(result)
}

export const createTimesheetType = async(req: Request<{}, {}, {code: string, name: string} >, res: Response): Promise<void> => {

    const existingTimesheetType = await timesheetTypeET.findByPk({code: req.body.code})

    if(existingTimesheetType){
        res.status(409).send({error: `TimesheetType with code ${req.body.code} already exists.`})
        return ;
        
    }


    const timesheetType = new TimesheetType();
    timesheetType.code = req.body.code;
    timesheetType.name = req.body.name;

    const data = await timesheetTypeET.create(timesheetType);
    res.json(data)
}

export const updateTimesheetType = async(req: Request<{code: string}, {}, {name: string} >, res: Response): Promise<void> => {

    const timesheetType = await timesheetTypeET.findByPk({code: req.params.code});

    if(!timesheetType){
        res.status(404).send({error: `timesheetType not found`})
        return ;
        
    }
    timesheetType.name = req.body.name;

    const data = await timesheetTypeET.update(timesheetType);
    res.json(data)
}

export const deleteTimesheetType = async(req: Request<{code:string}>, res: Response): Promise<void> =>{
    const timesheetType = await timesheetTypeET.findByPk({code: req.params.code});

    if(!timesheetType){
        res.status(404).send({error: `timesheetType not found`})
        return ;
    }

    const data = await timesheetTypeET.delete(timesheetType);
    res.json(data)
}