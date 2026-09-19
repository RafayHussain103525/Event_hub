import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import EventCard from '../EventCard';
import { mockEvent } from '../../../test/helpers';

const renderEventCard = (event = mockEvent) => {
  return render(
    <BrowserRouter>
      <EventCard event={event} />
    </BrowserRouter>
  );
};

describe('EventCard', () => {
  it('renders event name', () => {
    renderEventCard();

    expect(screen.getByText(/tech conference/i)).toBeInTheDocument();
  });

  it('renders event location', () => {
    renderEventCard();

    expect(screen.getByText(/karachi/i)).toBeInTheDocument();
  });

  it('renders event description', () => {
    renderEventCard();

    expect(screen.getByText(/a great tech event/i)).toBeInTheDocument();
  });

  it('renders event date in readable format', () => {
    renderEventCard();

    // Date should be formatted (contains month name)
    expect(screen.getByText(/dec/i)).toBeInTheDocument();
  });

  it('renders as a link to event detail page', () => {
    renderEventCard();

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/events/1');
  });

  it('shows poster image when poster_url is provided', () => {
    const eventWithPoster = {
      ...mockEvent,
      poster_url: 'https://example.com/poster.jpg',
    };

    renderEventCard(eventWithPoster);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://example.com/poster.jpg');
  });

  it('shows placeholder when no poster_url', () => {
    renderEventCard({ ...mockEvent, poster_url: null });
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('shows days-until badge for events within 7 days', () => {
    const soonEvent = {
      ...mockEvent,
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    };

    renderEventCard(soonEvent);

    expect(screen.getByText(/3d left/i)).toBeInTheDocument();
  });

  it('shows today badge for event happening today', () => {
    const todayEvent = {
      ...mockEvent,
      date: new Date().toISOString().split('T')[0],
    };

    renderEventCard(todayEvent);

    expect(screen.getByText(/today/i)).toBeInTheDocument();
  });

  it('does not show badge for events more than 7 days away', () => {
    const futureEvent = {
      ...mockEvent,
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    };

    renderEventCard(futureEvent);

    expect(screen.queryByText(/d left/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/today/i)).not.toBeInTheDocument();
  });
});