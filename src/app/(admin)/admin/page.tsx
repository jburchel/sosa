'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import ImageManager from '@/components/admin/ImageManager';

interface Waiver {
  id: string;
  playerName: string;
  playerDob: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  emergencyName: string;
  emergencyPhone: string;
  medicalConditions?: string;
  signature: string;
  signedAt: string;
  ipAddress?: string;
  userAgent?: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  submittedAt: string;
}

interface Volunteer {
  id: string;
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
  signature: string;
  submittedAt: string;
}

type Tab = 'waivers' | 'contacts' | 'volunteers' | 'images';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:gap-4">
      <span className="text-gray-400 text-xs uppercase tracking-wider min-w-[160px] pt-0.5">
        {label}
      </span>
      <span className="text-white text-sm break-all">{value}</span>
    </div>
  );
}

// ── Login Screen ──────────────────────────────────────────────────────────────

function LoginScreen({
  onLogin,
}: {
  onLogin: (waivers: Waiver[], contacts: Contact[], volunteers: Volunteer[]) => void;
}) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const authRes = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!authRes.ok) {
        const data = await authRes.json();
        setError(data.error || 'Invalid password');
        setLoading(false);
        return;
      }

      // Fetch all data sets after successful login
      const [waiversRes, contactsRes, volunteersRes] = await Promise.all([
        fetch('/api/admin/waivers'),
        fetch('/api/admin/contacts'),
        fetch('/api/admin/volunteers'),
      ]);

      const waiversData = waiversRes.ok ? await waiversRes.json() : { waivers: [] };
      const contactsData = contactsRes.ok ? await contactsRes.json() : { contacts: [] };
      const volunteersData = volunteersRes.ok ? await volunteersRes.json() : { volunteers: [] };

      onLogin(waiversData.waivers ?? [], contactsData.contacts ?? [], volunteersData.volunteers ?? []);
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-sosa-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/images/s1-logo.png"
            alt="SOSA S1 Logo"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>

        {/* Card */}
        <div className="bg-sosa-dark border border-gray-800 rounded-xl p-8">
          <h1 className="text-2xl font-bold text-center mb-2">Admin Login</h1>
          <p className="text-gray-400 text-sm text-center mb-8">
            SOSA Basketball Dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="password" className="block text-sm text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                autoFocus
                className="w-full bg-sosa-dark border border-gray-700 rounded px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-sosa-orange transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-sosa-orange hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded transition-colors"
            >
              {loading ? 'Logging in…' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Waiver Card ───────────────────────────────────────────────────────────────

function WaiverCard({ waiver }: { waiver: Waiver }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-sosa-gray border border-gray-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 hover:bg-gray-800/30 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white truncate">{waiver.playerName}</p>
          <p className="text-sm text-gray-400 mt-0.5">
            Parent: {waiver.parentName} &middot; {waiver.parentEmail}
          </p>
          <p className="text-xs text-gray-500 mt-1">{formatDate(waiver.signedAt)}</p>
        </div>
        <span className="text-gray-400 text-lg mt-1 flex-shrink-0">
          {expanded ? '▲' : '▼'}
        </span>
      </button>

      {expanded && (
        <div className="bg-sosa-dark border-t border-gray-800 px-5 py-5 space-y-3">
          <DetailRow label="Player Name" value={waiver.playerName} />
          <DetailRow label="Date of Birth" value={waiver.playerDob} />
          <DetailRow label="Parent / Guardian" value={waiver.parentName} />
          <DetailRow label="Parent Email" value={waiver.parentEmail} />
          <DetailRow label="Parent Phone" value={waiver.parentPhone} />
          <DetailRow label="Emergency Contact" value={waiver.emergencyName} />
          <DetailRow label="Emergency Phone" value={waiver.emergencyPhone} />
          <DetailRow
            label="Medical Conditions"
            value={waiver.medicalConditions || 'None listed'}
          />
          <DetailRow label="Signature" value={waiver.signature} />
          <DetailRow label="Signed At" value={formatDate(waiver.signedAt)} />
          <DetailRow label="IP Address" value={waiver.ipAddress} />
        </div>
      )}
    </div>
  );
}

// ── Contact Card ──────────────────────────────────────────────────────────────

function ContactCard({ contact }: { contact: Contact }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-sosa-gray border border-gray-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 hover:bg-gray-800/30 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white truncate">{contact.name}</p>
          <p className="text-sm text-gray-400 mt-0.5">
            {contact.email}
            {contact.subject ? ` · ${contact.subject}` : ''}
          </p>
          <p className="text-xs text-gray-500 mt-1">{formatDate(contact.submittedAt)}</p>
        </div>
        <span className="text-gray-400 text-lg mt-1 flex-shrink-0">
          {expanded ? '▲' : '▼'}
        </span>
      </button>

      {expanded && (
        <div className="bg-sosa-dark border-t border-gray-800 px-5 py-5 space-y-3">
          <DetailRow label="Name" value={contact.name} />
          <DetailRow label="Email" value={contact.email} />
          {contact.subject && <DetailRow label="Subject" value={contact.subject} />}
          <DetailRow label="Submitted At" value={formatDate(contact.submittedAt)} />
          <div className="pt-1">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Message</p>
            <p className="text-white text-sm whitespace-pre-wrap leading-relaxed">
              {contact.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Volunteer Card ────────────────────────────────────────────────────────────

function VolunteerCard({ volunteer }: { volunteer: Volunteer }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-sosa-gray border border-gray-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 hover:bg-gray-800/30 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white truncate">{volunteer.fullName}</p>
          <p className="text-sm text-gray-400 mt-0.5">
            {volunteer.email} &middot; {volunteer.areasOfInterest.slice(0, 2).join(', ')}
            {volunteer.areasOfInterest.length > 2 && ` +${volunteer.areasOfInterest.length - 2} more`}
          </p>
          <p className="text-xs text-gray-500 mt-1">{formatDate(volunteer.submittedAt)}</p>
        </div>
        <span className="text-gray-400 text-lg mt-1 flex-shrink-0">
          {expanded ? '▲' : '▼'}
        </span>
      </button>

      {expanded && (
        <div className="bg-sosa-dark border-t border-gray-800 px-5 py-5 space-y-3">
          <DetailRow label="Full Name" value={volunteer.fullName} />
          <DetailRow label="Phone" value={volunteer.phone} />
          <DetailRow label="Email" value={volunteer.email} />
          <DetailRow label="Address" value={volunteer.address} />
          <DetailRow label="City / State / Zip" value={volunteer.cityStateZip} />
          <DetailRow label="Date of Birth" value={volunteer.dateOfBirth} />
          <DetailRow label="Areas of Interest" value={volunteer.areasOfInterest.join(', ')} />
          {volunteer.experience && (
            <div className="pt-1">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Experience</p>
              <p className="text-white text-sm whitespace-pre-wrap leading-relaxed">
                {volunteer.experience}
              </p>
            </div>
          )}
          <div className="pt-1">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Why Volunteer</p>
            <p className="text-white text-sm whitespace-pre-wrap leading-relaxed">
              {volunteer.whyVolunteer}
            </p>
          </div>
          <DetailRow label="Emergency Contact" value={volunteer.emergencyName} />
          <DetailRow label="Emergency Phone" value={volunteer.emergencyPhone} />
          <DetailRow label="Relationship" value={volunteer.emergencyRelationship} />
          <DetailRow label="Signature" value={volunteer.signature} />
          <DetailRow label="Submitted At" value={formatDate(volunteer.submittedAt)} />
        </div>
      )}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function Dashboard({
  waivers,
  contacts,
  volunteers,
  onLogout,
}: {
  waivers: Waiver[];
  contacts: Contact[];
  volunteers: Volunteer[];
  onLogout: () => void;
}) {
  const [activeTab, setActiveTab] = useState<Tab>('waivers');

  return (
    <div className="min-h-screen bg-sosa-black">
      {/* Header */}
      <header className="bg-sosa-dark border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/s1-logo.png"
              alt="SOSA"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="font-bold text-lg tracking-wide">SOSA Admin</span>
          </div>
          <button
            onClick={onLogout}
            className="text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex border-b border-gray-800 mt-2">
          {(['waivers', 'contacts', 'volunteers', 'images'] as Tab[]).map((tab) => {
            const tabLabels: Record<Tab, string> = {
              waivers: 'Waivers',
              contacts: 'Messages',
              volunteers: 'Volunteers',
              images: 'Images',
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? 'border-sosa-orange text-sosa-orange'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tabLabels[tab]}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="py-6">
          {activeTab === 'waivers' && (
            <section>
              <p className="text-gray-400 text-sm mb-5">
                <span className="text-sosa-orange font-semibold">{waivers.length}</span>{' '}
                {waivers.length === 1 ? 'waiver' : 'waivers'} submitted
              </p>
              {waivers.length === 0 ? (
                <EmptyState message="No waivers submitted yet." />
              ) : (
                <div className="space-y-3">
                  {waivers.map((w) => (
                    <WaiverCard key={w.id} waiver={w} />
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === 'contacts' && (
            <section>
              <p className="text-gray-400 text-sm mb-5">
                <span className="text-sosa-orange font-semibold">{contacts.length}</span>{' '}
                {contacts.length === 1 ? 'message' : 'messages'} received
              </p>
              {contacts.length === 0 ? (
                <EmptyState message="No contact messages yet." />
              ) : (
                <div className="space-y-3">
                  {contacts.map((c) => (
                    <ContactCard key={c.id} contact={c} />
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === 'volunteers' && (
            <section>
              <p className="text-gray-400 text-sm mb-5">
                <span className="text-sosa-orange font-semibold">{volunteers.length}</span>{' '}
                {volunteers.length === 1 ? 'application' : 'applications'} received
              </p>
              {volunteers.length === 0 ? (
                <EmptyState message="No volunteer applications yet." />
              ) : (
                <div className="space-y-3">
                  {volunteers.map((v) => (
                    <VolunteerCard key={v.id} volunteer={v} />
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === 'images' && (
            <section>
              <ImageManager />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-sosa-gray border border-gray-800 rounded-lg px-6 py-12 text-center">
      <p className="text-gray-500">{message}</p>
    </div>
  );
}

// ── Root Page ─────────────────────────────────────────────────────────────────

type AppState = 'checking' | 'login' | 'dashboard';

export default function AdminPage() {
  const [appState, setAppState] = useState<AppState>('checking');
  const [waivers, setWaivers] = useState<Waiver[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/waivers');
      if (res.status === 401) {
        setAppState('login');
        return;
      }
      if (res.ok) {
        const waiversData = await res.json();
        const [contactsRes, volunteersRes] = await Promise.all([
          fetch('/api/admin/contacts'),
          fetch('/api/admin/volunteers'),
        ]);
        const contactsData = contactsRes.ok ? await contactsRes.json() : { contacts: [] };
        const volunteersData = volunteersRes.ok ? await volunteersRes.json() : { volunteers: [] };
        setWaivers(waiversData.waivers ?? []);
        setContacts(contactsData.contacts ?? []);
        setVolunteers(volunteersData.volunteers ?? []);
        setAppState('dashboard');
      } else {
        setAppState('login');
      }
    } catch {
      setAppState('login');
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    setWaivers([]);
    setContacts([]);
    setVolunteers([]);
    setAppState('login');
  }

  function handleLogin(newWaivers: Waiver[], newContacts: Contact[], newVolunteers: Volunteer[]) {
    setWaivers(newWaivers);
    setContacts(newContacts);
    setVolunteers(newVolunteers);
    setAppState('dashboard');
  }

  if (appState === 'checking') {
    return (
      <div className="min-h-screen bg-sosa-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sosa-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (appState === 'login') {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <Dashboard waivers={waivers} contacts={contacts} volunteers={volunteers} onLogout={handleLogout} />;
}
