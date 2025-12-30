import { Like } from "typeorm";
import { ESOption, ESQuery, ESServer } from "../../components/EnterpriseSelect";
import { ETResult, ETServer } from "../../components/EnterpriseTable";
import { ShorebaseServiceProduct } from "../../entity/contractService/ShorebaseServiceProduct";
import { EAServer } from "../../components/EnterpriseAutofill";

const getProperty = (obj: any, path: string): any => {
    return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
}
class ShorebaseServiceProductET extends ETServer<ShorebaseServiceProduct> implements ESServer<ShorebaseServiceProduct>, EAServer<ShorebaseServiceProduct>{
    constructor(){
        super(ShorebaseServiceProduct)
    }

    toValueLabel(item: ShorebaseServiceProduct): ESOption {
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
            relations: ['uom', 'shorebaseService'],
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

    async findSelectObject(query: ESQuery): Promise<ETResult<ShorebaseServiceProduct & ESOption>> {
        const pageIndex = parseInt(query.pageIndex)  || 0;
        const pageSize = parseInt(query.pageSize) || 25;

        const valueField = query.valueField || "id"
        const labelField = query.labelField || "name"

        const [data,total] = await this.repository.findAndCount({
            where: {
                name: Like(`%${query.search}%`)
            },
            relations: {
                activities:true,
                uom: true,
            },
            take: pageSize,
            skip: pageIndex * pageSize
        });



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

const shorebaseServiceProductET = new ShorebaseServiceProductET();

export default shorebaseServiceProductET;