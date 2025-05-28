# linked-Creds-author LinkedTrust Integration

## Setup

1. Install dependencies:
```bash
npm install axios
```

2. Set environment variables:
```bash
LINKEDTRUST_API_URL=https://live.linkedtrust.us/api
LINKEDTRUST_API_KEY=your-api-key  # Optional
```

## Integration Steps

### 1. Add LinkedTrust Publisher

The `linkedTrustPublisher.ts` file has been added to `app/utils/`. This provides:
- `LinkedTrustPublisher` class for publishing credentials
- Integration with existing credential creation flow
- Batch publishing support

### 2. Update Credential Form

Add the `CredentialPublishOptions` component to your credential creation form:

```tsx
import { CredentialPublishOptions } from './components/CredentialPublishOptions';
import { createAndPublishCredential } from './utils/linkedTrustPublisher';

function CredentialForm() {
  const handlePublish = async (options) => {
    const credential = await createAndPublishCredential(
      formData,
      accessToken,
      issuerDid,
      keyPair,
      options.publishToLinkedTrust
    );
    
    if (credential.linkedTrustUri) {
      console.log('Published to:', credential.linkedTrustUri);
    }
  };

  return (
    <form>
      {/* Your existing form fields */}
      <CredentialPublishOptions onPublish={handlePublish} />
    </form>
  );
}
```

### 3. Display LinkedTrust URI

After publishing, show the persistent URI to users:

```tsx
{credential.linkedTrustUri && (
  <div className="success-message">
    <p>Credential published to LinkedTrust!</p>
    <p>Permanent URI: 
      <a href={credential.linkedTrustUri} target="_blank">
        {credential.linkedTrustUri}
      </a>
    </p>
    <button onClick={() => navigator.clipboard.writeText(credential.linkedTrustUri)}>
      Copy URI
    </button>
  </div>
)}
```

## API Usage Examples

### Publish Single Credential

```typescript
const publisher = new LinkedTrustPublisher();

const result = await publisher.publishCredential(
  signedCredential,
  {
    tags: ['skill', 'professional', 'verified'],
    visibility: 'public',
    displayHints: {
      primaryDisplay: 'achievement.name',
      showSkills: true
    }
  }
);
```

### Publish Multiple Credentials

```typescript
const credentials = [credential1, credential2, credential3];

const results = await publisher.publishBatch(
  credentials,
  { tags: ['batch-upload', '2024'] }
);

results.forEach((result, index) => {
  if (result.success) {
    console.log(`Credential ${index + 1}: ${result.uri}`);
  } else {
    console.error(`Failed ${index + 1}: ${result.error}`);
  }
});
```

## Benefits of LinkedTrust Integration

1. **Persistent URIs**: Credentials get permanent, referenceable addresses
2. **Discovery**: Credentials become searchable in the LinkedTrust network
3. **Trust Graph**: See how credentials relate to other claims
4. **Verification**: LinkedTrust provides additional verification layer
5. **Interoperability**: Credentials can be referenced by other systems

## Next Steps

1. Test with sample credentials
2. Add LinkedTrust URI to credential metadata
3. Implement credential status checking via LinkedTrust
4. Add related claims display using LinkedTrust API
