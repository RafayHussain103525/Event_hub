import pytest

@pytest.mark.asyncio
async def test_signup_user_success(client):
    payload = {
        "username": "testuser",
        "email": "test@example.com",
        "phone_number": "1234567890",
        "password": "securepassword123"
    }
    response = await client.post("/auth/signup/user", json=payload)
    
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["username"] == "testuser"
    assert "id" in data


@pytest.mark.asyncio
async def test_signup_user_duplicate_email(client):
    payload = {
        "username": "user1",
        "email": "duplicate@example.com",
        "phone_number": "1111111111",
        "password": "securepassword123"
    }
    # First signup succeeds
    await client.post("/auth/signup/user", json=payload)
    
    # Second signup with same email fails
    payload["username"] = "user2"
    payload["phone_number"] = "2222222222"
    response = await client.post("/auth/signup/user", json=payload)
    
    assert response.status_code == 409
    assert "already exists" in response.json()["detail"]


@pytest.mark.asyncio
async def test_login_user_invalid_credentials(client):
    payload = {
        "email": "nonexistent@example.com",
        "password": "wrongpassword"
    }
    response = await client.post("/auth/login/user", json=payload)
    
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"