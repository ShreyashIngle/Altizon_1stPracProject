import React, { useEffect, useState } from "react";
import { subscribeToNotifications } from "../notification";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    subscribeToNotifications((data) => {
      const id = Date.now() + Math.random();
      setNotifications((prev) => [...prev, { ...data, id, removing: false }]);

      // Trigger removal animation after 2.5s
      setTimeout(() => {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, removing: true } : n))
        );
      }, 2500);

      // Remove from DOM after animation (0.5s)
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    });
  }, []);

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`bg-blue-600 text-white px-4 py-2 rounded shadow-lg min-w-[220px] transform transition-all duration-500 ease-in-out
            ${n.removing ? "translate-x-40 opacity-0" : "translate-x-0 opacity-100"}
          `}
        >
          <strong>{n.model}</strong>: {n.message}{" "}
          <small className="text-gray-200 text-sm">({n.at})</small>
        </div>
      ))}
    </div>
  );
}
