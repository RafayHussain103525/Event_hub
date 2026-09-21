import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
  },
  },
}));

import apiClient from '../client';
import {
  getAllEvents,
  getEventById,
  getEventByName,
  getEventsByLocation,
  getEventsByDateRange,
  getEventsByOrganizerName,
  getMyEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../events';
import { mockEvents } from '../../test/helpers';

describe('events API functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllEvents', () => {
    it('calls GET /events/all_events with default params', async () => {
      apiClient.get.mockResolvedValue({ data: mockEvents });

      await getAllEvents();

      expect(apiClient.get).toHaveBeenCalledWith('/events/all_events', {
        params: { limit: 10, offset: 0 },
      });
    });

    it('accepts custom limit and offset', async () => {
      apiClient.get.mockResolvedValue({ data: mockEvents });

      await getAllEvents({ limit: 25, offset: 50 });

      expect(apiClient.get).toHaveBeenCalledWith('/events/all_events', {
        params: { limit: 25, offset: 50 },
      });
    });

    it('returns response data', async () => {
      apiClient.get.mockResolvedValue({ data: mockEvents });

      const result = await getAllEvents();
      expect(result).toEqual(mockEvents);
    });
  });

  describe('getEventById', () => {
    it('calls GET /events/:id', async () => {
      apiClient.get.mockResolvedValue({ data: mockEvents[0] });

      await getEventById(1);

      expect(apiClient.get).toHaveBeenCalledWith('/events/1');
    });

    it('propagates 404 error', async () => {
      const error = new Error('Not Found');
      error.response = { status: 404, data: { detail: 'Event not found' } };
      apiClient.get.mockRejectedValue(error);

      await expect(getEventById(999)).rejects.toThrow();
    });
  });

  describe('getEventByName', () => {
    it('encodes event name in URL', async () => {
      apiClient.get.mockResolvedValue({ data: mockEvents[0] });

      await getEventByName('tech conference 2025');

      expect(apiClient.get).toHaveBeenCalledWith(
        '/events/name/tech%20conference%202025'
      );
    });
  });

  describe('getEventsByLocation', () => {
    it('encodes location in URL', async () => {
      apiClient.get.mockResolvedValue({ data: mockEvents });

      await getEventsByLocation('New York');

      expect(apiClient.get).toHaveBeenCalledWith(
        '/events/location/New%20York',
        { params: { limit: 10, offset: 0 } }
      );
    });
  });

  describe('getEventsByDateRange', () => {
    it('calls GET /events/date_range/:start/:end', async () => {
      apiClient.get.mockResolvedValue({ data: mockEvents });

      await getEventsByDateRange('2025-01-01', '2025-12-31');

      expect(apiClient.get).toHaveBeenCalledWith(
        '/events/date_range/2025-01-01/2025-12-31',
        { params: { limit: 10, offset: 0 } }
      );
    });
  });

  describe('getEventsByOrganizerName', () => {
    it('encodes organizer name', async () => {
      apiClient.get.mockResolvedValue({ data: mockEvents });

      await getEventsByOrganizerName('Tech Events PK');

      expect(apiClient.get).toHaveBeenCalledWith(
        '/events/event_organizer_name/Tech%20Events%20PK',
        { params: { limit: 10, offset: 0 } }
      );
    });
  });

  describe('getMyEvents', () => {
    it('calls GET /events/my_events', async () => {
      apiClient.get.mockResolvedValue({ data: mockEvents });

      await getMyEvents();

      expect(apiClient.get).toHaveBeenCalledWith('/events/my_events', {
        params: { limit: 10, offset: 0 },
      });
    });
  });

  describe('createEvent', () => {
    it('calls POST /events/ with event data', async () => {
      const eventData = {
        name: 'New Event',
        date: '2025-12-01',
        location: 'Karachi',
        description: 'Description',
        image_url: null,
      };

      const createdEvent = { id: 99, ...eventData, organizer_id: 1 };
      apiClient.post.mockResolvedValue({ data: createdEvent });

      const result = await createEvent(eventData);

      expect(apiClient.post).toHaveBeenCalledWith('/events/', eventData);
      expect(result).toEqual(createdEvent);
    });
  });

  describe('updateEvent', () => {
    it('calls PATCH /events/:id', async () => {
      const updateData = { name: 'Updated Name' };
      apiClient.patch.mockResolvedValueOnce({ data: { id: 1, ...updateData } });

      await updateEvent(1, updateData);

      expect(apiClient.patch).toHaveBeenCalledWith('/events/1', updateData);
    });
  });

  describe('deleteEvent', () => {
    it('calls DELETE /events/:id', async () => {
      apiClient.delete.mockResolvedValue({ data: { success: true } });

      await deleteEvent(1);

      expect(apiClient.delete).toHaveBeenCalledWith('/events/delete/1');
    });
  });
});