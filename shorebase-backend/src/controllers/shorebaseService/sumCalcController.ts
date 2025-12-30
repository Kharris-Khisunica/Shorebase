import { Request, Response } from "express";
import { ETQuery } from "../../components/EnterpriseTable";
import sumCalcET from "../../services/sumCalc/sumCalcService";
import { SumCalc } from "../../entity/contractService/SumCalc";
import { ESQuery } from "../../components/EnterpriseSelect";

export const getSumCalcs = async (req: Request<{}, {}, {}, ETQuery>, res: Response) => {
    const result = await sumCalcET.findAll(req.query)
    res.send(result)
}

export const getSumCalcSelectOptions = async (req: Request<{}, {}, {}, ESQuery>, res: Response) =>{
    const result = await sumCalcET.findSelectOptions(req.query)
    res.send(result);

}

export const getSumCalc = async (req: Request<{code: string}>, res: Response) => {
   const code = req.params.code
    const result = await sumCalcET.findByPk({code: code})
    res.json(result)
}

export const createSumCalc = async(req: Request<{}, {}, {code: string, name: string} >, res: Response): Promise<void> => {

    const existingSumCalc = await sumCalcET.findByPk({code: req.body.code})

    if(existingSumCalc){
        res.status(409).send({error: `SumCalc with code ${req.body.code} already exists.`})
        return ;
        
    }


    const sumCalc = new SumCalc();
    sumCalc.code = req.body.code;
    sumCalc.name = req.body.name;

    const data = await sumCalcET.create(sumCalc);
    res.json(data)
}

export const updateSumCalc = async(req: Request<{code: string}, {}, {name: string} >, res: Response): Promise<void> => {

    const sumCalc = await sumCalcET.findByPk({code: req.params.code});

    if(!sumCalc){
        res.status(404).send({error: `sumCalc not found`})
        return ;
        
    }
    sumCalc.name = req.body.name;

    const data = await sumCalcET.update(sumCalc);
    res.json(data)
}

export const deleteSumCalc = async(req: Request<{code:string}>, res: Response): Promise<void> =>{
    const sumCalc = await sumCalcET.findByPk({code: req.params.code});

    if(!sumCalc){
        res.status(404).send({error: `sumCalc not found`})
        return ;
    }

    const data = await sumCalcET.delete(sumCalc);
    res.json(data)
}