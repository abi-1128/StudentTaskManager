import React from 'react';

const FilterBar = ({ filter, setFilter, sortBy, setSortBy }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center gap-2">
        <label className="text-sm font-semibold text-gray-700">Filter:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-semibold text-gray-700">Sort By:</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="createdAt">Date Created</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
