import EventCard from './EventCard';
import Loading from '../common/Loading';
import ErrorDisplay from '../common/ErrorDisplay';
import EmptyState from '../common/EmptyState';
import { Link } from 'react-router-dom';

const EventList = ({ events, isLoading, error, onRetry }) => {
  if (isLoading) return <Loading message="Loading events..." />;
  if (error) return <ErrorDisplay error={error} onRetry={onRetry} />;

  if (!events || events.length === 0) {
    return (
      <EmptyState
        title="No events found"
        message="There are no upcoming events at the moment. Check back later or create your own event!"
        action={
          <Link
            to="/create-event"
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Create an Event
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventList;