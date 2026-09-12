import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function DashboardShell() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}