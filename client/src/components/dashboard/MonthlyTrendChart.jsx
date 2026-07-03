import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function MonthlyTrendChart({ data }) {
  return (
    <div className="content-card">

      <h2 className="text-xl font-semibold mb-6 text-white">
        Monthly Complaint Trend
      </h2>

      <div className="h-[350px]">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={data}>

            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

            <XAxis dataKey="month" stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />

            <YAxis allowDecimals={false} stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />

            <Tooltip
              contentStyle={{
                background: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "0.75rem",
                color: "#f1f5f9",
              }}
            />

            <Line
              type="monotone"
              dataKey="complaints"
              stroke="#3b82f6"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default MonthlyTrendChart;