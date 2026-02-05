<template>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div class="p-4">
            <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
                <el-form-item v-for="item in questionaireData" :label="item.text" :prop="item.linkId"
                    :rules="rules[item.linkId]" label-width="auto" style="max-width: 600px">

                    <el-input v-if="item.type === 'string'" v-model="form[item.linkId]" :disabled="item.readOnly" />

                    <el-date-picker v-else-if="item.type === 'date'" type="date" v-model="form[item.linkId]"
                        :disabled="item.readOnly" format="DD.MM.YYYY" value-format="YYYY-MM-DD" />

                    <el-time-picker v-else-if="item.type === 'time'" v-model="form[item.linkId]"
                        :disabled="item.readOnly" format="HH:mm" value-format="HH:mm" />

                    <el-input-number v-else-if="item.type === 'integer'" v-model="form[item.linkId]"
                        :disabled="item.readOnly" />

                    <el-checkbox-group v-else-if="item.type === 'choice' && item.repeats" v-model="form[item.linkId]"
                        :disabled="item.readOnly">
                        <el-checkbox v-for="option in item.answerOption" :value="option.valueCoding.display">
                            {{ option.valueCoding.display }}
                        </el-checkbox>
                    </el-checkbox-group>

                    <el-radio-group v-else-if="item.type === 'choice' && !item.repeats" v-model="form[item.linkId]"
                        :disabled="item.readOnly">
                        <el-radio v-for="option in item.answerOption" :value="option.valueCoding.code">
                            {{ option.valueCoding.display }}
                        </el-radio>
                    </el-radio-group>

                    <el-switch v-else-if="item.type === 'boolean'" v-model="form[item.linkId]" :disabled="item.readOnly"
                        inline-prompt active-text="Ja" inactive-text="Nein" />

                    <template #error="{ error }">
                        <div class="w-full flex mt-1">

                            <div
                                class="w-fit flex items-center text-rose-600 bg-rose-50 p-2 rounded border border-rose-100 shadow-sm">

                                <svg class="h-4 w-4 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                        clip-rule="evenodd" />
                                </svg>

                                <span class="text-sm font-medium pr-1">
                                    {{ error }}
                                </span>

                            </div>

                        </div>
                    </template>

                </el-form-item>
                <el-form-item>
                    <el-button type="primary">Erstellen</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="bg-green-100 p-4">
            <p>{{ form }}</p>
            <p>{{ rules }}</p>
        </div>

    </div>


</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import { el } from 'element-plus/es/locales.mjs';
import parse_questionaire_form_bindingds from '~/utils/parse_questionaire_form_bindingds';
import parse_questionaire_rules from '~/utils/parse_questionaire_rules';

const props = defineProps([
    'questionaireData'
])

const formRef = ref<FormInstance>()
const form = ref<any>({})
const rules = ref<FormRules<any>>({})

watch(() => props.questionaireData, (newData) => {
    if (newData) {
        console.log(newData)

        const formVals = parse_questionaire_form_bindingds(newData)
        form.value = formVals
        console.log(formVals)
        const parsedRules = parse_questionaire_rules(newData)
        rules.value = parsedRules
        console.log(parsedRules)
    }
})


</script>