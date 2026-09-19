import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../api/events', () => ({
  getAllEvents: vi.fn(),
  getEventById: vi.fn(),
  getMyEvents: vi.fn(),
  createEvent: vi.fn(),
}));

import { getAllEvents, getEventById, getMyEvents } from '../../api/events';
import {
  useEvents,
  useEvent,
  useMyEvents,
  useCreateEvent,
} from '../useEvents';
import { mockEvents, mockEvent } from '../../test/helpers';

describe('useEvents hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useEvents', () => {
    it('initially sets isLoading to true', () => {
      const { result } = renderHook(() => useEvents());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.events).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    it('fetches events on mount', async () => {
      getAllEvents.mockResolvedValue(mockEvents);

      const { result } = renderHook(() => useEvents());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.events).toEqual(mockEvents);
      expect(result.current.error).toBeNull();
      expect(getAllEvents).toHaveBeenCalledWith({});
    });

    it('sets error when API fails', async () => {
      const error = new Error('Network Error');
      error.response = { data: { detail: 'Failed to fetch' } };
      getAllEvents.mockRejectedValue(error);

      const { result } = renderHook(() => useEvents());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('Failed to fetch');
      expect(result.current.events).toEqual([]);
    });

    it('calls refetch to re-fetch events', async () => {
      getAllEvents.mockResolvedValue(mockEvents);

      const { result } = renderHook(() => useEvents());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      await result.current.refetch();

      expect(getAllEvents).toHaveBeenCalledTimes(2);
    });
  });

  describe('useEvent', () => {
    it('fetches single event by ID', async () => {
      getEventById.mockResolvedValue(mockEvent);

      const { result } = renderHook(() => useEvent(1));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.event).toEqual(mockEvent);
      expect(getEventById).toHaveBeenCalledWith(1);
    });

    it('does not fetch when eventId is undefined', async () => {
      const { result } = renderHook(() => useEvent(undefined));
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(getEventById).not.toHaveBeenCalled();
      expect(result.current.event).toBeNull();
    });

    it('sets error when event not found', async () => {
      const error = new Error('Not Found');
      error.response = { data: { detail: 'Event not found' } };
      getEventById.mockRejectedValue(error);

      const { result } = renderHook(() => useEvent(999));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('Event not found');
    });
  });

  describe('useMyEvents', () => {
    it('fetches my events', async () => {
      getMyEvents.mockResolvedValue(mockEvents);

      const { result } = renderHook(() => useMyEvents());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.events).toEqual(mockEvents);
    });
  });

  describe('useCreateEvent', () => {
    it('successfully creates event', async () => {
      const { createEvent } = await import('../../api/events');
      createEvent.mockResolvedValue(mockEvent);

      const { result } = renderHook(() => useCreateEvent());

      expect(result.current.isLoading).toBe(false);
      expect(result.current.success).toBe(false);
      const response = await result.current.createNewEvent({
        name: 'Test Event',
      });

      expect(response.success).toBe(true);
      expect(response.event).toEqual(mockEvent);
    });

    it('handles creation failure', async () => {
      const { createEvent } = await import('../../api/events');
      const error = new Error('Validation Error');
      error.response = { data: { detail: 'You have an Event with this name already' } };
      createEvent.mockRejectedValue(error);

      const { result } = renderHook(() => useCreateEvent());

      const response = await result.current.createNewEvent({
        name: 'Duplicate',
      });

      expect(response.success).toBe(false);
      expect(response.error).toBe('You have an Event with this name already');
    });
  });
});