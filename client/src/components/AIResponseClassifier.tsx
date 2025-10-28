import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, HelpCircle, Users, Sparkles, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ClassificationResult {
  type: "interested" | "not_interested" | "question" | "referral";
  confidence: number;
  suggestedAction: string;
}

interface AIResponseClassifierProps {
  emailContent: string;
  classification?: ClassificationResult;
  onClassify?: () => void;
}

const classificationConfig = {
  interested: {
    icon: CheckCircle,
    color: "text-success",
    bgColor: "bg-success/10",
    title: "Interested",
  },
  not_interested: {
    icon: XCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    title: "Not Interested",
  },
  question: {
    icon: HelpCircle,
    color: "text-info",
    bgColor: "bg-info/10",
    title: "General Question",
  },
  referral: {
    icon: Users,
    color: "text-referral",
    bgColor: "bg-referral/10",
    title: "Referral",
  },
};

export function AIResponseClassifier({
  emailContent,
  classification,
  onClassify,
}: AIResponseClassifierProps) {
  if (!classification) {
    return (
      <Card data-testid="card-ai-classifier">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Response Classification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground">{emailContent}</p>
            </div>
            <Button onClick={onClassify} className="w-full" data-testid="button-classify-response">
              <Sparkles className="h-4 w-4 mr-2" />
              Classify Response with AI
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const config = classificationConfig[classification.type];
  const Icon = config.icon;

  return (
    <Card data-testid="card-ai-classification-result">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Classification Result
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`p-4 rounded-md ${config.bgColor} border`}>
          <div className="flex items-center gap-3 mb-3">
            <Icon className={`h-6 w-6 ${config.color}`} />
            <div className="flex-1">
              <h3 className="font-semibold" data-testid="text-classification-type">{config.title}</h3>
              <p className="text-sm text-muted-foreground">Confidence: {classification.confidence}%</p>
            </div>
          </div>
          <Progress value={classification.confidence} className="h-2" />
        </div>
        <div className="p-3 bg-muted rounded-md">
          <p className="text-sm font-medium mb-1">Suggested Action:</p>
          <p className="text-sm text-muted-foreground" data-testid="text-suggested-action">{classification.suggestedAction}</p>
        </div>
        {classification.type === "interested" && (
          <Button className="w-full" data-testid="button-schedule-meeting">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Meeting
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
