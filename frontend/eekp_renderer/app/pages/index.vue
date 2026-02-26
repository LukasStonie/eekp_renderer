<template>
  <div class="container mx-8 lg:mx-auto px-4">
    <header-section text="ElternKindPass" />

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 items-center">
      <div class="md:col-span-2">
        <h3 class="text-2xl font-bold text-gray-800 mb-3">Strukturierte Untersuchungsdaten</h3>
        <p class="text-gray-600 mb-6 leading-relaxed">
          Hier finden Sie Antworten aus den digitalen Fragebögen des Eltern-Kind-Passes. Diese Sektion
          ermöglicht das Anlegen und Bearbeiten von detaillierten medizinischen Informationen in einem standardisierten
          FHIR-Format. Dies umfasst die spezifischen Kapitel zur Geburt (Schwangere und Kind), die Postpartale Periode
          sowie den Zustand des Kindes bei Entlassung oder Transfer.
        </p>
        <NuxtLink to="/QuestionnaireResponses">
          <el-button color="#FBEF7A" size="large" class="font-semibold">
            Zu den Questionnaire Responses
          </el-button>
        </NuxtLink>
      </div>
      <div class="md:col-span-1 rounded-xl h-48 flex items-center justify-center ">
        <el-icon :size="120" color="#000000">
          <ElIconReading />
        </el-icon>
      </div>
    </div>

    <hr class="my-10 border-gray-200" />

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 items-center">
      <div class="md:col-span-1 order-last md:order-first rounded-xl h-48 flex items-center justify-center">
        <el-icon :size="120" color="#000000">
          <ElIconDocument />
        </el-icon>
      </div>
      <div class="md:col-span-2">
        <h3 class="text-2xl font-bold text-gray-800 mb-3">Dokumenten-Referenzen & Archiv</h3>
        <p class="text-gray-600 mb-6 leading-relaxed">
          In diesem Bereich werden die Metadaten zu archivierten Dokumenten und Befunden verwaltet.
          Während die Questionnaire Responses die Rohdaten enthalten, dienen Document References
          dazu, auf finale medizinische Berichte, PDFs oder externe Befunde im ELGA-Netzwerk
          zu verweisen und deren Status zu verfolgen.
        </p>
        <NuxtLink to="/DocumentReferences">
          <el-button color="#FBEF7A" size="large" class="font-semibold">
            Zu den Document References
          </el-button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import HeaderSection from '~/components/HeaderSection.vue'

const checkAliveSuccess = ref('red')

const checkAlive = async () => {
  try {
    const data = await $fetch('/api/alive')

    checkAliveSuccess.value = 'green'

  } catch (err) {
    checkAliveSuccess.value = 'red'
  }
}


</script>