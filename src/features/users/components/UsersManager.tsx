import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import CentralizedList from "../../../shared/components/CentralizedList";
import {
  createUserService,
  deleteUserService,
  fetchUsersService,
  updateUserService,
  type UserUpdateRequest,
} from "../services/userService";
import {
  userTypeOptions,
  type UserRequest,
  type UserResponse,
  type UserType,
} from "../../auth/types";
import {
  getPasswordValidationErrors,
  USERNAME_PATTERN,
} from "../../../shared/utils/passwordValidation.ts";

class UserModel implements UserResponse {
  id = "";
  username = "";
  type: UserType = "CLIENT";
  balance = 0;
}

type UserFormValues = {
  username: string;
  type: UserType;
  balance: string;
  password: string;
};

type UserFormProps = {
  title: string;
  submitLabel: string;
  initialValues: UserFormValues;
  requirePassword?: boolean;
  showTypeSelector?: boolean;
  onSubmit: (values: {
    username: string;
    type: UserType;
    balance?: number;
    password?: string;
  }) => void;
  onClose: () => void;
};

const hasBalanceField = (type: UserType) => type !== "EMPLOYEE";

const parseBalance = (value: string): number | undefined => {
  if (!value.trim()) {
    return undefined;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
};

const UserForm = ({
  title,
  submitLabel,
  initialValues,
  requirePassword = false,
  showTypeSelector = true,
  onSubmit,
  onClose,
}: UserFormProps) => {
  const [username, setUsername] = useState(initialValues.username);
  const [type, setType] = useState<UserType>(initialValues.type);
  const [balance, setBalance] = useState(initialValues.balance);
  const [password, setPassword] = useState(initialValues.password);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inputErrors, setInputErrors] = useState<string[] | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedPassword = password.trim();
    const normalizedConfirmPassword = confirmPassword.trim();

    if (requirePassword && !normalizedConfirmPassword) {
      setInputErrors(["Please confirm the password"]);
      return;
    }

    if (normalizedPassword || normalizedConfirmPassword) {
      if (normalizedPassword !== normalizedConfirmPassword) {
        setInputErrors(["Passwords do not match"]);
        return;
      }
    }

    if (normalizedPassword) {
      const passwordErrors = getPasswordValidationErrors(normalizedPassword);
      if (passwordErrors.length > 0) {
        setInputErrors(passwordErrors);
        return;
      }
    }

    setInputErrors(null);

    onSubmit({
      username: username.trim(),
      type,
      balance: hasBalanceField(type) ? parseBalance(balance) : undefined,
      password: normalizedPassword || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-main-bg/70 px-4 py-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-ui-border bg-main-bg p-5 text-left shadow-xl"
      >
        <h2 className="mb-2 text-2xl font-semibold text-heading">{title}</h2>

        <div className="flex-1 overflow-y-auto scrollbar-themed pr-1">
          <label
            htmlFor="user-username"
            className="mb-1 block font-medium text-main-text"
          >
            Username
          </label>
          <input
            id="user-username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Enter username"
            required
            pattern={USERNAME_PATTERN}
            title="Use only letters, numbers, underscores, and hyphens"
            className="mb-4 w-full rounded-full border border-ui-border bg-(--input-bg) px-4 py-2.5 text-main-text outline-none transition focus:border-brand"
          />

          {showTypeSelector && (
            <>
              <label className="mb-2 block font-medium text-main-text">Type</label>
              <div className="mb-4 rounded-2xl border border-ui-border overflow-hidden">
                <div className="max-h-32 overflow-y-auto scrollbar-themed p-3">
                  <div className="flex flex-wrap gap-2">
                    {(
                      Object.entries(userTypeOptions) as [UserType, string][]
                    ).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setType(value)}
                        className="rounded-full px-4 py-2 text-sm font-medium transition"
                        style={
                          type === value
                            ? { backgroundColor: "var(--accent)", color: "white" }
                            : {
                                backgroundColor: "var(--input-bg)",
                                color: "var(--text-h)",
                                border: "1px solid var(--ui-border)",
                              }
                        }
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {hasBalanceField(type) && (
            <>
              <label
                htmlFor="user-balance"
                className="mb-1 block font-medium text-main-text"
              >
                Balance
              </label>
              <input
                id="user-balance"
                type="number"
                min="0"
                step="0.01"
                value={balance}
                onChange={(event) => setBalance(event.target.value)}
                placeholder="Enter balance"
                className="mb-4 w-full rounded-full border border-ui-border bg-(--input-bg) px-4 py-2.5 text-main-text outline-none transition focus:border-brand"
              />
            </>
          )}

          <label
            htmlFor="user-password"
            className="mb-1 block font-medium text-main-text"
          >
            Password
          </label>
          <input
            id="user-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={requirePassword ? "Create a password" : "Leave blank to keep the current password"}
            required={requirePassword}
            className="mb-2 w-full rounded-full border border-ui-border bg-(--input-bg) px-4 py-2.5 text-main-text outline-none transition focus:border-brand"
          />

          <label
            htmlFor="user-confirm-password"
            className="mb-1 block font-medium text-main-text"
          >
            Confirm Password
          </label>
          <input
            id="user-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder={requirePassword ? "Confirm password" : "Confirm new password"}
            required={requirePassword}
            className="mb-2 w-full rounded-full border border-ui-border bg-(--input-bg) px-4 py-2.5 text-main-text outline-none transition focus:border-brand"
          />

          {inputErrors && (
            <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700 shadow-[0px_0px_10px_0px] shadow-red-500/40">
              {inputErrors.map((error, index) => (
                <p key={index}>- {error}</p>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3 bg-main-bg pt-2 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full border border-ui-border bg-(--input-bg) px-5 py-2.5 text-sm font-medium text-main-text transition hover:border-brand hover:text-brand"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 active:scale-95"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
};

const UsersManager = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);

      try {
        const data = await fetchUsersService();
        setUsers(data);
        setError(null);
      } catch {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleCreateUser = async (values: {
    username: string;
    type: UserType;
    balance?: number;
    password?: string;
  }) => {
    try {
      const payload: UserRequest = {
        username: values.username,
        password: values.password ?? "",
        type: values.type,
        balance: values.balance ?? 0,
      };

      const response = await createUserService(payload);
      setUsers((current) => [...current, response]);
      setError(null);
    } catch {
      setError("Failed to create user");
    }
  };

  const handleUpdateUser = async (
    userId: string,
    values: {
      username: string;
      type: UserType;
      balance?: number;
      password?: string;
    },
  ) => {
    try {
      const payload: UserUpdateRequest = {
        username: values.username,
        type: values.type,
        ...(values.balance !== undefined ? { balance: values.balance } : {}),
        ...(values.password ? { password: values.password } : {}),
      };

      const response = await updateUserService(userId, payload);
      setUsers((current) =>
        current.map((user) => (user.id === userId ? response : user)),
      );
      setError(null);
    } catch {
      setError("Failed to update user");
    }
  };

  const handleDeleteUsers = async (ids: string[]) => {
    try {
      await Promise.all(ids.map((id) => deleteUserService(id)));
      setUsers((current) => current.filter((user) => !ids.includes(user.id)));
      setError(null);
    } catch {
      setError("Failed to delete users");
    }
  };

  return (
    <div className="space-y-8">
      {(loading || error) && (
        <div className="rounded-2xl border border-ui-border bg-(--input-bg) px-4 py-3 text-sm text-main-text">
          {loading && <span>Loading users...</span>}
          {error && (
            <span className={loading ? "ml-3 text-red-500" : "text-red-500"}>
              {error}
            </span>
          )}
        </div>
      )}

      <CentralizedList
        data={users}
        model={UserModel}
        onCreate={() => navigate("/manage-users/create-account")}
        sortFields={[
          "username",
          "type",
          "balance",
        ]}
        defaultSortField="username"
        searchFields={[
          "username",
          "type",
          "balance",
        ]}
        fieldFormatters={{
          type: (value) => userTypeOptions[value as UserType] ?? String(value),
          balance: (value) => Number(value ?? 0).toFixed(2),
        }}
        renderRowActions={(item) =>
          item.type === "CLIENT" ? (
            <button
              type="button"
              onClick={() => navigate(`/manage-users/purchases/${item.id}`)}
              className="rounded-full border border-ui-border bg-main-bg px-4 py-2 text-sm font-medium text-main-text transition hover:border-brand hover:text-brand"
            >
              Purchases
            </button>
          ) : null
        }
        renderCreateModal={(onClose) => (
          <UserForm
            title="Create user"
            submitLabel="Create user"
            initialValues={{
              username: "",
              type: "CLIENT",
              balance: "0",
              password: "",
            }}
            requirePassword
            onSubmit={(values) => {
              handleCreateUser(values);
              onClose();
            }}
            onClose={onClose}
          />
        )}
        renderEditModal={(item, onClose) => (
          <UserForm
            title="Edit user"
            submitLabel="Save changes"
            showTypeSelector={false}
            initialValues={{
              username: item.username,
              type: item.type,
              balance: String(item.balance ?? 0),
              password: "",
            }}
            onSubmit={(values) => {
              handleUpdateUser(item.id, values);
              onClose();
            }}
            onClose={onClose}
          />
        )}
        onDelete={handleDeleteUsers}
      />
    </div>
  );
};

export default UsersManager;