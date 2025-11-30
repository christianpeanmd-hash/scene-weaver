import { useState, useEffect } from "react";
import { BarChart3, Video, Image, FileText, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartDataPoint {
  date: string;
  template: number;
  image: number;
  infographic: number;
  total: number;
}

interface Totals {
  template: number;
  image: number;
  infographic: number;
  total: number;
}

interface UsageAnalyticsDialogProps {
  children: React.ReactNode;
}

export function UsageAnalyticsDialog({ children }: UsageAnalyticsDialogProps) {
  const { session } = useAuth();
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [totals, setTotals] = useState<Totals>({ template: 0, image: 0, infographic: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const fetchAnalytics = async () => {
    if (!session?.access_token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fnError } = await supabase.functions.invoke("get-usage-analytics", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (fnError) throw fnError;
      setChartData(data.chartData || []);
      setTotals(data.totals || { template: 0, image: 0, infographic: 0, total: 0 });
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("Failed to load usage analytics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchAnalytics();
    }
  }, [open, session?.access_token]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const statCards = [
    { label: "Video Templates", value: totals.template, icon: Video, color: "text-teal-500" },
    { label: "Images", value: totals.image, icon: Image, color: "text-purple-500" },
    { label: "Infographics", value: totals.infographic, icon: FileText, color: "text-amber-500" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Usage Analytics
          </DialogTitle>
          <DialogDescription>
            Your generation activity over the last 30 days
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 rounded-lg" />
              ))}
            </div>
            <Skeleton className="h-[200px] rounded-lg" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>{error}</p>
            <Button variant="ghost" size="sm" onClick={fetchAnalytics} className="mt-2">
              Try again
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3">
              {statCards.map((stat) => (
                <div
                  key={stat.label}
                  className="p-3 rounded-lg border border-border bg-card"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    <span className="text-xs text-muted-foreground truncate">{stat.label}</span>
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/20">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="font-medium">Total Generations (30 days)</span>
              </div>
              <span className="text-2xl font-bold text-primary">{totals.total}</span>
            </div>

            {/* Chart */}
            {totals.total > 0 ? (
              <div className="h-[200px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatDate}
                      tick={{ fontSize: 10 }}
                      className="text-muted-foreground"
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      className="text-muted-foreground"
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      labelFormatter={(label) => formatDate(label)}
                      formatter={(value: number, name: string) => [
                        value,
                        name === "total" ? "Total" : name.charAt(0).toUpperCase() + name.slice(1),
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorTotal)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No generation activity yet</p>
                <p className="text-sm mt-1">Your usage data will appear here after generating content</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
