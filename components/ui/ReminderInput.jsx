import React from 'react';

export default function ReminderInput({ selected, onSelect }) {
  return (
    <div className="flex items-center gap-2">
      ⏰
      <input
        type="datetime-local"
        value={selected || ""}
        onChange={(e) => onSelect(e.target.value)}
        className="border rounded p-1"
      />
    </div>
  );
}
