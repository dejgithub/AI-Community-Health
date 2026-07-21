'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Pill,
  Clock,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit3,
  Calendar,
  TrendingUp,
  Zap,
  Upload,
  ChevronDown,
  X,
  AlertCircle,
} from 'lucide-react';
import { api, type MedicationRead, type MedicationStats } from '@/lib/api-client';
import { useAppStore } from '@/lib/store';

interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  startDate: string;
  endDate: string;
  notes: string;
  takenToday: boolean[];
  adherenceRate: number;
}

const frequencyOptions = ['Once daily', 'Twice daily', 'Three times daily', 'Four times daily'];

function mapMedication(read: MedicationRead, adherenceRate: number): Medication {
  const times = read.times?.length ? read.times : getTimesForFrequency(read.frequency);
  return {
    id: read.id,
    name: read.name,
    dosage: read.dosage,
    frequency: read.frequency,
    times,
    startDate: read.start_date ?? '',
    endDate: read.end_date ?? '',
    notes: read.notes ?? '',
    takenToday: times.map(() => false),
    adherenceRate,
  };
}

function getTimesForFrequency(freq: string) {
  switch (freq) {
    case 'Once daily': return ['08:00'];
    case 'Twice daily': return ['08:00', '20:00'];
    case 'Three times daily': return ['08:00', '14:00', '20:00'];
    case 'Four times daily': return ['08:00', '12:00', '16:00', '20:00'];
    default: return ['08:00'];
  }
}

const statusColors = {
  taken: 'bg-green-100 text-green-700 border-green-200',
  missed: 'bg-red-100 text-red-700 border-red-200',
  upcoming: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

export default function MedicationsPage() {
  const token = useAppStore((s) => s.token);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [stats, setStats] = useState<MedicationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'calendar'>('list');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    frequency: 'Once daily',
    times: ['08:00'],
    startDate: '',
    endDate: '',
    notes: '',
  });

  const fetchData = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [medList, medStats] = await Promise.all([
        api.medications.list(token),
        api.medications.stats(token),
      ]);
      const adherenceMap: Record<number, number> = {};
      if (medStats) {
        const rate = medStats.active_medications > 0 ? medStats.adherence_rate : 0;
        medList.forEach((m) => { adherenceMap[m.id] = rate; });
      }
      setMedications(medList.map((m) => mapMedication(m, adherenceMap[m.id] ?? 0)));
      setStats(medStats);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load medications');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleAddMed() {
    if (!token || !newMed.name || !newMed.dosage) return;
    try {
      const created = await api.medications.create(token, {
        name: newMed.name,
        dosage: newMed.dosage,
        frequency: newMed.frequency,
        times: getTimesForFrequency(newMed.frequency),
        start_date: newMed.startDate || undefined,
        end_date: newMed.endDate || undefined,
        notes: newMed.notes || undefined,
      });
      setMedications((prev) => [...prev, mapMedication(created, 0)]);
      setNewMed({ name: '', dosage: '', frequency: 'Once daily', times: ['08:00'], startDate: '', endDate: '', notes: '' });
      setShowAddForm(false);
      fetchData();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to add medication');
    }
  }

  async function handleDeleteMed(id: number) {
    if (!token) return;
    try {
      await api.medications.delete(token, id);
      setMedications((prev) => prev.filter((m) => m.id !== id));
      fetchData();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to delete medication');
    }
  }

  async function toggleTaken(medId: number, timeIndex: number) {
    if (!token) return;
    setMedications((prev) =>
      prev.map((m) => {
        if (m.id !== medId) return m;
        const newTaken = [...m.takenToday];
        newTaken[timeIndex] = !newTaken[timeIndex];
        const rate = Math.round((newTaken.filter(Boolean).length / newTaken.length) * 100);
        return { ...m, takenToday: newTaken, adherenceRate: rate };
      })
    );
    try {
      await api.medications.markTaken(token, medId);
      fetchData();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to mark dose');
      fetchData();
    }
  }

  function getTimeStatus(time: string, taken: boolean) {
    if (taken) return 'taken';
    const now = new Date();
    const [h, m] = time.split(':').map(Number);
    const medTime = new Date();
    medTime.setHours(h, m, 0, 0);
    return now > medTime ? 'missed' : 'upcoming';
  }

  const totalMeds = stats?.active_medications ?? medications.length;
  const avgAdherence = stats?.adherence_rate ?? (medications.length > 0 ? Math.round(medications.reduce((a, m) => a + m.adherenceRate, 0) / medications.length) : 0);
  const streakDays = stats?.streak_days ?? 0;

  const calendarDays = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 29 + i);
    return d;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-gray-500">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            Loading medications...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Medication Reminders</h1>
            <p className="text-gray-500 mt-1">Track and manage your medications</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Upload className="w-4 h-4" />
              Upload Prescription
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Medication
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)} className="p-0.5 hover:bg-red-100 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 rounded-lg"><Pill className="w-5 h-5 text-blue-600" /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalMeds}</p>
                <p className="text-sm text-gray-500">Active Medications</p>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-green-100 rounded-lg"><TrendingUp className="w-5 h-5 text-green-600" /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{avgAdherence}%</p>
                <p className="text-sm text-gray-500">Adherence Rate</p>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 rounded-lg"><Zap className="w-5 h-5 text-amber-600" /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{streakDays} days</p>
                <p className="text-sm text-gray-500">Current Streak</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit mb-6">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <Pill className="w-4 h-4 inline mr-1.5" />
            Medications
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'calendar' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <Calendar className="w-4 h-4 inline mr-1.5" />
            Calendar
          </button>
        </div>

        {/* Medication List */}
        {activeTab === 'list' && (
          <div className="space-y-4">
            {medications.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <Pill className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No medications yet. Add your first one above.</p>
              </div>
            )}
            {medications.map((med, i) => (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{med.name}</h3>
                      <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        {med.dosage}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{med.frequency}</span>
                      {med.startDate && <span>Starts: {med.startDate}</span>}
                      {med.endDate && <span>Ends: {med.endDate}</span>}
                    </div>
                    {med.notes && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full w-fit">
                        <AlertCircle className="w-3 h-3" />
                        {med.notes}
                      </div>
                    )}

                    {/* Schedule Toggles */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {med.times.map((time, ti) => {
                        const status = getTimeStatus(time, med.takenToday[ti]);
                        return (
                          <button
                            key={ti}
                            onClick={() => toggleTaken(med.id, ti)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                              statusColors[status]
                            }`}
                          >
                            {status === 'taken' && <CheckCircle2 className="w-3 h-3" />}
                            {status === 'missed' && <XCircle className="w-3 h-3" />}
                            {status === 'upcoming' && <Clock className="w-3 h-3" />}
                            {time} - {status.charAt(0).toUpperCase() + status.slice(1)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    {/* Adherence Bar */}
                    <div className="w-32">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">Adherence</span>
                        <span className="font-medium text-gray-700">{med.adherenceRate}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${med.adherenceRate}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`h-full rounded-full ${
                            med.adherenceRate >= 80 ? 'bg-green-500' : med.adherenceRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(med.id);
                          setNewMed({
                            name: med.name,
                            dosage: med.dosage,
                            frequency: med.frequency,
                            times: med.times,
                            startDate: med.startDate,
                            endDate: med.endDate,
                            notes: med.notes,
                          });
                          setShowAddForm(true);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMed(med.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Calendar View */}
        {activeTab === 'calendar' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">30-Day Medication Calendar</h3>
            <div className="flex flex-wrap gap-2">
              {calendarDays.map((day, i) => {
                const hasData = i > 10;
                const adherence = hasData ? Math.floor(Math.random() * 40) + 60 : 0;
                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                        !hasData
                          ? 'bg-gray-50 text-gray-400'
                          : adherence >= 80
                          ? 'bg-green-100 text-green-700'
                          : adherence >= 50
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {day.getDate()}
                    </div>
                    {hasData && (
                      <span className="text-[10px] text-gray-500">{adherence}%</span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-100 border border-green-200" />Good (80%+)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-100 border border-yellow-200" />Fair (50-79%)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-100 border border-red-200" />Missed (&lt;50%)</span>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => { setShowAddForm(false); setEditingId(null); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingId ? 'Edit Medication' : 'Add Medication'}
                </h2>
                <button onClick={() => { setShowAddForm(false); setEditingId(null); }} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name</label>
                  <input
                    type="text"
                    value={newMed.name}
                    onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                    placeholder="e.g., Metformin"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                  <input
                    type="text"
                    value={newMed.dosage}
                    onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                    placeholder="e.g., 500mg"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <div className="relative">
                    <select
                      value={newMed.frequency}
                      onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                      className="w-full appearance-none px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {frequencyOptions.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={newMed.startDate}
                      onChange={(e) => setNewMed({ ...newMed, startDate: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={newMed.endDate}
                      onChange={(e) => setNewMed({ ...newMed, endDate: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={newMed.notes}
                    onChange={(e) => setNewMed({ ...newMed, notes: e.target.value })}
                    placeholder="e.g., Take with food"
                    rows={2}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { setShowAddForm(false); setEditingId(null); }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMed}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  {editingId ? 'Save Changes' : 'Add Medication'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
