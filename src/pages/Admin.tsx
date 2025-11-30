import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Activity, TrendingUp, Shield, RefreshCw, Search, Crown, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { TechyMemoLogo } from "@/components/MemoableLogo";
import { SEO } from "@/components/SEO";

interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  subscription_tier: string | null;
  monthly_generations: number | null;
  created_at: string;
  generation_reset_at: string | null;
}

interface UsageStats {
  totalUsers: number;
  freeUsers: number;
  proUsers: number;
  studioUsers: number;
  totalGenerationsToday: number;
  totalGenerationsMonth: number;
}

export default function Admin() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
      return;
    }
    fetchData();
  }, [user, isAdmin, navigate]);

  useEffect(() => {
    let filtered = users;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(u => 
        u.email?.toLowerCase().includes(query) || 
        u.full_name?.toLowerCase().includes(query)
      );
    }
    
    if (tierFilter !== "all") {
      filtered = filtered.filter(u => u.subscription_tier === tierFilter);
    }
    
    setFilteredUsers(filtered);
  }, [users, searchQuery, tierFilter]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch all profiles (admin has access via RLS)
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;
      setUsers(profiles || []);

      // Calculate stats
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // Fetch generation logs
      const { data: monthLogs } = await supabase
        .from("generation_logs")
        .select("id, created_at")
        .gte("created_at", startOfMonth.toISOString());

      const todayLogs = monthLogs?.filter(log => 
        new Date(log.created_at) >= startOfDay
      ) || [];

      const calculatedStats: UsageStats = {
        totalUsers: profiles?.length || 0,
        freeUsers: profiles?.filter(p => p.subscription_tier === "free").length || 0,
        proUsers: profiles?.filter(p => p.subscription_tier === "pro").length || 0,
        studioUsers: profiles?.filter(p => p.subscription_tier === "studio").length || 0,
        totalGenerationsToday: todayLogs.length,
        totalGenerationsMonth: monthLogs?.length || 0,
      };
      setStats(calculatedStats);

    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("Failed to load admin data");
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserTier = async (userId: string, newTier: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ subscription_tier: newTier })
        .eq("user_id", userId);

      if (error) throw error;
      
      setUsers(prev => prev.map(u => 
        u.user_id === userId ? { ...u, subscription_tier: newTier } : u
      ));
      toast.success("User tier updated");
    } catch (error) {
      console.error("Error updating user tier:", error);
      toast.error("Failed to update user tier");
    }
  };

  const getTierBadge = (tier: string | null) => {
    switch (tier) {
      case "pro":
        return <Badge className="bg-primary/20 text-primary border-primary/30">Pro</Badge>;
      case "studio":
        return <Badge className="bg-purple-500/20 text-purple-600 border-purple-500/30">Studio</Badge>;
      case "creator":
        return <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30">Creator</Badge>;
      default:
        return <Badge variant="outline">Free</Badge>;
    }
  };

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <p className="text-muted-foreground">Access denied</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Admin Dashboard | TechyMemo"
        description="Admin dashboard for TechyMemo"
        noIndex={true}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {/* Header */}
        <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <TechyMemoLogo className="h-8 w-8" />
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold">Admin Dashboard</h1>
                <Badge variant="outline" className="gap-1">
                  <Shield className="w-3 h-3" />
                  Admin
                </Badge>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>
              Back to App
            </Button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  Pro Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">{stats?.proUsers || 0}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Today's Generations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-emerald-600">{stats?.totalGenerationsToday || 0}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Monthly Generations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats?.totalGenerationsMonth || 0}</p>
              </CardContent>
            </Card>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>View and manage all users</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by email or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={tierFilter} onValueChange={setTierFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tiers</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="creator">Creator</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead className="text-center">Monthly Gens</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          {isLoading ? "Loading..." : "No users found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((profile) => (
                        <TableRow key={profile.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{profile.full_name || "—"}</p>
                              <p className="text-sm text-muted-foreground">{profile.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getTierBadge(profile.subscription_tier)}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="font-mono">{profile.monthly_generations || 0}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {new Date(profile.created_at).toLocaleDateString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={profile.subscription_tier || "free"}
                              onValueChange={(value) => updateUserTier(profile.user_id, value)}
                            >
                              <SelectTrigger className="w-[100px] h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="free">Free</SelectItem>
                                <SelectItem value="creator">Creator</SelectItem>
                                <SelectItem value="pro">Pro</SelectItem>
                                <SelectItem value="studio">Studio</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Showing {filteredUsers.length} of {users.length} users
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}
