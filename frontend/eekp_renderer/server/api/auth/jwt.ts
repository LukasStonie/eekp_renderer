import https from 'node:https'
import fs from 'node:fs'
import axios from 'axios'
import path from 'node:path'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const body = await readBody(event)
  const credentials = Buffer.from(`${config.jwtUsername}:${config.jwtPassword}`).toString('base64');

  const httpsAgent = new https.Agent({
    pfx: fs.readFileSync(config.authKeystorePath),
    passphrase: config.authKeystorePassword,
    rejectUnauthorized: true
  })

  const formData = {
    grant_type: config.grantType,
    assertion: body.hcpGdaB64,
    scope: config.scope,
    patient: config.patientId
  }

  try {
    const response = await axios.post(config.jwtEntryPoint, new URLSearchParams(formData), {
      httpsAgent,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'e-agw-client': 'zgf1',
        'Authorization': `Basic ${credentials}`
      }
    });

    const data = response.data

    if (data.token_type !== 'Bearer') {
      throw createError({ statusCode: 500, statusMessage: 'Invalid token type received' })
    }

    return {
      success: true,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
    }


  } catch (error: any) {
    console.error('JWT Request Error Status:', error.response?.status)
    console.error('JWT Request Error Body:', error.response?.data)

    throw createError({
      statusCode: error.response?.status || 502,
      statusMessage: 'Failed to perform JWT request'
    })
  }
})