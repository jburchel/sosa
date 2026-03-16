import { Resend } from 'resend';

const ADMIN_EMAILS = ['squareonetigers@gmail.com'];
const FROM_EMAIL = process.env.FROM_EMAIL || 'SOSA Basketball <noreply@sosabasketball.org>';

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

export async function sendVolunteerNotification(application: {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  cityStateZip: string;
  dateOfBirth: string;
  areasOfInterest: string[];
  experience?: string;
  whyVolunteer: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelationship: string;
  submittedAt: string;
}) {
  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAILS,
      subject: `New Volunteer Application: ${application.fullName}`,
      html: `
        <h2>New Volunteer Application</h2>
        <p><strong>Submitted at:</strong> ${new Date(application.submittedAt).toLocaleString()}</p>
        <hr />
        <h3>Personal Information</h3>
        <p><strong>Full Name:</strong> ${application.fullName}</p>
        <p><strong>Phone:</strong> ${application.phone}</p>
        <p><strong>Email:</strong> ${application.email}</p>
        <p><strong>Address:</strong> ${application.address}</p>
        <p><strong>City/State/Zip:</strong> ${application.cityStateZip}</p>
        <p><strong>Date of Birth:</strong> ${application.dateOfBirth}</p>
        <h3>Areas of Interest</h3>
        <p>${application.areasOfInterest.length > 0 ? application.areasOfInterest.join(', ') : 'None selected'}</p>
        ${application.experience ? `<h3>Experience Working with Youth</h3><p>${application.experience}</p>` : ''}
        <h3>Why Volunteer with SOSA?</h3>
        <p>${application.whyVolunteer}</p>
        <h3>Emergency Contact</h3>
        <p><strong>Name:</strong> ${application.emergencyName}</p>
        <p><strong>Phone:</strong> ${application.emergencyPhone}</p>
        <p><strong>Relationship:</strong> ${application.emergencyRelationship}</p>
        <hr />
        <p><em>This application was digitally signed and is stored in the SOSA admin dashboard.</em></p>
      `,
    });
  } catch (error) {
    console.error('Failed to send volunteer notification email:', error);
  }
}

const TIER_LABELS: Record<string, string> = {
  bronze: 'Bronze ($250)',
  silver: 'Silver ($500)',
  gold: 'Gold ($1,000)',
};

export async function sendSponsorNotification(application: {
  businessName: string;
  contactName: string;
  title?: string;
  phone: string;
  email: string;
  address?: string;
  cityStateZip?: string;
  website?: string;
  sponsorshipTier?: string;
  message?: string;
  submittedAt: string;
}) {
  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAILS,
      subject: `New Sponsor Application: ${application.businessName}`,
      html: `
        <h2>New Sponsorship Application</h2>
        <p><strong>Submitted at:</strong> ${new Date(application.submittedAt).toLocaleString()}</p>
        <hr />
        <h3>Business Information</h3>
        <p><strong>Business Name:</strong> ${application.businessName}</p>
        <p><strong>Contact Name:</strong> ${application.contactName}</p>
        ${application.title ? `<p><strong>Title:</strong> ${application.title}</p>` : ''}
        <p><strong>Phone:</strong> ${application.phone}</p>
        <p><strong>Email:</strong> ${application.email}</p>
        ${application.address ? `<p><strong>Address:</strong> ${application.address}</p>` : ''}
        ${application.cityStateZip ? `<p><strong>City/State/Zip:</strong> ${application.cityStateZip}</p>` : ''}
        ${application.website ? `<p><strong>Website:</strong> ${application.website}</p>` : ''}
        <h3>Sponsorship Tier</h3>
        <p>${application.sponsorshipTier ? TIER_LABELS[application.sponsorshipTier] || application.sponsorshipTier : 'Not selected'}</p>
        ${application.message ? `<h3>Additional Comments</h3><p>${application.message}</p>` : ''}
        <hr />
        <p><em>This application was digitally signed and is stored in the SOSA admin dashboard.</em></p>
      `,
    });
  } catch (error) {
    console.error('Failed to send sponsor notification email:', error);
  }
}
