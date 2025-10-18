export function LoginsPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-4 text-center text-3xl font-semibold text-gray-800">
          <i className="fa-solid fa-user mr-2 text-amber-500"></i>
          User Login
        </h1>
        <hr className="mb-6 border-gray-300" />

        <div className="mb-4">
          <label
            htmlFor="username"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            placeholder="Enter your username"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            placeholder="Enter your password"
          />
        </div>

        <div className="mb-4 flex items-center justify-between text-sm">
          <label className="flex items-center text-gray-600">
            <input type="checkbox" className="mr-2 accent-red-500" />
            Remember me
          </label>
          <a href="#" className="text-red-600 hover:text-amber-700">
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-red-600 py-2 font-semibold text-white transition duration-200 hover:bg-red-800 focus:ring-2 focus:ring-amber-400 focus:outline-none"
        >
          Login
        </button>
      </div>
    </div>
  );
}
