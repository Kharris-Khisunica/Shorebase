import {defineStore} from 'pinia'

const orderTypes: OrderType[] = [
    {
        code:'SLF', 
        description: 'Order for Own Company'
    },

    {
        code:'CTR', 
        description: 'Order for Contractor Company'
    },

]

export const useOrderTypeStore = defineStore('ordertype', {
    state: () => ({orderTypes: orderTypes}),
    actions: {},
    persist: true
})
