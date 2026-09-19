import { useNavigate } from 'react-router-dom';
import EventForm from '../components/events/EventForm';

const CreateEvent = () => {
  const navigate = useNavigate();

  const handleSuccess = (event) => {
    navigate(`/events/${event.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Create Event</h1>
        <p className="text-gray-500">
          Fill in the details to publish your event
        </p>
      </div>

      <EventForm onSuccess={handleSuccess} />
    </div>
  );
};

export default CreateEvent;