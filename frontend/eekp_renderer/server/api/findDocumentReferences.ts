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

    //const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImFjY2Vzc1Rva2VuSXNzdWVyX2p3dF9sb2NhbCJ9.eyJzdWIiOiJ1cm46b2lkOjEuMi40MC4wLjM0Ljk5LjEwLjEuMS4xLjMxNDk4IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4OTA1L3BpbmVpdC9waXRhY2Nlc3MtZW9hcy9hdXRoIiwiZXhwIjoxNzcxNTA4NDA5LCJqdGkiOiJ2VUVpWG5nQmhDaEpHM0w0bjQ2eXFJdWVfNXlHd0xocGNxX0ZrNlhub1BFTTFTOVpCOHhNWnFRa2lCc3l6a0lheGxFQlpFVDlMQUNxVk94UlM0b1ctUSIsImlhdCI6MTc3MTUwODM0OSwiYXVkIjpbInpnZjEiLCJwaW5lIl0sImV4dGVuc2lvbnMiOnsiZWxnYSI6eyJhcHAiOiIxMDgifSwiaWhlX2l1YSI6eyJzdWJqZWN0X25hbWUiOiJwaW5lSVQiLCJzdWJqZWN0X29yZ2FuaXphdGlvbl9pZCI6InVybjpvaWQ6MS4yLjQwLjAuMzQuOTkuMTAuMS4xLjEuMzE0OTgiLCJwZXJzb25faWQiOiJHSDpvSm9VaStsdUJkYmhDa2lwbm9aNy8xL1pybXc9Xl5eJjEuMi40MC4wLjEwLjIuMS4xLjE0OSZJU08iLCJzdWJqZWN0X3JvbGUiOlt7ImNvZGUiOiI3MDIifV0sInB1cnBvc2Vfb2ZfdXNlIjpbeyJjb2RlIjoiUFVCTElDSEVBTFRIIn1dfX0sInNjb3BlIjoiY3M6MTA4XzcwMiJ9.FGowpL3kDQ0klCZjVqccoPpwBmwrwPITbnUJEx55BliKaA_oe45MnpUBogos8PBKCwEGt9F4ZWS3IwbCKjRyBp6QUnEFR6YIed3TPFquPQbx_BLQWE_-AHts3Ngf69hMW45N7PUM81CakHHqf5qU-MPHDpRPAJaZOw2x9fqC-wIxVRf4hLe4xAOuW7kp4Jy5Qoel72pbmrXULz4CnSKD5SbaLk6f0VaJNYT3cIuNQTcFB5mq-yYWsBTjTkhd6Xa3RBXiHdp0RWIHMzlmI6uimXwxDnz1jWPE2NzCcoZ2Em7TsavQlMTouFGbJs3psxNQo4SJ0f_MH1fgv_qiIsj7og"

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
                //'Authorization': `Bearer ${token}`
            }
        })

        // 3. JSON an das Nuxt Frontend zurückgeben
        console.log('Proxy Response Status:', response.status)
        return response.data

    } catch (error) {
    console.error('Proxy Error:', error)
    
    }
})