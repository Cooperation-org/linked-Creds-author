import { Ed25519VerificationKey2020 } from '@digitalcredentials/ed25519-verification-key-2020'
import { Ed25519Signature2020 } from '@digitalcredentials/ed25519-signature-2020'
import { ZcapClient } from '@digitalcredentials/ezcap'

// ---- Replace with your actual zcap + appInstanceDid ----
const STORED = {
  zcap: {
    "@context": [
      "https://w3id.org/zcap/v1",
      "https://w3id.org/security/suites/ed25519-2020/v1"
    ],
    "id": "urn:uuid:6a69a822-0e52-4d4c-8ed6-0eaed3578bd9",
    "controller": "did:key:z6MktN7co79Kv5KmDDgeLkwa8Bdrgteuh6AfCk9pSPz2yV1c",
    "parentCapability": "urn:zcap:root:https%3A%2F%2Fstorage.dcc.did.coop%2Fspace%2F9b94a290-8a69-493e-9331-61cbfb20fa74",
    "invocationTarget": "https://storage.dcc.did.coop/space/9b94a290-8a69-493e-9331-61cbfb20fa74",
    "expires": "2025-09-18T11:08:12.525Z",
    "allowedAction": [
      "GET",
      "POST",
      "PUT",
      "DELETE"
    ],
    "proof": {
      "type": "Ed25519Signature2020",
      "created": "2025-09-08T11:08:32Z",
      "verificationMethod": "did:key:z6MkotYfNRLSLotHJPaCWhvFK3Z6VH3SKQhLG3mfVy4cuywk#z6MkotYfNRLSLotHJPaCWhvFK3Z6VH3SKQhLG3mfVy4cuywk",
      "proofPurpose": "capabilityDelegation",
      "capabilityChain": [
        "urn:zcap:root:https%3A%2F%2Fstorage.dcc.did.coop%2Fspace%2F9b94a290-8a69-493e-9331-61cbfb20fa74"
      ],
      "proofValue": "z5mscGK5hxmJo1AYk7emnMvV3hyEN9JcWm6DzxBYWkXgUeFqwQbDkyRnRMnMEMfiirr66ge2tvwmJuBpGxcj6zGrP"
    }
  },
  appInstance: {
    "controller": "did:key:z6MktN7co79Kv5KmDDgeLkwa8Bdrgteuh6AfCk9pSPz2yV1c",
    "id": "did:key:z6MktN7co79Kv5KmDDgeLkwa8Bdrgteuh6AfCk9pSPz2yV1c#z6MktN7co79Kv5KmDDgeLkwa8Bdrgteuh6AfCk9pSPz2yV1c",
    "publicKeyMultibase": "z6MktN7co79Kv5KmDDgeLkwa8Bdrgteuh6AfCk9pSPz2yV1c",
    "privateKeyMultibase": "zrv39cRY9zepDmzUTjnSiQjxVpBgis3aSBnhh8LvMY9MjYHH8VDuetCe14T77u4m9YUdroy3jT8grK6DiM6Na51ovtJ"
  }
}
// ----------------------------------------------------------------

async function main() {
  console.log('Starting WAS upload (local test)...')

  const { zcap, appInstance } = STORED
  console.log('Using appInstance DID:', appInstance.id)

  // signer
  const key = await Ed25519VerificationKey2020.from(appInstance)
  const invocationSigner = key.signer()

  const zcapClient = new ZcapClient({
    SuiteClass: Ed25519Signature2020,
    invocationSigner,
  })

  const blob = new Blob(['Hello local WAS upload!'], { type: 'text/plain' })

  // base = /space/:uuid
  const baseUrl = zcap.invocationTarget
  console.log('Zcap target:', baseUrl)

  // final URL = /space/:uuid/:name
  const wasUrl = `${baseUrl}/${encodeURIComponent('test-local.txt')}`
  console.log('Uploading to:', wasUrl)

  try {
    console.log('zcap:', zcap)
    const response = await zcapClient.request({
      url: wasUrl,
      capability: zcap,
      method: 'put',
      action: 'PUT',
      blob,
    })
    console.log('Upload complete!')
    console.log('Response:', response)
  } catch (err) {
    console.error('Upload failed:', err)
  }
}

main().catch(err => {
  console.error('Script crashed:', err)
  process.exit(1)
})
