# EU AI Act Compliance Checklist

Reference framework for code-level compliance analysis.
Regulation: EU 2024/1689 (Artificial Intelligence Act).

## Table of Contents

1. [Prohibited Practices](#1-prohibited-practices-art-5)
2. [Risk Classification](#2-risk-classification-art-6-7-annex-iii)
3. [Risk Management System](#3-risk-management-system-art-9)
4. [Data Governance](#4-data-governance-art-10)
5. [Technical Documentation](#5-technical-documentation-art-11-annex-iv)
6. [Logging & Traceability](#6-logging--traceability-art-12-19)
7. [Transparency & Information](#7-transparency--information-art-13-50)
8. [Human Oversight](#8-human-oversight-art-14)
9. [Accuracy, Robustness & Cybersecurity](#9-accuracy-robustness--cybersecurity-art-15)
10. [GPAI Model Obligations](#10-gpai-model-obligations-art-53-55)
11. [Deployer Obligations](#11-deployer-obligations-art-26-27)
12. [AI Literacy](#12-ai-literacy-art-4)

---

## 1. Prohibited Practices (Art. 5)

**Fine tier**: €35M or 7% global turnover (highest tier)
**Applies from**: 2 February 2025

**What the regulation requires**: Certain AI practices are absolutely prohibited. Systems must not deploy subliminal/manipulative techniques, exploit vulnerabilities, perform social scoring, predict criminal risk from profiling alone, scrape facial images for recognition databases, infer emotions at work/school, or categorise people by biometric data to deduce protected characteristics.

### Checks

- [ ] **P-01** No subliminal or manipulative influence: System does not use techniques beyond user consciousness to materially distort behaviour
- [ ] **P-02** No vulnerability exploitation: System does not target age, disability, or socioeconomic vulnerabilities to distort behaviour
- [ ] **P-03** No social scoring: System does not evaluate/classify persons based on social behaviour leading to detrimental treatment in unrelated contexts
- [ ] **P-04** No criminal risk prediction from profiling: System does not predict criminal risk based solely on profiling or personality traits
- [ ] **P-05** No untargeted facial image scraping: System does not create/expand facial recognition databases from internet/CCTV
- [ ] **P-06** No workplace/education emotion inference: System does not infer emotions in workplace or education settings (unless medical/safety)
- [ ] **P-07** No biometric categorisation of protected characteristics: System does not use biometrics to deduce race, political opinions, religion, sex life, sexual orientation

### Discovery Strategy

```
Grep -ri "emotion|sentiment|mood|affect" -- find emotion detection
Grep -ri "social.?score|credit.?score|reputation.?score|trust.?score" -- find social scoring
Grep -ri "face.?recog|facial|biometric|fingerprint|retina" -- find biometric processing
Grep -ri "subliminal|nudge|dark.?pattern|manipulat" -- find manipulative patterns
Grep -ri "predict.*crim|recidiv|risk.*offend" -- find criminal prediction
Grep -ri "scrape.*face|crawl.*image|collect.*photo" -- find facial scraping
Grep -ri "race|ethnic|religion|political|sexual.?orient|gender.?ident" -- find protected characteristics processing
```

### Anti-patterns

- Emotion recognition model loaded in HR/education context without medical/safety flag
- Facial image collection endpoint without clear consent and purpose limitation
- User scoring system that aggregates behavioural data across unrelated contexts
- Dark pattern UI components designed to manipulate user decisions through AI
- Biometric classification pipeline that outputs protected characteristic categories

---

## 2. Risk Classification (Art. 6-7, Annex III)

**Fine tier**: €15M or 3% global turnover
**Applies from**: 2 August 2026 (Annex III); 2 August 2027 (Art. 6(1) product safety)

**What the regulation requires**: AI systems must be correctly classified by risk tier. Systems in Annex III areas (biometrics, critical infrastructure, education, employment, essential services, law enforcement, migration, justice/democracy) are presumed high-risk. Systems that are safety components of products under EU harmonisation legislation are high-risk under Art. 6(1). A narrow procedural exception (Art. 6(3)) allows some Annex III systems to be classified as non-high-risk if they don't pose significant harm risk.

### Checks

- [ ] **RC-01** AI system identification: Each AI component is identified and documented as an "AI system" per Art. 3(1) definition
- [ ] **RC-02** Annex III assessment: System checked against all 8 Annex III high-risk areas
- [ ] **RC-03** Product safety component: If AI is a safety component of an EU-regulated product, it is treated as high-risk
- [ ] **RC-04** Derogation documented: If Annex III system claims non-high-risk status under Art. 6(3), the assessment is documented
- [ ] **RC-05** Profiling always high-risk: Any system performing profiling of natural persons within Annex III scope is always high-risk

### Discovery Strategy

```
Grep -ri "recruit|hiring|candidate|applicant|resume|cv.?pars" -- employment (Annex III.4)
Grep -ri "credit.?scor|creditworth|loan.?approv|insurance.?risk" -- essential services (Annex III.5)
Grep -ri "admission|enrol|grade|exam|learning.?outcome" -- education (Annex III.3)
Grep -ri "triage|emergency|dispatch|priority.?queue" -- emergency services (Annex III.5d)
Grep -ri "biometric|face.?id|fingerprint|voice.?id" -- biometrics (Annex III.1)
Grep -ri "safety.?component|safety.?critical|fail.?safe" -- product safety (Art. 6(1))
Grep -ri "profil|user.?score|person.?classif" -- profiling detection
```

### Anti-patterns

- AI system in Annex III area with no risk classification documentation
- Recruitment/HR AI component treated as minimal risk
- Credit scoring or insurance pricing AI without high-risk compliance measures
- Profiling system incorrectly exempted under Art. 6(3) derogation

---

## 3. Risk Management System (Art. 9)

**Fine tier**: €15M or 3% global turnover
**Applies from**: 2 August 2026

**What the regulation requires**: High-risk AI systems must have a continuous, iterative risk management system throughout their lifecycle. This includes identifying known and foreseeable risks, evaluating risks under intended use and foreseeable misuse, implementing mitigation measures, and testing against defined metrics. Special attention to impact on persons under 18 and vulnerable groups.

### Checks

- [ ] **RM-01** Risk identification: Code or config includes risk categories, hazard definitions, or risk registers
- [ ] **RM-02** Risk evaluation: Quantitative or qualitative risk scoring is implemented
- [ ] **RM-03** Mitigation measures: Identified risks have corresponding code-level mitigations (guards, fallbacks, limits)
- [ ] **RM-04** Residual risk acceptance: Residual risk levels are documented after mitigations
- [ ] **RM-05** Testing against thresholds: Test suites include defined accuracy/performance thresholds
- [ ] **RM-06** Vulnerable group consideration: Risk analysis accounts for minors and vulnerable users
- [ ] **RM-07** Misuse scenario coverage: Tests or guards cover foreseeable misuse scenarios
- [ ] **RM-08** Continuous monitoring: Runtime monitoring detects performance degradation or drift

### Discovery Strategy

```
Grep -ri "risk.?manag|risk.?assess|risk.?register|hazard|threat.?model" -- risk management artefacts
Grep -ri "mitigat|safeguard|guard.?rail|fallback|circuit.?break" -- mitigation measures
Grep -ri "threshold|tolerance|acceptance.?criter|slo|sla" -- performance thresholds
Grep -ri "minor|child|under.?18|vulnerable|elderly|disab" -- vulnerable group handling
Grep -ri "drift|degrad|monitor|alert|anomaly" -- runtime monitoring
Glob("**/risk*/**"), Glob("**/safety*/**") -- risk documentation directories
Glob("**/tests/**"), Glob("**/test/**"), Glob("**/__tests__/**") -- test suites
```

### Anti-patterns

- No risk-related files or configuration anywhere in the codebase
- AI model deployed without any performance threshold tests
- No consideration for edge cases involving minors or vulnerable populations
- No runtime monitoring or alerting for AI component behaviour

---

## 4. Data Governance (Art. 10)

**Fine tier**: €15M or 3% global turnover
**Applies from**: 2 August 2026

**What the regulation requires**: Training, validation, and testing datasets must meet quality criteria: relevant design choices, documented data collection and origin, appropriate preparation (annotation, labelling, cleaning), bias examination and mitigation, and gap analysis. Datasets must be representative, free of errors, and statistically appropriate. Special category personal data may only be processed for bias detection under strict conditions.

### Checks

- [ ] **DG-01** Data provenance: Data sources are documented (origin, collection method, original purpose)
- [ ] **DG-02** Data preparation pipeline: Annotation, labelling, cleaning, enrichment steps are documented and reproducible
- [ ] **DG-03** Bias examination: Code or process for detecting bias in training data exists
- [ ] **DG-04** Bias mitigation: Specific bias mitigation techniques are implemented
- [ ] **DG-05** Representativeness validation: Dataset representativeness is checked against intended deployment population
- [ ] **DG-06** Data quality checks: Automated validation for errors, completeness, and consistency
- [ ] **DG-07** Special category data handling: If sensitive personal data is processed for bias detection, strict safeguards are in place (pseudonymisation, access control, deletion after use)
- [ ] **DG-08** Train/validation/test split: Proper dataset splitting methodology is implemented
- [ ] **DG-09** Geographic/contextual fitness: Data is appropriate for the deployment context

### Discovery Strategy

```
Grep -ri "dataset|training.?data|validation.?data|test.?data" -- dataset references
Grep -ri "annotation|label|clean|preprocess|augment|synthetic" -- data preparation
Grep -ri "bias|fairness|disparity|demographic.?parity|equal.?opportun" -- bias handling
Grep -ri "data.?quality|data.?validat|schema.?valid|null.?check|missing.?value" -- quality checks
Grep -ri "train.?split|test.?split|cross.?valid|stratif" -- splitting methodology
Grep -ri "pseudonym|anonymi|mask|redact|de.?identif" -- privacy measures
Glob("**/data/**"), Glob("**/datasets/**"), Glob("**/pipeline*/**") -- data directories
```

### Anti-patterns

- Training data loaded from undocumented external URLs with no provenance
- No bias testing or fairness metrics in test suite
- Special category data (race, health, religion) stored without enhanced protections
- Single dataset used for both training and evaluation without proper splitting
- No data quality validation before model training

---

## 5. Technical Documentation (Art. 11, Annex IV)

**Fine tier**: €15M or 3% global turnover
**Applies from**: 2 August 2026

**What the regulation requires**: High-risk AI systems require comprehensive technical documentation before market placement, kept up-to-date. Per Annex IV: system description, development methodology, design specifications, system architecture, computational resources, intended purpose, risk management results, change log, standards applied, and EU declaration of conformity. Documentation must enable authorities to assess compliance.

### Checks

- [ ] **TD-01** System description: README or docs describe the AI system's purpose, functionality, and scope
- [ ] **TD-02** Architecture documentation: System architecture is documented (diagrams, component descriptions)
- [ ] **TD-03** Development methodology: Development process (training, tuning, evaluation) is documented
- [ ] **TD-04** Design specifications: Input/output specs, model architecture choices are documented
- [ ] **TD-05** Change management: Version control, changelogs, and modification tracking are in place
- [ ] **TD-06** Standards references: Applied standards or benchmarks are documented
- [ ] **TD-07** Quality management traces: Links to QMS procedures visible in code (code review requirements, CI checks)

### Discovery Strategy

```
Glob("**/docs/**"), Glob("**/documentation/**"), Glob("**/*.md") -- documentation files
Glob("**/CHANGELOG*"), Glob("**/CHANGES*"), Glob("**/HISTORY*") -- change logs
Glob("**/.github/**"), Glob("**/.gitlab-ci*"), Glob("**/Jenkinsfile*") -- CI/CD config
Grep -ri "architecture|system.?design|technical.?spec" -- architecture docs
Grep -ri "conformity|compliance|declaration|ce.?mark" -- conformity documentation
```

### Anti-patterns

- No README or documentation directory in the repository
- AI model files present with no description of training methodology
- No changelog or version tracking for model iterations
- CI/CD pipeline with no quality gates for AI components

---

## 6. Logging & Traceability (Art. 12, 19)

**Fine tier**: €15M or 3% global turnover
**Applies from**: 2 August 2026

**What the regulation requires**: High-risk AI systems must automatically record events (logs) throughout their lifetime. Logs must enable: identification of risk situations, post-market monitoring, and operational monitoring. For biometric systems (Annex III.1a), logs must record usage periods, reference databases, matched inputs, and human verifier identities. Logs must be retained at least 6 months.

### Checks

- [ ] **LG-01** Automatic logging: AI decisions/predictions are automatically logged
- [ ] **LG-02** Input logging: Inputs to the AI system are recorded or referenceable
- [ ] **LG-03** Output logging: AI system outputs (predictions, recommendations, decisions) are logged
- [ ] **LG-04** Timestamp recording: Each AI operation is timestamped (start and end for sessions)
- [ ] **LG-05** Anomaly event logging: Unusual system behaviour, errors, or threshold breaches are logged
- [ ] **LG-06** Retention policy: Logs are retained for at least 6 months (or longer if required by domain law)
- [ ] **LG-07** Log integrity: Logs are tamper-resistant or append-only
- [ ] **LG-08** Biometric system specifics: If biometric system, logs include reference database ID, match inputs, and human verifier ID
- [ ] **LG-09** Log accessibility: Logs can be provided to competent authorities upon request

### Discovery Strategy

```
Grep -ri "logger|logging|log\.|audit.?log|audit.?trail" -- logging infrastructure
Grep -ri "winston|bunyan|log4j|serilog|structlog|pino|morgan" -- logging libraries
Grep -ri "retention|ttl|expir|rotate|cleanup|purge" -- retention configuration
Grep -ri "append.?only|immutab|tamper|write.?once" -- integrity measures
Grep -ri "event.?sourc|event.?store|audit.?event" -- event sourcing patterns
Glob("**/logs/**"), Glob("**/audit/**"), Glob("**/telemetry/**") -- log directories
```

### Anti-patterns

- AI inference endpoint with no logging middleware
- Logs that record only errors, not normal AI operations
- Log retention set to < 6 months or no retention policy at all
- Mutable log storage without integrity guarantees
- Biometric system with no per-operation audit trail

---

## 7. Transparency & Information (Art. 13, 50)

**Fine tier**: €15M or 3% global turnover
**Applies from**: 2 August 2025 (Art. 50); 2 August 2026 (Art. 13)

**What the regulation requires**: Art. 13 — High-risk AI systems must be transparent enough for deployers to interpret outputs. Must include instructions for use covering: intended purpose, accuracy metrics, known limitations, human oversight measures, computational requirements, and log interpretation guidance. Art. 50 — All AI systems interacting with persons must disclose they are AI. Synthetic content must be machine-readably marked. Deep fakes must be disclosed. AI-generated public-interest text must be labelled.

### Checks

- [ ] **TR-01** AI disclosure: Users are informed they are interacting with an AI system
- [ ] **TR-02** Synthetic content marking: AI-generated content (text, image, audio, video) is marked in machine-readable format
- [ ] **TR-03** Deep fake disclosure: AI-generated/manipulated media resembling real persons is disclosed
- [ ] **TR-04** Instructions for use: Documentation includes intended purpose, accuracy, limitations, and oversight measures
- [ ] **TR-05** Output interpretability: System provides information to help deployers interpret AI outputs
- [ ] **TR-06** Performance metrics documented: Accuracy, robustness, and cybersecurity metrics are declared
- [ ] **TR-07** Known limitations declared: Known circumstances affecting performance are documented
- [ ] **TR-08** AI-generated text labelling: AI-generated text published for public interest is labelled as such
- [ ] **TR-09** Accessibility: Transparency information meets accessibility requirements (Directives 2016/2102, 2019/882)

### Discovery Strategy

```
Grep -ri "ai.?disclos|bot.?disclos|generated.?by|powered.?by.?ai|artificial" -- AI disclosure
Grep -ri "watermark|c2pa|content.?credentials|provenance|metadata.?tag" -- synthetic content marking
Grep -ri "deep.?fake|synthetic.?media|generated.?image|generated.?video" -- deep fake handling
Grep -ri "explainab|interpretab|explain.?output|feature.?importan|shap|lime" -- interpretability
Grep -ri "accuracy|precision|recall|f1.?score|auc|confusion.?matrix" -- performance metrics
Grep -ri "limitation|caveat|known.?issue|not.?suitable|disclaimer" -- limitations
Grep -ri "a]11y|wcag|aria|accessible|screen.?reader" -- accessibility
Glob("**/docs/instructions*"), Glob("**/docs/user-guide*") -- usage instructions
```

### Anti-patterns

- Chatbot or conversational AI with no disclosure that user is talking to AI
- Image/video generation endpoint with no watermarking or C2PA metadata
- AI model serving predictions with no explainability layer
- No accuracy or performance metrics documented anywhere
- Generated content published without AI provenance labels

---

## 8. Human Oversight (Art. 14)

**Fine tier**: €15M or 3% global turnover
**Applies from**: 2 August 2026

**What the regulation requires**: High-risk AI systems must be designed for effective human oversight. Humans must be able to: understand capabilities and limitations, monitor for anomalies, interpret outputs correctly, decide not to use the system, and intervene/stop it safely. The system must address automation bias. For biometric identification (Annex III.1a), no action may be taken without verification by at least two qualified persons.

### Checks

- [ ] **HO-01** Override mechanism: Humans can override or reverse AI decisions
- [ ] **HO-02** Stop mechanism: System has a stop button or halt procedure that reaches a safe state
- [ ] **HO-03** Human-in-the-loop option: Critical AI decisions can be routed to human review
- [ ] **HO-04** Automation bias mitigation: UI/UX design mitigates over-reliance on AI output
- [ ] **HO-05** Anomaly alerting: Human overseers are alerted to anomalous AI behaviour
- [ ] **HO-06** Capability documentation: System documentation helps overseers understand AI capabilities and limits
- [ ] **HO-07** Dual verification (biometric): For biometric ID systems, at least two persons verify identifications
- [ ] **HO-08** Output interpretation aids: Tools or interfaces help humans correctly interpret AI outputs

### Discovery Strategy

```
Grep -ri "override|overrid|manual.?review|human.?review|human.?in.?loop|hitl" -- override mechanisms
Grep -ri "stop.?button|halt|emergency.?stop|kill.?switch|circuit.?break|safe.?state" -- stop mechanisms
Grep -ri "approval.?flow|review.?queue|moderat|escalat" -- review workflows
Grep -ri "confidence|uncertain|calibrat|automation.?bias" -- automation bias mitigation
Grep -ri "alert|notify|pager|on.?call|incident" -- alerting systems
Grep -ri "dual.?verif|two.?person|four.?eye|double.?check" -- dual verification
```

### Anti-patterns

- Fully autonomous AI decision pipeline with no human intervention point
- No confidence score or uncertainty indicator exposed to users
- AI system that cannot be stopped without shutting down the entire application
- Biometric identification that auto-acts on matches without human verification
- No alerting when AI system behaves anomalously

---

## 9. Accuracy, Robustness & Cybersecurity (Art. 15)

**Fine tier**: €15M or 3% global turnover
**Applies from**: 2 August 2026

**What the regulation requires**: High-risk AI systems must achieve appropriate levels of accuracy, robustness, and cybersecurity consistently throughout their lifecycle. Must be resilient to errors, faults, and inconsistencies. Systems that continue learning post-deployment must prevent biased feedback loops. Must be resilient against adversarial attacks, data poisoning, model poisoning, and confidentiality attacks.

### Checks

- [ ] **AR-01** Accuracy metrics defined: Accuracy levels and metrics are declared
- [ ] **AR-02** Robustness testing: System is tested against errors, faults, and inconsistent inputs
- [ ] **AR-03** Adversarial resilience: System includes defences against adversarial inputs
- [ ] **AR-04** Data poisoning defence: Training pipeline protects against data poisoning
- [ ] **AR-05** Model integrity: Model files are integrity-checked (hashes, signatures)
- [ ] **AR-06** Feedback loop control: If system learns post-deployment, biased feedback loops are mitigated
- [ ] **AR-07** Redundancy/fallback: Backup or fail-safe mechanisms exist for AI failures
- [ ] **AR-08** Cybersecurity measures: Standard security practices applied to AI components (authentication, encryption, access control)
- [ ] **AR-09** Input validation: Inputs to AI system are validated and sanitised
- [ ] **AR-10** Dependency security: AI-related dependencies are monitored for vulnerabilities

### Discovery Strategy

```
Grep -ri "adversar|robust|perturbat|attack|poison|evasion" -- adversarial defences
Grep -ri "checksum|hash|signature|integrity|verify.?model" -- model integrity
Grep -ri "feedback.?loop|retrain|online.?learn|continual.?learn" -- post-deployment learning
Grep -ri "fallback|redundan|failover|backup|degrad.?graceful" -- fallback mechanisms
Grep -ri "input.?valid|sanitiz|whitelist|schema.?valid" -- input validation
Grep -ri "encrypt|tls|ssl|auth|token|api.?key|secret" -- security measures
Glob("**/security/**"), Glob("**/.snyk"), Glob("**/dependabot*") -- security tooling
```

### Anti-patterns

- AI model endpoint with no input validation
- No integrity verification when loading model weights
- Post-deployment learning enabled without feedback loop analysis
- AI system with no fallback for when the model fails or is unavailable
- No dependency vulnerability scanning for ML libraries

---

## 10. GPAI Model Obligations (Art. 53-55)

**Fine tier**: €15M or 3% global turnover (Art. 101)
**Applies from**: 2 August 2025

**What the regulation requires**: Providers of general-purpose AI models must: maintain technical documentation (Annex XI), provide downstream integration documentation (Annex XII), have a copyright compliance policy, and publish a training data summary. GPAI with systemic risk (>10^25 FLOPs or designated) must additionally: perform adversarial testing, assess/mitigate systemic risks, report serious incidents, and ensure cybersecurity. Open-source GPAI exemptions apply for non-systemic models.

### Checks

- [ ] **GP-01** Model documentation: Technical documentation per Annex XI exists
- [ ] **GP-02** Downstream documentation: Integration info for downstream providers per Annex XII exists
- [ ] **GP-03** Copyright policy: Policy for respecting copyright reservations (Art. 4(3) Directive 2019/790) exists
- [ ] **GP-04** Training data summary: Publicly available summary of training data content exists
- [ ] **GP-05** Systemic risk assessment: If >10^25 FLOPs, model evaluation and adversarial testing are documented
- [ ] **GP-06** Incident reporting: Mechanism for reporting serious incidents to AI Office exists
- [ ] **GP-07** Open-source exemption: If claiming open-source exemption, verify weights and architecture are publicly available

### Discovery Strategy

```
Grep -ri "general.?purpose|foundation.?model|base.?model|large.?language|llm|gpai" -- GPAI identification
Grep -ri "flop|floating.?point.?operation|compute.?budget|training.?cost" -- compute scale
Grep -ri "copyright|license|opt.?out|robots.?txt|tdm.?reservation" -- copyright handling
Grep -ri "model.?card|model.?documentation|model.?sheet" -- model documentation
Grep -ri "incident.?report|serious.?incident|notify.*authority" -- incident reporting
Glob("**/model-card*"), Glob("**/MODEL_CARD*"), Glob("**/model_documentation*") -- model docs
```

### Anti-patterns

- GPAI model distributed without any model card or technical documentation
- No copyright compliance policy when training on web-scraped data
- No training data summary published for general-purpose model
- Large-scale model with no adversarial testing documentation
- No incident reporting mechanism for systemic risk models

---

## 11. Deployer Obligations (Art. 26-27)

**Fine tier**: €15M or 3% global turnover
**Applies from**: 2 August 2026

**What the regulation requires**: Deployers must: use high-risk AI per provider instructions, assign qualified human overseers, monitor operation, keep logs (≥6 months), inform workers before workplace deployment, inform affected persons about AI-driven decisions, and perform fundamental rights impact assessments (for public bodies and certain private deployers).

### Checks

- [ ] **DO-01** Usage conformity: System is used within its documented intended purpose
- [ ] **DO-02** Input data quality: Deployer-controlled input data is validated for relevance and representativeness
- [ ] **DO-03** Worker notification: If workplace AI, mechanism exists to inform workers
- [ ] **DO-04** Affected person notification: Persons subject to AI decisions are informed per Art. 26(11)
- [ ] **DO-05** FRIA support: System supports fundamental rights impact assessment data collection
- [ ] **DO-06** DPIA integration: System provides data for data protection impact assessments (Art. 35 GDPR link)
- [ ] **DO-07** Suspension capability: Deployers can suspend use when risk is identified

### Discovery Strategy

```
Grep -ri "intended.?purpose|usage.?policy|terms.?of.?use|acceptable.?use" -- usage documentation
Grep -ri "worker.?notif|employee.?notice|staff.?inform|workplace.?ai" -- worker notification
Grep -ri "impact.?assess|fria|fundamental.?right|dpia|data.?protection.?impact" -- impact assessments
Grep -ri "suspend|pause|disable|decommission" -- suspension mechanisms
```

### Anti-patterns

- AI used for purposes not described in provider documentation
- Workplace AI deployed with no employee notification mechanism
- No mechanism for affected persons to learn they're subject to AI decisions
- No integration point for impact assessment data collection

---

## 12. AI Literacy (Art. 4)

**Fine tier**: Not directly fined but contributes to compliance posture
**Applies from**: 2 February 2025

**What the regulation requires**: Providers and deployers must ensure sufficient AI literacy of staff and other persons dealing with AI system operation and use, considering their technical knowledge, experience, context of use, and the persons affected.

### Checks

- [ ] **AL-01** Training documentation: Evidence of AI literacy training materials or programs in the repo
- [ ] **AL-02** User guidance: End-user documentation explains AI aspects in accessible language
- [ ] **AL-03** Developer guidance: Internal docs guide developers on responsible AI practices

### Discovery Strategy

```
Grep -ri "training.?material|onboard|literacy|responsible.?ai|ethical.?ai" -- training materials
Glob("**/training/**"), Glob("**/onboarding/**"), Glob("**/guides/**") -- training directories
Grep -ri "code.?of.?conduct|ai.?ethics|ai.?principle|responsible.?use" -- responsible AI policies
```

### Anti-patterns

- No documentation on AI system behaviour aimed at non-technical users
- No internal guidelines on responsible AI development practices
- Complex AI system with no explanation of what it does for end users
