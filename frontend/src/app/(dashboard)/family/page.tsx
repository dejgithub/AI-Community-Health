'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus,
  Phone,
  MessageSquare,
  Bell,
  BellOff,
  MapPin,
  Clock,
  Pill,
  Calendar,
  ChevronLeft,
  AlertTriangle,
  Shield,
  Settings,
  X,
  Heart,
  Activity,
} from 'lucide-react';
import { api } from '@/lib/api-client';
import type { FamilyMemberRead } from '@/lib/api-client';
import { useAppStore } from '@/lib/store';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age: number;
  healthStatus: 'green' | 'yellow' | 'red';
  avatar: string;
  lastSeen: string;
  currentMedications: string[];
  upcomingAppointment: string | null;
  recentActivity: string;
  locationShared: boolean;
  location: { lat: number; lng: number } | null;
  alertsEnabled: boolean;
}

function computeAge(dob?: string): number {
  if (!dob) return 0;
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

function getInitials(name: string): string {
  return name.split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function mapToUI(member: FamilyMemberRead): FamilyMember {
  const conditions = member.medical_conditions.length;
  const healthStatus: FamilyMember['healthStatus'] = conditions > 2 ? 'red' : conditions > 0 ? 'yellow' : 'green';
  const activity = conditions > 0 ? member.medical_conditions.join(', ') : 'No reported conditions';
  return {
    id: String(member.id),
    name: member.name,
    relationship: member.relationship,
    age: computeAge(member.date_of_birth),
    healthStatus,
    avatar: getInitials(member.name),
    lastSeen: 'Unknown',
    currentMedications: member.medications,
    upcomingAppointment: null,
    recentActivity: activity,
    locationShared: false,
    location: null,
    alertsEnabled: true,
  };
}

export default function FamilyPage() {
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formRelationship, setFormRelationship] = useState('Spouse');
  const [formPhone, setFormPhone] = useState('');
  const [formLocationShared, setFormLocationShared] = useState(true);
  const [formAlertsEnabled, setFormAlertsEnabled] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const token = useAppStore((s) => s.token);

  useEffect(() => {
    if (!token) {
      setError('You must be logged in');
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    api.family
      .list(token)
      .then((data) => {
        if (!cancelled) {
          setFamilyMembers(data.map(mapToUI));
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message || 'Failed to load family members');
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [token]);

  const resetForm = () => {
    setFormName('');
    setFormRelationship('Spouse');
    setFormPhone('');
    setFormLocationShared(true);
    setFormAlertsEnabled(true);
  };

  const handleAddMember = async () => {
    if (!token || !formName.trim()) return;
    setSubmitting(true);
    try {
      const created = await api.family.create(token, {
        name: formName.trim(),
        relationship: formRelationship,
        phone: formPhone.trim() || undefined,
      });
      setFamilyMembers((prev) => [...prev, mapToUI(created)]);
      resetForm();
      setShowAddForm(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add member';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const statusConfig = {
    green: { label: 'Healthy', color: 'bg-green-500', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    yellow: { label: 'Attention Needed', color: 'bg-yellow-500', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    red: { label: 'Urgent', color: 'bg-red-500', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {selectedMember ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Back button */}
              <button
                onClick={() => setSelectedMember(null)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Family Members
              </button>

              {/* Member Header */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                <div className="flex items-center gap-5">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold ${statusConfig[selectedMember.healthStatus].color === 'bg-green-500' ? 'bg-green-500' : statusConfig[selectedMember.healthStatus].color === 'bg-yellow-500' ? 'bg-amber-500' : 'bg-red-500'}`}>
                    {selectedMember.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold text-gray-900">{selectedMember.name}</h2>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusConfig[selectedMember.healthStatus].bg} ${statusConfig[selectedMember.healthStatus].text} ${statusConfig[selectedMember.healthStatus].border}`}>
                        {statusConfig[selectedMember.healthStatus].label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{selectedMember.relationship} · Age {selectedMember.age}</p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Last seen: {selectedMember.lastSeen}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <a href="tel:+251923456789" className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                      <Phone className="w-4 h-4" /> Call
                    </a>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                      <MessageSquare className="w-4 h-4" /> Message
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Health Summary */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
                    <Heart className="w-4 h-4 text-red-500" />
                    Health Summary
                  </h3>
                  <div className={`p-4 rounded-lg border ${statusConfig[selectedMember.healthStatus].bg} ${statusConfig[selectedMember.healthStatus].border}`}>
                    <p className={`text-sm font-medium ${statusConfig[selectedMember.healthStatus].text}`}>
                      Status: {statusConfig[selectedMember.healthStatus].label}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">{selectedMember.recentActivity}</p>
                  </div>
                </div>

                {/* Medication Schedule */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
                    <Pill className="w-4 h-4 text-blue-500" />
                    Medication Schedule
                  </h3>
                  {selectedMember.currentMedications.length > 0 ? (
                    <div className="space-y-2">
                      {selectedMember.currentMedications.map((med, i) => (
                        <div key={i} className="flex items-center gap-2 p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
                          <Pill className="w-3.5 h-3.5 text-blue-500" />
                          <span className="text-sm text-blue-800">{med}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No current medications</p>
                  )}
                </div>

                {/* Location */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
                    <MapPin className="w-4 h-4 text-purple-500" />
                    Location
                  </h3>
                  {selectedMember.locationShared ? (
                    <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-8 h-8 text-purple-500 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">Location shared</p>
                        <p className="text-[10px] text-gray-400">Addis Ababa, Ethiopia</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Location sharing is disabled</p>
                  )}
                </div>

                {/* Alert Settings */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
                    <Bell className="w-4 h-4 text-amber-500" />
                    Alert Settings
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Health alerts</span>
                      <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${selectedMember.alertsEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}>
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${selectedMember.alertsEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </div>
                    </label>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Medication reminders</span>
                      <div className="w-10 h-5 rounded-full relative cursor-pointer bg-blue-600">
                        <div className="absolute top-0.5 left-5 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                    </label>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Emergency SOS</span>
                      <div className="w-10 h-5 rounded-full relative cursor-pointer bg-blue-600">
                        <div className="absolute top-0.5 left-5 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                    </label>
                  </div>
                  <button className="w-full mt-4 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center justify-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Send Emergency Alert
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Family Monitoring</h1>
                  <p className="text-gray-500 mt-1">Monitor and care for your family members&apos; health</p>
                </div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Family Member
                </button>
              </div>

              {/* Error banner */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center justify-between">
                  <span>{error}</span>
                  <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button>
                </div>
              )}

              {/* Loading state */}
              {loading && (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                </div>
              )}

              {!loading && (
                <>
                  {/* Quick Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {[
                      { label: 'Total Members', value: familyMembers.length, color: 'text-blue-600', bg: 'bg-blue-50' },
                      { label: 'Healthy', value: familyMembers.filter(m => m.healthStatus === 'green').length, color: 'text-green-600', bg: 'bg-green-50' },
                      { label: 'Need Attention', value: familyMembers.filter(m => m.healthStatus === 'yellow').length, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                      { label: 'Urgent', value: familyMembers.filter(m => m.healthStatus === 'red').length, color: 'text-red-600', bg: 'bg-red-50' },
                    ].map((stat) => (
                      <div key={stat.label} className={`${stat.bg} rounded-xl p-4`}>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        <p className="text-xs text-gray-600">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Family Members List */}
                  <div className="space-y-4">
                    {familyMembers.length === 0 && (
                      <div className="text-center py-16 text-gray-400">
                        <UserPlus className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p className="text-sm">No family members yet. Add one to get started.</p>
                      </div>
                    )}
                    {familyMembers.map((member, i) => {
                      const status = statusConfig[member.healthStatus];
                      return (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => setSelectedMember(member)}
                          className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`relative w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold ${status.color === 'bg-green-500' ? 'bg-green-500' : status.color === 'bg-yellow-500' ? 'bg-amber-500' : 'bg-red-500'}`}>
                              {member.avatar}
                              <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${status.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${status.bg} ${status.text} border ${status.border}`}>
                                  {member.relationship}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Last seen: {member.lastSeen}
                              </p>
                              <div className="flex flex-wrap items-center gap-3 mt-2">
                                {member.currentMedications.length > 0 && (
                                  <span className="text-xs text-blue-600 flex items-center gap-1">
                                    <Pill className="w-3 h-3" />
                                    {member.currentMedications.length} medication{member.currentMedications.length > 1 ? 's' : ''}
                                  </span>
                                )}
                                {member.upcomingAppointment && (
                                  <span className="text-xs text-purple-600 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    Upcoming visit
                                  </span>
                                )}
                                {member.locationShared && (
                                  <span className="text-xs text-green-600 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    Location shared
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); }}
                                className={`p-2 rounded-lg transition-colors ${member.alertsEnabled ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' : 'text-gray-400 bg-gray-50 hover:bg-gray-100'}`}
                              >
                                {member.alertsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                              </button>
                              {member.healthStatus === 'red' && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); }}
                                  className="p-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                                >
                                  <AlertTriangle className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Member Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => { setShowAddForm(false); resetForm(); }}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Add Family Member</h2>
                <button onClick={() => { setShowAddForm(false); resetForm(); }} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                  <select
                    value={formRelationship}
                    onChange={(e) => setFormRelationship(e.target.value)}
                    className="w-full appearance-none px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Spouse</option>
                    <option>Child</option>
                    <option>Parent</option>
                    <option>Sibling</option>
                    <option>Grandparent</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+251-9X-XXX-XXXX"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formLocationShared}
                      onChange={(e) => setFormLocationShared(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Share location</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formAlertsEnabled}
                      onChange={(e) => setFormAlertsEnabled(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Enable health alerts</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => { setShowAddForm(false); resetForm(); }} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button
                  onClick={handleAddMember}
                  disabled={submitting || !formName.trim()}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
