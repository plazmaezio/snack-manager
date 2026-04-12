import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { type UserType } from "../types/user.types";
import { useAuth } from "../contexts/AuthContext";

const CreateAccount = () => {
  const [selectedType, setSelectedType] = useState<UserType>("CLIENT");
  const navigate = useNavigate();
  const [inputError, setInputError] = useState<string[] | null>(null);
  const { createAccount } = useAuth();

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

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    const errors: string[] = [];
    const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;

    const formData = new FormData(event.currentTarget);
    const username: string = formData.get("username") as string;
    const password: string = formData.get("password") as string;
    const confirmPassword: string = formData.get("confirmPassword") as string;

    // Client-side validation
    if (!username || !password || !confirmPassword) {
      console.log(username, password, confirmPassword);
      errors.push("All fields are required");
      return setInputError(errors);
    }

    if (password !== confirmPassword) {
      errors.push("Passwords do not match");
      return setInputError(errors);
    }

    // PASSWORD must have at least 6 characters, one uppercase,
    // one lowercase, one special character and one number
    if (password.length < 6)
      errors.push("Password must be at least 6 characters");
    if (!/[a-z]/.test(password))
      errors.push("Password must have at least one lowercase letter");
    if (!/[A-Z]/.test(password))
      errors.push("Password must have at least one uppercase letter");
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
      errors.push("Password must have at least one special character");
    if (!/[0-9]/.test(password))
      errors.push("Password must have at least one number");

    // USERNAME can only contain letters, numbers, underscores and hyphens
    if (!USERNAME_REGEX.test(username)) {
      errors.push(
        "Username can only contain letters, numbers, underscores, and hyphens",
      );
    }

    if (errors.length > 0) {
      return setInputError(errors);
    }

    const userData = {
      username,
      password,
      type: selectedType,
    };

    try {
      await createAccount(userData);
      navigate("/");
    } catch (err) {
      setInputError([
        err instanceof Error ? err.message : "Failed to create account",
      ]);
    }
  };

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
          name="username"
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
          name="password"
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
          name="confirmPassword"
          className="w-full border outline-none rounded-full py-2.5 px-4"
          type="password"
          placeholder="Confirm your password"
          required
        />

        {inputError && (
          <div className="w-full max-w-md mx-4 mt-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-red-500/50 p-4 bg-red-50 text-red-700">
            {inputError.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}

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

export default CreateAccount;
