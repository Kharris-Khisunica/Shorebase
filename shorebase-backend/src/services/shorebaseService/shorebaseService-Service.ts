import { Like } from "typeorm";
import { ESOption, ESQuery, ESServer } from "../../components/EnterpriseSelect";
import { ETResult, ETServer } from "../../components/EnterpriseTable";
import { ShorebaseService } from "../../entity/contractService/ShorebaseService";
import { EAServer } from "../../components/EnterpriseAutofill";

const getProperty = (obj: any, path: string): any => {
    return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
}
class ShorebaseServiceET extends ETServer<ShorebaseService> implements ESServer<ShorebaseService>, EAServer<ShorebaseService>{
    constructor(){
        super(ShorebaseService)
    }

    toValueLabel(item: ShorebaseService): ESOption {
        return {value: item.id.toString(), label: item.name}
    }

    

    // Ambil data, masukin pagination
    async findSelectOptions(query: ESQuery) {
        const pageIndex = parseInt(query.pageIndex)  || 0;
        const pageSize = parseInt(query.pageSize) || 25;

        const [data,total] = await this.repository.findAndCount({
            where: {
                name: Like(`%${query.search}%`)
            },
            relations: ['uom', 'ssType'],
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

    async findSelectObject(query: ESQuery): Promise<ETResult<ShorebaseService & ESOption>> {
        const pageIndex = parseInt(query.pageIndex)  || 0;
        const pageSize = parseInt(query.pageSize) || 25;

        const valueField = query.valueField || "id"
        const labelField = query.labelField || "name"

        const [data,total] = await this.repository.findAndCount({
            where: {
                name: Like(`%${query.search}%`)
            },
            relations: ['uom', 'ssType'],
            take: pageSize,
            skip: pageIndex * pageSize
        });
            console.log("Service Object = ")
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

const shorebaseServiceET = new ShorebaseServiceET();

export default shorebaseServiceET;