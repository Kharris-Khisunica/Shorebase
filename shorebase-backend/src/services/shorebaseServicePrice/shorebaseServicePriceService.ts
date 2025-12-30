import { Like} from "typeorm";
import {ESOption, ESQuery, ESServer} from "../../components/EnterpriseSelect"
import {ETResult, ETServer} from "../../components/EnterpriseTable"
import { ShorebaseServicePrice } from "../../entity/contractService/ShorebaseServicePrice";

class ShorebaseServicePriceET extends ETServer<ShorebaseServicePrice>{

    constructor(){
        super(ShorebaseServicePrice);
    }
}

const shorebaseServicePriceET = new ShorebaseServicePriceET();

export default shorebaseServicePriceET;