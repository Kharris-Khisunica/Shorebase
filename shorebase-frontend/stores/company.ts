import {defineStore} from 'pinia'

    const company: Company[] = [
    {
     code: 'PHM',
     name: 'PT. Pertamina Hulu Mahakam',
     start_date:null ,
     end_date:null
    },
    {
        code: 'ELSA',
        name: 'PT. Elnusa, Tbk',
        start_date: null,
        end_date: null
    },
    {
        code: 'SLB',
        name: 'SLB',
        start_date: null,
        end_date: null,
    },
    {
        code: 'MI',
        name: 'MI',
        start_date: null,
        end_date: null,
    }
];
 export const useCompanyStore = defineStore('company', {
    
    
    state: () => ({
        companies: company as Company[]
    }),
    actions: {},
    persist: true
 })
