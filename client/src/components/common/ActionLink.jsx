import { Link } from "react-router-dom";

function ActionLink({ to, children, className = "", onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm ${className}`}
    >
      {children}
    </Link>
  );
}

export default ActionLink;
