import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "../../auth/contexts/AuthContext";
import { updateProfileService, type UserUpdateRequest } from "../services/userService";
import SuccessPopUp from "../../../shared/components/SuccessPopUp";
import {
  getPasswordValidationErrors,
  USERNAME_PATTERN,
  isValidUsername,
} from "../../../shared/utils/passwordValidation.ts";

const EditProfile = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState(user?.username ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inputErrors, setInputErrors] = useState<string[] | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    document.title = "Edit Profile - Snack Manager";
  }, []);

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user?.username]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    const errors: string[] = [];
    const normalizedUsername = username.trim();
    const normalizedPassword = password.trim();
    const normalizedConfirmPassword = confirmPassword.trim();

    if (!normalizedUsername) {
      errors.push("Username is required");
    }

    if (!isValidUsername(normalizedUsername)) {
      errors.push(
        "Username can only contain letters, numbers, underscores, and hyphens",
      );
    }

    if (normalizedPassword || normalizedConfirmPassword) {
      if (normalizedPassword !== normalizedConfirmPassword) {
        errors.push("Passwords do not match");
      }

      errors.push(...getPasswordValidationErrors(normalizedPassword));
    }

    if (errors.length > 0) {
      setInputErrors(errors);
      return;
    }

    setInputErrors(null);
    setIsSaving(true);

    try {
      const payload: UserUpdateRequest = {
        username: normalizedUsername,
        type: user.type,
        balance: user.balance,
        ...(normalizedPassword ? { password: normalizedPassword } : {}),
      };

      await updateProfileService(payload);
      setPassword("");
      setConfirmPassword("");
      setSuccess(true);
    } catch (error) {
      setInputErrors([
        error instanceof Error ? error.message : "Failed to update profile",
      ]);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-ui-border bg-(--input-bg) px-4 py-3 text-sm text-main-text">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <>
      {success && (
        <SuccessPopUp
          message="Profile updated successfully!"
          subMessage="Your changes have been saved."
          onClose={() => setSuccess(false)}
        />
      )}

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg rounded-3xl border border-ui-border bg-form-bg p-5 text-left shadow-xl"
        >
          <h2 className="mb-6 text-2xl font-semibold text-heading">Edit profile</h2>

          <label htmlFor="profile-username" className="mb-1 block font-medium text-main-text">
            Username
          </label>
          <input
            id="profile-username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Enter username"
            required
            pattern={USERNAME_PATTERN}
            title="Use only letters, numbers, underscores, and hyphens"
            className="mb-4 w-full rounded-full border border-ui-border bg-(--input-bg) px-4 py-2.5 text-main-text outline-none transition focus:border-brand"
          />

          <label className="mb-1 block font-medium text-main-text">User type</label>
          <input
            type="text"
            value={user.type}
            disabled
            className="mb-4 w-full rounded-full border border-ui-border bg-(--input-bg) px-4 py-2.5 text-main-text/70"
          />

          <label className="mb-1 block font-medium text-main-text">Balance</label>
          <input
            type="text"
            value={typeof user.balance === "number" ? user.balance.toFixed(2) : "N/A"}
            disabled
            className="mb-4 w-full rounded-full border border-ui-border bg-(--input-bg) px-4 py-2.5 text-main-text/70"
          />

          <label htmlFor="profile-password" className="mb-1 block font-medium text-main-text">
            New password
          </label>
          <input
            id="profile-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Leave blank to keep current password"
            className="mb-4 w-full rounded-full border border-ui-border bg-(--input-bg) px-4 py-2.5 text-main-text outline-none transition focus:border-brand"
          />

          <label htmlFor="profile-confirm-password" className="mb-1 block font-medium text-main-text">
            Confirm new password
          </label>
          <input
            id="profile-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm new password"
            className="mb-2 w-full rounded-full border border-ui-border bg-(--input-bg) px-4 py-2.5 text-main-text outline-none transition focus:border-brand"
          />

          {inputErrors && (
            <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700 shadow-[0px_0px_10px_0px] shadow-red-500/40">
              {inputErrors.map((error, index) => (
                <p key={index}>- {error}</p>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 bg-form-bg pt-2 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setUsername(user.username);
                setPassword("");
                setConfirmPassword("");
                setInputErrors(null);
              }}
              className="w-full rounded-full border border-ui-border bg-(--input-bg) px-5 py-2.5 text-sm font-medium text-main-text transition hover:border-brand hover:text-brand"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProfile;