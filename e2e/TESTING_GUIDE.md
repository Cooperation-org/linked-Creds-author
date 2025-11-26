# End-to-End Testing Guide for LinkedCreds

This document outlines the critical user flows that should be tested end-to-end in the LinkedCreds application.

## Core User Journeys to Test

### 1. Authentication & Onboarding
**Priority: HIGH**

- **Google OAuth Sign-In**
  - User clicks "Sign in with Google"
  - User completes Google authentication
  - Session is established with access/refresh tokens
  - User is redirected appropriately after sign-in
  - Token refresh works when access token expires

- **First-Time User Experience**
  - Welcome message appears for new users
  - Homepage displays correctly for authenticated users
  - Navigation is accessible

### 2. Credential Creation Flow
**Priority: CRITICAL**

This is the core feature of the application. Test the complete multi-step form:

- **Step 0: Google Drive Connection**
  - User is prompted to connect to Google Drive if not already connected
  - Connection flow works correctly
  - User can proceed to form after connection

- **Step 1-6: Form Completion**
  - All form steps are accessible and navigable
  - Form validation works (required fields, format validation)
  - User can navigate back and forth between steps
  - Form data persists when navigating between steps
  - Evidence upload works (images, PDFs, videos)
  - Google Drive file uploads succeed
  - Form submission creates credential successfully

- **Success Page**
  - Success message displays after credential creation
  - Share options work (LinkedIn, Email, Copy URL, View)
  - Credential link is correct and accessible
  - User can navigate to view the created credential

### 3. Credential Import Flow
**Priority: HIGH**

- **Basic Import**
  - User can paste a credential URL
  - System fetches credential from URL
  - CORS issues are handled (proxy fallback works)
  - Credential is saved to Google Drive
  - User is redirected appropriately

- **Enhanced Import**
  - Enhanced import button works
  - Credential is normalized correctly
  - Verification is performed
  - User is redirected to recommendation workflow
  - Both original and normalized versions are saved

- **JSON Direct Input**
  - User can paste JSON directly
  - JSON parsing works correctly
  - Error handling for invalid JSON

### 4. Viewing Credentials
**Priority: HIGH**

- **View Own Credentials**
  - User can view credential details from claims page
  - All credential information displays correctly
  - Evidence files are accessible
  - Recommendations are visible
  - QR code generates correctly

- **View Shared Credentials (Public)**
  - Public credential links work without authentication
  - All credential information displays correctly
  - Evidence is accessible
  - Verification status is shown
  - Original credential can be viewed/verified

### 5. Claims/Skills Management
**Priority: HIGH**

- **View All Credentials**
  - Claims page loads all user credentials
  - Credentials display with correct information
  - Recommendations are listed separately
  - Cards expand/collapse correctly (mobile)
  - Menu options are accessible (desktop)

- **Delete Credentials**
  - Delete confirmation dialog appears
  - Credential is deleted successfully
  - Success/error messages display
  - Credential is removed from the list

- **Share Credentials**
  - Email share opens mail page
  - LinkedIn share opens LinkedIn with correct URL
  - Copy URL copies correct shareable link
  - Share link works for recipients

- **Request Recommendations**
  - "Ask for Recommendation" button works
  - Recommendation request page loads
  - Form can be filled out
  - Recommendation link is generated correctly

### 6. Recommendations Flow
**Priority: HIGH**

- **Requesting Recommendations**
  - User navigates to recommendation request page
  - Credential information is displayed
  - User can enter recommender details
  - Message is generated correctly
  - Link can be copied and shared

- **Providing Recommendations**
  - Recommendation link is accessible
  - Credential information displays correctly
  - Recommendation form loads
  - All form steps work correctly
  - Form submission saves recommendation
  - Recommendation is linked to credential

- **Viewing Recommendations**
  - Recommendations appear on credential view
  - Recommendation details are correct
  - Recommendations can be shared
  - Recommendations can be deleted

### 7. Email Verification
**Priority: MEDIUM**

- **Send Verification Code**
  - User can enter email address
  - Verification code is sent
  - Success message displays
  - Error handling for invalid emails

- **Verify Code**
  - User can enter verification code
  - Code validation works
  - Success/error messages display
  - Rate limiting works (too many attempts)

### 8. Sharing & Social Integration
**Priority: MEDIUM**

- **Email Sharing**
  - Email share page loads
  - Form can be filled out
  - Email is sent (if implemented)
  - Share link is correct

- **LinkedIn Sharing**
  - LinkedIn URL is generated correctly
  - Opens in new tab
  - Credential information is in URL parameters

- **Copy Link**
  - Link is copied to clipboard
  - Link is correct format
  - Link works when accessed

### 9. Analytics
**Priority: LOW**

- **View Analytics**
  - Analytics page loads
  - Metrics display correctly
  - Data is accurate

### 10. Help & Support
**Priority: LOW**

- **Help Page**
  - Help page is accessible
  - All sections load correctly
  - Links work
  - FAQ is readable

- **Quick Help Cards**
  - Help cards appear on relevant pages
  - Cards can be expanded/collapsed
  - Content is helpful

## Test Scenarios by Priority

### Critical Path (Must Test)
1. ✅ User can sign in with Google
2. ✅ User can create a new credential (full flow)
3. ✅ User can view their credentials
4. ✅ User can share a credential
5. ✅ User can request a recommendation
6. ✅ User can provide a recommendation
7. ✅ Public credential links work

### High Priority
1. ✅ User can import a credential from URL
2. ✅ User can delete a credential
3. ✅ User can view shared credentials
4. ✅ Form validation works correctly
5. ✅ File uploads work
6. ✅ Token refresh works

### Medium Priority
1. ✅ Email verification flow
2. ✅ Enhanced import workflow
3. ✅ Error handling for failed operations
4. ✅ Mobile responsive design
5. ✅ Navigation between pages

### Low Priority
1. ✅ Analytics page
2. ✅ Help page
3. ✅ Privacy/Terms pages
4. ✅ Accessibility features

## Edge Cases to Test

1. **Network Failures**
   - Offline behavior
   - Slow network conditions
   - Failed API calls

2. **Authentication Edge Cases**
   - Expired tokens
   - Invalid tokens
   - Multiple tabs with different sessions

3. **Form Edge Cases**
   - Very long text inputs
   - Special characters in inputs
   - Large file uploads
   - Multiple file uploads

4. **Data Edge Cases**
   - Empty credential lists
   - Credentials with no evidence
   - Credentials with no recommendations
   - Invalid credential data

5. **Browser Compatibility**
   - Chrome, Firefox, Safari
   - Mobile browsers
   - Different screen sizes

## Recommended Test Structure

```
e2e/
├── auth.spec.ts          # Authentication tests
├── credential-creation.spec.ts  # Full credential creation flow
├── credential-import.spec.ts     # Import functionality
├── credential-viewing.spec.ts    # Viewing credentials
├── claims-management.spec.ts     # Claims page functionality
├── recommendations.spec.ts       # Recommendation flow
├── sharing.spec.ts               # Sharing functionality
└── helpers/
    ├── auth-helpers.ts           # Authentication utilities
    ├── form-helpers.ts           # Form interaction utilities
    └── test-data.ts              # Test data fixtures
```

## Test Data Requirements

- Test Google account for authentication
- Sample credential URLs for import testing
- Sample files for upload testing (images, PDFs, videos)
- Test email addresses for verification
- Mock recommendation data

## Environment Setup

- Test environment with Google OAuth configured
- Test Google Drive account
- Mock or test email service
- Test database/storage backend

