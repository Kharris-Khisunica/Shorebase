export { ContractService, Service, UoM, SumCalc };

declare global {
    interface ContractService {
        id: number;
        contract:Contract;
        shorebaseService: ShorebaseService;
        company: Company;
        code: string;
        uom: UoM;
        startDate: Date;
        endDate: Date;
        sumCalc: SumCalc;
    }

    interface ContractServicePrice{
        id: number;
        contractService: ContractService;
        pricePerUom: number;
        startDate: Date;
        endDate: Date;
    }
    interface Contract{
        id: number;
        company: Company;
        name: string;
        contractNumber: string;
        startDate: Date;
        endDate: Date;

    }
    interface ShorebaseService {
        id: number;
        code: string;
        name: string;
        description: string;
        uom: UoM;
        
        active: boolean;
        startDate: Date;
        endDate: Date;

        ssType: ShorebaseServiceType;
    }

    interface ShorebaseServiceType{
        code: number;
        name: string;
    }
    interface ShorebaseServicePrice{
        id: number;
        shorebaseService: ShorebaseService;
        company: Company;
        pricePerUom: number;
        startDate: Date;
        endDate: Date;
    }

    

    interface UoM {
        code: string;
        name: string;
    }

    interface SumCalc{
        code: string;
        name: string;
    }
    
    interface ShorebaseServiceProduct{
        id: number;
        name: string;
        uom: UoM;
    }
}
