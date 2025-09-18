import React, { useState, useMemo } from "react";
import { Head } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import HttpMethodsTrendChart from "@/Components/HttpMethodsTrendChart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Activity, Globe, Users, AlertCircle, TrendingUp, BarChart3 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/Card";



const StatCard = ({ title, value, icon: Icon, trend, color = "blue" }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 text-blue-600",
    green: "from-green-500 to-green-600 text-green-600",
    purple: "from-purple-500 to-purple-600 text-purple-600",
    red: "from-red-500 to-red-600 text-red-600",
    orange: "from-orange-500 to-orange-600 text-orange-600"
  };
  return (
    <Card className="group transition-all duration-300 hover:-translate-y-1 border border-slate-200 bg-gradient-to-br from-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-black">{value.toLocaleString()}</p>
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

  const limitedErrors = safeStats.errors.slice(0, 50);
  const displayedErrors = showAll ? limitedErrors : limitedErrors.slice(0, 5);




  return (
    <>
      <Head title="Stats" />
      <div className="min-h-screen bg-gray-50 text-black">
        <Navbar />
        <div className="pt-24 max-w-7xl mx-auto p-6 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Esošie kopā pieprasījumi un kļūdas */}
            <StatCard title="Kopā pieprasījumi" value={safeStats.total_requests} icon={Activity} color="blue" />
            <StatCard title="GET pieprasījumi" value={safeStats.get_requests} icon={Globe} color="green" />
            <StatCard title="POST pieprasījumi" value={safeStats.post_requests} icon={Users} color="purple" />
            <StatCard title="Kļūdas" value={safeStats.errors.length} icon={AlertCircle} color="red" />

            {/* Jaunās StatCard līnijas ar vidējo response time */}
            {["GET", "POST", "PUT", "DELETE"].map((method) => {
              // Aprēķina vidējo ms šai metodei
              const methodRequests = safeStats.requests.filter(r => r.method === method);
              const avgMs = methodRequests.length > 0
                ? Math.round(methodRequests.reduce((a, b) => a + b.response_time_ms, 0) / methodRequests.length)
                : 0;

              return (
                <StatCard
                  key={method}
                  title={`${method} vid. response time`}
                  value={`${avgMs}ms`}
                  icon={BarChart3} // vai cits icons
                  color="orange"
                />
              )
            })}
          </div>



          <HttpMethodsTrendChart statistics={safeStats} />


          <Card className="border border-slate-200 bg-gradient-to-br from-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Kļūdu žurnāls
              </CardTitle>
              <CardDescription>Pēdējās sistēmas kļūdas</CardDescription>
            </CardHeader>
            <CardContent>
              {safeStats.errors.length > 0 ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {displayedErrors.map((err, i) => (
                    <div key={i} className="p-3 border border-red-200 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
                      <div className="flex justify-between text-sm font-medium text-red-700">
                        <span>{err.date}</span>
                        <span>{err.method}</span>
                        <span>{err.status_code}</span>
                      </div>
                      <p className="text-sm text-red-600 mt-1">{err.message}</p>
                    </div>
                  ))}
                  {safeStats.errors.length > 5 && !showAll && (
                    <div className="text-center pt-2">
                      <button onClick={() => setShowAll(true)} className="text-red-600 hover:text-red-800 text-sm font-medium">
                        Skatīt visas kļūdas ({Math.min(safeStats.errors.length, 50)})
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
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
