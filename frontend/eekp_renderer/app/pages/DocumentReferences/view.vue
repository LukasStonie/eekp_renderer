<template>
    <header-section text="Dokumentenreferenzen Details" />

    <div class="container md:mx-auto px-8 xl:px-4 py-8 max-w-6xl">
        <BackButton path="/DocumentReferences" />

        <div class="my-5 grid grid-cols-2 gap-4">
            <div class="col-span-1">
                <el-collapse v-model="actives">
                    <el-collapse-item name="author">
                        <template #title="{ isActive }">
                            <span class="text-xl"><strong>Autor</strong></span>
                        </template>
                        <p class="text-lg">{{ documentReference?.author?.[0]?.display ?? 'Unbekannt' }}</p>
                    </el-collapse-item>

                    <el-collapse-item name="state">
                        <template #title="{ isActive }">
                            <span class="text-xl"><strong>Status</strong></span>
                        </template>
                        <p class="text-lg">{{ documentReference?.status ?? 'Unbekannt' }}</p>
                    </el-collapse-item>

                    <el-collapse-item name="related">
                        <template #title="{ isActive }">
                            <span class="text-xl"><strong>Related</strong></span>
                        </template>
                        <div v-if="documentReference?.context?.related && documentReference.context.related.length > 0">
                            <el-table :stripe="true" :data="documentReference.context.related" style="width: 100%">
                                <el-table-column label="Beschreibung" width="250">
                                    <template #default="{ row }">
                                        <span v-if="row.display">
                                            {{ row.display }}
                                        </span>
                                        <span v-else class="text-gray-400">
                                            Nicht vorhanden
                                        </span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Resource" width="250">
                                    <template #default="{ row }">
                                        <span v-if="row.display">
                                            {{ row.reference }}
                                        </span>
                                        <span v-else class="text-gray-400">
                                            Nicht vorhanden
                                        </span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div v-else>
                            <el-alert title="Keine Daten gefunden." center show-icon type="info" :closable="false" />
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </div>
            <div class="col-span-1">
                <div v-if="attachmentContent">
                    <iframe :src="attachmentContent" width="100%" height="600px"></iframe>
                </div>
                <div v-else>
                    <el-alert title="Kein Attachment gefunden." center show-icon type="info" :closable="false" />
                </div>
            </div>
        </div>
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

const openDocument = async (url: string) => {
    const loading = ElLoading.service({
        lock: true,
        text: 'Verarbeiten',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    try {
        const data = await $fetch('/api/binary', {
            method: 'GET',
            query: { id: url.substring(url.lastIndexOf('/') + 1) }
        })
        attachmentContent.value = `data:application/pdf;base64,${data.data}`
    } catch (err) {
        console.error('Failed to open document:', err)
        ElMessage.error({ message: 'Fehler beim Laden des Attachments!', placement: 'top-right', duration: 0, showClose: true });

    } finally {
        loading.close()
    }
}

</script>