import https from 'node:https'
import fs from 'node:fs'
import axios from 'axios'
import { getElgaAccessToken } from '../utils/elga_auth'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const questionaireResponse = body

    console.log("Body", body)

    const query = getQuery(event);
    const identifier = query.identifier

    const config = useRuntimeConfig()

    const p12Path = config.keystorePath
    const caPath = config.truststorePath
    const base = config.public.eekpBase
    const endpoint = config.questionaireResponsesEndpoint
    const fullUrl = `${base}${endpoint}/${identifier}`

    console.log(fullUrl)

    const token = await getElgaAccessToken()



    const httpsAgent = new https.Agent({
        pfx: fs.readFileSync(p12Path),
        passphrase: config.keystorePassword,
        ca: fs.readFileSync(caPath),
        rejectUnauthorized: true
    })

    axios.interceptors.request.use((config) => {
        console.log('--- [AXIOS REQUEST START] ---');
        console.log(`Method: ${config.method?.toUpperCase()}`);
        console.log(`URL:    ${config.url}`);
        console.log(`Params: ${JSON.stringify(config.params, null, 2)}`);
        console.log(`Headers:`, config.headers);
        // Log a snippet of the body to avoid flooding the console
        if (config.data) {
            console.log(`Body Snippet: ${JSON.stringify(config.data).substring(0, 200)}...`);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    axios.interceptors.response.use((response) => {
        return response;
    }, (error) => {
        console.error('--- [AXIOS RESPONSE ERROR] ---');
        if (error.response) {
            // The server responded with a status code outside the 2xx range
            console.error(`Status:  ${error.response.status}`);
            console.error(`Headers:`, error.response.headers);

            // This is the most important part for FHIR/ELGA
            console.error(`Server Details:`, JSON.stringify(error.response.data, null, 2));

            if (error.response.status === 403) {
                console.warn('HINT: Check if your token has the correct Role OID (702/etc.) or if the Patient ID matches your access scope.');
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received from server. Check network/VPN.');
        } else {
            console.error('Error setting up request:', error.message);
        }
        return Promise.reject(error);
    });

    try {
        const response = await axios.put(`${fullUrl}`, questionaireResponse,
            {
                httpsAgent,
                headers: {
                    'Content-Type': 'application/fhir+json',
                    'e-agw-client': 'zgf1',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/fhir+json'
                },
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