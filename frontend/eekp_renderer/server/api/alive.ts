import https from 'node:https'
import fs from 'node:fs'
import axios from 'axios'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()

    const p12Path = config.keystorePath
    const caPath = config.truststorePath
    const base = config.eekpBase
    const endpoint = config.eekpAliveEndpoint
   
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

        return response.data

    } catch (error) {
    console.error('Proxy Error:', error)
    throw createError({
        statusCode: 502,
        statusMessage: 'Failed perform alive check'
    })
    }
})