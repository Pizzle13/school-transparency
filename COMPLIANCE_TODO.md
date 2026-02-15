# Compliance & Security TODO

## Legal Documentation

### Privacy Policy
- [ ] Explain what data we collect (email, submissions, ratings)
- [ ] Explain how we use the data (moderation, display on site)
- [ ] Explain data retention policy
- [ ] Explain user rights (right to delete, access)
- [ ] Include GDPR compliance statement if serving EU users
- [ ] Include CCPA compliance if serving California users
- [ ] Location: `/src/app/privacy/page.js`

### Terms of Service
- [ ] User agreement for submission (honest reviews, no spam)
- [ ] IP rights (submissions belong to platform)
- [ ] Liability limitations
- [ ] Content moderation policy
- [ ] Account termination policy
- [ ] Location: `/src/app/terms/page.js`

### Community Guidelines
- [ ] What constitutes acceptable submissions
- [ ] Prohibited content (harassment, false info, spam)
- [ ] Consequences for violations
- [ ] Appeal process for rejected submissions
- [ ] Location: `/src/app/community-guidelines/page.js`

### Cookie Policy
- [ ] Analytics cookies (Vercel/Next.js)
- [ ] Authentication cookies
- [ ] Optional consent banner
- [ ] Location: `/src/app/cookies/page.js`

### Data Deletion Policy
- [ ] How users can request account deletion
- [ ] How to delete user submissions
- [ ] Retention period before permanent deletion
- [ ] Location: Add to Privacy Policy or separate page

## Security Tasks

### Database Security
- [ ] Verify Supabase RLS policies are enforced
- [ ] Check that only public INSERT is allowed (no UPDATE/DELETE)
- [ ] Verify service_role can READ/UPDATE/DELETE for admin
- [ ] Test that unauthenticated users cannot read pending submissions

### Email Security
- [ ] Verify Resend API key is secure (not in git)
- [ ] Test email verification tokens cannot be guessed
- [ ] Verify 24-hour token expiration works
- [ ] Test that already-verified tokens cannot be reused

### Admin Dashboard Security
- [ ] Verify localhost-only middleware works on production
- [ ] Test admin password cannot be bypassed
- [ ] Ensure session tokens are sent over HTTPS only
- [ ] Verify no sensitive data in browser console logs

### API Security
- [ ] Check rate limiting on submission endpoints (prevent spam)
- [ ] Verify CORS headers are correct
- [ ] Test for SQL injection (Supabase SDK prevents this)
- [ ] Ensure no sensitive data in error messages

### Frontend Security
- [ ] Check for XSS vulnerabilities in form inputs
- [ ] Verify no hardcoded secrets in component code
- [ ] Check that admin routes redirect unauthenticated users
- [ ] Ensure sensitive emails not exposed in HTML

### Data Protection
- [ ] Implement data encryption at rest (Supabase default: enabled)
- [ ] Ensure backups are working (Supabase automatic)
- [ ] Plan for data breach notification process
- [ ] Document what to do if database is compromised

## Infrastructure Security

### Environment Variables
- [ ] RESEND_API_KEY - kept secret
- [ ] SUPABASE_SERVICE_ROLE_KEY - kept secret
- [ ] ADMIN_PASSWORD - strong and unique
- [ ] All secrets in Vercel environment, not in .env.local on production

### Vercel Configuration
- [ ] Set environment variables in Vercel dashboard
- [ ] Enable automatic deployments from main branch
- [ ] Configure branch protection (require review for main)
- [ ] Monitor Vercel logs for suspicious activity

### Third-Party Services
- [ ] Resend: Verify SPF/DKIM/DMARC DNS records
- [ ] Resend: Enable bounce/complaint handling
- [ ] Supabase: Enable audit logs
- [ ] Monitor for data breaches in third-party services

## Testing Checklist

### Email Flow
- [ ] Submission triggers verification email
- [ ] Email arrives within 1 minute
- [ ] Verification link works and marks email_verified=true
- [ ] Already-verified link shows appropriate message
- [ ] Expired token shows error

### Admin Flow
- [ ] Admin page requires correct password
- [ ] Admin can see pending/approved/rejected tabs
- [ ] Admin can approve submission (email sent, data published)
- [ ] Admin can reject submission (email sent with reason)
- [ ] Localhost-only: production domain redirects to homepage

### Form Validation
- [ ] Invalid email rejected
- [ ] Rating fields required
- [ ] Too-short text rejected
- [ ] Salary min/max validated
- [ ] Errors display next to fields

### Data Integrity
- [ ] Approved school reviews appear on school pages
- [ ] Approved local intel appears on city pages
- [ ] Deleted submissions cascaded properly
- [ ] No data duplication

## Compliance Standards

### GDPR (if serving EU users)
- [ ] Right to access (users can request their data)
- [ ] Right to delete (users can request deletion)
- [ ] Data minimization (only collect necessary data)
- [ ] Transparency (clear privacy policy)

### CCPA (if serving California users)
- [ ] Right to know (disclose what data is collected)
- [ ] Right to delete (user deletion requests)
- [ ] Right to opt-out (prevent data sales)
- [ ] Non-discrimination (no penalties for opting out)

## Status
- [ ] All legal documents created and reviewed
- [ ] All security measures verified
- [ ] All tests passing
- [ ] Security audit completed
- [ ] Ready for production launch
