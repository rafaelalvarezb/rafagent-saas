import { useQuery } from '@tanstack/react-query';
import { apiCall } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Activity, Calendar, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface UserData {
  id: string;
  email: string;
  name: string;
  timezone: string | null;
  createdAt: string;
  totalProspects: number;
  recentProspects: number;
  isActive: boolean;
}

export function AdminUsersPanel() {
  const { data: users = [], isLoading, error } = useQuery<UserData[]>({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const response = await apiCall('/admin/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return response.json();
    },
    refetchInterval: 60000, // Refetch every minute
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Registered Users
          </CardTitle>
          <CardDescription>Loading users...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Registered Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600">Failed to load users</p>
        </CardContent>
      </Card>
    );
  }

  const activeUsers = users.filter(u => u.isActive).length;
  const totalUsers = users.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Registered Users
            </CardTitle>
            <CardDescription>Users who have signed up for RafAgent</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
              <div className="text-xs text-muted-foreground">Active (30d)</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{totalUsers}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Prospects
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Recent Activity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Timezone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-4">
                        <div>
                          <div className="font-medium text-sm">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {user.isActive ? (
                          <Badge variant="default" className="bg-green-500 flex items-center gap-1 w-fit">
                            <Activity className="h-3 w-3" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                            Inactive
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{user.totalProspects}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 text-sm">
                          {user.recentProspects > 0 ? (
                            <>
                              <TrendingUp className="h-4 w-4 text-green-500" />
                              <span className="font-medium text-green-600">{user.recentProspects}</span>
                              <span className="text-xs text-muted-foreground">in 30d</span>
                            </>
                          ) : (
                            <span className="text-xs text-muted-foreground">No recent activity</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-xs text-muted-foreground">
                          {user.timezone || 'Not set'}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(user.createdAt), 'MMM d, yyyy')}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Footer */}
        {users.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{totalUsers}</div>
                <div className="text-xs text-muted-foreground">Total Users</div>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
                <div className="text-xs text-muted-foreground">Active Users</div>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {users.reduce((sum, u) => sum + u.totalProspects, 0)}
                </div>
                <div className="text-xs text-muted-foreground">Total Prospects</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

