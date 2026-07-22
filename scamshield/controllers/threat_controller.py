"""HTTP controllers for threat intelligence."""

from flask import jsonify, request

from scamshield.services.threat_intelligence_service import ThreatIntelligenceService


def get_domain_threat(domain: str):
    """Return threat intelligence for a domain."""
    record = ThreatIntelligenceService.get_domain(domain.lower())
    if not record:
        return (
            jsonify(
                {
                    "success": False,
                    "error": "Threat intelligence record not found",
                    "details": {"domain": domain.lower()},
                }
            ),
            404,
        )
    return jsonify({"success": True, "data": record})


def get_top_threats():
    """Return top risky threat intelligence records."""
    limit = request.args.get("limit", default=10, type=int)
    limit = max(1, min(limit, 50))
    records = ThreatIntelligenceService.list_top(limit=limit)
    return jsonify({"success": True, "data": records})
