import { Request, Response } from "express";
import contractServicePriceET from "../../services/contractServicePrice/contractServicePriceService";
import { ContractServicePrice } from "../../entity/contractService/ContractServicePrice";
import { ETQuery } from "../../components/EnterpriseTable";
import { ESQuery } from "../../components/EnterpriseSelect";
import { ContractService } from "../../entity/contractService/ContractService";
import { error } from "console";

export const getContractServicePrices = async (req:Request<{}, {}, {}, ETQuery>, res: Response)=>{
    const result = await contractServicePriceET.findAll(req.query, 
        (qb)=>qb.leftJoinAndSelect(`${qb.alias}.contractService`, 'contractService')
    );
    res.send(result);
}

export const getContractServicePrice = async (req: Request<{id:string}>, res: Response) =>{
    const result = await contractServicePriceET.findByPk({id: parseInt(req.params.id)}, {relations: {
        contractService: true,
    }
    });

    res.json(result);
}

export const createContractServicePrice = async (req: Request<{}, {}, {
    contractServiceId: number, 
    pricePerUom: number, 
    startDate: string, 
    endDate: string}>, res: Response)=>{


        
    const contractServicePrice = new ContractServicePrice();
    
    console.log('--- TRIGGERED: createContractServicePrice ---');
    console.log('Request body received:', req.body);
    console.log('Type of contractServiceId:', typeof req.body.contractServiceId);
    
    const id = parseInt(req.body.contractServiceId as any);
    console.log('ID after parseInt:', id);
    // --- END DEBUG LOGS ---
    contractServicePrice.contractService = {id: id} as ContractService;
    contractServicePrice.pricePerUom = req.body.pricePerUom;
    contractServicePrice.startDate = req.body.startDate;
    contractServicePrice.endDate = req.body.endDate;

    const data = await contractServicePriceET.create(contractServicePrice);
    res.json(data);
}

export const updateContractServicePrice = async (req: Request<{id: string}, {}, {
    contractServiceId: number, 
    pricePerUom: number, 
    startDate: string, 
    endDate: string}>, res: Response)=>{

    const contractServicePrice = await contractServicePriceET.findByPk({id: parseInt(req.params.id)})

    if(!contractServicePrice){
        res.status(404).send({error: 'Contract Service Price not found'})
    }

    const id = parseInt(req.body.contractServiceId as any);

    contractServicePrice.contractService = {id: id} as ContractService;
    contractServicePrice.pricePerUom = req.body.pricePerUom;
    contractServicePrice.startDate = req.body.startDate;
    contractServicePrice.endDate = req.body.endDate;

    const data = await contractServicePriceET.update(contractServicePrice);
    res.json(data);
}

export const deleteContractServicePrice = async (req: Request<{id: string}>, res: Response) => {
    const contractServicePrice = await contractServicePriceET.findByPk({id: parseInt(req.params.id)})

    if(!contractServicePrice){
        res.status(404).send({error: 'Contract Service Price not found'})
    }

    const data = await contractServicePriceET.delete(contractServicePrice);
    res.json(data);
}