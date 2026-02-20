<template>
  <header-section text="ElternKindPass" />
  <div class="flex gap-4 pt-4">
    <el-button @click="checkAlive" color="#FBEF7A" size="large">
      Check Alive
    </el-button>
    <!-- <el-input v-model="token" placeholder="Alive Status" class="w-16" /> -->
    <el-button @click="checkDocumentReferences" color="#FBEF7A" size="large">
      Check Document References
    </el-button>
    <el-button tag="router-link" to="/formrender" color="#FBEF7A" size="large">Go to Form Renderer</el-button>
  </div>
</template>

<script lang="ts" setup>
import HeaderSection from '~/components/HeaderSection.vue'

const checkAliveSuccess = ref('red')
const token = ref("")


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
    const data = await $fetch('/api/document_references', { body: { token: token.value } })

    console.log('Document References status:', data)
  } catch (err) {
    console.error('Fetch failed:', err)
  }
}
</script>