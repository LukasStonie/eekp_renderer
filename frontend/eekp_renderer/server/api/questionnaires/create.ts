import https from 'node:https'
import fs from 'node:fs'
import axios from 'axios'
import { getElgaAccessToken } from '../../utils/elga_auth'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const questionnaireResponse = body

    const config = useRuntimeConfig()

    const p12Path = config.keystorePath
    const caPath = config.truststorePath
    const base = config.eekpBase
    const endpoint = config.questionnaireResponsesEndpoint
    const fullUrl = `${base}${endpoint}`

    const token = await getElgaAccessToken()



    const httpsAgent = new https.Agent({
        pfx: fs.readFileSync(p12Path),
        passphrase: config.keystorePassword,
        ca: fs.readFileSync(caPath),
        rejectUnauthorized: true
    })
        
    try {
        const response = await axios.post(`${fullUrl}`, questionnaireResponse,
            {
                httpsAgent,
                headers: {
                    'Content-Type': 'application/fhir+json',
                    'Accept': 'application/fhir+json',
                    'Authorization': `Bearer ${token}`,
                    'e-agw-client': 'zgf1',
                },
    // This ensures the data is sent exactly as a raw string
    transformRequest: [(data) => {
        return JSON.stringify(data);
    }]
            })

        return response.data

    } catch (error) {
        console.error('Proxy Error:', error)
        throw createError({
            statusCode: 502,
            statusMessage: 'Failed to create QuestionnaireResponse'
        })
    }
})