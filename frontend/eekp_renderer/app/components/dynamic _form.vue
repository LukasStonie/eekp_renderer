<template>
    <el-form :model="form">
        <el-form-item
            v-for="item in questionaireData"
            :label="item.text"
            label-width="auto" style="max-width: 600px"> 

            <el-input v-if="item.type === 'string'" 
                v-model="form.name" 
                :disabled="item.readOnly"/>

            <el-date-picker v-else-if="item.type === 'date'" 
                type="date" v-model="form.name" 
                :disabled="item.readOnly"
                format="dd.MM.YYYY"/>

            <el-time-picker v-else-if="item.type === 'time'" 
                v-model="form.name" 
                :disabled="item.readOnly" />

            <el-input-number v-else-if="item.type === 'integer'" 
                v-model="form.name" 
                :disabled="item.readOnly" />

            <el-checkbox-group v-else-if="item.type === 'choice' && item.repeats" 
                v-model="form.type" 
                :disabled="item.readOnly">
                <el-checkbox v-for="option in item.answerOption" name="type">
                    {{option.valueCoding.display}}
                </el-checkbox>
            </el-checkbox-group>

            <el-radio-group v-else-if="item.type === 'choice' && !item.repeats" 
                v-model="form.resource" 
                :disabled="item.readOnly">
                <el-radio v-for="option in item.answerOption" :value="option.valueCoding.code">
                    {{option.valueCoding.display}}
                </el-radio>
            </el-radio-group>

            <el-switch v-else-if="item.type === 'boolean'" 
                v-model="form.istrue" 
                :disabled="item.readOnly"
                inline-prompt
                active-text="Ja"
                inactive-text="Nein"
                />

        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import { el } from 'element-plus/es/locales.mjs';

const props = defineProps([
  'questionaireData'
])
const form = reactive({
    name: '',
    type:[],
    resource: '',
    istrue: false
})
</script>