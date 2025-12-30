import { Like } from "typeorm";
import { ESOption, ESQuery, ESServer } from "../../components/EnterpriseSelect";
import { ETResult, ETServer } from "../../components/EnterpriseTable";
import { Equipment } from "../../entity/activity/Equipment";

class EquipmentET extends ETServer<Equipment> implements ESServer<Equipment> {
    constructor(){
        super(Equipment);
    }    

    toValueLabel(item: Equipment): ESOption {
        return {value: item.id.toString(), label: item.name}
    }

    async findSelectOptions(query: ESQuery): Promise<ETResult<ESOption>> {
        const pageIndex = parseInt(query.pageIndex)  || 0;
                const pageSize = parseInt(query.pageSize) || 25;
        
                const [data,total] = await this.repository.findAndCount({
                    where: {
                        name: Like(`%${query.search}%`)
                    },
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
const equipmentET = new EquipmentET();

export default equipmentET;