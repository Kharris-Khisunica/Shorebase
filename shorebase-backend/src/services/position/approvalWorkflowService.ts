import { LessThanOrEqual, MoreThan, Repository } from "typeorm";
import { AppDataSource } from "../../dataSource";
import { ApprovalWorkflow } from "../../entity/approval/ApprovalWorkflow";
import { DateTime } from "luxon";
import { DATE_CONSTANT } from "../../constants/time_constants";
import { ApprovalType } from "../../entity/approval/ApprovalType";
import { SubContractor } from "../../entity/company/SubContractor";
import { ApprovalWorkflowStage } from "../../entity/approval/ApprovalWorkflowStage";

export type ApprovalWorkflowCreateReqBody = {
    typeCode: string,
    timesheetTypeCode: string,
    companyId: number,
    contractId?: number,
    subcontractorId?: number,
    stages: {
        jobPositionId: number;
        userPositionId?: number;
    }[]
}

export type ApprovalWorkflowEditReqBody = ApprovalWorkflowCreateReqBody & {
    id: number
}

class ApprovalWorkflowController {
    repo: Repository<ApprovalWorkflow>
    constructor() {
        this.repo = AppDataSource.getRepository(ApprovalWorkflow);
    }

    async getByCompany(id: number, date: string = DateTime.now().toISODate()) {
        return this.repo.find({
            where: {
                company: {
                    id
                },
                startDate: LessThanOrEqual(date),
                endDate: MoreThan(date)
            },
            relations: {
                approvalWorkstages: {
                    jobPosition: {
                        jobTitle: true,
                        company: true
                    },
                    userPosition: {
                        jobPosition: {
                            jobTitle: true,
                            company: true
                        },
                        user: true
                    }
                },
                timesheetType: true,
                type: true,
                contract: true
            }
        });
    }

    async createWithStages(awBody: ApprovalWorkflowCreateReqBody) {
        const aw = new ApprovalWorkflow();
        
        const subcontractorRepo = AppDataSource.getRepository(SubContractor);
        let subcontractor: SubContractor | null = null;

        if (awBody.typeCode == 'S') {
            if (awBody.contractId) {
                subcontractor = await subcontractorRepo.findOne({
                    where: {
                        company: {
                            id: awBody.companyId
                        },
                        contract: {
                            id: awBody.contractId
                        }
                    }
                });
                if (!subcontractor) {
                    subcontractor = new SubContractor();
                    Object.assign(subcontractor, {
                        company: { id: awBody.companyId },
                        contract: { id: awBody.contractId },
                        startDate: DateTime.now().toISO(),
                        endDate: DATE_CONSTANT.MAX_VALUE
                    } as SubContractor);
                    
                    subcontractor = await subcontractorRepo.save(subcontractor);
                }
            } else {
                throw new Error('contractId is required');
            }
        }
        
        Object.assign(aw, {
            type: { code: awBody.typeCode },
            timesheetType: { code: awBody.timesheetTypeCode },
            company: { id: awBody.companyId },
            contract: awBody.contractId ? { id: awBody.contractId } : null,
            subContractor: subcontractor,
            approvalWorkstages: awBody.stages.map((s, index) => ({
                jobPosition: { id: s.jobPositionId },
                userPosition: s.userPositionId ? { id: s.userPositionId } : null,
                level: index+1
            })),
            startDate: DateTime.now().toISO(),
            endDate: DATE_CONSTANT.MAX_VALUE
        } as ApprovalWorkflow);
        await this.repo.save(aw);

        return aw;
    }

    async updateWithStages(workflowId: number, awBody: ApprovalWorkflowCreateReqBody) {
        const aw = new ApprovalWorkflow();
        
        const subcontractorRepo = AppDataSource.getRepository(SubContractor);
        let subcontractor: SubContractor | null = null;

        if (awBody.typeCode == 'S') {
            if (awBody.contractId) {
                subcontractor = await subcontractorRepo.findOne({
                    where: {
                        company: {
                            id: awBody.companyId
                        },
                        contract: {
                            id: awBody.contractId
                        }
                    }
                });
                if (!subcontractor) {
                    subcontractor = new SubContractor();
                    Object.assign(subcontractor, {
                        company: { id: awBody.companyId },
                        contract: { id: awBody.contractId },
                        startDate: DateTime.now().toISO(),
                        endDate: DATE_CONSTANT.MAX_VALUE
                    } as SubContractor);
                    
                    subcontractor = await subcontractorRepo.save(subcontractor);
                }
            } else {
                throw new Error('contractId is required');
            }
        }
        
        Object.assign(aw, {
            type: { code: awBody.typeCode },
            timesheetType: { code: awBody.timesheetTypeCode },
            company: { id: awBody.companyId },
            contract: awBody.contractId ? { id: awBody.contractId } : null,
            subContractor: subcontractor,
            approvalWorkstages: awBody.stages.map((s, index) => ({
                jobPosition: { id: s.jobPositionId },
                userPosition: s.userPositionId ? { id: s.userPositionId } : null,
                level: index+1
            })),
            startDate: DateTime.now().toISO(),
            endDate: DATE_CONSTANT.MAX_VALUE
        } as ApprovalWorkflow);
        await this.repo.save(aw);

        return aw;
    }
}
const approvalWorkflowService = new ApprovalWorkflowController();
export default approvalWorkflowService;
