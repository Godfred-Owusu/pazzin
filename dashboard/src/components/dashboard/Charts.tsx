import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Participant, ParticipantStats } from "@/types/participant";
import { useDashboardData } from "@/hooks/useDatabaseData";

interface ChartsProps {
  participants: Participant[];
  stats: ParticipantStats;
}

export const Charts: React.FC<ChartsProps> = ({ participants, stats }) => {
  const { claimStatusDistribution, registrationsOverTime } = useDashboardData();
  // Donut chart data
  const donutData = [
    {
      name: "Claimed",
      value: claimStatusDistribution.claimed,
      color: "hsl(var(--kpi-success))",
    },
    {
      name: "Unclaimed",
      value: claimStatusDistribution.unclaimed,
      color: "hsl(var(--kpi-neutral))",
    },
  ];

  // Line chart data - registrations over time
  // const getRegistrationsOverTime = () => {
  //   const sortedParticipants = [...participants].sort((a, b) =>
  //     new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime()
  //   );

  //   const dailyRegistrations: { [key: string]: number } = {};

  //   sortedParticipants.forEach(participant => {
  //     const date = new Date(participant.registeredAt).toLocaleDateString();
  //     dailyRegistrations[date] = (dailyRegistrations[date] || 0) + 1;
  //   });

  //   return Object.entries(dailyRegistrations).map(([date, count]) => ({
  //     date,
  //     registrations: count
  //   }));
  // };

  // const lineChartData = getRegistrationsOverTime();
  const lineChartData = registrationsOverTime.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString(),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Donut Chart */}
      <Card className="bg-dashboard-card border-dashboard-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Claim Status Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid hsl(var(--dashboard-border))",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {donutData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Line Chart */}
      <Card className="bg-dashboard-card border-dashboard-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Registrations Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--dashboard-border))"
                />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--dashboard-card))",
                    border: "1px solid hsl(var(--dashboard-border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="registrations"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                  activeDot={{
                    r: 6,
                    stroke: "hsl(var(--chart-1))",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
