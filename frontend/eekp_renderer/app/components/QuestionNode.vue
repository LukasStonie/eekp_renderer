<template>
    <el-form-item :prop="item.linkId" label-width="auto" 
        v-if="isVisible">
        <template #label>
            <span class="inline-flex items-center gap-1">
                <span>{{ item.text }}</span>

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
            format="HH:mm" value-format="HH:mm" />

        <el-input-number v-else-if="item.type === 'integer'" v-model="form[item.linkId]" :disabled="item.readOnly">
            <template #suffix>{{ suffix }}</template>
        </el-input-number>

        <el-checkbox-group v-else-if="item.type === 'choice' && item.repeats && selectionType === 'check-box'" v-model="form[item.linkId]"
            :disabled="item.readOnly">
            <el-checkbox v-for="option in item.answerOption" :value="option.valueCoding.code">
                {{ option.valueCoding.display }}
            </el-checkbox>
        </el-checkbox-group>

        <el-radio-group v-else-if="item.type === 'choice' && !item.repeats && selectionType === 'radio-button'" v-model="form[item.linkId]"
            :disabled="item.readOnly">
            <el-radio v-for="option in item.answerOption" :value="option.valueCoding.code">
                {{ option.valueCoding.display }}
            </el-radio>
        </el-radio-group>

        <el-select v-else-if="item.type === 'choice' && item.repeats && selectionType === 'drop-down'" v-model="form[item.linkId]"
            :disabled="item.readOnly" placeholder="Bitte auswählen">
            <el-option v-for="option in item.answerOption" :key="option.valueCoding.code"
                :label="option.valueCoding.display" :value="option.valueCoding.code" />
        </el-select>

        <el-switch v-else-if="item.type === 'boolean'" v-model="form[item.linkId]" :disabled="item.readOnly"
            inline-prompt active-text="Ja" inactive-text="Nein" />

        <p v-else>Not supported type: {{ item.type }} {{ item.repeats }} {{ selectionType }}</p>
    </el-form-item>
    <QuestionNode v-for="subItem in subItems" :key="subItem.linkId" :item="subItem" :form="form"  />


    <!-- <p v-for="value in subItems.item">value</p> -->

</template>

<script lang="ts" setup>
import { computed } from 'vue'
import parse_enableWhen from '../utils/parse_enableWhen';

const props = defineProps(['item', 'form', 'level'])


const subItems = ref<any>(null);
const hint = ref<string>("");
const suffix = ref<String|null>(null)
const selectionType = ref<String|null>(null)

watch(() => props.item, (newItem) => {
    if (newItem?.extension) {
        console.log("Looking for suffix in", newItem.extension)
        let coding = newItem.extension?.find((ext: any) => ext?.valueCoding?.display);
        if (coding && coding?.valueCoding?.display) {
            suffix.value = coding.valueCoding.display;
            console.log("Found suffix:", suffix.value)
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



</script>