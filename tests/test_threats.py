def test_threat_endpoints_public(client):
    # Threat intelligence endpoints should be reachable without authentication.
    resp_domain = client.get('/api/threats/domain/example.com')
    # Accept either 200 (found) or 404 (not found) but never 401/403.
    assert resp_domain.status_code in (200, 404)

    resp_top = client.get('/api/threats/top')
    assert resp_top.status_code == 200
    body = resp_top.get_json() or {}
    assert 'success' in body
    assert body.get('success') is True
