import { defineStore } from 'pinia'

export const useActivityStore = defineStore('activity', {
    state: () => ({
        activityPlanneds: [] as ActivityPlanned[],
        activityActuals: [] as ActivityActual[],
        activityActualType: [{ code: 'U', name: 'Unplanned' }, { code: 'P', name: 'Planned' }] as ActivityActualType[],
        approvalStatus: [{ code: 'A', name: 'Approved' }, { code: 'R', name: 'Rejected' },{code: 'P', name: 'Pending'}] as ApprovalStatus[],
        
    }),
    actions: {
        addActivityPlanned(activityPlanned: Omit<ActivityPlanned, 'id'>) : ActivityPlanned {
            this.activityPlanneds.push({ ...activityPlanned, id: this.activityPlanneds.length + 1 });
            return this.activityPlanneds[this.activityPlanneds.length-1];
        },

        addActivityActual(activityActual:Omit<ActivityActual, 'id'>) : ActivityActual {
            this.activityActuals.push({...activityActual, id: this.activityActuals.length + 1});
            return this.activityActuals[this.activityActuals.length-1]
        
        },

        removeActivityPlanned(id: number) {
        this.activityPlanneds = this.activityPlanneds.filter(ap => ap.id !== id);
        },
        
        changeActivityPlannedStatus(approvalStatus: ApprovalStatus, id:number){
            const isActivityPlannedExist = this.activityPlanneds.find(ap => ap.id === id);

            if(isActivityPlannedExist){
                isActivityPlannedExist.approvalStatus = approvalStatus;
            }

        },

        resetStore(){
            this.$reset();
        }
    },
    persist: true,
});
