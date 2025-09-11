// import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Activity, BarChart3, Users, AlertCircle, TrendingUp, Globe, Eye } from "lucide-react";
import Navbar from "@/Components/Navbar";
import React, { useState } from "react"
import { Head } from "@inertiajs/react";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-gray-200 shadow-lg ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`p-6 pb-4 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-xl font-semibold text-gray-800 ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = "" }) => (
  <p className={`text-sm text-gray-600 mt-2 ${className}`}>
    {children}
  </p>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const StatCard = ({ title, value, icon: Icon, trend, color = "blue" }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 text-blue-600",
    green: "from-green-500 to-green-600 text-green-600",
    purple: "from-purple-500 to-purple-600 text-purple-600",
    red: "from-red-500 to-red-600 text-red-600",
    orange: "from-orange-500 to-orange-600 text-orange-600"
  };
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
            {trend && (
              <div className="flex items-center mt-2 text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>{trend}</span>
              </div>
            )}
          </div>
          <div className={`p-4 rounded-full bg-gradient-to-br ${colorClasses[color]} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ApiStatistics({ statistics }) {
  const [activeChart, setActiveChart] = useState("GET");
  const [showAll, setShowAll] = useState(false);

  const safeStats = {
    requests: statistics?.requests || [],
    errors: Array.isArray(statistics?.errors) ? statistics.errors : [],
    total_requests: statistics?.total_requests || 0,
    get_requests: statistics?.get_requests || 0,
    post_requests: statistics?.post_requests || 0,
    put_requests: statistics?.put_requests || 0,
    delete_requests: statistics?.delete_requests || 0,
  };

  // ierobežo līdz 50 kļūdām
  const limitedErrors = safeStats.errors.slice(0, 50);
  const displayedErrors = showAll ? limitedErrors : limitedErrors.slice(0, 5);

  const chartData = [
    { method: "GET", count: safeStats.get_requests },
    { method: "POST", count: safeStats.post_requests },
    { method: "PUT", count: safeStats.put_requests },
    { method: "DELETE", count: safeStats.delete_requests },
  ].filter(item => item.count > 0);

  return (
    <>
    <Head title="Stats" />
    <div className="min-h-screen bg-gray-50 text-black">

        <Navbar />
        
        <div className="pt-24 max-w-7xl mx-auto p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Kopā pieprasījumi" 
            value={safeStats.total_requests} 
            icon={Activity}
            trend=""
            color="blue"
          />
          <StatCard 
            title="GET pieprasījumi" 
            value={safeStats.get_requests} 
            icon={Globe}
            color="green"
          />
          <StatCard 
            title="POST pieprasījumi" 
            value={safeStats.post_requests} 
            icon={Users}
            color="purple"
          />
          <StatCard 
            title="Kļūdas" 
            value={safeStats.errors.length} 
            icon={AlertCircle}
            color="red"
          />
        </div>

{/* Grafiku sekcija */}
<Card className="py-4 sm:py-0 border-0 shadow-xl bg-gradient-to-br from-white to-blue-50">
  <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
    {/* Virsraksts */}
    <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
      <CardTitle>HTTP Metožu Statistika</CardTitle>
      <CardDescription>
        Pieprasījumu skaits pa HTTP metodēm
      </CardDescription>
    </div>

    {/* Pārslēgšanas pogas */}
    <div className="flex">
      {["GET", "POST", "PUT", "DELETE"].map((method) => (
        <button
          key={method}
          data-active={activeChart === method}
          className="data-[active=true]:bg-blue-100 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
          onClick={() => setActiveChart(method)}
        >
          <span className="text-muted-foreground text-xs">{method}</span>
          <span className="text-lg leading-none font-bold sm:text-2xl">
            {safeStats[`${method.toLowerCase()}_requests`]?.toLocaleString() || 0}
          </span>
        </button>
      ))}
    </div>
  </CardHeader>

  <CardContent className="px-2 sm:p-6">
    {chartData.length > 0 ? (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData.map((d, i) => ({
            date: `Diena ${i + 1}`,
            GET: d.method === "GET" ? d.count : 0,
            POST: d.method === "POST" ? d.count : 0,
            PUT: d.method === "PUT" ? d.count : 0,
            DELETE: d.method === "DELETE" ? d.count : 0,
          }))}
          margin={{ left: 12, right: 12 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={activeChart}
            stroke={
              {
                GET: "#10b981",
                POST: "#3b82f6",
                PUT: "#8b5cf6",
                DELETE: "#ef4444",
              }[activeChart]
            }
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    ) : (
      <div className="flex items-center justify-center h-[300px] text-gray-500">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
            <BarChart3 className="h-10 w-10 text-blue-400" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-600">Nav datu attēlošanai</p>
            <p className="text-sm text-gray-500 mt-1">
              Grafiks parādīsies, kad būs veikti pieprasījumi
            </p>
          </div>
        </div>
      </div>
    )}
  </CardContent>
</Card>





<Card className="border-0 shadow-xl bg-gradient-to-br from-white to-red-50">
  <CardHeader>
    <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
      <AlertCircle className="h-5 w-5 text-red-600" />
      Kļūdu žurnāls
    </CardTitle>
    <CardDescription>Pēdējās sistēmas kļūdas</CardDescription>
  </CardHeader>
  <CardContent>
    {safeStats.errors.length > 0 ? (
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {displayedErrors.map((err, i) => (
          <div
            key={i}
            className="p-3 border border-red-200 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
          >
            <div className="flex items-center justify-between space-x-3">
              {/* Kreisā puse - datums */}
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">{err.date}</p>
              </div>

              {/* Vidus - HTTP metode */}
              <div className="flex-1 text-center">
                <p className="text-sm font-medium text-red-600">Method: {err.method}</p>
              </div>

              {/* Labā puse - status code */}
              <div className="flex-1 text-right">
                <p className="text-sm font-medium text-red-600">Error: {err.status_code}</p>
              </div>
            </div>

            {/* Ziņojums zemāk pa visu */}
            <p className="text-sm text-red-600 mt-1">Message: {err.message}</p>
          </div>
        ))}

        {safeStats.errors.length > 5 && !showAll && (
          <div className="text-center pt-2">
            <button
              onClick={() => setShowAll(true)}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Skatīt visas kļūdas ({Math.min(safeStats.errors.length, 50)})
            </button>
          </div>
        )}
      </div>
    ) : (
      <div className="flex items-center justify-center h-32 text-gray-500">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <p className="text-green-600 font-medium">Nav kļūdu!</p>
          <p className="text-gray-500 text-sm">Jūsu API darbojas nevainojami</p>
        </div>
      </div>
    )}
  </CardContent>
</Card>


        </div>
        </div>
      </>

  );
}