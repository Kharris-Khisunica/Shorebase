import { Like } from "typeorm";
import { ESOption, ESQuery, ESServer } from "../../components/EnterpriseSelect";
import { ETResult, ETServer } from "../../components/EnterpriseTable";
import { ContractServicePrice } from "../../entity/contractService/ContractServicePrice";

class ContractServicePriceET extends ETServer<ContractServicePrice> {
 
    constructor(){
        super(ContractServicePrice);
    }
}

const contractServicePriceET = new ContractServicePriceET();

export default contractServicePriceET;