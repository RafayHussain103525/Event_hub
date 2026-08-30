import pytest
from datetime import date, timedelta

@pytest.mark.asyncio
async def test_create_event_success(client, db_session):
    # First, create an organizer directly in the DB so the foreign key works
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

    event_payload = {
        "name": "Tech Conference",
        "date": str(date.today() + timedelta(days=30)),
        "location": "San Francisco",
        "description": "A great tech event",
        "image_url": "https://example.com/image.jpg",
        "organizer_id": organizer.id
    }
    
    response = await client.post("/events/", json=event_payload)
    
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "tech conference" # Your service lowercases it
    assert data["organizer_id"] == organizer.id


@pytest.mark.asyncio
async def test_get_event_not_found(client):
    response = await client.get("/events/9999")
    
    assert response.status_code == 404
    assert response.json()["detail"] == "Event with id 9999 not found"


@pytest.mark.asyncio
async def test_get_events_invalid_date_range(client):
    start_date = str(date.today() + timedelta(days=10))
    end_date = str(date.today()) # End is before start
    
    response = await client.get(f"/events/date_range/{start_date}/{end_date}")
    
    assert response.status_code == 400
    assert "Start date must be less than" in response.json()["detail"]