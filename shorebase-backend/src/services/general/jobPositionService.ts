import { Like } from "typeorm";
import { ESOption, ESQuery, ESServer } from "../../components/EnterpriseSelect";
import { ETResult, ETServer } from "../../components/EnterpriseTable";
import { JobPosition } from "../../entity/user/JobPosition";

class JobPositionET extends ETServer<JobPosition> implements ESServer<JobPosition> {
    constructor() {
        super(JobPosition);
    }
    toValueLabel(item: JobPosition): ESOption {
        return { value: item.id.toString(), label: `${item.jobTitle?.name || ''} - ${item.company?.name || ''}`  };
    }
    async findSelectOptions(query: ESQuery): Promise<ETResult<ESOption>> {
        const pageIndex = parseInt(query.pageIndex) || 0;
        const pageSize = parseInt(query.pageSize) || 25;

        const [data, total] = await this.repository.findAndCount({
            where: [
                { jobTitle: { name: Like(`%${query.search}%`) } },
                { company: { name: Like(`%${query.search}%`) } }
            ],
            relations: {
                company: true,
                jobTitle: true
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
const jobPositionET = new JobPositionET();

export default jobPositionET;