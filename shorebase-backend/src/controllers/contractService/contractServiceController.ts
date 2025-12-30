import { Request, Response } from "express";
import contractServiceET from "../../services/contractService/contractService-Service";
import { ContractService } from "../../entity/contractService/ContractService";
import { ETQuery } from "../../components/EnterpriseTable";
import { ESQuery } from "../../components/EnterpriseSelect";
import { Contract } from "../../entity/contractService/Contract";
import { ShorebaseService } from "../../entity/contractService/ShorebaseService";
import { Company } from "../../entity/company/Company";
import { UoM } from "../../entity/contractService/UoM";
import { SumCalc } from "../../entity/contractService/SumCalc";
import { error } from "console";

export const getContractServices = async (req: Request<{}, {}, {}, ETQuery>, res: Response) => {
    const result = await contractServiceET.findAll(req.query, 
        (qb)=>qb.leftJoinAndSelect(`${qb.alias}.contract`, 'contract')
                .leftJoinAndSelect(`${qb.alias}.shorebaseService`, 'shorebaseService')
                .leftJoinAndSelect(`${qb.alias}.company`, 'company')
                .leftJoinAndSelect(`${qb.alias}.uom`, 'uom')
                .leftJoinAndSelect(`${qb.alias}.sumCalc`, 'sumCalc') 
                .leftJoinAndSelect("shorebaseService.shorebaseServiceType", "shorebaseServiceType")

    );

    res.send(result);
}
// ?
export const getContractServiceOptions = async (req: Request<{}, {}, {}, ESQuery>, res: Response) => {
    const result = await contractServiceET.findSelectOptions(req.query);
    res.send(result);
}

export const getContractServiceAutofill = async (req: Request<{}, {},{}, ESQuery>, res: Response) => {
    const result = await contractServiceET.findSelectObject(req.query);
    res.send(result)
}

export const getContractService = async (req: Request<{id: string}>, res: Response) => {
    const data = await contractServiceET.findByPk({id: parseInt(req.params.id)})
    res.json(data)
}

export const createContractService = async (req: Request<{}, {}, {
    contractId: number,
    shorebaseServiceId: number,
    companyId: number,
    code: string,
    uomCode: string,
    startDate: string,
    endDate: string,
    sumCalcCode: string,
}>, res: Response) => {
    console.log("Received body for create:", req.body);
    
    const contractService = new ContractService();

    contractService.contract = {id: req.body.contractId} as Contract;
    contractService.shorebaseService = {id: req.body.shorebaseServiceId} as ShorebaseService;
    contractService.company = {id: req.body.companyId} as Company;
    contractService.code = req.body.code;
    contractService.uom = {code: req.body.uomCode} as UoM;
    contractService.startDate = req.body.startDate;
    contractService.endDate = req.body.endDate;
    contractService.sumCalc = {code: req.body.sumCalcCode} as SumCalc;

    const data = await contractServiceET.create(contractService);
    res.json(data);
}

export const updateContractService = async (req: Request<{id: string}, {}, {
    contractId: number,
    shorebaseServiceId: number,
    companyId: number,
    code: string,
    uomCode: string,
    startDate: string,
    endDate: string,
    sumCalcCode: string,
}>, res: Response) => {
    
    console.log("Received body for update:", req.body);
    
    const contractService = await contractServiceET.findByPk({id: parseInt(req.params.id)});

    if(!contractService){
        res.status(404).send({error: 'Contract Service not found'})
        return ;
    }

    contractService.contract = {id: req.body.contractId} as Contract;
    contractService.shorebaseService = {id: req.body.shorebaseServiceId} as ShorebaseService;
    contractService.company = {id: req.body.companyId} as Company;
    contractService.code = req.body.code;
    contractService.uom = {code: req.body.uomCode} as UoM;
    contractService.startDate = req.body.startDate;
    contractService.endDate = req.body.endDate;
    contractService.sumCalc = {code: req.body.sumCalcCode} as SumCalc;

    const data = await contractServiceET.update(contractService);
    res.json(data);
}


export const deleteContractService = async (req: Request<{id: string}>, res: Response) => {
    const contractService = await contractServiceET.findByPk({id: parseInt(req.params.id)});

    if(!contractService){
        res.status(404).send({error: 'Contract Service not found'})
        return ;
    }

    const data = await contractServiceET.delete(contractService);
    res.json(data);
}


