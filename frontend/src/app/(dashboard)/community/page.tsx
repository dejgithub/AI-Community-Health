'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Activity,
  Syringe,
  Shield,
  TrendingUp,
  MapPin,
  Clock,
  Users,
  ChevronDown,
  AlertCircle,
  Lightbulb,
  BarChart3,
  Bell,
  Filter,
} from 'lucide-react';

const overviewCards = [
  { label: 'Total Cases', value: '1,247', change: '+12%', trend: 'up', icon: Activity, color: 'bg-blue-500', bg: 'bg-blue-50' },
  { label: 'Active Alerts', value: '3', change: '+1', trend: 'up', icon: AlertTriangle, color: 'bg-red-500', bg: 'bg-red-50' },
  { label: 'Vaccination Rate', value: '78%', change: '+5%', trend: 'up', icon: Syringe, color: 'bg-green-500', bg: 'bg-green-50' },
  { label: 'Risk Level', value: 'Moderate', change: '', trend: 'stable', icon: Shield, color: 'bg-amber-500', bg: 'bg-amber-50' },
];

const diseaseData = [
  { name: 'Malaria', count: 342, color: '#ef4444', percentage: 85 },
  { name: 'Dengue', count: 187, color: '#f97316', percentage: 47 },
  { name: 'Cholera', count: 56, color: '#eab308', percentage: 14 },
  { name: 'Flu', count: 489, color: '#3b82f6', percentage: 100 },
  { name: 'COVID-19', count: 173, color: '#8b5cf6', percentage: 35 },
];

const emergencyReports = [
  { id: '1', title: 'Malaria outbreak reported in Yeka district', time: '2 hours ago', severity: 'high', location: 'Yeka Sub-City' },
  { id: '2', title: 'Water contamination alert in Kirkos', time: '5 hours ago', severity: 'medium', location: 'Kirkos District' },
  { id: '3', title: 'Dengue fever cluster detected', time: '1 day ago', severity: 'high', location: 'Bole District' },
  { id: '4', title: 'Seasonal flu surge warning', time: '2 days ago', severity: 'low', location: 'Addis Ababa-wide' },
];

const vaccineData = [
  { name: 'COVID-19', coverage: 82, target: 90, doses: '2.1M' },
  { name: 'Polio', coverage: 91, target: 95, doses: '1.8M' },
  { name: 'Measles', coverage: 76, target: 95, doses: '1.5M' },
  { name: 'Hepatitis B', coverage: 68, target: 85, doses: '1.3M' },
  { name: 'Tetanus', coverage: 85, target: 90, doses: '1.7M' },
];

const healthTips = [
  'Use insect repellent and sleep under mosquito nets to prevent malaria',
  'Boil or treat drinking water during cholera outbreak warnings',
  'Stay hydrated and seek medical care immediately for dengue symptoms',
  'Get your annual flu vaccination before the peak season begins',
  'Practice frequent handwashing to prevent respiratory infections',
];

const communityAlerts = [
  { id: '1', title: 'Free Malaria Screening Camp', date: 'July 20-22, 2026', location: 'Black Lion Hospital', type: 'event' },
  { id: '2', title: 'COVID-19 Booster Drive', date: 'July 25, 2026', location: 'All Health Centers', type: 'vaccination' },
  { id: '3', title: 'Community Health Workshop', date: 'July 28, 2026', location: 'Bole Community Hall', type: 'education' },
];

const aiInsights = `Based on the latest data from Addis Ababa health districts, malaria cases have increased by 15% compared to the previous month, primarily concentrated in the Yeka and Bole districts. The surge correlates with the current rainy season. Vaccination coverage for measles remains below the WHO-recommended 95% threshold in the Kirkos sub-city. Recommend prioritizing mobile vaccination units in underserved areas. Cholera risk remains low but water quality monitoring should be maintained in high-density neighborhoods.`;

export default function CommunityPage() {
  const [timeRange, setTimeRange] = useState('1month');
  const [region, setRegion] = useState('all');

  const severityConfig: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    high: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
    medium: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', dot: 'bg-yellow-500' },
    low: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Community Health Dashboard</h1>
            <p className="text-gray-500 mt-1">Monitor community health trends in Addis Ababa</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="appearance-none pl-9 pr-8 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Regions</option>
                <option value="bole">Bole</option>
                <option value="yeka">Yeka</option>
                <option value="kirkos">Kirkos</option>
                <option value="arada">Arada</option>
                <option value="lideta">Lideta</option>
              </select>
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="appearance-none pl-9 pr-8 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1week">Last Week</option>
                <option value="1month">Last Month</option>
                <option value="3months">Last 3 Months</option>
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {overviewCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 p-5"
              >
                <div className="flex items-start justify-between">
                  <div className={`p-2.5 rounded-lg ${card.bg}`}>
                    <Icon className={`w-5 h-5 ${card.color.replace('bg-', 'text-')}`} />
                  </div>
                  {card.change && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      card.trend === 'up' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {card.change}
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-3">{card.value}</p>
                <p className="text-sm text-gray-500">{card.label}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Disease Trend Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="flex items-center gap-2 font-semibold text-gray-900 mb-6">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Disease Trend
            </h2>
            <div className="space-y-4">
              {diseaseData.map((disease) => (
                <div key={disease.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-700">{disease.name}</span>
                    <span className="text-sm text-gray-500">{disease.count} cases</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${disease.percentage}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: disease.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Total reported cases: <span className="font-semibold text-gray-700">1,247</span> · Updated: July 18, 2026
              </p>
            </div>
          </div>

          {/* Hotspot Map Placeholder */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="flex items-center gap-2 font-semibold text-gray-900 mb-6">
              <MapPin className="w-5 h-5 text-red-500" />
              Disease Hotspots
            </h2>
            <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center mb-4 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-12 left-16 w-16 h-16 bg-red-400 rounded-full blur-xl" />
                <div className="absolute top-20 right-12 w-12 h-12 bg-orange-400 rounded-full blur-xl" />
                <div className="absolute bottom-8 left-1/2 w-10 h-10 bg-yellow-400 rounded-full blur-xl" />
              </div>
              <div className="text-center z-10">
                <MapPin className="w-10 h-10 text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Interactive hotspot map</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-gray-600">High Risk — Yeka District</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-gray-600">Medium Risk — Bole District</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-gray-600">Low Risk — Kirkos District</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Emergency Reports */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Emergency Reports
            </h2>
            <div className="space-y-3">
              {emergencyReports.map((report) => {
                const severity = severityConfig[report.severity];
                return (
                  <div key={report.id} className={`p-3 rounded-lg border ${severity.bg} ${severity.border}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-2 h-2 rounded-full ${severity.dot}`} />
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${severity.text}`}>
                            {report.severity}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{report.title}</p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {report.location}
                        </p>
                      </div>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {report.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vaccination Statistics */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
              <Syringe className="w-5 h-5 text-green-500" />
              Vaccination Statistics
            </h2>
            <div className="space-y-4">
              {vaccineData.map((vaccine) => (
                <div key={vaccine.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">{vaccine.name}</span>
                      <span className="text-[10px] text-gray-400">({vaccine.doses} doses)</span>
                    </div>
                    <span className={`text-sm font-bold ${
                      vaccine.coverage >= vaccine.target ? 'text-green-600' : 'text-amber-600'
                    }`}>
                      {vaccine.coverage}%
                    </span>
                  </div>
                  <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${vaccine.coverage}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full rounded-full ${
                        vaccine.coverage >= vaccine.target ? 'bg-green-500' : 'bg-amber-500'
                      }`}
                    />
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-red-400"
                      style={{ left: `${vaccine.target}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-0.5">
                    <span className="text-[10px] text-gray-400">Current</span>
                    <span className="text-[10px] text-red-400">Target: {vaccine.target}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* AI Insights */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
              <Activity className="w-5 h-5 text-purple-500" />
              AI-Generated Community Insights
            </h2>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-100">
              <p className="text-sm text-gray-700 leading-relaxed">{aiInsights}</p>
            </div>
            <p className="text-[10px] text-gray-400 mt-3">
              Generated by AI Health Analytics Engine · Updated July 18, 2026
            </p>
          </div>

          {/* Health Tips */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Health Tips
            </h2>
            <div className="space-y-3">
              {healthTips.map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-lg"
                >
                  <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-700">{tip}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Community Alerts */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
            <Bell className="w-5 h-5 text-blue-500" />
            Recent Community Health Alerts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {communityAlerts.map((alert) => (
              <div key={alert.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 ${
                  alert.type === 'vaccination' ? 'bg-green-100 text-green-700' : alert.type === 'event' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {alert.type}
                </span>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{alert.title}</h3>
                <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                  <Clock className="w-3 h-3" />
                  {alert.date}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {alert.location}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
