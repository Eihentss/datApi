// resources/js/Components/HttpMethodsTrendChart.jsx
import { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/Card";
import { BarChart3 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function HttpMethodsTrendChart({ statistics }) {
  const [range, setRange] = useState("7d");

  const chartData = useMemo(() => {
    if (!statistics?.requests) return [];

    const now = new Date();

    if (range === "7d") {
      // Pēdējās 7 dienas
      const weekDays = [
        "Pirmdiena",
        "Otrdiena",
        "Trešdiena",
        "Ceturtdiena",
        "Piektdiena",
        "Sestdiena",
        "Svētdiena",
      ];

      const todayIndex = (now.getDay() + 6) % 7;

      const rotatedDays = [];
      for (let i = 6; i >= 0; i--) {
        rotatedDays.push(weekDays[(todayIndex - i + 7) % 7]);
      }

      const init = rotatedDays.map((day) => ({
        day,
        GET: 0,
        POST: 0,
        PUT: 0,
        DELETE: 0,
      }));

      statistics.requests.forEach((req) => {
        const dateObj = new Date(req.date);
        const reqDayIndex = (dateObj.getDay() + 6) % 7;
        const rotatedIndex = (reqDayIndex - (todayIndex - 6) + 7) % 7;

        if (init[rotatedIndex]) {
          init[rotatedIndex][req.method] += 1;
        }
      });

      return init;
    }

    if (range === "30d") {
      // Šis mēnesis pa dienām
      const year = now.getFullYear();
      const month = now.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      const init = Array.from({ length: daysInMonth }, (_, i) => ({
        day: i + 1,
        GET: 0,
        POST: 0,
        PUT: 0,
        DELETE: 0,
      }));

      statistics.requests.forEach((req) => {
        const dateObj = new Date(req.date);
        if (dateObj.getFullYear() === year && dateObj.getMonth() === month) {
          const dayIndex = dateObj.getDate() - 1;
          init[dayIndex][req.method] += 1;
        }
      });

      return init;
    }

    if (range === "12m") {
      // Šis gads pa mēnešiem
      const year = now.getFullYear();
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mai",
        "Jūn",
        "Jūl",
        "Aug",
        "Sep",
        "Okt",
        "Nov",
        "Dec",
      ];

      const init = monthNames.map((m) => ({
        month: m,
        GET: 0,
        POST: 0,
        PUT: 0,
        DELETE: 0,
      }));

      statistics.requests.forEach((req) => {
        const dateObj = new Date(req.date);
        if (dateObj.getFullYear() === year) {
          const mIndex = dateObj.getMonth();
          init[mIndex][req.method] += 1;
        }
      });

      return init;
    }

    return [];
  }, [statistics.requests, range]);

  return (
    <Card className="bg-gradient-to-br from-white border border-slate-200">
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-indigo-500" />
            HTTP Metožu Trend
          </CardTitle>
          <CardDescription>
            {range === "7d" && "Pēdējās 7 dienas"}
            {range === "30d" && "Šis mēnesis (pa dienām)"}
            {range === "12m" && "Šis gads (pa mēnešiem)"}
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setRange("7d")}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              range === "7d"
                ? "bg-indigo-500 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            7D
          </button>
          <button
            onClick={() => setRange("30d")}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              range === "30d"
                ? "bg-indigo-500 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            30D
          </button>
          <button
            onClick={() => setRange("12m")}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              range === "12m"
                ? "bg-indigo-500 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            12M
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey={range === "12m" ? "month" : "day"}
              stroke="#6B7280"
            />
            <YAxis allowDecimals={false} stroke="#6B7280" />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Line type="monotone" dataKey="GET" stroke="#10B981" strokeWidth={3} />
            <Line type="monotone" dataKey="POST" stroke="#3B82F6" strokeWidth={3} />
            <Line type="monotone" dataKey="PUT" stroke="#8B5CF6" strokeWidth={3} />
            <Line type="monotone" dataKey="DELETE" stroke="#EF4444" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
