import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <h1 className="text-xl font-semibold">HireTrackr</h1>
          <nav className="flex items-center gap-3 text-sm">
            <NavLink to="/" className="rounded px-3 py-1 hover:bg-slate-100">
              Dashboard
            </NavLink>
            <span className="text-slate-600">{user?.name}</span>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="rounded bg-slate-900 px-3 py-1 text-white"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4">{children}</main>
    </div>
  );
};

export default Layout;
