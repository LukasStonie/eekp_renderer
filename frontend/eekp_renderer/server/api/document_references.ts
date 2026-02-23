import https from 'node:https'
import fs from 'node:fs'
import axios from 'axios'
import { getElgaAccessToken } from '../utils/elga_auth'

export default defineEventHandler(async (event) => {
    console.log('Find Document References API called hahah')
    const config = useRuntimeConfig()

    const p12Path = config.keystorePath
    const caPath = config.truststorePath
    const base = config.public.eekpBase
    const endpoint = config.public.eekpFindDocumentReferenceEndpoint
    const fullUrl = `${base}${endpoint}`

    console.log("Fetching ELGA Access Token...")
    const token = await getElgaAccessToken()
    console.log("ELGA Access Token obtained:", token.substring(0, 20) + '...') // Log the first 20 characters for debugging

    console.log('Using Endpoint:', base)
    console.log("Endpoint Path:", endpoint)
    console.log("Full URL:", fullUrl)

    const httpsAgent = new https.Agent({
        pfx: fs.readFileSync(p12Path),
        passphrase: config.keystorePassword,
        ca: fs.readFileSync(caPath),
        rejectUnauthorized: true
    })


    axios.interceptors.request.use(request => {
        console.log('Starting Request', JSON.stringify({
            method: request.method,
            url: request.url,
            headers: request.headers,
            data: request.data
        }, null, 2))
        return request
    })  

    try {
        const response = await axios.get(`${base}${endpoint}`, {
            httpsAgent,
            headers: {
                'Accept': 'application/fhir+json',
                'e-agw-client': 'zgf1',
                // Add the Bearer Token here
                'Authorization': `Bearer ${token}`
            },
            params: {
                patient: config.patientId
            }
        })

        // 3. JSON an das Nuxt Frontend zurückgeben
        console.log('Proxy Response Status:', response.status)
        return response.data

    } catch (error) {
        console.error('Proxy Error:', error)

    }
})