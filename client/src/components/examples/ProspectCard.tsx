import { ProspectCard } from "../ProspectCard";

export default function ProspectCardExample() {
  return (
    <ProspectCard
      id="1"
      name="Sarah Johnson"
      email="sarah.j@techcorp.com"
      company="TechCorp Industries"
      position="VP of Sales"
      status="interested"
      lastContact="Today"
      nextFollowUp="Tomorrow"
    />
  );
}
