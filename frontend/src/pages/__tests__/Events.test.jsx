import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Events from '../Events';

vi.mock('../../api/events', () => ({
  getAllEvents: vi.fn(),
  getEventsByLocation: vi.fn(),
  getEventsByDateRange: vi.fn(),
}));

vi.mock('../../hooks/useEvents', () => ({
  useEvents: vi.fn(),
}));

import { useEvents } from '../../hooks/useEvents';
import { getEventsByLocation } from '../../api/events';
import { mockEvents } from '../../test/helpers';

const renderEventsPage = () => {
  return render(
    <BrowserRouter>
      <Events />
    </BrowserRouter>
  );
};

describe('Events Page', () => {
  const mockRefetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useEvents.mockReturnValue({
      events: mockEvents,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });
  });

  it('renders page title', () => {
    renderEventsPage();

    expect(screen.getByText(/browse events/i)).toBeInTheDocument();
  });

  it('renders search/filter component', () => {
    renderEventsPage();

    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/from date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/to date/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('renders event cards when data is loaded', () => {
    renderEventsPage();

    expect(screen.getByText(/tech conference/i)).toBeInTheDocument();
    expect(screen.getByText(/startup pitch/i)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    useEvents.mockReturnValue({
      events: [],
      isLoading: true,
      error: null,
      refetch: mockRefetch,
    });

    renderEventsPage();

    expect(screen.getByText(/loading events/i)).toBeInTheDocument();
  });

  it('shows error state', () => {
    useEvents.mockReturnValue({
      events: [],
      isLoading: false,
      error: 'Failed to fetch events',
      refetch: mockRefetch,
    });

    renderEventsPage();

    expect(screen.getByText(/failed to fetch events/i)).toBeInTheDocument();
  });

  it('filters events by location when search is used', async () => {
    const user = userEvent.setup();
    getEventsByLocation.mockResolvedValue([mockEvents[0]]);

    renderEventsPage();

    await user.type(screen.getByLabelText(/location/i), 'karachi');
    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(getEventsByLocation).toHaveBeenCalledWith('karachi', {
        limit: 50,
      });
    });
  });

  it('shows result count when filters are active', async () => {
    const user = userEvent.setup();
    getEventsByLocation.mockResolvedValue([mockEvents[0]]);

    renderEventsPage();

    await user.type(screen.getByLabelText(/location/i), 'karachi');
    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByText(/found 1 event/i)).toBeInTheDocument();
    });
  });

  it('clears filters when clear button is clicked', async () => {
    const user = userEvent.setup();
    getEventsByLocation.mockResolvedValue([mockEvents[0]]);

    renderEventsPage();

    await user.type(screen.getByLabelText(/location/i), 'karachi');
    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument();
    });
    await user.click(screen.getByRole('button', { name: /clear filters/i }));
    await waitFor(() => {
      expect(screen.getByText(/tech conference/i)).toBeInTheDocument();
      expect(screen.getByText(/startup pitch/i)).toBeInTheDocument();
    });
  });
});