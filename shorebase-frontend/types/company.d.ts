export {Company}

declare global{

    interface Company{
        id: number;
        name: string;
        internal: boolean;
        startDate: Date;
        endDate: Date;
    }

    interface SubContractor{
        id: number;
        contract: Contract;
        company: Company;
        startDate: Date;
        endDate: Date;
    }
}