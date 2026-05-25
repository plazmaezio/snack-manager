import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UsersManager from "../components/UsersManager";
import UserPurchasesManager from "../components/UserPurchasesManager";

const ManageUsers = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const activeSection = pathname.startsWith(
    "/manage-users/purchases",
  )
    ? "purchases"
    : ("users" as const);

  useEffect(() => {
    document.title =
      activeSection === "purchases"
        ? "Manage Purchases - Snack Manager"
        : "Manage Users - Snack Manager";

    const isKnownRoute =
      pathname === "/manage-users" ||
      pathname === "/manage-users/users" ||
      pathname === "/manage-users/purchases" ||
      pathname.startsWith("/manage-users/purchases/");

    if (!isKnownRoute) {
      navigate("/manage-users/users", { replace: true });
    }
    if (pathname === "/manage-users") {
      navigate("/manage-users/users", { replace: true });
    }
  }, [activeSection, navigate, pathname]);

  const buttonClass = (value: "users" | "purchases") =>
    `flex-1 px-4 py-3 text-sm font-semibold transition ${
      activeSection === value
        ? "bg-brand text-white"
        : "bg-(--input-bg) text-main-text hover:text-brand"
    }`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <section className="rounded-full border border-ui-border bg-main-bg/90 p-1 shadow-[0px_0px_10px_0px] shadow-black/10 dark:shadow-black/30">
          <div className="flex overflow-hidden rounded-full">
            <button
              type="button"
              onClick={() => navigate("/manage-users/users")}
              className={buttonClass("users")}
            >
              Users
            </button>
            <button
              type="button"
              onClick={() => navigate("/manage-users/purchases")}
              className={buttonClass("purchases")}
            >
              Purchases
            </button>
          </div>
        </section>

        {activeSection === "users" && <UsersManager />}
        {activeSection === "purchases" && <UserPurchasesManager />}
      </div>
    </div>
  );
};

export default ManageUsers;