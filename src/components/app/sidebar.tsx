import { Link } from "react-router";
import { dashboardList } from "@/router/router";
import {AddCardDialog } from "./add-card-dialog";
import { Button} from "../ui/button";



export function Sidebar() {

    return (
        <aside className="h-full w-45 border-r p-3">
            <div className="flex items-center py-2 mb-2">
                <span className="mr-2 box-border border-1 py-1 px-2">Dashboards</span>
                <AddCardDialog trigger={<Button size="sm" variant="outline">+</Button>} />
            </div>
            <nav className="flex flex-col ml-2 flex-1 overflow-auto">
                {dashboardList.map((dashboard) => (
                    <Link className="hover:bg-[#221809] px-3 py-1"
                        key = {dashboard.slug}
                        to = {dashboard.slug}
                    >
                        {dashboard.title}
                    </Link>
                ))}
                
            </nav>
            <div className="mt-auto py-3 w-full flex justify-center">
                    <Link
                        to="/settings"
                        className="w-full text-left py-1 px-3 hover:bg-[#221809] text-[#FE9A00]"
                    >
                        Settings
                    </Link>
                </div>
        </aside>
    )
}