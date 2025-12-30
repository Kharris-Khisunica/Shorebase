import { FindOptionsWhere, Like } from "typeorm";
import { ESOption, ESQuery, ESServer } from "../../components/EnterpriseSelect";
import { ETResult, ETServer } from "../../components/EnterpriseTable";
import { UserPosition } from "../../entity/user/UserPosition";
import { JobPosition } from "../../entity/user/JobPosition";

class UserPositionET extends ETServer<UserPosition> implements ESServer<UserPosition> {
    constructor() {
        super(UserPosition);
    }
    toValueLabel(item: UserPosition): ESOption {
        return { value: item.id.toString(), label: `${item.user?.name || ''}, ${item.jobPosition?.jobTitle?.name || ''} at ${item.jobPosition?.company?.name || ''}`  };
    }
    async findSelectOptions(query: ESQuery): Promise<ETResult<ESOption>> {
        const pageIndex = parseInt(query.pageIndex) || 0;
        const pageSize = parseInt(query.pageSize) || 25;
        let jobPositionId = null;
        if (query.customFilter) {
            jobPositionId = JSON.parse(query.customFilter).jobPositionId;
        }

        const where: FindOptionsWhere<UserPosition>[] = [
            { jobPosition: {  jobTitle: { name: Like(`%${query.search}%`) } } },
            { jobPosition: { company: { name: Like(`%${query.search}%`) } } },
            { user: { name: Like(`%${query.search}%`) } }
        ];
        if (jobPositionId) {
            for (const w of where) {
                if (w.jobPosition && w.jobPosition instanceof JobPosition) {
                    w.jobPosition.id = jobPositionId;
                } else {
                    w.jobPosition = { id: jobPositionId };
                }
            }
        }

        const [data, total] = await this.repository.findAndCount({
            where: where,
            relations: {
                user: true,
                jobPosition: {
                    company: true,
                    jobTitle: true
                }
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
const userPositionET = new UserPositionET();
export default userPositionET;