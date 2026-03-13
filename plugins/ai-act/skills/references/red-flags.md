# EU AI Act Red Flags

Quick-scan anti-patterns organised by severity for rapid compliance triage.

## Severity Levels

| Level | Meaning | Fine Tier |
|-------|---------|-----------|
| 🔴 CRITICAL | Likely violation of prohibited practices or high-risk requirements with maximum penalties | €35M / 7% turnover |
| 🟠 HIGH | Significant regulatory risk — missing core requirements for high-risk systems | €15M / 3% turnover |
| 🟡 MEDIUM | Best practice gaps — partial compliance, missing documentation or safeguards | €7.5M / 1% turnover |
| 🟢 LOW | Hardening opportunities — improvements that strengthen compliance posture | Advisory |

---

## 🔴 CRITICAL Red Flags

### C-01: Prohibited Practice — Emotion Detection in Workplace/Education
**Article**: 5(1)(f)
**Pattern**: Emotion recognition or sentiment analysis applied to employees or students.
```
Grep -ri "emotion.*employ|emotion.*worker|emotion.*student|emotion.*hr"
Grep -ri "sentiment.*employ|mood.*track.*work|affect.*detect.*class"
Grep -ri "emotion.*recognition.*(?:workplace|school|education|office)"
```
**Signal**: AI model classifying emotions/moods in HR, education, or productivity context.

### C-02: Prohibited Practice — Social Scoring
**Article**: 5(1)(c)
**Pattern**: Aggregating behavioural data across contexts to score/classify individuals.
```
Grep -ri "social.?score|citizen.?score|trust.?score|reputation.?system"
Grep -ri "behavior.*score.*(?:cross|multiple|different).*context"
Grep -ri "aggregate.*behavi.*score|cumulative.*trust"
```
**Signal**: User scoring system that combines data from unrelated contexts for adverse treatment.

### C-03: Prohibited Practice — Subliminal Manipulation
**Article**: 5(1)(a)
**Pattern**: AI techniques designed to influence behaviour below conscious awareness.
```
Grep -ri "subliminal|below.*conscious|dark.?pattern|manipulat.*ai"
Grep -ri "nudge.*engine|persuasion.*engine|behaviour.*modif.*ai"
Grep -ri "addictive.*design|engagement.*optimiz.*ai|hook.*model"
```
**Signal**: AI-driven dark patterns, addictive design optimisation, or manipulation engines.

### C-04: Prohibited Practice — Untargeted Facial Scraping
**Article**: 5(1)(e)
**Pattern**: Building facial recognition databases from internet/CCTV without targeted purpose.
```
Grep -ri "scrape.*face|crawl.*face|collect.*facial|harvest.*image"
Grep -ri "face.*database.*build|face.*index.*create|face.*corpus"
Grep -ri "cctv.*face.*extract|camera.*face.*collect"
```
**Signal**: Any code that scrapes or crawls for facial images to build identification databases.

### C-05: Prohibited Practice — Biometric Categorisation of Protected Characteristics
**Article**: 5(1)(g)
**Pattern**: Using biometrics to infer race, religion, political opinions, sexual orientation, etc.
```
Grep -ri "biometric.*race|biometric.*ethnic|biometric.*religion"
Grep -ri "face.*classify.*(?:race|gender|age|ethnic|religion)"
Grep -ri "predict.*(?:race|ethnic|religion|political|sexual).*from.*(?:face|voice|body)"
```
**Signal**: Classification model that takes biometric input and outputs protected characteristics.

### C-06: High-Risk System with Zero Compliance
**Article**: 6, 8-15
**Pattern**: System clearly in Annex III scope with no compliance measures whatsoever.
```
Grep -ri "recruit.*ai|hiring.*algorithm|cv.*scor|resume.*rank"
Grep -ri "credit.*scor.*model|loan.*approv.*ai|insurance.*pric.*ai"
Grep -ri "student.*grade.*ai|admission.*predict|learning.*assess.*ai"
```
**Signal**: AI system in recruitment, credit scoring, education assessment, or similar high-risk area with no risk management, logging, transparency, or human oversight measures.

---

## 🟠 HIGH Red Flags

### H-01: No AI-Specific Logging
**Article**: 12
**Pattern**: AI system operates without any inference logging.
```
Grep -ri "predict|infer|classify|recommend|generate|score"
```
Then verify absence of logging around those code paths:
```
Grep -ri "log.*predict|log.*infer|log.*decision|log.*score|audit.*ai"
```
**Signal**: AI endpoints found but no corresponding logging calls nearby.

### H-02: No Human Override Mechanism
**Article**: 14
**Pattern**: AI decisions flow directly to actions with no human intervention point.
```
Grep -ri "automat.*send|automat.*apply|automat.*reject|automat.*approv"
Grep -ri "direct.*action|immediate.*effect|no.*review|skip.*review"
```
**Signal**: AI output directly triggers consequential actions (rejections, approvals, notifications) without human review step.

### H-03: No AI Interaction Disclosure
**Article**: 50(1)
**Pattern**: User-facing AI system with no disclosure of AI nature.
```
Grep -ri "chat.*bot|virtual.*assist|convers.*ai|dialog.*system"
Grep -ri "automat.*reply|ai.*response|generat.*response"
```
Then verify absence of:
```
Grep -ri "ai.*disclos|bot.*notice|powered.*by.*ai|generat.*by.*ai"
```
**Signal**: Conversational AI or interactive system with no AI disclosure.

### H-04: No Input Validation on AI Endpoints
**Article**: 15
**Pattern**: AI inference endpoints accept unvalidated input.
```
Grep -ri "predict.*endpoint|infer.*endpoint|model.*serve|ai.*api"
```
Then verify absence of input validation:
```
Grep -ri "valid.*input|sanitiz|schema.*check|type.*check"
```
**Signal**: AI endpoints found without corresponding input validation.

### H-05: Generated Content Without Provenance Marking
**Article**: 50(2)
**Pattern**: AI generates synthetic content (image, audio, video, text) without machine-readable marking.
```
Grep -ri "generat.*image|generat.*audio|generat.*video|text.*generat"
Grep -ri "dall.?e|stable.?diffusion|midjourney|whisper|tts|text.?to.?speech"
```
Then verify absence of:
```
Grep -ri "watermark|c2pa|content.?credential|provenance|metadata.*ai"
```
**Signal**: Content generation features without any provenance marking mechanism.

### H-06: No Risk Assessment for High-Risk System
**Article**: 9
**Pattern**: System in Annex III area with no risk management artefacts.
```
Grep -ri "risk.*assess|risk.*manag|risk.*register|hazard|threat.*model"
```
**Signal**: Complete absence of risk management files in a high-risk system.

### H-07: Model Loaded Without Integrity Check
**Article**: 15(5)
**Pattern**: ML model files loaded from external sources without hash verification.
```
Grep -ri "download.*model|fetch.*model|load.*url|http.*\.pt|http.*\.h5"
Grep -ri "from_pretrained|load_model|torch.load|pickle.load"
```
Then verify absence of:
```
Grep -ri "checksum|hash|sha256|verify.*integrit|signature"
```
**Signal**: Models downloaded or loaded without integrity verification.

---

## 🟡 MEDIUM Red Flags

### M-01: No Bias Testing
**Article**: 10(2)(f)-(g)
**Pattern**: AI system with no fairness or bias evaluation.
```
Grep -ri "bias|fairness|disparate|demographic|subgroup.*evaluat"
```
**Signal**: Complete absence of bias-related testing or metrics.

### M-02: No Performance Thresholds in Tests
**Article**: 9(8)
**Pattern**: Test suite present but no defined accuracy/performance acceptance criteria.
```
Grep -ri "assert.*accuracy|assert.*precision|minimum.*score|threshold.*test"
```
**Signal**: Tests check code correctness but never assert model performance levels.

### M-03: Insufficient Log Retention
**Article**: 19
**Pattern**: Log retention configured below 6 months.
```
Grep -ri "retention.*[0-5].*month|ttl.*[1-9][0-9]?d|expire.*[1-9][0-9]?.*day"
Grep -ri "rotate.*daily|rotate.*weekly|keep.*7.*day|keep.*30.*day"
```
**Signal**: Log rotation or TTL settings that would delete AI logs before the 6-month minimum.

### M-04: No Explainability Layer
**Article**: 13(1)
**Pattern**: AI outputs provided without any explanation mechanism.
```
Grep -ri "shap|lime|explain|feature.?importan|attention.*visual"
Grep -ri "confidence|probability|uncertain|reason|justif"
```
**Signal**: AI returns decisions/classifications with no explanation, confidence, or reasoning.

### M-05: No Drift or Degradation Monitoring
**Article**: 9(2)(c), 72
**Pattern**: Deployed AI with no performance monitoring.
```
Grep -ri "drift|degrad|decay|monitor.*model|monitor.*perform"
Grep -ri "data.*quality.*monitor|distribution.*shift|concept.*drift"
```
**Signal**: Model deployed without any ongoing performance monitoring.

### M-06: Training Data Without Provenance
**Article**: 10(2)(b)
**Pattern**: Data files or loading code with no source documentation.
```
Grep -ri "data.*load|read.*csv|read.*parquet|dataset.*path"
```
Then verify absence of:
```
Grep -ri "source|origin|provenance|collected.*from|data.*card"
```
**Signal**: Data loading code with no documentation of data origin.

### M-07: No Worker Notification for Workplace AI
**Article**: 26(7)
**Pattern**: AI deployed in workplace context without employee notification mechanism.
```
Grep -ri "employee|worker|staff|team.*member|colleague"
Grep -ri "performance.*review|productivity.*track|workforce"
```
Then verify absence of:
```
Grep -ri "notify.*worker|inform.*employee|worker.*notice|consent.*employ"
```
**Signal**: Workplace AI with no notification mechanism for affected workers.

---

## 🟢 LOW Red Flags

### L-01: No Dependency Vulnerability Scanning for ML Libraries
**Article**: 15
**Pattern**: ML dependencies without security monitoring.
```
Glob("**/.snyk"), Glob("**/dependabot*"), Glob("**/.github/dependabot*")
Grep -ri "safety.*check|audit.*npm|pip.*audit|snyk|trivy|grype"
```
**Signal**: Absence of dependency scanning tools, especially for ML-specific packages.

### L-02: No Model Versioning
**Article**: 11, 17
**Pattern**: Model files without version control or registry.
```
Grep -ri "model.*version|model.*registry|mlflow|dvc|wandb|neptune"
```
**Signal**: Model files managed ad-hoc without systematic versioning.

### L-03: No AI Ethics Documentation
**Article**: 4
**Pattern**: No responsible AI or ethics guidelines.
```
Grep -ri "ethic|responsible.*ai|ai.*principle|code.*conduct"
Glob("**/ETHICS*"), Glob("**/RESPONSIBLE*"), Glob("**/AI_PRINCIPLES*")
```
**Signal**: No ethical guidelines or responsible AI documentation.

### L-04: No Accessibility Considerations
**Article**: 16(l), 50(5)
**Pattern**: AI system UI without accessibility features.
```
Grep -ri "aria|wcag|a11y|accessible|screen.?reader|alt.?text"
```
**Signal**: User-facing AI interface with no accessibility attributes.

### L-05: No Incident Response Plan
**Article**: 73
**Pattern**: No documented incident response for AI-specific failures.
```
Grep -ri "incident.*plan|incident.*response|runbook|playbook.*ai"
Grep -ri "on.?call|escalation|severity.*level|post.?mortem"
```
**Signal**: General ops incident response but nothing specific to AI system failures or serious incidents.

---

## Universal Quick Scan

Run these patterns on any codebase for an instant compliance signal:

### Step 1: Find AI components
```
Grep -rli "openai|anthropic|tensorflow|torch|sklearn|langchain|huggingface|predict|inference|model.*load"
```

### Step 2: Check for prohibited practices
```
Grep -ri "emotion.*(?:work|employ|school|student)|social.?score|scrape.*face|subliminal"
```

### Step 3: Check for basic compliance measures
```
Grep -ri "audit.*log|risk.*manage|human.*oversight|ai.*disclos|bias.*test|explainab"
```

### Step 4: Assess risk tier
If AI components found in Step 1, check against Annex III areas:
```
Grep -ri "recruit|hiring|credit.*scor|admission|grade|triage|biometric|law.?enforc"
```

### Interpreting quick scan results

- **Step 1 empty**: Codebase may not contain AI systems — verify manually
- **Step 2 matches**: Immediate investigation needed — potential prohibited practice
- **Step 3 empty**: Significant compliance gaps if AI components exist
- **Step 4 matches**: System likely high-risk — full audit recommended

---

## Scanning Strategy

### Quick Scan (~3-5 minutes)
1. Run Universal Quick Scan steps 1-4
2. Scan for all CRITICAL red flags
3. Summarise findings with severity

### Full Audit (~15-25 minutes)
1. Phase 0: Stack discovery
2. Phase 1: Domain mapping using data-flows.md
3. Phase 2: Work through every checklist.md category
4. Cross-reference with technical-measures.md
5. Verify against all red flags
6. Phase 3: Generate scored report

### Incremental Scan (for CI/CD)
Focus on changed files only:
1. Identify changed files (via git diff or PR files)
2. Run red flag patterns on changed files
3. If AI components are modified, check logging, validation, and transparency
4. Report new findings only
