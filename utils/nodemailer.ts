import nodemailer from 'nodemailer';

const email = process.env.SMTP_EMAIL;
const pass = process.env.SMTP_PASSWORD;

// Initialize the reusable transporter using Gmail's SMTP service
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email,
    pass: pass,
  },
});

// Helper function to return a clean HTML template for the email confirmation
export const generateAcknowledgementHTML = (userName: string, ticketTitle: string, ticketId: string) => {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e4e4e7; border-radius: 16px; background-color: #ffffff;">
      <div style="margin-bottom: 24px;">
        <span style="background-color: #eff6ff; color: #1d4ed8; padding: 6px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; tracking-wide: 0.05em;">TICKET CONFIRMATION</span>
      </div>
      
      <h2 style="color: #09090b; font-size: 20px; font-weight: 700; margin: 0 0 12px 0; line-height: 1.25;">Hi ${userName},</h2>
      <p style="color: #71717a; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">We have received your support request regarding <strong>"${ticketTitle}"</strong>. Our team has been notified and is looking into it.</p>
      
      <div style="background-color: #f4f4f5; border: 1px solid #e4e4e7; padding: 16px; border-radius: 12px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 500;">Your Ticket Reference ID</p>
        <p style="margin: 4px 0 0 0; font-size: 16px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 700; color: #18181b;">${ticketId}</p>
      </div>
      
      <p style="color: #a1a1aa; font-size: 12px; margin: 0; border-top: 1px solid #e4e4e7; padding-top: 16px;">This is an automated response from our Help Desk. Please do not reply directly to this email.</p>
    </div>
  `;
};