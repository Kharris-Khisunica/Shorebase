import {  Request, Response} from 'express';
import { ETQuery } from '../../components/EnterpriseTable';
import jobPositionET from '../../services/general/jobPositionService';
import { JobPosition } from '../../entity/user/JobPosition';
import { JobTitle } from '../../entity/user/JobTitle';
import { DateTime } from 'luxon';
import { DATE_CONSTANT } from '../../constants/time_constants';
import { AppDataSource } from '../../dataSource';
import { Company } from '../../entity/company/Company';
import { ESQuery } from '../../components/EnterpriseSelect';

export const getJobPositions = async (req: Request<{}, {}, {}, ETQuery>, res: Response) => {
    const result = await jobPositionET.findAll(
        req.query,
        (qb) => qb.leftJoinAndSelect(`${qb.alias}.company`, `company`)
                    .leftJoinAndSelect(`${qb.alias}.jobTitle`, `jobTitle`)
    );
    res.send(result);

    const repo = AppDataSource.getRepository(JobPosition);
};

export const getJobPositionSelectOptions = async (req: Request<{}, {}, {}, ESQuery>, res: Response) => {
    const result = await jobPositionET.findSelectOptions(req.query);
    res.send(result);
};

export const getJobPosition = async (req: Request<{ id: string }>, res: Response) => {
    const id = req.params.id;
    const data = await jobPositionET.findByPk({ id: parseInt(id) }, {
        relations: {
            company: true,
            jobTitle: true
        }
    });
    res.json(data);
}

export const createJobPosition = async (req: Request<{}, {}, { name: string, companyId: number, jobTitleId: number, parentId: number, startDate?: string, endDate?: string }>, res: Response) => {
    const jobPosition = new JobPosition();
    jobPosition.name = req.body.name || '';
    jobPosition.company = { id: req.body.companyId } as Company;
    jobPosition.jobTitle = { id: req.body.jobTitleId } as JobTitle;
    jobPosition.parent = req.body.parentId ? { id: req.body.parentId } as JobPosition : null;
    jobPosition.startDate = req.body.startDate || DateTime.now().toISODate();
    jobPosition.endDate = req.body.endDate || DATE_CONSTANT.MAX_VALUE;
    
    const data = await jobPositionET.create(jobPosition);
    res.json(data);
}

export const updateJobPosition = async (req: Request<{ id: string }, {}, { name: string, companyId: number, jobTitleId: number, parentId: number, startDate?: string, endDate?: string }>, res: Response) => {
    const jobPosition = await jobPositionET.findByPk({ id: parseInt(req.params.id) });
    if (!jobPosition) {
        res.status(404).send({ error: 'job position not found' });
        return;
    }

    jobPosition.name = req.body.name || '';
    jobPosition.company = { id: req.body.companyId } as Company;
    jobPosition.jobTitle = { id: req.body.jobTitleId } as JobTitle;
    jobPosition.parent = req.body.parentId ? { id: req.body.parentId } as JobPosition : null;
    jobPosition.startDate = req.body.startDate || jobPosition.startDate || DateTime.now().toISODate();
    jobPosition.endDate = req.body.endDate || DATE_CONSTANT.MAX_VALUE;
    
    const data = await jobPositionET.update(jobPosition);
    res.json(data);
}

export const deleteJobPosition = async (req: Request<{ id: string }>, res: Response) => {
    const jobPosition = await jobPositionET.findByPk({ id: parseInt(req.params.id) });
    if (!jobPosition) {
        res.status(404).send({ error: 'job position not found' });
        return;
    }

    const data = await jobPositionET.delete(jobPosition);
    res.json(data);
}