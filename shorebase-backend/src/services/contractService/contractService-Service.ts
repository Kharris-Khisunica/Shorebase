import { Like, TreeLevelColumn } from "typeorm";
import { ESOption, ESQuery, ESServer } from "../../components/EnterpriseSelect";
import { ETResult, ETServer } from "../../components/EnterpriseTable";
import { ContractService } from "../../entity/contractService/ContractService";
import { EAServer } from "../../components/EnterpriseAutofill";

const getProperty = (obj: any, path: string): any => {
    return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
}
class ContractServiceET extends ETServer<ContractService> implements ESServer<ContractService>, EAServer<ContractService> {

    constructor(){
        super(ContractService);
    }

    // Label nya apa ya. Meanwhile pake .code dulu
    toValueLabel(item: ContractService): ESOption {
        return {value: item.id.toString(), label: item.code}
    }

    async findSelectOptions(query: ESQuery) {
        const pageIndex = parseInt(query.pageIndex)  || 0;
        const pageSize = parseInt(query.pageSize) || 25;

        const [data,total] = await this.repository.findAndCount({
            where: {
                code: Like(`%${query.search}%`)
            },
            relations: {
                contract: true,
                shorebaseService: {
                    ssType: true
                },
                company: true,
                uom: true,
            },            
            take: pageSize,
            skip: pageIndex * pageSize
        });
                console.log("CS Data = ")
                console.log(data)

        const options = data.map(c=>this.toValueLabel(c))
        return{
            total,
            pageIndex,
            pageSize,
            data: options
        }

    }

    async findSelectObject(query: ESQuery): Promise<ETResult<ContractService & ESOption>> {
        const pageIndex = parseInt(query.pageIndex)  || 0;
                const pageSize = parseInt(query.pageSize) || 25;
                
                const valueField = query.valueField || "id"
                const labelField = query.labelField || "code"
                
                const qb = this.repository.createQueryBuilder("contractService")

                // Add relations
                qb
                .leftJoinAndSelect("contractService.contract", 'contract')
                .leftJoinAndSelect("contractService.shorebaseService", 'shorebaseService')
                .leftJoinAndSelect("shorebaseService.ssType", 'ssType')
                .leftJoinAndSelect("contractService.company", 'company')
                .leftJoinAndSelect("contractService.uom", 'uom')
                .leftJoinAndSelect("contractService.sumCalc", 'sumCalc')

                // Handle Custom Filters
                if (query.customFilter){
                    const customFilter = JSON.parse(query.customFilter)

                    // Untuk filter service
                    if(customFilter.companyId && customFilter.contractId){
                        qb.andWhere("contractService.contract.id = :contractId AND contractService.company.id = :companyId", {
                            companyId: customFilter.companyId,
                            contractId: customFilter.contractId,
                        }
                    )}

                    
                }

                
                const [data,total] = await qb.skip(pageIndex * pageSize).take(pageSize).getManyAndCount();
                
                        console.log("CS Object = ")
                        console.log(data)
                
                const autofillData = data.map(c=>{
                            const value = getProperty(c, valueField);
                            const label = getProperty(c, labelField);
                
                            return {
                                ...c,
                                value: value !== undefined && value !== null ? String(value) : "",
                                label: label !== undefined && label !== null ?  String(label) : "",
                            }
                        })
                
                
                        return{
                            total,
                            pageIndex,
                            pageSize,
                            data: autofillData
                        }
    }
}

const contractServiceET = new ContractServiceET;

export default contractServiceET;