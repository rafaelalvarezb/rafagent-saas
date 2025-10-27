import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, HelpCircle, Users, Pause, Clock, Search, AlertTriangle, Mail, Pencil, Send } from "lucide-react";

export type ProspectStatus = "interested" | "not_interested" | "question" | "referral" | "new" | "contacted" | "following_up" | "paused" | "waiting_working_hours" | "general_question" | "review_answer" | "bounce" | "out_of_office" | "drafting_next_touch" | "sending_next_touch";

interface StatusBadgeProps {
  status: ProspectStatus;
}

const statusConfig = {
  interested: {
    label: "Interested",
    className: "bg-success text-success-foreground border-success-border",
    icon: CheckCircle,
  },
  not_interested: {
    label: "Not Interested",
    className: "bg-destructive text-destructive-foreground border-destructive-border",
    icon: XCircle,
  },
  question: {
    label: "Question",
    className: "bg-info text-info-foreground border-info-border",
    icon: HelpCircle,
  },
  referral: {
    label: "Referral",
    className: "bg-referral text-referral-foreground border-referral-border",
    icon: Users,
  },
  new: {
    label: "New",
    className: "bg-muted text-muted-foreground border-muted-border",
    icon: null,
  },
  contacted: {
    label: "Contacted",
    className: "bg-primary text-primary-foreground border-primary-border",
    icon: null,
  },
  following_up: {
    label: "Following Up",
    className: "bg-muted text-muted-foreground border-muted-border",
    icon: null,
  },
  paused: {
    label: "✋ PAUSED (MANUAL STOP)",
    className: "bg-destructive text-destructive-foreground border-destructive-border",
    icon: Pause,
  },
  waiting_working_hours: {
    label: "😴 WAITING FOR WORKING HOURS",
    className: "bg-muted text-muted-foreground border-muted-border",
    icon: Clock,
  },
  general_question: {
    label: "❓ General Question",
    className: "bg-blue-100 text-blue-800 border-blue-200",
    icon: HelpCircle,
  },
  review_answer: {
    label: "🔍 Review Answer",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Search,
  },
  bounce: {
    label: "📧 Bounce",
    className: "bg-red-100 text-red-800 border-red-200",
    icon: Mail,
  },
  out_of_office: {
    label: "🏖️ Out of Office",
    className: "bg-orange-100 text-orange-800 border-orange-200",
    icon: AlertTriangle,
  },
  drafting_next_touch: {
    label: "📝 Drafting next touch",
    className: "bg-blue-50 text-blue-700 border-blue-200 animate-pulse-subtle",
    icon: Pencil,
  },
  sending_next_touch: {
    label: "📤 Sending next touch",
    className: "bg-green-50 text-green-700 border-green-200 animate-pulse-subtle",
    icon: Send,
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  // Normalize status string to match config keys
  const normalizeStatus = (statusStr: string): ProspectStatus | null => {
    const lowerStatus = statusStr.toLowerCase();
    
    // Check for transitional states with emojis
    if (statusStr.includes('📝') || lowerStatus.includes('drafting')) {
      return 'drafting_next_touch';
    }
    if (statusStr.includes('📤') || lowerStatus.includes('sending next')) {
      return 'sending_next_touch';
    }
    
    // Check for other status patterns
    if (lowerStatus.includes('following')) return 'following_up';
    if (lowerStatus.includes('interested') && !lowerStatus.includes('not')) return 'interested';
    if (lowerStatus.includes('not interested')) return 'not_interested';
    if (lowerStatus.includes('referr') || statusStr.includes('🤝')) return 'referral';
    if (lowerStatus.includes('bounce')) return 'bounce';
    if (lowerStatus.includes('out of office') || lowerStatus.includes('ooo')) return 'out_of_office';
    if (lowerStatus.includes('general question')) return 'general_question';
    if (lowerStatus.includes('review answer')) return 'review_answer';
    if (lowerStatus.includes('paused')) return 'paused';
    if (lowerStatus.includes('waiting')) return 'waiting_working_hours';
    
    return null;
  };
  
  const normalizedStatus = normalizeStatus(status);
  const config = normalizedStatus ? statusConfig[normalizedStatus] : null;
  
  if (!config) {
    return (
      <Badge className="text-xs uppercase tracking-wide border bg-muted text-muted-foreground" data-testid={`badge-status-${status}`}>
        {status}
      </Badge>
    );
  }

  const Icon = config.icon;

  return (
    <Badge className={`text-xs uppercase tracking-wide border ${config.className}`} data-testid={`badge-status-${status}`}>
      {Icon && <Icon className="h-3 w-3 mr-1" />}
      {config.label}
    </Badge>
  );
}
