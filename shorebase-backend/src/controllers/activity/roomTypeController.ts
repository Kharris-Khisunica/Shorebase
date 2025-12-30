import { Request, Response } from "express";
import { ETQuery } from "../../components/EnterpriseTable";
import roomTypeET from "../../services/roomType/roomTypeService";
import { RoomType } from "../../entity/activity/RoomType";
import { ESQuery } from "../../components/EnterpriseSelect";

export const getRoomTypes = async (req: Request<{}, {}, {}, ETQuery>, res: Response) => {
    const result = await roomTypeET.findAll(req.query)
    res.send(result)
}

export const getRoomTypeSelectOptions = async (req: Request<{}, {}, {}, ESQuery>, res: Response) => {
    const result = await roomTypeET.findSelectOptions(req.query);
    res.send(result);
}

export const getRoomType = async (req: Request<{id: string}>, res: Response) => {
   
    const result = await roomTypeET.findByPk({id: parseInt(req.params.id)})
    res.json(result)
}

export const createRoomType = async(req: Request<{id: string}, {}, {code: string, name: string} >, res: Response): Promise<void> => {

    const roomType = new RoomType();
    roomType.code = req.body.code;
    roomType.name = req.body.name;

    const data = await roomTypeET.create(roomType);
    res.json(data)
}

export const updateRoomType = async(req: Request<{id: string}, {}, {code: string,name: string} >, res: Response): Promise<void> => {

    const roomType = await roomTypeET.findByPk({id: parseInt(req.params.id)});

    if(!roomType){
        res.status(404).send({error: `roomType not found`})
        return ;
        
    }
    roomType.code = req.body.code;
    roomType.name = req.body.name;

    const data = await roomTypeET.update(roomType);
    res.json(data)
}

export const deleteRoomType = async(req: Request<{id:string}>, res: Response): Promise<void> =>{
    const roomType = await roomTypeET.findByPk({id: parseInt(req.params.id)});

    if(!roomType){
        res.status(404).send({error: `roomType not found`})
        return ;
    }

    const data = await roomTypeET.delete(roomType);
    res.json(data)
}