import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

export const renderWithProviders = (ui, options = {}) => {
  const {
    route = '/',
    ...renderOptions
  } = options;

  const Wrapper = ({ children }) => (
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  );

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};


export const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  phone_number: '03001234567',
};

export const mockOrganizer = {
  id: 1,
  name: 'test organizer',
  email: 'organizer@example.com',
  phone_number: '03001234567',
};

export const mockEvent = {
  id: 1,
  name: 'tech conference',
  date: '2025-12-15',
  location: 'karachi',
  description: 'A great tech event',
  poster_url: null,
  organizer_id: 1,
};

export const mockEvents = [
  {
    id: 1,
    name: 'tech conference',
    date: '2025-12-15',
    location: 'karachi',
    description: 'A great tech event',
    poster_url: null,
    organizer_id: 1,
  },
  {
    id: 2,
    name: 'startup pitch',
    date: '2025-12-20',
    location: 'lahore',
    description: 'Pitch your startup',
    poster_url: null,
    organizer_id: 1,
  },
];

export const mockAuthenticatedUser = () => {
  const userData = JSON.stringify(mockUser);
  localStorage.setItem('eventhub_access_token', 'mock-access-token');
  localStorage.setItem('eventhub_refresh_token', 'mock-refresh-token');
  localStorage.setItem('eventhub_user_data', userData);
  localStorage.setItem('eventhub_user_role', 'user');
};

export const mockAuthenticatedOrganizer = () => {
  const userData = JSON.stringify(mockOrganizer);
  localStorage.setItem('eventhub_access_token', 'mock-access-token');
  localStorage.setItem('eventhub_refresh_token', 'mock-refresh-token');
  localStorage.setItem('eventhub_user_data', userData);
  localStorage.setItem('eventhub_user_role', 'organizer');
};