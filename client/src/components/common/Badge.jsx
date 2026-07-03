function Badge({ children, color }) {

  const styles = {
    green: "bg-green-500/20 text-green-400",
    red: "bg-red-500/20 text-red-400",
    blue: "bg-blue-500/20 text-blue-400",
    yellow: "bg-yellow-500/20 text-yellow-400",
    orange: "bg-orange-500/20 text-orange-400",
    purple: "bg-purple-500/20 text-purple-400",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${styles[color]}`}
    >
      {children}
    </span>
  );
}

export default Badge;
