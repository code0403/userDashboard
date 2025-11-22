import { useStore } from "../lib/store";


export default function ActivityLog() {
  const activityLog = useStore((state) => state.activityLog);

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded shadow max-w-md">
      <h3 className="font-bold mb-2">Activity Log</h3>
      <ul className="list-disc pl-5 space-y-1">
        {activityLog.map((log, idx) => (
          <li key={idx}>{log}</li>
        ))}
      </ul>
    </div>
  );
}
