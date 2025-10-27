import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Save } from "lucide-react";

export function TemplateBuilder() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [touchpoint, setTouchpoint] = useState("1");

  const handleRefineWithAI = () => {
    console.log("Refining template with AI...");
  };

  const handleSave = () => {
    console.log("Saving template:", { subject, content, touchpoint });
  };

  return (
    <Card data-testid="card-template-builder">
      <CardHeader>
        <CardTitle className="text-xl">Email Template Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="touchpoint">Touchpoint</Label>
          <Select value={touchpoint} onValueChange={setTouchpoint}>
            <SelectTrigger id="touchpoint" data-testid="select-touchpoint">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Touchpoint 1 - Initial Outreach</SelectItem>
              <SelectItem value="2">Touchpoint 2 - Follow-up</SelectItem>
              <SelectItem value="3">Touchpoint 3 - Value Reminder</SelectItem>
              <SelectItem value="4">Touchpoint 4 - Final Touch</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject Line</Label>
          <Input
            id="subject"
            placeholder="Enter email subject..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            data-testid="input-subject"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Email Content</Label>
          <Textarea
            id="content"
            placeholder="Enter your email template here... Use {firstName}, {company}, {position} for personalization."
            className="min-h-[200px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            data-testid="textarea-content"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleRefineWithAI} variant="outline" className="flex-1" data-testid="button-refine-ai">
            <Sparkles className="h-4 w-4 mr-2" />
            Refine with AI
          </Button>
          <Button onClick={handleSave} className="flex-1" data-testid="button-save-template">
            <Save className="h-4 w-4 mr-2" />
            Save Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
