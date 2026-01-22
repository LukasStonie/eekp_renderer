<template>
  <h1 class="text-4xl font-bold mb-4">Form Renderer</h1>
  <button class="bg-my-yellow-300 text-offblack font-bold py-2 px-4 rounded hover:bg-my-yellow-400" @click="checkAlive" >Check Alive</button>
  <h2 class="text-2xl font-semibold text-gray-700 mt-8 mb-4">{{ questionaire.title }}</h2>
  <p>{{ questionaire.description }}</p>
  <Dynamic_form class="py-5" :questionaireData="questionaire.outer_item" />
</template>

<script setup lang="ts">
import Dynamic_form from '~/components/dynamic _form.vue'
import parse_questionaire from '~/utils/parse_questionaire'


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

  const questionaire = ref<{title: string, description: string, outer_item: any}>({title: '', description: '', outer_item: {}})
  onMounted(async () => {
      try {
          const data = await $fetch('/api/questionaire_geburt')
          questionaire.value = parse_questionaire(data)
          
          console.log('Questionaire data:', questionaire.value.outer_item)
      } catch (err) {
          console.error('Fetch failed:', err)
      }
  })


</script>