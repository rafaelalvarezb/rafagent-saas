import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiCall } from "@/lib/api";

interface UserConfig {
  id: string;
  userId: string;
  customName?: string;
  daysBetweenFollowups: number;
  numberOfTouchpoints: number;
  meetingTitle: string;
  meetingDescription: string;
  searchStartTime: string;
  searchEndTime: string;
  agentFrequencyHours: number;
  workingDays: string[] | string; // Can be array or comma-separated string from DB
  timezone: string;
}

const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

export default function Configuration() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [config, setConfig] = useState<Partial<UserConfig>>({
    customName: '',
    daysBetweenFollowups: 3,
    agentFrequencyHours: 0.5, // 30 minutes default
    searchStartTime: '09:00',
    searchEndTime: '17:00',
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  });

  // Fetch user config
  const { data: userConfig, isLoading } = useQuery<UserConfig>({
    queryKey: ["user-config"],
    queryFn: async () => {
      const response = await apiCall("/config");
      if (!response.ok) throw new Error("Failed to fetch user config");
      return response.json();
    },
  });

  // Update config when data is loaded - USE useEffect to sync with server data
  useEffect(() => {
    if (userConfig) {
      // Parse workingDays if it's a string from the database
      const workingDaysArray = typeof userConfig.workingDays === 'string'
        ? userConfig.workingDays.split(',').map(d => d.trim())
        : userConfig.workingDays || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

      setConfig({
        customName: userConfig.customName || user?.name || '',
        daysBetweenFollowups: userConfig.daysBetweenFollowups || 3,
        agentFrequencyHours: userConfig.agentFrequencyHours || 0.5,
        searchStartTime: userConfig.searchStartTime || '09:00',
        searchEndTime: userConfig.searchEndTime || '17:00',
        workingDays: workingDaysArray,
      });
    }
  }, [userConfig, user]); // Re-run when userConfig or user changes

  // Update user config
  const updateMutation = useMutation({
    mutationFn: async (data: Partial<UserConfig>) => {
      const response = await apiCall("/config", {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update configuration");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-config"] });
      toast({
        title: "Configuration Updated",
        description: "Your settings have been saved successfully.",
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

  const handleWorkingDayChange = (day: string, checked: boolean) => {
    setConfig(prev => ({
      ...prev,
      workingDays: checked 
        ? [...(prev.workingDays || []), day]
        : (prev.workingDays || []).filter(d => d !== day)
    }));
  };

  const handleSave = () => {
    updateMutation.mutate(config);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Configuration</h1>
          <p className="text-xs text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Personal Information */}
        <Card>
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-base">Personal Information</CardTitle>
            <CardDescription className="text-xs">
              Your account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs">Your Name</Label>
              <Input
                id="name"
                value={config.customName || ""}
                onChange={(e) => setConfig(prev => ({ ...prev, customName: e.target.value }))}
                placeholder={user?.name || ""}
                className="h-8 text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Customize how your name appears in emails
              </p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs">Your Email</Label>
              <Input
                id="email"
                value={user?.email || ""}
                disabled
                className="bg-muted h-8 text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Linked to your Google account
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-base">Email Settings</CardTitle>
            <CardDescription className="text-xs">
              Configure your email sequence preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="daysBetweenFollowups" className="text-xs">Days Between Follow-ups</Label>
              <Select
                value={config.daysBetweenFollowups?.toString()}
                onValueChange={(value) =>
                  setConfig(prev => ({ ...prev, daysBetweenFollowups: parseInt(value) }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="2">2 days</SelectItem>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="4">4 days</SelectItem>
                  <SelectItem value="5">5 days</SelectItem>
                  <SelectItem value="7">1 week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="agentFrequency" className="text-xs">Agent Frequency Execution</Label>
              <Select
                value={config.agentFrequencyHours?.toString()}
                onValueChange={(value) =>
                  setConfig(prev => ({ ...prev, agentFrequencyHours: parseFloat(value) }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.0167">1 minute (for quick tests)</SelectItem>
                  <SelectItem value="0.5">30 minutes (recommended)</SelectItem>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="2">2 hours</SelectItem>
                  <SelectItem value="4">4 hours</SelectItem>
                  <SelectItem value="6">6 hours</SelectItem>
                  <SelectItem value="12">12 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card>
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-base">Working Hours</CardTitle>
            <CardDescription className="text-xs">
              Set your business hours for email sending and videocall scheduling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label className="text-xs">Active Timezone</Label>
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">{userConfig?.timezone || 'America/Mexico_City'}</p>
                <p className="text-xs text-muted-foreground">Times below are set in this timezone</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="startTime" className="text-xs">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={config.searchStartTime}
                  onChange={(e) =>
                    setConfig(prev => ({ ...prev, searchStartTime: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="endTime" className="text-xs">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={config.searchEndTime}
                  onChange={(e) =>
                    setConfig(prev => ({ ...prev, searchEndTime: e.target.value }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Working Days */}
        <Card>
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-base">Working Days</CardTitle>
            <CardDescription className="text-xs">
              Select the days when emails should be sent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-2">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={day.value}
                    checked={config.workingDays?.includes(day.value) || false}
                    onCheckedChange={(checked) =>
                      handleWorkingDayChange(day.value, checked as boolean)
                    }
                  />
                  <Label htmlFor={day.value} className="cursor-pointer">
                    {day.label}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="min-w-[120px] h-9"
        >
          {updateMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
