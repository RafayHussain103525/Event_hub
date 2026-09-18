import apiClient from './client';

export const getAllEvents = async (params = {}) => {
  const { limit = 10, offset = 0 } = params;
  const response = await apiClient.get('/events/all_events', {
    params: { limit, offset }
  });
  return response.data;
};

export const getEventById = async (eventId) => {
  const response = await apiClient.get(`/events/${eventId}`);
  return response.data;
};

export const getEventByName = async (eventName) => {
  const response = await apiClient.get(`/events/name/${encodeURIComponent(eventName)}`);
  return response.data;
};

export const getEventsByLocation = async (location, params = {}) => {
  const { limit = 10, offset = 0 } = params;
  const response = await apiClient.get(`/events/location/${encodeURIComponent(location)}`, {
    params: { limit, offset }
  });
  return response.data;
};

export const getEventsByDateRange = async (startDate, endDate, params = {}) => {
  const { limit = 10, offset = 0 } = params;
  const response = await apiClient.get(`/events/date_range/${startDate}/${endDate}`, {
    params: { limit, offset }
  });
  return response.data;
};

export const getEventsByOrganizerName = async (organizerName, params = {}) => {
  const { limit = 10, offset = 0 } = params;
  const response = await apiClient.get(`/events/event_organizer_name/${encodeURIComponent(organizerName)}`, {
    params: { limit, offset }
  });
  return response.data;
};

export const getMyEvents = async (params = {}) => {
  const { limit = 10, offset = 0 } = params;
  const response = await apiClient.get('/events/my_events', {
    params: { limit, offset }
  });
  return response.data;
};

export const createEvent = async (eventData) => {
  const response = await apiClient.post('/events/', eventData);
  return response.data;
};

export const updateEvent = async (eventId, eventData) => {
  const response = await apiClient.put(`/events/${eventId}`, eventData);
  return response.data;
};

export const deleteEvent = async (eventId) => {
  const response = await apiClient.delete(`/events/${eventId}`);
  return response.data;
};