<template>
  <div class="flex flex-col min-h-screen bg-white">
    <header-section text="Dokumentenreferenzen Details" />

    <main class="container md:mx-auto px-6 xl:px-4 py-8 max-w-6xl flex-grow">
      <BackButton path="/DocumentReferences" class="mb-6" />

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        
        <div class="space-y-4">
          <el-collapse v-model="actives" class="border rounded-lg overflow-hidden shadow-sm">
            
            <el-collapse-item name="author">
              <template #title>
                <span class="text-lg font-bold px-4">Autor</span>
              </template>
              <div class="px-4 pb-4">
                <p class="text-gray-700">{{ documentReference?.author?.[0]?.display ?? 'Unbekannt' }}</p>
              </div>
            </el-collapse-item>

            <el-collapse-item name="state">
              <template #title>
                <span class="text-lg font-bold px-4">Status</span>
              </template>
              <div class="px-4 pb-4">
                <el-tag :type="documentReference?.status === 'current' ? 'success' : 'info'">
                  {{ documentReference?.status ?? 'Unbekannt' }}
                </el-tag>
              </div>
            </el-collapse-item>

            <el-collapse-item name="related">
              <template #title>
                <span class="text-lg font-bold px-4">Related Resources</span>
              </template>
              <div class="px-2 pb-4">
                <div v-if="documentReference?.context?.related?.length > 0" class="overflow-x-auto">
                  <el-table :stripe="true" :data="documentReference.context.related" style="width: 100%">
                    <el-table-column label="Beschreibung" min-width="150">
                      <template #default="{ row }">
                        <span :class="row.display ? 'text-gray-800' : 'text-gray-400 italic'">
                          {{ row.display ?? 'Nicht vorhanden' }}
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column label="Resource" min-width="180">
                      <template #default="{ row }">
                        <div v-if="row.reference" class="flex flex-wrap">
                          <el-button 
                            text
                            class="!whitespace-normal !h-auto !py-1 !text-left break-all text-blue-600 hover:underline"
                            @click="handleAction({ type: 'view', data: row.reference })"
                          >
                            {{ row.reference }}
                          </el-button>
                        </div>
                        <span v-else class="text-gray-400 italic">Nicht vorhanden</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <div v-else class="p-4">
                  <el-alert title="Keine Daten gefunden." center show-icon type="info" :closable="false" />
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>

        <div class="w-full">
          <div v-if="attachmentContent" class="bg-gray-50 rounded-xl p-2 border border-gray-200 shadow-inner">
            <iframe 
              :src="attachmentContent" 
              width="100%" 
              height="600px" 
              class="rounded border bg-white shadow-sm"
            ></iframe>
          </div>
          <div v-else class="h-full flex items-center justify-center min-h-[200px] border-2 border-dashed border-gray-200 rounded-xl">
            <el-empty description="Kein Attachment verfügbar" :image-size="100" />
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const sharedData: any = useState('view-docref-data')
const documentReference = ref<any>({})
const attachmentContent = ref('')
const actives = ref(['author'])

onMounted(async () => {
    if (!sharedData.value) {
        navigateTo('/DocumentReferences')
    }
    else {
        documentReference.value = sharedData.value?.resource
        openDocument(documentReference.value.content?.[0]?.attachment?.url)
    }
})

watch(documentReference.value, async (newDocRef) => {

})

const handleAction = async (params: { type: string, data: any }) => {

    if (params.type === 'view') {


        const questionnaireResponse = await fetchRelatedResource(params.data)

        if (questionnaireResponse) {
            const sharedData = useState('view-response-data')
            sharedData.value = { resource: questionnaireResponse }
            console.log(sharedData.value)
            navigateTo('/QuestionnaireResponses/view',)
        }
    }
}

const openDocument = async (url: string) => {
    const loading = ElLoading.service({
        lock: true,
        text: 'Verarbeiten',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    try {
        const data = await fetchRelatedResource(url)
        attachmentContent.value = `data:application/pdf;base64,${data.data}`
    } catch (err) {
        console.error('Failed to open document:', err)
        ElMessage.error({ message: 'Fehler beim Laden des Attachments!', placement: 'top-right', duration: 0, showClose: true });

    } finally {
        loading.close()
    }
}

const fetchRelatedResource = async (resource: string) => {

    const loading = ElLoading.service({
        lock: true,
        text: 'Verarbeiten',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    try {
        const data = await $fetch('/api/resource', {
            method: 'GET',
            query: { resource: resource.startsWith('/') ? resource : '/' + resource }
        })
        return data
    } catch (err) {
        console.error('Failed to open document:', err)
        ElMessage.error({ message: 'Fehler beim Laden des Attachments!', placement: 'top-right', duration: 0, showClose: true });
        return null
    } finally {
        loading.close()
    }
}

</script>