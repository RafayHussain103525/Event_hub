import { Routes, Route } from 'react-router-dom';
import { useEvents } from './hooks/useEvents';

// Temporary test component
function EventsTest() {
  const { events, isLoading, error } = useEvents();

  if (isLoading) return <div style={{ padding: '20px' }}>Loading events...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>EventHub — API Test</h1>
      <h2>Total Events: {events.length}</h2>
      
      {events.map(event => (
        <div key={event.id} style={{ 
          border: '1px solid #ccc', 
          padding: '15px', 
          margin: '10px 0',
          borderRadius: '8px' 
        }}>
          <h3>{event.name}</h3>
          <p><strong>Location:</strong> {event.location}</p>
          <p><strong>Date:</strong> {event.date}</p>
          <p><strong>Description:</strong> {event.description}</p>
        </div>
      ))}
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<EventsTest />} />
    </Routes>
  );
}

export default App;