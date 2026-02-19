<template>
  <h1>Index page</h1>
  <p>Welcome to the index page!</p>
  <div class="flex gap-4 pt-4">
      <button 
        @click="checkAlive"
        class="px-6 py-2 bg-yellow-500 text-black font-medium rounded-md shadow-md hover:bg-yellow-600 transition-colors duration-200 active:transform active:scale-95"
      >
        Check Alive
      </button>

      <button 
        @click="checkDocumentReferences"
        class="px-6 py-2 bg-yellow-500 text-black font-medium rounded-md shadow-md hover:bg-yellow-600 transition-colors duration-200 active:transform active:scale-95"
      >
        Check Document References
      </button>

      <NuxtLink 
        to="/formrender" 
        class="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-md border border-gray-300 hover:bg-gray-200 transition-colors duration-200"
      >
        Go to Form Renderer
      </NuxtLink>
    </div>
</template>

<script lang="ts" setup>
const checkAliveSuccess = ref('red')


const checkAlive = async () => {
  try {
    const data = await $fetch('/api/alive')

    console.log('Alive status:', data)
    checkAliveSuccess.value = 'green'

  } catch (err) {
    console.error('Fetch failed:', err)
    checkAliveSuccess.value = 'red'
  }
}

const checkDocumentReferences = async () => {
  try {
    const data = await $fetch('/api/findDocumentReferences')

    console.log('Document References status:', data)
  } catch (err) {
    console.error('Fetch failed:', err)
  }
}
</script>