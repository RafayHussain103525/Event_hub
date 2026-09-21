import { useParams, useNavigate } from 'react-router-dom';
import { useEvent } from '../hooks/useEvents';
import EventForm from '../components/events/EventForm';
import Loading from '../components/common/Loading';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { event, isLoading, error } = useEvent(id);

  const handleSuccess = (updatedEvent) => {
    navigate(`/events/${updatedEvent.id}`);
  };

  if (isLoading) return <Loading message="Loading event..." />;
  if (error || !event) return <div className="text-center text-red-400 py-10">Failed to load event.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Edit Event</h1>
        <p className="text-gray-500">Update the details for your event</p>
      </div>
      <EventForm onSuccess={handleSuccess} initialData={event} eventId={id} />
    </div>
  );
};
export default EditEvent;