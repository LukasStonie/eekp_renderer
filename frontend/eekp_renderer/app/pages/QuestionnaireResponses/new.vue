<template>
    <header-section :text="questionnaire?.title ?? ''" />

    <div class="container md:mx-auto px-8 xl:px-4 max-w-6xl">
        <BackButton path="/QuestionnaireResponses" />
        <Formrender :editIdentifier="true" :reference="questionnaire" :questionnaireMapping="questionnaireMapping"
            @submitEvent="submitCallback" />
    </div>
</template>

<script setup lang="ts">
import Formrender from '~/components/formrender.vue';
import parse_questionnaire from '~/utils/parse_questionnaire';
import { ElLoading } from 'element-plus'
import { Loading } from '@element-plus/icons-vue';


const sharedData: any = useState('create-data')
const questionnaire = ref()
const questionnaireMapping = ref()
// Best Practice: Redirect back if the data is missing (e.g., on a hard refresh)
onMounted(async () => {
    if (!sharedData.value) {
        navigateTo('/QuestionnaireResponses')
    }
    else {
        const loading = ElLoading.service({
            lock: true,
            text: 'Verarbeiten',
            background: 'rgba(0, 0, 0, 0.7)',
        })
        try {
            const data = await $fetch(sharedData.value.url)
            questionnaire.value = parse_questionnaire(data)
            questionnaireMapping.value = sharedData.value.questionnaireReference
        } catch (err) {
            ElMessage.error({ message: 'Fehler beim Laden der benötigten Daten!', placement: 'top-right', duration: 0, showClose: true });
        } finally {
            loading.close()
        }

    }
})
watch(sharedData, async (newData) => {
    if (newData) {
        const data = await $fetch(newData.url)
        questionnaire.value = parse_questionnaire(data)
        questionnaireMapping.value = newData.questionnaireReference
    }
})

const submitCallback = async (response: any) => {
    const loading = ElLoading.service({
        lock: true,
        text: 'Verarbeiten',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    try {
        const apiResponse = await $fetch('/api/questionnaires/create', {
            method: 'POST',
            body: response
        });
        ElMessage.success({ message: `Questionnaire Response wurde erfolgreich erstellt! (${response?.identifier?.[0]?.value ?? response?.identifier?.value ?? null})`, placement: 'top-right', duration: 0, showClose: true });
        navigateTo('/QuestionnaireResponses/')
    } catch (apiError) {
        ElMessage.error({ message: 'Fehler beim Erstellen der Questionnaire Response!', placement: 'top-right', duration: 0, showClose: true });
    } finally {
        loading.close()
    }
}
</script>