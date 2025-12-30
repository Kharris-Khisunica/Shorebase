import { Request, Response } from "express";
import { ETQuery } from "../../components/EnterpriseTable";
import uomET from "../../services/uom/uomService";
import { UoM } from "../../entity/contractService/UoM";
import { ESQuery } from "../../components/EnterpriseSelect";

export const getUOMs = async (req: Request<{}, {}, {}, ETQuery>, res: Response) => {
    const result = await uomET.findAll(req.query)
    res.send(result)
}

export const getUomSelectOptions = async (req: Request<{}, {}, {}, ESQuery>, res: Response) => {
    const result = await uomET.findSelectOptions(req.query);
    res.send(result);
}

export const getUOM = async (req: Request<{code: string}>, res: Response) => {
   const code = req.params.code
    const result = await uomET.findByPk({code: code})
    res.json(result)
}

export const createUOM = async(req: Request<{}, {}, {code: string, name: string} >, res: Response): Promise<void> => {

    const existingUOM = await uomET.findByPk({code: req.body.code})

    if(existingUOM){
        res.status(409).send({error: `UoM with code ${req.body.code} already exists.`})
        return ;
        
    }


    const uom = new UoM();
    uom.code = req.body.code;
    uom.name = req.body.name;

    const data = await uomET.create(uom);
    res.json(data)
}

export const updateUOM = async(req: Request<{code: string}, {}, {name: string} >, res: Response): Promise<void> => {

    const uom = await uomET.findByPk({code: req.params.code});

    if(!uom){
        res.status(404).send({error: `uom not found`})
        return ;
        
    }
    uom.name = req.body.name;

    const data = await uomET.update(uom);
    res.json(data)
}

export const deleteUOM = async(req: Request<{code:string}>, res: Response): Promise<void> =>{
    const uom = await uomET.findByPk({code: req.params.code});

    if(!uom){
        res.status(404).send({error: `uom not found`})
        return ;
    }

    const data = await uomET.delete(uom);
    res.json(data)
}