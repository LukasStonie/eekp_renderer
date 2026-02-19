import https from 'node:https'
import fs from 'node:fs'
import axios from 'axios'

export default defineEventHandler(async (event) => {
    console.log('Alive Check API called hahah')
    const config = useRuntimeConfig()

    const p12Path = config.keystorePath
    const caPath = config.truststorePath
    const base = config.public.eekpBase
    const endpoint = config.public.eekpAliveEndpoint

    console.log('Using Endpoint:', base)
    console.log("Endpoint Path:", endpoint)
   
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
            'Accept': 'application/fhir+json'
            }
        })

        // 3. JSON an das Nuxt Frontend zurückgeben
        console.log('Proxy Response Status:', response.status)
        return response.data

    } catch (error) {
    console.error('Proxy Error:', error)
    throw createError({
        statusCode: 502,
        statusMessage: 'Failed perform alive check'
    })
    }
})