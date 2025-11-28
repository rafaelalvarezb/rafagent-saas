import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { 
  Plus, 
  Mail, 
  Trash2, 
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Edit,
  Power,
  PowerOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiCall } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Mailbox {
  id: string;
  userId: string;
  email: string;
  displayName?: string;
  isActive: boolean;
  dailySendLimit: number;
  emailsSentToday: number;
  lastResetDate?: string;
  warmupStatus: 'not_started' | 'warming' | 'ready' | 'paused';
  warmupStartDate?: string;
  warmupCurrentDay: number;
  reputationScore: number;
  createdAt: string;
}

export default function Mailboxes() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mailboxToDelete, setMailboxToDelete] = useState<Mailbox | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [mailboxToEdit, setMailboxToEdit] = useState<Mailbox | null>(null);
  const [editForm, setEditForm] = useState({
    displayName: '',
    dailySendLimit: 25,
  });

  // Fetch mailboxes
  const { data: mailboxes = [], isLoading } = useQuery<Mailbox[]>({
    queryKey: ["mailboxes"],
    queryFn: async () => {
      const response = await apiCall("/mailboxes");
      if (!response.ok) throw new Error("Failed to fetch mailboxes");
      return response.json();
    },
  });

  // Get OAuth URL for adding mailbox
  const { data: authData } = useQuery<{ authUrl: string }>({
    queryKey: ["mailbox-auth-url"],
    queryFn: async () => {
      const response = await apiCall("/mailboxes/auth");
      if (!response.ok) throw new Error("Failed to get auth URL");
      return response.json();
    },
  });

  // Add mailbox mutation (redirects to OAuth)
  const addMailbox = () => {
    if (authData?.authUrl) {
      window.location.href = authData.authUrl;
    }
  };

  // Update mailbox mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Mailbox> }) => {
      const response = await apiCall(`/mailboxes/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update mailbox");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mailboxes"] });
      setEditDialogOpen(false);
      toast({
        title: "Mailbox updated",
        description: "Mailbox settings have been updated successfully.",
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

  // Toggle active status mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const response = await apiCall(`/mailboxes/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive }),
      });
      if (!response.ok) throw new Error("Failed to update mailbox");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mailboxes"] });
      toast({
        title: "Mailbox updated",
        description: "Mailbox status has been updated.",
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

  // Delete mailbox mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiCall(`/mailboxes/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete mailbox");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mailboxes"] });
      setDeleteDialogOpen(false);
      setMailboxToDelete(null);
      toast({
        title: "Mailbox deleted",
        description: "Mailbox has been removed successfully.",
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

  const handleEdit = (mailbox: Mailbox) => {
    setMailboxToEdit(mailbox);
    setEditForm({
      displayName: mailbox.displayName || '',
      dailySendLimit: mailbox.dailySendLimit || 25,
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!mailboxToEdit) return;
    updateMutation.mutate({
      id: mailboxToEdit.id,
      data: editForm,
    });
  };

  const handleDelete = (mailbox: Mailbox) => {
    setMailboxToDelete(mailbox);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (mailboxToDelete) {
      deleteMutation.mutate(mailboxToDelete.id);
    }
  };

  const handleToggleActive = (mailbox: Mailbox) => {
    toggleActiveMutation.mutate({
      id: mailbox.id,
      isActive: !mailbox.isActive,
    });
  };

  const getWarmupStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge variant="default" className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" />Ready</Badge>;
      case 'warming':
        return <Badge variant="default" className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" />Warming</Badge>;
      case 'paused':
        return <Badge variant="default" className="bg-orange-500"><AlertCircle className="w-3 h-3 mr-1" />Paused</Badge>;
      default:
        return <Badge variant="secondary"><AlertCircle className="w-3 h-3 mr-1" />Not Started</Badge>;
    }
  };

  // Handle OAuth callback from Google
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const action = urlParams.get('action');
    const error = urlParams.get('error');

    if (error) {
      toast({
        title: "Error adding mailbox",
        description: error,
        variant: "destructive",
      });
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }

    if (code && action === 'add_mailbox') {
      // Call API to add mailbox
      const addMailboxFromCode = async () => {
        try {
          const response = await apiCall("/mailboxes/add", {
            method: "POST",
            body: JSON.stringify({ code }),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to add mailbox");
          }

          const data = await response.json();
          queryClient.invalidateQueries({ queryKey: ["mailboxes"] });
          
          toast({
            title: "Mailbox added",
            description: "New mailbox has been connected successfully.",
          });
          
          // Clean URL
          window.history.replaceState({}, '', window.location.pathname);
        } catch (error: any) {
          toast({
            title: "Error adding mailbox",
            description: error.message,
            variant: "destructive",
          });
          window.history.replaceState({}, '', window.location.pathname);
        }
      };

      addMailboxFromCode();
    }
  }, [toast, queryClient]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mailboxes</h1>
          <p className="text-muted-foreground mt-1">
            Manage your Gmail accounts for sending emails
          </p>
        </div>
        <Button onClick={addMailbox} disabled={!authData?.authUrl}>
          <Plus className="w-4 h-4 mr-2" />
          Add Mailbox
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Mailboxes</CardTitle>
          <CardDescription>
            Connect multiple Gmail accounts to send more emails. Each mailbox can send up to 25 emails per day.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : mailboxes.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No mailboxes yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your first Gmail account to start sending emails
              </p>
              <Button onClick={addMailbox} disabled={!authData?.authUrl}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Mailbox
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Display Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Warmup</TableHead>
                  <TableHead>Daily Limit</TableHead>
                  <TableHead>Sent Today</TableHead>
                  <TableHead>Reputation</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mailboxes.map((mailbox) => (
                  <TableRow key={mailbox.id}>
                    <TableCell className="font-medium">{mailbox.email}</TableCell>
                    <TableCell>{mailbox.displayName || '-'}</TableCell>
                    <TableCell>
                      {mailbox.isActive ? (
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle2 className="w-3 h-3 mr-1" />Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="w-3 h-3 mr-1" />Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{getWarmupStatusBadge(mailbox.warmupStatus)}</TableCell>
                    <TableCell>{mailbox.dailySendLimit} emails/day</TableCell>
                    <TableCell>
                      {mailbox.emailsSentToday || 0} / {mailbox.dailySendLimit}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 transition-all"
                            style={{ width: `${mailbox.reputationScore || 0}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(mailbox.reputationScore || 0)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive(mailbox)}
                          title={mailbox.isActive ? "Deactivate" : "Activate"}
                        >
                          {mailbox.isActive ? (
                            <PowerOff className="w-4 h-4" />
                          ) : (
                            <Power className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(mailbox)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(mailbox)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Mailbox</DialogTitle>
            <DialogDescription>
              Update mailbox settings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={editForm.displayName}
                onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                placeholder="Optional display name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dailySendLimit">Daily Send Limit</Label>
              <Input
                id="dailySendLimit"
                type="number"
                min="1"
                max="50"
                value={editForm.dailySendLimit}
                onChange={(e) => setEditForm({ ...editForm, dailySendLimit: parseInt(e.target.value) || 25 })}
              />
              <p className="text-sm text-muted-foreground">
                Maximum number of emails this mailbox can send per day (recommended: 25)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the mailbox <strong>{mailboxToDelete?.email}</strong>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

