import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Loader2,
  Calendar,
  Mail,
  Info,
  Clock,
  Copy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Template {
  id: string;
  userId: string;
  sequenceId: string;
  templateName: string;
  subject: string;
  body: string;
  isActive: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

interface Sequence {
  id: string;
  userId: string;
  name: string;
  isDefault: boolean;
  meetingTitle?: string;
  meetingDescription?: string;
  reminderEnabled?: boolean;
  reminderTiming?: string;
  reminderSubject?: string;
  reminderBody?: string;
  createdAt: string;
  updatedAt: string;
}

export default function Templates() {
  const [isCreateSequenceOpen, setIsCreateSequenceOpen] = useState(false);
  const [isMeetingTemplateOpen, setIsMeetingTemplateOpen] = useState(false);
  const [isEditTemplateOpen, setIsEditTemplateOpen] = useState(false);
  const [editingSequence, setEditingSequence] = useState<Sequence | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [newSequenceName, setNewSequenceName] = useState("");
  const [editingSequenceName, setEditingSequenceName] = useState<string | null>(null);
  const [tempSequenceName, setTempSequenceName] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch sequences
  const { data: sequences = [], isLoading: loadingSequences } = useQuery<Sequence[]>({
    queryKey: ["sequences"],
    queryFn: async () => {
      const response = await fetch("/api/sequences");
      if (!response.ok) throw new Error("Failed to fetch sequences");
      return response.json();
    },
  });

  // Fetch templates for all sequences
  const { data: allTemplates = [], isLoading: loadingTemplates } = useQuery<Template[]>({
    queryKey: ["templates"],
    queryFn: async () => {
      const response = await fetch("/api/templates");
      if (!response.ok) throw new Error("Failed to fetch templates");
      return response.json();
    },
  });

  // Create sequence mutation
  const createSequenceMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await fetch("/api/sequences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) throw new Error("Failed to create sequence");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sequences"] });
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      setIsCreateSequenceOpen(false);
      setNewSequenceName("");
      toast({
        title: "Sequence created!",
        description: "Your new sequence has been created with 4 default templates.",
      });
    },
  });

  // Update sequence mutation
  const updateSequenceMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Sequence> & { id: string }) => {
      const response = await fetch(`/api/sequences/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update sequence");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sequences"] });
      setIsMeetingTemplateOpen(false);
      setEditingSequenceName(null);
      toast({
        title: "Sequence updated!",
        description: "Your changes have been saved.",
      });
    },
  });

  // Delete sequence mutation
  const deleteSequenceMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/sequences/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete sequence");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sequences"] });
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast({
        title: "Sequence deleted",
        description: "The sequence and its templates have been removed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Cannot delete sequence",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update template mutation
  const updateTemplateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Template> & { id: string }) => {
      const response = await fetch(`/api/templates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update template");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      setIsEditTemplateOpen(false);
      setEditingTemplate(null);
      toast({
        title: "Template updated!",
        description: "Your template has been saved.",
      });
    },
  });

  const handleCreateSequence = () => {
    if (newSequenceName.trim()) {
      createSequenceMutation.mutate(newSequenceName.trim());
    }
  };

  const handleUpdateSequenceName = (sequenceId: string) => {
    if (tempSequenceName.trim()) {
      updateSequenceMutation.mutate({ id: sequenceId, name: tempSequenceName.trim() });
    }
  };

  const handleOpenMeetingTemplate = (sequence: Sequence) => {
    setEditingSequence(sequence);
    setIsMeetingTemplateOpen(true);
  };

  const handleSaveMeetingTemplate = () => {
    if (editingSequence) {
      updateSequenceMutation.mutate({
        id: editingSequence.id,
        meetingTitle: editingSequence.meetingTitle,
        meetingDescription: editingSequence.meetingDescription,
        reminderEnabled: editingSequence.reminderEnabled,
        reminderTiming: editingSequence.reminderTiming,
        reminderSubject: editingSequence.reminderSubject,
        reminderBody: editingSequence.reminderBody,
      });
    }
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setIsEditTemplateOpen(true);
  };

  const handleSaveTemplate = () => {
    if (editingTemplate) {
      updateTemplateMutation.mutate({
        id: editingTemplate.id,
        subject: editingTemplate.subject,
        body: editingTemplate.body,
      });
    }
  };

  const getTemplatesForSequence = (sequenceId: string) => {
    return allTemplates
      .filter(t => t.sequenceId === sequenceId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  };

  const getTouchpointLabel = (templateName: string) => {
    const labels: Record<string, string> = {
      'Initial': 'Touch 1',
      'Second Touch': 'Touch 2',
      'Third Touch': 'Touch 3',
      'Fourth Touch': 'Touch 4',
    };
    return labels[templateName] || templateName;
  };

  if (loadingSequences || loadingTemplates) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 pb-12 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
        <p className="text-base text-muted-foreground">
          Manage your email templates and touchpoints
        </p>
      </div>

      {/* Sequences */}
      <div className="space-y-8">
        {sequences
          .sort((a, b) => {
            // Standard Sequence (isDefault) always first
            if (a.isDefault) return -1;
            if (b.isDefault) return 1;
            // Then by creation date (newest last)
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          })
          .map((sequence) => {
          const templates = getTemplatesForSequence(sequence.id);
          const isEditing = editingSequenceName === sequence.id;

          return (
            <div key={sequence.id} className="space-y-4 p-4 rounded-xl border-2 border-border/50 bg-card/30">
              {/* Sequence Header */}
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-3">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={tempSequenceName}
                        onChange={(e) => setTempSequenceName(e.target.value)}
                        className="w-64"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleUpdateSequenceName(sequence.id);
                          } else if (e.key === 'Escape') {
                            setEditingSequenceName(null);
                            setTempSequenceName("");
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={() => handleUpdateSequenceName(sequence.id)}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingSequenceName(null);
                          setTempSequenceName("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold tracking-tight">{sequence.name}</h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingSequenceName(sequence.id);
                          setTempSequenceName(sequence.name);
                        }}
                        className="h-7 w-7 p-0"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  )}
                  {sequence.isDefault && (
                    <Badge variant="secondary" className="px-2 py-0.5 text-xs">Default</Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="default"
                    onClick={() => handleOpenMeetingTemplate(sequence)}
                    className="shadow-sm hover:shadow-md transition-all"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Meeting Template
                  </Button>
                  {!sequence.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Delete "${sequence.name}" sequence?`)) {
                          deleteSequenceMutation.mutate(sequence.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Templates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {templates.map((template, index) => (
                  <Card key={template.id} className="relative group hover:shadow-lg transition-all hover:scale-[1.01] border-2">
                    <CardHeader className="pb-3 pt-4">
                      <div className="flex items-center justify-between mb-1">
                        <div className="space-y-0.5">
                          <CardTitle className="text-lg font-bold">{template.templateName}</CardTitle>
                          <CardDescription className="text-xs">{getTouchpointLabel(template.templateName)}</CardDescription>
                        </div>
                        <Badge variant={template.isActive ? "default" : "secondary"} className="px-2 py-0.5 text-xs">
                          {template.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Subject */}
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Subject</Label>
                        <p className="text-xs font-medium leading-snug min-h-[32px]">
                          {index === 0 ? template.subject : (
                            <span className="text-muted-foreground italic">
                              Uses same subject (threading)
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Preview */}
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Preview</Label>
                        <p className="text-xs line-clamp-3 text-muted-foreground leading-snug min-h-[48px]">
                          {template.body}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTemplate(template)}
                          className="w-full hover:bg-primary/10 h-8"
                        >
                          <Edit className="h-3.5 w-3.5 mr-1.5" />
                          Edit
                        </Button>
                      </div>
                    </CardContent>

                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create New Sequence Button */}
      <div className="flex justify-start pt-4">
        <Button
          onClick={() => setIsCreateSequenceOpen(true)}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-base px-6 py-5 shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Sequence of Templates
        </Button>
      </div>

      {/* Create Sequence Dialog */}
      <Dialog open={isCreateSequenceOpen} onOpenChange={setIsCreateSequenceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Sequence</DialogTitle>
            <DialogDescription>
              Create a new email sequence with 4 default templates (Initial, Second Touch, Third Touch, Fourth Touch).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sequence-name">Sequence Name</Label>
              <Input
                id="sequence-name"
                placeholder="e.g., Agency Sequence, Retail Sequence"
                value={newSequenceName}
                onChange={(e) => setNewSequenceName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateSequence();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateSequenceOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateSequence}
              disabled={!newSequenceName.trim() || createSequenceMutation.isPending}
            >
              {createSequenceMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Sequence"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Meeting Template Dialog */}
      <Dialog open={isMeetingTemplateOpen} onOpenChange={setIsMeetingTemplateOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Meeting Templates</DialogTitle>
            <DialogDescription>
              Configure meeting invitations for prospects in this sequence.
            </DialogDescription>
          </DialogHeader>
          
          {editingSequence && (
            <div className="space-y-6 py-4">
              {/* Meeting Title */}
              <div className="space-y-2">
                <Label htmlFor="meeting-title">Meeting Title Template</Label>
                <Input
                  id="meeting-title"
                  placeholder="${companyName} & Google"
                  value={editingSequence.meetingTitle || ""}
                  onChange={(e) => setEditingSequence({
                    ...editingSequence,
                    meetingTitle: e.target.value
                  })}
                />
                <p className="text-xs text-muted-foreground">
                  Variables: ${"{contactName}"}, ${"{companyName}"}, ${"{yourName}"}
                </p>
              </div>

              {/* Meeting Description */}
              <div className="space-y-2">
                <Label htmlFor="meeting-description">Meeting Description Template</Label>
                <Textarea
                  id="meeting-description"
                  placeholder="Meeting description..."
                  value={editingSequence.meetingDescription || ""}
                  onChange={(e) => setEditingSequence({
                    ...editingSequence,
                    meetingDescription: e.target.value
                  })}
                  rows={4}
                />
              </div>

              <div className="border-t pt-6">
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMeetingTemplateOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveMeetingTemplate}
              disabled={updateSequenceMutation.isPending}
            >
              {updateSequenceMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Templates"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={isEditTemplateOpen} onOpenChange={setIsEditTemplateOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Template: {editingTemplate?.templateName}</DialogTitle>
            <DialogDescription>
              {editingTemplate?.templateName === 'Initial' 
                ? 'Edit the subject and body. Follow-up templates will use the same subject for proper email threading.'
                : 'Edit the body. This template uses the same subject as the Initial email for threading.'}
            </DialogDescription>
          </DialogHeader>
          
          {editingTemplate && (
            <div className="space-y-4 py-4">
              {/* Subject (only for Initial) */}
              {editingTemplate.templateName === 'Initial' && (
                <div className="space-y-2">
                  <Label htmlFor="edit-subject">Subject</Label>
                  <Input
                    id="edit-subject"
                    value={editingTemplate.subject}
                    onChange={(e) => setEditingTemplate({
                      ...editingTemplate,
                      subject: e.target.value
                    })}
                  />
                  <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted p-2 rounded">
                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <p>
                      All touchpoints in this sequence will use this same subject to keep emails in one Gmail thread.
                    </p>
                  </div>
                </div>
              )}

              {/* Body */}
              <div className="space-y-2">
                <Label htmlFor="edit-body">Email Body</Label>
                <Textarea
                  id="edit-body"
                  value={editingTemplate.body}
                  onChange={(e) => setEditingTemplate({
                    ...editingTemplate,
                    body: e.target.value
                  })}
                  rows={12}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Available variables: ${"{contactName}"}, ${"{companyName}"}, ${"{contactTitle}"}, ${"{industry}"}, ${"{yourName}"}
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditTemplateOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveTemplate}
              disabled={updateTemplateMutation.isPending}
            >
              {updateTemplateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Template"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

