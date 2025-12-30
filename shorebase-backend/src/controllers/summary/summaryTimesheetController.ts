import { Request, Response } from "express"
import { ETQuery } from "../../components/EnterpriseTable"
import summaryTimesheetET from "../../services/summaryTimesheet/summaryTimesheetService"
import { SummaryTimesheet } from "../../entity/summaryTimesheet/SummaryTimesheet"
import { TimesheetType } from "../../entity/timesheet/TimesheetType"
import { Contract } from "../../entity/contractService/Contract"
import { Company } from "../../entity/company/Company"
import timesheetET from "../../services/timesheet/timesheetService"
import { STTimesheet } from "../../entity/summaryTimesheet/STTimesheet"
import { STComponent } from "../../entity/summaryTimesheet/STComponent"
import { DataSource, In, LessThan, QueryBuilder } from "typeorm"
import { AppDataSource } from "../../dataSource"
import { ContractServicePrice } from "../../entity/contractService/ContractServicePrice"
import { ShorebaseServicePrice } from "../../entity/contractService/ShorebaseServicePrice"
import { Timesheet } from "../../entity/timesheet/Timesheet"
import { time } from "console"

export const getSummaryTimesheets = async(req: Request<{}, {}, {}, ETQuery>, res: Response) => {
    const result = summaryTimesheetET.findAll(req.query, 
        (qb) => qb.leftJoinAndSelect(`${qb.alias}.timesheetTypeCode`, "timesheetTypeCode")
        .leftJoinAndSelect(`${qb.alias}.contract`, "contract")
        .leftJoinAndSelect(`${qb.alias}.company`, "company")
    )

    res.send(result)
}

export const getSummaryTimesheet = async (req: Request<{stId:string}>, res: Response) => {
    console.log(req.params.stId)
    if (isNaN(parseInt(req.params.stId))) {
        res.status(400).json({ error: "Invalid or missing Summary Timesheet ID." });
        return ;
    }
    const result = await summaryTimesheetET.findByPk({id: parseInt(req.params.stId)}, {relations: {
            company: true,
            stComponents: {
                contractService: {
                    shorebaseService: true,
                    uom: true,
                },
                sttimesheets: {
                    timesheet: true,
                },
            },
        }})
    console.log(result)
    res.json(result)

}


export const getCompanySummaryTimesheet = async (req: Request<{companyId:string}>, res: Response) => {
    const result = await summaryTimesheetET.findAll(req.query, 
        (qb) => qb.leftJoinAndSelect(`${qb.alias}.timesheetType`, "timesheetType")
        .leftJoinAndSelect(`${qb.alias}.contract`, "contract")
        .leftJoinAndSelect(`${qb.alias}.company`, "company")
        .where(`company.id = :companyId`, {companyId: parseInt(req.params.companyId)})
    )

    res.send(result.data)
}

export const createSummaryTimesheet = async (req: Request<{}, {}, {
    contractId: number,
    companyId: number,
    code: string,
    periodStartDate: string,
    periodEndDate: string,
    issueDate: string,
}>, res: Response) => {
    const summaryTimesheet = new SummaryTimesheet();

    // summaryTimesheet.timesheetType = {code: req.body.timesheetTypeCode} as TimesheetType;
    summaryTimesheet.contract = {id: req.body.contractId} as Contract;
    summaryTimesheet.company = {id: req.body.companyId} as Company;
    summaryTimesheet.code = req.body.code;
    summaryTimesheet.periodStartDate = req.body.periodStartDate;
    summaryTimesheet.periodEndDate = req.body.periodEndDate;
    summaryTimesheet.issueDate = req.body.issueDate;
    summaryTimesheet.stComponents = [];

    // Cari Timesheet dengan issueDate nya dalam range periodeStartDte dan periodEndDate
    const timesheets = await timesheetET.findAll({}, (qb)=>
        qb
        .leftJoinAndSelect(`${qb.alias}.timesheetType`, 'timesheetType')
        .leftJoinAndSelect(`${qb.alias}.contractService`, 'contractService')
        .leftJoinAndSelect(`contractService.sumCalc`, 'sumCalc')
        .leftJoinAndSelect(`${qb.alias}.subContractor`, 'subContractor')
        .leftJoinAndSelect(`${qb.alias}.company`, 'company')
        .leftJoinAndSelect(`${qb.alias}.shorebaseService`, 'shorebaseService')
        .leftJoinAndSelect(`${qb.alias}.uom`, 'uom')
        .leftJoin(`${qb.alias}.sttimesheet`, "stTimesheet")
        .where(`${qb.alias}.issueDate BETWEEN :periodStartDate AND :periodEndDate`, {periodStartDate: req.body.periodStartDate, periodEndDate: req.body.periodEndDate})
        .andWhere(`${qb.alias}.company.id = :companyId`, {companyId: req.body.companyId})
        .andWhere(`stTimesheet.id IS NULL`)
    )
    
    summaryTimesheet.timesheetType = timesheets.data[0].timesheetType;
    // Cari price
    const csIds = timesheets.data.map(ts => ts.contractService?.id) 
    const ssIds = timesheets.data.map(ts => ts.shorebaseService?.id)

    const csPrices = await AppDataSource.getRepository(ContractServicePrice).find({
    where: {
        contractService: { id: In(csIds) }
    },
    relations: {
        contractService: true 
    }
}); 
    const ssPrices = await AppDataSource.getRepository(ShorebaseServicePrice).find({where: {shorebaseService: {id: In(ssIds)}, company: {id: req.body.companyId}}, relations: {shorebaseService: true, company: true}})

    console.log("cs Price")
    console.log(csPrices)

    console.log("ss Price")
    console.log(ssPrices)

    const csPricesMap = new Map(csPrices.map(p => [p.contractService.id, p.pricePerUom]))
    const ssPricesMap = new Map(ssPrices.map(p => [p.shorebaseService.id, p.pricePerUom]))

    console.log("cs Price Map")
    console.log(csPricesMap)

    console.log("ss Price Map")
    console.log(ssPricesMap)

    // Kelompokkan timesheet berdasarkan service. 
    const timesheetsPerServiceMap = new Map<number, Timesheet[]>();
    for (const ts of timesheets.data) {
        const serviceId = ts.shorebaseService.id;
        if (!timesheetsPerServiceMap.has(serviceId)) {
            timesheetsPerServiceMap.set(serviceId, []);
        }
        timesheetsPerServiceMap.get(serviceId)!.push(ts);
    }
    
    // Masukkan grouped timesheet ke STComponent
    for (const [serviceId,timesheets] of timesheetsPerServiceMap.entries()){
        const stComponent = new STComponent();
        // ambil komponen yang sama dari dalam 1 timesheetPerService
        const firstTimesheet = timesheets[0];
        console.log("first Timesheet")
        console.log(firstTimesheet)
        stComponent.shorebaseService = firstTimesheet.shorebaseService;
        stComponent.uom = firstTimesheet.uom;
        stComponent.company = firstTimesheet.company;
        stComponent.contractService = firstTimesheet.contractService;

        stComponent.pricePerUomContract = firstTimesheet.contractService.id ? csPricesMap.get(firstTimesheet.contractService.id) : undefined;
        stComponent.pricePerUomIndependent = ssPricesMap.get(serviceId);

        // Masukkan STTimesheet ke STComponent
        stComponent.sttimesheets = []
        for (const ts of timesheets){
            const stTimesheet = new STTimesheet();
            stTimesheet.timesheet = ts;
            stComponent.sttimesheets.push(stTimesheet);
        }

        // Fill the aggregated sum based on sumCalcType
        const sumCalc = firstTimesheet.contractService.sumCalc
        
        switch(sumCalc.code){
            case "SUM":
                stComponent.aggAmount = stComponent.sttimesheets.reduce((acc, sttimesheet) => acc + sttimesheet.timesheet.totalAmount, 0)
                break;
            case "AVG":
                stComponent.aggAmount =stComponent.sttimesheets.reduce((acc, sttimesheet) => acc + sttimesheet.timesheet.totalAmount, 0) / stComponent.sttimesheets.length
                break;

        }
        stComponent.remark = ""

        // Masukkan STComponent ke SummaryTimesheet
        stComponent.actualPricePerUom = stComponent.pricePerUomContract ? stComponent.pricePerUomContract : stComponent.pricePerUomIndependent;

        summaryTimesheet.stComponents.push(stComponent)
    }

    

    const data = summaryTimesheetET.create(summaryTimesheet);
    res.json(data)
}

export const updateSummaryTimesheet = async (req: Request<{id: string}, {}, {
    contractId: number,
    companyId: number,
    code: string,
    periodStartDate: string,
    periodEndDate: string,
    issueDate: string,
}>, res: Response) => {
    const summaryTimesheet = await summaryTimesheetET.findByPk({id: parseInt(req.params.id)});

    if(!summaryTimesheet){
        res.status(404).send({error: "Summary Timesheet Not Found"})
        return ;
    }

    summaryTimesheet.code = req.body.code;
    summaryTimesheet.issueDate = req.body.issueDate;
    
    const data = summaryTimesheetET.update(summaryTimesheet);
    res.json(data)
}

export const deleteSummaryTimesheet = async (req: Request<{id: string}>, res: Response) => {
    const summaryTimesheet = await summaryTimesheetET.findByPk({id: parseInt(req.params.id)});

    if(!summaryTimesheet){
        res.status(404).send({error: "Summary Timesheet Not Found"})
        return ;
    }
    const data = summaryTimesheetET.delete(summaryTimesheet);
    res.json(data)
}