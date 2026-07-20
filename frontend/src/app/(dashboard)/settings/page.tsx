'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Camera,
  Bell,
  BellOff,
  MessageSquare,
  Smartphone,
  Pill,
  AlertTriangle,
  Eye,
  MapPin,
  Heart,
  Moon,
  Sun,
  Globe,
  Lock,
  Key,
  Shield,
  Laptop,
  LogOut,
  Download,
  Trash2,
  Info,
  FileText,
  ChevronRight,
} from 'lucide-react';
import LanguageSelector from '@/components/layout/language-selector';
import { api } from '@/lib/api-client';
import { useAppStore } from '@/lib/store';

interface ToggleSetting {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
}

const defaultNotificationSettings: ToggleSetting[] = [
  { id: 'email', label: 'Email Notifications', description: 'Receive health updates via email', icon: Mail, enabled: true },
  { id: 'sms', label: 'SMS Notifications', description: 'Get text messages for urgent alerts', icon: MessageSquare, enabled: true },
  { id: 'push', label: 'Push Notifications', description: 'Browser push notifications', icon: Smartphone, enabled: false },
  { id: 'medication', label: 'Medication Reminders', description: 'Daily medication schedule alerts', icon: Pill, enabled: true },
  { id: 'emergency', label: 'Emergency Alerts', description: 'Critical health and emergency notifications', icon: AlertTriangle, enabled: true },
];

const defaultPrivacySettings: ToggleSetting[] = [
  { id: 'profile_visibility', label: 'Public Profile', description: 'Allow others to see your profile', icon: Eye, enabled: false },
  { id: 'location', label: 'Location Sharing', description: 'Share your location for emergency services', icon: MapPin, enabled: true },
  { id: 'health_data', label: 'Health Data Sharing', description: 'Share anonymized health data for research', icon: Heart, enabled: false },
];

function ToggleSwitch({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ${
        enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

function SectionCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
          <Icon className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, token, setUser, logout } = useAppStore();

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [notifications, setNotifications] = useState(defaultNotificationSettings);
  const [privacy, setPrivacy] = useState(defaultPrivacySettings);
  const [darkMode, setDarkMode] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const toggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const togglePrivacy = (id: string) => {
    setPrivacy((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleSaveProfile = async () => {
    if (!token) return;
    setSaving(true);
    try {
      const updatedUser = await api.auth.updateProfile(token, { name, phone });
      setUser(updatedUser);
    } catch {
      // keep existing values on failure
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your account preferences and privacy
        </p>
      </div>

      <SectionCard title="Profile Settings" description="Update your personal information" icon={User}>
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-2xl font-bold text-white">
                {initials || 'U'}
              </div>
              <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md ring-2 ring-gray-100 transition-colors hover:bg-gray-50 dark:bg-gray-900 dark:ring-gray-800">
                <Camera className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                JPG, PNG or GIF. Max size 5MB.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Notification Settings" description="Control how you receive alerts" icon={Bell}>
        <div className="space-y-1">
          {notifications.map((setting) => (
            <div
              key={setting.id}
              className="flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                  <setting.icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {setting.label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{setting.description}</p>
                </div>
              </div>
              <ToggleSwitch
                enabled={setting.enabled}
                onToggle={() => toggleNotification(setting.id)}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Privacy Settings" description="Manage your data visibility" icon={Shield}>
        <div className="space-y-1">
          {privacy.map((setting) => (
            <div
              key={setting.id}
              className="flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                  <setting.icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {setting.label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{setting.description}</p>
                </div>
              </div>
              <ToggleSwitch
                enabled={setting.enabled}
                onToggle={() => togglePrivacy(setting.id)}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Appearance" description="Customize the app look and feel" icon={Moon}>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                {darkMode ? (
                  <Moon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                ) : (
                  <Sun className="h-4 w-4 text-yellow-500" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Switch between light and dark theme
                </p>
              </div>
            </div>
            <ToggleSwitch enabled={darkMode} onToggle={() => setDarkMode(!darkMode)} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <Globe className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Language</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Select your preferred language
                </p>
              </div>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Security" description="Protect your account" icon={Lock}>
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Change Password</h4>
            <div className="space-y-3">
              <input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <button className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                Update Password
              </button>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                  <Key className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Two-Factor Authentication
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Add an extra layer of security to your account
                  </p>
                </div>
              </div>
              <ToggleSwitch enabled={twoFactor} onToggle={() => setTwoFactor(!twoFactor)} />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 dark:border-gray-800">
            <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
              Active Sessions
            </h4>
            <div className="space-y-3">
              {[
                { device: 'MacBook Pro - Chrome', location: 'Addis Ababa, ET', current: true, time: 'Active now' },
                { device: 'iPhone 15 - Safari', location: 'Addis Ababa, ET', current: false, time: '2 hours ago' },
              ].map((session, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 dark:border-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <Laptop className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {session.device}
                        {session.current && (
                          <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            Current
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {session.location} &middot; {session.time}
                      </p>
                    </div>
                  </div>
                  {!session.current && (
                    <button className="text-xs font-medium text-red-500 hover:text-red-600 dark:text-red-400">
                      <LogOut className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Data Management" description="Control your personal data" icon={Download}>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-4 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <Download className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Export Your Data</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Download a copy of all your health records and data
                </p>
              </div>
            </div>
            <button className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600">
              Export
            </button>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-red-200 px-4 py-4 dark:border-red-900">
            <div className="flex items-center gap-3">
              <Trash2 className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Delete Account</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Permanently delete your account and all associated data
                </p>
              </div>
            </div>
            <button className="rounded-xl border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-transparent dark:text-red-400 dark:hover:bg-red-950/30">
              Delete
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="About" description="App information and legal" icon={Info}>
        <div className="space-y-1">
          {[
            { label: 'App Version', value: '2.4.1', icon: Info },
            { label: 'Terms of Service', value: '', icon: FileText },
            { label: 'Privacy Policy', value: '', icon: Shield },
            { label: 'Medical Disclaimer', value: '', icon: AlertTriangle },
          ].map((item) => (
            <button
              key={item.label}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900 dark:text-white">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.value && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">{item.value}</span>
                )}
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Account" description="Manage your session" icon={LogOut}>
        <div className="flex justify-end">
          <button
            onClick={handleLogout}
            className="rounded-xl border border-red-300 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-transparent dark:text-red-400 dark:hover:bg-red-950/30"
          >
            <span className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Log Out
            </span>
          </button>
        </div>
      </SectionCard>
    </div>
  );
}
