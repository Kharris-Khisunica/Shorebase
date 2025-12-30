import { ETQuery } from "../../components/EnterpriseTable";
import { Request, Response } from "express";
import stComponentET from "../../services/stComponent/stComponentService";
import { STComponent } from "../../entity/summaryTimesheet/STComponent";
import { NumberingSystem } from "luxon";
import { SummaryTimesheet } from "../../entity/summaryTimesheet/SummaryTimesheet";
import { ContractService } from "../../entity/contractService/ContractService";
import { ShorebaseService } from "../../entity/contractService/ShorebaseService";
import { UoM } from "../../entity/contractService/UoM";
import { stderr } from "process";
import { error } from "console";

export const getSTComponents = async (req: Request<{}, {}, {}, ETQuery>, res: Response) => {
    const result = await stComponentET.findAll(
        req.query, 
        (qb) => qb.leftJoinAndSelect(`${qb.alias}.summaryTimesheet`, "summaryTimesheet")
                    .leftJoinAndSelect(`${qb.alias}.contractService`, "contractService")
                    .leftJoinAndSelect(`${qb.alias}.shorebaseService`, "shorebaseService")
                    .leftJoinAndSelect(`${qb.alias}.uom`, "uom")
                    .leftJoinAndSelect(`${qb.alias}.contractServicePrice`, "contractServicePrice")
                    .leftJoinAndSelect(`${qb.alias}.shorebaseServicePrice`, "shorebaseServicePrice")
    )
    res.send(result);
}

export const getSTComponent = async (req:Request<{id: string}>, res: Response) => {
    const result = await stComponentET.findByPk({id: parseInt(req.params.id)});
    res.json(result)
}

export const createSTComponent = async (req: Request<{}, {}, {
    summaryTimesheetId: number,
    contractServiceId: number,
    shorebaseServiceId: number,
    uomCode: string,
    pricePerUomContract?:number,
    pricePerUomIndependent?: number,
    actualPricePerUom: number,
}> , res: Response) => {
    const stComponent = new STComponent();

    stComponent.summaryTimesheet = {id: req.body.summaryTimesheetId} as SummaryTimesheet;
    stComponent.contractService = {id: req.body.contractServiceId} as ContractService;
    stComponent.shorebaseService = {id: req.body.shorebaseServiceId} as ShorebaseService;
    stComponent.uom = {code: req.body.uomCode} as UoM;
    stComponent.pricePerUomContract = req.body.pricePerUomContract || undefined;
    stComponent.pricePerUomIndependent = req.body.pricePerUomContract || undefined;

    const data = stComponentET.create(stComponent);
    res.json(data)
}

export const updateSTComponent = async (req: Request<{id: string}, {}, {
    summaryTimesheetId: number,
    contractServiceId: number,
    shorebaseServiceId: number,
    uomCode: string,
    pricePerUomContract?:number,
    pricePerUomIndependent?: number,
    actualPricePerUom: number,
}> , res: Response) => {
    const stComponent = await stComponentET.findByPk({id: parseInt(req.params.id)});

    if(!stComponent){
        res.status(404).send({error: "ST Component Not Found"})
    }


    stComponent.summaryTimesheet = {id: req.body.summaryTimesheetId} as SummaryTimesheet;
    stComponent.contractService = {id: req.body.contractServiceId} as ContractService;
    stComponent.shorebaseService = {id: req.body.shorebaseServiceId} as ShorebaseService;
    stComponent.uom = {code: req.body.uomCode} as UoM;
    stComponent.pricePerUomContract = req.body.pricePerUomContract || undefined;
    stComponent.pricePerUomIndependent = req.body.pricePerUomContract || undefined;

    const data = stComponentET.update(stComponent);
    res.json(data)
}

export const deleteSTComponent = async (req: Request<{id: string}> , res: Response) => {
    const stComponent = await stComponentET.findByPk({id: parseInt(req.params.id)});
    
    if(!stComponent){
        res.status(404).send({error: "ST Component Not Found"})
    }

    const data = stComponentET.delete(stComponent);
    res.json(data)
}
