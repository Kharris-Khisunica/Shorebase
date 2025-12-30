import { Like } from "typeorm";
import { ESOption, ESQuery, ESServer } from "../../components/EnterpriseSelect";
import { ETServer } from "../../components/EnterpriseTable";
import { Company } from "../../entity/company/Company";

class CompanyET extends ETServer<Company> implements ESServer<Company> {
    constructor() {
        super(Company);
    }

    toValueLabel(item: Company): ESOption {
        return { value: item.id.toString(),label: item.name  };
    }

    async findSelectOptions(query: ESQuery) {
        const pageIndex = parseInt(query.pageIndex) || 0;
        const pageSize = parseInt(query.pageSize) || 25;

        const [data, total] = await this.repository.findAndCount({
            where: {
                name: Like(`%${query.search}%`)
            },
            take: pageSize,
            skip: pageIndex * pageSize
        });

        const options = data.map(c => this.toValueLabel(c));
        return {
            total,
            pageIndex,
            pageSize,
            data: options
        }
    }

    
}
const companyET = new CompanyET();

export default companyET;