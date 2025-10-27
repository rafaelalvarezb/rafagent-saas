import { StatusBadge } from "../StatusBadge";

export default function StatusBadgeExample() {
  return (
    <div className="flex flex-wrap gap-2">
      <StatusBadge status="interested" />
      <StatusBadge status="not_interested" />
      <StatusBadge status="question" />
      <StatusBadge status="referral" />
      <StatusBadge status="new" />
      <StatusBadge status="contacted" />
      <StatusBadge status="following_up" />
    </div>
  );
}
