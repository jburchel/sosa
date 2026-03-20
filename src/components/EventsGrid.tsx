'use client';

import { useState, useEffect } from 'react';

interface EventData {
  id: string;
  title: string;
  imageFilename: string;
  requiresSignup: boolean;
  createdAt: string;
}

export default function EventsGrid() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/events');
        if (res.ok) {
          const data = await res.json();
          setEvents(data.events ?? []);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-sosa-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="border border-gray-700 rounded-lg p-10 text-center">
        <p className="text-gray-400 text-lg">
          No upcoming events. Follow us on social media for updates.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <div
          key={event.id}
          className="bg-sosa-dark border border-gray-800 rounded-lg overflow-hidden group"
        >
          {/* Event Image */}
          <div className="aspect-[4/5] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/images/${event.imageFilename}`}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Event Info */}
          <div className="p-4">
            <h3 className="font-semibold text-white text-lg mb-3">{event.title}</h3>
            {event.requiresSignup && (
              <a
                href={`/events/${event.id}/signup`}
                className="inline-block bg-sosa-orange hover:bg-orange-500 text-white font-semibold px-5 py-2.5 rounded transition-colors text-sm"
              >
                Sign Up
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
