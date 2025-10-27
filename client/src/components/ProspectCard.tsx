import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge, type ProspectStatus } from "./StatusBadge";
import { Mail, Phone, Building2, Calendar, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProspectCardProps {
  id: string;
  name: string;
  email: string;
  company: string;
  position: string;
  status: ProspectStatus;
  lastContact?: string;
  nextFollowUp?: string;
}

export function ProspectCard({
  id,
  name,
  email,
  company,
  position,
  status,
  lastContact,
  nextFollowUp,
}: ProspectCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="hover-elevate" data-testid={`card-prospect-${id}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Avatar className="h-10 w-10" data-testid={`avatar-prospect-${id}`}>
              <AvatarFallback className="bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm truncate" data-testid={`text-prospect-name-${id}`}>{name}</h3>
                <StatusBadge status={status} />
              </div>
              <p className="text-xs text-muted-foreground truncate">{position}</p>
              <div className="flex items-center gap-1 mt-1">
                <Building2 className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground truncate">{company}</p>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground truncate">{email}</span>
                </div>
              </div>
              {(lastContact || nextFollowUp) && (
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  {lastContact && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Last: {lastContact}</span>
                    </div>
                  )}
                  {nextFollowUp && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Next: {nextFollowUp}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" data-testid={`button-prospect-menu-${id}`}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem data-testid={`menu-item-view-${id}`}>
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </DropdownMenuItem>
              <DropdownMenuItem data-testid={`menu-item-schedule-${id}`}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </DropdownMenuItem>
              <DropdownMenuItem data-testid={`menu-item-call-${id}`}>
                <Phone className="h-4 w-4 mr-2" />
                Log Call
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
