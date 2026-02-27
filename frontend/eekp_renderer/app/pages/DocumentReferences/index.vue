<template>
  <div class="flex flex-col min-h-screen bg-white">
    <header-section text="Dokumentenreferenzen" />

    <main class="container md:mx-auto px-8 xl:px-4 max-w-6xl flex-grow">

      <back-button path="/" class="mb-6" />

      <div class="mt-5">
        <div v-if="docReferences && docReferences.length > 0" class="overflow-x-auto">
          <transition name="el-zoom-in-top" appear>
            <el-table :stripe="true" :data="docReferences" style="width: 100%"
              class="rounded-lg shadow-sm border border-gray-100">
              <el-table-column label="Identifier" min-width="180">
                <template #default="{ row }">
                  <span v-if="row.resource?.identifier?.[0]?.value" class="font-mono text-xs">
                    {{ row.resource?.identifier?.[0]?.value }}
                  </span>
                  <span v-else class="text-gray-400 italic text-sm">Nicht vorhanden</span>
                </template>
              </el-table-column>

              <el-table-column label="Author" min-width="180">
                <template #default="{ row }">
                  <span v-if="row.resource?.author?.[0]?.display" class="text-gray-700">
                    {{ row.resource.author[0].display }}
                  </span>
                  <span v-else class="text-gray-400 italic text-sm">Nicht vorhanden</span>
                </template>
              </el-table-column>

              <el-table-column label="Details" width="120">
                <template #default="{ row }">
                  <div class="flex flex-col gap-1 text-xs text-gray-500">
                    <span>Attachments: {{ row.resource?.content?.length || 0 }}</span>
                    <span>Related: {{ row.resource?.context?.related?.length || 0 }}</span>
                  </div>
                </template>
              </el-table-column>

              <el-table-column label="Aktionen" width="120" fixed="right">
                <template #default="{ row }">
                  <el-button v-if="row.resource?.content" size="small" color="#FBEF7A" class="font-semibold"
                    @click="handleAction({ type: 'view', data: row })">
                    Details
                  </el-button>
                  <span v-else class="text-gray-400 text-xs italic">Kein Inhalt</span>
                </template>
              </el-table-column>
            </el-table>
          </transition>
        </div>

        <div v-else class="mt-10">
          <el-alert title="Keine Dokumente gefunden." center show-icon type="info" :closable="false" />
        </div>
      </div>

      <div class="my-10 grid grid-cols-1 lg:grid-cols-2 gap-8" v-if="documentContent">
        <div class="col-span-1 lg:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-inner">
          <div class="flex justify-between items-center mb-4">
            <h4 class="font-bold text-gray-700">Dokumentenvorschau</h4>
            <el-button size="small" @click="documentContent = null">Schließen</el-button>
          </div>
          <iframe :src="documentContent" width="100%" height="600px" class="rounded border bg-white"></iframe>
        </div>
      </div>
    </main>
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
    const data = await $fetch('/api/resource', {
      method: 'GET',
      query: {resource: 'DocumentReference'}
    })
    docReferences.value = data.entry
  } catch (err) {
    console.error('Fetch failed:', err)
    ElMessage.error({ message: 'Fehler beim Laden der Document References!', placement: 'top-right', duration: 0, showClose: true });
  } finally {
    loading.close()
  }
}
</script>