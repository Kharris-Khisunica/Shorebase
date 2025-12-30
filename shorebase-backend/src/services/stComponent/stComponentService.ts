import { ETServer } from "../../components/EnterpriseTable";
import { STComponent } from "../../entity/summaryTimesheet/STComponent";

class STComponentET extends ETServer<STComponent> {
    constructor(){
        super(STComponent)
    }

    // TODO: Add Autofill for ShorebasePrice and ContractServicePrice 
}

const stComponentET = new STComponentET();

export default stComponentET;