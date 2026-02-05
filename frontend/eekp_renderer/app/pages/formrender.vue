<template>
  <h1 class="text-4xl font-bold mb-4">Form Renderer</h1>
  <button class="bg-my-yellow-300 text-offblack font-bold py-2 px-4 rounded hover:bg-my-yellow-400"
    @click="checkAlive">Check Alive</button>
  <h2 class="text-2xl font-semibold text-gray-700 mt-8 mb-4">{{ questionaire.title }}</h2>
  <p>{{ questionaire.description }}</p>
  <div class="grid grid-flow-col gap-3">
    <div class="col-span-1 ">
      <el-form :model="form" :rules="rules" label-position="top">

        <QuestionNode v-for="rootItem in questionaire.outer_item" :key="rootItem.linkId" :item="rootItem" :form="form"
           :level="0" />

        <el-button type="primary" @click="submit">Submit</el-button>
      </el-form>
    </div>
    <div class="bg-red-100 col-span-1">
      {{ form }}
    </div>
  </div>

  <!-- <Dynamic_form class="py-5" :questionaireData="questionaire.outer_item" /> -->
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import Dynamic_form from '~/components/dynamic _form.vue'
import QuestionNode from '~/components/QuestionNode.vue'
import parse_questionaire from '~/utils/parse_questionaire'
import parse_questionaire_rules from '~/utils/parse_questionaire_rules'



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

const questionaire = ref<{ title: string, description: string, outer_item: any }>({ title: '', description: '', outer_item: {} })
onMounted(async () => {
  try {
    const data = await $fetch('/api/questionaire_geburt')
    questionaire.value = parse_questionaire(data)

    console.log('Questionaire data:', questionaire.value.outer_item)
  } catch (err) {
    console.error('Fetch failed:', err)
  }
})

const formRef = ref<FormInstance>()
const form = ref<any>({})
const rules = ref<FormRules<any>>({})

watch(questionaire, (newData) => {
  if (newData) {
    console.log(newData)

    const formVals = parseQuestionaireFormBindingds(newData.outer_item)
    form.value = formVals
    console.log(formVals)
    const parsedRules = parse_questionaire_rules(newData.outer_item)
    rules.value = parsedRules
    console.log(rules.value)
  }
})

const submit = async () => {
  console.log("Submitting")
}

</script>