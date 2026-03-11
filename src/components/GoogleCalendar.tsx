interface GoogleCalendarProps {
  calendarId?: string;
}

export default function GoogleCalendar({ calendarId }: GoogleCalendarProps) {
  if (!calendarId) {
    return (
      <div className="bg-sosa-gray border border-gray-700 rounded-lg p-12 text-center">
        <div className="text-4xl mb-4">📅</div>
        <h3 className="text-xl font-bold uppercase tracking-wide mb-2">
          Calendar Coming Soon
        </h3>
        <p className="text-gray-400">
          Check back for our practice and game schedule.
        </p>
      </div>
    );
  }

  const src = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(calendarId)}&ctz=America/New_York&bgcolor=%23000000`;

  return (
    <div className="w-full rounded-lg overflow-hidden border border-gray-700">
      <iframe
        src={src}
        style={{ border: 0 }}
        width="100%"
        height="600"
        frameBorder="0"
        scrolling="no"
        title="SOSA Basketball Calendar"
      />
    </div>
  );
}
