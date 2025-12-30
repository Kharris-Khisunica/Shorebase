import { Request, Response } from "express";
import { ETQuery } from "../../components/EnterpriseTable";
import planActivityET from "../../services/planActivity/planActivityService";
import { ESQuery } from "../../components/EnterpriseSelect";
import { PlanActivity } from "../../entity/planActivity/PlanActivity";
import { AppDataSource } from "../../dataSource";

// Entities
import { TimesheetType } from "../../entity/timesheet/TimesheetType";
import { Company } from "../../entity/company/Company";
import { UoM } from "../../entity/contractService/UoM";
import { ShorebaseService } from "../../entity/contractService/ShorebaseService";
import { ContractService } from "../../entity/contractService/ContractService";
import { SubContractor } from "../../entity/company/SubContractor";
import { DateTime } from "luxon";
import { ShorebaseServiceProduct } from "../../entity/contractService/ShorebaseServiceProduct";
import { Ship } from "../../entity/activity/Ship";
import { RoomType } from "../../entity/activity/RoomType";

// Specific Entities
import { PlanActivityAccomodation } from "../../entity/planActivity/PlanActivity-Accomodation";
import { PlanActivityMeal } from "../../entity/planActivity/PlanActivity-Meal";
import { PlanActivityMH } from "../../entity/planActivity/PlanActivity-MH";
import { PlanActivityJetty } from "../../entity/planActivity/PlanActivity-Jetty";
import { ActivityStatus } from "../../entity/activity/ActivityStatus";

interface PlanActivityPayload {
    timesheetTypeCode: string;
    companyId: string;
    contractId: string;
    subContractorId?: string;
    shorebaseServiceId: string;
    uomCode?: string;
    description: string;
    remark?: string;

    serviceTypeCode?: string;

    // MH 
    "lifting-planStartDate"?: string;
    shorebaseServiceProductId?: string;
    planProductQty?: number;

    // Meal
    "meal-planStartDate"?: string;
    "meal-planEndDate"?: string;
    "meal-planPeopleCount"?: number;
    "meal-planBreakfast"?: boolean;
    "meal-planLunch"?: boolean;
    "meal-planDinner"?: boolean;

    // Accomodation
    "acc-planCheckIn"?: string;
    "acc-planCheckOut"?: string;
    "acc-planRoomCount"?: number;
    roomTypeId?: number;

    // Jetty 
}

// Get All
export const getPlanActivities = async (req: Request<{}, {}, {}, ETQuery>, res: Response) => {
    const result = await planActivityET.findAll(
        req.query,
        (qb) => qb
            .leftJoinAndSelect(`${qb.alias}.timesheetType`, `timesheetType`)
            .leftJoinAndSelect(`${qb.alias}.contractService`, `contractService`)
            .leftJoinAndSelect(`contractService.contract`, `contract`)
            .leftJoinAndSelect(`${qb.alias}.subContractor`, 'subContractor')
            .leftJoinAndSelect(`subContractor.company`, 'subContractorCompany')
            .leftJoinAndSelect(`${qb.alias}.company`, 'company')
            .leftJoinAndSelect(`${qb.alias}.shorebaseService`, 'shorebaseService')
            .leftJoinAndSelect(`${qb.alias}.uom`, `uom`)
            .leftJoinAndSelect(`${qb.alias}.status`, `status`)
    );
    res.send(result);
}

// Get Detail
export const getPlanActivity = async (req: Request<{ id: string }>, res: Response) => {
    const result = await planActivityET.findDetailById(parseInt(req.params.id));
    if (!result) {
        res.status(404).json({ error: "Plan Activity not found" });
        return;
    }
    res.json(result);
}

export const getPlanActivitySelectOptions = async (req: Request<{}, {}, {}, ESQuery>, res: Response) => {
    const result = await planActivityET.findSelectOptions(req.query);
    res.send(result);
}
export const getPlanActivityAutofillOptions = async (req: Request<{}, {}, {}, ESQuery>, res: Response) => {
    const result = await planActivityET.findSelectObject(req.query);
    res.send(result);
}

export const createPlanActivity = async (req: Request<{}, {}, PlanActivityPayload>, res: Response) => {
    try {
        console.log("Creating Plan Activity...");
        const plan = new PlanActivity();

        // 1. Set Base Fields
        plan.description = req.body.description;
        plan.timesheetType = { code: req.body.timesheetTypeCode } as TimesheetType;
        plan.company = { id: parseInt(req.body.companyId) } as Company;
        plan.uom = { code: req.body.uomCode } as UoM;
        plan.shorebaseService = { id: parseInt(req.body.shorebaseServiceId) } as ShorebaseService;
        plan.status = { code: "OPEN"} as ActivityStatus
        plan.remark = req.body.remark;

        // Cari ContractService yang sesuai
        const csRepo = AppDataSource.getRepository(ContractService);
        const cs = await csRepo.findOne({
            where: {
                contract: { id: parseInt(req.body.contractId) },
                shorebaseService: { id: parseInt(req.body.shorebaseServiceId) }
            }
        });
        plan.contractService = cs ? { id: cs.id } as ContractService : undefined;

        if (req.body.subContractorId) {
            plan.subContractor = { id: parseInt(req.body.subContractorId) } as SubContractor;
        }

        // 2. Save Parent (untuk dapat ID)
        const createdPlan = await planActivityET.repository.insert(plan);
        // const createdPlan = await planActivityET.create(plan);
        const createdId = createdPlan.identifiers[0].id;

        // 3. Generate & Update Code
        // Fetch ulang relasi nama untuk string code
        const fullPlan = await planActivityET.findByPk({ id: createdId}, { relations: ['shorebaseService', 'company'] });
        if(fullPlan){
            const srvName = fullPlan.shorebaseService?.name || "SRV";
            const compName = fullPlan.company?.name || "COMP";
            
            const newCode = `${fullPlan.id}/Plan/${srvName}/${compName}`;
            
            // FIX: Gunakan repository.update langsung untuk menghindari UpdateValuesMissingError
            await planActivityET.repository.update({ id: fullPlan.id }, { code: newCode });
        }

        const parentRef = { id: createdId } as PlanActivity;

if (req.body.shorebaseServiceProductId || req.body["lifting-planStartDate"]) {
            const mh = new PlanActivityMH();
            mh.planActivity = parentRef;
            mh.planStartDate = req.body["lifting-planStartDate"];
            mh.planProductQty = req.body.planProductQty;
            
            if(req.body.shorebaseServiceProductId) {
                mh.planProduct = { id: parseInt(req.body.shorebaseServiceProductId) } as ShorebaseServiceProduct;
            }

            await AppDataSource.getRepository(PlanActivityMH).save(mh);
        }

        // MEAL
        else if (req.body["meal-planStartDate"]) {
            const meal = new PlanActivityMeal();
            meal.planActivity = parentRef;
            meal.planStartDate = req.body["meal-planStartDate"];
            meal.planEndDate = req.body["meal-planEndDate"];
            meal.planPeopleCount = req.body["meal-planPeopleCount"];
            meal.planBreakfast = req.body["meal-planBreakfast"] || false;
            meal.planLunch = req.body["meal-planLunch"] || false;
            meal.planDinner = req.body["meal-planDinner"] || false;

            await AppDataSource.getRepository(PlanActivityMeal).save(meal);
        }

        // ACCOMODATION
        else if (req.body["acc-planCheckIn"]) {
            const acc = new PlanActivityAccomodation();
            acc.planActivity = parentRef;
            acc.planCheckIn = req.body["acc-planCheckIn"];
            acc.planCheckOut = req.body["acc-planCheckOut"];
            acc.planRoomCount = req.body["acc-planRoomCount"];
            
            if(req.body.roomTypeId) {
                acc.planRoomType = { id: req.body.roomTypeId } as RoomType;
            }
            
            await AppDataSource.getRepository(PlanActivityAccomodation).save(acc);
        }
        // Return hasil akhir
        const finalResult = await planActivityET.findDetailById(createdId);
        res.status(201).json(finalResult);

    } catch (error) {
        console.error("Error create plan:", error);
        res.status(500).json({ error: error.message });
    }
}

export const updatePlanActivity = async (req: Request<{ id: string }, {}, PlanActivityPayload>, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const payload = req.body;
        
        // 1. Find Existing
        const plan = await planActivityET.findDetailById(id);
        if (!plan) {
            res.status(404).json({ error: "Plan Activity not found" });
            return;
        }

        // 2. Update Base Fields
        plan.description = payload.description;
        plan.timesheetType = { code: payload.timesheetTypeCode } as TimesheetType;
        plan.company = { id: parseInt(payload.companyId) } as Company;
        if(payload.uomCode) plan.uom = { code: payload.uomCode } as UoM;
        plan.shorebaseService = { id: parseInt(payload.shorebaseServiceId) } as ShorebaseService;
        
        // Contract Service
        const csRepo = AppDataSource.getRepository(ContractService);
        const cs = await csRepo.findOne({
            where: {
                contract: { id: parseInt(payload.contractId) },
                shorebaseService: { id: parseInt(payload.shorebaseServiceId) }
            }
        });
        plan.contractService = cs || undefined;
        
        plan.subContractor = payload.subContractorId 
            ? { id: parseInt(payload.subContractorId) } as SubContractor 
            : null;

        await planActivityET.update(plan); 

        // 3. Regenerate Code (Updates if dependencies changed)
        const fullPlan = await planActivityET.findByPk({ id: plan.id }, { relations: ['shorebaseService', 'company'] });
        if(fullPlan){
            const srvName = fullPlan.shorebaseService?.name || "SRV";
            const compName = fullPlan.company?.name || "COMP";
            const newCode = `${fullPlan.id}/Plan/${srvName}/${compName}`;
            
            // FIX: Gunakan repository.update langsung untuk menghindari UpdateValuesMissingError
            await planActivityET.repository.update({ id: fullPlan.id }, { code: newCode });
        }

        // 4. Handle Specifics - Clean Slate Strategy
        if (plan.planActivityAccomodation) await AppDataSource.getRepository(PlanActivityAccomodation).remove(plan.planActivityAccomodation);
        if (plan.planActivityMeal) await AppDataSource.getRepository(PlanActivityMeal).remove(plan.planActivityMeal);
        if (plan.planActivityMH) await AppDataSource.getRepository(PlanActivityMH).remove(plan.planActivityMH);
        if (plan.planActivityJetty) await AppDataSource.getRepository(PlanActivityJetty).remove(plan.planActivityJetty);

        // 5. Create New Specific Data based on Payload
        
        // MH / LIFTING
        if (payload.shorebaseServiceProductId || payload["lifting-planStartDate"]) {
            const mh = new PlanActivityMH();
            mh.planActivity = plan;
            mh.planStartDate = payload["lifting-planStartDate"];
            mh.planProductQty = payload.planProductQty;
            if(payload.shorebaseServiceProductId) {
                mh.planProduct = { id: parseInt(payload.shorebaseServiceProductId) } as ShorebaseServiceProduct;
            }
            await AppDataSource.getRepository(PlanActivityMH).save(mh);
        }
        // MEAL
        else if (payload["meal-planStartDate"]) {
            const meal = new PlanActivityMeal();
            meal.planActivity = plan;
            meal.planStartDate = payload["meal-planStartDate"];
            meal.planEndDate = payload["meal-planEndDate"];
            meal.planPeopleCount = payload["meal-planPeopleCount"];
            meal.planBreakfast = payload["meal-planBreakfast"] || false;
            meal.planLunch = payload["meal-planLunch"] || false;
            meal.planDinner = payload["meal-planDinner"] || false;
            await AppDataSource.getRepository(PlanActivityMeal).save(meal);
        }
        // ACCOMODATION
        else if (payload["acc-planCheckIn"]) {
            const acc = new PlanActivityAccomodation();
            acc.planActivity = plan;
            acc.planCheckIn = payload["acc-planCheckIn"];
            acc.planCheckOut = payload["acc-planCheckOut"];
            acc.planRoomCount = payload["acc-planRoomCount"];
            if(payload.roomTypeId) {
                acc.planRoomType = { id: payload.roomTypeId } as RoomType;
            }
            await AppDataSource.getRepository(PlanActivityAccomodation).save(acc);
        }
        // JETTY
        
        const updatedResult = await planActivityET.findDetailById(id);
        res.json(updatedResult);

    } catch (error) {
        console.error("Error updating plan:", error);
        res.status(500).json({ error: error.message });
    }
}

// --- DELETE ---
export const deletePlanActivity = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const plan = await planActivityET.findDetailById(id);

        if (!plan) {
            res.status(404).json({ error: "Plan Activity not found" });
            return;
        }

        // 1. Delete Children first
        if (plan.planActivityAccomodation) await AppDataSource.getRepository(PlanActivityAccomodation).remove(plan.planActivityAccomodation);
        if (plan.planActivityMeal) await AppDataSource.getRepository(PlanActivityMeal).remove(plan.planActivityMeal);
        if (plan.planActivityMH) await AppDataSource.getRepository(PlanActivityMH).remove(plan.planActivityMH);
        if (plan.planActivityJetty) await AppDataSource.getRepository(PlanActivityJetty).remove(plan.planActivityJetty);

        // 2. Delete Parent
        const result = await planActivityET.delete(plan);
        res.json(result);

    } catch (error) {
        console.error("Error deleting plan:", error);
        res.status(500).json({ error: error.message });
    }
}