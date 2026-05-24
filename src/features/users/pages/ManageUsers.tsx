import { useEffect } from "react";
import UsersManager from "../components/UsersManager";

const ManageUsers = () => {
  useEffect(() => {
    document.title = "Manage Users - Snack Manager";
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <UsersManager />
    </div>
  );
};

export default ManageUsers;