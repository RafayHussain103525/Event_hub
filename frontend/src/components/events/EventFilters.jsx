import { useState } from 'react';

const EventFilters = ({ onSearch, onClear, isSearching, activeFilters }) => {
  const [location, setLocation] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const filters = {};
    if (location.trim()) filters.location = location.trim();
    if (dateRange.start && dateRange.end) {
      filters.startDate = dateRange.start;
      filters.endDate = dateRange.end;
    }
    onSearch(filters);
  };

  const handleClear = () => {
    setLocation('');
    setDateRange({ start: '', end: '' });
    onClear();
  };

  const hasActiveFilters = Object.keys(activeFilters || {}).length > 0;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div>
            <label htmlFor="filter-location" className="block text-sm font-medium text-gray-300 mb-1">
              Location
            </label>
            <input
              id="filter-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Karachi"
            />
          </div>

          <div>
            <label htmlFor="filter-start-date" className="block text-sm font-medium text-gray-300 mb-1">
              From Date
            </label>
            <input
              id="filter-start-date"
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="filter-end-date" className="block text-sm font-medium text-gray-300 mb-1">
              To Date
            </label>
            <input
              id="filter-end-date"
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              min={dateRange.start}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSearching}
            className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-600/50 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClear}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-2 rounded-lg font-medium transition-colors border border-gray-700"
            >
              Clear Filters
            </button>
          )}
        </div>
      </form>

      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {activeFilters.location && (
            <span className="bg-primary-600/20 text-primary-400 text-xs font-medium px-3 py-1 rounded-full">
              📍 {activeFilters.location}
            </span>
          )}
          {activeFilters.startDate && activeFilters.endDate && (
            <span className="bg-primary-600/20 text-primary-400 text-xs font-medium px-3 py-1 rounded-full">
              📅 {activeFilters.startDate} → {activeFilters.endDate}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default EventFilters;