'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Shield,
  Download,
  Share2,
  QrCode,
  Lock,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  Phone,
  Heart,
  Droplets,
  Scale,
  Ruler,
  Mail,
  Calendar,
  ShieldCheck,
  FileText,
  Syringe,
  AlertTriangle,
  Pill,
  Clock,
} from 'lucide-react';
import { api } from '@/lib/api-client';
import { useAppStore } from '@/lib/store';

const initialAllergies = ['Penicillin', 'Peanuts', 'Latex'];
const initialMedications = ['Metformin 500mg - Twice daily', 'Lisinopril 10mg - Once daily', 'Vitamin D3 2000 IU - Once daily'];
const initialVaccinations = [
  { name: 'COVID-19 Booster', date: '2026-01-15', nextDue: '2027-01-15' },
  { name: 'Tetanus', date: '2024-03-20', nextDue: '2034-03-20' },
  { name: 'Hepatitis B', date: '2023-08-10', nextDue: null },
  { name: 'Influenza', date: '2025-11-01', nextDue: '2026-11-01' },
];
const initialHistory = [
  { condition: 'Type 2 Diabetes', date: '2020-05-12', type: 'diagnosis' },
  { condition: 'Hypertension', date: '2019-11-03', type: 'diagnosis' },
  { condition: 'Appendectomy', date: '2015-07-22', type: 'procedure' },
  { condition: 'Malaria', date: '2018-09-10', type: 'illness' },
];
const initialEmergencyContacts = [
  { name: 'Tigist Kebede', relation: 'Spouse', phone: '+251-92-345-6789' },
  { name: 'Daniel Kebede', relation: 'Son', phone: '+251-93-456-7890' },
];
const insurance = { provider: 'Nyala Insurance S.C.', policyNumber: 'NYL-2025-12345', expiry: '2027-06-30' };

export default function HealthRecordsPage() {
  const { token, user, setUser } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('personal');
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [allergies, setAllergies] = useState(initialAllergies);
  const [medications, setMedications] = useState(initialMedications);
  const [history, setHistory] = useState(initialHistory);
  const [vaccinations, setVaccinations] = useState(initialVaccinations);
  const [emergencyContacts, setEmergencyContacts] = useState(initialEmergencyContacts);
  const [newAllergy, setNewAllergy] = useState('');
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    api.auth.me(token)
      .then((u) => {
        setUser(u);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, setUser]);

  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'allergies', label: 'Allergies', icon: AlertTriangle },
    { id: 'medications', label: 'Medications', icon: Pill },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'vaccinations', label: 'Vaccinations', icon: Syringe },
    { id: 'emergency', label: 'Emergency', icon: Phone },
    { id: 'insurance', label: 'Insurance', icon: ShieldCheck },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading health records...</p>
        </div>
      </div>
    );
  }

  const profile = user
    ? {
        name: user.name || 'Unknown',
        dob: user.date_of_birth || 'Not set',
        bloodGroup: user.blood_group || 'Not set',
        phone: user.phone || 'Not set',
        email: user.email,
      }
    : null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {profile?.name.split(' ').map(n => n[0]).join('') || '?'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                <Droplets className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900">{profile?.name}</h1>
                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full border border-red-200">
                  Blood: {profile?.bloodGroup}
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-1">Digital Health Record</p>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-green-600">
                <Lock className="w-3.5 h-3.5" />
                End-to-end encrypted · HIPAA compliant
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowQR(true)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <QrCode className="w-4 h-4" />
                QR Code
              </button>
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                <Share2 className="w-4 h-4" />
                Share with Doctor
              </button>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Tab Navigation */}
          <div className="md:w-56 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-2 flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setEditingSection(null); }}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                {/* Personal Info */}
                {activeTab === 'personal' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                      <button
                        onClick={() => setEditingSection(editingSection === 'personal' ? null : 'personal')}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        {editingSection === 'personal' ? <><Save className="w-4 h-4" />Save</> : <><Edit3 className="w-4 h-4" />Edit</>}
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: 'Full Name', value: profile?.name, icon: User },
                        { label: 'Date of Birth', value: profile?.dob, icon: Calendar },
                        { label: 'Blood Group', value: profile?.bloodGroup, icon: Droplets },
                        { label: 'Phone', value: profile?.phone, icon: Phone },
                        { label: 'Email', value: profile?.email, icon: Mail },
                      ].map((field) => {
                        const Icon = field.icon;
                        return (
                          <div key={field.label} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                              <Icon className="w-3.5 h-3.5" />
                              {field.label}
                            </div>
                            {editingSection === 'personal' ? (
                              <input
                                type="text"
                                defaultValue={field.value}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              <p className="text-sm font-medium text-gray-900">{field.value}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Allergies */}
                {activeTab === 'allergies' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-gray-900">Allergies</h2>
                      <button
                        onClick={() => setEditingSection(editingSection === 'allergies' ? null : 'allergies')}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        {editingSection === 'allergies' ? <><Save className="w-4 h-4" />Done</> : <><Edit3 className="w-4 h-4" />Edit</>}
                      </button>
                    </div>
                    {editingSection === 'allergies' && (
                      <div className="flex gap-2 mb-4">
                        <input
                          type="text"
                          value={newAllergy}
                          onChange={(e) => setNewAllergy(e.target.value)}
                          placeholder="Add new allergy..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newAllergy.trim()) {
                              setAllergies([...allergies, newAllergy.trim()]);
                              setNewAllergy('');
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            if (newAllergy.trim()) {
                              setAllergies([...allergies, newAllergy.trim()]);
                              setNewAllergy('');
                            }
                          }}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <div className="space-y-2">
                      {allergies.map((allergy, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-medium text-red-800">{allergy}</span>
                          </div>
                          {editingSection === 'allergies' && (
                            <button onClick={() => setAllergies(allergies.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Medications */}
                {activeTab === 'medications' && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Current Medications</h2>
                    <div className="space-y-2">
                      {medications.map((med, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <Pill className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-blue-800">{med}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Medical History */}
                {activeTab === 'history' && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Medical History</h2>
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                      <div className="space-y-6">
                        {history.map((item, i) => (
                          <div key={i} className="relative flex gap-4">
                            <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                              item.type === 'diagnosis' ? 'bg-blue-100 text-blue-600' : item.type === 'procedure' ? 'bg-purple-100 text-purple-600' : 'bg-amber-100 text-amber-600'
                            }`}>
                              {item.type === 'diagnosis' ? <Heart className="w-4 h-4" /> : item.type === 'procedure' ? <FileText className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                            </div>
                            <div className="flex-1 pb-2">
                              <p className="text-sm font-semibold text-gray-900">{item.condition}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{item.date} · <span className="capitalize">{item.type}</span></p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Vaccinations */}
                {activeTab === 'vaccinations' && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Vaccinations</h2>
                    <div className="space-y-3">
                      {vaccinations.map((v, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg"><Syringe className="w-4 h-4 text-green-600" /></div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{v.name}</p>
                              <p className="text-xs text-gray-500">Received: {v.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {v.nextDue ? (
                              <p className="text-xs text-amber-600 font-medium">Next: {v.nextDue}</p>
                            ) : (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Complete</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Emergency Contacts */}
                {activeTab === 'emergency' && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Emergency Contacts</h2>
                    <div className="space-y-3">
                      {emergencyContacts.map((c, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                            <p className="text-xs text-gray-500">{c.relation}</p>
                          </div>
                          <a
                            href={`tel:${c.phone}`}
                            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                          >
                            <Phone className="w-4 h-4" />
                            Call
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Insurance */}
                {activeTab === 'insurance' && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Insurance Information</h2>
                    <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{insurance.provider}</p>
                          <p className="text-xs text-gray-500">Insurance Provider</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                        <div>
                          <p className="text-xs text-gray-500">Policy Number</p>
                          <p className="text-sm font-medium text-gray-900">{insurance.policyNumber}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Expiry Date</p>
                          <p className="text-sm font-medium text-gray-900">{insurance.expiry}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowQR(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-sm"
            >
              <div className="w-48 h-48 mx-auto bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                <QrCode className="w-32 h-32 text-gray-800" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Health Record QR Code</h3>
              <p className="text-sm text-gray-500 mb-4">Scan to view {profile?.name}&apos;s health record</p>
              <button
                onClick={() => setShowQR(false)}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
