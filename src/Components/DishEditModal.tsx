import type { DishRequest } from "../types";

type DishEditModalProps = {
  initialValues: DishRequest;
  onSubmit: (values: DishRequest) => void;
  onClose: () => void;
};

export const DishEditModal = ({
  initialValues: _initialValues,
  onSubmit: _onSubmit,
  onClose,
}: DishEditModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-main-bg/70 px-4 py-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-ui-border bg-main-bg p-5 text-left shadow-xl">
        <h2 className="mb-2 text-2xl font-semibold text-heading">Edit dish</h2>
        <p className="mb-6 text-sm text-main-text">
          TODO: implement dish edit form.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full border border-ui-border bg-(--input-bg) px-5 py-2.5 text-sm font-medium text-main-text transition hover:border-brand hover:text-brand"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
