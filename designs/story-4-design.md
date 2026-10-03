# 🎨 Google Stitch Design Spec — Story #4: User Authentication, SSO & MFA Gateway

## Design System Tokens & Semantic Colors

| Token Name | Value | Purpose |
| :--- | :--- | :--- |
| color-auth-bg | #f8fafc | Background canvas for login modal / backdrop overlay |
| color-primary-brand | #0284c7 (Sky 600) | Primary CTA buttons, focused border rings, active tabs |
| color-sso-google | #4285f4 | Google SSO button highlight & icon |
| color-sso-facebook | #1877f2 | Facebook SSO button highlight |
| color-sso-github | #24292f | GitHub SSO button |
| color-mfa-badge | #059669 (Emerald 600) | Verified 2FA shield badge |
| color-error-state | #dc2626 (Red 600) | Invalid credentials, expired verification token alert |

---

## 8-State Component Matrix (Auth Gateway)
1. **Default**: Clean login modal centered on screen with tabs for 'Sign In' and 'Create Account'.
2. **Hover**: Smooth elevation on SSO buttons and Sign In button (	ranslate-y-[-1px], shadow transition).
3. **Active**: Depressed button state (scale-95).
4. **Focus-Visible**: High-contrast 2px cyan focus ring (ing-2 ring-sky-500 ring-offset-2).
5. **Loading Skeleton / Spinner**: Circular spinner with disabled inputs during token exchange.
6. **Disabled**: Submit button dimmed (opacity-50 cursor-not-allowed) when inputs are invalid or empty.
7. **Empty**: Form fields blank with accessible floating labels and ARIA descriptors.
8. **Error**: Accessible alert box (ole="alert") displaying invalid email, password mismatch, or incorrect 2FA TOTP code.
