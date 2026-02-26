<template>
    <div class="container">
        <header-section text="Questionnaire Response Details" />
        <BackButton path="/QuestionnaireResponses" />
        <Formrender :reference="questionnaire" :questionnaireMapping="questionnaireMapping" :initialFormValues="form"
            @submitEvent="submitCallback" />
    </div>
</template>
<script setup lang="ts">
import BackButton from '~/components/BackButton.vue';
import parse_questionnaire from '~/utils/parse_questionnaire';
import parse_questionnaire_rules from '~/utils/parse_questionnaire_rules';
import populate_questionnaire from '~/utils/populate_questionnaire';
import questionnaire_mapping from '~/utils/questionnaire_mapping';
import parseQuestionnaireFormBindings from '~/utils/parse_questionaire_form_bindingds';

const sharedData: any = useState('view-response-data')
const questionnaire = ref<any>({})
const questionnaireMapping = ref('')
const responseId = ref('')
const form = ref({})
const rules = ref({})

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
            const identifier = sharedData.value.resource?.identifier?.[0] ?? null;
            const identifierParam = `${identifier?.system ?? ''}|${identifier?.value ?? ''}`


            const foundMapping = questionnaire_mapping().find(q => q.questionnaireReference === sharedData.value.resource.questionnaire)
            questionnaireMapping.value = foundMapping.questionnaireReference

            const questionnaireReference = await $fetch(foundMapping?.url)

            questionnaire.value = parse_questionnaire(questionnaireReference)

            form.value = parseQuestionnaireFormBindingds(questionnaire.value.outer_item)
            form.value['identifier'] = identifier?.value
            rules.value = parse_questionnaire_rules(questionnaire.value.outer_item)

            const questionnaireResponse = sharedData.value

            responseId.value = sharedData.value.resource.id
            populate_questionnaire(form.value, questionnaireResponse.resource)
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
        const identifier = response.identifier?.[0] ?? null;
        const identifierParam = `${identifier?.system ?? ''}|${identifier?.value ?? ''}`
        response.id = responseId.value
        response.identifier = [identifier]

        const apiResponse = await $fetch('/api/questionnaires/update', {
            method: 'POST',
            query: {
                identifier: responseId.value
            },
            body: response
        });
        ElMessage.success({ message: 'Questionnaire Response wurde erfolgreich geändert!', placement: 'top-right', duration: 0, showClose: true });
        navigateTo('/QuestionnaireResponses/')
    } catch (apiError) {
        ElMessage.error({ message: 'Fehler beim Ändern der Questionnaire Response!', placement: 'top-right', duration: 0, showClose: true });
    } finally {
        loading.close()
    }
}
</script>