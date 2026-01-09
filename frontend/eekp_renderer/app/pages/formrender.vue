<template>
  <h1>Form Renderer</h1>
  <button @click="checkAlive" :style="{color:checkAliveSuccess}">Check Alive</button>
  <h3>{{ questionaire.title }}</h3>
  <p>{{ questionaire.description }}</p>
  <Dynamic_form :questionaireData="questionaire.outer_item" />
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
          console.log('Questionaire data:', data)
      } catch (err) {
          console.error('Fetch failed:', err)
      }
  })


</script>