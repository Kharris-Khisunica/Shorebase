import { Request, Response } from "express";
import { ETQuery } from "../../components/EnterpriseTable";
import activityStatusET from "../../services/activityStatus/activityStatusService";
import { ActivityStatus } from "../../entity/activity/ActivityStatus";
import { ESQuery } from "../../components/EnterpriseSelect";

export const getActivityStatuses = async (req: Request<{}, {}, {}, ETQuery>, res: Response) => {
    const result = await activityStatusET.findAll(req.query)
    res.send(result)
}

export const getActivityStatusSelectOptions = async (req: Request<{}, {}, {}, ESQuery>, res: Response) => {
    const result = await activityStatusET.findSelectOptions(req.query);
    res.send(result);
}

export const getActivityStatus = async (req: Request<{code: string}>, res: Response) => {
   const code = req.params.code
    const result = await activityStatusET.findByPk({code: code})
    res.json(result)
}

export const createActivityStatus = async(req: Request<{}, {}, {code: string, name: string} >, res: Response): Promise<void> => {

    const existingActivityStatus = await activityStatusET.findByPk({code: req.body.code})

    if(existingActivityStatus){
        res.status(409).send({error: `ActivityStatus with code ${req.body.code} already exists.`})
        return ;
        
    }


    const activityStatus = new ActivityStatus();
    activityStatus.code = req.body.code;
    activityStatus.name = req.body.name;

    const data = await activityStatusET.create(activityStatus);
    res.json(data)
}

export const updateActivityStatus = async(req: Request<{code: string}, {}, {name: string} >, res: Response): Promise<void> => {

    const activityStatus = await activityStatusET.findByPk({code: req.params.code});

    if(!activityStatus){
        res.status(404).send({error: `activityStatus not found`})
        return ;
        
    }
    activityStatus.name = req.body.name;

    const data = await activityStatusET.update(activityStatus);
    res.json(data)
}

export const deleteActivityStatus = async(req: Request<{code:string}>, res: Response): Promise<void> =>{
    const activityStatus = await activityStatusET.findByPk({code: req.params.code});

    if(!activityStatus){
        res.status(404).send({error: `activityStatus not found`})
        return ;
    }

    const data = await activityStatusET.delete(activityStatus);
    res.json(data)
}