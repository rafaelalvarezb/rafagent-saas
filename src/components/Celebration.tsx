import { useEffect, useState } from "react";
import { CheckCircle2, PartyPopper, Sparkles, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CelebrationProps {
  type?: "success" | "achievement" | "meeting" | "milestone";
  message?: string;
  show?: boolean;
  onComplete?: () => void;
  duration?: number;
}

/**
 * Celebration component for successful actions
 */
export function Celebration({
  type = "success",
  message,
  show = false,
  onComplete,
  duration = 2000,
}: CelebrationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      // Trigger animation after render
      setTimeout(() => setIsVisible(true), 10);
      
      // Hide after duration
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          setShouldRender(false);
          onComplete?.();
        }, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onComplete]);

  if (!shouldRender) return null;

  const icons = {
    success: CheckCircle2,
    achievement: Trophy,
    meeting: PartyPopper,
    milestone: Sparkles,
  };

  const colors = {
    success: "text-green-500",
    achievement: "text-yellow-500",
    meeting: "text-blue-500",
    milestone: "text-purple-500",
  };

  const Icon = icons[type];

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none",
        "transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-4",
          "transform transition-all duration-500",
          isVisible ? "scale-100 translate-y-0" : "scale-75 translate-y-4"
        )}
      >
        <div
          className={cn(
            "relative",
            "animate-bounce",
            "transition-all duration-500"
          )}
        >
          <Icon
            className={cn(
              "h-24 w-24",
              colors[type],
              "drop-shadow-2xl",
              "animate-pulse"
            )}
          />
          {/* Sparkle effects */}
          <div className="absolute inset-0 -z-10">
            <div
              className={cn(
                "absolute top-0 left-0 h-4 w-4 rounded-full",
                colors[type],
                "animate-ping opacity-75"
              )}
              style={{ animationDelay: "0s" }}
            />
            <div
              className={cn(
                "absolute top-0 right-0 h-3 w-3 rounded-full",
                colors[type],
                "animate-ping opacity-75"
              )}
              style={{ animationDelay: "0.2s" }}
            />
            <div
              className={cn(
                "absolute bottom-0 left-0 h-3 w-3 rounded-full",
                colors[type],
                "animate-ping opacity-75"
              )}
              style={{ animationDelay: "0.4s" }}
            />
            <div
              className={cn(
                "absolute bottom-0 right-0 h-4 w-4 rounded-full",
                colors[type],
                "animate-ping opacity-75"
              )}
              style={{ animationDelay: "0.6s" }}
            />
          </div>
        </div>
        {message && (
          <div
            className={cn(
              "text-2xl font-bold text-center px-6 py-3 rounded-lg",
              "bg-background/90 backdrop-blur-sm border shadow-xl",
              "transform transition-all duration-500",
              isVisible ? "scale-100" : "scale-95"
            )}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

