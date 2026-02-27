<template>
  <div class="max-w-6xl mx-auto">
    <p class="italic text-lg md:text-xl text-gray-600 my-8 leading-relaxed border-l-4 border-blue-400 pl-4">
      {{ questionnaire.description }}
    </p>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

      <div :class="expertMode ? 'lg:col-span-2' : 'lg:col-span-3'">
        <div class="bg-white p-6 md:p-8 rounded-xl border border-gray-100 shadow-sm">
          <el-form :model="form" :rules="rules" :validate-on-rule-change="false" label-position="top"
            :key="selectedQuestionnaire" ref="formRef" size="large">
            <el-form-item prop="identifier" class="mb-8">
              <template #label>
                <span class="inline-flex items-center gap-2">
                  <span class="text-lg font-bold text-gray-700">Identifier</span>
                  <el-tooltip content="Eindeutige ID für spätere Suche" placement="right">
                    <el-icon class="cursor-help text-blue-500 text-lg">
                      <ElIconQuestionFilled />
                    </el-icon>
                  </el-tooltip>
                </span>
              </template>
              <el-input v-model="form['identifier']" placeholder="z.B. PAT-123-2026" class="max-w-md" :disabled="!editIdentifier"/>
            </el-form-item>

            <div class="space-y-6 mb-10">
              <QuestionNode v-for="rootItem in questionnaire.outer_item" :key="rootItem.linkId" :item="rootItem"
                :form="form" :level="0" />
            </div>

            <div class="pt-6 border-t border-gray-100">
              <el-button color="#FBEF7A" size="large" @click="submit()"
                class="font-bold px-10 shadow-sm hover:shadow-md transition-all">
                Eintrag Speichern
              </el-button>
            </div>
          </el-form>
        </div>
      </div>

      <transition name="el-zoom-in-top">
        <div v-if="expertMode" class="lg:col-span-2 sticky top-4 space-y-4 h-[calc(100vh-2rem)] flex flex-col">
          <div class="bg-gray-900 rounded-xl p-4 shadow-lg flex-1 flex flex-col overflow-hidden relative group">

            <div class="flex justify-between items-center mb-2">
              <h3 class="text-blue-400 font-mono text-sm flex items-center gap-2">
                <span class="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                FHIR QuestionnaireResponse
              </h3>

              <el-button size="small" link class="!text-gray-400 hover:!text-blue-400 transition-colors"
                @click="copyToClipboard(JSON.stringify(response, null, 2))">
                <el-icon class="mr-1">
                  <ElIconDocumentCopy />
                </el-icon>
                JSON kopieren
              </el-button>
            </div>

            <pre
              class="text-gray-300 text-[10px] md:text-xs overflow-auto custom-scrollbar flex-1 bg-black/30 p-2 rounded select-all">
        {{ JSON.stringify(response, null, 2) }}
      </pre>
          </div>
        </div>
      </transition>
    </div>

    <div class="fixed bottom-10 right-10 z-50">
      <el-tooltip :content="expertMode ? 'Expert Mode schließen' : 'Expert Mode öffnen (FHIR Preview)'" placement="top">
        <el-button type="primary" size="large" circle color="#FBEF7A"
          class="!w-16 !h-16 shadow-2xl transition-all hover:scale-110" @click="expertMode = !expertMode">
          <el-icon class="text-2xl">
            <ElIconClose :size="40" v-if="expertMode" />
            <ElIconCpu :size="40" v-else />
          </el-icon>
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import QuestionNode from '~/components/QuestionNode.vue'
import HeaderSection from '~/components/HeaderSection.vue'
import { mapToFhirResponse } from '~/utils/export_fhir'
import parse_questionnaire from '~/utils/parse_questionnaire'
import parse_questionnaire_rules from '~/utils/parse_questionnaire_rules'

const props = defineProps(['reference', 'questionnaireMapping', 'initialFormValues', 'editIdentifier'])
const emit = defineEmits(['submitEvent'])
const editIdentifier = ref(props.editIdentifier)

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
        "http://hl7.org/fhir/4.0/StructureDefinition/QuestionnaireResponse"
      ],
      tag: [
        {
          code: "lformsVersion: 40.0.0"
        }
      ]
    },
    status: "completed",
    questionnaire: props.questionnaireMapping,
    authored: new Date().toISOString(),
    identifier:
    {
      system: "https://elga.gv.at/eekp/untersuchungsId",
      value: form.value.identifier
    }
    ,
    item: mapToFhirResponse(questionnaire.value.outer_item, form.value)
  }
})

const copyToClipboard = async (text: string) => {
  // Check if the modern API is available
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      showSuccess()
      return
    } catch (err) {
      console.error('Clipboard API failed', err)
    }
  }

  // Fallback for non-HTTPS or failed modern API
  try {
    const textArea = document.createElement("textarea")
    textArea.value = text
    // Ensure the textarea is not visible but part of the DOM
    textArea.style.position = "fixed"
    textArea.style.left = "-9999px"
    textArea.style.top = "0"
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)
    
    if (successful) showSuccess()
    else throw new Error('Copy command failed')
  } catch (err) {
    ElMessage.error('Fehler beim Kopieren: Browser-Sicherheit verhindert Zugriff')
  }
}

const showSuccess = () => {
  ElMessage({
    message: 'FHIR JSON in die Zwischenablage kopiert!',
    type: 'success',
    placement: 'top-right',
  })
}


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