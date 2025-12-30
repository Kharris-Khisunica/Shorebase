<template>
  <UForm
    ref="form_ref"
    :schema="schema"
    :state="state"
    class="w-fit space-y-4"
    @submit="onSubmit"
  >
    <UFormField label="Jabatan" name="name" required>
      <UInput v-model="state.name" type="text" class="w-full" maxlength="255" />
    </UFormField>
  </UForm>
</template>

<script setup lang="ts">
import { UFormField } from "#components";
import type { FormSubmitEvent } from "@nuxt/ui";
import { DateTime } from "luxon";
import z from "zod";

const config = useRuntimeConfig();
const emit = defineEmits<{
  (e: "submitted", jobTitle: JobTitle): void;
  (e: "error", message: string): void;
}>();

const props = defineProps<{
  jobTitle?: JobTitle;
}>();

const formRef = useTemplateRef("form_ref");
const schema = z.object({
  id: z.number().optional(),
  code: z.string(),
  name: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
});
type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  name: props.jobTitle?.name,
  code: props.jobTitle?.code,
  startDate: props.jobTitle?.startDate || DateTime.now().toISODate().toString(),
});

function submit() {
  formRef.value.submit();
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(props.jobTitle);
  let url = `${config.public.BACKEND_HOST}/position/job-title`;
  if (props.jobTitle) {
    url = `${config.public.BACKEND_HOST}/position/job-title/${props.jobTitle.id}`;
  }
  const { data, status, error, refresh, clear } = await useAuthorizedFetch(url, {
    method: "post",
    body: {
      ...state,
    },
  });
  if (error.value) {
    console.log(error.value);
    emit("error", error.value?.message || "");
    return;
  }

  emit("submitted", data.value as JobTitle);
}

defineExpose({ submit });
</script>
