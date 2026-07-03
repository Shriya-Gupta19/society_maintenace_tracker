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
      className="content-card"
    >
      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm card-muted mb-2">
            {title}
          </p>

          <h2 className="text-4xl font-bold text-white">
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
