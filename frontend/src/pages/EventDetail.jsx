import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEvent } from '../hooks/useEvents';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/common/Loading';
import ErrorDisplay from '../components/common/ErrorDisplay';
import { formatDateWithDay, getDaysUntil } from '../utils/formatDate';
import { useDeleteEvent } from '../hooks/useEvents';

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { event, isLoading, error } = useEvent(eventId);
  const { user, role, isAuthenticated } = useAuth();
  const { deleteExistingEvent } = useDeleteEvent();
  const handleDeleteEvent = async () => {
  if (window.confirm(`Delete "${event.name}"? This cannot be undone.`)) {
    const result = await deleteExistingEvent(event.id);
    if (result.success) {
      navigate('/my-events'); 
    } else {
      alert(result.error);
    }
  }
};
  if (isLoading) return <Loading message="Loading event details..." />;
  if (error) return <ErrorDisplay error={error} onRetry={() => navigate(0)} />;

  if (!event) {
    return <ErrorDisplay error="Event not found" />;
  }

  const daysUntil = getDaysUntil(event.date);
  const isOwner =
    isAuthenticated && role === 'organizer' && user?.id === event.organizer_id;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors mb-6"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>

      {/* Hero image */}
      <div className="h-64 md:h-80 bg-gradient-to-br from-primary-600/20 via-gray-900 to-gray-900 rounded-xl mb-8 overflow-hidden border border-gray-800">
        {event.poster_url ? (
          <img
            src={event.poster_url}
            alt={event.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-24 h-24 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Event info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-gray-100 capitalize mb-4">
            {event.name}
          </h1>

          <div className="flex items-center gap-4 mb-6 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {formatDateWithDay(event.date)}
            </span>
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="capitalize">{event.location}</span>
            </span>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-200 mb-3">
              About this event
            </h2>
            <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </div>
        </div>


        <div className="space-y-6">
          {daysUntil !== null && (
            <div className="bg-primary-600/10 border border-primary-500/30 rounded-xl p-6 text-center">
              <p className="text-3xl font-bold text-primary-400">
                {daysUntil === 0 ? 'Today!' : `${daysUntil}`}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {daysUntil === 0 ? 'Event is today' : 'days until event'}
              </p>
            </div>
          )}

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
              Organizer
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-sm font-bold">
                ?
              </div>
              <div>
                <p className="text-gray-200 font-medium">
                  Organizer #{event.organizer_id}
                </p>
                <Link
                  to={`/events?organizer=${event.organizer_id}`}
                  className="text-primary-400 hover:text-primary-300 text-sm"
                >
                  View all their events
                </Link>
              </div>
            </div>
          </div>

          {isOwner && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                Manage Event
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                You are the organizer of this event.
              </p>
              <button
                onClick={() => navigate(`/edit-event/${event.id}`)}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Edit Event
              </button>
                            <button
                onClick={handleDeleteEvent}
                className="w-full mt-2 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Delete Event
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;