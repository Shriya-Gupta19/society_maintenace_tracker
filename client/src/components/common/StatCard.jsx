import { motion } from "framer-motion";

function StatCard({
  title,
  value,
  icon,
  color = "bg-blue-600",
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg p-6 border border-slate-200"
    >
      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-slate-500 mb-2">
            {title}
          </p>

          <h2 className="text-4xl font-bold text-slate-800">
            {value}
          </h2>
        </div>

        <div
          className={`h-14 w-14 rounded-xl flex items-center justify-center text-white ${color}`}
        >
          {icon}
        </div>

      </div>
    </motion.div>
  );
}

export default StatCard;