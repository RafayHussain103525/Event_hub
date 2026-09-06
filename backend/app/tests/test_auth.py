import pytest
import asyncio 

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
    await client.post("/auth/signup/user", json=payload)
    
    payload["username"] = "user2"
    payload["phone_number"] = "2222222222"
    response = await client.post("/auth/signup/user", json=payload)
    
    assert response.status_code == 409
    assert "already exists" in response.json()["detail"]


@pytest.mark.asyncio
async def test_login_user_success(client):
    """Test successful login returns both access and refresh tokens"""
    # 1. Sign up first
    payload = {
        "username": "logintest",
        "email": "login@example.com",
        "phone_number": "5555555555",
        "password": "securepassword123"
    }
    await client.post("/auth/signup/user", json=payload)
    
    # 2. Login
    login_payload = {
        "email": "login@example.com",
        "password": "securepassword123"
    }
    response = await client.post("/auth/login/user", json=login_payload)
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"
    assert data["account"]["email"] == "login@example.com"


@pytest.mark.asyncio
async def test_login_user_invalid_credentials(client):
    payload = {
        "email": "nonexistent@example.com",
        "password": "wrongpassword"
    }
    response = await client.post("/auth/login/user", json=payload)
    
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"


@pytest.mark.asyncio
async def test_refresh_token_success(client):
    """Test that a valid refresh token generates a new access token"""
    # 1. Signup
    await client.post("/auth/signup/user", json={
        "username": "refreshtest",
        "email": "refresh@example.com",
        "phone_number": "4444444444",
        "password": "securepassword123"
    })
    
    # 2. Login to get the refresh token
    login_resp = await client.post("/auth/login/user", json={
        "email": "refresh@example.com",
        "password": "securepassword123"
    })
    
    refresh_token = login_resp.json()["refresh_token"]
    old_access_token = login_resp.json()["access_token"]
    await asyncio.sleep(2)
    # 3. Request a new access token using the refresh token
    refresh_resp = await client.post("/auth/refresh_token", json={"refresh_token": refresh_token})
    
    assert refresh_resp.status_code == 200
    new_data = refresh_resp.json()
    
    assert "access_token" in new_data
    # Ensure a new token was actually generated
    assert new_data["access_token"] != old_access_token


@pytest.mark.asyncio
async def test_refresh_token_invalid_type(client):
    """Test that attempting to use an ACCESS token as a REFRESH token fails"""
    await client.post("/auth/signup/user", json={
        "username": "invalidtype",
        "email": "invalid@example.com",
        "phone_number": "3333333333",
        "password": "securepassword123"
    })
    
    login_resp = await client.post("/auth/login/user", json={
        "email": "invalid@example.com",
        "password": "securepassword123"
    })
    
    # Grab the ACCESS token (not the refresh token)
    access_token = login_resp.json()["access_token"]
    
    # Try to pass the access token into the refresh endpoint
    refresh_resp = await client.post("/auth/refresh_token", json={"refresh_token": access_token})
    
    assert refresh_resp.status_code == 400
    assert "Invalid token type" in refresh_resp.json()["detail"]