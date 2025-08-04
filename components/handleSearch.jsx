import { useState } from "react";

function AddFriendModal({ open, onClose, users }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    // Your search logic here
    alert(`Searching for: ${searchTerm}`);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[800px] h-[500px] shadow-lg flex relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl">✕</button>

        {/* Left: Sidebar with Users */}
        <div className="w-1/3 border-r p-4 overflow-y-auto">
          <h2 className="font-bold text-lg mb-2">All Users</h2>
          <ul className="space-y-2">
            {users.map((user, idx) => (
              <li key={idx} className="bg-gray-100 p-2 rounded hover:bg-gray-200">
                {user}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Search */}
        <div className="w-2/3 p-6">
          <h2 className="font-bold text-lg mb-4">Search by Name or Task</h2>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
            placeholder="Enter name or task"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Search
          </button>

          {/* Results placeholder */}
          <div className="mt-6 text-gray-500">Search results will appear here...</div>
        </div>
      </div>
    </div>
  );
}
export default AddFriendModal;