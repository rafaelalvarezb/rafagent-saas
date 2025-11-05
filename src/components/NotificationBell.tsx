import { useState, useRef, useEffect } from 'react';
import { Bell, Mail, MessageCircle, Calendar, Eye, ChevronDown } from 'lucide-react';
import { useNotifications } from '@/hooks/use-notifications';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAllAsRead } = useNotifications();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBellClick = () => {
    if (!isOpen) {
      markAllAsRead(); // Mark as read when opening
    }
    setIsOpen(!isOpen);
    setShowAll(false); // Reset show all when toggling
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'email_opened':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'replied':
        return <MessageCircle className="h-4 w-4 text-purple-500" />;
      case 'meeting_scheduled':
        return <Calendar className="h-4 w-4 text-green-500" />;
      default:
        return <Mail className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationTitle = (type: string) => {
    switch (type) {
      case 'email_opened':
        return 'Email Opened';
      case 'replied':
        return 'Prospect Replied';
      case 'meeting_scheduled':
        return 'Meeting Scheduled';
      default:
        return 'Notification';
    }
  };

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case 'email_opened':
        return 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/10';
      case 'replied':
        return 'bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/10';
      case 'meeting_scheduled':
        return 'bg-green-50 hover:bg-green-100 dark:bg-green-900/10';
      default:
        return 'bg-gray-50 hover:bg-gray-100';
    }
  };

  // Show first 5 notifications by default, or all if showAll is true
  const displayedNotifications = showAll ? notifications : notifications.slice(0, 5);
  const hasMore = notifications.length > 5;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={handleBellClick}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <Card className="absolute right-0 mt-2 w-96 max-h-[600px] overflow-hidden shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="p-4 border-b bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </h3>
              {notifications.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {notifications.length}
                </Badge>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-[480px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">No notifications yet</p>
                <p className="text-xs mt-1">We'll notify you when prospects open emails, reply, or meetings are scheduled!</p>
              </div>
            ) : (
              <div className="divide-y">
                {displayedNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 transition-colors cursor-pointer ${getNotificationBgColor(notification.type)}`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-foreground">
                            {getNotificationTitle(notification.type)}
                          </p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                          </span>
                        </div>
                        
                        <p className="text-sm font-semibold text-foreground mt-1">
                          {notification.prospectName}
                        </p>
                        
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          {notification.contactTitle && (
                            <span>{notification.contactTitle}</span>
                          )}
                          {notification.contactTitle && notification.companyName && (
                            <span>•</span>
                          )}
                          {notification.companyName && (
                            <span>{notification.companyName}</span>
                          )}
                        </div>

                        {notification.meetingTime && (
                          <div className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400 mt-2">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(notification.meetingTime), 'MMM d, yyyy • h:mm a')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Show More/Less Button */}
                {hasMore && (
                  <div className="p-3 bg-muted/30">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => setShowAll(!showAll)}
                    >
                      {showAll ? (
                        <>
                          Show Less
                          <ChevronDown className="h-3 w-3 ml-1 rotate-180" />
                        </>
                      ) : (
                        <>
                          Show {notifications.length - 5} More
                          <ChevronDown className="h-3 w-3 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t bg-muted/30">
              <p className="text-xs text-center text-muted-foreground">
                Showing notifications from the last 30 days
              </p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

