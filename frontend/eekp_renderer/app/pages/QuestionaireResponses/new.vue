<template>
    <div class="container">
        <header-section :text="questionaire?.title ?? ''" />
        <BackButton path="/QuestionaireResponses" />
        <Formrender :reference="questionaire" :questionaireMapping="questionaireMapping"
            @submitEvent="submitCallback" />
    </div>
</template>

<script setup lang="ts">
import Formrender from '~/components/formrender.vue';
import parse_questionaire from '~/utils/parse_questionaire';
import { ElLoading } from 'element-plus'
import { Loading } from '@element-plus/icons-vue';


const sharedData: any = useState('create-data')
const questionaire = ref()
const questionaireMapping = ref()
// Best Practice: Redirect back if the data is missing (e.g., on a hard refresh)
onMounted(async () => {
    if (!sharedData.value) {
        navigateTo('/QuestionaireResponses')
    }
    else {
        const loading = ElLoading.service({
            lock: true,
            text: 'Verarbeiten',
            background: 'rgba(0, 0, 0, 0.7)',
        })
        try {
            const data = await $fetch(sharedData.value.url)
            questionaire.value = parse_questionaire(data)
            questionaireMapping.value = sharedData.value.questionaireReference
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
        questionaire.value = parse_questionaire(data)
        questionaireMapping.value = newData.questionaireReference
    }
})

const submitCallback = async (response: any) => {
    const loading = ElLoading.service({
        lock: true,
        text: 'Verarbeiten',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    try {
        console.log(response)
        const apiResponse = await $fetch('/api/create_questionaire_response', {
            method: 'POST',
            body: response
        });
        ElMessage.success({ message: `Questionnaire Response wurde erfolgreich erstellt! (${response?.identifier?.[0]?.value})`, placement: 'top-right', duration: 0, showClose: true });
        navigateTo('/QuestionaireResponses/')
    } catch (apiError) {
        ElMessage.error({ message: 'Fehler beim Erstellen der Questionnaire Response!', placement: 'top-right', duration: 0, showClose: true });
    } finally {
        loading.close()
    }
}
</script>