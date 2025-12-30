import { DateTime } from 'luxon';
import * as XLSX from 'xlsx';


export async function exportSTToExcel(summaryTimesheetId: number) {
    const config = useRuntimeConfig();

    const {
    data: summaryTimesheetData,
    refresh: refreshSummaryTimesheets,
    } = await useAuthorizedFetch<SummaryTimesheet>(
    `${config.public.BACKEND_HOST}/summary-timesheet/${summaryTimesheetId}`
    );

    const dataForSheet:any[][] = [];
    // Header
    dataForSheet.push(["PT. MASHUD  BERSAUDARA  INTERNASIONAL"]);
    dataForSheet.push(["ALTIRA BUSINESS TOWER FLOOR 19th UNIT A,B,D"]);
    dataForSheet.push([
        " Jl. Yos Sudarso Kav 85, Sunter, Kec. Tanjung Priok, Jakarta Utara 14350",
    ]);
    dataForSheet.push(["Telp. (021) 21882300, (021) 21882301, Fax: (021) 21882302"]);
    dataForSheet.push([
        "Site : Jl. Setia Bakti  RT.008 Pendingin, Sanga-Sanga, Kutai Kertanegara",
    ]);
    dataForSheet.push([]);
    dataForSheet.push([]);
    dataForSheet.push([]);
    dataForSheet.push([]);
    dataForSheet.push(["SHOREBASE"]);

    dataForSheet.push(["Nomor Timesheet Summary", ": ", summaryTimesheetData.value?.code]);
    dataForSheet.push(["Perusahaan", ": ", summaryTimesheetData.value?.company?.name]);
    dataForSheet.push([
        "Periode", ": ",
        summaryTimesheetData.value?.periodStartDate,
        " - ",
        summaryTimesheetData.value?.periodEndDate,
    ]);
    dataForSheet.push([]);

    const stComponents = summaryTimesheetData.value?.stComponents;
    const startDateStr = summaryTimesheetData.value?.periodStartDate;
    const endDateStr = summaryTimesheetData.value?.periodEndDate;

    const tableData = computed(() => {
        console.log("stComponents");
        console.log(stComponents);
        if (!stComponents) return [];

        return stComponents.map((component) => {
            const dailyAmounts = component.sttimesheets.reduce((acc, sttimesheet) => {
            const dateKey = sttimesheet.timesheet.issueDate;
            console.log(typeof dateKey);
            acc[dateKey!] = sttimesheet.timesheet.totalAmount;
            return acc;
            }, {} as { [date: string]: number });

            const aggAmount = component.sttimesheets.reduce(
            (sum, st) => sum + st.timesheet.totalAmount,
            0
            );

            return {
            ...component,
            dailyAmounts,
            aggAmount,
            };
        });
    });

      // Table
  // Header Table
  const tableHeader = ["No.", "Service", "Total", "Unit"];
  if (startDateStr && endDateStr) {
    let currentDate = DateTime.fromISO(startDateStr);
    const endDate = DateTime.fromISO(endDateStr);

    while (currentDate <= endDate) {
      tableHeader.push(currentDate.toFormat("dd"));
      currentDate = currentDate.plus({ days: 1 });
    }
  }
  tableHeader.push("Remarks");

  dataForSheet.push(tableHeader);

  // Isi Table
  let id = 1;
  tableData.value.forEach((tableRow) => {
    const rowData = [];
    rowData.push(id);
    rowData.push(tableRow.contractService?.shorebaseService?.name);
    rowData.push(tableRow.aggAmount);
    rowData.push(tableRow.contractService?.uom?.code);
    // Add daily total Amount
    if (startDateStr && endDateStr) {
      let currentDate = DateTime.fromISO(startDateStr);
      const endDate = DateTime.fromISO(endDateStr);

      while (currentDate <= endDate) {
        const dateKey = currentDate.toISODate();
        rowData.push(tableRow.dailyAmounts?.[dateKey!] || 0);
        currentDate = currentDate.plus({ days: 1 });
      }
    }
    rowData.push(tableRow.remark);
    dataForSheet.push(rowData);
    id = id + 1;
  });

  // Add and Export
  const worksheet = XLSX.utils.aoa_to_sheet(dataForSheet);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Timesheet Summary");

  const fileName = `TimesheetSummary_${summaryTimesheetData.value?.company.name}_${summaryTimesheetData.value?.code}.xlsx`;
  XLSX.writeFile(workbook, fileName);

}

export async function exportTimesheetToExcel(timesheet: Timesheet){
    
    console.log("Timesheet yang mau di export")
    console.log(timesheet);

    const dataForSheet:any[][] = [];
    // Header
    dataForSheet.push(["PT. MASHUD  BERSAUDARA  INTERNASIONAL"]);
    dataForSheet.push(["ALTIRA BUSINESS TOWER FLOOR 19th UNIT A,B,D"]);
    dataForSheet.push([
        " Jl. Yos Sudarso Kav 85, Sunter, Kec. Tanjung Priok, Jakarta Utara 14350",
    ]);
    dataForSheet.push(["Telp. (021) 21882300, (021) 21882301, Fax: (021) 21882302"]);
    dataForSheet.push([
        "Site : Jl. Setia Bakti  RT.008 Pendingin, Sanga-Sanga, Kutai Kertanegara",
    ]);
    dataForSheet.push(["-----------------------------"]);
    dataForSheet.push([]);

    // Keterangan tiap service 
    const shorebaseServiceName = timesheet.shorebaseService?.name;

    dataForSheet.push([`TIMESHEET`, "",  `${shorebaseServiceName}`]);
    dataForSheet.push([`--------------------------`])
    dataForSheet.push([`Nomor: ${timesheet.code}`])

    dataForSheet.push([`Customer      `, ": ",`${timesheet.company?.name}`])
    // dataForSheet.push([`Kontrak       `, ": ",`${timesheet.contractService?.contract.name}`, "", ""]);
    dataForSheet.push([`Kontrak Ref No`, ": ",`${timesheet.contractService?.contract.contractNumber  ? timesheet.contractService?.contract.contractNumber: ""}`, "", ""]);
    dataForSheet.push([`Third Party   `, ": ",`${timesheet.subContractor?.company.name}`, "", ""]);
    dataForSheet.push([`Description   `, ": ",`${timesheet.description}`])

    dataForSheet.push([])

    // Tabel

    // Header
    const tableHeader = ["No.", "Date", "Product", "Start", "Finish", "Quantity", "Unit", "Remark"];

    dataForSheet.push(tableHeader)
    let no = 1;
    timesheet.timesheetActivities.forEach((ta) => {
      const rowData = [];
      const activity = ta.activity;
      rowData.push(no);
      const startDate = DateTime.fromISO(activity.actualStartedAt)
      const endDate = DateTime.fromISO(activity.actualEndedAt)

      rowData.push(startDate.toISODate())
      rowData.push(activity.shorebaseServiceProduct?.name)
      rowData.push(startDate.toFormat('HH:mm'))
      rowData.push(endDate.toFormat('HH:mm'))
      rowData.push(activity.actualProductQty)
      rowData.push(activity.uom?.name)
      rowData.push(ta.remarks)

      dataForSheet.push(rowData);
      no = no + 1;
    })

    const footerData = [
        [],
        ["Total", "","" , "", timesheet?.totalAmount],
        [], 
        ["Disiapkan Oleh,", "", "Disetujui Oleh,"],
        [],
        [],
        [],
        ["(................)", "", "(................)"]
    ];

    dataForSheet.push(footerData)

    const worksheet = XLSX.utils.aoa_to_sheet(dataForSheet);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Timesheet");

  const fileName = `Timesheet_${timesheet.company?.name}_${timesheet.code}.xlsx`;
  XLSX.writeFile(workbook, fileName);

    
}