import type { FormRules } from 'element-plus'

export default function (questionaireItem: any) {
    console.log('Parsing Questionaire Rules')
    console.log(questionaireItem)

    const rules = reactive<FormRules<any>>({})

    const walk = (items: any[]) => {
        items.forEach((item: any) => {
            const itemKey = item.linkId;
            const text = item.text;
            let currentRule = [];

            // 1. Determine the expected type based on the FHIR item type
            // Element Plus / async-validator needs this to avoid the "is not a string" error
            let validatorType: 'string' | 'number' | 'array' | 'boolean' = 'string';

            if (item.type === 'integer' || item.type === 'decimal') validatorType = 'number';
            if (item.type === 'boolean') validatorType = 'boolean';
            if (item.repeats) validatorType = 'array'; // if it's a checkbox group or multi-select

            // 2. Add Required Rule
            if (item.required) {
                if (item.type === 'boolean') {
                    currentRule.push({
                        type: 'enum',
                        enum: [true, false],
                        required: true,
                        message: `${text} ist verpflichtend`,
                        trigger: 'change'
                    });
                }
                else{
                currentRule.push({
                    type: validatorType,
                    required: true,
                    message: `${text} ist verpflichtend`,
                    trigger: 'change'
                });}
            }

            // 3. Add Range Rules (Numeric)
            if (item.extension) {
                const minExt = item.extension.find((e: any) => e.url.includes("minValue"));
                const maxExt = item.extension.find((e: any) => e.url.includes("maxValue"));

                const minV = minExt ? (minExt.valueInteger ?? minExt.valueDecimal) : null;
                const maxV = maxExt ? (maxExt.valueInteger ?? maxExt.valueDecimal) : null;

                if (minV !== null || maxV !== null) {
                    currentRule.push({
                        type: 'number' as const, // Explicitly force number validation
                        min: minV !== null ? minV : undefined,
                        max: maxV !== null ? maxV : undefined,
                        message: `${text} muss zwischen ${minV ?? 0} und ${maxV ?? '∞'} sein`,
                        trigger: 'change'
                    });
                }
            }
            // Assign the value if a key exists
            if (itemKey) {
                console.log(`Adding rules for ${itemKey}:`, currentRule)
                rules[itemKey] = currentRule;
            }


            if (item.item && Array.isArray(item.item)) {
                walk(item.item)
            }
        })
    }

    walk(questionaireItem)
    console.log('Generated Rules:', rules)
    return rules
}