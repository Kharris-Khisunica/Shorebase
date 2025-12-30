import {  Request, Response} from 'express';
import { ETQuery } from '../../components/EnterpriseTable';
import { DateTime } from 'luxon';
import { DATE_CONSTANT } from '../../constants/time_constants';
import userPositionET from '../../services/position/userPositionService';
import { UserPosition } from '../../entity/user/UserPosition';
import { User } from '../../entity/user/User';
import { JobPosition } from '../../entity/user/JobPosition';
import { ESQuery } from '../../components/EnterpriseSelect';

export const getUserPositions = async (req: Request<{}, {}, {}, ETQuery>, res: Response) => {
    const result = await userPositionET.findAll(
        req.query,
        (qb) => qb.leftJoinAndSelect(`${qb.alias}.jobPosition`, `jobPosition`)
                    .leftJoinAndSelect(`jobPosition.company`, `jobPosition_company`)
                    .leftJoinAndSelect(`jobPosition.jobTitle`, `jobPosition_jobTitle`)
                    .leftJoinAndSelect(`${qb.alias}.user`, `user`)
    );
    res.send(result);
};

export const getSelectOptions = async (req: Request<{}, {}, {}, ESQuery>, res: Response) => {
    const result = await userPositionET.findSelectOptions(req.query);
    res.send(result);
};

export const getUserPosition = async (req: Request<{ id: string }>, res: Response) => {
    const id = req.params.id;
    const data = await userPositionET.findByPk({ id: parseInt(id) }, {
        relations: {
            user: true,
            jobPosition: {
                company: true,
                jobTitle: true
            }
        }
    });
    res.json(data);
}

export const createUserPosition = async (req: Request<{}, {}, { name: string, userId: number, jobPositionId: number, startDate?: string, endDate?: string }>, res: Response) => {
    const userPosition = new UserPosition();
    userPosition.jobPosition = { id: req.body.jobPositionId } as JobPosition;
    userPosition.user = { id: req.body.userId } as User; 
    userPosition.startDate = req.body.startDate || DateTime.now().toISODate();
    userPosition.endDate = req.body.endDate || DATE_CONSTANT.MAX_VALUE;
    
    const data = await userPositionET.create(userPosition);
    res.json(data);
}

export const updateUserPosition = async (req: Request<{ id: string }, {}, { name: string, userId: number, jobPositionId: number, startDate?: string, endDate?: string }>, res: Response) => {
    const userPosition = await userPositionET.findByPk({ id: parseInt(req.params.id) });
    if (!userPosition) {
        res.status(404).send({ error: 'user position not found' });
        return;
    }

    userPosition.jobPosition = { id: req.body.jobPositionId } as JobPosition;
    userPosition.user = { id: req.body.userId } as User; 
    userPosition.startDate = req.body.startDate || userPosition.startDate || DateTime.now().toISODate();
    userPosition.endDate = req.body.endDate || DATE_CONSTANT.MAX_VALUE;
    
    const data = await userPositionET.update(userPosition);
    res.json(data);
}

export const deleteUserPosition = async (req: Request<{ id: string }>, res: Response) => {
    const jobPosition = await userPositionET.findByPk({ id: parseInt(req.params.id) });
    if (!jobPosition) {
        res.status(404).send({ error: 'user position not found' });
        return;
    }

    const data = await userPositionET.delete(jobPosition);
    res.json(data);
}