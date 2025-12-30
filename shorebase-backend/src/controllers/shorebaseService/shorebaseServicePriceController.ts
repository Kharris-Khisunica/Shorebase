import { ETQuery } from "../../components/EnterpriseTable";
import shorebaseServicePriceET from "../../services/shorebaseServicePrice/shorebaseServicePriceService";
import { ShorebaseServicePrice } from "../../entity/contractService/ShorebaseServicePrice";
import { Request, Response } from "express";
import { DATE_CONSTANT } from "../../constants/time_constants";
import { DateTime } from "luxon";
import { ShorebaseService } from "../../entity/contractService/ShorebaseService";
import { Company } from "../../entity/company/Company";

export const getShorebaseServicePrices = async (req: Request<{}, {}, {}, ETQuery>, res: Response)=>{
    const result = await shorebaseServicePriceET.findAll(req.query, 
        (qb)=>qb.leftJoinAndSelect(`${qb.alias}.shorebaseService`, `shorebaseService`)
                .leftJoinAndSelect(`${qb.alias}.company`, `company`)
    )

    res.send(result);
}

export const getShorebaseServicePrice = async (req: Request<{id: string}>, res: Response) => {
    const data = await shorebaseServicePriceET.findByPk({id: parseInt(req.params.id)}, 
    {relations: {
        shorebaseService: true,
        company: true
    }
    }
);
    res.json(data);
}

export const createShorebaseServicePrice = async (req: Request<{}, {}, {shorebaseServiceId: number, companyId: number, pricePerUom: number, startDate?: string, endDate?: string }>, res: Response) => {
    const shorebaseServicePrice = new ShorebaseServicePrice();
    shorebaseServicePrice.shorebaseService = {id: req.body.shorebaseServiceId} as ShorebaseService;
    shorebaseServicePrice.company = {id: req.body.companyId} as Company;
    shorebaseServicePrice.pricePerUom = req.body.pricePerUom;
    shorebaseServicePrice.startDate = req.body.startDate || DateTime.now().toISODate();
    shorebaseServicePrice.endDate = req.body.endDate || DATE_CONSTANT.MAX_VALUE;

    const data = await shorebaseServicePriceET.create(shorebaseServicePrice);
    res.json(data)
}

export const updateShorebaseServicePrice = async (req: Request<{id: string}, {}, {shorebaseServiceId: number, companyId: number, pricePerUom: number, startDate?: string, endDate?: string }>, res: Response) =>{
    const shorebaseServicePrice = await shorebaseServicePriceET.findByPk({id: parseInt(req.params.id)})

    if(!shorebaseServicePrice){
        res.status(404).send({error: 'Shorebase Service Price not found'})
        return ;
    }
    shorebaseServicePrice.shorebaseService = {id: req.body.shorebaseServiceId} as ShorebaseService;
    shorebaseServicePrice.company = {id: req.body.companyId} as Company;
    shorebaseServicePrice.pricePerUom = req.body.pricePerUom;
    shorebaseServicePrice.startDate = req.body.startDate || DateTime.now().toISODate();
    shorebaseServicePrice.endDate = req.body.endDate || DATE_CONSTANT.MAX_VALUE;

    const data = await shorebaseServicePriceET.create(shorebaseServicePrice);
    res.json(data)
}

export const deleteShorebaseServicePrice = async (req: Request<{id: string}>, res: Response) => {
    const shorebaseServicePrice = await shorebaseServicePriceET.findByPk({id: parseInt(req.params.id)})
    if(!shorebaseServicePrice){
        res.status(404).send({error: 'Shorebase Service Price not found'})
        return ;
    }

    const data = await shorebaseServicePriceET.delete(shorebaseServicePrice);
    res.json(data)
}