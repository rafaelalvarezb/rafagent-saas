import { CampaignCard } from "../CampaignCard";

export default function CampaignCardExample() {
  return (
    <CampaignCard
      id="1"
      name="Q1 Enterprise Outreach"
      status="active"
      totalProspects={50}
      sentEmails={142}
      responseRate={38.5}
      currentTouchpoint={3}
    />
  );
}
