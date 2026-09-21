import EventCard from './EventCard';
import Loading from '../common/Loading';
import ErrorDisplay from '../common/ErrorDisplay';
import EmptyState from '../common/EmptyState';
import { Link } from 'react-router-dom';

const EventList = ({ events, isLoading, error, onRetry, showOrganizerActions, onEdit, onDelete }) => {
  if (isLoading) return <Loading message="Loading events..." />;
  if (error) return <ErrorDisplay error={error} onRetry={onRetry} />;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard 
          key={event.id} 
          event={event} 
          isOrganizer={showOrganizerActions}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
export default EventList;
