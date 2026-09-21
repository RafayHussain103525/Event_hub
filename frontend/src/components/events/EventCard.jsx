import { Link } from 'react-router-dom';
import { formatDate, getDaysUntil } from '../../utils/formatDate';

const EventCard = ({ event, isOrganizer, onEdit, onDelete }) => {
  const daysUntil = getDaysUntil(event.date);

  return (
    <div className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-200 flex flex-col">
      {/* Wrap the clickable part in Link, leave buttons outside */}
      <Link to={`/events/${event.id}`} className="block flex-1">
        <div className="h-48 bg-gradient-to-br from-primary-600/20 via-gray-900 to-gray-900 relative">
          {event.poster_url ? (
            <img src={event.poster_url} alt={event.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
          )}
          {daysUntil !== null && daysUntil <= 7 && (
            <div className="absolute top-3 right-3 bg-primary-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              {daysUntil === 0 ? 'Today' : `${daysUntil}d left`}
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-100 group-hover:text-primary-400 transition-colors capitalize">{event.name}</h3>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <span>📅 {formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <span>📍 <span className="capitalize">{event.location}</span></span>
            </div>
          </div>
          <p className="mt-3 text-gray-500 text-sm line-clamp-2">{event.description}</p>
        </div>
      </Link>

      {/* ✅ Organizer Action Buttons */}
      {isOrganizer && (
        <div className="flex border-t border-gray-800">
          <button 
             onClick={(e) => { e.preventDefault(); onEdit(event); }}
             className="flex-1 py-3 text-sm font-medium text-blue-400 hover:bg-blue-500/10 transition-colors flex items-center justify-center gap-2 border-r border-gray-800"
          >
             ✏️ Edit
          </button>
          <button 
             onClick={(e) => { e.preventDefault(); onDelete(event); }}
             className="flex-1 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
          >
             🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
};
export default EventCard;