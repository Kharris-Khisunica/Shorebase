import { defineStore } from 'pinia'

const services : Service[] = [
    {
        id: 1,
        code: 'SVD',
        name: 'Stevedoring',
        description: null,
        type: {code:'CTR', description: 'Order for Contractor Company'}
    },
    {
        id: 2,
        code: 'CGD',
        name: 'Cargodoring',
        description: null,
        type: {code:'CTR', description: 'Order for Contractor Company'}
    },
    {
        id:3,
        code: 'WD',
        name: 'Welding',
        description: null,
        type: {code:'SLF', description: 'Order for Own Company'}
    }
];

const uoms : UoM[] = [
    {
        code: 'TON',
        name: 'Ton'
    },
    {
        code: 'M',
        name: 'Meter'
    }
];


export const useContractServiceStore = defineStore('contractservice', {
    state: () => ({
        uoms: uoms,
        services: services,
        contractServices: [
            {
                id: 1,
                code: '1.1',
                service: services[0],
                uom: uoms[0],
            },
            {
                id: 2,
                code: '1.2',
                service: services[1],
                uom: uoms[0],
            },
            {
                id: 3,
                code: '2.1',
                service: services[2],
                uom: uoms[1], 
            }

        ] as ContractService[]
    }),
    actions: {

    },
    persist: true
});
