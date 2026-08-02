def test_health_check_returns_healthy(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    body = response.get_json()
    assert body["success"] is True
    assert body["status"] == "healthy"


def test_health_check_is_exempt_from_rate_limiting(app):
    app.config["API_RATE_LIMIT_MAX_REQUESTS"] = 2
    client = app.test_client()
    for _ in range(10):
        response = client.get("/api/health")
        assert response.status_code == 200
