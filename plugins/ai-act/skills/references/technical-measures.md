# Technical Measures Reference

Code-level technical safeguards required by the EU AI Act, mapped to verification steps.

## Table of Contents

1. [Risk Management Measures](#1-risk-management-measures)
2. [Data Quality & Governance Measures](#2-data-quality--governance-measures)
3. [Logging & Auditability Measures](#3-logging--auditability-measures)
4. [Transparency & Disclosure Measures](#4-transparency--disclosure-measures)
5. [Human Oversight Mechanisms](#5-human-oversight-mechanisms)
6. [Security & Robustness Measures](#6-security--robustness-measures)
7. [Post-Market Monitoring Measures](#7-post-market-monitoring-measures)
8. [Content Provenance Measures](#8-content-provenance-measures)

---

## 1. Risk Management Measures

**Articles**: 9, 17(g)

### 1.1 Risk Registry Implementation

**Requirement**: Continuous identification and analysis of known and foreseeable risks.

**Verification steps**:
```
Grep -ri "risk.?register|risk.?catalog|risk.?matrix|risk.?inventory"
Grep -ri "hazard.?id|threat.?model|failure.?mode|fmea"
```
Look for: structured data files (JSON, YAML, CSV) listing identified risks with severity and probability ratings.

**Anti-patterns**: No risk-related configuration or documentation files. Risk assessment done once and never updated.

### 1.2 Guardrails and Limits

**Requirement**: Risk mitigation through design — eliminate or reduce risks through system design.

**Verification steps**:
```
Grep -ri "guard.?rail|safety.?check|boundar|constraint|limit|cap|ceiling|floor"
Grep -ri "max.?score|min.?score|clamp|clip|bound|range.?check"
Grep -ri "block.?list|deny.?list|allow.?list|content.?filter|moderat"
```
Look for: input/output filtering, score clamping, content moderation layers, rate limiting on AI outputs.

**Anti-patterns**: AI model output passed directly to downstream systems without any bounds checking or validation.

### 1.3 Testing Against Defined Thresholds

**Requirement**: Testing with prior-defined metrics and probabilistic thresholds appropriate to intended purpose (Art. 9(8)).

**Verification steps**:
```
Grep -ri "assert.*accuracy|assert.*precision|assert.*recall|assert.*f1"
Grep -ri "threshold.?test|performance.?test|regression.?test|benchmark"
Grep -ri "expect.*metric|expect.*score|minimum.?acceptable"
```
Look for: test files that assert specific performance levels, not just "runs without error".

**Anti-patterns**: Test suites that only check code correctness, not model performance against defined acceptance criteria.

### 1.4 Vulnerable Population Safeguards

**Requirement**: Consider impact on persons under 18 and other vulnerable groups (Art. 9(9)).

**Verification steps**:
```
Grep -ri "age.?check|age.?gate|age.?verif|minor|child|under.?18|parental"
Grep -ri "vulnerable|elderly|disabled|cognitive|literacy"
Grep -ri "safeguard.?minor|protect.?child|age.?appropriate"
```
Look for: age verification gates, content filtering for minors, accessibility accommodations, simplified interfaces.

**Anti-patterns**: AI system affecting minors with no age-specific safeguards or content restrictions.

---

## 2. Data Quality & Governance Measures

**Articles**: 10, 17(f)

### 2.1 Data Provenance Tracking

**Requirement**: Document data collection processes and origin (Art. 10(2)(b)).

**Verification steps**:
```
Grep -ri "provenance|lineage|data.?source|data.?origin|metadata"
Grep -ri "data.?catalog|data.?dictionary|data.?registry"
Grep -ri "source.?url|source.?file|collected.?from|imported.?from"
```
Look for: data manifests, source documentation, data lineage tools (e.g., DVC, MLflow, Weights & Biases).

**Anti-patterns**: Training data loaded from undocumented paths or URLs with no provenance metadata.

### 2.2 Bias Detection Pipeline

**Requirement**: Examine for biases affecting health, safety, fundamental rights, or causing prohibited discrimination (Art. 10(2)(f)).

**Verification steps**:
```
Grep -ri "fairness|bias.?detect|bias.?audit|disparate.?impact|demographic.?parity"
Grep -ri "equal.?opportun|equalized.?odds|calibration|subgroup"
Grep -ri "aif360|fairlearn|what.?if.?tool|responsibleai|ethical"
```
Look for: fairness metrics computation, subgroup performance analysis, bias detection in CI/CD pipeline.

**Anti-patterns**: Model evaluation that only reports aggregate metrics without subgroup breakdowns.

### 2.3 Data Validation Framework

**Requirement**: Data sets free of errors and complete (Art. 10(3)).

**Verification steps**:
```
Grep -ri "great.?expectations|pandera|cerberus|voluptuous|pydantic.*valid"
Grep -ri "data.?contract|schema.?valid|data.?test|data.?assert"
Grep -ri "null.?check|missing.?value|outlier|anomaly.?detect.*data"
```
Look for: automated data quality checks before model training, schema enforcement, completeness assertions.

**Anti-patterns**: Raw data fed directly to training without any validation step.

### 2.4 Special Category Data Protection

**Requirement**: If processing sensitive data for bias detection, implement strict safeguards (Art. 10(5)).

**Verification steps**:
```
Grep -ri "pseudonym|k.?anonym|differential.?privacy|federat"
Grep -ri "access.?control|rbac|role.?based|permission|authorize"
Grep -ri "delete.?after|retention|purpose.?limit|minimize"
Grep -ri "encryption.?at.?rest|encrypted.?column|field.?level.?encrypt"
```
Look for: pseudonymisation on sensitive fields, strict access controls, automatic deletion after bias correction, processing records.

**Anti-patterns**: Race, health, or political data stored in plain text with broad access permissions.

---

## 3. Logging & Auditability Measures

**Articles**: 12, 19, 26(6)

### 3.1 Structured AI Event Logging

**Requirement**: Automatic recording of events over system lifetime (Art. 12(1)).

**Verification steps**:
```
Grep -ri "audit.?log|ai.?log|inference.?log|decision.?log|prediction.?log"
Grep -ri "log.*input|log.*output|log.*prediction|log.*decision|log.*score"
Grep -ri "event.?emit|event.?publish|track|telemetry|instrument"
```
Look for: structured logging middleware on AI inference paths, not just application-level debug logs.

**Anti-patterns**: Standard application logging (HTTP requests, errors) but no AI-specific event logging.

### 3.2 Log Retention Configuration

**Requirement**: Minimum 6 months retention (Art. 19(1), Art. 26(6)).

**Verification steps**:
```
Grep -ri "retention.*6|retention.*month|retention.*180|retention.*day"
Grep -ri "log.*ttl|log.*expir|log.*lifecycle|log.*rotat"
Grep -ri "archive|cold.?storage|glacier|backup.*log"
```
Look for: explicit retention policies of ≥6 months on AI-related log stores.

**Anti-patterns**: Log rotation set to 7 or 30 days. No explicit retention policy. Logs deleted on deployment.

### 3.3 Log Integrity Protection

**Requirement**: Logs must support traceability and monitoring (implied tamper-resistance for regulatory evidence).

**Verification steps**:
```
Grep -ri "append.?only|immutable|write.?once|worm"
Grep -ri "hash.?chain|merkle|blockchain|signed.?log"
Grep -ri "cloud.?trail|audit.?trail|compliance.?log"
```
Look for: append-only log stores, hash-chained entries, cloud audit trail services.

**Anti-patterns**: AI logs stored in mutable database tables that can be edited or deleted by application code.

---

## 4. Transparency & Disclosure Measures

**Articles**: 13, 50

### 4.1 AI Interaction Disclosure

**Requirement**: Persons interacting with AI must be informed (Art. 50(1)).

**Verification steps**:
```
Grep -ri "ai.?disclosure|bot.?notice|ai.?notice|powered.?by|generated.?by"
Grep -ri "you.?are.?interacting|this.?is.?an.?ai|automated.?system"
Grep -ri "chatbot.?disclos|assistant.?disclos|virtual.?agent"
```
Look for: UI labels, headers, or initial messages that disclose AI nature.

**Anti-patterns**: Chatbot that presents as human with no disclosure. AI assistant with no indication it's automated.

### 4.2 Explainability Layer

**Requirement**: Operation transparent enough for deployers to interpret outputs (Art. 13(1)).

**Verification steps**:
```
Grep -ri "explain|interpret|shap|lime|attention|feature.?importan"
Grep -ri "reason|justif|rationale|basis|factor|contrib"
Grep -ri "confidence.?score|probability|uncertain|calibrat"
```
Look for: explainability libraries integrated, confidence scores exposed, feature importance computation.

**Anti-patterns**: AI model returns only a bare label/score with no explanation or confidence information.

### 4.3 Performance Metric Declaration

**Requirement**: Accuracy levels and metrics declared in instructions for use (Art. 15(3), Art. 13(3)(b)(ii)).

**Verification steps**:
```
Grep -ri "accuracy.*\d|precision.*\d|recall.*\d|f1.*\d|auc.*\d"
Grep -ri "benchmark.?result|evaluation.?result|model.?performance"
Grep -ri "metric.?report|performance.?report|evaluation.?report"
```
Look for: documented performance metrics with specific numbers, benchmark results, evaluation reports.

**Anti-patterns**: No performance numbers documented anywhere. Metrics exist only in experiment tracking tools not accessible to deployers.

---

## 5. Human Oversight Mechanisms

**Articles**: 14

### 5.1 Override Interface

**Requirement**: Humans can decide not to use, disregard, override, or reverse AI output (Art. 14(4)(d)).

**Verification steps**:
```
Grep -ri "override|overrul|manual|human.?decision|bypass.?ai|ignore.?ai"
Grep -ri "review.?queue|pending.?review|awaiting.?approval|moderation.?queue"
Grep -ri "edit.*result|correct.*output|adjust.*score|manual.*assign"
```
Look for: UI elements for overriding AI decisions, review queues, manual correction workflows.

**Anti-patterns**: AI output directly triggers actions (sending emails, updating records, making purchases) with no review step.

### 5.2 Emergency Stop

**Requirement**: Ability to interrupt the system through a stop button or similar, reaching a safe state (Art. 14(4)(e)).

**Verification steps**:
```
Grep -ri "stop|halt|kill|abort|cancel|disable|deactivate|shutdown"
Grep -ri "feature.?flag|toggle|switch|circuit.?break|dead.?man"
Grep -ri "safe.?state|graceful|drain|wind.?down"
```
Look for: feature flags that can disable AI components, circuit breakers, emergency shutdown procedures.

**Anti-patterns**: AI component cannot be disabled independently of the rest of the application. No feature flag for AI features.

### 5.3 Automation Bias Mitigation

**Requirement**: Address tendency of over-relying on AI output (Art. 14(4)(b)).

**Verification steps**:
```
Grep -ri "confidence|uncertain|may.?be.?wrong|not.?certain|approx"
Grep -ri "alternative|other.?option|consider|caveat|warning"
Grep -ri "friction|confirm|are.?you.?sure|double.?check|verify"
```
Look for: confidence indicators in UI, alternative suggestions, friction before acting on AI recommendations.

**Anti-patterns**: AI recommendation presented as definitive fact. Single option presented with no alternatives or caveats.

---

## 6. Security & Robustness Measures

**Articles**: 15, 55(1)(d)

### 6.1 Input Validation for AI

**Requirement**: Resilience to errors, faults, inconsistencies (Art. 15(4)).

**Verification steps**:
```
Grep -ri "validate.*input|sanitize.*input|check.*input|verify.*input"
Grep -ri "schema.*enforce|type.*check|range.*check|format.*check"
Grep -ri "reject.*invalid|malform|corrupt|unexpected.*input"
```
Look for: input validation specific to AI inference endpoints, not just general API validation.

**Anti-patterns**: AI model endpoint accepts arbitrary input without validation. No type checking on model inputs.

### 6.2 Adversarial Defence

**Requirement**: Resilience against adversarial attacks — manipulation of inputs, data poisoning, model evasion (Art. 15(5)).

**Verification steps**:
```
Grep -ri "adversar|perturbat|robust.*test|attack.*test|red.?team"
Grep -ri "clip.*norm|gradient.*clip|input.*perturbat|noise.*inject"
Grep -ri "detect.*attack|detect.*anomal|out.?of.?distribut|ood"
```
Look for: adversarial testing in test suites, input perturbation defences, out-of-distribution detection.

**Anti-patterns**: No adversarial testing. Model deployed without any robustness evaluation.

### 6.3 Model Integrity Verification

**Requirement**: Protection against model poisoning and unauthorised alteration (Art. 15(5)).

**Verification steps**:
```
Grep -ri "checksum|hash.*model|sha256|md5.*model|signature.*model"
Grep -ri "model.*registry|model.*version|dvc|mlflow|wandb"
Grep -ri "verify.*model|integrity.*check|trusted.*source"
```
Look for: model file checksums, signed model artefacts, model registry with version control.

**Anti-patterns**: Model files loaded from URLs without integrity checks. Models overwritten in place with no versioning.

### 6.4 Feedback Loop Protection

**Requirement**: Systems learning post-deployment must prevent biased feedback loops (Art. 15(4)).

**Verification steps**:
```
Grep -ri "retrain|fine.?tune|online.?learn|incremental|active.?learn"
Grep -ri "feedback.*loop|self.*reinforc|automat.*label|human.*label"
Grep -ri "drift.*detect|distribution.*shift|concept.*drift|data.*drift"
```
Look for: monitoring for feedback loops, human validation before retraining, drift detection.

**Anti-patterns**: Model auto-retrains on its own predictions without human validation. No drift monitoring.

---

## 7. Post-Market Monitoring Measures

**Articles**: 72, 73, 17(h)-(i)

### 7.1 Performance Monitoring

**Requirement**: Collect and review experience from use to identify corrective actions (Art. 72).

**Verification steps**:
```
Grep -ri "monitor.*performance|track.*metric|observ.*model|dashboard.*ai"
Grep -ri "prometheus|grafana|datadog|new.?relic|cloudwatch.*metric"
Grep -ri "alert.*threshold|alert.*degrad|notify.*anomal"
```
Look for: AI-specific monitoring dashboards, performance metric tracking, degradation alerts.

**Anti-patterns**: No monitoring specific to AI component performance. Only infrastructure-level monitoring.

### 7.2 Incident Reporting Mechanism

**Requirement**: Report serious incidents — death/serious health harm, critical infrastructure disruption, fundamental rights infringement, serious property/environmental harm (Art. 73, Art. 3(49)).

**Verification steps**:
```
Grep -ri "incident.*report|serious.*incident|report.*authority|notify.*regulator"
Grep -ri "incident.*template|post.?mortem|root.?cause|corrective.?action"
Grep -ri "escalat.*procedure|severity.*classif|incident.*workflow"
```
Look for: incident classification systems, reporting templates, escalation procedures to authorities.

**Anti-patterns**: No incident reporting specific to AI failures. General bug tracking but no regulatory reporting path.

---

## 8. Content Provenance Measures

**Articles**: 50(2), 50(4)

### 8.1 Synthetic Content Watermarking

**Requirement**: AI-generated content must be marked in machine-readable format (Art. 50(2)).

**Verification steps**:
```
Grep -ri "watermark|c2pa|content.?credential|content.?authenti"
Grep -ri "steganograph|invisible.?mark|digital.?signature.*content"
Grep -ri "iptc|exif|xmp|metadata.*generat|provenance.*metadata"
```
Look for: watermarking libraries, C2PA implementation, metadata injection on generated content.

**Anti-patterns**: Image/audio/video generation with no provenance metadata. Text generation with no AI labelling.

### 8.2 Deep Fake Disclosure

**Requirement**: Deployers must disclose AI-generated content resembling real persons/events (Art. 50(4)).

**Verification steps**:
```
Grep -ri "deepfake|synthetic.*media|face.*swap|voice.*clone|avatar"
Grep -ri "disclosure|disclaim|notice.*generat|label.*synthetic"
```
Look for: disclosure mechanisms on content generation features.

**Anti-patterns**: Face swap or voice clone features with no disclosure to end users.
