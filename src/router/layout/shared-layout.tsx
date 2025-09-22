import { connectionStatusAtom } from "@/lib/atoms/connection-status";
import { useAtomValue } from "@effect-atom/atom-react";
import { Outlet } from "react-router";

export function SharedLayout() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-row items-center justify-between border-b p-3">
        <div>
          <div className="text-mrt-red uppercase">McGill Rocket Team</div>
          <div className="text-sm uppercase">Ground Station</div>
        </div>

        <ConnectionStatus />
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
function ConnectionStatus() {
  const connectionStatus = useAtomValue(connectionStatusAtom);

  return <div>{connectionStatus.toLocaleUpperCase()}</div>;
}
