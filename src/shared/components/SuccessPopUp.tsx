import { useEffect, useState } from "react";

interface SuccessPopUpProps {
  message: string;
  subMessage?: string;
  onClose: () => void;
}

const SuccessPopUp = ({ message, subMessage, onClose }: SuccessPopUpProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed z-50 transition-all duration-300
        bottom-4 left-4 right-4
        md:bottom-auto md:top-4 md:left-auto md:right-4 md:w-80
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 md:-translate-y-2"}
      `}
    >
      <div className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md">
        <div className="flex items-start">
          <div className="py-1">
            <svg
              className="fill-current h-6 w-6 text-teal-500 mr-4 shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-bold">{message}</p>
            {subMessage && <p className="text-sm">{subMessage}</p>}
          </div>
          <button
            onClick={() => {
              setVisible(false);
              setTimeout(onClose, 300);
            }}
            className="ml-4 text-teal-700 hover:text-teal-900 font-bold text-lg leading-none"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPopUp;
