<template>
  <div class="flex flex-col min-h-screen bg-white">
    <header-section text="Questionnaire Responses" />

    <main class="container md:mx-auto px-8 xl:px-4 py-8 max-w-6xl flex-grow">
      <back-button path="/" class="mb-6" />

      <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mt-4 w-full">
        
        <div class="flex gap-2 w-full lg:max-w-md">
          <el-input 
            v-model="identifier" 
            placeholder="Nach Identifier suchen" 
            size="large" 
            class="flex-1"
            clearable
          />
          <el-button 
            @click="searchForIdentifier(identifier)" 
            color="#FBEF7A" 
            size="large" 
            :loading="loading"
            class="font-semibold"
          >
            Suchen
          </el-button>
        </div>

        <div class="flex justify-start lg:justify-end">
          <el-dropdown trigger="click" class="w-full lg:w-auto">
            <el-button color="#FBEF7A" size="large" class="w-full lg:w-auto font-semibold">
              Neuer Eintrag <el-icon class="el-icon--right"><el-icon-arrow-down /></el-icon>
            </el-button>

            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item 
                  v-for="q in questionnaires" 
                  :key="q.url"
                  @click="handleAction({ type: 'new', data: q })"
                >
                  {{ q.title }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <div class="mt-10 overflow-x-auto">
        <div v-if="questionnaireResponses && questionnaireResponses.length > 0">
          <el-table 
            v-loading="loading" 
            :data="questionnaireResponses" 
            row-key="resource.authored"
            style="width: 100%"
            class="rounded-lg shadow-sm"
          >
            <el-table-column prop="resource.identifier[0].value" label="Identifier" min-width="180" />
            
            <el-table-column label="Questionnaire" min-width="300">
              <template #default="{ row }">
                <el-check-tag checked color="#59ACD7" v-if="row.resource?.questionnaire" class="whitespace-normal h-auto py-1">
                  {{ questionnaireTag(row.resource.questionnaire) }}
                </el-check-tag>
                <el-check-tag checked color="#59ACD7" v-else-if="row.questionnaire" class="whitespace-normal h-auto py-1">
                  {{ questionnaireTag(row.questionnaire) }}
                </el-check-tag>
              </template>
            </el-table-column>

            <el-table-column sortable prop="resource.authored" label="Erstellt am" width="180">
              <template #default="{ row }">
                <span class="text-gray-600 text-sm">
                  {{ new Date(row.resource.authored).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) }}
                </span>
              </template>
            </el-table-column>

            <el-table-column label="Aktionen" width="120" fixed="right">
              <template #default="{ row }">
                <el-button 
                  size="small" 
                  color="#FBEF7A"
                  class="font-semibold"
                  @click="handleAction({ type: 'view', data: row })"
                >
                  Details
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div v-else class="py-20 flex justify-center">
          <el-alert 
            title="Keine Elemente gefunden" 
            description="Passen Sie den Identifier an oder legen Sie einen neuen Eintrag an."
            center 
            show-icon 
            type="info"
            :closable="false"
            class="max-w-xl"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import BackButton from '~/components/BackButton.vue';
import questionnaire_mapping from '~/utils/questionnaire_mapping';

const config = useRuntimeConfig()
const router = useRouter()
const identifier = ref('')
const questionnaires = questionnaire_mapping()
const loading = ref(false)

const questionnaireResponses = ref([])

const searchForIdentifier = async (id: string) => {
    try {
        loading.value = true
        console.log(`${config.public.defaultQuestionnaireIdentifierSystem}|${id}`)
        const data: any = await $fetch('/api/questionnaires/read', {
            method: 'GET',
            params: { identifier: `${config.public.defaultQuestionnaireIdentifierSystem}|${id}` }
        })
        questionnaireResponses.value = data.entry || []
    } catch (err) {
        console.error('Search failed:', err)
        ElMessage.error({ message: 'Fehler beim Abfragen der Questionnaire Response!', placement: 'top-right', duration: 0, showClose: true });
    } finally {
        loading.value = false
    }
}

const handleAction = (params: { type: string, data: any }) => {

    if (params.type === 'new') {
        const sharedData = useState('create-data')
        sharedData.value = params.data
        navigateTo('/QuestionnaireResponses/new')
    }
    else if (params.type === 'view') {
        const sharedData = useState('view-response-data')
        sharedData.value = params.data
        navigateTo('/QuestionnaireResponses/view')
    }
}

const questionnaireTag = (questionnaire: string) => {
    const foundMapping = questionnaire_mapping().find(q => q.questionnaireReference === questionnaire)
    if (foundMapping && foundMapping.title) return foundMapping.title
    else return questionnaire
}
</script>