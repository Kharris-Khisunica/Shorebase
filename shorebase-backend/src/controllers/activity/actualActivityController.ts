import { Request, Response } from "express";
import { ETQuery } from "../../components/EnterpriseTable";
import actualActivityET from "../../services/actualActivity/actualActivityService"; // Import Service
import { ESQuery } from "../../components/EnterpriseSelect";
import { AppDataSource } from "../../dataSource";
import { ActualActivity } from "../../entity/actualActivity/ActualActivity";
import { PlanActivity } from "../../entity/planActivity/PlanActivity";

// Common Entities
import { TimesheetType } from "../../entity/timesheet/TimesheetType";
import { Company } from "../../entity/company/Company";
import { UoM } from "../../entity/contractService/UoM";
import { ShorebaseService } from "../../entity/contractService/ShorebaseService";
import { ContractService } from "../../entity/contractService/ContractService";
import { SubContractor } from "../../entity/company/SubContractor";
import { DateTime } from "luxon";
import { ShorebaseServiceProduct } from "../../entity/contractService/ShorebaseServiceProduct";
import { Ship } from "../../entity/activity/Ship";
import { Equipment } from "../../entity/activity/Equipment";
import { RoomType } from "../../entity/activity/RoomType";

// Specific Entities
import { ActualActivityAccomodation } from "../../entity/actualActivity/ActualActivity-Accomodation";
import { ActualActivityMeal } from "../../entity/actualActivity/ActualActivity-Meal";
import { ActualActivityMH } from "../../entity/actualActivity/ActualActivity-MH";
import { ActualActivityJetty } from "../../entity/actualActivity/ActualActivity-Jetty";

interface ActualActivityPayload {
    timesheetTypeCode: string;
    companyId: string;
    contractId: string;
    subContractorId?: string;
    shorebaseServiceId: string;
    uomCode?: string;
    description: string;
    remark?: string;
    
    planActivityId?: string; 

    serviceTypeCode?: string; 

    // MH
    "mh-actualStartedAt"?: string;
    "mh-actualEndedAt"?:string;
    "mh-shorebaseServiceProductId"?: string;
    "mh-actualProductQty"?: number;
    "mh-equipmentId"?: string;

    // Meal
    "meal-actualStartedAt"?: string;
    "meal-actualEndDate"?: string;
    "meal-actualPeopleCount"?: number;
    "meal-actualBreakfast"?: boolean;
    "meal-actualLunch"?: boolean;
    "meal-actualDinner"?: boolean;

    // Accommodation
    "acc-actualCheckIn"?: string;
    "acc-actualCheckOut"?: string;
    "acc-actualRoomCount"?: number;
    roomTypeId?: number;

    // Jetty
}

export const getActualActivities = async (req: Request<{}, {}, {}, ETQuery>, res: Response) => {
    const result = await actualActivityET.findAll(
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
            .leftJoinAndSelect(`${qb.alias}.planActivity`, 'planActivity')
            .leftJoinAndSelect(`${qb.alias}.status`, `status`)
    );
    res.send(result);
}

export const getActualActivity = async (req: Request<{ id: string }>, res: Response) => {
    const result = await actualActivityET.findDetailById(parseInt(req.params.id));
    if (!result) {
        res.status(404).json({ error: "Actual Activity not found" });
        return;
    }
    res.json(result);
}

export const getActualActivitySelectOptions = async (req: Request<{}, {}, {}, ESQuery>, res: Response) => {
    const result = await actualActivityET.findSelectOptions(req.query);
    res.send(result);
}

export const getActualActivityAutofillOptions = async (req: Request<{}, {}, {}, ESQuery>, res: Response) => {
    const result = await actualActivityET.findSelectObject(req.query);
    res.send(result);
}

export const createActualActivity = async (req: Request<{}, {}, ActualActivityPayload>, res: Response) => {
    try {
        const actual = new ActualActivity();

        // 1. Base Fields
        actual.description = req.body.description;
        actual.timesheetType = { code: req.body.timesheetTypeCode } as TimesheetType;
        actual.company = { id: parseInt(req.body.companyId) } as Company;
        actual.uom = { code: req.body.uomCode } as UoM;
        actual.shorebaseService = { id: parseInt(req.body.shorebaseServiceId) } as ShorebaseService;
        

        if (req.body.planActivityId) {
            actual.planActivity = { id: parseInt(req.body.planActivityId) } as PlanActivity;
        }

        const csRepo = AppDataSource.getRepository(ContractService);
        const cs = await csRepo.findOne({
            where: {
                contract: { id: parseInt(req.body.contractId) },
                shorebaseService: { id: parseInt(req.body.shorebaseServiceId) }
            }
        });
        actual.contractService = cs ? { id: cs.id } as ContractService : undefined;

        if (req.body.subContractorId) {
            actual.subContractor = { id: parseInt(req.body.subContractorId) } as SubContractor;
        }
const insertResult = await actualActivityET.repository.insert(actual);
        const createdId = insertResult.identifiers[0].id;

        // 3. Generate Code & Update
        const fullActual = await actualActivityET.findByPk({ id: createdId }, { relations: ['shorebaseService', 'company'] });
        if (fullActual) {
            const srvName = fullActual.shorebaseService?.name || "SRV";
            const compName = fullActual.company?.name || "COMP";
            const newCode = `${fullActual.id}/ACT/${srvName}/${compName}`;
            await actualActivityET.repository.update({ id: createdId }, { code: newCode });
        }

        // 4. Handle Specific Data (Child Tables)
        const parentRef = { id: createdId } as ActualActivity;

        // MH / LIFTING
        if (req.body["mh-shorebaseServiceProductId"] || req.body["mh-actualStartedAt"]) {
            const mh = new ActualActivityMH();
            mh.actualActivity = parentRef;
            mh.actualStartedAt = req.body["mh-actualStartedAt"];
            mh.actualEndedAt=req.body["mh-actualEndedAt"]
            mh.actualProductQty = req.body["mh-actualProductQty"];

            if (req.body["mh-shorebaseServiceProductId"]) {
                mh.actualProduct = { id: parseInt(req.body["mh-shorebaseServiceProductId"]) } as ShorebaseServiceProduct;
            }
            await AppDataSource.getRepository(ActualActivityMH).save(mh);
        }
        // MEAL
        else if (req.body["meal-actualStartDate"]) {
            const meal = new ActualActivityMeal();
            meal.actualActivity = parentRef;
            meal.actualStartDate = req.body["meal-actualStartDate"];
            meal.actualEndDate = req.body["meal-actualEndDate"];
            meal.actualPeopleCount = req.body["meal-actualPeopleCount"];
            meal.actualBreakfast = req.body["meal-actualBreakfast"] || false;
            meal.actualLunch = req.body["meal-actualLunch"] || false;
            meal.actualDinner = req.body["meal-actualDinner"] || false;
            await AppDataSource.getRepository(ActualActivityMeal).save(meal);
        }
        // ACCOMODATION
        else if (req.body["acc-actualCheckIn"]) {
            const acc = new ActualActivityAccomodation();
            acc.actualActivity = parentRef;
            acc.actualCheckIn = req.body["acc-actualCheckIn"];
            acc.actualCheckOut = req.body["acc-actualCheckOut"];
            acc.actualRoomCount = req.body["acc-actualRoomCount"];
            if (req.body.roomTypeId) {
                acc.actualRoomType = { id: req.body.roomTypeId } as RoomType;
            }
            await AppDataSource.getRepository(ActualActivityAccomodation).save(acc);
        }

        const finalResult = await actualActivityET.findDetailById(createdId);        res.status(201).json(finalResult);

    } catch (error) {
        console.error("Error creating actual activity:", error);
        res.status(500).json({ error: "Failed to create actual activity", details: error.message });
    }
}

export const updateActualActivity = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const payload = req.body;
        
        // 1. Find Existing
        const actual = await actualActivityET.findDetailById(id);
        if (!actual) {
            res.status(404).json({ error: "Actual Activity not found" });
            return;
        }

        // 2. Update Base Fields
        actual.description = payload.description;
        actual.remark = payload.remark;
        actual.timesheetType = { code: payload.timesheetTypeCode } as TimesheetType;
        actual.company = { id: parseInt(payload.companyId) } as Company;
        if(payload.uomCode) actual.uom = { code: payload.uomCode } as UoM;
        actual.shorebaseService = { id: parseInt(payload.shorebaseServiceId) } as ShorebaseService;
        
        // Contract Service
        const csRepo = AppDataSource.getRepository(ContractService);
        const cs = await csRepo.findOne({
            where: {
                contract: { id: parseInt(payload.contractId) },
                shorebaseService: { id: parseInt(payload.shorebaseServiceId) }
            }
        });
        actual.contractService = cs || undefined;
        
        actual.subContractor = payload.subContractorId 
            ? { id: parseInt(payload.subContractorId) } as SubContractor 
            : null;

        await actualActivityET.update(actual); 

        // 3. Update Code (jika relasi berubah)
        const fullActual = await actualActivityET.findByPk({ id: actual.id }, { relations: ['shorebaseService', 'company'] });
        if(fullActual){
            const srvName = fullActual.shorebaseService?.name || "SRV";
            const compName = fullActual.company?.name || "COMP";
            const newCode = `${fullActual.id}/ACT/${srvName}/${compName}`;
            await actualActivityET.repository.update({ id: fullActual.id }, { code: newCode });
        }

        // 4. Handle Specifics - Clean Slate Strategy
        if (actual.actualActivityAccomodation) await AppDataSource.getRepository(ActualActivityAccomodation).remove(actual.actualActivityAccomodation);
        if (actual.actualActivityMeal) await AppDataSource.getRepository(ActualActivityMeal).remove(actual.actualActivityMeal);
        if (actual.actualActivityMH) await AppDataSource.getRepository(ActualActivityMH).remove(actual.actualActivityMH);
        if (actual.actualActivityJetty) await AppDataSource.getRepository(ActualActivityJetty).remove(actual.actualActivityJetty);

        // 5. Create New Specific Data based on Payload
        
        // MH / LIFTING
        if (payload["mh-shorebaseServiceProductId"] || payload["mh-actualStartedAt"]) {
            const mh = new ActualActivityMH();
            mh.actualActivity = actual;
            mh.actualStartedAt = payload["mh-actualStartedAt"];
            mh.actualEndedAt = payload["mh-actualEndedAt"]
            mh.actualProductQty = payload["mh-actualProductQty"];
            if(payload["mh-shorebaseServiceProductId"]) {
                mh.actualProduct = { id: parseInt(payload["mh-shorebaseServiceProductId"]) } as ShorebaseServiceProduct;
            }
            if(payload["mh-equipmentId"]) {
                mh.equipment = { id: parseInt(payload["mh-equipmentId"]) } as Equipment;
            }
            await AppDataSource.getRepository(ActualActivityMH).save(mh);
        }
        // MEAL
        else if (payload["meal-actualStartDate"]) {
            const meal = new ActualActivityMeal();
            meal.actualActivity = actual;
            meal.actualStartDate = payload["meal-actualStartDate"];
            meal.actualEndDate = payload["meal-actualEndDate"];
            meal.actualPeopleCount = payload["meal-actualPeopleCount"];
            meal.actualBreakfast = payload["meal-actualBreakfast"] || false;
            meal.actualLunch = payload["meal-actualLunch"] || false;
            meal.actualDinner = payload["meal-actualDinner"] || false;
            await AppDataSource.getRepository(ActualActivityMeal).save(meal);
        }
        // ACCOMODATION
        else if (payload["acc-actualCheckIn"]) {
            const acc = new ActualActivityAccomodation();
            acc.actualActivity = actual;
            acc.actualCheckIn = payload["acc-actualCheckIn"];
            acc.actualCheckOut = payload["acc-actualCheckOut"];
            acc.actualRoomCount = payload["acc-actualRoomCount"];
            if(payload.roomTypeId) {
                acc.actualRoomType = { id: payload.roomTypeId } as RoomType;
            }
            await AppDataSource.getRepository(ActualActivityAccomodation).save(acc);
        }
        
        const updatedResult = await actualActivityET.findDetailById(id);
        res.json(updatedResult);

    } catch (error) {
        console.error("Error updating actual activity:", error);
        res.status(500).json({ error: error.message });
    }
}

// --- DELETE ---
export const deleteActualActivity = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const actual = await actualActivityET.findDetailById(id);

        if (!actual) {
            res.status(404).json({ error: "Actual Activity not found" });
            return;
        }

        // 1. Delete Children
        if (actual.actualActivityAccomodation) await AppDataSource.getRepository(ActualActivityAccomodation).remove(actual.actualActivityAccomodation);
        if (actual.actualActivityMeal) await AppDataSource.getRepository(ActualActivityMeal).remove(actual.actualActivityMeal);
        if (actual.actualActivityMH) await AppDataSource.getRepository(ActualActivityMH).remove(actual.actualActivityMH);
        if (actual.actualActivityJetty) await AppDataSource.getRepository(ActualActivityJetty).remove(actual.actualActivityJetty);

        // 2. Delete Parent
        const result = await actualActivityET.delete(actual);
        res.json({ message: "Actual Activity deleted successfully", data: result });

    } catch (error) {
        console.error("Error deleting actual activity:", error);
        res.status(500).json({ error: error.message });
    }
}