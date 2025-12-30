<template>
  <div class="min-h-screen w-full flex-col">
    <div>
      <h1 class="font-bold text-2xl text-center">Shorebase System</h1>
    </div>

    <div class="flex flex-row justify-center mt-16 sm:mt-16">
      <UCard class="w-fit h-fit">
        <template #header>
          <h2>Login</h2>
        </template>

        <UForm
          @submit="login(form)"
          :state="form"
          :schema="schema"
          class="shadow-lg mx-12 p-8"
        >
          <UFormField label="Username" name="username">
            <UInput v-model="form.username" />
          </UFormField>

          <UFormField label="Password" name="password" class="mt-4">
            <UInput v-model="form.password" type="password"></UInput>
          </UFormField>

          <UButton type="submit" color="primary" class="mt-4" block>Sign In</UButton>
        </UForm>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UCard, UForm, UFormField, UInput } from "#components";
import z from "zod";

definePageMeta({
  layout: "not-logged-in",
});

const { $keycloak, $keycloakReady } = useKeycloak();
await $keycloakReady;

if (!$keycloak.authenticated) {
  $keycloak.login();
} else {
  navigateTo('/dashboard');
}

const toast = useToast();
const userStore = useUserStore();
if (userStore.isLoggedIn()) {
  navigateTo("/");
}

const form = ref({
  username: "",
  password: "",
});

const schema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

const dummyUsers: User[] = [
  {
    id: 1,
    name: "Head BU",
    username: "head_bu",
    email: "head_bu@gmail.com",
    positions: [
      {
        id: 1,

        job_title_position: {
          id: 1,
          company_code: "BPG",
          job_title: {
            code: "JT001",
            name: "Head of Shorebase",
          },
          parent_position: null,
          name: "Head of Shorebase",
        },
      },
    ],
  },
  {
    id: 2,
    name: "Corporate Invoicing",
    username: "corporate_invoicing",
    email: "corporate_invoicing@gmail.com",
    positions: [
      {
        id: 2,
        job_title_position: {
          id: 2,
          job_title: {
            code: "JT002",
            name: "Corporate Finance Invoicing Section",
          },
          company_code: "BPG",
          parent_position: null,
          name: "Corporate Finance Invoicing Section",
        },
      },
    ],
  },
  {
    id: 3,
    name: "Work Order Officer",
    username: "wo_officer",
    email: "wo_officer@gmail.com",
    positions: [
      {
        id: 3,
        job_title_position: {
          id: 3,
          job_title: {
            code: "JT003",
            name: "Work Order Officer",
          },

          company_code: "BPG",
          parent_position: null,
          name: "Work Order Officer",
        },
      },
    ],
  },
  {
    id: 4,
    name: "PHM",
    username: "phm",
    email: "phm@gmail.com",
    positions: [
      {
        id: 4,
        job_title_position: {
          id: 4,
          job_title: {
            code: "JT005",
            name: "Contractor Representative",
          },
          company_code: "PHM",
          parent_position: null,
          name: "Contractor Representative",
        },
      },
    ],
  },
  {
    id: 5,
    name: "ELSA",
    username: "elsa",
    email: "elsa@gmail.com",
    positions: [
      {
        id: 5,
        job_title_position: {
          id: 5,
          job_title: {
            code: "JT004",
            name: "Customer Representative",
          },
          company_code: "ELSA",
          parent_position: null,
          name: "Customer Representative",
        },
      },
    ],
  },
  {
    id: 6,
    name: "SLB",
    username: "slb",
    email: "slb@gmail.com",
    positions: [
      {
        id: 6,
        job_title_position: {
          id: 6,
          job_title: {
            code: "JT004",
            name: "Customer Representative",
          },
          company_code: "SLB",
          parent_position: null,
          name: "Customer Representative",
        },
      },
    ],
  },
  {
    id: 7,
    name: "MI",
    username: "mi",
    email: "mi@gmail.com",
    positions: [
      {
        id: 7,
        job_title_position: {
          id: 7,
          job_title: {
            code: "JT004",
            name: "Customer Representative",
          },
          company_code: "MI",
          parent_position: null,
          name: "Customer Representative",
        },
      },
    ],
  },
];

function login(login_info: { username: string; password: string }) {
  let user: User | null = null;
  for (const dummyUser of dummyUsers) {
    if (login_info.username == dummyUser.username) {
      user = dummyUser;
      userStore.login(dummyUser);
      return navigateTo("/");
    }
  }

  if (user == null) {
    toast.add({ title: "Username atau password salah", color: "error" });
  }
}
</script>
