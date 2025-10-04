import { Link } from "react-router";
import { dashboardList } from "@/router/router";
import {AddCardDialog } from "./add-card-dialog";
import { Button} from "../ui/button";



export function Sidebar() {

    return (
        <aside className="">
            <div className="">
                <span className="">Dashboards</span>
                <AddCardDialog trigger={<Button size="sm" variant="outline">+</Button>} />
                
            </div>
            <nav className="flex flex-col gap-3">
                {dashboardList.map((dashboard) => (
                    <Link
                        key = {dashboard.slug}
                        to = {dashboard.slug}
                    >
                        {dashboard.title}
                    </Link>
                ))}
                <Link
                    to = "/settings"
                    className=""
                >
                    Settings
                </Link>
            </nav>
        </aside>
    )
}