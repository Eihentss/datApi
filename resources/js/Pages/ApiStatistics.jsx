// resources/js/Pages/ApiStatistics.jsx
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Vienkāršs Card komponents ar Tailwind
const Card = ({ children }) => (
  <div className="rounded-2xl border p-4 shadow-md bg-white mb-6">
    {children}
  </div>
);

export default function ApiStatistics({ stats }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">API Statistika</h1>

      <Card>
        <h2 className="text-xl font-semibold mb-4">Pieprasījumu grafiks</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.requests}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold mb-4">Kļūdas</h2>
        <ul className="list-disc pl-6 space-y-1">
          {stats.errors.map((err, i) => (
            <li key={i} className="text-red-600">
              {err.date}: {err.message}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
