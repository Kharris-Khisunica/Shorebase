import { Request, Response } from 'express';
import jobTitleET, * as jobTitleService from '../../services/position/jobTitleService';
import { JobTitle } from '../../entity/user/JobTitle';
import { DATE_CONSTANT } from '../../constants/time_constants';
import { ESQuery } from '../../components/EnterpriseSelect';
import { DateTime } from 'luxon';

export const getJobTitles = async (req: Request, res: Response) => {
    const result = await jobTitleET.findAll(req.query);
    res.send(result);
}

export const getJobTitleSelectOptions = async (req: Request<{}, {}, {}, ESQuery>, res: Response) => {
    const result = await jobTitleET.findSelectOptions(req.query);
    res.send(result);
};

export const getJobTitle = async (req: Request<{ id: string }>, res: Response) => {
    const id = req.params.id;
    const data = await jobTitleET.findByPk({ id: parseInt(id) });
    res.json(data);
}

export const createJobTitle = async (req: Request<{}, {}, { code: string, name: string, startDate: string, endDate?: string }>, res: Response) => {
    const jobTitle = new JobTitle();
    jobTitle.code = req.body.code;
    jobTitle.name = req.body.name;

    jobTitle.startDate = req.body.startDate || DateTime.now().toISODate();
    jobTitle.endDate = req.body.endDate || DATE_CONSTANT.MAX_VALUE;
    
    const data = await jobTitleET.create(jobTitle);
    res.json(data);
}

export const updateJobTitle = async (req: Request<{ id: string }, {}, { code: string,name: string, startDate: string, endDate?: string }>, res: Response) => {
    const jobTitle = await jobTitleService.getJobTitle(parseInt(req.params.id), {});
    if (!jobTitle) {
        res.status(404).send({ error: 'jobTitle not found' });
        return;
    }
    jobTitle.code = req.body.code;
    jobTitle.name = req.body.name;
    jobTitle.startDate = req.body.startDate || jobTitle.startDate || DateTime.now().toISODate();
    jobTitle.endDate = req.body.endDate || DATE_CONSTANT.MAX_VALUE;
    
    const data = await jobTitleET.update(jobTitle);
    res.json(data);
}

export const deleteJobTitle = async (req: Request<{ id: string }>, res: Response) => {
    const jobTitle = await jobTitleService.getJobTitle(parseInt(req.params.id), {});
    if (!jobTitle) {
        res.status(404).send({ error: 'jobTitle not found' });
        return;
    }

    const data = await jobTitleET.delete(jobTitle);
    res.json(data);
}