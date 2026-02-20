import https from 'node:https'
import fs from 'node:fs'
import axios from 'axios'

export default defineEventHandler(async (event) => {
    console.log('Find Document References API called hahah')
    const config = useRuntimeConfig()

    const p12Path = config.keystorePath
    const caPath = config.truststorePath
    const base = config.public.eekpBase
    const endpoint = config.public.eekpFindDocumentReferenceEndpoint
    const fullUrl = `${base}${endpoint}`

    const body = await readBody(event) // Read the request body
    const token = body?.token || "" // Get token from request body, default to empty string if not provided

    console.log('Using Endpoint:', base)
    console.log("Endpoint Path:", endpoint)
    console.log("Full URL:", fullUrl)
   
    const httpsAgent = new https.Agent({
        pfx: fs.readFileSync(p12Path),
        passphrase: config.keystorePassword,
        ca: fs.readFileSync(caPath),
        rejectUnauthorized: true
    })

    try {
        const response = await axios.get(`${base}${endpoint}`, {
            httpsAgent,
            headers: {
                'Accept': 'application/fhir+json',
                'e-agw-client': 'zgf1',
                // Add the Bearer Token here
                'Authorization': `Bearer ${token}`
            }
        })

        // 3. JSON an das Nuxt Frontend zurückgeben
        console.log('Proxy Response Status:', response.status)
        return response.data

    } catch (error) {
    console.error('Proxy Error:', error)
    
    }
})