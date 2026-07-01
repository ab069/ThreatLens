from datetime import datetime, timezone
from typing import Any


def enrich_ioc(ioc_type: str, value: str) -> dict:
    enrichment = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "ioc_type": ioc_type,
        "value_preview": value[:50] + "..." if len(value) > 50 else value,
    }
    if ioc_type == "ip":
        enrichment["geo"] = "external"
        enrichment["reputation"] = "suspicious" if value.startswith(("10.", "192.168.")) else "unknown"
    elif ioc_type == "domain":
        enrichment["tld"] = value.split(".")[-1] if "." in value else "unknown"
        enrichment["age_days"] = 30
    elif ioc_type == "hash":
        enrichment["hash_type"] = "sha256" if len(value) == 64 else "md5" if len(value) == 32 else "unknown"
    elif ioc_type == "url":
        enrichment["has_path"] = "/" in value
        enrichment["uses_https"] = value.startswith("https")
    return enrichment


def classify_threat(ioc_type: str, severity: str, enrichment: dict) -> tuple[str, str, str]:
    threat_type = "malicious_activity"
    confidence = "medium"
    if severity == "high" or severity == "critical":
        threat_type = "targeted_attack"
        confidence = "high"
    elif ioc_type == "ip" and "suspicious" in str(enrichment.get("reputation", "")):
        threat_type = "scanning_activity"
        confidence = "medium"
    return threat_type, confidence, f"{severity.upper()} severity {ioc_type} indicator detected and enriched"


def map_mitre_ttps(threat_type: str) -> list[dict]:
    ttp_map = {
        "targeted_attack": [{"id": "TA0001", "name": "Initial Access"}, {"id": "TA0002", "name": "Execution"}],
        "malicious_activity": [{"id": "TA0011", "name": "Command and Control"}],
        "scanning_activity": [{"id": "TA0043", "name": "Reconnaissance"}],
    }
    return ttp_map.get(threat_type, [{"id": "TA0000", "name": "Unknown"}])
