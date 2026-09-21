import { useState, useEffect, useCallback } from 'react';
import { getAllEvents, getEventById, getMyEvents, createEvent, updateEvent, deleteEvent } from '../api/events';

export const useEvents = (params = {}) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await getAllEvents(params);
      setEvents(data);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch events';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [params.limit, params.offset]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    isLoading,
    error,
    refetch: fetchEvents,
  };
};

export const useEvent = (eventId) => {
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await getEventById(eventId);
        setEvent(data);
      } catch (err) {
        const errorMessage = err.response?.data?.detail || 'Failed to fetch event';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvent();
  }, [eventId]);

  return {
    event,
    isLoading,
    error,
  };
};

export const useMyEvents = (params = {}) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await getMyEvents(params);
      setEvents(data);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch your events';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [params.limit, params.offset]);

  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents]);

  return {
    events,
    isLoading,
    error,
    refetch: fetchMyEvents,
  };
};

export const useCreateEvent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createNewEvent = useCallback(async (eventData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);
      
      const data = await createEvent(eventData);
      setSuccess(true);
      
      return { success: true, event: data };
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to create event';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createNewEvent,
    isLoading,
    error,
    success,
  };
};

export const useUpdateEvent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateExistingEvent = useCallback(async (eventId, eventData) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await updateEvent(eventId, eventData);
      return { success: true, event: data };
    } catch (err) {
      const detail = err.response?.data?.detail;
      const errorMessage = Array.isArray(detail) ? detail.map(e => e.msg).join(', ') : (detail || 'Failed to update event');
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { updateExistingEvent, isLoading, error };
  };

export const useDeleteEvent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteExistingEvent = useCallback(async (eventId) => {
    try {
      setIsLoading(true);
      setError(null);
      await deleteEvent(eventId);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to delete event';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { deleteExistingEvent, isLoading, error };
};