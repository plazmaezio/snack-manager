import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { type UserType } from "../types/user.types";

const Signup = () => {
  const [selectedType, setSelectedType] = useState<UserType>("CLIENT");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      navigate("/");
      return;
    }
    document.title = "Create Account - Snack Manager";
  }, []);

  const userTypeOptions: { value: UserType; label: string }[] = [
    { value: "CLIENT", label: "Client" },
    { value: "EMPLOYEE", label: "Employee" },
    { value: "ADMIN", label: "Admin" },
  ];

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Check if passwords match
    // Values respect requirements from PROJECT REQUIREMENTS
    // Handle form submission logic here, such as sending data to the server
  }

  return (
    <div className="flex items-center justify-center py-20">
      <form
        className="w-full max-w-md mx-4 md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10 dark:shadow-black/30"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Create Account
        </h2>

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

        <label className="block mb-2 font-medium">User Type</label>
        <div className="flex gap-2 mb-4">
          {userTypeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelectedType(option.value)}
              className="flex-1 py-2.5 px-4 rounded-full transition"
              style={
                selectedType === option.value
                  ? {
                      backgroundColor: "var(--accent)",
                      color: "white",
                    }
                  : {
                      backgroundColor: "var(--input-bg)",
                      color: "var(--text-h)",
                      border: "1px solid var(--ui-border)",
                    }
              }
            >
              {option.label}
            </button>
          ))}
        </div>

        <label htmlFor="password" className="block mb-1 font-medium">
          Password
        </label>
        <input
          id="password"
          className="w-full border mb-4 outline-none rounded-full py-2.5 px-4"
          type="password"
          placeholder="Create a password"
          required
        />

        <label htmlFor="confirmPassword" className="block mb-1 font-medium">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          className="w-full border outline-none rounded-full py-2.5 px-4"
          type="password"
          placeholder="Confirm your password"
          required
        />

        <button
          type="submit"
          className="w-full mt-10 mb-3 bg-brand hover:opacity-90 active:scale-95 transition py-2.5 rounded-full text-white"
        >
          Sign up
        </button>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-brand underline hover:opacity-80"
          >
            Login Now
          </button>
        </p>
      </form>
    </div>
  );
};

export default Signup;
