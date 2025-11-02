export function LoginsPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="bg-background w-full max-w-md rounded-2xl border p-8 shadow-lg">
        <h1 className="text-primary mb-4 text-center text-3xl font-semibold">
          <i className="fa-solid fa-user text-muted mr-2"></i>
          User Login
        </h1>
        <hr className="border-border mb-6" />

        <div className="mb-4">
          <label
            htmlFor="username"
            className="text-primary mb-2 block text-sm font-medium"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            className="text-primary focus:border-ring focus:ring-ring w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:outline-none"
            placeholder="Enter your username"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="text-primary mb-2 block text-sm font-medium"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="text-primary focus:border-ring focus:ring-ring w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:outline-none"
            placeholder="Enter your password"
          />
        </div>

        <div className="mb-4 flex items-center justify-between text-sm">
          <label className="text-primary flex items-center">
            <input type="checkbox" className="accent-mrt-red mr-2" />
            Remember me
          </label>
        </div>

        <button
          type="submit"
          className="focus:ring-ring bg-mrt-red w-full rounded-md py-2 font-semibold text-white transition duration-200 hover:bg-red-800 focus:ring-2 focus:outline-none"
        >
          Login
        </button>
      </div>
    </div>
  );
}
