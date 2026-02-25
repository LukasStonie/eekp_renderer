import https from 'node:https'
import fs from 'node:fs'
import axios from 'axios'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const questionairePath = config.birthQuestionairePath

    const questionaireContent = fs.readFileSync(questionairePath, 'utf-8')
    const questionaireJson = JSON.parse(questionaireContent)

    return questionaireJson
})