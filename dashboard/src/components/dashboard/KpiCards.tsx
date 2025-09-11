import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle, XCircle, TrendingUp } from "lucide-react";
import { ParticipantStats } from "@/types/participant";
import { useDashboardData } from "@/hooks/useDatabaseData";

// export const KpiCards: React.FC<KpiCardsProps> = ({ stats }) => {
//   const kpiData = [
//     {
//       title: 'Total Registrations',
//       value: stats.totalRegistrations.toLocaleString(),
//       icon: Users,
//       color: 'kpi-info',
//       bgGradient: 'bg-gradient-primary'
//     },
//     {
//       title: 'Claimed',
//       value: stats.claimedCount.toLocaleString(),
//       icon: CheckCircle,
//       color: 'kpi-success',
//       bgGradient: 'bg-gradient-success'
//     },
//     {
//       title: 'Unclaimed',
//       value: stats.unclaimedCount.toLocaleString(),
//       icon: XCircle,
//       color: 'kpi-neutral',
//       bgGradient: 'bg-muted'
//     },
//     {
//       title: 'Claim Rate',
//       value: `${stats.claimRate.toFixed(1)}%`,
//       icon: TrendingUp,
//       color: 'kpi-warning',
//       bgGradient: 'bg-gradient-primary'
//     }
//   ];

export const KpiCards: React.FC = () => {
  const { kpis } = useDashboardData();

  const kpiData = [
    {
      title: "Total Registrations",
      value: kpis.totalRegistrations.toLocaleString(),
      icon: Users,
      color: "kpi-info",
      bgGradient: "bg-gradient-primary",
    },
    {
      title: "Claimed",
      value: kpis.claimed.toLocaleString(),
      icon: CheckCircle,
      color: "kpi-success",
      bgGradient: "bg-gradient-success",
    },
    {
      title: "Unclaimed",
      value: kpis.unclaimed.toLocaleString(),
      icon: XCircle,
      color: "kpi-neutral",
      bgGradient: "bg-muted",
    },
    {
      title: "Claim Rate",
      value: `${kpis.claimedRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: "kpi-warning",
      bgGradient: "bg-gradient-primary",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpiData.map((kpi, index) => (
        <Card
          key={kpi.title}
          className="bg-dashboard-card border-dashboard-border hover:bg-dashboard-card-hover transition-all duration-300 hover:shadow-card"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {kpi.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${kpi.bgGradient}`}>
              <kpi.icon className="h-4 w-4 text-primary-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {kpi.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
