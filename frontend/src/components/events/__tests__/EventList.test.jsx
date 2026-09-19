import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import EventList from '../EventList';
import { mockEvents } from '../../../test/helpers';

const renderEventList = (props = {}) => {
  const defaultProps = {
    events: mockEvents,
    isLoading: false,
    error: null,
    onRetry: vi.fn(),
  };

  return render(
    <BrowserRouter>
      <EventList {...defaultProps} {...props} />
    </BrowserRouter>
  );
};

describe('EventList', () => {
  it('renders loading spinner when isLoading is true', () => {
    renderEventList({ isLoading: true });

    expect(screen.getByText(/loading events/i)).toBeInTheDocument();
    expect(screen.queryByText(/tech conference/i)).not.toBeInTheDocument();
  });

  it('renders error display when error is provided', () => {
    renderEventList({ error: 'Failed to fetch events' });

    expect(screen.getByText(/failed to fetch events/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('renders empty state when events array is empty', () => {
    renderEventList({ events: [] });

    expect(screen.getByText(/no events found/i)).toBeInTheDocument();
  });

  it('renders all event cards', () => {
    renderEventList();

    expect(screen.getByText(/tech conference/i)).toBeInTheDocument();
    expect(screen.getByText(/startup pitch/i)).toBeInTheDocument();
  });

  it('renders one card per event', () => {
    renderEventList();

    const cards = screen.getAllByRole('link');
    expect(cards).toHaveLength(mockEvents.length);
  });

  it('calls onRetry when try again button clicked', async () => {
    const mockRetry = vi.fn();
    renderEventList({ error: 'Network error', onRetry: mockRetry });

    const tryAgainButton = screen.getByRole('button', { name: /try again/i });
    tryAgainButton.click();

    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('shows create event link in empty state', () => {
    renderEventList({ events: [] });

    expect(
      screen.getByRole('link', { name: /create an event/i })
    ).toBeInTheDocument();
  });
});