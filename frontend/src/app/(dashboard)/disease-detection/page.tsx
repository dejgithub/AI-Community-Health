"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Camera,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  History,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api-client";
import { useAppStore } from "@/lib/store";

interface DetectionResult {
  condition: string;
  confidence: number;
  description: string;
  recommendations: string[];
  severity: string;
}

const skinCategories = [
  "Acne & Blemishes",
  "Rashes & Irritation",
  "Moles & Spots",
  "Wounds & Cuts",
  "Burns",
  "Infections",
  "Allergic Reactions",
  "Other",
];

const previousAnalyses = [
  { id: "1", date: "July 15, 2026", condition: "Normal Mole", confidence: 94, region: "Upper arm" },
  { id: "2", date: "July 10, 2026", condition: "Mild Sunburn", confidence: 91, region: "Shoulder" },
];

export default function DiseaseDetectionPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<DetectionResult[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [disclaimer, setDisclaimer] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const token = useAppStore((s) => s.token);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSelectedImage(ev.target?.result as string);
        setShowResults(false);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSelectedImage(ev.target?.result as string);
        setShowResults(false);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyze = async () => {
    if (!selectedImage || !token) return;
    setIsAnalyzing(true);
    setShowResults(false);
    setError(null);
    try {
      const response = await api.ai.analyzeImage(token);
      setResults(response.results);
      const allRecommendations = response.results.flatMap((r) => r.recommendations);
      setRecommendations([...new Set(allRecommendations)]);
      setDisclaimer(response.disclaimer);
      setShowResults(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setShowResults(false);
    setIsAnalyzing(false);
    setSelectedCategory("");
    setError(null);
    setResults([]);
    setRecommendations([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Disease Detection</h1>
          <p className="mt-1 text-sm text-muted-foreground">Upload or capture an image for AI-powered analysis</p>
        </div>
        <Button variant="outline" onClick={() => setShowHistory(!showHistory)} className="gap-2">
          <History className="h-4 w-4" />
          History
        </Button>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Medical Disclaimer</p>
            <p className="mt-1 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
              {disclaimer || "This AI analysis is for informational purposes only and is not a diagnosis. Always consult a qualified healthcare professional."}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
          <p className="text-sm font-medium text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {!selectedImage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="rounded-2xl border-2 border-dashed border-border bg-card p-12 text-center transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">Upload an Image</h3>
              <p className="mt-2 text-sm text-muted-foreground">Drag and drop an image here, or click to browse</p>
              <p className="mt-1 text-xs text-muted-foreground">Supports JPG, PNG, HEIC up to 10MB</p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <Button onClick={() => fileInputRef.current?.click()} className="bg-gradient-to-r from-primary to-accent text-white">
                  <Upload className="h-4 w-4" />
                  Browse Files
                </Button>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Camera className="h-4 w-4" />
                  Take Photo
                </Button>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </motion.div>
          )}

          {selectedImage && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Image Preview</h3>
                <button onClick={reset} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="relative mx-auto max-w-md overflow-hidden rounded-xl">
                <img src={selectedImage} alt="Uploaded for analysis" className="h-64 w-full object-cover" />
                {isAnalyzing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="text-center">
                      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent" />
                      <p className="mt-3 text-sm font-medium text-white">Analyzing image...</p>
                    </div>
                  </div>
                )}
              </div>

              {!showResults && !isAnalyzing && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium text-foreground">Select skin condition category:</p>
                  <div className="flex flex-wrap gap-2">
                    {skinCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                          selectedCategory === cat
                            ? "border-primary bg-primary text-white"
                            : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!showResults && !isAnalyzing && (
                <div className="mt-6">
                  <Button onClick={analyze} className="w-full bg-gradient-to-r from-primary to-accent text-white font-semibold">
                    <Info className="h-4 w-4" />
                    Analyze Image
                  </Button>
                </div>
              )}

              {showResults && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-6">
                  <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Detected Conditions</h3>
                    <div className="space-y-3">
                      {results.map((result) => (
                        <div key={result.condition} className="rounded-xl border border-border bg-background p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-foreground">{result.condition}</h4>
                                <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase", getSeverityColor(result.severity))}>
                                  {result.severity}
                                </span>
                              </div>
                              <p className="mt-1 text-xs text-muted-foreground">{result.description}</p>
                            </div>
                            <span className="text-lg font-bold text-foreground">{result.confidence}%</span>
                          </div>
                          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              className={cn("h-full rounded-full transition-all duration-1000", getProgressColor(result.confidence))}
                              style={{ width: `${result.confidence}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Affected Region</h3>
                    <div className="rounded-xl border border-border bg-background p-4">
                      <div className="relative overflow-hidden rounded-xl">
                        <img src={selectedImage} alt="Analysis region" className="h-48 w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-900 backdrop-blur-sm">
                          Identified: {selectedCategory || "Skin abnormality"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Recommendations</h3>
                    <div className="rounded-xl border border-border bg-background p-4">
                      <ul className="space-y-2.5">
                        {recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-gradient-to-r from-primary to-accent p-6 text-center text-white">
                    <h3 className="text-lg font-bold">Need a Professional Opinion?</h3>
                    <p className="mt-2 text-sm text-white/80">Connect with a dermatologist for a comprehensive evaluation.</p>
                    <Button className="mt-4 bg-white text-primary font-semibold hover:bg-white/90">
                      Consult a Doctor
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>

        {/* Sidebar: History */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Previous Analyses</h3>
            <div className="space-y-3">
              {previousAnalyses.map((a) => (
                <div key={a.id} className="rounded-xl border border-border bg-background p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{a.condition}</span>
                    <span className="text-xs font-bold text-primary">{a.confidence}%</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{a.region}</span>
                    <span>{a.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
            <h3 className="mb-2 text-sm font-semibold text-blue-800 dark:text-blue-300">Supported Conditions</h3>
            <ul className="space-y-1 text-xs text-blue-700 dark:text-blue-400">
              <li>• Acne & Blemishes</li>
              <li>• Eczema & Dermatitis</li>
              <li>• Psoriasis</li>
              <li>• Fungal Infections</li>
              <li>• Moles & Skin Lesions</li>
              <li>• Rashes & Allergies</li>
              <li>• Wound Assessment</li>
              <li>• Burn Severity</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case "low": return "text-green-600 bg-green-50 dark:bg-green-950/30 dark:text-green-400";
    case "medium": return "text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400";
    case "high": return "text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400";
    default: return "";
  }
}

function getProgressColor(confidence: number) {
  if (confidence >= 80) return "bg-green-500";
  if (confidence >= 50) return "bg-amber-500";
  return "bg-gray-400";
}
