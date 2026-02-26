export default function mapResponseToForm(form: any, questionnaireResponse: any) {
    const processItems = (items: any[]) => {
        if (!items || !Array.isArray(items)) return;

        items.forEach((responseItem: any) => {
            const linkId = responseItem.linkId;
            const answer = responseItem.answer;

            // 1. Process Answer if it exists
            if (answer && Array.isArray(answer) && answer.length > 0) {
                if (answer.length > 1 || Array.isArray(form[linkId])) {
                    // Map multiple entries (e.g., checkboxes)
                    form[linkId] = answer.map((a: any) => extractValue(a));
                } else {
                    // Map single entry
                    form[linkId] = extractValue(answer[0]);
                }

                // CHECK NESTED ITEMS INSIDE ANSWERS
                // This is where your previous code crashed. 
                // We iterate over 'answer' itself, not 'answer.array'.
                answer.forEach(a => {
                    if (a.item && Array.isArray(a.item)) {
                        console.log("Parsing nested items found in answer", a.item);
                        processItems(a.item);
                    }
                });
            }

            // 2. Recursive Step: Check for nested items directly on the item (Groups)
            if (responseItem.item && Array.isArray(responseItem.item)) {
                processItems(responseItem.item);
            }
        });
    };

    // Helper to extract the specific value[Type] from a FHIR answer object
    const extractValue = (a: any) => {
        return a.valueString ??
            a.valueInteger ??
            a.valueDecimal ??
            a.valueBoolean ??
            a.valueDate ??
            a.valueTime ??
            a.valueCoding?.code ?? a.valueCoding?.display ??
            null;
    };

    // Start processing from the top-level items
    if (questionnaireResponse?.item) {
        processItems(questionnaireResponse.item);
    }
}