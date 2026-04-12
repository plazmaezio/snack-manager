import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, error, isLoading } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault(); // prevent reloading
      await login(username, password);
    } catch (error) {
      console.error("Login failed:", error);
      return;
    }
    navigate("/");
  };

  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      navigate("/");
      return;
    }
    document.title = "Login - Snack Manager";
  }, []);

  return (
    <div className="flex items-center justify-center py-20">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-4 md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10 dark:shadow-black/30"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Login Now</h2>

        <label htmlFor="username" className="block mb-1 font-medium">
          Username
        </label>
        <input
          id="username"
          className="w-full border mb-4 outline-none rounded-full py-2.5 px-4"
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-10 mb-3 bg-brand hover:opacity-90 active:scale-95 transition py-2.5 rounded-full text-white"
        >
          {isLoading ? "Logging in..." : "Log in"}
        </button>

        <p className="text-center mt-4">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/create-account")}
            className="text-brand underline hover:opacity-80"
          >
            Create It Now
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
