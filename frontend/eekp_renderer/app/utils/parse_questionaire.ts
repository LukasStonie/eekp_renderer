export default function (quest: any) {
    const title = quest.title
    const description = quest.description
    const outer_item:[any] = quest.item

    return {
        title,
        description,
        outer_item
    }
}