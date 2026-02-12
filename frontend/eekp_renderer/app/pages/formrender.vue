<template>
  <h1 class="text-4xl font-bold mb-4">Form Renderer</h1>
  <button class="bg-my-yellow-300 text-offblack font-bold py-2 px-4 rounded hover:bg-my-yellow-400"
    @click="checkAlive">Check Alive</button>

  <el-form-item label="Select Questionaire">
    <el-select v-model="selectedQuestionaire" placeholder="Select a questionaire" class="w-full">
      <el-option v-for="q in questionaires" :key="q.url" :label="q.title" :value="q.url"></el-option>
    </el-select>
  </el-form-item>

  <h2 class="text-2xl font-semibold text-gray-700 mt-8 mb-4">{{ questionaire.title }}</h2>
  <p>{{ questionaire.description }}</p>
  <div class="grid grid-flow-col gap-3">
    <div class="col-span-1 ">
      <el-form :model="form" :rules="rules" label-position="top" :key="selectedQuestionaire" ref="formRef">

        <QuestionNode v-for="rootItem in questionaire.outer_item" :key="rootItem.linkId" :item="rootItem" :form="form"
          :level="0" />

        <el-button type="primary" @click="submit">Submit</el-button>
      </el-form>
    </div>
    <div class="bg-red-100 col-span-1 sticky top-4 h-fit p-4 rounded shadow-sm overflow-auto max-h-screen">
      <h3 class="font-bold mb-2">Form Data Preview:</h3>
      <pre class="text-xs">{{ response }}</pre>
      <pre class="text-xs">{{ form }}</pre>
    </div>
  </div>

</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import Dynamic_form from '~/components/dynamic _form.vue'
import QuestionNode from '~/components/QuestionNode.vue'
import { mapToFhirResponse } from '~/utils/export_fhir'
import parse_questionaire from '~/utils/parse_questionaire'
import parse_questionaire_rules from '~/utils/parse_questionaire_rules'



const checkAliveSuccess = ref('red')


const checkAlive = async () => {
  try {
    const data = await $fetch('/api/alive')

    console.log('Alive status:', data)
    checkAliveSuccess.value = 'green'

    console.log('Form Ref Status:', formRef.value)

  } catch (err) {
    console.error('Fetch failed:', err)
    checkAliveSuccess.value = 'red'
  }
}

const questionaires = [
  { url: 'https://dev.elga.gv.at/apis/eekp-fhir-anbindung/v0.1.0/reference/static/geburt-schwangere.json', title: 'Geburt Schwangere' },
  { url: 'https://dev.elga.gv.at/apis/eekp-fhir-anbindung/v0.1.0/reference/static/geburt-kind.json', title: 'Geburt Kind' },
  { url: 'https://dev.elga.gv.at/apis/eekp-fhir-anbindung/v0.1.0/reference/static/postpartale-periode.json', title: 'Postpartale Periode' },
  { url: 'https://dev.elga.gv.at/apis/eekp-fhir-anbindung/v0.1.0/reference/static/kind-nach-geburt.json', title: 'Kind nach Geburt' },
]
const selectedQuestionaire = ref(questionaires[0]?.url)

const questionaire = ref<{ title: string, description: string, outer_item: any }>({ title: '', description: '', outer_item: {} })
watch(selectedQuestionaire, async (newUrl) => {
  if (!newUrl) return

  try {
    const data = await $fetch(newUrl)
    // This will trigger the watch(questionaire) below
    questionaire.value = parse_questionaire(data)
  } catch (err) {
    console.error('Fetch failed:', err)
  }
}, { immediate: true })


watch(selectedQuestionaire, async (newVal) => {
  try {
    const data = await $fetch(newVal ?? '')
    questionaire.value = parse_questionaire(data)
    console.log('Selected Questionaire data:', questionaire.value.outer_item)
  } catch (err) {
    console.error('Fetch failed:', err)
  }
})

const formRef = ref<FormInstance>()
const form = ref<any>({})
const rules = ref<FormRules<any>>({})

watch(questionaire, async (newData) => {
  if (newData && newData.outer_item) {
    // Reset form data and rules
    form.value = parseQuestionaireFormBindingds(newData.outer_item)
    rules.value = parse_questionaire_rules(newData.outer_item)

    // Wait for the :key on el-form to destroy/recreate the component
    //await nextTick()

    if (formRef.value) {
      formRef.value.clearValidate()
    }
  }
})

const response = ref<any>(null)
const submit = async () => {
  if (!formRef.value) return;

  try {
    // 1. Validate the UI (Element Plus)
    await formRef.value.validate();

    // 2. Generate the Response resource
    const questionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "completed",
      questionnaire: selectedQuestionaire.value, // The URL
      authored: new Date().toISOString(),
      item: mapToFhirResponse(questionaire.value.outer_item, form.value)
    };

    console.log("Final FHIR Resource:", questionnaireResponse);
    response.value = questionnaireResponse;

    // 3. Post to your API
    // await $fetch('/api/submit', { method: 'POST', body: questionnaireResponse })

  } catch (error) {
    console.error("Validation failed or mapping error:", error);
    ElMessage.error({message: 'Die Validierung ist fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.', placement: 'top-right', duration:0, showClose: true});
    // Element Plus will automatically show the red error messages
  }
};


</script>