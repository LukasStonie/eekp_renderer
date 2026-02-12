/**
 * Maps flat form data to a hierarchical QuestionnaireResponse structure
 */
export function mapToFhirResponse(qItems: any[], flatData: any): any[] {
    const responseItems: any[] = [];

    for (const qItem of qItems) {
        // skip readOnly items (they don't have answers)
        if (qItem.readOnly) continue;
        
        const itemResponse: any = {
            linkId: qItem.linkId,
            text: qItem.text
        };

        const rawValue = flatData[qItem.linkId];
        let hasRealAnswer = false;

        // 1. Process Answer
        if (rawValue !== undefined && rawValue !== null && rawValue !== "") {
            // Handle arrays (checkboxes) - only count if not empty
            if (Array.isArray(rawValue) && rawValue.length === 0) {
                hasRealAnswer = false;
            } else {
                const formatted = formatAnswer(qItem, rawValue);
                if (formatted) {
                    itemResponse.answer = Array.isArray(formatted) ? formatted : [formatted];
                    hasRealAnswer = true;
                }
            }
        }

        // 2. Process Children
        if (qItem.item && qItem.item.length > 0) {
            const childResponses = mapToFhirResponse(qItem.item, flatData);
            
            if (childResponses.length > 0) {
                if (hasRealAnswer) {
                    itemResponse.answer[0].item = childResponses;
                } else {
                    itemResponse.item = childResponses;
                }
            }
        }

        // 3. Stricter Pruning: Check for actual answer array length or child items
        const hasAnswers = itemResponse.answer && itemResponse.answer.length > 0;
        const hasChildren = itemResponse.item && itemResponse.item.length > 0;

        if (hasAnswers || hasChildren) {
            responseItems.push(itemResponse);
        }
    }

    return responseItems;
}

/**
 * Maps JS types to FHIR value types with Coding lookup
 */
function formatAnswer(qItem: any, value: any) {
    const type = qItem.type;

    switch (type) {
        case 'choice':
            // If the item repeats (Checkbox group), value is an array of codes
            if (Array.isArray(value)) {
                return value.map(code => ({
                    valueCoding: findCodingByCode(qItem, code)
                }));
            }
            // Single selection (Radio/Select), value is a single code string
            return { valueCoding: findCodingByCode(qItem, value) };

        case 'boolean': 
            return { valueBoolean: Boolean(value) };
        case 'decimal': 
            return { valueDecimal: Number(value) };
        case 'integer': 
            return { valueInteger: Number(value) };
        case 'date':    
            return { valueDate: value };
        case 'time':    
            return { valueTime: value };
        default:        
            return { valueString: String(value) };
    }
}

/**
 * Re-hydrates a code string into a full FHIR Coding object { system, code, display }
 */
function findCodingByCode(qItem: any, code: string) {
    // Search the original Questionnaire blueprint for the matching option
    const option = qItem.answerOption?.find((o: any) => o.valueCoding.code === code);
    
    if (option) {
        return option.valueCoding; // Returns the full {system, code, display}
    }

    // Fallback if the code isn't found in answerOptions (shouldn't happen with valid data)
    return { code: code };
}