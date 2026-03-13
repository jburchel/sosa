import type { Metadata } from 'next';
import SectionHeading from '@/components/SectionHeading';
import GoogleCalendar from '@/components/GoogleCalendar';
import WaiverForm from '@/components/WaiverForm';

export const metadata: Metadata = {
  title: 'Events & Schedule | SOSA Basketball',
  description:
    'Stay up to date with SOSA Basketball practices, games, and events. Complete your player waiver form online.',
};

export default function EventsPage() {
  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="py-16 px-4 bg-sosa-dark border-b border-gray-800">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="Events & Schedule"
            subtitle="Stay connected with SOSA Basketball — practices, games, and everything in between."
          />
        </div>
      </section>

      {/* Calendar Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold uppercase tracking-wide mb-6">
            Practice &amp; Game Calendar
          </h2>
          <GoogleCalendar calendarId="squareonetigers@gmail.com" />
        </div>
      </section>

      {/* Upcoming Events Placeholder */}
      <section className="py-16 px-4 bg-sosa-gray">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold uppercase tracking-wide mb-6">
            Upcoming Events
          </h2>
          <div className="border border-gray-700 rounded-lg p-10 text-center">
            <p className="text-gray-400 text-lg">
              Events will be posted here. Follow us on social media for updates.
            </p>
          </div>
        </div>
      </section>

      {/* Waiver Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold uppercase tracking-wide mb-4">
            Player Waiver Form
          </h2>
          <p className="text-gray-400 mb-8">
            Complete the digital waiver form below. Your electronic signature is
            legally binding under the{' '}
            <span className="text-white font-medium">ESIGN Act</span>.
          </p>
          <WaiverForm />
        </div>
      </section>
    </div>
  );
}
