const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://schooltransparency.com';
const LOGO_URL = `${BASE_URL}/logos-edu.png`;

// Shared styles for all emails
const sharedStyles = `
  body { font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #F5F5F5; }
  .wrapper { background-color: #F5F5F5; padding: 30px 0; }
  .container { max-width: 600px; margin: 0 auto; }
  .header { background: #1B2A4A; padding: 28px 30px; text-align: center; border-radius: 8px 8px 0 0; }
  .header-logo { display: inline-block; width: 44px; height: 44px; background: #2A9D8F; color: #ffffff; font-size: 22px; font-weight: bold; line-height: 44px; text-align: center; border-radius: 6px; vertical-align: middle; }
  .header-title { color: #ffffff; font-size: 22px; font-weight: bold; margin: 0; display: inline-block; vertical-align: middle; margin-left: 12px; }
  .content { background: #ffffff; padding: 32px 30px; }
  .footer { text-align: center; padding: 24px 30px; background: #ffffff; border-top: 1px solid #eeeeee; border-radius: 0 0 8px 8px; }
  .footer-logo { width: 80px; height: auto; margin-bottom: 8px; }
  .footer-text { color: #999999; font-size: 13px; margin: 0; }
  .button { display: inline-block; background: #2A9D8F; color: #ffffff; padding: 14px 32px; text-decoration: none; font-weight: bold; font-size: 16px; border-radius: 6px; margin: 20px 0; }
  h2 { color: #1B2A4A; margin-top: 0; }
`;

function emailShell(headerSubtitle, bodyHtml, footerExtra = '') {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${sharedStyles}</style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <table cellpadding="0" cellspacing="0" border="0" align="center"><tr>
          <td style="width:44px;height:44px;background:#2A9D8F;color:#ffffff;font-size:22px;font-weight:bold;text-align:center;border-radius:6px;line-height:44px;">ST</td>
          <td style="padding-left:12px;"><span style="color:#ffffff;font-size:22px;font-weight:bold;">School Transparency</span></td>
        </tr></table>
        ${headerSubtitle ? `<p style="color:#94a3b8;font-size:14px;margin:10px 0 0 0;">${headerSubtitle}</p>` : ''}
      </div>
      <div class="content">
        ${bodyHtml}
      </div>
      <div class="footer">
        <img src="${LOGO_URL}" alt="Logos Edu" width="80" style="width:80px;height:auto;margin-bottom:8px;display:block;margin-left:auto;margin-right:auto;" />
        <p style="color:#999999;font-size:13px;margin:4px 0 0 0;">A Logos Edu project</p>
        ${footerExtra}
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function getVerificationEmail(submitterEmail, verificationToken, submissionType, cityName) {
  const verifyUrl = `${BASE_URL}/api/submissions/verify?token=${verificationToken}`;
  const typeLabel = submissionType.replace(/_/g, ' ');

  const bodyHtml = `
    <h2>Verify your submission</h2>
    <p>Thanks for contributing to School Transparency! You submitted a <strong>${typeLabel}</strong> for <strong>${cityName}</strong>.</p>
    <p>Click the button below to verify your email and complete your submission:</p>
    <div style="text-align:center;">
      <a href="${verifyUrl}" style="display:inline-block;background:#2A9D8F;color:#ffffff;padding:14px 32px;text-decoration:none;font-weight:bold;font-size:16px;border-radius:6px;margin:20px 0;">Verify My Email</a>
    </div>
    <p style="font-size:13px;color:#999999;">Or copy this link:<br/><a href="${verifyUrl}" style="color:#2A9D8F;word-break:break-all;">${verifyUrl}</a></p>
    <hr style="margin:28px 0;border:none;border-top:1px solid #eeeeee;" />
    <p style="font-weight:bold;color:#1B2A4A;">What happens next?</p>
    <ul style="color:#555555;">
      <li>Your submission will be reviewed by our team (usually within 48 hours)</li>
      <li>We check for accuracy, helpfulness, and community guidelines</li>
      <li>Once approved, your contribution appears on the site</li>
      <li>You'll get an email when it's published</li>
    </ul>
    <p style="font-size:13px;color:#999999;margin-top:24px;">This link expires in 24 hours. If you didn't submit anything, you can ignore this email.</p>
  `;

  return {
    from: 'School Transparency <submissions@schooltransparency.com>',
    to: submitterEmail,
    subject: 'Verify your submission — School Transparency',
    html: emailShell('Email Verification', bodyHtml),
    text: `Thanks for contributing to School Transparency!

You submitted a ${typeLabel} for ${cityName}.

Verify your email to complete your submission:
${verifyUrl}

What happens next?
- Your submission will be reviewed by our team (usually within 48 hours)
- We check for accuracy, helpfulness, and community guidelines
- Once approved, your contribution appears on the site
- You'll get an email when it's published

This link expires in 24 hours.

School Transparency — A Logos Edu project`
  };
}

export function getApprovalEmail(submitterEmail, submissionType, cityName) {
  const typeLabel = submissionType.replace(/_/g, ' ');

  const bodyHtml = `
    <div style="text-align:center;margin-bottom:24px;">
      <span style="display:inline-block;background:#2A9D8F;color:#ffffff;font-size:14px;font-weight:bold;padding:6px 16px;border-radius:20px;">Approved</span>
    </div>
    <h2 style="text-align:center;">Your submission is live!</h2>
    <p>Your <strong>${typeLabel}</strong> for <strong>${cityName}</strong> has been approved and is now live on School Transparency.</p>
    <p>Thank you for helping teachers make better-informed decisions about where to teach internationally. Real contributions from real teachers are what make this platform work.</p>
    <p><strong>Want to contribute more?</strong> We're always looking for honest, helpful insights from teachers on the ground.</p>
    <div style="text-align:center;">
      <a href="${BASE_URL}" style="display:inline-block;background:#2A9D8F;color:#ffffff;padding:14px 32px;text-decoration:none;font-weight:bold;font-size:16px;border-radius:6px;margin:20px 0;">Browse Cities</a>
    </div>
    <p style="margin-top:24px;color:#555555;">-- The School Transparency Team</p>
  `;

  return {
    from: 'School Transparency <submissions@schooltransparency.com>',
    to: submitterEmail,
    subject: 'Your submission has been approved!',
    html: emailShell('Submission Update', bodyHtml),
    text: `Great news! Your ${typeLabel} for ${cityName} has been approved and is now live on School Transparency.

Thank you for helping teachers make better-informed decisions about where to teach internationally.

Want to contribute more? We're always looking for honest, helpful insights from teachers on the ground.

-- The School Transparency Team

School Transparency — A Logos Edu project`
  };
}

export function getRejectionEmail(submitterEmail, submissionType, cityName, reason) {
  const typeLabel = submissionType.replace(/_/g, ' ');

  const bodyHtml = `
    <h2>Update on your submission</h2>
    <p>Thanks for your <strong>${typeLabel}</strong> submission for <strong>${cityName}</strong>.</p>
    <p>Unfortunately, we weren't able to approve this submission:</p>
    <div style="background:#fef2f2;padding:16px;border-left:4px solid #ef4444;margin:20px 0;border-radius:0 4px 4px 0;">
      <p style="margin:0;color:#991b1b;">${reason}</p>
    </div>
    <p>If you'd like to resubmit with updates, we'd love to hear from you again. Every contribution helps build a better resource for teachers.</p>
    <div style="text-align:center;">
      <a href="${BASE_URL}" style="display:inline-block;background:#2A9D8F;color:#ffffff;padding:14px 32px;text-decoration:none;font-weight:bold;font-size:16px;border-radius:6px;margin:20px 0;">Visit School Transparency</a>
    </div>
    <p style="margin-top:24px;color:#555555;">-- The School Transparency Team</p>
  `;

  return {
    from: 'School Transparency <submissions@schooltransparency.com>',
    to: submitterEmail,
    subject: 'Update on your submission — School Transparency',
    html: emailShell('Submission Update', bodyHtml),
    text: `Thanks for your ${typeLabel} submission for ${cityName}.

Unfortunately, we weren't able to approve this submission:

${reason}

If you'd like to resubmit with updates, we'd love to hear from you again.

-- The School Transparency Team

School Transparency — A Logos Edu project`
  };
}
