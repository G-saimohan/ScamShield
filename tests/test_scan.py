def test_check_url_returns_analysis(client):
    response = client.post(
        "/api/check-url", json={"url": "http://secure-login-paytm.tk/verify"}
    )
    assert response.status_code == 200
    body = response.get_json()
    assert "risk_level" in body
    assert "risk_score" in body


def test_check_url_requires_url_field(client):
    response = client.post("/api/check-url", json={})
    assert response.status_code == 400


def test_analyze_message_returns_a_verdict(client):
    response = client.post(
        "/api/analyze",
        json={
            "content_type": "message",
            "content": "Verify your KYC now and share your OTP immediately",
        },
    )
    assert response.status_code == 200
    body = response.get_json()
    assert "risk_level" in body
    assert "scam_probability" in body


def test_scan_history_requires_authentication(client):
    response = client.get("/api/scans/history")
    assert response.status_code == 401


def test_scan_history_accessible_when_authenticated(client, auth_headers):
    response = client.get("/api/scans/history", headers=auth_headers)
    assert response.status_code == 200
