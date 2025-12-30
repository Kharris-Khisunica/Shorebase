import {Request, response, Response} from 'express'
import { Contract } from '../../entity/contractService/Contract'
import contractET from '../../services/contract/contract-Service'
import { ETQuery } from '../../components/EnterpriseTable'
import { ESQuery } from '../../components/EnterpriseSelect'
import { DATE_CONSTANT } from '../../constants/time_constants'
import { DateTime } from 'luxon'
import { Company } from '../../entity/company/Company'
import companyET from '../../services/company/companyService'

export const getContracts = async (req: Request<{}, {}, {}, ETQuery>, res: Response) => {
    const result = await contractET.findAll(req.query, (qb)=>qb.leftJoinAndSelect(`${qb.alias}.company`, `company`));
    res.send(result);
};

export const getContractOptions = async (req: Request<{}, {}, {}, ESQuery> , res: Response) => {
    const result = await contractET.findSelectOptions(req.query);
    res.send(result)
}

export const getContractAutofill = async (req: Request<{}, {}, {}, ESQuery>, res: Response) => {
    const result = await contractET.findSelectObject(req.query);
    res.send(result)
}

export const getContract = async (req: Request<{id: string}>, res: Response) => {
    const result = await contractET.findByPk({id: parseInt(req.params.id)}, {relations: {company: true}})
    res.json(result);
}

export const createContract = async(req: Request<{}, {}, {companyId: string, name: string, contractNumber: string, startDate: string, endDate: string}>, res: Response) => {
    console.log("Received body for create:", req.body);

    const contract = new Contract();
    contract.company = {id: parseInt(req.body.companyId)} as Company
    contract.name = req.body.name;
    contract.contractNumber = req.body.contractNumber;
    contract.startDate = req.body.startDate;
    contract.endDate = req.body.endDate

    const data = await contractET.create(contract);
    res.json(data)
}

export const updateContract = async (req:Request<{id: string}, {},{companyId: string, name: string, contractNumber: string, startDate: string, endDate: string} >, res: Response) => {

    console.log("Received body for update:", req.body);
    
    const contract  = await contractET.findByPk({id: parseInt(req.params.id)})

    if(!contract){
        res.status(404).send({error: `contract not found`})
        return ;
    }
    contract.company = {id: parseInt(req.body.companyId)} as Company
    contract.name = req.body.name;
    contract.contractNumber = req.body.contractNumber;
    contract.startDate = req.body.startDate;
    contract.endDate = req.body.endDate

    const data = await contractET.update(contract);
    res.json(data)

}

export const deleteContract = async (req: Request<{id:string}>, res: Response) => {

    const contract = await contractET.findByPk({id: parseInt(req.params.id)})

    if(!contract){
        res.status(404). send({error: `contract not found`})

        return ;
    }

    const data = await contractET.delete(contract)
    res.json(data);
}