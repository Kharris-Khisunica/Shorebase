import { Request, Response } from "express"
import companyET from "../../services/company/companyService";
import { ETQuery } from "../../components/EnterpriseTable";
import { Company } from "../../entity/company/Company";
import { DATE_CONSTANT } from "../../constants/time_constants";
import { DateTime } from "luxon";
import { ESQuery } from "../../components/EnterpriseSelect";

export const getCompanies = async (req: Request<{}, {}, {}, ETQuery>, res: Response) => {
    const result = await companyET.findAll(req.query);
    res.send(result);
};

export const getCompanySelectOptions = async (req: Request<{}, {}, {}, ESQuery>, res: Response) => {
    const result = await companyET.findSelectOptions(req.query);
    res.send(result);
};

export const getCompany = async (req: Request<{ id: string }>, res: Response) => {
    const id = req.params.id;
    const data = await companyET.findByPk({ id: parseInt(id) });
    res.json(data);
}

export const createCompany = async (req: Request<{}, {}, { name: string, internal?: boolean ,startDate?: string, endDate?: string }>, res: Response) => {
    const company = new Company();
    company.name = req.body.name;
    company.internal = req.body.internal || false;
    company.startDate = req.body.startDate || DateTime.now().toISODate();
    company.endDate = req.body.endDate || DATE_CONSTANT.MAX_VALUE;
    
    const data = await companyET.create(company);
    res.json(data);
}

export const updateCompany = async (req: Request<{ id: string }, {}, { name: string, startDate?: string, endDate?: string }>, res: Response) => {
    const company = await companyET.findByPk({ id: parseInt(req.params.id) });
    if (!company) {
        res.status(404).send({ error: 'company not found' });
        return;
    }

    company.name = req.body.name;
    company.startDate = req.body.startDate || company.startDate || DateTime.now().toISODate();
    company.endDate = req.body.endDate || DATE_CONSTANT.MAX_VALUE;
    
    const data = await companyET.update(company);
    res.json(data);
}

export const deleteCompany = async (req: Request<{ id: string }>, res: Response) => {
    const company = await companyET.findByPk({ id: parseInt(req.params.id) });
    if (!company) {
        res.status(404).send({ error: 'company not found' });
        return;
    }

    const data = await companyET.delete(company);
    res.json(data);
}