import {Request, response, Response} from 'express'
import { SubContractor } from '../../entity/company/SubContractor'
import subContractorET from '../../services/subContractor/subContractorService'
import { ETQuery } from '../../components/EnterpriseTable'
import { ESQuery } from '../../components/EnterpriseSelect'
import { DATE_CONSTANT } from '../../constants/time_constants'
import { DateTime } from 'luxon'
import { Company } from '../../entity/company/Company'
import { Contract } from '../../entity/contractService/Contract'

export const getSubContractors = async (req: Request<{}, {}, {}, ETQuery>, res: Response) => {
    const result = await subContractorET.findAll(req.query, 
        (qb)=>qb.leftJoinAndSelect(`${qb.alias}.company`, `company`)
                .leftJoinAndSelect(`${qb.alias}.contract`, 'contract'));
    res.send(result);
};

export const getSubContractorOptions = async (req: Request<{}, {}, {}, ESQuery> , res: Response) => {
    const result = await subContractorET.findSelectOptions(req.query);
    res.send(result)
}

export const getSubContractor = async (req: Request<{id: string}>, res: Response) => {
    const result = await subContractorET.findByPk({id: parseInt(req.params.id)}, {relations: {company: true, contract: true}})
    res.json(result);
}

export const createSubContractor = async(req: Request<{}, {}, {companyId: string, contractId: string, startDate: string, endDate: string}>, res: Response) => {
    
    const subContract = new SubContractor();
    subContract.company = {id: parseInt(req.body.companyId)} as Company
    subContract.contract = {id: parseInt(req.body.contractId)} as Contract;
    subContract.startDate = req.body.startDate;
    subContract.endDate = req.body.endDate

    const data = await subContractorET.create(subContract);
    res.json(data)
}

export const updateSubContractor = async (req:Request<{id: string}>, res: Response) => {

    const subContract  = await subContractorET.findByPk({id: parseInt(req.params.id)})

    if(!subContract){
        res.status(404).send({error: `subContract not found`})
        return ;
    }

    const data = await subContractorET.update(subContract)
    res.json(data);
}

export const deleteSubContractor = async (req: Request<{id:string}>, res: Response) => {

    const subContract = await subContractorET.findByPk({id: parseInt(req.params.id)})

    if(!subContract){
        res.status(404). send({error: `subContract not found`})

        return ;
    }

    const data = await subContractorET.delete(subContract)
    res.json(data);
}