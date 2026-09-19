import { useMyEvents } from '../hooks/useEvents';
import EventList from '../components/events/EventList';
import { Link } from 'react-router-dom';

const MyEvents = () => {
  const { events, isLoading, error, refetch } = useMyEvents({ limit: 50 });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">My Events</h1>
          <p className="text-gray-500">Events you've organized</p>
        </div>
        <Link
          to="/create-event"
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + New Event
        </Link>
      </div>

      <EventList
        events={events}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
      />
    </div>
  );
};

export default MyEvents;