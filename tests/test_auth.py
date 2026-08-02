import re


def test_register_returns_access_and_refresh_tokens(client):
    response = client.post(
        "/api/auth/register",
        json={
            "username": "alice",
            "email": "alice@example.com",
            "password": "StrongPass123",
        },
    )
    assert response.status_code in (200, 201)
    body = response.get_json()
    assert body["success"] is True
    assert body["data"]["access_token"]
    assert body["data"]["refresh_token"]
    assert body["data"]["user"]["email"] == "alice@example.com"
    assert "password_hash" not in body["data"]["user"]


def test_register_rejects_duplicate_email(client, registered_user):
    response = client.post(
        "/api/auth/register",
        json={
            "username": "someoneelse",
            "email": registered_user["email"],
            "password": "AnotherPass123",
        },
    )
    assert response.status_code >= 400
    assert response.get_json()["success"] is False


def test_register_rejects_weak_password(client):
    response = client.post(
        "/api/auth/register",
        json={"username": "bob", "email": "bob@example.com", "password": "123"},
    )
    assert response.status_code == 400


def test_login_with_correct_credentials_succeeds(client, registered_user):
    response = client.post(
        "/api/auth/login",
        json={
            "email": registered_user["email"],
            "password": registered_user["password"],
        },
    )
    assert response.status_code == 200
    body = response.get_json()
    assert body["data"]["access_token"]
    assert body["data"]["refresh_token"]


def test_login_with_wrong_password_fails(client, registered_user):
    response = client.post(
        "/api/auth/login",
        json={"email": registered_user["email"], "password": "WrongPassword1"},
    )
    assert response.status_code == 401
    assert response.get_json()["success"] is False


def test_me_requires_authentication(client):
    response = client.get("/api/auth/me")
    assert response.status_code == 401


def test_me_returns_current_user_with_valid_token(client, auth_headers):
    response = client.get("/api/auth/me", headers=auth_headers)
    assert response.status_code == 200
    body = response.get_json()
    assert body["data"]["user"]["email"] == "testuser@example.com"


def test_logout_revokes_the_access_token(client, auth_headers):
    # Token works before logout.
    assert client.get("/api/auth/me", headers=auth_headers).status_code == 200

    logout_response = client.post("/api/auth/logout", headers=auth_headers)
    assert logout_response.status_code == 200

    # Same token must now be rejected.
    response = client.get("/api/auth/me", headers=auth_headers)
    assert response.status_code == 401


def test_refresh_token_issues_a_new_access_token(client, registered_user):
    response = client.post(
        "/api/auth/refresh",
        json={"refresh_token": registered_user["refresh_token"]},
    )
    assert response.status_code == 200
    body = response.get_json()
    new_token = body["data"]["access_token"]
    assert new_token
    assert new_token != registered_user["access_token"]

    check = client.get(
        "/api/auth/me", headers={"Authorization": f"Bearer {new_token}"}
    )
    assert check.status_code == 200


def test_refresh_with_invalid_token_fails(client):
    response = client.post(
        "/api/auth/refresh", json={"refresh_token": "not-a-real-token"}
    )
    assert response.status_code == 401


def test_refresh_requires_refresh_token_field(client):
    response = client.post("/api/auth/refresh", json={})
    assert response.status_code == 400


def test_password_reset_request_never_leaks_account_existence(client, registered_user):
    known = client.post(
        "/api/auth/password-reset/request", json={"email": registered_user["email"]}
    )
    unknown = client.post(
        "/api/auth/password-reset/request", json={"email": "nobody@example.com"}
    )
    assert known.status_code == unknown.status_code == 200
    assert known.get_json()["message"] == unknown.get_json()["message"]


def test_password_reset_full_flow(client, registered_user, caplog):
    caplog.set_level("WARNING")
    client.post(
        "/api/auth/password-reset/request", json={"email": registered_user["email"]}
    )

    token = None
    for record in caplog.records:
        match = re.search(r"token=([\w\-.]+)", record.getMessage())
        if match:
            token = match.group(1)
    assert token, "expected the reset link to be logged since SMTP isn't configured"

    confirm = client.post(
        "/api/auth/password-reset/confirm",
        json={"token": token, "new_password": "BrandNewPass123"},
    )
    assert confirm.status_code == 200

    old_login = client.post(
        "/api/auth/login",
        json={
            "email": registered_user["email"],
            "password": registered_user["password"],
        },
    )
    assert old_login.status_code == 401

    new_login = client.post(
        "/api/auth/login",
        json={"email": registered_user["email"], "password": "BrandNewPass123"},
    )
    assert new_login.status_code == 200

    # Reusing the same reset token must fail (single-use).
    reuse = client.post(
        "/api/auth/password-reset/confirm",
        json={"token": token, "new_password": "AnotherPass456"},
    )
    assert reuse.status_code == 401


def test_password_reset_confirm_rejects_short_password(client, registered_user):
    response = client.post(
        "/api/auth/password-reset/confirm",
        json={"token": "irrelevant", "new_password": "short"},
    )
    assert response.status_code == 400
