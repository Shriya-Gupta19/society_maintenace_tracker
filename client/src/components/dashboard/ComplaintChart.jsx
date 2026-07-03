import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#f59e0b",
  "#16a34a",
];

function ComplaintChart({ stats }) {

  const data = [
    {
      name: "Open",
      value: stats.open || 0,
    },
    {
      name: "In Progress",
      value: stats.inProgress || 0,
    },
    {
      name: "Resolved",
      value: stats.resolved || 0,
    },
  ];

  return (
    <div className="content-card">

      <h2 className="text-xl font-semibold mb-6 text-white">
        Complaint Analytics
      </h2>

      <div className="h-[350px]">

        <ResponsiveContainer>

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              outerRadius={120}
              label={{ fill: "#e2e8f0" }}
            >

              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))}

            </Pie>

            <Tooltip
              contentStyle={{
                background: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "0.75rem",
                color: "#f1f5f9",
              }}
            />

            <Legend wrapperStyle={{ color: "#94a3b8" }} />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default ComplaintChart;