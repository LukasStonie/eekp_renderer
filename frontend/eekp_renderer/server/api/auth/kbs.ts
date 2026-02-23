import https from 'node:https'
import fs from 'node:fs'
import axios from 'axios'
import path from 'node:path'
import { da } from 'element-plus/es/locales.mjs'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const body = await readBody(event)

  const xmlBody = createSoapRequest({
    guid: crypto.randomUUID(),
    HCP_GDA: body?.hcpGda,
    ORG_ID: config.ORG_ID,
    XDS_PID: config.xdsPid,
    isoTime: new Date().toISOString()
  });

  const httpsAgent = new https.Agent({
    pfx: fs.readFileSync(config.authKeystorePath),
    passphrase: config.authKeystorePassword,
    rejectUnauthorized: true
  })

  try {
    const response = await axios.post(config.kbsEntryPoint, xmlBody, {
      httpsAgent,
      headers: {
        'Content-Type': 'application/soap+xml; charset=utf-8',
      }
    });
    
    if (response.data.includes("Fault")) {
       console.error("SOAP Level Fault detected!");
        throw createError({
          statusCode: 500,
          statusMessage: "SOAP Fault detected in KBS response"
        });
    }

    return {
      success: true
    }

  } catch (error: any) {
    // Detailed logging for debugging SOAP issues
    console.error('SOAP Error Status:', error.response?.status)
    console.error('SOAP Error Body:', error.response?.data)

    throw createError({
      statusCode: error.response?.status || 502,
      statusMessage: 'Failed to perform KBS request'
    })
  }
})


export const createSoapRequest = (params: { guid: string, HCP_GDA: string, ORG_ID: string, XDS_PID: string, isoTime: string }): string => {
  return `<env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope">
  <env:Header>
    <sec:Security xmlns:sec="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">

${params.HCP_GDA}

</sec:Security>
    <adrr:Action xmlns:adrr="http://www.w3.org/2005/08/addressing" xmlns:ns0="http://www.w3.org/2003/05/soap-envelope" ns0:mustUnderstand="1">http://docs.oasis-open.org/ws-sx/ws-trust/200512/RST/Issue</adrr:Action>
    <addr:To xmlns:addr="http://www.w3.org/2005/08/addressing" xmlns:ns0="http://www.w3.org/2003/05/soap-envelope" ns0:mustUnderstand="1">https://acs.elga-dev-spirit.int/KBS</addr:To>
    <addr:MessageID xmlns:addr="http://www.w3.org/2005/08/addressing">pineIT_msgID:${params.guid}</addr:MessageID>
    <addr:ReplyTo xmlns:addr="http://www.w3.org/2005/08/addressing">
      <addr:Address>http://www.w3.org/2005/08/addressing/anonymous</addr:Address>
    </addr:ReplyTo>
    <ectx:context xmlns:ectx="http://docs.oasis-open.org/ws-caf/2005/10/wsctx" xmlns:ns0="http://www.w3.org/2003/05/soap-envelope" ns0:mustUnderstand="1">
      <context-identifier xmlns="http://www.w3.org/2003/05/soap-envelope">uuid:895786db-512a-4d6f-a228-27994ea5fc8f</context-identifier>
    </ectx:context>
  </env:Header>
  <env:Body>
    <RequestSecurityToken xmlns="http://docs.oasis-open.org/ws-sx/ws-trust/200512">
      <TokenType>urn:elga:kbs:contact</TokenType>
      <RequestType>http://docs.oasis-open.org/ws-sx/ws-trust/200512/Issue</RequestType>
      <Claims Dialect="urn:tiani-spirit:bes:2013:claims">
        <ClaimType xmlns="urn:tiani-spirit:ts" DataType="http://www.w3.org/2001/XMLSchema#anyURI" name="urn:tiani-spirit:bes:2013:claims:tr-type">
          <ClaimValue>K102</ClaimValue>
        </ClaimType>
        <ClaimType xmlns="urn:tiani-spirit:ts" DataType="http://www.w3.org/2001/XMLSchema#anyURI" name="urn:tiani-spirit:bes:2013:claims:ident-method">
          <ClaimValue>PIM103</ClaimValue>
        </ClaimType>
        <ClaimType xmlns="urn:tiani-spirit:ts" DataType="http://www.w3.org/2001/XMLSchema#anyURI" name="urn:oasis:names:tc:xspa:1.0:subject:organization-id">
          <ClaimValue>${params.ORG_ID}</ClaimValue>
        </ClaimType>
        <ClaimType xmlns="urn:tiani-spirit:ts" DataType="http://www.w3.org/2001/XMLSchema#string" name="urn:oasis:names:tc:xacml:1.0:resource:resource-id">
          <ClaimValue>${params.XDS_PID}</ClaimValue>
        </ClaimType>
        <ClaimType xmlns="urn:tiani-spirit:ts" DataType="http://www.w3.org/2001/XMLSchema#dateTime" name="urn:tiani-spirit:bes:2013:claims:tr-date">
          <ClaimValue>${params.isoTime}</ClaimValue>
        </ClaimType>
      </Claims>
    </RequestSecurityToken>
  </env:Body>
</env:Envelope>`.trim();
}