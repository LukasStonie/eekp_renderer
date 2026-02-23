// server/utils/elgaAuth.ts
export const getElgaAccessToken = async () => {
  const storage = useStorage('data')
  const CACHE_KEY = 'elga:auth_session'

  // 1. Check if we have a valid cached token
  const cached = await storage.getItem(CACHE_KEY) as any
  
  // Refresh if token is missing or expires in less than 10 seconds
  const isExpired = cached && (Date.now() >= (cached.expiresAt - 10000))

  if (cached && !isExpired) {
    return cached.access_token
  }

  console.log(isExpired ? 'Token expiring, running re-auth chain...' : 'No token, starting full auth chain...')

  try {
    // 2. Full Auth Chain
    // We call the internal handlers directly or use $fetch internally
    
    // Step 1: IDA SAML
    const saml: { success: boolean, idaGda: string } = await $fetch('/api/auth/saml')

    // Step 2: HCP GDA
    const hcp: { success: boolean, hcpGda: string, hcpGdaB64: string, hcpGdaAid: string } = await $fetch('/api/auth/hcp', {
      method: 'POST',
      body: { idaGda: saml.idaGda }
    })

    // Step 3: KBS (The audit step)
    await $fetch('/api/auth/kbs', {
      method: 'POST',
      body: { 
        idaGda: saml.idaGda,
        hcpGda: hcp.hcpGda 
      }
    })

    // Step 4: JWT Exchange
    const jwt: { success: boolean, access_token: string, refresh_token: string, expires_in: number } = await $fetch('/api/auth/jwt', {
      method: 'POST',
      body: { hcpGdaB64: hcp.hcpGdaB64 }
    })

    // 3. Store in server memory
    const sessionData = {
      access_token: jwt.access_token,
      expiresAt: Date.now() + (jwt.expires_in * 1000)
    }
    
    await storage.setItem(CACHE_KEY, sessionData)

    return jwt.access_token
  } catch (error: any) {
    console.error('Full Auth Chain Failed:', error.message)
    throw createError({
      statusCode: 500,
      statusMessage: 'ELGA Authentication failed'
    })
  }
}