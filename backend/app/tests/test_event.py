import pytest
from datetime import date, timedelta
from core.security import create_access_token  # To generate test tokens

@pytest.mark.asyncio
async def test_create_event_success(client, db_session):
    # First, create an organizer directly in the DB
    from db.model import Organizer
    organizer = Organizer(
        name="test organizer",
        email="org@example.com",
        phone_number="9999999999",
        hashed_password="TEMP"
    )
    db_session.add(organizer)
    await db_session.commit()
    await db_session.refresh(organizer)

    # NEW: Generate a valid access token for this organizer
    token = create_access_token({"sub": str(organizer.id), "role": "organizer"})
    headers = {"Authorization": f"Bearer {token}"}

    event_payload = {
        "name": "Tech Conference",
        "date": str(date.today() + timedelta(days=30)),
        "location": "San Francisco",
        "description": "A great tech event",
        "image_url": "https://example.com/image.jpg",
        "organizer_id": organizer.id # Required by Pydantic schema
    }
    
    # NEW: Pass the headers to authenticate
    response = await client.post("/events/", json=event_payload, headers=headers)
    
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "tech conference" 
    assert data["organizer_id"] == organizer.id


@pytest.mark.asyncio
async def test_create_event_unauthorized(client):
    """Test that creating an event without a token fails"""
    event_payload = {
        "name": "Hacker Event",
        "date": str(date.today() + timedelta(days=10)),
        "location": "Nowhere",
        "description": "Should fail",
        "organizer_id": 1
    }
    # Notice: No headers are passed here
    response = await client.post("/events/", json=event_payload)
    
    assert response.status_code == 401
    assert "Not authenticated" in response.json()["detail"]


@pytest.mark.asyncio
async def test_get_my_events_success(client, db_session):
    """Test that an organizer can fetch only their own events"""
    from db.model import Organizer, Event
    
    organizer = Organizer(name="my org", email="myorg@test.com", phone_number="123", hashed_password="pw")
    db_session.add(organizer)
    await db_session.commit()
    await db_session.refresh(organizer)
    
    event = Event(name="my unique event", description="desc", date=date.today(), location="loc", organizer_id=organizer.id)
    db_session.add(event)
    await db_session.commit()

    # Generate token
    token = create_access_token({"sub": str(organizer.id), "role": "organizer"})
    headers = {"Authorization": f"Bearer {token}"}
    
    # Fetch my events
    response = await client.get("/events/my_events", headers=headers)
    
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "my unique event"


@pytest.mark.asyncio
async def test_get_event_not_found(client):
    response = await client.get("/events/9999")
    
    assert response.status_code == 404
    assert response.json()["detail"] == "Event with id 9999 not found"


@pytest.mark.asyncio
async def test_get_events_invalid_date_range(client):
    start_date = str(date.today() + timedelta(days=10))
    end_date = str(date.today()) 
    
    response = await client.get(f"/events/date_range/{start_date}/{end_date}")
    
    assert response.status_code == 400
    assert "Start date must be less than" in response.json()["detail"]


@pytest.mark.asyncio
async def test_update_event_partial(client, db_session):
    from db.model import Organizer, Event
    organizer = Organizer(name="upd org", email="upd@test.com",
                          phone_number="123", hashed_password="pw")
    db_session.add(organizer)
    await db_session.commit()
    await db_session.refresh(organizer)

    event = Event(name="old name", description="old desc",
                  date=date.today() + timedelta(days=5), location="old loc",
                  organizer_id=organizer.id)
    db_session.add(event)
    await db_session.commit()
    await db_session.refresh(event)

    token = create_access_token({"sub": str(organizer.id), "role": "organizer"})
    response = await client.patch(
        f"/events/{event.id}",
        json={"description": "new desc"},          
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["description"] == "new desc"
    assert data["name"] == "old name"              
    assert data["location"] == "old loc"

@pytest.mark.asyncio
async def test_delete_event_success(client, db_session):
    """Test that an organizer can delete their own event"""
    from db.model import Organizer, Event
    
    organizer = Organizer(name="delete org", email="deleteorg@test.com", phone_number="123", hashed_password="pw")
    db_session.add(organizer)
    await db_session.commit()
    await db_session.refresh(organizer)

    event = Event(name="delete event", description="desc", date=date.today(), location="loc", organizer_id=organizer.id)
    db_session.add(event)
    await db_session.commit()
        # Generate token
    token = create_access_token({"sub": str(organizer.id), "role": "organizer"})
    headers = {"Authorization": f"Bearer {token}"}
    
    # Fetch my events
    response = await client.delete(f"/events/delete/{event.id}", headers=headers)
    
    assert response.status_code == 204
    assert response.content == b'' 
    assert await db_session.get(Event, event.id) is None  
    
