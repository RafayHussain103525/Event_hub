import { useNavigate } from 'react-router-dom';
import { useMyEvents, useDeleteEvent } from '../hooks/useEvents';
import EventList from '../components/events/EventList';
import { Link } from 'react-router-dom';

const MyEvents = () => {
  const { events, isLoading, error, refetch } = useMyEvents({ limit: 50 });
  const { deleteExistingEvent } = useDeleteEvent();
  const navigate = useNavigate();

  const handleDelete = async (event) => {
    if (window.confirm(`Are you sure you want to delete "${event.name}"? This cannot be undone.`)) {
      const result = await deleteExistingEvent(event.id);
      if (result.success) {
        refetch(); // Refresh the list
      } else {
        alert(result.error);
      }
    }
  };

  const handleEdit = (event) => {
    navigate(`/edit-event/${event.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">My Events</h1>
          <p className="text-gray-500">Events you've organized</p>
        </div>
        <Link to="/create-event" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + New Event
        </Link>
      </div>

      <EventList
        events={events}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        showOrganizerActions={true} 
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};
export default MyEvents;