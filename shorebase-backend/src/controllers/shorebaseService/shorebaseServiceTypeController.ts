import { Request, Response } from "express";
import { ETQuery } from "../../components/EnterpriseTable";
import shorebaseServiceTypeET from "../../services/shorebaseServiceType/shorebaseServiceTypeService";
import { ShorebaseServiceType } from "../../entity/contractService/ShorebaseServiceType";
import { ESQuery } from "../../components/EnterpriseSelect";

export const getShorebaseServiceTypes = async (req: Request<{}, {}, {}, ETQuery>, res: Response) => {
    const result = await shorebaseServiceTypeET.findAll(req.query)
    res.send(result)
}

export const getShorebaseServiceTypeSelectOptions = async (req: Request<{}, {}, {}, ESQuery>, res: Response) => {
    const result = await shorebaseServiceTypeET.findSelectOptions(req.query);
    res.send(result);
}

export const getShorebaseServiceType = async (req: Request<{code: string}>, res: Response) => {
   const code = req.params.code
    const result = await shorebaseServiceTypeET.findByPk({code: code})
    res.json(result)
}

export const createShorebaseServiceType = async(req: Request<{}, {}, {code: string, name: string} >, res: Response): Promise<void> => {

    const existingSSType = await shorebaseServiceTypeET.findByPk({code: req.body.code})

    if(existingSSType){
        res.status(409).send({error: `ShorebaseServiceType with code ${req.body.code} already exists.`})
        return ;
        
    }


    const shorebaseServiceType = new ShorebaseServiceType();
    shorebaseServiceType.code = req.body.code;
    shorebaseServiceType.name = req.body.name;

    const data = await shorebaseServiceTypeET.create(shorebaseServiceType);
    res.json(data)
}

export const updateShorebaseServiceType = async(req: Request<{code: string}, {}, {name: string} >, res: Response): Promise<void> => {

    const shorebaseServiceType = await shorebaseServiceTypeET.findByPk({code: req.params.code});

    if(!shorebaseServiceType){
        res.status(404).send({error: `shorebaseServiceType not found`})
        return ;
        
    }
    shorebaseServiceType.name = req.body.name;

    const data = await shorebaseServiceTypeET.update(shorebaseServiceType);
    res.json(data)
}

export const deleteShorebaseServiceType = async(req: Request<{code:string}>, res: Response): Promise<void> =>{
    const shorebaseServiceType = await shorebaseServiceTypeET.findByPk({code: req.params.code});

    if(!shorebaseServiceType){
        res.status(404).send({error: `shorebaseServiceType not found`})
        return ;
    }

    const data = await shorebaseServiceTypeET.delete(shorebaseServiceType);
    res.json(data)
}