import { useState } from 'react';
import { useCreateEvent } from '../../hooks/useEvents';

const EventForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    description: '',
    image_url: '',
  });
  const [formError, setFormError] = useState('');

  const { createNewEvent, isLoading } = useCreateEvent();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name || !formData.date || !formData.location || !formData.description) {
      setFormError('Please fill in all required fields');
      return;
    }

    if (formData.name.length > 100) {
      setFormError('Event name must be under 100 characters');
      return;
    }

    if (formData.description.length > 500) {
      setFormError('Description must be under 500 characters');
      return;
    }

    const payload = {
      name: formData.name,
      date: formData.date,
      location: formData.location,
      description: formData.description,
      image_url: formData.image_url || null,
      
    };

    const result = await createNewEvent(payload);

    if (result.success) {
      
      setFormData({
        name: '',
        date: '',
        location: '',
        description: '',
        image_url: '',
      });
      if (onSuccess) onSuccess(result.event);
    } else {
      setFormError(result.error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-100 mb-6">Create Event</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Event Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Karachi Tech Summit 2025"
              maxLength={100}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Karachi"
                maxLength={200}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your event..."
              rows={4}
              maxLength={500}
              required
            />
            <p className="mt-1 text-xs text-gray-600">
              {formData.description.length}/500 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Poster URL <span className="text-gray-600">(optional)</span>
            </label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/poster.jpg"
            />
          </div>

          {formError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 text-sm">{formError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-600/50 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            {isLoading ? 'Creating...' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventForm;