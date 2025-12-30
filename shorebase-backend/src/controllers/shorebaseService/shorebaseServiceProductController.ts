import {Request, response, Response} from 'express'
import { ShorebaseServiceProduct } from '../../entity/contractService/ShorebaseServiceProduct'
import shorebaseServiceProductET from '../../services/shorebaseServiceProduct/shorebaseServiceProductService'
import { ETQuery } from '../../components/EnterpriseTable'
import { ESQuery } from '../../components/EnterpriseSelect'
import { DATE_CONSTANT } from '../../constants/time_constants'
import { DateTime } from 'luxon'
import { Company } from '../../entity/company/Company'
import companyET from '../../services/company/companyService'
import { UoM } from '../../entity/contractService/UoM'

export const getShorebaseServiceProducts = async (req: Request<{}, {}, {}, ETQuery>, res: Response) => {
    const result = await shorebaseServiceProductET.findAll(req.query, 
        (qb)=>qb
            .leftJoinAndSelect(`${qb.alias}.uom`, 'uom')
    )
    res.send(result);
};

export const getShorebaseServiceProductOptions = async (req: Request<{}, {}, {}, ESQuery> , res: Response) => {
    const result = await shorebaseServiceProductET.findSelectOptions(req.query);
    res.send(result)
}

export const getShorebaseServiceProductAutofill = async (req: Request<{}, {}, {}, ESQuery>, res: Response) => {
    const result = await shorebaseServiceProductET.findSelectObject(req.query);
    res.send(result)
}

export const getShorebaseServiceProduct = async (req: Request<{id: string}>, res: Response) => {
    const result = await shorebaseServiceProductET.findByPk({id: parseInt(req.params.id)}, {relations: {uom: true}})
    res.json(result);
}

export const createShorebaseServiceProduct = async(req: Request<{}, {}, 
    {
        code: string,
        name: string,
        uomCode: string,
    }>, res: Response) => {
    console.log("Received body for create:", req.body);

    const shorebaseServiceProduct = new ShorebaseServiceProduct();
    shorebaseServiceProduct.code = req.body.code;
    shorebaseServiceProduct.name = req.body.name;
    shorebaseServiceProduct.uom = {code: req.body.uomCode} as UoM;

    const data = await shorebaseServiceProductET.create(shorebaseServiceProduct);
    res.json(data)
}

export const updateShorebaseServiceProduct = async (req:Request<{id: string}, {},
    {   
        code: string,
        name: string,
        uomCode: string,
    } >, res: Response) => {

    console.log("Received body for update:", req.body);
    
    const shorebaseServiceProduct  = await shorebaseServiceProductET.findByPk({id: parseInt(req.params.id)})

    if(!shorebaseServiceProduct){
        res.status(404).send({error: `shorebaseServiceProduct not found`})
        return ;
    }
    shorebaseServiceProduct.code = req.body.code;
    shorebaseServiceProduct.name = req.body.name;
    shorebaseServiceProduct.uom = {code: req.body.uomCode} as UoM;
    
    
    const data = await shorebaseServiceProductET.update(shorebaseServiceProduct);
    res.json(data)

}

export const deleteShorebaseServiceProduct = async (req: Request<{id:string}>, res: Response) => {

    const shorebaseServiceProduct = await shorebaseServiceProductET.findByPk({id: parseInt(req.params.id)})

    if(!shorebaseServiceProduct){
        res.status(404). send({error: `shorebaseServiceProduct not found`})

        return ;
    }

    const data = await shorebaseServiceProductET.delete(shorebaseServiceProduct)
    res.json(data);
}