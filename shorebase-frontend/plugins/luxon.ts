import { DateTime } from 'luxon'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('luxon', DateTime)
})