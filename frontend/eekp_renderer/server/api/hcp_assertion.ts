import https from 'node:https'
import fs from 'node:fs'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';

export default defineEventHandler(async (event) => {
    console.log('HCP Assertion called')
    const config = useRuntimeConfig()

    const p12Path = config.keystorePath
    const caPath = config.truststorePath

   
    const httpsAgent = new https.Agent({
        pfx: fs.readFileSync(p12Path),
        passphrase: config.keystorePassword,
        
        ca: fs.readFileSync(caPath),
    
        rejectUnauthorized: true
    })

    try {
        const response = await axios.get(`https://acs.k1.elga.dxc-austria.at/SpiritACS/STS/ETS`, {
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