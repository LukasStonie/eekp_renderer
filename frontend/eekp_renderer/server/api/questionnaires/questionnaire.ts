import https from 'node:https'
import fs from 'node:fs'
import axios from 'axios'
import { getElgaAccessToken } from '../../utils/elga_auth'

export default defineEventHandler(async (event) => {
    const params = getQuery(event)
    const url = params.url as string

    console.log("Requested resource: ", url)
    try {
        let response: any = null
        if (url.startsWith('file://')) {

            const filePath = url.split('file://')[1]
            response = fs.readFileSync(filePath)
        }
        else {

            response = await axios.get(`${url}`)
        }

        return response.data

    } catch (error) {
        console.error('Proxy Error:', error)

    }
})