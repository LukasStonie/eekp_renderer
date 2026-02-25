<template>
    <div class="container">
        <header-section text="Questionaire Response Details" />
        <BackButton path="/QuestionaireResponses" />
        <Formrender :reference="questionaire" :questionaireMapping="questionnaireMapping" :initialFormValues="form"
            @submitEvent="submitCallback" />
    </div>
</template>
<script setup lang="ts">
import BackButton from '~/components/BackButton.vue';
import parse_questionaire from '~/utils/parse_questionaire';
import parse_questionaire_rules from '~/utils/parse_questionaire_rules';
import populate_questionaire from '~/utils/populate_questionaire';
import questionaire_mapping from '~/utils/questionaire_mapping';

const sharedData: any = useState('view-response-data')
const questionaire = ref<any>({})
const questionnaireMapping = ref('')
const responseId = ref('')
const form = ref({})
const rules = ref({})

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
            const identifier = sharedData.value.resource?.identifier?.[0] ?? null;
            const identifierParam = `${identifier?.system ?? ''}|${identifier?.value ?? ''}`


            const foundMapping = questionaire_mapping().find(q => q.questionaireReference === sharedData.value.resource.questionnaire)
            console.log(foundMapping)
            questionnaireMapping.value = foundMapping.questionaireReference
            console.log(questionnaireMapping.value)

            const questionaireReference = await $fetch(foundMapping?.url)

            questionaire.value = parse_questionaire(questionaireReference)
            console.log(questionaire.value)
            form.value = parseQuestionaireFormBindingds(questionaire.value.outer_item)
            form.value['identifier'] = identifier?.value
            rules.value = parse_questionaire_rules(questionaire.value.outer_item)

            const questionnaireResponse = sharedData.value
            console.log(questionnaireResponse)
            responseId.value = sharedData.value.resource.id
            populate_questionaire(form.value, questionnaireResponse.resource)
        } catch (err) {
            ElMessage.error({ message: 'Fehler beim Laden der benötigten Daten!', placement: 'top-right', duration: 0, showClose: true });
        } finally {
            loading.close()
        }


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
        console.log("ResposneId", responseId.value)
        const identifier = response.identifier?.[0] ?? null;
        const identifierParam = `${identifier?.system ?? ''}|${identifier?.value ?? ''}`
        response.id = responseId.value
        response.identifier = [identifier]

        console.log("Response: ", response)

        const apiResponse = await $fetch('/api/update_questionaire_response', {
            method: 'POST',
            query: {
                identifier: responseId.value
            },
            body: response
        });
        ElMessage.success({ message: 'Questionnaire Response wurde erfolgreich geändert!', placement: 'top-right', duration: 0, showClose: true });
        navigateTo('/QuestionaireResponses/')
    } catch (apiError) {
        ElMessage.error({ message: 'Fehler beim Ändern der Questionnaire Response!', placement: 'top-right', duration: 0, showClose: true });
    } finally {
        loading.close()
    }
}
</script>