export default function (quest: any) {
    console.log('Parsing Questionaire')
    const title = quest.title
    const description = quest.description
    const outer_item:[any] = quest.item

    /* console.log('Parsed Questionaire:', {title, description, outer_item})*/

    return {
        title,
        description,
        outer_item
    }
}