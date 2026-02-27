import https from 'node:https'
import fs from 'node:fs'
import axios from 'axios'
import { getElgaAccessToken } from '../utils/elga_auth'

export default defineEventHandler(async (event) => {
    const params = getQuery(event)

    const config = useRuntimeConfig()

    const p12Path = config.keystorePath
    const caPath = config.truststorePath
    const base = config.eekpBase
    const endpoint = config.fhirEndpoint 
    const fullUrl = `${base}${endpoint}${params.resource as string}`

    const token = await getElgaAccessToken()



    const httpsAgent = new https.Agent({
        pfx: fs.readFileSync(p12Path),
        passphrase: config.keystorePassword,
        ca: fs.readFileSync(caPath),
        rejectUnauthorized: true
    })
    console.log("Requested resource: ",fullUrl)
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