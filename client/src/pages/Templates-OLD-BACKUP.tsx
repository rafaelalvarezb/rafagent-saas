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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Loader2,
  ArrowRight,
  Check,
  X
} from "lucide-react";

interface Template {
  id: string;
  templateName: string;
  subject: string;
  body: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Sequence {
  id: string;
  name: string;
  templates: Template[];
}

// Helper to get/set sequence names from localStorage
const getSequenceName = (sequenceId: string): string | null => {
  const saved = localStorage.getItem(`sequence_name_${sequenceId}`);
  return saved;
};

const setSequenceName = (sequenceId: string, name: string) => {
  localStorage.setItem(`sequence_name_${sequenceId}`, name);
};

export default function Templates() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [editingSequenceId, setEditingSequenceId] = useState<string | null>(null);
  const [editingSequenceName, setEditingSequenceName] = useState("");
  const [currentSequenceForNewTemplate, setCurrentSequenceForNewTemplate] = useState<Sequence | null>(null);
  
  const [newTemplate, setNewTemplate] = useState({
    templateName: "",
    subject: "",
    body: "",
    isActive: true,
  });

  const queryClient = useQueryClient();

  // Fetch templates
  const { data: templates = [], isLoading } = useQuery<Template[]>({
    queryKey: ["templates"],
    queryFn: async () => {
      const response = await fetch("/api/templates");
      if (!response.ok) throw new Error("Failed to fetch templates");
      return response.json();
    },
  });

  // Create template mutation
  const createMutation = useMutation({
    mutationFn: async (template: typeof newTemplate) => {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(template),
      });
      if (!response.ok) throw new Error("Failed to create template");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      setIsAddDialogOpen(false);
      setNewTemplate({ templateName: "", subject: "", body: "", isActive: true });
      setCurrentSequenceForNewTemplate(null);
    },
  });

  // Update template mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...template }: Template) => {
      const response = await fetch(`/api/templates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(template),
      });
      if (!response.ok) throw new Error("Failed to update template");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      setIsEditDialogOpen(false);
      setEditingTemplate(null);
    },
  });

  // Delete template mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/templates/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete template");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });

  // Get template order for sorting
  const getTemplateOrder = (templateName: string): number => {
    const orderMap: { [key: string]: number } = {
      'Initial': 1,
      'Second Touch': 2,
      'Third Touch': 3,
      'Fourth Touch': 4,
      'Fifth Touch': 5,
      'Sixth Touch': 6,
      'Seventh Touch': 7,
      'Eighth Touch': 8,
      'Ninth Touch': 9,
      'Tenth Touch': 10
    };
    return orderMap[templateName] || 999;
  };

  // Helper function to get sequences
  const getSequences = (): Sequence[] => {
    // Standard sequence template names - these belong to the main sequence
    const standardTemplateNames = [
      'Initial',
      'Second Touch', 
      'Third Touch', 
      'Fourth Touch', 
      'Fifth Touch', 
      'Sixth Touch', 
      'Seventh Touch', 
      'Eighth Touch',
      'Ninth Touch',
      'Tenth Touch'
    ];
    
    const defaultTemplates = templates
      .filter(t => standardTemplateNames.includes(t.templateName))
      .sort((a, b) => getTemplateOrder(a.templateName) - getTemplateOrder(b.templateName));
    
    const customTemplates = templates.filter(t => 
      !standardTemplateNames.includes(t.templateName)
    );

    const sequences: Sequence[] = [];
    
    if (defaultTemplates.length > 0) {
      const savedName = getSequenceName('standard');
      sequences.push({
        id: 'standard',
        name: savedName || 'Standard Sequence',
        templates: defaultTemplates
      });
    }
    
    if (customTemplates.length > 0) {
      const savedName = getSequenceName('custom');
      sequences.push({
        id: 'custom',
        name: savedName || 'Custom Templates',
        templates: customTemplates
      });
    }

    return sequences;
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setIsEditDialogOpen(true);
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSaveEdit = () => {
    if (editingTemplate) {
      updateMutation.mutate(editingTemplate);
    }
  };

  const startEditingSequenceName = (sequenceId: string, currentName: string) => {
    setEditingSequenceId(sequenceId);
    setEditingSequenceName(currentName);
  };

  const saveSequenceName = () => {
    if (editingSequenceId && editingSequenceName.trim()) {
      setSequenceName(editingSequenceId, editingSequenceName.trim());
      setEditingSequenceId(null);
      // Force re-render by invalidating templates query
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    }
  };

  const cancelEditingSequenceName = () => {
    setEditingSequenceId(null);
    setEditingSequenceName("");
  };

  const getDisplayName = (templateName: string) => {
    if (templateName === 'Initial') return 'Initial Email';
    return templateName;
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Templates</h1>
        <p className="text-muted-foreground mt-1">
          Manage your email templates and touchpoints
        </p>
      </div>

      {/* Sequences */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="space-y-12">
          {getSequences().map((sequence) => (
            <div key={sequence.id} className="space-y-6">
              {/* Sequence Header with Editable Name */}
              <div className="flex items-center gap-3">
                {editingSequenceId === sequence.id ? (
                  <>
                    <Input
                      value={editingSequenceName}
                      onChange={(e) => setEditingSequenceName(e.target.value)}
                      className="text-2xl font-semibold h-10 w-auto max-w-md"
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={saveSequenceName}
                      className="h-8 w-8"
                    >
                      <Check className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={cancelEditingSequenceName}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </Button>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-semibold">{sequence.name}</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startEditingSequenceName(sequence.id, sequence.name)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>

              {/* Horizontal Timeline Flow */}
              <div className="relative">
                {/* Scrollable container */}
                <div className="overflow-x-auto pb-4">
                  <div className="flex items-center gap-4 min-w-max">
                    {sequence.templates.map((template, index) => (
                      <div key={template.id} className="flex items-center">
                        {/* Template Card */}
                        <Card className="w-[320px] hover:shadow-lg transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between mb-2">
                              <CardTitle className="text-lg font-semibold">
                                {getDisplayName(template.templateName)}
                              </CardTitle>
                              <Badge 
                                variant={template.isActive ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {template.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Touch {index + 1}
                            </p>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Subject */}
                            <div>
                              <Label className="text-xs font-medium text-muted-foreground">
                                Subject
                              </Label>
                              <p className="text-sm mt-1 line-clamp-2">
                                {template.subject}
                              </p>
                            </div>

                            {/* Preview */}
                            <div>
                              <Label className="text-xs font-medium text-muted-foreground">
                                Preview
                              </Label>
                              <p className="text-sm mt-1 text-muted-foreground line-clamp-3">
                                {template.body}
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditTemplate(template)}
                                className="flex-1"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              {!['Initial', 'Second Touch', 'Third Touch', 'Fourth Touch'].includes(template.templateName) && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteTemplate(template.id)}
                                  disabled={deleteMutation.isPending}
                                  className="flex-1"
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Delete
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Arrow connecting templates */}
                        {index < sequence.templates.length - 1 && (
                          <div className="flex items-center justify-center mx-4">
                            <ArrowRight className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Add New Touch Point Button */}
                    <Button
                      variant="outline"
                      className="w-[320px] h-[280px] border-2 border-dashed hover:border-primary hover:bg-accent transition-colors"
                      onClick={() => {
                        // Get the Initial Email subject for threading
                        const initialTemplate = sequence.templates.find(t => t.templateName === 'Initial');
                        const subjectToUse = initialTemplate?.subject || '';
                        
                        setCurrentSequenceForNewTemplate(sequence);
                        setNewTemplate({
                          templateName: "",
                          subject: subjectToUse, // Pre-fill with Initial Email subject
                          body: "",
                          isActive: true,
                        });
                        setIsAddDialogOpen(true);
                      }}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Plus className="h-8 w-8" />
                        <span className="font-medium">Add Touch Point</span>
                        <span className="text-xs text-muted-foreground">
                          Touch {sequence.templates.length + 1}
                        </span>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Create New Sequence Button */}
          <div className="flex justify-center pt-6">
            <Button 
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <Plus className="h-5 w-5" />
              Create New Sequence of Templates
            </Button>
          </div>
        </div>
      )}

      {/* Add Template Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Touch Point</DialogTitle>
            <DialogDescription>
              Create a new email template for your sequence
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="templateName">Template Name *</Label>
              <Input
                id="templateName"
                placeholder="e.g., Fifth Touch, Follow-up 5, etc."
                value={newTemplate.templateName}
                onChange={(e) =>
                  setNewTemplate({ ...newTemplate, templateName: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                placeholder="e.g., Quick follow-up about ${companyName}"
                value={newTemplate.subject}
                onChange={(e) =>
                  setNewTemplate({ ...newTemplate, subject: e.target.value })
                }
                disabled={!!currentSequenceForNewTemplate && newTemplate.subject !== ""}
              />
              {currentSequenceForNewTemplate && newTemplate.subject !== "" && (
                <p className="text-xs text-muted-foreground">
                  📧 Subject is pre-filled from Initial Email to keep emails in the same thread
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Email Body *</Label>
              <Textarea
                id="body"
                placeholder="Hi ${contactName},&#10;&#10;I wanted to follow up on..."
                value={newTemplate.body}
                onChange={(e) =>
                  setNewTemplate({ ...newTemplate, body: e.target.value })
                }
                rows={8}
              />
              <p className="text-xs text-muted-foreground">
                Use variables: {'${contactName}'}, {'${companyName}'}, {'${industry}'}, {'${yourName}'}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddDialogOpen(false);
              setCurrentSequenceForNewTemplate(null);
              setNewTemplate({ templateName: "", subject: "", body: "", isActive: true });
            }}>
              Cancel
            </Button>
            <Button
              onClick={() => createMutation.mutate(newTemplate)}
              disabled={!newTemplate.templateName || !newTemplate.subject || !newTemplate.body || createMutation.isPending}
            >
              {createMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Touch Point
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>
              Update your email template
            </DialogDescription>
          </DialogHeader>

          {editingTemplate && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editTemplateName">Template Name *</Label>
                <Input
                  id="editTemplateName"
                  value={editingTemplate.templateName}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, templateName: e.target.value })
                  }
                  disabled={['Initial', 'Second Touch', 'Third Touch', 'Fourth Touch'].includes(editingTemplate.templateName)}
                />
                {['Initial', 'Second Touch', 'Third Touch', 'Fourth Touch'].includes(editingTemplate.templateName) && (
                  <p className="text-xs text-muted-foreground">
                    Core template names cannot be changed
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="editSubject">Subject *</Label>
                <Input
                  id="editSubject"
                  value={editingTemplate.subject}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, subject: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editBody">Email Body *</Label>
                <Textarea
                  id="editBody"
                  value={editingTemplate.body}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, body: e.target.value })
                  }
                  rows={8}
                />
                <p className="text-xs text-muted-foreground">
                  Use variables: {'${contactName}'}, {'${companyName}'}, {'${industry}'}, {'${yourName}'}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={!editingTemplate || updateMutation.isPending}
            >
              {updateMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
