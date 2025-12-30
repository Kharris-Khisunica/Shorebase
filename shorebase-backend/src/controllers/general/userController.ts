import {  Request, Response} from 'express';
import { ETQuery } from '../../components/EnterpriseTable';
import userET from '../../services/general/userService';
import { ESQuery } from '../../components/EnterpriseSelect';

export const getUsers = async (req: Request<{}, {}, {}, ETQuery>, res: Response) => {
    console.log('MANTAP 1');
    const result = await userET.findAll(
        req.query
    );
    console.log('MANTAP 2');
    res.send(result);
};

export const getUserSelectOptions = async (req: Request<{}, {}, {}, ESQuery>, res: Response) => {
    const result = await userET.findSelectOptions(req.query);
    res.send(result);
};

export const getUser = async (req: Request<{ id: string }>, res: Response) => {
    const id = req.params.id;
    const data = await userET.findByPk({ id: parseInt(id) });
    res.json(data);
}
