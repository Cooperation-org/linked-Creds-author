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
    "id": "urn:uuid:0f766283-82e6-4bd3-b97c-2b8b6bae5913",
    "controller": "did:key:z6MkhT825GkdZVziErLWEKfYaNg6BGhxPDJNNWNpvwAAp3oq",
    "parentCapability": "urn:zcap:root:https%3A%2F%2Fstorage.dcc.did.coop%2Fspace%2F8f5d68ac-82ed-4ed1-878f-185d5d11ac53",
    "invocationTarget": "https://storage.dcc.did.coop/space/8f5d68ac-82ed-4ed1-878f-185d5d11ac53",
    "expires": "2025-09-18T11:16:12.890Z",
    "allowedAction": [
      "GET",
      "POST",
      "PUT",
      "DELETE"
    ],
    "proof": {
      "type": "Ed25519Signature2020",
      "created": "2025-09-08T11:17:53Z",
      "verificationMethod": "did:key:z6MkfZSGLLTBpv8sL4sscDv3EQKLQAxoFEuSuzEVmLZAEHA6#z6MkfZSGLLTBpv8sL4sscDv3EQKLQAxoFEuSuzEVmLZAEHA6",
      "proofPurpose": "capabilityDelegation",
      "capabilityChain": [
        "urn:zcap:root:https%3A%2F%2Fstorage.dcc.did.coop%2Fspace%2F8f5d68ac-82ed-4ed1-878f-185d5d11ac53"
      ],
      "proofValue": "z4fm9PU41n94koWD7pxnoJQsJKRAAogaUcMtr9EAa9ixnR7H6PQqTaLwW92jUNnV6skfBHXckarUvnpLFrZ14HPDA"
    }
  },
  appInstance: {
    "controller": "did:key:z6MkhT825GkdZVziErLWEKfYaNg6BGhxPDJNNWNpvwAAp3oq",
    "id": "did:key:z6MkhT825GkdZVziErLWEKfYaNg6BGhxPDJNNWNpvwAAp3oq#z6MkhT825GkdZVziErLWEKfYaNg6BGhxPDJNNWNpvwAAp3oq",
    "publicKeyMultibase": "z6MkhT825GkdZVziErLWEKfYaNg6BGhxPDJNNWNpvwAAp3oq",
    "privateKeyMultibase": "zrv3gesaf3kKcBAh7z2odcHB3rSJBm8bLPjfznZzXMw5utL5L8wPqedyqzgu9PdVYGWffASKfkSLECQdiEQJ9aouwtf"
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
