// components/ui/CalendarPopup.jsx
"use client";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CalendarPopup({ onSelectDate, onClose }) {
  const [startDate, setStartDate] = useState(new Date());

  const handleDateChange = (date) => {
    setStartDate(date);
    onSelectDate(date);
    onClose();
  };

  return (
    <div className="absolute mt-2 z-50 bg-white border rounded shadow-lg p-4 w-80">
      <DatePicker
        inline
        selected={startDate}
        onChange={handleDateChange}
        calendarStartDay={1}
      />
      <div className="flex justify-between mt-4 text-sm">
        <button
          onClick={() => handleDateChange(new Date())}
          className="text-blue-500 hover:underline"
        >
          Today
        </button>
        <button
          onClick={() =>
            handleDateChange(new Date(Date.now() + 86400000))
          }
          className="text-blue-500 hover:underline"
        >
          Tomorrow
        </button>
        <button
          onClick={() =>
            handleDateChange(new Date(Date.now() + 3 * 86400000))
          }
          className="text-blue-500 hover:underline"
        >
          This Weekend
        </button>
      </div>
    </div>
  );
}
