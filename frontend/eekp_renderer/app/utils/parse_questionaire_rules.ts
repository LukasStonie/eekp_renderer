import type { FormRules } from 'element-plus'

export default function (questionaireItem: any) {
    console.log('Parsing Questionaire Rules')

    const rules = reactive<FormRules>({})

    // Iterate through each item in the questionaire
    questionaireItem.forEach((item: any) => {

        // Extract relevant properties
        const itemKey = item.linkId
        const text = item.text

        // Define temporary rule array
        let currentRule = []

        // Parse rules based on item properties

        // Check if the item is required
        if (item.required) {
            currentRule.push({ required: true, message: `${text} is required`, trigger: 'change' })
        }

        // Check for maxLength constraint
        if (item.maxLength) {
            currentRule.push({ max: item.maxLength, message: `${text} exceeds maximum length`, trigger: 'change' })
        }

        // Check for minValue and maxValue constraints in extensions
        if (item.extension) {
            
            // Define min and max values
            let minValue: number | null = null
            let maxValue: number | null = null

            // Check each extension for minValue and maxValue
            item.extension?.forEach((ext: any) => {
                const maxValuePresent = item.extension.some((e: any) => e.url.includes("maxValue"))
                const minValuePresent = item.extension.some((e: any) => e.url.includes("minValue"))

                if (minValuePresent) {
                    minValue = ext.valueInteger
                }
                else if (maxValuePresent) {
                    maxValue = ext.valueInteger
                }
            })

            // Build rules based on found min and max values
            // if both are present
            if (minValue !== null && maxValue !== null) {
                currentRule.push({ min: minValue, max: maxValue, message: `${text} must be between ${minValue} and ${maxValue}`, trigger: 'change' })
            }
            // if only min is present
            else if (minValue !== null) {
                currentRule.push({ min: minValue, message: `${text} must be at least ${minValue}`, trigger: 'change' })
            }
            // if only max is present
            else if (maxValue !== null) {
                currentRule.push({ max: maxValue, message: `${text} must be at most ${maxValue}`, trigger: 'change' })
            }
        }

        rules[itemKey] = currentRule
    })
}