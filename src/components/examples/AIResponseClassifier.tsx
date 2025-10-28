import { AIResponseClassifier } from "../AIResponseClassifier";

export default function AIResponseClassifierExample() {
  return (
    <AIResponseClassifier
      emailContent="Hi, I'm very interested in learning more about your solution. Could we schedule a demo next week? I'm available Tuesday or Thursday afternoon."
      classification={{
        type: "interested",
        confidence: 94,
        suggestedAction: "Schedule a meeting using the prospect's preferred time slots. Check calendar availability for Tuesday or Thursday afternoon with 24-hour preparation gap.",
      }}
    />
  );
}
