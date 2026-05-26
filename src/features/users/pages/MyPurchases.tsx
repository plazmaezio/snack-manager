import { useEffect } from "react";
import UserPurchasesManager from "../components/UserPurchasesManager";

const MyPurchases = () => {
  useEffect(() => {
    document.title = "My Purchases - Snack Manager";
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <UserPurchasesManager />
    </div>
  );
};

export default MyPurchases;