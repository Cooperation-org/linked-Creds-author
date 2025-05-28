// linkedTrustPublisher.ts - LinkedTrust Publisher for linked-Creds-author
import axios from 'axios';

interface LinkedTrustPublishOptions {
  apiUrl?: string;
  apiKey?: string;
}

interface PublishResult {
  success: boolean;
  uri?: string;
  error?: string;
  claim?: any;
  credential?: any;
}

/**
 * Publishes a credential to LinkedTrust with appropriate schema detection
 */
export class LinkedTrustPublisher {
  private apiUrl: string;
  private apiKey?: string;

  constructor(options: LinkedTrustPublishOptions = {}) {
    this.apiUrl = options.apiUrl || process.env.LINKEDTRUST_API_URL || 'https://live.linkedtrust.us/api';
    this.apiKey = options.apiKey || process.env.LINKEDTRUST_API_KEY;
  }

  /**
   * Publish an OpenBadge v3 credential to LinkedTrust
   */
  async publishCredential(credential: any, metadata?: any): Promise<PublishResult> {
    try {
      // Prepare the request payload
      const payload = {
        credential,
        schema: 'OpenBadges', // Explicitly set for OBV3
        metadata: {
          ...metadata,
          tags: ['achievement', 'openbadges', ...(metadata?.tags || [])],
          visibility: metadata?.visibility || 'public',
          displayHints: {
            primaryDisplay: 'achievement.name',
            imageField: 'achievement.image',
            badgeType: 'achievement',
            showSkills: true,
            showCriteria: true,
            ...(metadata?.displayHints || {})
          }
        }
      };

      // Make the API request
      const headers: any = {
        'Content-Type': 'application/json'
      };
      
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await axios.post(
        `${this.apiUrl}/credentials`,
        payload,
        { headers }
      );

      return {
        success: true,
        uri: response.data.uri,
        claim: response.data.claim,
        credential: response.data.credential
      };
    } catch (error: any) {
      console.error('Failed to publish to LinkedTrust:', error);
      return {
        success: false,
        error: error.message || 'Unknown error occurred'
      };
    }
  }

  /**
   * Publish multiple credentials in batch
   */
  async publishBatch(credentials: any[], metadata?: any): Promise<PublishResult[]> {
    const results: PublishResult[] = [];
    
    for (const credential of credentials) {
      const result = await this.publishCredential(credential, metadata);
      results.push(result);
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return results;
  }
}

// Integration with existing credential creation flow
export async function createAndPublishCredential(
  formData: any,
  accessToken: string,
  issuerDid: string,
  keyPair: string,
  publishToLinkedTrust: boolean = false
): Promise<any> {
  // Import the existing signCred function
  const { signCred } = await import('./credential');
  
  // Use existing credential creation logic
  const signedVC = await signCred(
    accessToken,
    formData,
    issuerDid,
    keyPair,
    'VC',
    null
  );

  // Optionally publish to LinkedTrust
  if (publishToLinkedTrust) {
    const publisher = new LinkedTrustPublisher();
    const publishResult = await publisher.publishCredential(signedVC, {
      submittedBy: formData.fullName,
      tags: ['skill', 'achievement', formData.credentialType].filter(Boolean)
    });

    if (publishResult.success) {
      console.log('Published to LinkedTrust:', publishResult.uri);
      // Store the LinkedTrust URI with the credential
      return {
        ...signedVC,
        linkedTrustUri: publishResult.uri
      };
    } else {
      console.error('Failed to publish to LinkedTrust:', publishResult.error);
    }
  }

  return signedVC;
}
