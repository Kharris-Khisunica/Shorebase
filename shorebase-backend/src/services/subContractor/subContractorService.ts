import { Like} from "typeorm";
import {ESOption, ESQuery, ESServer} from "../../components/EnterpriseSelect"
import {ETResult, ETServer} from "../../components/EnterpriseTable"
import { SubContractor } from "../../entity/company/SubContractor";

class SubContractorET extends ETServer<SubContractor> implements ESServer<SubContractor>{

    constructor(){
        super(SubContractor)
    }

    toValueLabel(item: SubContractor): ESOption {
        return {value: item.id.toString(), label: item.company.name}
    }

    async findSelectOptions(query: ESQuery) {
        const pageIndex = parseInt(query.pageIndex)  || 0;
        const pageSize = parseInt(query.pageSize) || 25;

        const [data,total] = await this.repository.findAndCount({
            where: {
                company:{
                    name: Like(`%${query.search}%`)
                }
            },
            relations: ['company', 'contract'],
            take: pageSize,
            skip: pageIndex * pageSize
        });

        const options = data.map(c=>this.toValueLabel(c))
        return{
            total,
            pageIndex,
            pageSize,
            data: options
        }

    }

}

const subContractorET = new SubContractorET();

export default subContractorET;