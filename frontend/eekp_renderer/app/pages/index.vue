<template>
  <header-section text="ElternKindPass" />

  <main class="container md:mx-auto px-8 xl:px-4 py-8 max-w-6xl">

    <div class="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12 items-center">
      <div class="md:col-span-2 text-center md:text-left">
        <h3 class="text-xl md:text-2xl font-bold text-gray-800 mb-3">
          Strukturierte Untersuchungsdaten
        </h3>
        <p class="text-gray-600 mb-6 leading-relaxed text-sm md:text-base text-justify">
          Hier finden Sie Antworten aus den digitalen Fragebögen des Eltern-Kind-Passes. Diese Sektion
          ermöglicht das Anlegen und Bearbeiten von detaillierten medizinischen Informationen in einem standardisierten
          FHIR-Format. Dies umfasst die spezifischen Kapitel zur Geburt (Schwangere und Kind), die Postpartale Periode
          sowie den Zustand des Kindes bei Entlassung oder Transfer.
        </p>
        <NuxtLink to="/QuestionnaireResponses">
          <el-button color="#FBEF7A" size="large" class="font-semibold w-full md:w-auto">
            Zu den Questionnaire Responses
          </el-button>
        </NuxtLink>
      </div>

      <div class="md:col-span-1 flex items-center justify-center order-first md:order-last">
        <div class="bg-gray-50 p-6 rounded-full md:bg-transparent">
          <el-icon :size="80" class="md:!size-[120px]" color="#000000">
            <ElIconReading />
          </el-icon>
        </div>
      </div>
    </div>

    <hr class="my-12 border-gray-100" />

    <div class="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
      <div class="md:col-span-1 flex items-center justify-center">
        <div class="bg-gray-50 p-6 rounded-full md:bg-transparent">
          <el-icon :size="80" class="md:!size-[120px]" color="#000000">
            <ElIconDocument />
          </el-icon>
        </div>
      </div>

      <div class="md:col-span-2 text-center md:text-left">
        <h3 class="text-xl md:text-2xl font-bold text-gray-800 mb-3">
          Dokumenten-Referenzen & Archiv
        </h3>
        <p class="text-gray-600 mb-6 leading-relaxed text-sm md:text-base text-justify">
          In diesem Bereich werden die Metadaten zu archivierten Dokumenten und Befunden verwaltet.
          Während die Questionnaire Responses die Rohdaten enthalten, dienen Document References
          dazu, auf finale medizinische Berichte, PDFs oder externe Befunde im ELGA-Netzwerk
          zu verweisen und deren Status zu verfolgen.
        </p>
        <NuxtLink to="/DocumentReferences">
          <el-button color="#FBEF7A" size="large" class="font-semibold w-full md:w-auto">
            Zu den Document References
          </el-button>
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import HeaderSection from '~/components/HeaderSection.vue'

</script>