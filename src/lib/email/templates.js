const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://schooltransparency.com';

export function getVerificationEmail(submitterEmail, verificationToken, submissionType, cityName) {
  const verifyUrl = `${BASE_URL}/api/submissions/verify?token=${verificationToken}`;

  return {
    from: 'School Transparency <submissions@schooltransparency.com>',
    to: submitterEmail,
    subject: 'Verify your submission - School Transparency',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f97316; color: white; padding: 30px; text-align: center; border: 4px solid #000; }
          .content { background: white; padding: 30px; border: 4px solid #000; border-top: none; }
          .button { display: inline-block; background: #f97316; color: white; padding: 15px 30px; text-decoration: none; font-weight: bold; border: 3px solid #000; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 32px;">School Transparency</h1>
          </div>
          <div class="content">
            <h2>Verify Your Submission</h2>
            <p>Thanks for contributing to School Transparency! You submitted a <strong>${submissionType.replace(/_/g, ' ')}</strong> for <strong>${cityName}</strong>.</p>

            <p>Click the button below to verify your email and complete your submission:</p>

            <a href="${verifyUrl}" class="button">Verify My Email</a>

            <p style="font-size: 14px; color: #666;">Or copy this link: <br/>${verifyUrl}</p>

            <hr style="margin: 30px 0; border: none; border-top: 2px solid #eee;" />

            <p><strong>What happens next?</strong></p>
            <ul>
              <li>Your submission will be reviewed by our team (usually within 48 hours)</li>
              <li>We check for accuracy, helpfulness, and community guidelines compliance</li>
              <li>Once approved, your contribution will appear on the site</li>
              <li>You'll get a notification email when your submission is published</li>
            </ul>

            <p style="font-size: 14px; color: #666; margin-top: 30px;">This verification link expires in 24 hours. If you didn't submit anything, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>School Transparency | Data-driven insights for international teachers</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Thanks for contributing to School Transparency!

You submitted a ${submissionType.replace(/_/g, ' ')} for ${cityName}.

Verify your email to complete your submission:
${verifyUrl}

What happens next?
- Your submission will be reviewed by our team (usually within 48 hours)
- We check for accuracy, helpfulness, and community guidelines compliance
- Once approved, your contribution will appear on the site
- You'll get a notification email when your submission is published

This verification link expires in 24 hours.

School Transparency | Data-driven insights for international teachers`
  };
}

export function getApprovalEmail(submitterEmail, submissionType, cityName) {
  return {
    from: 'School Transparency <submissions@schooltransparency.com>',
    to: submitterEmail,
    subject: 'Your submission has been approved! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 30px; text-align: center; border: 4px solid #000; }
          .content { background: white; padding: 30px; border: 4px solid #000; border-top: none; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 32px;">🎉 Submission Approved!</h1>
          </div>
          <div class="content">
            <p>Great news! Your <strong>${submissionType.replace(/_/g, ' ')}</strong> for <strong>${cityName}</strong> has been approved and is now live on School Transparency.</p>

            <p>Thank you for helping teachers make better-informed decisions about where to teach internationally.</p>

            <p><strong>Want to contribute more?</strong> We're always looking for honest, helpful insights from teachers on the ground.</p>

            <p style="margin-top: 30px;">— The School Transparency Team</p>
          </div>
          <div class="footer">
            <p>School Transparency | Data-driven insights for international teachers</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Great news! Your ${submissionType.replace(/_/g, ' ')} for ${cityName} has been approved and is now live on School Transparency.

Thank you for helping teachers make better-informed decisions about where to teach internationally.

Want to contribute more? We're always looking for honest, helpful insights from teachers on the ground.

— The School Transparency Team`
  };
}

export function getRejectionEmail(submitterEmail, submissionType, cityName, reason) {
  return {
    from: 'School Transparency <submissions@schooltransparency.com>',
    to: submitterEmail,
    subject: 'Update on your submission - School Transparency',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ef4444; color: white; padding: 30px; text-align: center; border: 4px solid #000; }
          .content { background: white; padding: 30px; border: 4px solid #000; border-top: none; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 32px;">Submission Update</h1>
          </div>
          <div class="content">
            <p>Thanks for your submission of a <strong>${submissionType.replace(/_/g, ' ')}</strong> for <strong>${cityName}</strong>.</p>

            <p>Unfortunately, we weren't able to approve this submission for the following reason:</p>

            <div style="background: #fee2e2; padding: 15px; border-left: 4px solid #ef4444; margin: 20px 0;">
              ${reason}
            </div>

            <p>If you'd like to resubmit with updates, we'd love to hear from you again!</p>

            <p style="margin-top: 30px;">— The School Transparency Team</p>
          </div>
          <div class="footer">
            <p>School Transparency | Data-driven insights for international teachers</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Thanks for your submission of a ${submissionType.replace(/_/g, ' ')} for ${cityName}.

Unfortunately, we weren't able to approve this submission for the following reason:

${reason}

If you'd like to resubmit with updates, we'd love to hear from you again!

— The School Transparency Team`
  };
}
