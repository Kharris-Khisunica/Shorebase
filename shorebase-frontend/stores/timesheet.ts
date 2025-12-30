import { defineStore} from 'pinia';
import TimesheetSummary from '~/components/timesheets/TimesheetSummary.vue';

export const useTimesheetStore = defineStore('timesheet',{
    state: () => ({
        timesheets: [] as Timesheet[],
        approvalStatus: [{ code: 'A', name: 'Approved' }, { code: 'R', name: 'Rejected' },{code: 'P', name: 'Pending'}] as ApprovalStatus[],
        timesheetActivitys: [] as TimesheetActivity[],
        timesheetSummarys: [] as TimesheetSummary[],
    }), 
    actions: {
        addTimeSheet(timesheet: Omit<Timesheet, 'id'>) : Timesheet{
            this.timesheets.push({...timesheet, id: this.timesheets.length+1});
            return this.timesheets[this.timesheets.length-1];
            
        },
        addTimeSheetActivity(timesheetActivity: Omit<TimesheetActivity, 'id'>){
            this.timesheetActivitys.push({...timesheetActivity, id: this.timesheetActivitys.length+1});
            return this.timesheetActivitys[this.timesheetActivitys.length-1];
            
        },
        addTimesheetSummary(timesheetSummary: Omit<TimesheetSummary, 'id'>): TimesheetSummary{
            this.timesheetSummarys.push({...timesheetSummary, id: this.timesheetSummarys.length+1});
            return this.timesheetSummarys[this.timesheetSummarys.length-1];
            
        },
        // Approve/Reject 1 timesheet berdasarkan id
        changeTimesheetApproval(approvalStatus: ApprovalStatus, id:number){
            const isTimesheetExist = this.timesheets.find(Timesheet => Timesheet.id === id);

            if(isTimesheetExist){
                isTimesheetExist.timesheet_status = approvalStatus;
            }

        },
        // Approve/Reject semua timesheet (Need to be noted)
        changeTimesheetApprovalBatch(approvalStatus: ApprovalStatus, ids: number[]) {
        // Find each timesheet by its ID in the main state and update it
        ids.forEach(id => {
            const timesheet = this.timesheets.find(ts => ts.id === id);
            if (timesheet) {
            timesheet.timesheet_status = approvalStatus;
            }
        });            console.log(`All timesheets ${approvalStatus.name}`);
        },
        
        // Approve 
        changeTimesheetSummaryApproval(approvalStatus: ApprovalStatus, id: number){
            const isSummaryExist = this.timesheetSummarys.find(ts => ts.id === id)

            if(isSummaryExist){
                isSummaryExist.summaryStatus = approvalStatus;
            }
        },

       

        updateServiceRemark(summaryId: number, serviceId: number, newRemark: string) {
    const summaryToUpdate = this.timesheetSummarys.find(s => s.id === summaryId);
    if (summaryToUpdate) {
      summaryToUpdate.remarksByService[serviceId] = newRemark;
    }
  },
    },
    persist: true
});