<template>
    <div class="container">
        <header-section text="Dokumentenreferenzen" />

        <back-button path="/" />

        <div class="flex justify-start">
            <div v-if="docReferences && docReferences.length > 0" class="mt-5 flex justify-center">
                <el-table :stripe="true" :data="docReferences">
                    <el-table-column label="Identifier" width="250">
                        <template #default="{ row }">
                            <span v-if="row.resource?.identifier?.[0]?.value">
                                {{ row.resource?.identifier?.[0]?.value }}
                            </span>
                            <span v-else class="text-gray-400">
                                Nicht vorhanden
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="Author" width="250">
                        <template #default="{ row }">
                            <span v-if="row.resource?.author?.[0]?.display">
                                {{ row.resource.author[0].display }}
                            </span>
                            <span v-else class="text-gray-400">
                                Nicht vorhanden
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="Attachments" width="250">
                        <template #default="{ row }">
                            <span v-if="row.resource?.content">
                                {{ row.resource?.content.length }}
                            </span>
                            <span v-else class="text-gray-400">
                                Nicht vorhanden
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="Related" width="250">
                        <template #default="{ row }">
                            <span v-if="row.resource?.context?.related">
                                {{ row.resource?.context?.related.length }}
                            </span>
                            <span v-else class="text-gray-400">
                                Nicht vorhanden
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="Aktionen" width="250">
                        <template #default="{ row }">
                            <span v-if="row.resource?.content">
                                <el-button size="default" color="#FBEF7A"
                                    @click="handleAction({ type: 'view', data: row })"> Details </el-button>
                            </span>
                            <span v-else class="text-gray-400">
                                Nicht vorhanden
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-else class="mt-5">
                <el-alert title="Keine Elemente gefunden." center show-icon type="info" :closable="false" />
            </div>
        </div>


        <div class="my-5 grid grid-cols-2 gap-4">
            <div class="col-span-1" v-if="documentContent">
                <iframe :src="documentContent" width="100%" height="600px"></iframe>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import HeaderSection from '~/components/HeaderSection.vue'
import { on } from 'node:cluster'
import BackButton from '~/components/BackButton.vue'

const docReferences = ref(null)
const documentContent = ref("")
onMounted(() => {
    checkDocumentReferences()
})

const handleAction = (params: { type: string, data: any }) => {

    if (params.type === 'view') {
        const sharedData = useState('view-docref-data')
        sharedData.value = params.data
        navigateTo('/DocumentReferences/view')
    }
}

const checkDocumentReferences = async () => {
    const loading = ElLoading.service({
        lock: true,
        text: 'Verarbeiten',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    try {
        const data = await $fetch('/api/document_references')

        docReferences.value = data.entry
    } catch (err) {
        console.error('Fetch failed:', err)
        ElMessage.error({ message: 'Fehler beim Laden der Document References!', placement: 'top-right', duration: 0, showClose: true });
    } finally {
        loading.close()
    }
}
</script>