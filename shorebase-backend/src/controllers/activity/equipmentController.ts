import { Request, Response } from "express";
import { ETQuery } from "../../components/EnterpriseTable";
import equipmentET from "../../services/equipment/equipmentService";
import { Equipment } from "../../entity/activity/Equipment";
import { ESQuery } from "../../components/EnterpriseSelect";

export const getEquipments = async (req: Request<{}, {}, {}, ETQuery>, res: Response) => {
    const result = await equipmentET.findAll(req.query)
    res.send(result)
}

export const getEquipmentSelectOptions = async (req: Request<{}, {}, {}, ESQuery>, res: Response) => {
    const result = await equipmentET.findSelectOptions(req.query);
    res.send(result);
}

export const getEquipment = async (req: Request<{id: string}>, res: Response) => {
   
    const result = await equipmentET.findByPk({id: parseInt(req.params.id)})
    res.json(result)
}

export const createEquipment = async(req: Request<{id: string}, {}, {code: string, name: string} >, res: Response): Promise<void> => {

    const equipment = new Equipment();
    equipment.code = req.body.code;
    equipment.name = req.body.name;

    const data = await equipmentET.create(equipment);
    res.json(data)
}

export const updateEquipment = async(req: Request<{id: string}, {}, {code: string,name: string} >, res: Response): Promise<void> => {

    const equipment = await equipmentET.findByPk({id: parseInt(req.params.id)});

    if(!equipment){
        res.status(404).send({error: `equipment not found`})
        return ;
        
    }
    equipment.code = req.body.code;
    equipment.name = req.body.name;

    const data = await equipmentET.update(equipment);
    res.json(data)
}

export const deleteEquipment = async(req: Request<{id:string}>, res: Response): Promise<void> =>{
    const equipment = await equipmentET.findByPk({id: parseInt(req.params.id)});

    if(!equipment){
        res.status(404).send({error: `equipment not found`})
        return ;
    }

    const data = await equipmentET.delete(equipment);
    res.json(data)
}