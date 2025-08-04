"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../../../components/ProtectedRoute";
import OnboardingFlow from "../../../../components/Onboarding/OnboardingFlow";
import { useAuth } from "../../../../contexts/AuthContext";
import { Button } from "../../../../components/ui/button";
import AddFriendModal from "../../../../components/handleSearch";
import CalendarPopup from "../../../../components/ui/CalendarPopup";
import PrioritySelector from "../../../../components/ui/PrioritySelector";
import ReminderSelector from "../../../../components/ui/ReminderInput";
import { format } from "date-fns";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [selectedTab, setSelectedTab] = useState("Inbox");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [tasks, setTasks] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dueDate, setDueDate] = useState(null);
  const [priority, setPriority] = useState(null);
  const [reminder, setReminder] = useState(null);
  const NEXT_PUBLIC_BASE_URL = "http://localhost:8000/api";
  const dummyUsers = ["Alice", "Bob", "Charlie", "David", "Eve"];
  const tabs = [
    { name: "Inbox", badge: tasks.length },
    { name: "Today", badge: 2 },
    { name: "Upcoming", badge: 0 },
    { name: "Filters & Labels", badge: 0 },
    { name: "Completed", badge: 0 },
  ];

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${NEXT_PUBLIC_BASE_URL}/tasks`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (Array.isArray(data)) {
  const validTasks = data.filter(task => task && task._id);
  setTasks(validTasks);
} else {
  console.warn("Unexpected tasks format:", data);
  setTasks([]);
}
    } catch (error) {
      console.error("Error fetching tasks", error);
      setTasks([]);
    }
  };

  const handleAddTask = async () => {
    if (!taskTitle.trim()) return;

    const payload = { title: taskTitle, due: dueDate, priority, reminder };
    console.log("Creating task with:", payload);

    try {
      const res = await fetch(`${NEXT_PUBLIC_BASE_URL}/tasks`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Server Error:", error);
        return;
      }

      const newTask = await res.json();
      if (!Array.isArray(tasks)) setTasks([newTask]);
      else setTasks([...tasks, newTask]);

      setTaskTitle("");
      setDueDate(null);
      setPriority(null);
      setReminder(null);
      setShowTaskInput(false);
    } catch (error) {
      console.error("Error creating task", error);
    }
  };

  const handleToggleComplete = async (taskId) => {
    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;

    try {
      const res = await fetch(`${NEXT_PUBLIC_BASE_URL}/tasks/${taskId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });
      const updated = await res.json();
      setTasks(tasks.map((t) => (t._id === taskId ? updated : t)));
    } catch (error) {
      console.error("Error updating task", error);
    }
  };

const handleDeleteTask = async (taskId) => {
  try {
    const res = await fetch(`${NEXT_PUBLIC_BASE_URL}/tasks/${taskId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      let errorText = await res.text(); // Try to read plain response
      console.warn("Failed to delete on server:", errorText);
      return;
    }

    await fetchTasks(); // Re-fetch latest state
  } catch (error) {
    console.error("Error deleting task", error);
  }
};



  const handleUpdatePriority = async (taskId, newPriority) => {
    try {
      const res = await fetch(`${NEXT_PUBLIC_BASE_URL}/tasks/${taskId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority: newPriority }),
      });
      const updated = await res.json();
      setTasks(tasks.map((t) => (t._id === taskId ? updated : t)));
    } catch (error) {
      console.error("Error updating priority", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (user && !user.hasCompletedOnboarding) return <OnboardingFlow />;

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#fdfaf6]">
        {/* Sidebar */}
        <aside className="w-64 bg-[#fdfaf6] border-r p-4 flex flex-col">
          <div className="font-bold text-xl mb-6">
            {user?.displayName || "User"}
          </div>

          <Button
            className="mb-4 bg-red-500 hover:bg-red-600 text-white"
            onClick={() => setShowTaskInput(true)}
          >
            + Add task
          </Button>

          <nav className="flex flex-col space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                className={`text-left px-3 py-2 rounded ${
                  selectedTab === tab.name
                    ? "bg-orange-100 text-orange-600 font-semibold"
                    : "hover:bg-orange-50"
                }`}
                onClick={() => setSelectedTab(tab.name)}
              >
                {tab.name}
                {tab.badge > 0 && (
                  <span className="ml-2 text-xs bg-red-500 text-white rounded-full px-2 py-0.5">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-6 text-sm text-gray-500">My Projects</div>
          <button className="mt-2 text-left px-3 py-2 rounded hover:bg-orange-50">
            # Getting Started 👋
          </button>

          <div className="mt-auto space-y-2">
            <button className="text-sm text-gray-500 hover:text-gray-800">
              + Add a team
            </button>
            <button className="block text-sm text-gray-500 hover:text-gray-800">
              Help & resources
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              + Add Friend
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-10">
          <h1 className="text-2xl font-bold mb-4">{selectedTab}</h1>

          {/* Task Input */}
          {showTaskInput && (
            <div className="bg-white rounded-md shadow p-6 mb-6 relative">
              <input
                type="text"
                placeholder="Discuss thesis tomorrow morning p2"
                className="w-full border px-3 py-2 rounded mb-3"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />

              <div className="flex space-x-2 mb-4 relative">
                <div className="relative">
                  <Button
                    variant="outline"
                    onClick={() => setShowCalendar(!showCalendar)}
                  >
                    📅 {dueDate ? format(dueDate, "dd MMM yyyy") : "Date"}
                  </Button>
                  {showCalendar && (
                    <CalendarPopup
                      onSelectDate={(date) => {
                        setDueDate(date);
                        setShowCalendar(false);
                      }}
                      onClose={() => setShowCalendar(false)}
                    />
                  )}
                </div>

                <PrioritySelector
                  selected={priority}
                  onChange={(value) => setPriority(value)}
                />

                <ReminderSelector
                  selected={reminder}
                  onSelect={(value) => setReminder(value)}
                />
              </div>

              <div className="flex gap-2">
                <Button className="bg-red-500 text-white" onClick={handleAddTask}>
                  Add task
                </Button>
                <Button variant="ghost" onClick={() => setShowTaskInput(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Tasks */}
          {tasks.length > 0 ? (
            <ul className="space-y-3">
              {tasks.map((task) => (
                <li key={task._id} className="bg-white p-4 rounded shadow flex justify-between items-start">
                  <div>
                    <div className={`font-medium ${task.completed ? "line-through text-gray-400" : ""}`}>
                      {task.title}
                    </div>
                    <div className="text-sm text-gray-500 flex gap-4 mt-1">
                      {task.due && <span>📅 {format(task.due, "dd MMM yyyy")}</span>}
                      {task.priority && <span>🚩 Priority {task.priority}</span>}
                      {task.reminder && <span>⏰ {task.reminder}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task._id)}
                    />
                    <PrioritySelector
                      selected={task.priority}
                      onChange={(value) => handleUpdatePriority(task._id, value)}
                    />
                    <Button variant="outline" onClick={() => handleDeleteTask(task._id)}>
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            !showTaskInput && (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <img
                  src="/inbox-illustration.svg"
                  alt="Inbox Illustration"
                  className="mx-auto mb-6 w-40"
                />
                <h2 className="text-lg font-semibold">Capture now, plan later</h2>
                <p className="text-gray-600 mt-2 mb-6">
                  Inbox is your go-to spot for quick task entry. Clear your mind
                  now, organize when you’re ready.
                </p>
                <Button className="bg-red-500 text-white" onClick={() => setShowTaskInput(true)}>
                  + Add task
                </Button>
                <Button
                  className="bg-blue-500 text-white mt-4 ml-4"
                  onClick={() => setIsModalOpen(true)}
                >
                  + Add Friend
                </Button>
              </div>
            )
          )}
        </main>
      </div>

      <AddFriendModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        users={dummyUsers}
      />
    </ProtectedRoute>
  );
}
