import { useState, useEffect } from 'react';
import { useCreateEvent, useUpdateEvent } from '../../hooks/useEvents';

const EventForm = ({ onSuccess, initialData, eventId }) => {
  const isEditMode = !!eventId;
  const [formData, setFormData] = useState({
    name: '', date: '', location: '', description: '', image_url: '',
  });
  const [formError, setFormError] = useState('');

  const { createNewEvent, isLoading: isCreating } = useCreateEvent();
  const { updateExistingEvent, isLoading: isUpdating } = useUpdateEvent();
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        date: initialData.date || '', 
        location: initialData.location || '',
        description: initialData.description || '',
        image_url: initialData.poster_url || '', 
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name || !formData.date || !formData.location || !formData.description) {
      setFormError('Please fill in all required fields'); return;
    }

    const payload = { ...formData, image_url: formData.image_url || null };
    
    const result = isEditMode 
      ? await updateExistingEvent(eventId, payload) 
      : await createNewEvent(payload);

    if (result.success) {
      if (!isEditMode) {
         setFormData({ name: '', date: '', location: '', description: '', image_url: '' });
      }
      if (onSuccess) onSuccess(result.event);
    } else {
      setFormError(result.error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-100 mb-6">{isEditMode ? 'Update Event' : 'Create Event'}</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Event Name <span className="text-red-500">*</span></label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} maxLength={100} required className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
          {/* Date & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Date <span className="text-red-500">*</span></label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Location <span className="text-red-500">*</span></label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} maxLength={200} required className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-2" />
            </div>
          </div>
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description <span className="text-red-500">*</span></label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={4} maxLength={500} required className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-2" />
          </div>
          {/* Poster URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Poster URL <span className="text-gray-600">(optional)</span></label>
            <input type="url" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://images.unsplash.com/..." className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-2" />
          </div>

          {formError && (<div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3"><p className="text-red-400 text-sm">{formError}</p></div>)}

          <button type="submit" disabled={isLoading} className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-600/50 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition-colors">
            {isLoading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Event' : 'Create Event')}
          </button>
        </form>
      </div>
    </div>
  );
};
export default EventForm;