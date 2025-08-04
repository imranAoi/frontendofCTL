import React, { useState } from "react";

const priorities = [
  { level: 1, label: "Priority 1", color: "bg-red-500" },
  { level: 2, label: "Priority 2", color: "bg-orange-400" },
  { level: 3, label: "Priority 3", color: "bg-blue-500" },
  { level: 4, label: "Priority 4", color: "bg-gray-400" },
];

export default function PrioritySelector({ selected, onChange }) {
  const [open, setOpen] = useState(false);
  const selectedPriority = priorities.find((p) => p.level === selected);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="border px-3 py-1 rounded bg-white flex items-center gap-2"
      >
        🚩 {selectedPriority?.label || "Priority"}
      </button>

      {open && (
        <div className="absolute top-10 bg-white shadow rounded w-40 z-20">
          {priorities.map((p) => (
            <div
              key={p.level}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                onChange(p.level);
                setOpen(false);
              }}
            >
              <span className={`w-3 h-3 rounded-full ${p.color}`} />
              {p.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
