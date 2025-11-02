import { Sidebar } from "@/components/app/sidebar";
import { Badge } from "@/components/ui/badge";
import { connectionStatusAtom } from "@/lib/atoms/connection-status";
import { yamcsWebsocketAtom } from "@/lib/atoms/yamcs";
import { useAtomValue } from "@effect-atom/atom-react";
import { Outlet } from "react-router";

export function SharedLayout() {
  useAtomValue(yamcsWebsocketAtom);
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-row items-center justify-between border-b p-3">
        <div>
          <div className="text-mrt-red text-sm uppercase">
            McGill Rocket Team
          </div>
          <div className="text-xs uppercase">Ground Station</div>
        </div>

        <ConnectionStatus />
      </div>
      <div className="flex h-full flex-1 flex-row px-2">
        <Sidebar />
        <div className="h-full flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
function ConnectionStatus() {
  const connectionStatus = useAtomValue(connectionStatusAtom);

  return (
    <Badge
      className="border-r-2 border-l-0"
      variant={connectionStatus === "connected" ? "success" : "error"}
    >
      {connectionStatus.toLocaleUpperCase()}
    </Badge>
  );
}
