<template>
    <h2 v-if="item.type === 'group'" class="text-1xl font-semibold text-gray-700 mt-8 mb-4">{{ item.text }}</h2>
    <el-form-item :prop="item.linkId" label-width="auto" v-if="isVisible && item.type !== 'group'" :style="indentStyle"
        style="max-width: 800px;">
        <template #label>
            <span class="inline-flex items-center gap-1">
                <span class="text-1xl font-semibold text-gray-700">{{ item.text }} ({{ item.linkId }})</span>

                <el-tooltip v-if="hint" :content="hint" placement="right">
                    <el-icon class="cursor-help text-blue-500">
                        <ElIconQuestionFilled />
                    </el-icon>
                </el-tooltip>
            </span>
        </template>

        <el-input v-if="item.type === 'string'" v-model="form[item.linkId]" :disabled="item.readOnly" />

        <el-date-picker v-else-if="item.type === 'date'" type="date" v-model="form[item.linkId]"
            :disabled="item.readOnly" format="DD.MM.YYYY" value-format="YYYY-MM-DD" />

        <el-time-picker v-else-if="item.type === 'time'" v-model="form[item.linkId]" :disabled="item.readOnly"
            format="HH:mm:ss" value-format="HH:mm:ss" />

        <el-input-number v-else-if="item.type === 'integer'" v-model.number="form[item.linkId]"
            :disabled="item.readOnly" />

        <el-input-number v-else-if="item.type === 'decimal'" v-model.number="form[item.linkId]" :precision="2"
            :step="0.1" :disabled="item.readOnly" />

        <el-checkbox-group v-else-if="item.type === 'choice' && (item.repeats || selectionType === 'check-box')"
            v-model="form[item.linkId]" :disabled="item.readOnly" size="default" fill="#FBEF7A" text-color="#030301">
            <el-checkbox-button v-for="option in item.answerOption" :value="option.valueCoding.code">
                {{ option.valueCoding.display }}
            </el-checkbox-button>
        </el-checkbox-group>

        <el-radio-group v-else-if="item.type === 'choice' && selectionType === 'radio-button'"
            v-model="form[item.linkId]" :disabled="item.readOnly" size="default" fill="#FBEF7A" text-color="#030301">
            <el-radio-button v-for="option in item.answerOption"
                :value="option.valueCoding.code ?? option.valueCoding.display" :label="option.valueCoding.display" />
            <el-radio-button :value="''">Nicht gesetzt</el-radio-button>
        </el-radio-group>

        <el-select v-else-if="item.type === 'choice' && selectionType === 'drop-down'" v-model="form[item.linkId]"
            :disabled="item.readOnly" placeholder="Bitte auswählen">
            <el-option label="Nicht gesetzt" :value="''" />
            <el-option v-for="option in item.answerOption" :key="option.valueCoding.code"
                :label="option.valueCoding.display" :value="option.valueCoding.code ?? option.valueCoding.display" />
        </el-select>



        <!-- <el-switch v-else-if="item.type === 'boolean'" v-model="form[item.linkId]" :disabled="item.readOnly"
            inline-prompt active-text="Ja" inactive-text="Nein" /> -->

        <el-radio-group v-else-if="item.type === 'boolean'" v-model="form[item.linkId]" :disabled="item.readOnly"
            size="default" fill="#FBEF7A" text-color="#030301">
            <el-radio-button :value="true">Ja</el-radio-button>
            <el-radio-button :value="false">Nein</el-radio-button>
            <el-radio-button :value="undefined">Nicht gesetzt</el-radio-button>
        </el-radio-group>


        <p v-else>Not supported type: {{ item.type }} {{ item.repeats }} {{ selectionType }}</p>
        <span v-if="suffix" class="unit-addon">{{ suffix }}</span>

        <el-checkbox v-if="item?.readOnly !== undefined" class="ml-3" v-model="item.readOnly" label="Readonly"
            size="small" />

    </el-form-item>

    <QuestionNode v-for="subItem in subItems" :key="subItem.linkId" :item="subItem" :form="form"
        :level="props.level + 1" />


</template>

<script lang="ts" setup>
import { computed } from 'vue'
import parse_enableWhen from '../utils/parse_enableWhen';
import { get } from 'node:http';
import { el } from 'element-plus/es/locales.mjs';

const props = defineProps(['item', 'form', 'level'])


const subItems = ref<any>(null);
const hint = ref<string>("");
const suffix = ref<String | null>(null)
const selectionType = ref<String | null>(null)
const indentStyle = computed(() => {
    if (props.level === undefined) {
        return {};
    }
    else if (props.item.type === 'group') {
        return {
            'margin-left': `${(props.level + 1) * 20}px`,
            'border-left': '2px solid #3e65b3',
            'padding-left': '10px',
        }
    }
    else {
        return {
            'margin-left': `${(props.level) * 20}px`,
        }
    }
});

watch(() => props.item, (newItem) => {
    if (newItem?.extension) {
        let coding = newItem.extension?.find((ext: any) => ext?.valueCoding?.display);
        if (coding && coding?.valueCoding?.display) {
            suffix.value = coding.valueCoding.display;
        }

        let selectionTypeExt = newItem.extension?.find((ext: any) => ext.url === "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl");
        if (selectionTypeExt && selectionTypeExt?.valueCodeableConcept?.coding) {
            selectionType.value = selectionTypeExt.valueCodeableConcept.coding[0].code;
        }
    }


    if (newItem?.item) {
        let tmpSubItems: any[] = [];
        newItem.item.forEach((subItem: any) => {
            if (subItem?.type === 'display' && subItem?.extension) {
                let hintExtension = subItem?.extension.find((ext: any) => ext.valueCodeableConcept.text === "Help-Button");
                if (hintExtension && subItem?.text) {
                    hint.value = subItem.text;
                }
            }
            else {
                tmpSubItems.push(subItem);
            }
        });
        subItems.value = tmpSubItems;
    }


}, { immediate: true });





const isVisible = computed(() => {
    if (props.item?.enableWhen) {
        return parse_enableWhen(props.item.enableWhen, props.form, props.item.enableBehavior);
    }
    return true;
});


watch(isVisible, (newVisibility) => {
    if (!newVisibility) {
        // When the question is hidden, reset its value in the flat form

        // Use null or empty string depending on your FHIR requirement
        // Setting it to undefined/null is usually best for the flat model
        props.form[props.item.linkId] = undefined;

        // If it's a checkbox/multi-select, you might want an empty array
        if (props.item.repeats || props.item.type === 'choice' && selectionType.value === 'check-box') {
            props.form[props.item.linkId] = [];
        }
    }
});



</script>