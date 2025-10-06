export function LoginsPage() {
  return (
    <div className="shadow-x1 w-90 rounded-md bg-amber-50 p-20">
      <h1 className="text-3x1 fa-solid fa-user block text-center font-semibold text-black">
        {" "}
        User Login
      </h1>
      <hr className="mt-3" />
      <div className="mt-3">
        <label className="mb-2 block text-black">Username</label>
        <input
          type="text"
          id="username"
          className="w-full border px-2 py-1 text-black focus:border-gray-600 focus:ring-0 focus:outline-none"
          placeholder="Enter Username"
        />
      </div>
      <div className="mt-3">
        <label className="mb-2 block text-black">Password</label>
        <input
          type="password"
          id="password"
          className="w-full border px-2 py-1 text-black focus:border-gray-600 focus:ring-0 focus:outline-none"
          placeholder="Enter Password"
        />
      </div>
      <div></div>
    </div>
  );
}
