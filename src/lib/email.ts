import { Resend } from 'resend';

const ADMIN_EMAILS = ['jburchel@gmail.com', 'vernaspivey24@gmail.com'];
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendWaiverNotification(waiver: {
  playerName: string;
  playerDob: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  emergencyName: string;
  emergencyPhone: string;
  medicalConditions?: string;
  signedAt: string;
}) {
  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAILS,
      subject: `New Waiver Signed: ${waiver.playerName}`,
      html: `
        <h2>New Waiver Submission</h2>
        <p><strong>Signed at:</strong> ${new Date(waiver.signedAt).toLocaleString()}</p>
        <hr />
        <h3>Player Information</h3>
        <p><strong>Player Name:</strong> ${waiver.playerName}</p>
        <p><strong>Date of Birth:</strong> ${waiver.playerDob}</p>
        <h3>Parent/Guardian</h3>
        <p><strong>Name:</strong> ${waiver.parentName}</p>
        <p><strong>Email:</strong> ${waiver.parentEmail}</p>
        <p><strong>Phone:</strong> ${waiver.parentPhone}</p>
        <h3>Emergency Contact</h3>
        <p><strong>Name:</strong> ${waiver.emergencyName}</p>
        <p><strong>Phone:</strong> ${waiver.emergencyPhone}</p>
        ${waiver.medicalConditions ? `<h3>Medical Conditions</h3><p>${waiver.medicalConditions}</p>` : ''}
        <hr />
        <p><em>This waiver was digitally signed and is stored in the SOSA admin dashboard.</em></p>
      `,
    });
  } catch (error) {
    console.error('Failed to send waiver notification email:', error);
  }
}

export async function sendContactNotification(contact: {
  name: string;
  email: string;
  subject?: string;
  message: string;
  submittedAt: string;
}) {
  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAILS,
      subject: `New Contact: ${contact.subject || 'SOSA Website Inquiry'}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Submitted at:</strong> ${new Date(contact.submittedAt).toLocaleString()}</p>
        <hr />
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Subject:</strong> ${contact.subject || 'N/A'}</p>
        <h3>Message</h3>
        <p>${contact.message}</p>
      `,
    });
  } catch (error) {
    console.error('Failed to send contact notification email:', error);
  }
}
