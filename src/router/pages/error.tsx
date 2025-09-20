import { isRouteErrorResponse, useRouteError } from "react-router";

export function RootErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="grid h-screen w-full place-items-center">
        <div className="bg-error-background border-error text-error flex w-fit flex-col border p-2 font-semibold uppercase">
          <h1>Routing Error [{error.status}]</h1>
          <p>MESSAGE: {error.statusText}</p>
        </div>
      </div>
    );
  }

  if (error instanceof Error) {
    return (
      <div className="space-y-4 p-4">
        <div className="bg-error-background border-error text-error flex w-fit flex-col border p-2 font-semibold uppercase">
          <h1>Unexpected Error</h1>
          <p>MESSAGE: {error.message}</p>
        </div>
        <div className="border-neutral bg-neutral-background text-neutral overflow-scroll border p-2">
          <h2 className="font-semibold">STACK TRACE</h2>
          {error.stack && <pre className="font-normal">{error.stack}</pre>}
        </div>
      </div>
    );
  }
}
