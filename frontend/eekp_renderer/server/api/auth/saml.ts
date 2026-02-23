import https from 'node:https'
import fs from 'node:fs'
import axios from 'axios'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()

    const credentials = Buffer.from(`${config.samlUsername}:${config.samlPassword}`).toString('base64');

    const xmlBody = createSoapRequest({
        guid: crypto.randomUUID(),
        ctxID: config.ctxID,
        ORG_ID: config.ORG_ID
    });

    console.log("Keystore path", config.authKeystorePath);

    const httpsAgent = new https.Agent({
        pfx: fs.readFileSync(config.authKeystorePath),
        passphrase: config.authKeystorePassword,
        rejectUnauthorized: true
    })

    try {
        const response = await axios.post(config.samlEntryPoint, xmlBody, {
            httpsAgent,
            headers: {
                'Content-Type': 'application/soap+xml; charset=utf-8',
                'Authorization': `Basic ${credentials}`
            }
        });

        const xmlText = response.data;

        if (!xmlText.includes("Assertion")) {
            throw createError({
                statusCode: 500,
                statusMessage: "SAML Assertion missing in response"
            });
        }

        const startTag = "<saml2:Assertion";
        const endTag = "</wst:RequestedSecurityToken>";

        const startIndex = xmlText.indexOf(startTag);
        const endIndex = xmlText.indexOf(endTag);

        if (startIndex === -1 || endIndex === -1) {
            throw new Error("Could not find the SAML boundary tags in the response.");
        }

        const SAML_ASSERTION = xmlText.substring(startIndex, endIndex);
       
        return {
            success: true,
            idaGda: SAML_ASSERTION
        };

    } catch (error: any) {
        console.error('SOAP Error Status:', error.response?.status)
        console.error('SOAP Error Body:', error.response?.data)

        throw createError({
            statusCode: error.response?.status || 502,
            statusMessage: 'Failed to perform SAML request'
        })
    }
})


export const createSoapRequest = (params: { guid: string, ctxID: string, ORG_ID: string }): string => {
    return `
    <env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope">
  <env:Header>
    <sec:Security xmlns:sec="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
		</sec:Security>
    <adrr:Action xmlns:adrr="http://www.w3.org/2005/08/addressing" xmlns:ns0="http://www.w3.org/2003/05/soap-envelope" ns0:mustUnderstand="1">http://docs.oasis-open.org/ws-sx/ws-trust/200512/RST/Issue</adrr:Action>
    <addr:To xmlns:addr="http://www.w3.org/2005/08/addressing" xmlns:ns0="http://www.w3.org/2003/05/soap-envelope" ns0:mustUnderstand="1">https://acs.elga-dev-spirit.int/ETS</addr:To>
    <addr:MessageID xmlns:addr="http://www.w3.org/2005/08/addressing">pineIT_msgID:${params.guid}</addr:MessageID>
    <addr:ReplyTo xmlns:addr="http://www.w3.org/2005/08/addressing">
      <addr:Address>http://www.w3.org/2005/08/addressing/anonymous</addr:Address>
    </addr:ReplyTo>
    <ectx:context xmlns:ectx="http://docs.oasis-open.org/ws-caf/2005/10/wsctx" xmlns:ns0="http://www.w3.org/2003/05/soap-envelope" ns0:mustUnderstand="1">
      <context-identifier xmlns="http://www.w3.org/2003/05/soap-envelope">uuid:5737b7d0-5df5-4841-8241-2af16ddc8496</context-identifier>
    </ectx:context>
    <!--ectx:context xmlns="http://docs.oasis-open.org/ws-caf/2005/10/wsctx" xmlns:ectx="http://elga.at/context/"><context-identifier>${params.ctxID}</context-identifier></ectx:context-->

	
  </env:Header>
  <env:Body>
    <RequestSecurityToken xmlns="http://docs.oasis-open.org/ws-sx/ws-trust/200512">
      <TokenType>urn:elga:bes:2013:IDAgda:assertion</TokenType>
      <RequestType>http://docs.oasis-open.org/ws-sx/ws-trust/200512/Issue</RequestType>
      <Claims Dialect="urn:tiani-spirit:bes:2013:claims">
        <ClaimType xmlns="urn:tiani-spirit:ts" DataType="http://www.w3.org/2001/XMLSchema#anyURI" name="urn:oasis:names:tc:xacml:1.0:subject:subject-id">
          <ClaimValue>pineIT</ClaimValue>
        </ClaimType>
        <ClaimType xmlns="urn:tiani-spirit:ts" DataType="http://www.w3.org/2001/XMLSchema#anyURI" name="urn:oasis:names:tc:xspa:1.0:subject:organization-id">
          <ClaimValue>${params.ORG_ID}</ClaimValue>
        </ClaimType>
        <ClaimType xmlns="urn:tiani-spirit:ts" DataType="http://www.w3.org/2001/XMLSchema#anyURI" name="urn:elga:bes:2013:OIDIssuingAuthority">
          <ClaimValue>1.2.40.0.34</ClaimValue>
        </ClaimType>
        <ClaimType xmlns="urn:tiani-spirit:ts" DataType="http://www.w3.org/2001/XMLSchema#anyURI" name="urn:oasis:names:tc:xspa:1.0:subject:organization">
          <ClaimValue>pineIT</ClaimValue>
        </ClaimType>
      </Claims>
      <Lifetime>
        <!--  wsu:Created xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">2019-07-18T07:55:16.574Z</wsu:Created><wsu:Expires xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">2019-07-18T08:00:16.595Z</wsu:Expires-->
    
    </Lifetime>
  </RequestSecurityToken>
</env:Body>
</env:Envelope>`.trim();
}