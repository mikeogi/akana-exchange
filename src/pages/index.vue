<template>
  <div class="IndexPage">
    <h1>Hello</h1>
    <AppCurrencyInput />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppCurrencyInput from "~/components/AppCurrencyInput/AppCurrencyInput.vue";

export default defineComponent({
  components: {AppCurrencyInput},
  setup() {
  },
})
</script>
