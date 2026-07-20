'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Activity,
  Brain,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  Shield,
  Download,
  FileText,
  FileSpreadsheet,
  Calendar,
  MapPin,
  BarChart3,
  Eye,
  Zap,
  Target,
  ChevronRight,
  Lock,
} from 'lucide-react';
import StatCard from '@/components/charts/stat-card';
import BarChart from '@/components/charts/bar-chart';
import LineChart from '@/components/charts/line-chart';

const timeRanges = ['7 days', '30 days', '90 days', '1 year'] as const;

const diseaseData = [
  { label: 'Malaria', value: 45, color: '#ef4444', maxValue: 100 },
  { label: 'Dengue', value: 30, color: '#f97316', maxValue: 100 },
  { label: 'Cholera', value: 15, color: '#eab308', maxValue: 100 },
  { label: 'Flu', value: 60, color: '#3b82f6', maxValue: 100 },
  { label: 'COVID-19', value: 20, color: '#8b5cf6', maxValue: 100 },
];

const queryPerDay = [
  { label: 'Mon', value: 320 },
  { label: 'Tue', value: 450 },
  { label: 'Wed', value: 380 },
  { label: 'Thu', value: 520 },
  { label: 'Fri', value: 610 },
  { label: 'Sat', value: 480 },
  { label: 'Sun', value: 390 },
];

const queryCategories = [
  { label: 'Symptom Checker', value: 72, color: '#3b82f6', maxValue: 100 },
  { label: 'Disease Info', value: 58, color: '#8b5cf6', maxValue: 100 },
  { label: 'Medication Info', value: 45, color: '#22c55e', maxValue: 100 },
  { label: 'First Aid', value: 38, color: '#f97316', maxValue: 100 },
  { label: 'Prevention Tips', value: 28, color: '#06b6d4', maxValue: 100 },
];

const regionalData = [
  { region: 'Addis Ababa', population: '5.2M', cases: 1240, vaccination: 78, risk: 'Low' },
  { region: 'Oromia', population: '35.5M', cases: 3890, vaccination: 52, risk: 'Medium' },
  { region: 'Amhara', population: '20.2M', cases: 2100, vaccination: 48, risk: 'Medium' },
  { region: 'SNNPR', population: '18.9M', cases: 2650, vaccination: 45, risk: 'High' },
  { region: 'Tigray', population: '5.8M', cases: 890, vaccination: 35, risk: 'High' },
];

const dailyActiveUsers = [
  { label: 'Mon', value: 4200 },
  { label: 'Tue', value: 4800 },
  { label: 'Wed', value: 4500 },
  { label: 'Thu', value: 5100 },
  { label: 'Fri', value: 5600 },
  { label: 'Sat', value: 3800 },
  { label: 'Sun', value: 3200 },
];

const featureUsage = [
  { label: 'AI Chat', value: 85, color: '#3b82f6', maxValue: 100 },
  { label: 'Emergency SOS', value: 22, color: '#ef4444', maxValue: 100 },
  { label: 'Symptom Checker', value: 68, color: '#8b5cf6', maxValue: 100 },
  { label: 'Health Records', value: 42, color: '#22c55e', maxValue: 100 },
  { label: 'Community Forum', value: 35, color: '#f97316', maxValue: 100 },
];

const predictions = [
  {
    disease: 'Malaria Outbreak',
    risk: 'High',
    confidence: 82,
    region: 'SNNPR & Tigray',
    action: 'Increase vector control measures and distribute bed nets',
    color: '#ef4444',
  },
  {
    disease: 'Cholera Spread',
    risk: 'Medium',
    confidence: 65,
    region: 'Oromia',
    action: 'Improve water sanitation and hygiene awareness campaigns',
    color: '#f97316',
  },
  {
    disease: 'Dengue Fever',
    risk: 'Low',
    confidence: 45,
    region: 'Addis Ababa',
    action: 'Continue monitoring and maintain current prevention programs',
    color: '#22c55e',
  },
];

const riskColorMap: Record<string, string> = {
  Low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  High: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<string>('7 days');
  const [role, setRole] = useState<string>('user');

  if (role !== 'admin') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <Lock className="h-10 w-10 text-red-500 dark:text-red-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            You need administrator privileges to view analytics.
          </p>
        </div>
        <button
          onClick={() => setRole('admin')}
          className="rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
        >
          Switch to Admin Role (Demo)
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Comprehensive health platform analytics and insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-gray-900">
            {timeRanges.map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value="12,847"
          change={12.5}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Sessions"
          value="1,423"
          change={8.2}
          icon={Activity}
          color="green"
        />
        <StatCard
          title="AI Queries Today"
          value="3,150"
          change={-2.1}
          icon={Brain}
          color="purple"
        />
        <StatCard
          title="Emergency Alerts"
          value="23"
          change={-15.0}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Disease Trends
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Reported cases by disease type
              </p>
            </div>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <BarChart data={diseaseData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                AI Queries Per Day
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Daily AI query volume over the past week
              </p>
            </div>
            <Brain className="h-5 w-5 text-gray-400" />
          </div>
          <LineChart data={queryPerDay} height={220} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Query Categories
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Most common query types
            </p>
          </div>
          <BarChart data={queryCategories} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Performance
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Response time and accuracy metrics
            </p>
          </div>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">1.2s</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Accuracy Rate</span>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">94.5%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">User Satisfaction</span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">4.7/5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Queries Handled</span>
              <span className="text-lg font-bold text-purple-600 dark:text-purple-400">24,891</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Escalation Rate</span>
              <span className="text-lg font-bold text-orange-600 dark:text-orange-400">3.2%</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Emergency Response
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Monthly emergency metrics
            </p>
          </div>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</span>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-lg font-bold text-gray-900 dark:text-white">4.2 min</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">SOS Alerts This Month</span>
              <span className="text-lg font-bold text-red-600 dark:text-red-400">23</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Resolved</span>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-green-600 dark:text-green-400">21</span>
                <span className="text-xs text-gray-400">(91.3%)</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
              <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">2</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Response Trend</span>
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <TrendingDown className="h-4 w-4" />
                <span className="text-sm font-semibold">-18%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Regional Health Statistics
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Health metrics by region
            </p>
          </div>
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Region
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Population
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Cases
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Vaccination Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Risk Level
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {regionalData.map((row) => (
                <tr
                  key={row.region}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {row.region}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {row.population}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {row.cases.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${row.vaccination}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {row.vaccination}%
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${riskColorMap[row.risk]}`}
                    >
                      {row.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Daily Active Users
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                User engagement over the past week
              </p>
            </div>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <LineChart data={dailyActiveUsers} color="#22c55e" height={200} />
          <div className="mt-4 grid grid-cols-3 gap-4 border-t border-gray-100 pt-4 dark:border-gray-800">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">4,457</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Avg Daily Users</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">12m</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Avg Session Duration</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">73%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Retention Rate</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Feature Usage Breakdown
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Popular features by usage percentage
              </p>
            </div>
            <Zap className="h-5 w-5 text-gray-400" />
          </div>
          <BarChart data={featureUsage} />
          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 dark:border-gray-800">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Avg Session Duration
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">12.4 min</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pages Per Session
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">8.2</p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Prediction Analytics
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              AI-powered disease outbreak predictions for the next 30 days
            </p>
          </div>
          <Target className="h-5 w-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
          {predictions.map((pred) => (
            <div
              key={pred.disease}
              className="rounded-xl border border-gray-200 bg-gray-50 p-5 transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-800/50"
            >
              <div className="mb-3 flex items-start justify-between">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  {pred.disease}
                </h3>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${riskColorMap[pred.risk]}`}
                >
                  {pred.risk} Risk
                </span>
              </div>
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Confidence</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {pred.confidence}%
                  </span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${pred.confidence}%`,
                      backgroundColor: pred.color,
                    }}
                  />
                </div>
              </div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="font-medium">Region:</span> {pred.region}
              </p>
              <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                <span className="font-medium">Action:</span> {pred.action}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
        className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-900"
      >
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Export Dashboard Data
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Download analytics reports for the selected time range
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            <FileText className="h-4 w-4" />
            Export PDF
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            <FileSpreadsheet className="h-4 w-4" />
            Export CSV
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600">
            <Download className="h-4 w-4" />
            Download Report
          </button>
        </div>
      </motion.div>
    </div>
  );
}
