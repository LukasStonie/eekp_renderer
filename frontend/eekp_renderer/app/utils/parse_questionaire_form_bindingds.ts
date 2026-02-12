export default function parseQuestionaireFormBindings(questionaireItems: any[]) {
    const values = reactive<any>({})

    // Define a helper function to perform the recursion
    const walk = (items: any[]) => {
        items.forEach((item: any) => {
            const itemKey = item.linkId
            const itemType = item.type
            let defaultValue = undefined

            // 1. Process the current item
            if (itemType === "integer") {
                defaultValue = 0;
            } 
            else if (itemType === "decimal") {
                defaultValue = 0.00;
            }
            else if (itemType === "string") {
                defaultValue = '';
            } else if (itemType === "choice") {
                defaultValue = item.repeats ? [] : '';
            } else if (itemType === "date") {
                defaultValue = new Date().toISOString().split('T')[0];
            } else if (itemType === "time") {
                defaultValue = "12:00";
            } else if (itemType === "boolean") {
                defaultValue = undefined;
            }

            // Assign the value if a key exists
            if (itemKey) {
                values[itemKey] = defaultValue;
            }

            // 2. RECURSION: If this item has nested sub-items, walk through them
            if (item.item && Array.isArray(item.item)) {
                walk(item.item);
            }
        });
    }

    // Start the process
    walk(questionaireItems);

    return values;
}