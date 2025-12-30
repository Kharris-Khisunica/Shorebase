<template>
  <div class="mb-4">
    <UBreadcrumb :items="breadcrumbItems" />

    <h1 class="mt-2 font-bold text-xl sm:text-3xl">Approval Flow {{ company?.name }}</h1>
  </div>

  <div>
    <UButton
      @click="workflowFormOpen = true; workflowEditMode = false; Object.keys(workflowFormState).forEach((k: string) => (workflowFormState as any)[k] = undefined); Object.assign(workflowFormState, { companyId: parseInt(route.params.id as string) }); workflowFormState.stages = []"
    >
      Tambah
    </UButton>
  </div>

  <div class="mt-3">
    <div>
      <h3 class="font-bold">As Contractor</h3>
      <UTable
        :data="contractorWorkflows"
        :columns="workflowColumns"
        class="border border-gray-200 overflow-visible"
        :ui="{
          base: 'overflow-visible',
          td: 'border border-gray-200',
        }"
      >
        <template #flow-cell="{ row }">
          <div v-for="(s, idx) in row.original.approvalWorkstages">
            {{ idx + 1 }}.
            {{
              s.userPosition
                ? `${s.userPosition.user?.name || ""}, ${
                    s.jobPosition?.jobTitle?.name || ""
                  } at ${s.jobPosition?.company?.name || ""}`
                : `${s.jobPosition?.jobTitle?.name}, ${s.jobPosition?.company?.name}`
            }}
          </div>
        </template>

        <template #action-cell="{ row }">
          <UButton
            @click="
              workflowFormOpen = true;
              workflowEditMode = true;
              setEdit(row.original);
            "
          >
            Edit
          </UButton>
        </template>
      </UTable>
    </div>
    <div>
      <h3 class="font-bold">As Subcontractor</h3>
    </div>
    <div>
      <h3 class="font-bold">As Independent Customer</h3>
    </div>
  </div>

  <div>
    <!-- Create or Edit Modal -->
    <UModal
      :title="!workflowEditMode ? 'Tambah' : 'Edit'"
      v-model:open="workflowFormOpen"
      fullscreen
      class="m-8"
    >
      <template #body>
        <UForm
          :schema="workflowSchema"
          :state="workflowFormState"
          class="w-full space-y-4"
          ref="workflowFormRef"
          @submit="onSubmit"
          @error="onWorkflowFormValidationError"
          :validate="validate"
        >
          <h3>
            <strong>{{ company?.name }}</strong>
          </h3>

          <UFormField label="Sebagai" name="timesheetTypeCode" class="w-full" required>
            <USelect
              v-model="workflowFormState.timesheetTypeCode"
              :items="[
                { value: 'C', label: 'Contractor' },
                { value: 'S', label: 'Subcontractor' },
                { value: 'I', label: 'Independent' },
              ]"
              class="w-48"
            />
          </UFormField>

          <UFormField label="Document Type" name="typeCode" class="w-full" required>
            <USelect
              v-model="workflowFormState.typeCode"
              class="w-48"
              :items="[
                { value: 'T', label: 'Timesheet' },
                { value: 'ST', label: 'Summary Timesheet' },
                { value: 'PIN', label: 'Performa Invoice' },
                { value: 'IN', label: 'Invoice' },
              ]"
            />
          </UFormField>

          <UFormField
            v-if="['C', 'S'].includes(workflowFormState.timesheetTypeCode || '')"
            label="Contract"
            name="contractId"
            class="w-full"
            required
          >
            <EnterpriseSelect
              :authorized="true"
              @update:model-value="
                workflowFormState.contractId = parseInt($event?.value) || undefined;
                workflowFormState.contractSelectOption = $event;
              "
              :model-value="workflowFormState.contractSelectOption"
              :url="`${config.public.BACKEND_HOST}/contract-service/contract/select-options`"
              :custom-filter="
                workflowFormState.timesheetTypeCode == 'C'
                  ? JSON.stringify({ companyId: route.params.id })
                  : undefined
              "
            />
          </UFormField>

          <UFormField label="Approval Flow" class="w-full">
            <UTable
              :data="workflowFormState.stages"
              :columns="stageColumns"
              class="border border-gray-200 overflow-visible"
              :ui="{
                base: 'overflow-visible',
                tbody: 'my-table-tbody',
                td: 'border border-gray-200',
              }"
            >
              <template #level-cell="{ row }">
                <div class="flex flex-row items-center">
                  <span class="me-2">{{ row.index + 1 }}</span>
                  <div class="flex flex-col gap-1">
                    <UButton
                      :disabled="row.index == 0"
                      @click="move(row.index, row.index - 1)"
                      ><UIcon name="i-lucide-arrow-up"
                    /></UButton>
                    <UButton
                      :disabled="row.index == workflowFormState.stages!.length - 1"
                      @click="move(row.index, row.index + 1)"
                      ><UIcon name="i-lucide-arrow-down"
                    /></UButton>
                  </div>
                </div>
              </template>

              <template #jobPositionId-cell="{ row }">
                <UFormField :name="`stages.${row.index}.jobPositionId`">
                  <EnterpriseSelect
                    @update:model-value="
                      row.original.jobPositionId = parseInt($event?.value) || undefined;
                      row.original.jobPositionSelectOption = $event;
                    "
                    :model-value="row.original.jobPositionSelectOption"
                    :url="`${config.public.BACKEND_HOST}/general/job-position/select-options`"
                  />
                </UFormField>
              </template>

              <template #userPositionId-cell="{ row }">
                <UFormField :name="`stages.${row.index}.userPositionId`">
                  <EnterpriseSelect
                    @update:model-value="
                      row.original.userPositionId = parseInt($event?.value) || undefined;
                      row.original.userPositionSelectLabel = $event;
                    "
                    :model-value="row.original.userPositionSelectLabel"
                    :url="`${config.public.BACKEND_HOST}/position/user-position/select-options`"
                    :custom-filter="
                      JSON.stringify({
                        jobPositionId: row.original.jobPositionId || null,
                      })
                    "
                  />
                </UFormField>
              </template>

              <template #delete-cell="{ row }">
                <UButton
                  @click="workflowFormState.stages!.splice(row.index, 1)"
                  color="error"
                  >Delete</UButton
                >
              </template>
            </UTable>
            <UButton
              class="mt-2"
              @click="workflowFormState.stages?.push({} as WorkstageSchema)"
              >Tambah</UButton
            >
          </UFormField>
          <div class="p-5"></div>
        </UForm>
      </template>

      <template #footer="{ close }">
        <div class="flex flex-1 justify-end gap-2">
          <UButton color="neutral" variant="outline" @click="workflowFormOpen = false"
            >Batal</UButton
          >
          <UButton
            color="neutral"
            type="submit"
            loading-auto
            @click="workflowFormRef?.submit()"
            >Simpan</UButton
          >
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { FormError, FormErrorEvent, TableColumn } from "@nuxt/ui";
import { useSortable } from "@vueuse/integrations/useSortable.mjs";
import z from "zod";
const toast = useToast();

const config = useRuntimeConfig();

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const companyFetch = await useAuthorizedFetch<Company>(
  `${runtimeConfig.public.BACKEND_HOST}/general/company/${route.params.id}`
);
const company = computed(() => companyFetch.data?.value);

const workflowFormRef = useTemplateRef("workflowFormRef");
const workflowEditMode = ref(false);
const workflowFormOpen = ref(false);

const workstageSchema = z.object({
  jobPositionId: z.number(),
  jobPositionSelectOption: z
    .object({ value: z.string(), label: z.string() })
    .nullable()
    .optional(),
  userPositionId: z.number().optional(),
  userPositionSelectLabel: z
    .object({ value: z.string(), label: z.string() })
    .nullable()
    .optional(),
});
type WorkstageSchema = z.output<typeof workstageSchema>;

const workflowSchema = z.object({
  typeCode: z.string(),
  timesheetTypeCode: z.string(),
  contractId: z.number().optional(),
  contractSelectOption: z
    .object({ value: z.string(), label: z.string() })
    .nullable()
    .optional(),
  subcontractorId: z.number().optional(),
  companyId: z.number(),
  stages: z.array(workstageSchema),
});
type WorkflowSchema = z.output<typeof workflowSchema>;
const workflowFormState = reactive<Partial<WorkflowSchema & { id: number }>>({});

const workflowColumns: TableColumn<ApprovalWorkflow>[] = [
  { id: "id", accessorKey: "id", header: "ID" },
  { id: "type", accessorKey: "type.name", header: "Document Type" },
  { id: "flow", header: "Flow" },
  { id: "action" },
];
const stageColumns: TableColumn<Partial<WorkstageSchema>>[] = [
  { id: "level", header: "Urutan Approval" },
  { id: "jobPositionId", accessorKey: "jobPositionId", header: "Position" },
  {
    id: "userPositionId",
    accessorKey: "userPositionId",
    header: "Specific User (Optional)",
  },
  { id: "delete", header: "Delete" },
];
// watch(workflowFormOpen, () => {
//     nextTick(() => {
//         useSortable('.my-table-tbody', workflowFormState.stages || [], {
//             animation: 150
//         });
//     });
// })

function setEdit(workflow: ApprovalWorkflow) {
  workflowFormState.id = workflow.id;
  workflowFormState.stages = workflow.approvalWorkstages.map((s) => ({
    jobPositionId: s.jobPosition?.id || 0,
    jobPositionSelectOption: {
      value: s.jobPosition?.id.toString() || "",
      label: `${s.jobPosition?.jobTitle?.name}, ${s.jobPosition?.company?.name}`,
    },
    userPositionId: s.userPosition?.id,
    userPositionSelectLabel: s.userPosition
      ? {
          value: s.userPosition?.id.toString(),
          label: `${s.userPosition.user?.name || ""}, ${
            s.jobPosition?.jobTitle?.name || ""
          } at ${s.jobPosition?.company?.name || ""}`,
        }
      : null,
  }));
  workflowFormState.companyId = parseInt(route.params.id as string);
  workflowFormState.contractId = workflow.contract?.id;
  workflowFormState.contractSelectOption = workflow.contract
    ? {
        value: workflow.contract?.id.toString(),
        label: workflow.contract?.contractNumber,
      }
    : null;
  workflowFormState.subcontractorId = workflow.subContractor?.id;
  workflowFormState.timesheetTypeCode = workflow.timesheetType?.code;
  workflowFormState.typeCode = workflow.type?.code;
}

function move(oldIndex: number, newIndex: number) {
  const temp = workflowFormState.stages![newIndex];
  workflowFormState.stages![newIndex] = workflowFormState.stages![oldIndex];
  workflowFormState.stages![oldIndex] = temp;
}

async function onSubmit() {
  const {
    typeCode,
    timesheetTypeCode,
    companyId,
    contractId,
    subcontractorId,
    stages,
  } = workflowFormState;
  let endpoint = `${runtimeConfig.public.BACKEND_HOST}/position/approval/workflow`;
  if (workflowEditMode.value) {
    endpoint = `${runtimeConfig.public.BACKEND_HOST}/position/approval/workflow/${workflowFormState.id}/update`;
  }
  const { error } = await useAuthorizedFetch(endpoint, {
    method: "post",
    body: {
      typeCode,
      timesheetTypeCode,
      companyId: companyId || route.params.id,
      contractId,
      subcontractorId,
      stages:
        stages?.map((s) => ({
          jobPositionId: s.jobPositionId,
          userPositionId: s.userPositionId,
        })) || [],
    },
    key: (Math.random() * 1000000).toString(),
    authorized: true,
  });

  if (error.value) {
    toast.add({
      title: "Save Error",
      description: error.value.message,
      color: "error",
    });
  } else {
    workflowFormOpen.value = false;
    await workflowFetch.refresh();
  }
}

function onWorkflowFormValidationError(e: FormErrorEvent) {
  toast.add({
    title: "Validation Error",
    description: `${e.errors[0]?.name} ${e.errors[0]?.message}`,
    color: "error",
  });
}

const validate = (state: Partial<WorkflowSchema>): FormError[] => {
  const errors = [];
  if (["C", "S"].includes(state.timesheetTypeCode || "") && !state.contractId)
    errors.push({ name: "contractId", message: "Required" });
  return errors;
};

const workflowFetch = await useAuthorizedFetch<ApprovalWorkflow[]>(
  `${runtimeConfig.public.BACKEND_HOST}/position/approval/workflow/company/${route.params.id}`
);
workflowFetch.data.value?.forEach((w) =>
  w.approvalWorkstages.sort((a, b) => a.level - b.level)
);
watch(workflowFetch.data, () => {
  workflowFetch.data.value?.forEach((w) =>
    w.approvalWorkstages.sort((a, b) => a.level - b.level)
  );
});
const contractorWorkflows = computed(() =>
  (workflowFetch.data?.value || []).filter((w) => w.timesheetType?.code == "C")
);
const subcontractorWorkflows = computed(() =>
  (workflowFetch.data?.value || []).filter((w) => w.timesheetType?.code == "S")
);
const independentWorkflows = computed(() =>
  (workflowFetch.data?.value || []).filter((w) => w.timesheetType?.code == "I")
);

const breadcrumbItems = computed(() => [
  { label: "Home", to: "/dashboard" },
  { label: "Approval Flow", to: `/position/approval/workflow` },
  { label: company?.value?.name || "" },
]);
</script>
