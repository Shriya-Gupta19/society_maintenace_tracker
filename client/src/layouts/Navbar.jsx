import { FiBell, FiSearch } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user } = useAuth();

  return (
    <header className="bg-white h-20 border-b border-slate-200 flex items-center justify-between px-8">

      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Dashboard
        </h2>

        <p className="text-sm text-slate-500">
          Welcome back, {user?.name}
        </p>
      </div>

      <div className="flex items-center gap-6">

        <div className="relative">

          <FiSearch className="absolute left-3 top-3 text-gray-400"/>

          <input
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-xl border border-slate-300 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        <button className="relative">

          <FiBell size={22}/>

          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center">
            3
          </span>

        </button>

        <div className="flex items-center gap-3">

          <div className="h-11 w-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">

            {user?.name?.charAt(0)}

          </div>

          <div>

            <p className="font-semibold">
              {user?.name}
            </p>

            <p className="text-sm text-gray-500 capitalize">
              {user?.role}
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;