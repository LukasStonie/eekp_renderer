import https from 'node:https'
import fs from 'node:fs'
import axios from 'axios'

export default defineEventHandler(async (event ) => {
    
    const query = getQuery(event)
    const fileName = query.file as string

    console.log('Questionaire file called with file:', fileName)

    const questionaireContent = fs.readFileSync(fileName, 'utf-8')
    if (!questionaireContent) {
        throw createError({
            statusCode: 404,
            message: `File not found: ${fileName}`
        })
    }
    const questionaireJson = JSON.parse(questionaireContent)

    return questionaireJson
})