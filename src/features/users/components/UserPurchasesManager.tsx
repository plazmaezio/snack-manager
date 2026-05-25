import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CentralizedList from "../../../shared/components/CentralizedList";
import { fetchUserByIdService } from "../services/userService";
import {
  deletePurchase,
  getPurchases,
  getPurchasesByDate,
  getPurchasesByClientId,
} from "../../cart/services/purchaseService";
import type { PurchaseResponse } from "../../cart/types/purchase.types";

class PurchaseModel implements PurchaseResponse {
  id = "";
  clientUsername = "";
  dishName = "";
  date = "";
}

const formatPurchaseDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

const UserPurchasesManager = () => {
  const { clientId } = useParams();
  const [purchases, setPurchases] = useState<PurchaseResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [clientUsername, setClientUsername] = useState("");

  useEffect(() => {
    const loadClientUsername = async () => {
      if (!clientId) {
        setClientUsername("");
        return;
      }

      try {
        const user = await fetchUserByIdService(clientId);
        setClientUsername(user.username);
      } catch {
        setClientUsername(clientId);
      }
    };

    loadClientUsername();
  }, [clientId]);

  useEffect(() => {
    const loadPurchases = async () => {
      setLoading(true);

      try {
        const data = selectedDate
          ? await getPurchasesByDate(selectedDate)
          : clientId
            ? await getPurchasesByClientId(clientId)
            : await getPurchases();
        setPurchases(data);
        setError(null);
      } catch {
        setError(
          selectedDate
            ? "Failed to load purchases for the selected date"
            : clientId
            ? "Failed to load client purchases"
            : "Failed to load purchases",
        );
      } finally {
        setLoading(false);
      }
    };

    loadPurchases();
  }, [clientId, selectedDate]);

  const handleDateChange = (value: string) => {
    setSelectedDate(value);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-ui-border bg-main-bg/90 p-4">
        <label
          htmlFor="purchase-date-filter"
          className="mb-2 block text-sm font-medium text-main-text"
        >
          Filter by date
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            id="purchase-date-filter"
            type="date"
            value={selectedDate}
            onChange={(event) => handleDateChange(event.target.value)}
            className="w-full rounded-full border border-ui-border bg-(--input-bg) px-4 py-2.5 text-main-text outline-none transition focus:border-brand sm:max-w-xs"
          />
          <button
            type="button"
            onClick={() => setSelectedDate("")}
            className="rounded-full border border-ui-border bg-main-bg px-5 py-2.5 text-sm font-medium text-main-text transition hover:border-brand hover:text-brand"
          >
            Clear date
          </button>
        </div>
      </div>

      {(loading || error) && (
        <div className="rounded-2xl border border-ui-border bg-(--input-bg) px-4 py-3 text-sm text-main-text">
          {loading && (
            <span>
              {selectedDate
                ? "Loading purchases for date..."
                : clientId
                  ? "Loading client purchases..."
                  : "Loading purchases..."}
            </span>
          )}
          {error && (
            <span className={loading ? "ml-3 text-red-500" : "text-red-500"}>
              {error}
            </span>
          )}
        </div>
      )}

      {clientId && !selectedDate && (
        <div className="rounded-2xl border border-ui-border bg-(--input-bg) px-4 py-3 text-sm text-main-text">
          Showing purchases for {clientUsername || "this client"}
        </div>
      )}

      {selectedDate && (
        <div className="rounded-2xl border border-ui-border bg-(--input-bg) px-4 py-3 text-sm text-main-text">
          Showing purchases for date: {selectedDate}
        </div>
      )}

      <CentralizedList
        data={purchases}
        model={PurchaseModel}
        sortFields={["date", "clientUsername", "dishName"]}
        defaultSortField="date"
        searchFields={["clientUsername", "dishName", "date"]}
        fieldFormatters={{
          date: (value) => formatPurchaseDate(String(value ?? "")),
        }}
        onDelete={async (ids) => {
          await Promise.all(ids.map((id) => deletePurchase(id)));
          setPurchases((current) => current.filter((item) => !ids.includes(item.id)));
        }}
      />
    </div>
  );
};

export default UserPurchasesManager;
