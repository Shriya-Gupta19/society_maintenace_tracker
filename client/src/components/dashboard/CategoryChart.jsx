import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function CategoryChart({ data }) {
  return (
    <div className="content-card">

      <h2 className="text-xl font-semibold mb-6 text-white">
        Complaints by Category
      </h2>

      <div className="h-[350px]">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart data={data}>

            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

            <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />

            <YAxis allowDecimals={false} stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />

            <Tooltip
              contentStyle={{
                background: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "0.75rem",
                color: "#f1f5f9",
              }}
            />

            <Bar
              dataKey="value"
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default CategoryChart;