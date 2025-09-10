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
    "id": "urn:uuid:2fdfc092-0dd9-4042-baf0-6a793c010b15",
    "controller": "did:key:z6MknJ51X2G3VyzJ5VwxwESNJYKonotbLsXYjFR1oHnxYkHJ",
    "parentCapability": "urn:zcap:root:https%3A%2F%2Fancient-log-copyrights-guardian.trycloudflare.com%2Fspace%2F64f5f687-ec3e-4a37-9f74-482f76cdf033",
    "invocationTarget": "https://ancient-log-copyrights-guardian.trycloudflare.com/space/64f5f687-ec3e-4a37-9f74-482f76cdf033",
    "expires": "2025-09-20T10:26:09.029Z",
    "allowedAction": [
      "GET",
      "POST",
      "PUT",
      "DELETE"
    ],
    "proof": {
      "type": "Ed25519Signature2020",
      "created": "2025-09-10T10:29:31Z",
      "verificationMethod": "did:key:z6Mkh5Ea5YT4GPeCf4scpRK2vYhuU7mnysT3vVTiKvAJarTU#z6Mkh5Ea5YT4GPeCf4scpRK2vYhuU7mnysT3vVTiKvAJarTU",
      "proofPurpose": "capabilityDelegation",
      "capabilityChain": [
        "urn:zcap:root:https%3A%2F%2Fancient-log-copyrights-guardian.trycloudflare.com%2Fspace%2F64f5f687-ec3e-4a37-9f74-482f76cdf033"
      ],
      "proofValue": "z4UGdP7TcqCLdakK9RN4we1ZfkpQP7U7GHjbPyz77d7JzUwdTag9VqND8LN5SeFqzZPPR6sJQKJWt9pg5kRh4GTQd"
    }
  },
  appInstance: {
    "controller": "did:key:z6Mkt4T2Wr8qKHKbte2JL316vbuWg3ozN2oBWpVWqZVKNhYH",
    "id": "did:key:z6Mkt4T2Wr8qKHKbte2JL316vbuWg3ozN2oBWpVWqZVKNhYH#z6Mkt4T2Wr8qKHKbte2JL316vbuWg3ozN2oBWpVWqZVKNhYH",
    "publicKeyMultibase": "z6Mkt4T2Wr8qKHKbte2JL316vbuWg3ozN2oBWpVWqZVKNhYH",
    "privateKeyMultibase": "zrv2yAMHgXxkGVmqmvwVJ4NxxeJUdZNY5jQupxBZXxY7ZhBnERr9CmCiZ2Mbx6ZaoKQBCJfLLVKMT2dypEzi314NmqP"
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

  const blob = new Blob(['Hello local WAS upload!'])

  // base = /space/:uuid
  const baseUrl = zcap.invocationTarget
  console.log('Zcap target:', baseUrl)

  // final URL = /space/:uuid/:name
  const wasUrl = `${baseUrl}/${encodeURIComponent('test-local.txt')}`
  console.log('Uploading to:', wasUrl)

  try {
    console.log('zcap:', zcap)
    console.log('Attempting upload...')

    const response = await zcapClient.request({
      url: wasUrl,
      capability: zcap,
      method: 'PUT',
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
