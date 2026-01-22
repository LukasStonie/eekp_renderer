export default function (questionaireItem: any) {
    const rules = reactive<any>({})

     questionaireItem.forEach((item: any) => {
        const itemKey = item.linkId
        const itemType = item.type
        let defaultValue = undefined

        switch(itemType){
            case "integer":
                defaultValue = 0
                break;
            case "string":
                defaultValue = ''
                break;
            case "choice":
                defaultValue = []
                break;
            case "date":
                defaultValue = new Date(Date.now()).toISOString().split('T')[0]
                break;
            case "time":
                defaultValue = "12:00"
                break;
            case "boolean":
                defaultValue = false
                break;
        }

        rules[itemKey] = defaultValue
     })

     return rules
}