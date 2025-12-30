import { Like } from "typeorm";
import { ESOption, ESQuery, ESServer } from "../../components/EnterpriseSelect";
import { ETResult, ETServer } from "../../components/EnterpriseTable";
import { User } from "../../entity/user/User";

class UserET extends ETServer<User> implements ESServer<User> {
    constructor() {
        super(User);
    }
    toValueLabel(item: User): ESOption {
        return { value: item.id.toString(), label: `${item.name} (${item.username})`  };
    }
    async findSelectOptions(query: ESQuery): Promise<ETResult<ESOption>> {
        const pageIndex = parseInt(query.pageIndex) || 0;
        const pageSize = parseInt(query.pageSize) || 25;

        const [data, total] = await this.repository.findAndCount({
            where: [
                { name: Like(`%${query.search}%`) },
                { username: Like(`%${query.search}%`) }
            ],
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
const userET = new UserET();

export default userET;
