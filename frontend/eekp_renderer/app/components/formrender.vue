<template>
  <p class="italic text-xl my-8">{{ questionnaire.description }}</p>

  <div class="grid grid-cols-4 gap-3">
    <div class="col-span-2 ">
      <div class="flex content-center justify-start mb-8">
        <el-form :model="form" :rules="rules" :validate-on-rule-change="false" label-position="top" :key="selectedQuestionnaire" ref="formRef"
          max-width="300px" size="default">
          <el-form-item prop="identifier">
            <template #label>
              <span class="inline-flex items-center gap-1">
                <span class="text-1xl font-semibold text-gray-700">Identifier</span>

                <el-tooltip content="Identifier für spätere Suche" placement="right">
                  <el-icon class="cursor-help text-blue-500">
                    <ElIconQuestionFilled />
                  </el-icon>
                </el-tooltip>
              </span>
            </template>
            <el-input v-model="form['identifier']"></el-input>
          </el-form-item>

          <QuestionNode v-for="rootItem in questionnaire.outer_item" :key="rootItem.linkId" :item="rootItem" :form="form"
            :level="0" />

          <el-button color="#FBEF7A" size="large" @click="submit()">Submit</el-button>
        </el-form>
      </div>
    </div>
    <div v-if="expertMode"
      class="bg-white col-span-2 sticky top-4 h-fit p-4 rounded shadow-sm overflow-auto max-h-screen">
      <h3 class="font-bold mb-2">Questionnaire Response Preview:</h3>
      <pre class="text-xs">{{ response }}</pre>
      <h3 class="font-bold mb-2">Form:</h3>
      <pre class="text-xs">{{ form }}</pre>
    </div>
  </div>
  <div class="fixed bottom-6 right-6 z-50">
    <el-tooltip content="Toggle Expert Mode - shows form data and FHIR response preview" placement="top">
      <el-button type="primary" size="large" circle color="#FBEF7A" class="fab-shadow !w-14 !h-14 !text-xl"
        @click="expertMode = !expertMode">
        <el-icon>
          <ElIconDocument />
        </el-icon>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import QuestionNode from '~/components/QuestionNode.vue'
import HeaderSection from '~/components/HeaderSection.vue'
import { mapToFhirResponse } from '~/utils/export_fhir'
import parse_questionnaire from '~/utils/parse_questionnaire'
import parse_questionnaire_rules from '~/utils/parse_questionnaire_rules'

const props = defineProps(['reference', 'questionnaireMapping', 'initialFormValues'])
const emit = defineEmits(['submitEvent'])

const expertMode = ref(false)

const selectedQuestionnaire = ref(props.reference)

const questionnaire = ref<{ title: string, description: string, outer_item: any }>({ title: '', description: '', outer_item: {} })
const formRef = ref<FormInstance>()
const form = ref<any>({})
const rules = ref<FormRules<any>>({})

onMounted(async () => {
  if (props.initialFormValues) {
    form.value = props.initialFormValues
  }
})


watch(() => props.reference, async (newRef) => {
  if (newRef) {
    questionnaire.value = newRef
  }
})

watch(() => props.questionnaireMapping, async (newMapping) => {
  if (newMapping) {
    // You can add logic here to update the form based on the new mapping if needed (e.g., pre-fill certain fields)
  }
})

watch(() => props.initialFormValues, async (newFormValues) => {
  if (newFormValues) {
    form.value = newFormValues
  }
})


watch(questionnaire, async (newData) => {
  if (newData && newData.outer_item) {
    if (!props.initialFormValues) {
      form.value = parseQuestionnaireFormBindingds(newData.outer_item)
    }
    rules.value = parse_questionnaire_rules(newData.outer_item)

    if (formRef.value) {
      formRef.value.clearValidate()
    }
  }
})


const response = computed(() => {
  return {
    resourceType: "QuestionnaireResponse",
    meta: {
      profile: [
        "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaireresponse|2.7"
      ],
      tag: [
        {
          code: "lformsVersion: 34.0.0"
        }
      ]
    },
    questionnaire: props.questionnaireMapping,
    authored: new Date().toISOString(),
    identifier: [
      {
        system: "https://elga.gv.at/eekp/untersuchungsId",
        value: form.value.identifier
      }
    ],
    item: mapToFhirResponse(questionnaire.value.outer_item, form.value)
  }
})


const submit = async () => {
  if (!formRef.value) return;

  formRef.value.validate(async (valid) => {
    if (valid) {
      emit('submitEvent', response.value)
    } else {
      ElMessage.warning({ message: 'Bitte füllen Sie alle erforderlichen Felder aus.', placement: 'top-right', duration: 0, showClose: true });
    }
  });
};


</script>