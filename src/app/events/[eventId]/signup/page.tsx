'use client';

import { useState, useEffect, use } from 'react';
import EventSignupForm from '@/components/EventSignupForm';

interface EventData {
  id: string;
  title: string;
  imageFilename: string;
  requiresSignup: boolean;
}

export default function EventSignupPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = use(params);
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch('/api/events');
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        const found = data.events?.find((e: EventData) => e.id === eventId);
        if (!found || !found.requiresSignup) {
          setNotFound(true);
          return;
        }
        setEvent(found);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sosa-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Event Not Found</h1>
          <p className="text-gray-400 mb-6">
            This event doesn&apos;t exist or doesn&apos;t accept sign-ups.
          </p>
          <a
            href="/events"
            className="text-sosa-orange hover:text-orange-400 transition-colors"
          >
            &larr; Back to Events
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="py-16 px-4">
        <div className="max-w-lg mx-auto">
          <a
            href="/events"
            className="text-sm text-gray-400 hover:text-white transition-colors mb-6 inline-block"
          >
            &larr; Back to Events
          </a>
          <h1 className="text-2xl font-bold uppercase tracking-wide mb-2">
            Sign Up
          </h1>
          <p className="text-gray-400 mb-8">{event.title}</p>
          <EventSignupForm eventId={event.id} eventTitle={event.title} />
        </div>
      </section>
    </div>
  );
}
