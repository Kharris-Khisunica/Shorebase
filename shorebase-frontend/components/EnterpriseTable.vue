<template>
  <div class="w-full space-y-4 pb-4">
    <!-- Top Action -->
    <div class="w-full flex justify-between">
      <div>
        <UButton
          color="primary"
          v-if="props.create"
          @click="
            editStateRaw = Object.fromEntries(
              columns.map((c) => [
                c.form_name || c.id || '',
                { value: undefined, label: '' },
              ])
            );
            isEditing = false;
            editModalOpen = true;
            readOnlyState = {};
          "
          >Tambah</UButton
        >
      </div>

      <!-- Reserved for download record -->
      <div></div>
    </div>

    <!-- Main Table -->
    <UTable
      ref="table"
      v-model:pagination="pagination"
      v-model:sorting="sorting"
      manualPagination="true"
      manualSorting="true"
      manualFiltering="true"
      :data="data ? data.data : undefined"
      :columns="columns"
      v-model:column-visibility="columnVisibility"
      :loading="status === 'pending'"
      class="flex-1 overflow-visible"
      :sticky="true"
      :ui="{
        td: 'p-2 border rounded-3xl border-default', // Smaller padding for data cells
        th: 'p-2 border rounded-3xl border-default', // Smaller padding for header cells
        base: 'overflow-visible',
      }"
    >
      <template
        v-for="(c, idx) in columns.filter((c) => c.id != 'action')"
        :key="c.id"
        #[`${c.id}-header`]="{ column }"
      >
        <div class="flex flex-col">
          <div>
            <UButton
              color="neutral"
              variant="ghost"
              :label="c.header?.toString()"
              :icon="
                column.getIsSorted()
                  ? column.getIsSorted() === 'asc'
                    ? 'i-lucide-arrow-up-narrow-wide'
                    : 'i-lucide-arrow-down-wide-narrow'
                  : 'i-lucide-arrow-up-down'
              "
              class="-mx-2.5"
              @click="() => column.toggleSorting(column.getIsSorted() === 'asc')"
            />
          </div>
          <div>
            <UInput
              v-if="!c.select_option_url"
              :model-value="
                columnFilters[idx]
                  ? columnFilters[idx].label || columnFilters[idx].value
                  : null
              "
              @update:model-value="
                columnFilters = [
                  ...columnFilters.slice(0, idx),
                  { id: column.id, value: $event, label: $event },
                  ...columnFilters.slice(idx + 1),
                ]
              "
              class="max-w-sm"
              placeholder="Filter..."
            />

            <EnterpriseSelect
              v-if="c.select_option_url"
              :model-value="
                columnFilters[idx]
                  ? columnFilters[idx].label || columnFilters[idx].value
                  : null
              "
              @update:model-value="
                columnFilters = [
                  ...columnFilters.slice(0, idx),
                  { id: column.id, value: $event?.value, label: $event?.label },
                  ...columnFilters.slice(idx + 1),
                ]
              "
              :url="c.select_option_url"
              :authorized="props.authorized"
            />
          </div>
        </div>
      </template>

      <template
        v-for="(c, idx) in columns.filter((c) => c.id != 'action')"
        :key="c.id"
        #[`${c.id}-cell`]="{ row, cell }"
      >
        <span
          v-if="c.onClick"
          @click="c.onClick(row.original)"
          class="underline cursor-pointer text-blue-600 hover:text-blue-800"
          >{{ cell.getValue() }}</span
        >
        <span v-else>{{ cell.getValue() }}</span>
      </template>

      <template #action-cell="{ row }">
        <UDropdownMenu :items="getDropdownActions(row.original)">
          <UButton
            icon="i-lucide-ellipsis-vertical"
            color="neutral"
            variant="ghost"
            aria-label="Actions"
          />
        </UDropdownMenu>
      </template>
    </UTable>

    <!-- Showing entries count and Pagination -->
    <div class="flex justify-center pt-1">
      <em v-if="data">
        Menampilkan {{ pagination.pageSize * pagination.pageIndex + 1 }} -
        {{ Math.min(data.total, pagination.pageSize * (pagination.pageIndex + 1)) }} dari
        {{ data?.total || 0 }} data
      </em>
    </div>

    <div class="flex justify-center">
      <UPagination
        :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
        :items-per-page="table?.tableApi?.getState().pagination.pageSize"
        :total="data?.total"
        @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
      />
    </div>

    <!-- Create or Edit Modal -->
    <UModal :title="!isEditing ? 'Tambah' : 'Edit'" v-model:open="editModalOpen">
      <template #body>
        <UForm
          :schema="editSchema"
          :state="editState"
          class="w-full space-y-4"
          @submit="onEditSubmit"
          @error="(e) => console.log(e)"
          ref="editForm"
        >
          <div v-for="c in visibleEditableColumns" :key="c.form_name || c.id">
            <UFormField
              :label="c.header?.toString()"
              :name="c.form_name || c.id"
              :required="isRequired(c.form_name || c.id || '', editSchema)"
              class="w-full"
            >
              <EnterpriseSelect
                v-if="c.type == 'select' && c.select_option_url"
                :url="c.select_option_url"
                :model-value="editStateRaw[c.form_name || c.id || '']"
                @update:model-value="editStateRaw[c.form_name || c.id || ''] = $event"
                class="w-full"
                :authorized="props.authorized"
                :disabled="readOnlyState[c.form_name || c.id || '']"
                :custom-filter="
                  c.custom_filter ? c.custom_filter(editStateRaw) : undefined
                "
              />

              <EnterpriseAutofill
                v-if="c.type == 'autofill' && c.autofill_url"
                :url="c.autofill_url"
                :value-field="c.autofill_value_field"
                :label-field="c.autofill_label_field"
                :custom-filter="
                  c.custom_filter ? c.custom_filter(editStateRaw) : undefined
                "
                :model-value="editStateRaw[c.form_name || c.id || '']"
                @update:model-value="onAutofillSelect($event, c)"
                class="w-full"
                :authorized="props.authorized"
                :disabled="readOnlyState[c.form_name || c.id || '']"
              />

              <UInput
                v-if="c.type == 'text'"
                :model-value="editStateRaw[c.form_name || c.id || ''].value"
                @update:model-value="
                  editStateRaw[c.form_name || c.id || ''].value = $event
                "
                type="text"
                class="w-full"
                :disabled="readOnlyState[c.form_name || c.id || '']"
              />

              <UInput
                v-if="c.type == 'date'"
                :model-value="editStateRaw[c.form_name || c.id || ''].value"
                @update:model-value="
                  editStateRaw[c.form_name || c.id || ''].value = $event
                "
                type="date"
                class="w-full"
                :disabled="readOnlyState[c.form_name || c.id || '']"
              />

              <UInput
                v-if="c.type == 'date_time'"
                :model-value="editStateRaw[c.form_name || c.id || ''].value"
                @update:model-value="
                  editStateRaw[c.form_name || c.id || ''].value = $event
                "
                type="datetime-local"
                class="w-full"
                :disabled="readOnlyState[c.form_name || c.id || '']"
              />

              <UInputNumber
                v-if="c.type == 'number'"
                :model-value="editStateRaw[c.form_name || c.id || ''].value"
                @update:model-value="
                  editStateRaw[c.form_name || c.id || ''].value = $event
                "
                class="w-full"
                :disabled="readOnlyState[c.form_name || c.id || '']"
              />

              <UCheckbox
                v-if="c.type == 'boolean'"
                :model-value="editStateRaw[c.form_name || c.id || ''].value"
                @update:model-value="
                  editStateRaw[c.form_name || c.id || ''].value = $event
                "
                type="boolean"
                class="w-full"
                :disabled="readOnlyState[c.form_name || c.id || '']"
              />
            </UFormField>
          </div>
          <div class="p-5"></div>
        </UForm>
      </template>

      <template #footer="{ close }">
        <div class="flex flex-1 justify-end gap-2">
          <UButton color="neutral" variant="outline" @click="editModalOpen = false"
            >Batal</UButton
          >
          <UButton color="neutral" type="submit" loading-auto @click="editForm?.submit()"
            >Simpan</UButton
          >
        </div>
      </template>
    </UModal>

    <!-- Delete Confirmation Modal -->
    <UModal
      v-model:open="deleteConfirmModalOpen"
      v-if="selectedDeleteItem"
      title="Hapus data ini?"
    >
      <template #footer>
        <UButton color="neutral" @click="deleteConfirmModalOpen = false">Batal</UButton>
        <UButton color="error" @click="onDeleteSubmit(selectedDeleteItem!)"
          >Hapus</UButton
        >
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts" generic="T">
import type { DropdownMenuItem, FormSubmitEvent } from '@nuxt/ui';
import { refDebounced } from '@vueuse/core';
import z, { ZodDefault, ZodEffects, ZodNullable, ZodObject, ZodOptional, ZodString, ZodType, type ZodTypeAny } from 'zod';
import type { ETColumn, ETCustomAction, ETResult } from '~/types/EnterpriseTable';
import { ref, computed, type Ref, type ComputedRef } from 'vue';
import { DateTime } from 'luxon';

const toast = useToast();
const table = useTemplateRef('table');
const editForm = useTemplateRef('editForm');

const isEditing = ref(false); //False if create, True if edit

const readOnlyState = ref<{[key : string] : boolean}>({}); // Form name apa saja yang read only

const props = withDefaults(defineProps<{
    url: string,
    columns: ETColumn<T>[],
    create: boolean,
    pageIndex?: number,
    pageSize?: number,
    customActions?: ETCustomAction<T>[],
    authorized?: boolean,
    fieldVisibilityLogic?: (column: ETColumn<T>, formState: Ref<{ [x: string]: { value: any, label: string } }>) => boolean,
    dynamicSchemaLogic?: (columns: ETColumn<T>[], formState: Ref<{ [x: string]: { value: any, label: string } }>) => ZodObject<any>,

}>(), { pageIndex: 0, pageSize: 100, authorized: true })

// Columns
const columns = [...props.columns];
if (columns.find(c => c.edit == 'enabled')) {
    columns.push({ id: 'action', type: 'void' });
}
const columnVisibility = computed(() => Object.fromEntries(columns.map(c => [c.id, !c.hidden])));

// Edit and Create Modal
const editModalOpen = ref(false);
const deleteConfirmModalOpen = ref(false);
const selectedDeleteItem: Ref<T | null> = ref(null);
const editSchema = computed(() => {
    const editableColumns = visibleEditableColumns.value;
    if (props.dynamicSchemaLogic) {
        return props.dynamicSchemaLogic(editableColumns, editStateRaw);
    }

    return z.object(
        Object.fromEntries(
            editableColumns
                .filter(c => c.validationType)
                .map(c => {
                    let validator = c.validationType!;
                    if (c.optional) {
                        validator = validator.optional().nullable() as any;
                    }
                    return [c.form_name || c.id || '', validator];
                })
        )
    );
});




type EditSchema = z.output<typeof editSchema.value>;
const editStateRaw = ref<{ [x: string]: { value: any, label: string } }>({});
const editState = computed(() => Object.fromEntries(Object.keys(editStateRaw.value).map(k => [k, editStateRaw.value[k].value])));
// function filterEditableColumns(columns: ETColumn<T>[]) {
//     return columns.filter(c => c.edit == 'enabled' && c.validationType );
// }

const visibleEditableColumns = computed(() => {
    return columns
        .filter(c => c.edit == 'enabled' && c.validationType)
        .filter(c => isFieldVisibleInForm(c));
});

// function isCreateMode() {
//     const pkCol = columns.find(c => c.primaryKey);

//     if (!pkCol) throw new Error('PK must be defined');

//     return !editState.value[pkCol.form_name || pkCol.id || ''];
// }

const getProperty = (obj: any, path: string): any => {
    if (obj === null || obj === undefined) return undefined;
    return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
}

function onAutofillSelect(selectedObject: any | null, column: ETColumn<T>) {
    const mainFormName = column.form_name || column.id || '';

    if (selectedObject) {

         editStateRaw.value[mainFormName] = selectedObject;
    } else {
        editStateRaw.value[mainFormName] = { value: undefined, label: '' };
    }

    if (column.autofill_target_fields) {
        for (const [targetField, sourceConfig] of Object.entries(column.autofill_target_fields)) {
            if (editStateRaw.value[targetField] === undefined) {
                 editStateRaw.value[targetField] = { value: undefined, label: '' };
            }

            if (selectedObject) {
                if (typeof sourceConfig === 'string') {
                    editStateRaw.value[targetField].value = getProperty(selectedObject, sourceConfig);
                } else {
                    editStateRaw.value[targetField].value = getProperty(selectedObject, sourceConfig.value);
                    editStateRaw.value[targetField].label = getProperty(selectedObject, sourceConfig.label);
                    sourceConfig.readOnly === true ? readOnlyState.value[targetField] = true : delete readOnlyState.value[targetField];


                  }


                if (typeof sourceConfig === 'object'){

                }
            } else {
                editStateRaw.value[targetField].value = undefined;
                editStateRaw.value[targetField].label = '';
            }
        }
    }
}




async function onEditSubmit(event: FormSubmitEvent<EditSchema>) {
    let postUrl = props.url;
    if (isEditing.value) {
        const pkCol = columns.find(c => c.primaryKey);
        if (!pkCol) throw new Error('PK must be defined');

        const pkValue = editState.value[pkCol.form_name || pkCol.id || ''];
        if (!pkValue) throw new Error('PK value not defined');

        postUrl = `${props.url}/${pkValue}`;
    }

    const { error } = await useAuthorizedFetch(postUrl, {
        method: 'post',
        body: {
            ...editState.value
        },
        key: (Math.random() * 1000000).toString(),
        authorized: props.authorized
    });
    if (error.value) {
        toast.add({
            title: "Gagal menyimpan, coba lagi",
            description: error.value.message || '',
            color: "warning",
        });
        return;
    }

    toast.add({
        title: "Berhasil menyimpan",
        description: ``,
        color: "success",
    });
    await refresh();
    editModalOpen.value = false;
}

async function onDeleteSubmit(item: T) {
  console.log("Item yg dihapus: ")
  console.log(item);
    const pkCol = columns.find(c => c.primaryKey);
    if (!pkCol) throw new Error('PK must be defined');

    let itemAny = item as any;
    const pkValue = itemAny[pkCol.id || ''];
    if (!pkValue) throw new Error('PK value not defined');

    const { error } = await useAuthorizedFetch(`${props.url}/${pkValue}`, {
        method: 'delete',
        authorized: props.authorized,
        key: (Math.random() * 1000000).toString()
    });
    if (error.value) {
        toast.add({
            title: "Gagal menghapus, coba lagi",
            description: error.value.message || '',
            color: "warning",
        });
        return;
    }

    toast.add({
        title: "Berhasil menghapus",
        description: ``,
        color: "success",
    });
    selectedDeleteItem.value = null;
    await refresh();
    editModalOpen.value = false;
}

function isRequired(name: string, schema: ZodEffects<any> | ZodObject<any>) {
  if (schema instanceof ZodEffects) {
    return isRequired(name, schema.sourceType());
  }

  const shape = schema._def.shape();
  const element = shape[name];
  return !element.isOptional();
}

function unwrapSchema(schema: ZodTypeAny): ZodTypeAny {
    while (
        schema instanceof ZodOptional ||
        schema instanceof ZodNullable ||
        schema instanceof ZodDefault ||
        schema instanceof ZodEffects
    ) {
        schema = (schema as any)._def.innerType || (schema as any)._def.schema
    }
    return schema
}

// Pagination, Sorting, and Filters
const pagination = ref({
    pageIndex: props.pageIndex,
    pageSize: props.pageSize
});

const sorting = ref(columns[0].id ? [
    { id: columns[0].id, desc: true }
] : []);
const columnFilters : Ref<{ id: string | undefined | null, value: string | undefined | null, label: string | undefined | null }[]> = ref(columns.map(c => ({ id: c.id, value: undefined, label: undefined })));
const aliasReferencedColumnFiltersRef: Ref<{ id: string | undefined | null, value: string | undefined | null, label: string | undefined | null }[]> = computed(() => columnFilters.value.map(cf => {
    const aliasCol = columns.find(c => c.alias_for_id == cf.id);
    const aliasCf = columnFilters.value.find(cf2 => aliasCol && aliasCol.id == cf2.id);
    if (aliasCf) {
        return { id: cf.id, value: aliasCf.value, label: aliasCf.label };
    } else {
        return cf;
    }
}))
const debouncedColumnFilters = refDebounced(aliasReferencedColumnFiltersRef, 300);

// Query and Fetch
const query = computed(() => ({
    pageIndex: pagination.value.pageIndex,
    pageSize: pagination.value.pageSize,
    sorting: sorting.value,
    columnFilters: debouncedColumnFilters.value
        .filter(cf => {
            const col = columns.find(c => c.id == cf.id);
            if (!col) return false;

            return col.alias_for_id == null && cf.value != '' && cf.value !== undefined;
        })
        .map(cf => ({ id: cf.id, value: cf.value }))
}));

const { data, status, refresh } = await useAuthorizedFetch<ETResult<T>>(props.url, {
    query: query,
    watch: [query],
    lazy: true,
    key: (Math.random() * 1000000).toString(),
    authorized: props.authorized
});

// Action Dropdowns
function getDropdownActions(item: T): DropdownMenuItem[][] {
    const dropdowns : DropdownMenuItem[][] = [];
    if (props.customActions) {
        dropdowns.push([]);
        dropdowns[0] = props.customActions.map(ca => ({
            label: ca.label,
            onSelect: () => {
                if (ca.onClick) {
                    ca.onClick(item);
                }
            }
        }))
    }

    dropdowns.push([
        {
            label: 'Edit',
            icon: 'i-lucide-edit',

            onSelect: (e) => {
                editStateRaw.value = {};
                readOnlyState.value = {};
                // const editableColumns = filterEditableColumns(columns);
                for (const ec of columns) {
                    if (ec.id) {
                        const aliasColumn = columns.find(c => c.alias_for_id == ec.id);

                        let value = ec.id.split('.').reduce((o: any, k) => (o ? o[k] : undefined), item);

                        const validationSchema = editSchema.value.shape[ec.form_name || ec.id || ''];

                        if (validationSchema && unwrapSchema(validationSchema) instanceof ZodString) {
                            value = value != null ? `${value}` : value;
                        }
                        if (value && ec.type === 'date_time') {
                            value = DateTime.fromISO(value).toFormat("yyyy-MM-dd'T'HH:mm");
                        }


                        let label = value;
                        if (aliasColumn && aliasColumn.id) {
                            label = aliasColumn.id.split('.').reduce((o: any, k) => (o ? o[k] : undefined), item);
                        }

                        editStateRaw.value[ec.form_name || ec.id || ''] = { value, label };
                    }
                }
                isEditing.value = true,
                editModalOpen.value = true;
            }
        }
    ]);
    dropdowns.push([
        {
            label: 'Delete',
            icon: 'i-lucide-trash',
            color: 'error',
            onSelect: (e) => {
                selectedDeleteItem.value = item;
                deleteConfirmModalOpen.value = true;
            }
        }
    ])

    return dropdowns;
}

// Dynamic Filter
function isFieldVisibleInForm(column: ETColumn<T>): boolean {
    if (props.fieldVisibilityLogic) {
        return props.fieldVisibilityLogic(column, editStateRaw);
    }
    return true;
}
</script>
