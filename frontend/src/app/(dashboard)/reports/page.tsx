'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Plus,
  Download,
  Share2,
  Printer,
  ChevronDown,
  X,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Brain,
  Clock,
  Activity,
} from 'lucide-react';
import { api, type HealthReportResponse } from '@/lib/api-client';
import { useAppStore } from '@/lib/store';

interface Report {
  id: string;
  date: string;
  title: string;
  healthScore: number;
  riskLevel: 'low' | 'medium' | 'high';
}

const previousReports: Report[] = [
  { id: '1', date: '2026-07-01', title: 'Monthly Health Report - July 2026', healthScore: 82, riskLevel: 'low' },
  { id: '2', date: '2026-06-01', title: 'Monthly Health Report - June 2026', healthScore: 78, riskLevel: 'low' },
  { id: '3', date: '2026-05-01', title: 'Monthly Health Report - May 2026', healthScore: 71, riskLevel: 'medium' },
];

type ReportData = HealthReportResponse['report'];

function deriveHealthScore(riskLevel: string, vitals: Record<string, unknown>): number {
  if (typeof vitals['health_score'] === 'number') return vitals['health_score'] as number;
  if (riskLevel === 'low') return 82;
  if (riskLevel === 'medium') return 65;
  return 35;
}

function deriveKeyFindings(vitals: Record<string, unknown>): string[] {
  const findings: string[] = [];
  for (const [key, value] of Object.entries(vitals)) {
    if (key === 'health_score') continue;
    if (typeof value === 'string') {
      findings.push(`${key.replace(/_/g, ' ')}: ${value}`);
    } else if (typeof value === 'number') {
      findings.push(`${key.replace(/_/g, ' ')}: ${value}`);
    }
  }
  return findings;
}

function formatTitle(isoDate: string): string {
  const d = new Date(isoDate);
  const month = d.toLocaleString('default', { month: 'long' });
  const year = d.getFullYear();
  return `AI Health Report — ${month} ${year}`;
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function ReportsPage() {
  const { user } = useAppStore();
  const [showGenerator, setShowGenerator] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('1month');
  const [includeSections, setIncludeSections] = useState({
    symptoms: true,
    medications: true,
    vitals: true,
    labs: true,
  });
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [followUps, setFollowUps] = useState<{ text: string; done: boolean }[]>([]);

  const healthScore = reportData ? deriveHealthScore(reportData.risk_level, reportData.vitals) : 0;
  const keyFindings = reportData ? deriveKeyFindings(reportData.vitals) : [];

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    try {
      const userData: Record<string, unknown> = user
        ? { name: user.name, email: user.email, blood_group: user.blood_group, date_of_birth: user.date_of_birth }
        : {};
      const response = await api.ai.generateReport(userData);
      setReportData(response.report);
      setFollowUps(response.report.recommendations.map((rec) => ({ text: rec, done: false })));
      setShowGenerator(false);
      setShowReport(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setGenerating(false);
    }
  }

  function getScoreColor(score: number) {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }

  function getScoreBg(score: number) {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-amber-600';
    return 'from-red-500 to-rose-600';
  }

  function getRiskColor(level: string) {
    if (level === 'low') return 'bg-green-100 text-green-700 border-green-200';
    if (level === 'medium') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Health Reports</h1>
            <p className="text-gray-500 mt-1">AI-powered health analysis and recommendations</p>
          </div>
          <button
            onClick={() => setShowGenerator(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Generate New Report
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto p-1 hover:bg-red-100 rounded-lg">
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}

        {/* Report Preview */}
        {showReport && reportData && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 mb-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8" id="report-print">
              {/* Report Header */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{formatTitle(reportData.generated_at)}</h2>
                  <p className="text-sm text-gray-500 mt-1">Generated on {formatDate(reportData.generated_at)} · AI Analysis</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50">
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50">
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print
                  </button>
                </div>
              </div>

              {/* Health Score Gauge */}
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="flex-1 p-6 bg-gray-50 rounded-xl text-center">
                  <div className="relative w-32 h-32 mx-auto mb-3">
                    <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                      <circle
                        cx="60" cy="60" r="50" fill="none"
                        stroke="url(#scoreGradient)" strokeWidth="10"
                        strokeDasharray={`${(healthScore / 100) * 314} 314`}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#22c55e" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-3xl font-bold ${getScoreColor(healthScore)}`}>
                        {healthScore}
                      </span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wide">/100</span>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">Health Score</p>
                </div>
                <div className="flex-1 p-6 bg-gray-50 rounded-xl">
                  <p className="text-sm font-semibold text-gray-900 mb-3">Risk Assessment</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getRiskColor(reportData.risk_level)}`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${reportData.risk_level === 'low' ? 'bg-green-500' : reportData.risk_level === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                    {reportData.risk_level.charAt(0).toUpperCase() + reportData.risk_level.slice(1)} Risk
                  </span>
                  <p className="text-sm text-gray-600 mt-3">{reportData.summary}</p>
                </div>
              </div>

              {/* Key Findings */}
              {keyFindings.length > 0 && (
                <div className="mb-8">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                    <Brain className="w-5 h-5 text-blue-500" />
                    Key Findings
                  </h3>
                  <div className="space-y-2">
                    {keyFindings.map((finding, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-gray-700">{finding}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="mb-8">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Recommendations
                </h3>
                <div className="space-y-2">
                  {reportData.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <span className="text-green-500 font-bold text-sm mt-0.5">{i + 1}.</span>
                      <span className="text-sm text-gray-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Follow-Up Actions */}
              <div className="mb-8">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                  <Activity className="w-5 h-5 text-amber-500" />
                  Follow-Up Actions
                </h3>
                <div className="space-y-2">
                  {followUps.map((action, i) => (
                    <label key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={action.done}
                        onChange={() => {
                          const updated = [...followUps];
                          updated[i] = { ...updated[i], done: !updated[i].done };
                          setFollowUps(updated);
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className={`text-sm ${action.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                        {action.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Medication Adherence Summary */}
              {reportData.vitals && Object.keys(reportData.vitals).length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                    <Clock className="w-5 h-5 text-purple-500" />
                    Vitals Summary
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {Object.entries(reportData.vitals).map(([name, value]) => (
                      <div key={name} className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-900 capitalize">{name.replace(/_/g, ' ')}</p>
                        <p className="text-lg font-bold text-gray-900 mt-1">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Previous Reports */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Report History</h2>
          <div className="space-y-3">
            {previousReports.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setShowReport(true)}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-blue-100 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{report.title}</p>
                    <p className="text-xs text-gray-500">{report.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-lg font-bold ${getScoreColor(report.healthScore)}`}>{report.healthScore}</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getRiskColor(report.riskLevel)}`}>
                    {report.riskLevel.charAt(0).toUpperCase() + report.riskLevel.slice(1)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Generator Modal */}
      <AnimatePresence>
        {showGenerator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => !generating && setShowGenerator(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            >
              {generating ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 relative">
                    <div className="absolute inset-0 border-4 border-blue-200 rounded-full" />
                    <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
                    <Brain className="absolute inset-0 m-auto w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Generating Report...</h3>
                  <p className="text-sm text-gray-500">AI is analyzing your health data</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Generate Health Report</h2>
                    <button onClick={() => setShowGenerator(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
                      <div className="relative">
                        <select
                          value={timeRange}
                          onChange={(e) => setTimeRange(e.target.value)}
                          className="w-full appearance-none px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="1week">Last 1 Week</option>
                          <option value="1month">Last 1 Month</option>
                          <option value="3months">Last 3 Months</option>
                          <option value="6months">Last 6 Months</option>
                          <option value="1year">Last 1 Year</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Include Sections</label>
                      <div className="space-y-2">
                        {Object.entries({
                          symptoms: 'Symptoms & Complaints',
                          medications: 'Medication History',
                          vitals: 'Vital Signs',
                          labs: 'Lab Results',
                        }).map(([key, label]) => (
                          <label key={key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                            <input
                              type="checkbox"
                              checked={includeSections[key as keyof typeof includeSections]}
                              onChange={(e) =>
                                setIncludeSections({ ...includeSections, [key]: e.target.checked })
                              }
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerate}
                    className="w-full mt-6 px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <Brain className="w-4 h-4" />
                    Generate Report
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
