import https from 'node:https'
import fs from 'node:fs'
import axios from 'axios'
import { getElgaAccessToken } from '../utils/elga_auth'

export default defineEventHandler(async (event) => {
    const params = getQuery(event)

    const id = params.identifier as string

    const config = useRuntimeConfig()

    const p12Path = config.keystorePath
    const caPath = config.truststorePath
    const base = config.public.eekpBase
    const endpoint = config.questionaireResponsesEndpoint
    let fullUrl = `${base}${endpoint}`

    if (id) {
        fullUrl += `?identifier=${encodeURIComponent(id)}`
    }

    const token = await getElgaAccessToken()



    const httpsAgent = new https.Agent({
        pfx: fs.readFileSync(p12Path),
        passphrase: config.keystorePassword,
        ca: fs.readFileSync(caPath),
        rejectUnauthorized: true
    })

    try {
        const response = await axios.get(`${fullUrl}`, {
            httpsAgent,
            headers: {
                'Accept': 'application/fhir+json',
                'e-agw-client': 'zgf1',
                // Add the Bearer Token here
                'Authorization': `Bearer ${token}`
            }
        })

        return response.data

    } catch (error) {
        console.error('Proxy Error:', error)

    }
})