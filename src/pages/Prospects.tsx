import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/use-websocket";
import { usePolling } from "@/hooks/use-polling";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Plus, 
  Search, 
  Mail, 
  MessageSquare, 
  Calendar,
  ExternalLink,
  Loader2,
  Edit,
  Trash2,
  MoreHorizontal,
  Play,
  Eye,
  UserPlus,
  Info,
  Upload,
  FileText,
  X,
  File,
  Check,
  AlertCircle,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Reply,
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { StatusBadge } from "@/components/StatusBadge";
import { apiCall } from "@/lib/api";

interface Prospect {
  id: string;
  contactName: string;
  contactEmail: string;
  contactTitle?: string;
  companyName?: string;
  industry?: string;
  status?: string;
  sendSequence?: boolean;
  touchpointsSent?: number;
  lastContactDate?: string;
  threadLink?: string;
  emailOpened?: boolean;
  emailOpenedAt?: string;
  repliedAt?: string;
  meetingTime?: string;
}

interface Sequence {
  id: string;
  userId: string;
  name: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

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

export default function Prospects() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProspect, setEditingProspect] = useState<Prospect | null>(null);
  const [deleteProspectId, setDeleteProspectId] = useState<string | null>(null);
  const [isExecutingAgent, setIsExecutingAgent] = useState(false);
  const [editingDateId, setEditingDateId] = useState<string | null>(null);
  const [editingDate, setEditingDate] = useState<string>("");
  const [selectedSequence, setSelectedSequence] = useState("");
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [bulkImportSequence, setBulkImportSequence] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<{[key: string]: string}>({});
  const [mappedData, setMappedData] = useState<any[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [expandedProspectId, setExpandedProspectId] = useState<string | null>(null);
  const [newProspect, setNewProspect] = useState({
    contactName: "",
    contactEmail: "",
    contactTitle: "",
    companyName: "",
    industry: "",
    sendSequence: true,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if we should auto-open the add dialog from Dashboard
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('add') === 'true') {
      setIsAddDialogOpen(true);
      // Clean the URL after opening the dialog
      setLocation('/prospects');
    }
  }, [setLocation]);
  
  // Fetch sequences
  const { data: sequences = [] } = useQuery<Sequence[]>({
    queryKey: ["sequences"],
    queryFn: async () => {
      const response = await apiCall("/sequences");
      if (!response.ok) throw new Error("Failed to fetch sequences");
      return response.json();
    },
  });

  // Initialize WebSocket for real-time updates
  useWebSocket();
  
  // Fallback polling for updates (in case WebSocket fails)
  usePolling();

  // Fetch prospects (no more polling, updates come via WebSocket)
  const { data: prospects = [], isLoading } = useQuery<Prospect[]>({
    queryKey: ["prospects"],
    queryFn: async () => {
      const response = await apiCall("/prospects");
      if (!response.ok) throw new Error("Failed to fetch prospects");
      return response.json();
    },
  });

  // Fetch templates for sequences
  const { data: templates = [] } = useQuery<Template[]>({
    queryKey: ["templates"],
    queryFn: async () => {
      const response = await apiCall("/templates");
      if (!response.ok) throw new Error("Failed to fetch templates");
      return response.json();
    },
  });

  // Create prospect
  const createMutation = useMutation({
    mutationFn: async (data: typeof newProspect & { sequenceId?: string }) => {
      const response = await apiCall("/prospects", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create prospect");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prospects"] });
      setIsAddDialogOpen(false);
      setSelectedSequence(""); // Reset selected sequence
      setNewProspect({
        contactName: "",
        contactEmail: "",
        contactTitle: "",
        companyName: "",
        industry: "",
        sendSequence: true,
      });
      toast({
        title: "Prospect Added",
        description: "New prospect has been added successfully.",
        variant: "success" as any,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Toggle send sequence
  const toggleSequenceMutation = useMutation({
    mutationFn: async ({ id, sendSequence }: { id: string; sendSequence: boolean }) => {
      const response = await apiCall(`/prospects/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ sendSequence }),
      });
      if (!response.ok) throw new Error("Failed to update prospect");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prospects"] });
      queryClient.refetchQueries({ queryKey: ["prospects"] });
      toast({
        title: "Sequence updated",
        description: "Prospect sequence status has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Send initial email
  const sendInitialMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiCall(`/prospects/${id}/send-initial`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to send initial email");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prospects"] });
      queryClient.refetchQueries({ queryKey: ["prospects"] });
      toast({
        title: "Email Sent",
        description: "Initial email has been sent successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update prospect
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Prospect> }) => {
      const response = await apiCall(`/prospects/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update prospect");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prospects"] });
      setIsEditDialogOpen(false);
      setEditingProspect(null);
      toast({
        title: "Prospect Updated",
        description: "Prospect information has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete prospect
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiCall(`/prospects/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete prospect");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prospects"] });
      setDeleteProspectId(null);
      toast({
        title: "Prospect Deleted",
        description: "Prospect has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Execute AI Agent
  const executeAgentMutation = useMutation({
    mutationFn: async () => {
      const response = await apiCall("/agent/run", {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to execute agent");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["prospects"] });
      setIsExecutingAgent(false);
      toast({
        title: "Agent Executed",
        description: "Processed prospects successfully.",
      });
    },
    onError: (error: Error) => {
      setIsExecutingAgent(false);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Bulk import prospects
  const bulkImportMutation = useMutation({
    mutationFn: async ({ prospects, sequenceId }: { prospects: any[], sequenceId?: string }) => {
      const response = await apiCall("/prospects/bulk", {
        method: "POST",
        body: JSON.stringify({ prospects, sequenceId }),
      });
      if (!response.ok) throw new Error("Failed to import prospects");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["prospects"] });
      setIsBulkImportOpen(false);
      resetImportState();
      toast({
        title: "Bulk Import Complete",
        description: `Successfully imported ${data.created} prospects. ${data.errors > 0 ? `${data.errors} errors occurred.` : ''}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter prospects based on search
  const filteredProspects = prospects.filter((p) =>
    p.contactName.toLowerCase().includes(search.toLowerCase()) ||
    p.contactEmail.toLowerCase().includes(search.toLowerCase()) ||
    p.companyName?.toLowerCase().includes(search.toLowerCase())
  );


  // Helper functions
  const handleEditProspect = (prospect: Prospect) => {
    setEditingProspect(prospect);
    setIsEditDialogOpen(true);
  };

  const handleDeleteProspect = (id: string) => {
    setDeleteProspectId(id);
  };

  const canEditProspect = (prospect: Prospect) => {
    return !prospect.touchpointsSent || prospect.touchpointsSent === 0;
  };

  const handleExecuteAgent = () => {
    setIsExecutingAgent(true);
    executeAgentMutation.mutate();
  };

  // Handle file drop
  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    
    try {
      const files = Array.from(event.dataTransfer.files);
      const csvFile = files.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'));
      
      if (csvFile) {
        setIsProcessingFile(true);
        setCsvFile(csvFile);
        parseCSVFile(csvFile);
      } else {
        toast({
          title: "Invalid File",
          description: "Please upload a CSV file.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error in handleFileDrop:', error);
      toast({
        title: "Upload Error",
        description: "Failed to process the dropped file.",
        variant: "destructive",
      });
    }
  };

  // Handle file input
  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsProcessingFile(true);
      setCsvFile(file);
      parseCSVFile(file);
    }
  };

  // Parse CSV file
  const parseCSVFile = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        
        if (!text) {
          throw new Error('File is empty');
        }
        
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          toast({
            title: "Invalid CSV",
            description: "CSV file must have at least a header row and one data row.",
            variant: "destructive",
          });
          return;
        }

        // Simple CSV parser that handles quoted fields
        const parseCSVLine = (line: string): string[] => {
          const result = [];
          let current = '';
          let inQuotes = false;
          
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              result.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          
          result.push(current.trim());
          return result;
        };

        const headers = parseCSVLine(lines[0]);
        
        const data = lines.slice(1).map((line, index) => {
          try {
            const values = parseCSVLine(line);
            const row: any = {};
            headers.forEach((header, headerIndex) => {
              row[header] = values[headerIndex] || '';
            });
            return row;
          } catch (lineError) {
            console.warn(`Error parsing line ${index + 2}:`, lineError);
            return null;
          }
        }).filter(row => row !== null);
        
        setCsvHeaders(headers);
        setCsvData(data);
        autoMapColumns(headers, data);
        setIsProcessingFile(false);
        
      } catch (error) {
        console.error('Error parsing CSV:', error);
        setIsProcessingFile(false);
        toast({
          title: "Parse Error",
          description: `Failed to parse the CSV file: ${error.message}`,
          variant: "destructive",
        });
        resetImportState();
      }
    };
    
    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      setIsProcessingFile(false);
      toast({
        title: "File Error",
        description: "Failed to read the file. Please try again.",
        variant: "destructive",
      });
      resetImportState();
    };
    
    reader.readAsText(file);
  };

  // Auto-map columns based on common patterns
  const autoMapColumns = (headers: string[], data: any[]) => {
    const mapping: {[key: string]: string} = {};
    
    headers.forEach(header => {
      const lowerHeader = header.toLowerCase();
      
      if (lowerHeader.includes('first name') || lowerHeader.includes('firstname')) {
        mapping[header] = 'contactName';
      } else if (lowerHeader.includes('email') && lowerHeader.includes('address')) {
        mapping[header] = 'contactEmail';
      } else if (lowerHeader.includes('job title') || lowerHeader.includes('jobtitle') || lowerHeader.includes('title')) {
        mapping[header] = 'contactTitle';
      } else if (lowerHeader.includes('company name') || lowerHeader.includes('companyname') || lowerHeader.includes('company')) {
        mapping[header] = 'companyName';
      } else if (lowerHeader.includes('industry') || lowerHeader.includes('primary industry')) {
        mapping[header] = 'industry';
      }
    });

    setColumnMapping(mapping);
    generateMappedData(data, mapping);
  };

  // Generate mapped data
  const generateMappedData = (data: any[], mapping: {[key: string]: string}) => {
    try {
      const mapped = data.map(row => {
        const prospect: any = {};
        Object.entries(mapping).forEach(([csvColumn, prospectField]) => {
          if (prospectField && row[csvColumn]) {
            prospect[prospectField] = row[csvColumn];
          }
        });
        return prospect;
      }).filter(p => p.contactName && p.contactEmail);

      setMappedData(mapped);
    } catch (error) {
      console.error('Error generating mapped data:', error);
      setMappedData([]);
    }
  };

  // Handle column mapping change
  const handleColumnMappingChange = (csvColumn: string, prospectField: string) => {
    const newMapping = { ...columnMapping };
    if (prospectField === 'skip') {
      delete newMapping[csvColumn];
    } else {
      newMapping[csvColumn] = prospectField;
    }
    setColumnMapping(newMapping);
    generateMappedData(csvData, newMapping);
  };

  // Handle bulk import
  const handleBulkImport = () => {
    if (mappedData.length === 0) {
      toast({
        title: "No Valid Data",
        description: "No valid prospects found after mapping columns.",
        variant: "destructive",
      });
      return;
    }

    if (!bulkImportSequence) {
      toast({
        title: "Sequence Required",
        description: "Please select an email sequence for the imported prospects.",
        variant: "destructive",
      });
      return;
    }

    bulkImportMutation.mutate({ 
      prospects: mappedData, 
      sequenceId: bulkImportSequence 
    });
  };

  // Reset import state
  const resetImportState = () => {
    setCsvFile(null);
    setCsvData([]);
    setCsvHeaders([]);
    setColumnMapping({});
    setMappedData([]);
    setIsPreviewMode(false);
    setIsProcessingFile(false);
    setBulkImportSequence("");
  };



  const handleDateClick = (prospect: Prospect) => {
    if (prospect.lastContactDate) {
      const date = new Date(prospect.lastContactDate);
      const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      setEditingDate(formattedDate);
      setEditingDateId(prospect.id);
    }
  };

  const handleDateSave = (prospectId: string) => {
    if (editingDate) {
      // Convert the date string to a Date object at noon local time to avoid timezone shifts
      const dateToSave = new Date(editingDate + 'T12:00:00');
      updateMutation.mutate({
        id: prospectId,
        data: { lastContactDate: dateToSave.toISOString() }
      }, {
        onSuccess: () => {
          setEditingDateId(null);
          setEditingDate("");
        },
        onError: (error) => {
          console.error('Error updating date:', error);
          // Keep the editing state open so user can try again
        }
      });
    } else {
      setEditingDateId(null);
      setEditingDate("");
    }
  };

  const handleDateCancel = () => {
    setEditingDateId(null);
    setEditingDate("");
  };

  // Handle row expansion toggle
  const handleRowClick = (prospectId: string) => {
    if (expandedProspectId === prospectId) {
      setExpandedProspectId(null); // Collapse if already expanded
    } else {
      setExpandedProspectId(prospectId); // Expand this row
    }
  };

  // Get template name for touchpoint number for ordering
  const getTemplateOrder = (templateName: string): number => {
    const orderMap: { [key: string]: number } = {
      'Initial': 1,
      'Second Touch': 2,
      'Third Touch': 3,
      'Fourth Touch': 4,
      'Fifth Touch': 5,
      'Sixth Touch': 6,
      'Seventh Touch': 7,
      'Eighth Touch': 8
    };
    return orderMap[templateName] || 999;
  };

  // Get available sequences (sorted with Standard Sequence first)
  const getSequences = () => {
    return sequences
      .sort((a, b) => {
        // Standard Sequence (isDefault) always first
        if (a.isDefault) return -1;
        if (b.isDefault) return 1;
        // Then by creation date
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
  };

  // Get templates for selected sequence
  const getSelectedSequenceTemplates = (): Template[] => {
    if (!selectedSequence || !templates) return [];
    
    return templates
      .filter(t => t.sequenceId === selectedSequence)
      .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Prospects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your outbound contacts and sequences
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={handleExecuteAgent}
                disabled={isExecutingAgent || executeAgentMutation.isPending}
              >
                {isExecutingAgent || executeAgentMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <span className="mr-2">🤖</span>
                )}
                Execute AI Agent Now
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-sm p-4 space-y-2">
              <div className="space-y-1">
                <p className="font-semibold text-sm">Manual AI Agent Execution</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Click to immediately analyze prospect responses, schedule meetings, and send follow-ups.
                </p>
              </div>
              <div className="space-y-1 pt-2 border-t">
                <p className="font-semibold text-sm flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5" />
                  Why the delay matters?
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The agent auto-runs based on your configured frequency (e.g., every 30 min). This delay makes responses feel human — like you just checked your email — rather than sending instant automated replies.
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
          
          <Dialog open={isBulkImportOpen} onOpenChange={setIsBulkImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-5 w-5 mr-2" />
                Bulk Import
              </Button>
            </DialogTrigger>
          </Dialog>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-5 w-5 mr-2" />
                Add Prospect
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Prospect</DialogTitle>
              <DialogDescription>
                Enter prospect details to start a new outbound sequence
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact First Name *</Label>
                <Input
                  id="contactName"
                  placeholder="John"
                  value={newProspect.contactName}
                  onChange={(e) =>
                    setNewProspect({ ...newProspect, contactName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="john@company.com"
                  value={newProspect.contactEmail}
                  onChange={(e) =>
                    setNewProspect({ ...newProspect, contactEmail: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactTitle">Title</Label>
                <Input
                  id="contactTitle"
                  placeholder="VP of Sales"
                  value={newProspect.contactTitle}
                  onChange={(e) =>
                    setNewProspect({ ...newProspect, contactTitle: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  placeholder="Acme Corp"
                  value={newProspect.companyName}
                  onChange={(e) =>
                    setNewProspect({ ...newProspect, companyName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  placeholder="SaaS, Technology, Healthcare, etc."
                  value={newProspect.industry}
                  onChange={(e) =>
                    setNewProspect({ ...newProspect, industry: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="sequence">Email Sequence</Label>
                <Select value={selectedSequence} onValueChange={setSelectedSequence}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sequence" />
                  </SelectTrigger>
                  <SelectContent>
                    {getSequences().map((sequence) => (
                      <SelectItem key={sequence.id} value={sequence.id}>
                        {sequence.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsPreviewDialogOpen(true)}
                disabled={!newProspect.contactName || !newProspect.contactEmail || !newProspect.companyName}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview Emails
              </Button>
              <Button
                onClick={() => createMutation.mutate({ 
                  ...newProspect, 
                  sequenceId: selectedSequence || undefined 
                })}
                disabled={!newProspect.contactName || !newProspect.contactEmail || !newProspect.companyName || !selectedSequence || createMutation.isPending}
                className="bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all"
              >
                {createMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Send Sequence
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Search and Bulk Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search prospects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Badge variant="outline" className="text-sm">
            {filteredProspects.length} prospect{filteredProspects.length !== 1 ? "s" : ""}
          </Badge>
        </div>

      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">
                <div className="flex justify-start items-center pl-10">Active</div>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Touchpoints</TableHead>
              <TableHead>Last Contact</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredProspects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  {search ? "No prospects found matching your search." : "No prospects yet. Add your first prospect to get started!"}
                </TableCell>
              </TableRow>
            ) : (
              filteredProspects.map((prospect) => {
                const isExpanded = expandedProspectId === prospect.id;
                return (
                  <>
                    <TableRow 
                      key={prospect.id} 
                      className="hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleRowClick(prospect.id)}
                    >
                      <TableCell>
                        <div className="flex items-center justify-start gap-2 pl-4">
                          <div className="flex-shrink-0">
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <Tooltip delayDuration={200}>
                            <TooltipTrigger asChild>
                              <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
                                <Checkbox
                                  checked={prospect.sendSequence || false}
                                  onCheckedChange={(checked) =>
                                    toggleSequenceMutation.mutate({
                                      id: prospect.id,
                                      sendSequence: checked as boolean,
                                    })
                                  }
                                  className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="text-xs">Activate AI agent for this prospect</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                  <TableCell className="font-medium">
                    <div>
                      <div>{prospect.contactName}</div>
                      {prospect.contactTitle && (
                        <div className="text-xs text-muted-foreground">
                          {prospect.contactTitle}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{prospect.contactEmail}</TableCell>
                  <TableCell>{prospect.companyName || "-"}</TableCell>
                  <TableCell>
                    {prospect.status?.includes('🤝') || prospect.status?.toLowerCase().includes('referr') ? (
                      <Tooltip delayDuration={200}>
                        <TooltipTrigger asChild>
                          <div className="inline-block cursor-help">
                            <StatusBadge status={prospect.status || ""} />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <p className="text-sm font-medium">Great news! 🎉</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Check this prospect's email to find the referred contact. Add them as a new prospect to reach the right person.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <StatusBadge status={prospect.status || ""} />
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {prospect.touchpointsSent || 0} / 4
                    </Badge>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    {editingDateId === prospect.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="date"
                          value={editingDate}
                          onChange={(e) => setEditingDate(e.target.value)}
                          className="w-36 h-8 text-sm"
                          style={{ paddingRight: '8px' }}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDateSave(prospect.id)}
                          className="h-8 w-8 p-0"
                          disabled={updateMutation.isPending}
                        >
                          {updateMutation.isPending ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            "✓"
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleDateCancel}
                          className="h-8 w-8 p-0"
                        >
                          ✕
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="cursor-pointer hover:bg-muted p-1 rounded"
                        onClick={() => handleDateClick(prospect)}
                        title="Click to edit date"
                      >
                        {prospect.lastContactDate
                          ? format(new Date(prospect.lastContactDate), "MMM d, yyyy")
                          : "-"}
                      </div>
                    )}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {canEditProspect(prospect) && (
                          <DropdownMenuItem onClick={() => handleEditProspect(prospect)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => handleDeleteProspect(prospect.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                
                {/* Expanded row with interaction details */}
                {isExpanded && (
                  <TableRow key={`${prospect.id}-expanded`}>
                    <TableCell colSpan={8} className="bg-muted/30 p-6">
                      <div className="grid grid-cols-3 gap-6">
                        {/* Email Opened */}
                        <div className="flex items-start gap-3">
                          <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900/30">
                            <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm mb-1">Email Opened</h4>
                            {prospect.emailOpened && prospect.emailOpenedAt ? (
                              <div className="text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Check className="h-3 w-3 text-green-600" />
                                  <span>Opened</span>
                                </div>
                                <div className="text-xs mt-1">
                                  {format(new Date(prospect.emailOpenedAt), "MMM d, yyyy 'at' h:mm a")}
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <X className="h-3 w-3 text-gray-400" />
                                <span>Not opened yet</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Replied */}
                        <div className="flex items-start gap-3">
                          <div className="rounded-full p-2 bg-green-100 dark:bg-green-900/30">
                            <Reply className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm mb-1">Replied</h4>
                            {prospect.repliedAt ? (
                              <div className="text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Check className="h-3 w-3 text-green-600" />
                                  <span>Replied</span>
                                </div>
                                <div className="text-xs mt-1">
                                  {new Date(prospect.repliedAt).toLocaleString('es-MX', {
                                    dateStyle: 'medium',
                                    timeStyle: 'short'
                                  })}
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <X className="h-3 w-3 text-gray-400" />
                                <span>No reply yet</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Meeting Scheduled */}
                        <div className="flex items-start gap-3">
                          <div className="rounded-full p-2 bg-purple-100 dark:bg-purple-900/30">
                            <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm mb-1">Meeting Scheduled</h4>
                            {prospect.meetingTime ? (
                              <div className="text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Check className="h-3 w-3 text-green-600" />
                                  <span>Scheduled</span>
                                </div>
                                <div className="text-xs mt-1">
                                  {format(new Date(prospect.meetingTime), "MMM d, yyyy 'at' h:mm a")}
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <X className="h-3 w-3 text-gray-400" />
                                <span>Not scheduled</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Prospect Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Prospect</DialogTitle>
            <DialogDescription>
              Update prospect information
            </DialogDescription>
          </DialogHeader>

          {editingProspect && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-contactName">Contact First Name *</Label>
                <Input
                  id="edit-contactName"
                  placeholder="John"
                  value={editingProspect.contactName}
                  onChange={(e) =>
                    setEditingProspect({ ...editingProspect, contactName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-contactEmail">Email *</Label>
                <Input
                  id="edit-contactEmail"
                  type="email"
                  placeholder="john@company.com"
                  value={editingProspect.contactEmail}
                  onChange={(e) =>
                    setEditingProspect({ ...editingProspect, contactEmail: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-contactTitle">Title</Label>
                <Input
                  id="edit-contactTitle"
                  placeholder="VP of Sales"
                  value={editingProspect.contactTitle || ""}
                  onChange={(e) =>
                    setEditingProspect({ ...editingProspect, contactTitle: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-companyName">Company Name</Label>
                <Input
                  id="edit-companyName"
                  placeholder="Acme Corp"
                  value={editingProspect.companyName || ""}
                  onChange={(e) =>
                    setEditingProspect({ ...editingProspect, companyName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-industry">Industry</Label>
                <Input
                  id="edit-industry"
                  placeholder="SaaS, Technology, Healthcare, etc."
                  value={editingProspect.industry || ""}
                  onChange={(e) =>
                    setEditingProspect({ ...editingProspect, industry: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => editingProspect && updateMutation.mutate({ 
                id: editingProspect.id, 
                data: editingProspect 
              })}
              disabled={!editingProspect?.contactName || !editingProspect?.contactEmail || updateMutation.isPending}
            >
              {updateMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Prospect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteProspectId} onOpenChange={() => setDeleteProspectId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the prospect
              and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteProspectId && deleteMutation.mutate(deleteProspectId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Preview Emails Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Email Preview</DialogTitle>
            <DialogDescription>
              Preview how the emails will look with the prospect information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {getSelectedSequenceTemplates().map((template, index) => {
              // Display name mapping
              const displayName = template.templateName === 'Initial' 
                ? 'Initial Email' 
                : template.templateName;
              
              return (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {displayName}
                      </CardTitle>
                      <Badge variant="secondary">Touch {index + 1}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Subject</Label>
                      <p className="text-sm mt-1 p-2 bg-muted rounded">
                        {template.subject
                          .replace(/\$\{contactName\}/g, newProspect.contactName || 'John')
                          .replace(/\$\{companyName\}/g, newProspect.companyName || 'Acme Corp')
                          .replace(/\$\{contactTitle\}/g, newProspect.contactTitle || 'VP of Sales')
                          .replace(/\$\{industry\}/g, newProspect.industry || 'Technology')
                          .replace(/\$\{yourName\}/g, user?.name || 'Your Name')
                        }
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email Body</Label>
                      <div className="text-sm mt-1 p-3 bg-muted rounded whitespace-pre-wrap">
                        {template.body
                          .replace(/\$\{contactName\}/g, newProspect.contactName || 'John')
                          .replace(/\$\{companyName\}/g, newProspect.companyName || 'Acme Corp')
                          .replace(/\$\{contactTitle\}/g, newProspect.contactTitle || 'VP of Sales')
                          .replace(/\$\{industry\}/g, newProspect.industry || 'Technology')
                          .replace(/\$\{yourName\}/g, user?.name || 'Your Name')
                        }
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Import Dialog */}
      <Dialog open={isBulkImportOpen} onOpenChange={(open) => {
        setIsBulkImportOpen(open);
        if (!open) resetImportState();
      }}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Bulk Import Prospects
            </DialogTitle>
            <DialogDescription>
              Drag and drop your CSV file or click to browse. We'll automatically map your columns to prospect fields.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {isProcessingFile ? (
              /* Processing State */
              <div className="border-2 border-dashed border-primary/50 rounded-lg p-12 text-center">
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Processing your file...</h3>
                    <p className="text-muted-foreground">Please wait while we parse your CSV data</p>
                  </div>
                </div>
              </div>
            ) : !csvFile ? (
              /* File Upload Area */
              <div
                onDrop={(e) => {
                  try {
                    handleFileDrop(e);
                  } catch (error) {
                    console.error('Error in drag and drop:', error);
                    toast({
                      title: "Upload Error",
                      description: "An error occurred while processing the file.",
                      variant: "destructive",
                    });
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={(e) => e.preventDefault()}
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => {
                  try {
                    document.getElementById('csv-file-input')?.click();
                  } catch (error) {
                    console.error('Error clicking file input:', error);
                  }
                }}
              >
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Drop your CSV file here</h3>
                    <p className="text-muted-foreground">or click to browse files</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Supports files from ZoomInfo, LinkedIn, and other lead sources</p>
                    <p>We'll automatically detect and map your columns</p>
                  </div>
                </div>
                <input
                  id="csv-file-input"
                  type="file"
                  accept=".csv"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
            ) : (
              /* Column Mapping Interface */
              <div className="space-y-6">
                {/* File Info */}
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <File className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{csvFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {csvData.length} rows • {csvHeaders.length} columns
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetImportState}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Column Mapping */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Map Your Columns</h3>
                    <Badge variant="outline" className="text-xs">
                      {mappedData.length} valid prospects found
                    </Badge>
                  </div>
                  
                  <div className="grid gap-4">
                    {csvHeaders.map((header, index) => (
                      <div key={header} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{header}</p>
                          <p className="text-xs text-muted-foreground">
                            Sample: {csvData[0]?.[header] || 'No data'}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <Select
                            value={columnMapping[header] || undefined}
                            onValueChange={(value) => handleColumnMappingChange(header, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select field..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="skip">Skip this column</SelectItem>
                              <SelectItem value="contactName">First Name *</SelectItem>
                              <SelectItem value="contactEmail">Email Address *</SelectItem>
                              <SelectItem value="contactTitle">Job Title</SelectItem>
                              <SelectItem value="companyName">Company Name</SelectItem>
                              <SelectItem value="industry">Industry</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {columnMapping[header] && columnMapping[header] !== 'skip' && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sequence Selection */}
                <div className="space-y-2">
                  <Label htmlFor="bulk-sequence">Email Sequence *</Label>
                  <Select value={bulkImportSequence} onValueChange={setBulkImportSequence}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sequence for imported prospects" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSequences().map((sequence) => (
                        <SelectItem key={sequence.id} value={sequence.id}>
                          {sequence.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Preview Button */}
                <Button
                  onClick={() => setIsPreviewMode(true)}
                  disabled={mappedData.length === 0}
                  className="w-full"
                  variant="outline"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview {mappedData.length} Prospects
                </Button>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkImportOpen(false)}>
              Cancel
            </Button>
            {csvFile && (
              <Button
                onClick={handleBulkImport}
                disabled={mappedData.length === 0 || !bulkImportSequence || bulkImportMutation.isPending}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {bulkImportMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Import {mappedData.length} Prospects
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewMode} onOpenChange={setIsPreviewMode}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview Import Data</DialogTitle>
            <DialogDescription>
              Review the {mappedData.length} prospects that will be imported
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid gap-2 max-h-96 overflow-y-auto">
              {mappedData.slice(0, 10).map((prospect, index) => (
                <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">{prospect.contactName}</span>
                      <span className="text-muted-foreground ml-2">({prospect.contactTitle})</span>
                    </div>
                    <div className="text-muted-foreground">{prospect.contactEmail}</div>
                    <div className="text-muted-foreground">{prospect.companyName}</div>
                    <div className="text-muted-foreground">{prospect.industry}</div>
                  </div>
                </div>
              ))}
              {mappedData.length > 10 && (
                <div className="text-center text-muted-foreground text-sm py-2">
                  ... and {mappedData.length - 10} more prospects
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewMode(false)}>
              Back to Mapping
            </Button>
            <Button
              onClick={() => {
                setIsPreviewMode(false);
                handleBulkImport();
              }}
              disabled={!bulkImportSequence || bulkImportMutation.isPending}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="mr-2 h-4 w-4" />
              Import All {mappedData.length} Prospects
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

