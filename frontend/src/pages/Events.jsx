import { useState, useCallback } from 'react';
import { useEvents } from '../hooks/useEvents';
import EventList from '../components/events/EventList';
import EventFilters from '../components/events/EventFilters';
import { getEventsByLocation, getEventsByDateRange } from '../api/events';

const Events = () => {
  const [filteredEvents, setFilteredEvents] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const { events, isLoading, error, refetch } = useEvents({ limit: 50 });

  const handleSearch = useCallback(async (filters) => {
    setIsSearching(true);
    setSearchError(null);
    setActiveFilters(filters);

    try {
      let results = [];

      if (filters.location && filters.startDate && filters.endDate) {
        // Both location and date range — fetch by location, then filter client-side by date
        results = await getEventsByLocation(filters.location, { limit: 50 });
        const start = new Date(filters.startDate);
        const end = new Date(filters.endDate);
        results = results.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= start && eventDate <= end;
        });
      } else if (filters.location) {
        results = await getEventsByLocation(filters.location, { limit: 50 });
      } else if (filters.startDate && filters.endDate) {
        results = await getEventsByDateRange(
          filters.startDate,
          filters.endDate,
          { limit: 50 }
        );
      }

      setFilteredEvents(results);
    } catch (err) {
      setSearchError(err.response?.data?.detail || 'Failed to search events');
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleClear = useCallback(() => {
    setFilteredEvents(null);
    setActiveFilters({});
    setSearchError(null);
  }, []);

  const displayEvents = filteredEvents !== null ? filteredEvents : events;
  const displayLoading = filteredEvents !== null ? isSearching : isLoading;
  const displayError = filteredEvents !== null ? searchError : error;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Browse Events</h1>
        <p className="text-gray-500">Discover upcoming events near you</p>
      </div>

      <EventFilters
        onSearch={handleSearch}
        onClear={handleClear}
        isSearching={isSearching}
        activeFilters={activeFilters}
      />

      {filteredEvents !== null && (
        <p className="text-sm text-gray-500 mb-4">
          Found {filteredEvents.length} event(s)
        </p>
      )}

      <EventList
        events={displayEvents}
        isLoading={displayLoading}
        error={displayError}
        onRetry={refetch}
      />
    </div>
  );
};

export default Events;