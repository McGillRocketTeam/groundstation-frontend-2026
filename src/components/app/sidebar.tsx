import { dashboardList } from "@/router/router";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { AddCardDialog } from "./add-card-dialog";

export function Sidebar() {
  return (
    <aside className="h-full w-45 border-r p-3">
      <div className="mb-2 flex items-center py-2">
        <span className="mr-2 px-2 py-1">Dashboards</span>
        <AddCardDialog
          trigger={
            <Button size="sm" variant="outline">
              +
            </Button>
          }
        />
      </div>
      <nav className="ml-2 flex flex-1 flex-col overflow-auto">
        {dashboardList.map((dashboard) => (
          <Link
            className="hover:bg-muted px-3 py-1"
            key={dashboard.slug}
            to={dashboard.slug}
          >
            {dashboard.title}
          </Link>
        ))}
      </nav>
      <div className="mt-auto flex w-full justify-center py-3">
        <Link
          to="/settings"
          className="text-primary hover:bg-muted w-full px-3 py-1 text-left"
        >
          Settings
        </Link>
      </div>
    </aside>
  );
}
