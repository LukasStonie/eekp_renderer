<template>
    <div class="container">
        <header-section text="Questionnaire Responses" />
        <back-button path="/" />

        <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mt-4 w-full">

            <div class="flex gap-2 w-full lg:w-1/4">
                <el-input v-model="identifier" placeholder="Nach Identifier suchen" size="large" class="flex-1" />
                <el-button @click="searchForIdentifier(identifier)" color="#FBEF7A" size="large" :loading="loading">
                    Suchen
                </el-button>
            </div>

            <div class="flex justify-start lg:justify-end">
                <el-dropdown trigger="click">
                    <el-button type="primary" color="#FBEF7A" size="large" class="w-full lg:w-auto">
                        Neuer Eintrag <el-icon class="el-icon--right"><el-icon-arrow-down /></el-icon>
                    </el-button>

                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item v-for="q in questionnaires" :key="q.url"
                                @click="handleAction({ type: 'new', data: q })">
                                {{ q.title }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
        <div class="flex justify-start">
            <div v-if="questionnaireResponses && questionnaireResponses.length > 0" class="mt-5">
                <el-table v-loading="loading" :data="questionnaireResponses" row-key="resource.authored">
                    <el-table-column prop="resource.identifier[0].value" label="Identifier" width="250" />
                    <el-table-column label="Questionnaire" width="400">
                        <template #default="{ row }">
                            <el-check-tag checked color="#59ACD7" v-if="row.resource?.questionnaire">
                                {{ questionnaireTag(row.resource.questionnaire) }}
                            </el-check-tag>
                            <el-check-tag checked color="#59ACD7" v-else-if="row.questionnaire">
                                {{ questionnaireTag(row.questionnaire) }}
                            </el-check-tag>
                        </template>
                    </el-table-column>
                    <el-table-column sortable prop="resource.authored" label="Erstellt am" width="200">
                        <template #default="{ row }">
                            {{ new Date(row.resource.authored).toLocaleString() }}
                        </template>
                    </el-table-column>
                    <el-table-column label="Aktionen" width="150">
                        <template #default="{ row }">
                            <el-button size="small" color="#FBEF7A"
                                @click="handleAction({ type: 'view', data: row })">Details</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-else class="mt-5">
                <el-alert title="Keine Elemente gefunden. Passen Sie den Identifier an." center show-icon type="info"
                    :closable="false" />
            </div>
        </div>
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