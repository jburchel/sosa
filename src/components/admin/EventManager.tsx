'use client';

import { useState, useEffect, useRef } from 'react';

interface EventData {
  id: string;
  title: string;
  imageFilename: string;
  requiresSignup: boolean;
  createdAt: string;
}

interface SignupData {
  id: string;
  eventId: string;
  name: string;
  age: number;
  tshirtSize: string;
  submittedAt: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function EventManager() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [signups, setSignups] = useState<SignupData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  // Create form state
  const [title, setTitle] = useState('');
  const [requiresSignup, setRequiresSignup] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function fetchData() {
    try {
      const [eventsRes, signupsRes] = await Promise.all([
        fetch('/api/admin/events'),
        fetch('/api/admin/event-signups'),
      ]);
      if (eventsRes.ok) {
        const data = await eventsRes.json();
        setEvents(data.events ?? []);
      }
      if (signupsRes.ok) {
        const data = await signupsRes.json();
        setSignups(data.signups ?? []);
      }
    } catch {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file || !title.trim()) return;

    setCreating(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title.trim());
      formData.append('requiresSignup', String(requiresSignup));

      const res = await fetch('/api/admin/events', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create event');
        return;
      }

      setTitle('');
      setRequiresSignup(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await fetchData();
    } catch {
      setError('Failed to create event');
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(eventId: string, force = false) {
    try {
      const res = await fetch('/api/admin/events', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, confirm: force }),
      });

      const data = await res.json();

      if (data.warning && !force) {
        const confirmed = window.confirm(
          `This event has ${data.signupCount} signup(s). Are you sure you want to delete it and all associated signups?`
        );
        if (confirmed) {
          await handleDelete(eventId, true);
        }
        return;
      }

      if (!res.ok) {
        setError(data.error || 'Failed to delete event');
        return;
      }

      await fetchData();
    } catch {
      setError('Failed to delete event');
    }
  }

  function getSignupsForEvent(eventId: string) {
    return signups.filter((s) => s.eventId === eventId);
  }

  function handleCopyLink(eventId: string) {
    const url = `${window.location.origin}/events/${eventId}/signup`;
    navigator.clipboard.writeText(url);
    alert('Sign-up link copied to clipboard!');
  }

  function handleExportCSV(eventId: string) {
    window.open(`/api/admin/event-signups?eventId=${eventId}&format=csv`, '_blank');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-sosa-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded mb-6 text-sm">
          {error}
          <button onClick={() => setError('')} className="ml-2 text-red-400 hover:text-red-200">
            &times;
          </button>
        </div>
      )}

      {/* Create Event Form */}
      <div className="bg-sosa-gray border border-gray-800 rounded-lg p-5 mb-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
          Create Event
        </h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Event Flyer Image</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              required
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-sosa-orange file:text-white file:font-medium file:cursor-pointer hover:file:bg-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              required
              className="w-full bg-sosa-dark border border-gray-700 rounded px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-sosa-orange transition-colors text-sm"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={requiresSignup}
              onChange={(e) => setRequiresSignup(e.target.checked)}
              className="w-4 h-4 rounded border-gray-700 bg-sosa-dark text-sosa-orange focus:ring-sosa-orange"
            />
            <span className="text-sm text-gray-300">Enable sign-up form</span>
          </label>
          <button
            type="submit"
            disabled={creating}
            className="bg-sosa-orange hover:bg-orange-500 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded transition-colors text-sm"
          >
            {creating ? 'Creating…' : 'Create Event'}
          </button>
        </form>
      </div>

      {/* Events List */}
      <p className="text-gray-400 text-sm mb-5">
        <span className="text-sosa-orange font-semibold">{events.length}</span>{' '}
        {events.length === 1 ? 'event' : 'events'}
      </p>

      {events.length === 0 ? (
        <div className="bg-sosa-gray border border-gray-800 rounded-lg px-6 py-12 text-center">
          <p className="text-gray-500">No events created yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => {
            const eventSignups = getSignupsForEvent(event.id);
            const isExpanded = expandedEvent === event.id;

            return (
              <div
                key={event.id}
                className="bg-sosa-gray border border-gray-800 rounded-lg overflow-hidden"
              >
                {/* Event Header */}
                <div className="px-5 py-4 flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 flex-shrink-0 rounded overflow-hidden bg-sosa-dark">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/api/images/${event.imageFilename}`}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">{event.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(event.createdAt)}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {event.requiresSignup && (
                        <span className="text-xs bg-sosa-orange/20 text-sosa-orange px-2 py-0.5 rounded">
                          Sign-up enabled
                        </span>
                      )}
                      {eventSignups.length > 0 && (
                        <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded">
                          {eventSignups.length} signup{eventSignups.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-xs text-red-400 hover:text-red-300 border border-red-800 hover:border-red-600 px-3 py-1.5 rounded transition-colors"
                    >
                      Delete
                    </button>
                    {event.requiresSignup && (
                      <>
                        <button
                          onClick={() => handleCopyLink(event.id)}
                          className="text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded transition-colors"
                        >
                          Copy Link
                        </button>
                        {eventSignups.length > 0 && (
                          <>
                            <button
                              onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                              className="text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded transition-colors"
                            >
                              {isExpanded ? 'Hide' : 'View'} Signups
                            </button>
                            <button
                              onClick={() => handleExportCSV(event.id)}
                              className="text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded transition-colors"
                            >
                              Export CSV
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Expanded Signups */}
                {isExpanded && eventSignups.length > 0 && (
                  <div className="bg-sosa-dark border-t border-gray-800 px-5 py-4">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Signups</p>
                    <div className="space-y-2">
                      {eventSignups.map((signup) => (
                        <div
                          key={signup.id}
                          className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm"
                        >
                          <span className="text-white font-medium">{signup.name}</span>
                          <span className="text-gray-400">Age: {signup.age}</span>
                          <span className="text-gray-400">Shirt: {signup.tshirtSize}</span>
                          <span className="text-gray-500 text-xs">{formatDate(signup.submittedAt)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
