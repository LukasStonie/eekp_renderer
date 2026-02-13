<template>
  <h1>Index page</h1>
  <p>Welcome to the index page!</p>
  <p> some text </p>
  <button class="bg-my-yellow-50 text-offblack font-bold py-2 px-4 rounded hover:bg-my-yellow-400"
          @click="checkAlive">Check Alive</button>
  <NuxtLink to="/formrender">Go to Form Renderer</NuxtLink>
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
</script>