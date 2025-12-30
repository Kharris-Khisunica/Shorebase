<template>
  <VueSelect
    v-model="model"
    :options="cumulativeData"
    :filterable="false"
    @open="onOpen"
    @close="onClose"
    @search="onSearch"
    @update:modelValue="onSelect"
  >
    <template #list-footer>
      <li v-show="hasNextPage" ref="load" class="loader ms-5">
        <em>Loading more options...</em>
      </li>
    </template>
  </VueSelect>
</template>

<script setup lang="ts">
import VueSelect from "vue-select";
import type { ESOption } from "~/types/EnterpriseSelect";
import type { ETResult } from "~/types/EnterpriseTable";

const model = defineModel();
const emit = defineEmits(["update:full-object"]);
// const model = defineModel<ESOption>();

const props = withDefaults(
  defineProps<{
    url: string;
    authorized?: boolean;
    valueField?: string;
    labelField?: string;
    customFilter?: string;
  }>(),
  { authorized: true, valueField: "id", labelField: "name" }
);

const observer: Ref<IntersectionObserver | null> = ref(null);
const pagination = ref({
  pageIndex: 0,
  pageSize: 25,
  search: "",
});
const load = useTemplateRef("load");

onMounted(() => {
  observer.value = new IntersectionObserver((entries) => infiniteScroll(entries));
});

function onSelect(selectedOption: any) {
  if (selectedOption && typeof selectedOption === "object") {
    emit("update:full-object", selectedOption);
  }
}

const query = computed(() => ({
  pageIndex: pagination.value.pageIndex,
  pageSize: pagination.value.pageSize,
  search: pagination.value.search,
  valueField: props.valueField,
  labelField: props.labelField,
  customFilter: props.customFilter,
}));
const { data, status, refresh } = await useAuthorizedFetch<ETResult<ESOption>>(
  props.url,
  {
    query: query,
    lazy: true,
    key: (Math.random() * 1000000).toString(),
    authorized: props.authorized,
  }
);

const cumulativeData: Ref<ESOption[]> = ref([]);
watch(
  () => data.value,
  async () => {
    if (data.value) {
      cumulativeData.value.push(...data.value.data);
      await nextTick();

      // observer.value?.disconnect();
      if (load.value) {
        observer.value?.observe(load.value);
      }
    }
  },
  { immediate: true }
);

const hasNextPage = computed(
  () => data.value == null || data.value.data.length == data.value.pageSize
);

async function infiniteScroll(entries: IntersectionObserverEntry[]) {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      const ul = (entry.target as any).offsetParent;
      const scrollTop = ((entry.target as any).offsetParent as any).scrollTop;

      pagination.value = {
        ...pagination.value,
        pageIndex: pagination.value.pageIndex + 1,
      };

      await nextTick();
      ul.scrollTop = scrollTop;

      observer.value?.disconnect();
    }
  }
}

async function onOpen() {
  if (hasNextPage.value) {
    await nextTick();
    observer.value?.disconnect();
    if (load.value) {
      observer.value?.observe(load.value);
    }
  }
}

function onClose() {
  observer.value?.disconnect();
}

watch(
  () => query.value.customFilter,
  () => {
    cumulativeData.value = [];
  }
);

async function onSearch(search: string) {
  cumulativeData.value = [];
  pagination.value = { ...pagination.value, pageIndex: 0, search: search };
}
</script>
