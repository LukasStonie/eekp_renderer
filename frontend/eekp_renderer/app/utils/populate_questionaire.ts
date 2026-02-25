export default function mapResponseToForm(form: any, questionnaireResponse: any) {
    // Helper function to process items recursively
    const processItems = (items: any[]) => {
        if (!items || !Array.isArray(items)) return;

        items.forEach((responseItem: any) => {
            const linkId = responseItem.linkId;
            const answer = responseItem.answer;

            // 1. Process Answer if it exists
            if (answer && answer.length > 0) {
                if (answer.length > 1) {
                    // Map multiple entries (e.g., checkboxes)
                    form[linkId] = answer.map((a: any) => extractValue(a));
                } else {
                    // Map single entry
                    form[linkId] = extractValue(answer[0]);
                }
            }

            // 2. Recursive Step: Check for nested items (Groups)
            if (responseItem.item) {
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
               a.valueCoding?.code ?? 
               null;
    };

    // Start processing from the top-level items
    if (questionnaireResponse?.item) {
        processItems(questionnaireResponse.item);
    }
}