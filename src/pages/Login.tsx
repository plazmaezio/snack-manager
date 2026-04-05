import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center py-20">
      <form className="w-full max-w-md mx-4 md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10 dark:shadow-black/30">
        <h2 className="text-2xl font-semibold mb-6 text-center">Login Now</h2>

        <label htmlFor="username" className="block mb-1 font-medium">
          Username
        </label>
        <input
          id="username"
          className="w-full border mb-4 outline-none rounded-full py-2.5 px-4"
          type="text"
          placeholder="Enter your username"
          required
        />

        <label htmlFor="password" className="block mb-1 font-medium">
          Password
        </label>
        <input
          id="password"
          className="w-full border outline-none rounded-full py-2.5 px-4"
          type="password"
          placeholder="Enter your password"
          required
        />
        <button
          type="submit"
          className="w-full mt-10 mb-3 bg-brand hover:opacity-90 active:scale-95 transition py-2.5 rounded-full text-white"
        >
          Log in
        </button>
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-brand underline hover:opacity-80"
          >
            Signup Now
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
