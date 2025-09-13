import { Outlet } from "react-router";

export function SharedLayout() {
  return (
    <div>
      <div className="flex flex-row justify-between border-b p-3">
        <div>
          <div className="text-mrt-red uppercase">McGill Rocket Team</div>
          <div className="text-sm uppercase">Ground Station</div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
