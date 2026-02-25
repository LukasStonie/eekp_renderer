<template>
  <div
    class="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-gradient-blue-to-yellow content-center justify-center min-h-60 mb-5">
    <div class="flex justify-start container mx-auto px-4">
      <h2 class="text-6xl font-semibold text-gray-700">{{ props.text }}</h2>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps(['text'])
</script>