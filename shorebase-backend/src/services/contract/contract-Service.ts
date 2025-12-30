import { FindOptionsWhere, LessThanOrEqual, Like, MoreThan } from "typeorm"
import {ESOption, ESQuery, ESServer} from "../../components/EnterpriseSelect"
import {ETResult, ETServer} from "../../components/EnterpriseTable"
import { Contract} from "../../entity/contractService/Contract"
import { EAServer } from "../../components/EnterpriseAutofill"

const getProperty = (obj: any, path: string): any => {
    return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
}
import { Company } from "../../entity/company/Company"
import { DateTime } from "luxon"

class ContractET extends ETServer<Contract> implements ESServer<Contract>, EAServer<Contract>{

    constructor(){
        super(Contract)
    }

    // Contract label nya mau apaa
    toValueLabel(item: Contract): ESOption {
        return {value: item.id.toString(), label: item.contractNumber}
    }

    async findSelectOptions(query: ESQuery) {
        const pageIndex = parseInt(query.pageIndex)  || 0;
        const pageSize = parseInt(query.pageSize) || 25;

        const qb = this.repository.createQueryBuilder("contract");

        const date = DateTime.now().toISODate();

        qb
        .leftJoinAndSelect('contract.company', 'company')
        .where('contract.startDate <= :date AND contract.endDate >= :date', {date: date})
        
        if(query.customFilter){
            const customFilter = JSON.parse(query.customFilter);

            if(customFilter.companyId){
                qb.andWhere('contract.company.id = :companyId', {companyId: customFilter.companyId})
            }   
        }

        // let companyId = null;
        // if (query.customFilter) {
        //     companyId = JSON.parse(query.customFilter).companyId;
        // }
        
        // const where: FindOptionsWhere<Contract> = {
        //     contractNumber: Like(`%${query.search}%`),
        //     startDate: LessThanOrEqual(date),
        //     endDate: MoreThan(date),
        // };
        // if (companyId) {
        //     if (where.company && where.company instanceof Company) {
        //         where.company.id = companyId;
        //     } else {
        //         where.company = { id: companyId };
        //     }
        // }

        const [data,total] = await qb
                    .skip(pageIndex * pageSize)
                    .take(pageSize)
                    .getManyAndCount();  

                console.log("C Data = ")
                console.log(data)
        const options = data.map(c=>this.toValueLabel(c))
        return{
            total,
            pageIndex,
            pageSize,
            data: options
        }
    }
    
    async findSelectObject(query: ESQuery): Promise<ETResult<Contract & ESOption>> {
        const pageIndex = parseInt(query.pageIndex)  || 0;
        const pageSize = parseInt(query.pageSize) || 25;
        
        const valueField = query.valueField || "id"
        const labelField = query.labelField || "contractNumber"
        
        const qb = this.repository.createQueryBuilder("contract");

        const date = DateTime.now().toISODate();

        qb
        .leftJoinAndSelect('contract.company', 'company')
        .where('contract.startDate <= :date AND contract.endDate > :date', {date: date})
        
        if(query.customFilter){
            const customFilter = JSON.parse(query.customFilter);

            if(customFilter.companyId){
                qb.andWhere('contract.company.id = :companyId', {companyId: customFilter.companyId})
            }   
        }


        // if (query.customFilter) {
        //     companyId = JSON.parse(query.customFilter).companyId;
        // }
        
        // const where: FindOptionsWhere<Contract> = {
        //     contractNumber: Like(`%${query.search}%`),
        //     startDate: LessThanOrEqual(date),
        //     endDate: MoreThan(date),
        // };
        // if (companyId) {
        //     if (where.company && where.company instanceof Company) {
        //         where.company.id = companyId;
        //     } else {
        //         where.company = { id: companyId };
        //     }
        // }

        const [data,total] = await qb
                    .skip(pageIndex * pageSize)
                    .take(pageSize)
                    .getManyAndCount();  

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

const contractET = new ContractET();

export default contractET;