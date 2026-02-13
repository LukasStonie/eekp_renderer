<template>
  <div
    class="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-gradient-blue-to-yellow content-center justify-center min-h-60 mb-5">
    <div class="flex justify-start container mx-auto px-4">
      <h2 class="text-6xl font-semibold text-gray-700">{{ questionaire.title }}</h2>
    </div>

  </div>

  <p class="italic text-xl mb-5">{{ questionaire.description }}</p>

  <el-form-item label="Select Questionaire">
    <el-select v-model="selectedQuestionaire" placeholder="Select a questionaire" class="w-full">
      <el-option v-for="q in questionaires" :key="q.url" :label="q.title" :value="q.url"></el-option>
    </el-select>
  </el-form-item>

  <div class="grid grid-flow-col gap-3">
    <div class="col-span-1 ">
      <div class="mt-8 flex content-center justify-start mb-8">
        <el-form :model="form" :rules="rules" label-position="top" :key="selectedQuestionaire" ref="formRef"
          max-width="300px" size="default">

          <QuestionNode v-for="rootItem in questionaire.outer_item" :key="rootItem.linkId" :item="rootItem" :form="form"
            :level="0" />

          <el-button color="#FBEF7A" size="large" @click="submit">Submit</el-button>
        </el-form>
      </div>
    </div>
  </div>
  <div class="bg-red-100 col-span-1 sticky top-4 h-fit p-4 rounded shadow-sm overflow-auto max-h-screen">
    <h3 class="font-bold mb-2">Form Data Preview:</h3>
    <pre class="text-xs">{{ response }}</pre>
    <pre class="text-xs">{{ form }}</pre>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import QuestionNode from '~/components/QuestionNode.vue'
import { mapToFhirResponse } from '~/utils/export_fhir'
import parse_questionaire from '~/utils/parse_questionaire'
import parse_questionaire_rules from '~/utils/parse_questionaire_rules'


const questionaires = [
  { url: 'https://dev.elga.gv.at/apis/eekp-fhir-anbindung/v0.1.0/reference/static/geburt-schwangere.json', title: 'Geburt Schwangere' },
  { url: 'https://dev.elga.gv.at/apis/eekp-fhir-anbindung/v0.1.0/reference/static/geburt-kind.json', title: 'Geburt Kind' },
  { url: 'https://dev.elga.gv.at/apis/eekp-fhir-anbindung/v0.1.0/reference/static/postpartale-periode.json', title: 'Postpartale Periode' },
  { url: 'https://dev.elga.gv.at/apis/eekp-fhir-anbindung/v0.1.0/reference/static/kind-nach-geburt.json', title: 'Kind nach Geburt' },
  { url: 'questionaires/V3_Das-Neugeborene-nach-der-Geburt.R4.json', title: 'Kind nach Geburt (File)' },
  { url: 'questionaires/V3_Geburt_Kind.R4.json', title: 'Geburt Kind (File)' },
  { url: 'questionaires/V3_Geburt_Schwangere.R4.json', title: 'Geburt Schwangere (File)' },
  { url: 'questionaires/V3_Postpartale-Periode.R4.json', title: 'Postpartale Periode (File)' },
  { url: 'questionaires/V3_Zustand-des-Kindes-bei-Entlassung_Transfer.R4.json', title: 'Kind bei Entlassung/Transfer (File)' },
]
const selectedQuestionaire = ref(questionaires[0]?.url)

const questionaire = ref<{ title: string, description: string, outer_item: any }>({ title: '', description: '', outer_item: {} })
watch(selectedQuestionaire, async (newUrl) => {
  if (!newUrl) return

  try {
    if (!newUrl?.startsWith('https')) {
      console.log('Fetching from file API for URL:', newUrl)
      const data = await $fetch('/api/questionaire_file', { query: { file: newUrl } })
      console.log('Fetched from file API:', data)
      questionaire.value = parse_questionaire(data)
    }
    else {
      console.log('Fetching from URL:', newUrl)
      const data = await $fetch(newUrl)
      // This will trigger the watch(questionaire) below
      questionaire.value = parse_questionaire(data)
    }

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
    ElMessage.error({ message: 'Die Validierung ist fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.', placement: 'top-right', duration: 0, showClose: true });
    // Element Plus will automatically show the red error messages
  }
};


</script>