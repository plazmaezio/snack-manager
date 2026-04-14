import React, { useState, useMemo } from "react";
import type { DishResponse, UserResponse, IngredientResponse } from "../types";

type ClassTypes = DishResponse | UserResponse | IngredientResponse;

interface CentralizedListProps<T extends ClassTypes> {
  data: T[];
  model: new (...args: any[]) => T;
  sortFields: (keyof T)[];
  defaultSortField?: keyof T;
  searchFields: (keyof T)[];
  renderCreateModal: (onClose: () => void) => React.ReactNode;
  renderEditModal: (item: T, onClose: () => void) => React.ReactNode;
  onDelete: (ids: string[]) => void;
}

type SortDirection = "asc" | "desc";

const CentralizedList = <T extends ClassTypes>({
  data,
  sortFields,
  defaultSortField,
  searchFields,
  renderCreateModal,
  renderEditModal,
  onDelete,
}: CentralizedListProps<T>) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof T | undefined>(
    defaultSortField,
  );
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);

  const getItemId = (item: T) => String((item as { id: string | number }).id);

  const tableFields = useMemo(() => {
    const fieldNames = new Set<string>();

    data.forEach((item) => {
      Object.keys(item).forEach((field) => fieldNames.add(field));
    });

    return Array.from(fieldNames).filter((field) => field !== "id");
  }, [data]);

  const processedData = useMemo(() => {
    let result = [...data];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((item) =>
        searchFields.some((field) => {
          const value = item[field];
          return String(value ?? "")
            .toLowerCase()
            .includes(q);
        }),
      );
    }

    if (sortField) {
      result.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];

        if (aVal === bVal) return 0;

        const comparison = aVal < bVal ? -1 : 1;
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [data, searchQuery, searchFields, sortField, sortDirection]);

  const handleSortFieldChange = (field: keyof T) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const isAllSelected =
    processedData.length > 0 &&
    processedData.every((item) => selectedIds.has(getItemId(item)));

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(processedData.map((item) => getItemId(item))));
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleDelete = () => {
    if (selectedIds.size === 0) return;

    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${selectedIds.size} item${selectedIds.size > 1 ? "s" : ""}?`,
    );

    if (!isConfirmed) return;

    onDelete(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const handleOpenCreate = () => setIsCreateModalOpen(true);
  const handleCloseCreate = () => setIsCreateModalOpen(false);

  const handleOpenEdit = (item: T) => setEditingItem(item);
  const handleCloseEdit = () => setEditingItem(null);

  return (
    <>
      <div className="rounded-3xl border border-ui-border bg-main-bg/90 p-4 md:p-6 shadow-[0px_0px_10px_0px] shadow-black/10 dark:shadow-black/30 backdrop-blur-sm">
        {/* Search bar */}
        <div className="mb-4">
          <label
            className="mb-2 block text-sm font-medium text-main-text"
            htmlFor="centralized-list-search"
          >
            Search
          </label>
          <input
            id="centralized-list-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full rounded-full border border-ui-border bg-(--input-bg) px-4 py-2.5 text-main-text outline-none transition focus:border-brand"
          />
        </div>

        {/* Sort controls */}
        <div className="mb-4 flex flex-wrap gap-2">
          {sortFields.map((field) => (
            <button
              key={String(field)}
              onClick={() => handleSortFieldChange(field)}
              className="rounded-full border border-ui-border bg-(--input-bg) px-4 py-2 text-sm font-medium text-main-text transition hover:border-brand hover:text-brand"
            >
              {String(field)}
              {sortField === field
                ? sortDirection === "asc"
                  ? " ▲"
                  : " ▼"
                : ""}
            </button>
          ))}
        </div>

        {/* Toolbar: create + bulk delete */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <button
            onClick={handleOpenCreate}
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 active:scale-95"
          >
            Create
          </button>
          {selectedIds.size > 0 && (
            <button
              onClick={handleDelete}
              className="rounded-full border border-red-500/40 bg-red-500/10 px-5 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-500/15 dark:text-red-300"
            >
              Delete ({selectedIds.size})
            </button>
          )}
        </div>

        {/* List */}
        <div className="overflow-hidden rounded-2xl border border-ui-border bg-(--input-bg)">
          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed border-collapse text-left text-sm text-main-text">
              <thead className="bg-main-bg/70 text-xs uppercase tracking-[0.18em] text-heading">
                <tr>
                  <th className="w-14 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      className="h-4 w-4 accent-brand"
                      aria-label="Select all rows"
                    />
                  </th>
                  {tableFields.map((field) => (
                    <th
                      key={field}
                      className="px-4 py-3 font-semibold capitalize"
                    >
                      {field}
                    </th>
                  ))}
                  <th className="w-32 px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {processedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={tableFields.length + 2}
                      className="px-4 py-8 text-center text-main-text"
                    >
                      No results found.
                    </td>
                  </tr>
                ) : (
                  processedData.map((item) => {
                    const id = getItemId(item);
                    const isSelected = selectedIds.has(id);

                    return (
                      <tr
                        key={id}
                        className="border-t border-ui-border/70 transition hover:bg-main-bg/60"
                      >
                        <td className="px-4 py-4 align-middle">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectItem(id)}
                            className="h-4 w-4 accent-brand"
                            aria-label={`Select row ${id}`}
                          />
                        </td>

                        {tableFields.map((field) => (
                          <td key={field} className="px-4 py-4 align-middle">
                            <span
                              className="block truncate text-main-text"
                              title={String(item[field as keyof T] ?? "")}
                            >
                              {String(item[field as keyof T] ?? "")}
                            </span>
                          </td>
                        ))}

                        <td className="px-4 py-4 align-middle">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="rounded-full border border-ui-border bg-main-bg px-4 py-2 text-sm font-medium text-main-text transition hover:border-brand hover:text-brand"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create modal */}
      {isCreateModalOpen && renderCreateModal(handleCloseCreate)}

      {/* Edit modal */}
      {editingItem && renderEditModal(editingItem, handleCloseEdit)}
    </>
  );
};

export default CentralizedList;
