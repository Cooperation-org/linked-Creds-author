import React, { useState } from 'react';

interface PublishOptionsProps {
  onPublish: (options: PublishOptions) => void;
}

interface PublishOptions {
  publishToLinkedTrust: boolean;
  linkedTrustApiKey?: string;
}

export function CredentialPublishOptions({ onPublish }: PublishOptionsProps) {
  const [publishToLinkedTrust, setPublishToLinkedTrust] = useState(false);
  const [linkedTrustApiKey, setLinkedTrustApiKey] = useState('');

  return (
    <div className="publish-options">
      <h3>Publishing Options</h3>
      
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={publishToLinkedTrust}
          onChange={(e) => setPublishToLinkedTrust(e.target.checked)}
          className="w-4 h-4"
        />
        <span>Publish to LinkedTrust Network</span>
      </label>

      {publishToLinkedTrust && (
        <div className="linkedtrust-options mt-4 p-4 bg-gray-50 rounded">
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              LinkedTrust API Key (optional)
            </label>
            <input
              type="password"
              placeholder="Enter your API key"
              value={linkedTrustApiKey}
              onChange={(e) => setLinkedTrustApiKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <p className="text-sm text-gray-600">
            Your credential will be published to the LinkedTrust network, making it discoverable
            and linkable by others. It will receive a permanent URI that can be referenced
            in other claims and credentials.
          </p>
        </div>
      )}

      <button 
        onClick={() => onPublish({ publishToLinkedTrust, linkedTrustApiKey })}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Create & Publish Credential
      </button>
    </div>
  );
}
