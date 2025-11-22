'use client';
import { Cross2Icon } from "@radix-ui/react-icons";
import { useStore } from "../lib/store";


export default function ActivitySidebar() {
  const isOpen = useStore((state) => state.isActivityOpen);
  const toggle = useStore((state) => state.toggleActivity);
  const activityLog = useStore((state) => state.activityLog);
  

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggle}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Activity Log</h2>
          <button onClick={toggle} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
            <Cross2Icon className="w-5 h-5 text-gray-800 dark:text-gray-100" />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          {activityLog.length === 0 ? (
            <p className="text-gray-700 dark:text-gray-300">No activity yet.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {activityLog
                .slice()
                .reverse()
                .map((entry, idx) => (
                  <li
                    key={idx}
                    className="text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-1"
                  >
                    {entry.message}
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
