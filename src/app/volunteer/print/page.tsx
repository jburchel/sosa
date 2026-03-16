import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Volunteer Application - Print | SOSA Basketball',
};

export default function VolunteerPrintPage() {
  return (
    <>
      <style>{`
        /* Hide site chrome for this page */
        nav, footer { display: none !important; }
        main { padding-top: 0 !important; }
        body { background: #fff !important; color: #000 !important; }

        .print-page {
          font-family: 'Times New Roman', Times, serif;
          color: #000;
          background: #fff;
          line-height: 1.5;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        .print-page h1 { font-size: 22px; font-weight: bold; text-align: center; margin-bottom: 4px; }
        .print-page h2 { font-size: 16px; font-weight: bold; margin: 0 0 12px; text-align: center; font-weight: normal; }
        .print-page h3 { font-size: 14px; font-weight: bold; font-style: italic; margin: 24px 0 8px; }
        .print-page p { font-size: 12px; margin: 0 0 12px; }
        .print-page table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        .print-page td { border: 1px solid #000; padding: 6px 10px; font-size: 12px; }
        .print-page td:first-child { width: 140px; }
        .field-value { min-height: 18px; }
        .checkbox-grid { columns: 2; column-gap: 20px; margin-bottom: 16px; }
        .checkbox-item { font-size: 12px; margin-bottom: 8px; break-inside: avoid; display: flex; align-items: center; gap: 8px; }
        .checkbox-box {
          width: 14px;
          height: 14px;
          border: 1.5px solid #000;
          display: inline-block;
          flex-shrink: 0;
          background: #fff;
        }
        .write-lines { border-bottom: 1px solid #000; height: 24px; margin-bottom: 6px; }
        .print-hint {
          background: #f0f0f0;
          padding: 12px 20px;
          text-align: center;
          font-family: sans-serif;
          font-size: 14px;
          margin-bottom: 20px;
          border-radius: 8px;
        }
        .print-hint button {
          margin-left: 12px;
          background: #e87722;
          color: #000;
          border: none;
          padding: 8px 20px;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
        }

        @media print {
          .print-page { padding: 0; max-width: 100%; }
          .print-hint { display: none !important; }
        }
      `}</style>

      <div className="print-page">
        {/* Screen-only print hint */}
        <div className="print-hint">
          Use <strong>Ctrl+P</strong> (or <strong>Cmd+P</strong> on Mac) to print or save as PDF.
          <button onClick={undefined}>Print</button>
          <script dangerouslySetInnerHTML={{ __html: `document.querySelector('.print-hint button').onclick = function() { window.print(); }` }} />
        </div>

        {/* Header */}
        <h1>SOSA Basketball (Square One Sports Academy)</h1>
        <h2>Volunteer Application</h2>

        <p>
          Thank you for your interest in volunteering with SOSA Basketball. SOSA is committed to developing
          youth through athletics, mentorship, leadership, and community service. Please complete the
          information below.
        </p>

        {/* Personal Info Table */}
        <table>
          <tbody>
            <tr>
              <td>Full Name:</td>
              <td className="field-value"></td>
            </tr>
            <tr>
              <td>Phone Number:</td>
              <td className="field-value"></td>
            </tr>
            <tr>
              <td>Email Address:</td>
              <td className="field-value"></td>
            </tr>
            <tr>
              <td>Address:</td>
              <td className="field-value"></td>
            </tr>
            <tr>
              <td>City / State / Zip:</td>
              <td className="field-value"></td>
            </tr>
            <tr>
              <td>Date of Birth:</td>
              <td className="field-value"></td>
            </tr>
          </tbody>
        </table>

        {/* Areas of Interest */}
        <h3>Areas of Interest (Check all that apply)</h3>
        <div className="checkbox-grid">
          {[
            'Coach',
            'Assistant Coach',
            'Team Parent',
            'Event Volunteer',
            'Fundraising',
            'Mentorship / Tutoring',
            'Administrative Support',
            'Concessions / Game Day Help',
          ].map((item) => (
            <div key={item} className="checkbox-item">
              <span className="checkbox-box" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* Experience */}
        <h3>Experience Working with Youth</h3>
        <p>Please describe any experience working with children, coaching, mentoring, or community service:</p>
        <div className="write-lines" />
        <div className="write-lines" />
        <div className="write-lines" />

        {/* Why Volunteer */}
        <h3>Why do you want to volunteer with SOSA?</h3>
        <div className="write-lines" />
        <div className="write-lines" />
        <div className="write-lines" />

        {/* Emergency Contact */}
        <h3>Emergency Contact</h3>
        <table>
          <tbody>
            <tr>
              <td>Name:</td>
              <td className="field-value"></td>
            </tr>
            <tr>
              <td>Phone:</td>
              <td className="field-value"></td>
            </tr>
            <tr>
              <td>Relationship:</td>
              <td className="field-value"></td>
            </tr>
          </tbody>
        </table>

        {/* Background Check */}
        <h3>Background Check Authorization</h3>
        <p>
          I understand that because SOSA works with youth, a background check may be required for certain
          volunteer positions. I authorize SOSA Basketball to conduct a background check if necessary.
        </p>

        {/* Code of Conduct */}
        <h3>Volunteer Code of Conduct</h3>
        <p>
          Volunteers agree to treat all athletes with respect, promote positive sportsmanship, follow the policies
          of SOSA Basketball, and maintain appropriate boundaries with youth participants.
        </p>

        {/* Media Release */}
        <h3>Media / Photo Release</h3>
        <p>
          I grant SOSA Basketball permission to use photos or video taken during events or activities for
          promotional, website, or social media purposes.
        </p>

        {/* Signature */}
        <table style={{ marginTop: 24 }}>
          <tbody>
            <tr>
              <td>Volunteer Signature:</td>
              <td className="field-value"></td>
            </tr>
            <tr>
              <td>Date:</td>
              <td className="field-value"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
