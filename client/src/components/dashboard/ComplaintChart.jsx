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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

      <h2 className="text-xl font-semibold mb-6">
        Complaint Analytics
      </h2>

      <div className="h-[350px]">

        <ResponsiveContainer>

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              outerRadius={120}
              label
            >

              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))}

            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default ComplaintChart;