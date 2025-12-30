import { Request, Response } from "express";
import { ETQuery } from "../../components/EnterpriseTable";
import shorebaseServiceET from "../../services/shorebaseService/shorebaseService-Service";
import { DATE_CONSTANT } from "../../constants/time_constants";
import { DateTime } from "luxon";
import { ESQuery } from "../../components/EnterpriseSelect";
import { ShorebaseService } from "../../entity/contractService/ShorebaseService";
import { UoM } from "../../entity/contractService/UoM";
import { ShorebaseServiceProduct } from "../../entity/contractService/ShorebaseServiceProduct";
import { ShorebaseServiceType } from "../../entity/contractService/ShorebaseServiceType";

// Get ALL
export const getShorebaseServices = async (req: Request<{}, {}, {}, ETQuery>, res: Response) => {
    const result = await shorebaseServiceET.findAll(
        req.query,
        (qb) => qb.leftJoinAndSelect(`${qb.alias}.uom`, `uom`).leftJoinAndSelect(`${qb.alias}.ssType`, `ssType`)

    );
    res.send(result)
} 

// Get One
export const getShorebaseService = async(req: Request<{id: string}>, res: Response) => {
    const result = await shorebaseServiceET.findByPk({id: parseInt(req.params.id)})
    res.json(result)
}

// Get selected di options
export const getShorebaseServiceOptions = async(req: Request<{}, {}, {}, ESQuery>, res: Response) => {
    const result = await shorebaseServiceET.findSelectOptions(req.query)
    res.send(result)
}

// Get Autofill options
export const getShorebaseServiceAutofill = async(req: Request<{}, {}, {}, ESQuery>, res: Response) => {
    const result = await shorebaseServiceET.findSelectObject(req.query);
    res.send(result);
}

export const createShorebaseService = async(req: Request<{}, {}, 
    {
        code: string, 
        name: string, 
        description?: string, 
        shorebaseServiceProducts: {shorebaseServiceProductId: string}[],
        default_uom_code: string, 
        shorebaseServiceTypeCode: string,
        defaultPricePerUom: number, 
        active?: boolean, 
        startDate?: string, 
        endDate?: string
    }>, res: Response) => {
    const shorebaseService = new ShorebaseService();

    shorebaseService.code = req.body.code;
    shorebaseService.name = req.body.name;
    shorebaseService.description = req.body.description || "";
    
    
    shorebaseService.uom = {code: req.body.default_uom_code} as UoM;
    shorebaseService.ssType = {code: req.body.shorebaseServiceTypeCode} as ShorebaseServiceType;
    shorebaseService.defaultPricePerUom = req.body.defaultPricePerUom;
    shorebaseService.active = req.body.active || true;
    shorebaseService.startDate = req.body.startDate || DateTime.now().toISODate();
    shorebaseService.endDate = req.body.endDate || DATE_CONSTANT.MAX_VALUE

    const data = await shorebaseServiceET.create(shorebaseService);
    res.json(data)
}

export const updateShorebaseService = async(req: Request<{id: string}, {}, 
    {
        code: string, 
        name: string, 
        description?: string, 
        shorebaseServiceProducts: {shorebaseServiceProductId: string}[],
        default_uom_code: string, 
        shorebaseServiceTypeCode: string,
        defaultPricePerUom: number, 
        active?: boolean, 
        startDate?: string, 
        endDate?: string
    }>, res: Response) => {
    const shorebaseService = await shorebaseServiceET.findByPk({id: parseInt(req.params.id)});

    if(!shorebaseService){
       res.status(404).send({error: `shorebase service not found`})
        return ;
    }

    shorebaseService.code = req.body.code;
    shorebaseService.name = req.body.name;
    shorebaseService.description = req.body.description || "";

    shorebaseService.uom = {code: req.body.default_uom_code} as UoM;
    shorebaseService.ssType = {code: req.body.shorebaseServiceTypeCode} as ShorebaseServiceType;
    shorebaseService.defaultPricePerUom = req.body.defaultPricePerUom;
    shorebaseService.active = req.body.active || true;
    shorebaseService.startDate = req.body.startDate || DateTime.now().toISODate();
    shorebaseService.endDate = req.body.endDate || DATE_CONSTANT.MAX_VALUE

    const data = await shorebaseServiceET.update(shorebaseService);
    res.json(data)
}

export const deleteShorebaseService = async(req: Request<{id: string}>, res: Response):Promise<void> => {
    const shorebaseService = await shorebaseServiceET.findByPk({id: parseInt(req.params.id)});

    if(!shorebaseService){
        res.status(404).send({error: `shorebase service not found`})
        return ;
        
    }

    const data = await shorebaseServiceET.delete(shorebaseService)
    res.json(data)
}
