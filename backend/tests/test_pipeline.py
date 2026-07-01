from app.agents.pipeline import enrich_ioc, classify_threat, map_mitre_ttps


def test_enrich_ip():
    result = enrich_ioc("ip", "203.0.113.5")
    assert result["ioc_type"] == "ip"
    assert result["reputation"] == "unknown"


def test_enrich_domain():
    result = enrich_ioc("domain", "evil.example.com")
    assert result["tld"] == "com"


def test_enrich_hash():
    result = enrich_ioc("hash", "a" * 64)
    assert result["hash_type"] == "sha256"


def test_classify_high():
    enrichment = enrich_ioc("ip", "10.0.0.1")
    t, c, d = classify_threat("ip", "high", enrichment)
    assert t == "targeted_attack"
    assert c == "high"


def test_mitre_mapping():
    ttps = map_mitre_ttps("scanning_activity")
    assert any(t["id"] == "TA0043" for t in ttps)
