/**
 * Global celebration state management
 * Separated to avoid circular dependencies
 */

let celebrationState: {
  show: boolean;
  type: "success" | "achievement" | "meeting" | "milestone";
  message: string;
  listeners: Set<(state: any) => void>;
} = {
  show: false,
  type: "success",
  message: "",
  listeners: new Set(),
};

export function subscribeToCelebration(callback: (state: any) => void) {
  celebrationState.listeners.add(callback);
  return () => {
    celebrationState.listeners.delete(callback);
  };
}

export function triggerCelebration(
  type: "success" | "achievement" | "meeting" | "milestone",
  message: string
) {
  celebrationState.show = true;
  celebrationState.type = type;
  celebrationState.message = message;
  celebrationState.listeners.forEach((listener) => listener({ ...celebrationState }));

  // Auto-hide after duration
  setTimeout(() => {
    celebrationState.show = false;
    celebrationState.listeners.forEach((listener) => listener({ ...celebrationState }));
  }, 2000);
}

