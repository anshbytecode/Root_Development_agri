import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAIAnalysis, RootAnalysisResult } from "@/hooks/useAIAnalysis";
import { Loader2, Upload, Camera, Sparkles, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AIAnalysisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AIAnalysisModal({ open, onOpenChange }: AIAnalysisModalProps) {
  const { analyzeRootImage, isAnalyzing } = useAIAnalysis();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<RootAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    const result = await analyzeRootImage(imagePreview || undefined);
    if (result) {
      setAnalysisResult(result);
    }
  };

  const handleDemoAnalysis = async () => {
    const result = await analyzeRootImage();
    if (result) {
      setAnalysisResult(result);
    }
  };

  const resetModal = () => {
    setImagePreview(null);
    setAnalysisResult(null);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) resetModal(); }}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald" />
            AI Root Analysis
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {!analysisResult ? (
            <>
              {/* Image Upload Section */}
              <div className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />
                
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Root preview"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute bottom-2 right-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-emerald/50 hover:bg-emerald/5 transition-colors"
                  >
                    <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm font-medium">Upload Root Image</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG or WebP up to 10MB
                    </p>
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleAnalyze}
                  variant="emerald"
                  disabled={isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4 mr-2" />
                      Analyze {imagePreview ? 'Image' : 'Demo Sample'}
                    </>
                  )}
                </Button>
                
                {!imagePreview && (
                  <p className="text-xs text-center text-muted-foreground">
                    No image? Click to run analysis on a demo sample
                  </p>
                )}
              </div>
            </>
          ) : (
            /* Analysis Results */
            <div className="space-y-4">
              {/* Health Score */}
              <Card className="p-4 bg-gradient-to-br from-emerald/10 to-leaf/5 border-emerald/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Health Score</span>
                  <span className={`text-2xl font-bold ${analysisResult.healthScore >= 80 ? 'text-emerald' : analysisResult.healthScore >= 50 ? 'text-terracotta' : 'text-destructive'}`}>
                    {analysisResult.healthScore}/100
                  </span>
                </div>
                <Progress value={analysisResult.healthScore} variant="emerald" size="default" />
              </Card>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-3">
                  <p className="text-xs text-muted-foreground">Root Length</p>
                  <p className="text-lg font-bold">{analysisResult.rootLength} cm</p>
                </Card>
                <Card className="p-3">
                  <p className="text-xs text-muted-foreground">Root Depth</p>
                  <p className="text-lg font-bold">{analysisResult.rootDepth} cm</p>
                </Card>
                <Card className="p-3">
                  <p className="text-xs text-muted-foreground">Branching</p>
                  <p className="text-lg font-bold">{analysisResult.branchingCount} nodes</p>
                </Card>
                <Card className="p-3">
                  <p className="text-xs text-muted-foreground">Density</p>
                  <p className="text-lg font-bold">{analysisResult.densityScore}%</p>
                </Card>
              </div>
              
              {/* Stress Indicators */}
              {analysisResult.stressIndicators && analysisResult.stressIndicators.length > 0 && (
                <Card className="p-4 border-terracotta/30 bg-terracotta/5">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-terracotta" />
                    <span className="font-medium text-sm">Stress Indicators</span>
                  </div>
                  <ul className="text-sm space-y-1">
                    {analysisResult.stressIndicators.map((indicator, i) => (
                      <li key={i} className="text-muted-foreground">• {indicator}</li>
                    ))}
                  </ul>
                </Card>
              )}
              
              {/* Recommendations */}
              {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
                <Card className="p-4 border-emerald/30 bg-emerald/5">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald" />
                    <span className="font-medium text-sm">Recommendations</span>
                  </div>
                  <ul className="text-sm space-y-1">
                    {analysisResult.recommendations.map((rec, i) => (
                      <li key={i} className="text-muted-foreground">• {rec}</li>
                    ))}
                  </ul>
                </Card>
              )}
              
              {/* Overall Assessment */}
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm font-medium mb-1">Overall Assessment</p>
                <p className="text-sm text-muted-foreground">{analysisResult.overallAssessment}</p>
              </div>
              
              <Button variant="outline" onClick={resetModal} className="w-full">
                Analyze Another
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
