<template>
  <div
    class="w-screen bg-gradient-blue-to-yellow min-h-48 md:min-h-64 flex items-center mb-10 shadow-sm overflow-hidden">
    <div class="container mx-6 xl:mx-auto px-4 py-8 max-w-6xl">
        <h2 class="text-3xl md:text-5xl lg:text-6xl font-semibold text-gray-800 tracking-tight">
          {{ props.text }}
        </h2>
        <div class="h-1 w-12 bg-gray-800 mt-4 rounded-full opacity-30"></div>
      </div>

  </div>
  <!-- <div 
    class="relative left-1/2 right-1/2 ml-[-50vw] mr-[-50vw] w-screen bg-gradient-blue-to-yellow min-h-48 md:min-h-64 flex items-center mb-10 shadow-sm overflow-hidden"
  >
      <div class="container mx-auto px-6 md:px-8">
        <h2 class="text-3xl md:text-5xl lg:text-6xl font-semibold text-gray-800 tracking-tight">
          {{ props.text }}
        </h2>
        <div class="h-1 w-12 bg-gray-800 mt-4 rounded-full opacity-30"></div>
      </div>
  </div> -->
</template>

<script lang="ts" setup>
const props = defineProps(['text'])
</script>