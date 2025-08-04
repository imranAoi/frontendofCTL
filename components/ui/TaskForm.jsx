import React, { useState } from 'react';
import CalendarPopup from './CalendarPopup';
import PrioritySelector from './PrioritySelector';
import ReminderInput from './ReminderInput';

export default function TaskForm() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [priority, setPriority] = useState(4);
  const [reminder, setReminder] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const task = {
      title,
      dueDate: date,
      priority,
      reminder
    };
    console.log('Task Added:', task);
    // Optionally: send to backend or update state
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white shadow-md max-w-md mx-auto space-y-4 rounded"
    >
      <input
        type="text"
        placeholder="Task name"
        className="border rounded w-full p-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <div className="flex gap-3 items-center">
        <CalendarPopup selectedDate={date} setSelectedDate={setDate} />
        <PrioritySelector selected={priority} onChange={setPriority} />
        <ReminderInput reminderTime={reminder} setReminderTime={setReminder} />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          className="bg-rose-400 text-white px-4 py-1 rounded"
        >
          Add Task
        </button>
      </div>
    </form>
  );
}
