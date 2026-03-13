# AI System Data Flow Tracing Guide

How to trace AI system data flows through any codebase for EU AI Act compliance.

The AI Act cares about: what data enters the AI system, how it's processed, what decisions/outputs it produces, who is affected, and what logs are kept. This guide provides discovery strategies for mapping these flows.

## Table of Contents

1. [AI System Identification](#1-ai-system-identification)
2. [Input Data Flows](#2-input-data-flows)
3. [Processing & Decision Logic](#3-processing--decision-logic)
4. [Output & Impact Flows](#4-output--impact-flows)
5. [Storage & Retention Mapping](#5-storage--retention-mapping)
6. [Lifecycle Tracing](#6-lifecycle-tracing)
7. [Third-Party AI Integration](#7-third-party-ai-integration)

---

## 1. AI System Identification

### What qualifies as an "AI system" (Art. 3(1))

A machine-based system designed to operate with varying levels of autonomy, that may exhibit adaptiveness after deployment, and that infers from input how to generate outputs (predictions, content, recommendations, decisions) that can influence physical or virtual environments.

### Discovery patterns

**ML model files and references:**
```
Glob("**/*.pt"), Glob("**/*.pth"), Glob("**/*.h5"), Glob("**/*.hdf5")
Glob("**/*.onnx"), Glob("**/*.pkl"), Glob("**/*.joblib"), Glob("**/*.safetensors")
Glob("**/*.tflite"), Glob("**/*.pb"), Glob("**/*.mlmodel"), Glob("**/*.pmml")
Grep -ri "model.?load|load.?model|from.?pretrained|model.?path"
```

**AI/ML library imports:**
```
Grep -ri "import.*openai|import.*anthropic|import.*langchain|import.*llama"
Grep -ri "import.*tensorflow|import.*torch|import.*keras|import.*sklearn"
Grep -ri "import.*transformers|import.*huggingface|import.*spacy|import.*nltk"
Grep -ri "import.*xgboost|import.*lightgbm|import.*catboost"
Grep -ri "from.*azure.*openai|from.*google.*generative|from.*cohere"
```

**AI service API calls:**
```
Grep -ri "api\.openai|chat\.completion|embedding|dall-e|whisper"
Grep -ri "bedrock|sagemaker|vertex.?ai|azure.*cognitive|azure.*openai"
Grep -ri "replicate|together\.ai|groq|mistral|perplexity"
Grep -ri "completions|generate|predict|inference|embed"
```

**Configuration files:**
```
Grep -ri "model.?name|model.?id|model.?version|model.?endpoint|deployment.?name"
Grep -ri "temperature|top.?p|max.?tokens|stop.?sequence|system.?prompt"
Glob("**/*model*config*"), Glob("**/*ai*config*"), Glob("**/*ml*config*")
```

### Mapping output

For each AI system found, record:
- **Identifier**: File path or component name
- **Type**: ML model / LLM API / rule-based-with-ML / hybrid
- **Provider role**: Are you the provider (built it) or deployer (using it)?
- **Autonomy level**: Fully autonomous / human-in-the-loop / advisory
- **Adaptiveness**: Static model / fine-tuned / continuously learning

---

## 2. Input Data Flows

### What the AI Act cares about

Art. 10 requires data governance for training data. Art. 12 requires logging of inputs. Art. 26(4) requires deployers to ensure input data relevance. Understanding what data enters the AI system is foundational.

### Data collection points

```
Grep -ri "upload|ingest|import|collect|scrape|crawl|fetch.*data"
Grep -ri "form.?data|request\.body|req\.body|payload|input.?data"
Grep -ri "user.?input|query|prompt|message|chat.?history"
Grep -ri "camera|microphone|sensor|iot|stream|feed"
```

### Personal data identification

```
Grep -ri "name|email|phone|address|birth|ssn|national.?id|passport"
Grep -ri "biometric|face|fingerprint|voice.?print|retina|iris"
Grep -ri "health|medical|diagnosis|symptom|prescription"
Grep -ri "salary|income|credit|bank|financial"
Grep -ri "location|gps|ip.?address|device.?id|cookie"
Grep -ri "race|ethnic|religion|political|sexual|gender|disability"
```

### Data transformation before AI

```
Grep -ri "preprocess|transform|normaliz|tokeniz|embed|vectoriz|featur"
Grep -ri "encode|decode|serialize|deserialize|marshal"
Grep -ri "clean|filter|deduplic|validate.*input|sanitiz"
```

### Mapping output

For each AI system, document:
- **Input sources**: Where does data come from? (user, database, API, sensor, file)
- **Personal data**: What personal data enters the AI system?
- **Special categories**: Any Art. 9 GDPR data? (health, biometric, political, religious)
- **Preprocessing**: What transformations happen before inference?
- **Consent basis**: What legal basis for processing? (relevant for Art. 10(5))

---

## 3. Processing & Decision Logic

### AI inference paths

```
Grep -ri "predict|infer|classify|recommend|generate|complete|score"
Grep -ri "forward|__call__|run.?model|invoke|execute"
Grep -ri "pipeline|chain|agent|workflow|orchestrat"
Grep -ri "prompt.?template|system.?message|few.?shot|rag"
```

### Decision logic around AI outputs

```
Grep -ri "threshold|cutoff|decision.?boundary|confidence.?level"
Grep -ri "if.*score|if.*probability|if.*confidence|if.*predict"
Grep -ri "approved|rejected|denied|granted|eligible|qualified"
Grep -ri "rank|sort|priorit|filter.*result|select.*candidate"
```

### Chained AI systems

```
Grep -ri "chain|pipe|sequential|cascade|ensemble|multi.?agent"
Grep -ri "first.*model.*then|output.*input|result.*feed"
```

### Mapping output

For each AI decision path, document:
- **Decision type**: Classification / scoring / generation / recommendation / routing
- **Autonomy**: Does the AI decide alone or advise a human?
- **Threshold logic**: How are AI outputs translated into actions?
- **Chain depth**: How many AI systems are involved in the final output?
- **Affected persons**: Who is impacted by this decision?

---

## 4. Output & Impact Flows

### Where AI outputs go

```
Grep -ri "response|result|output|return|send|emit|publish|dispatch"
Grep -ri "notify|alert|email|sms|push.?notif|webhook"
Grep -ri "store.*result|save.*prediction|persist.*output|write.*decision"
Grep -ri "display|render|show|present|ui|frontend|client"
```

### Impact on natural persons

```
Grep -ri "user|person|individual|citizen|applicant|candidate|patient|student"
Grep -ri "accept|reject|deny|approve|eligib|score|rank|rate|classify"
Grep -ri "automat.*decision|algorithmic.*decision|ai.*decision"
```

### Content generation outputs

```
Grep -ri "generat.*text|generat.*image|generat.*audio|generat.*video"
Grep -ri "synthesiz|deepfake|avatar|voice.?clone|text.?to.?speech"
Grep -ri "content.*creat|article.*generat|summary.*generat"
```

### Mapping output

For each output flow, document:
- **Output type**: Decision / content / recommendation / notification
- **Recipients**: Who sees or is affected by the output?
- **Reversibility**: Can the AI's output be corrected or reversed?
- **Transparency**: Is the AI's role in producing this output disclosed?
- **Content marking**: Is generated content marked as AI-produced?

---

## 5. Storage & Retention Mapping

### Primary data stores

```
Grep -ri "database|mongodb|postgres|mysql|sqlite|redis|elasticsearch"
Grep -ri "firestore|dynamodb|cosmos|bigtable|spanner"
Grep -ri "s3|blob.?storage|gcs|azure.?storage|minio"
Grep -ri "connection.?string|database.?url|db.?host|db.?name"
```

### Log and audit stores

```
Grep -ri "log.?store|audit.?store|event.?store|telemetry.?store"
Grep -ri "cloudwatch|stackdriver|datadog|splunk|elastic|kibana"
Grep -ri "event.?hub|kafka|kinesis|pub.?sub|rabbit"
```

### Retention configuration

```
Grep -ri "ttl|expir|retention|lifecycle|purge|archive|delete.?after"
Grep -ri "days|months|keep.?for|rotate|max.?age"
```

### Mapping output

For each storage location, document:
- **What's stored**: Training data / inputs / outputs / logs / model artefacts
- **Storage type**: Database / object store / log service / file system
- **Retention period**: How long is data kept? (minimum 6 months for AI logs per Art. 19)
- **Access controls**: Who can access this data?
- **Deletion capability**: Can data be deleted on request?

---

## 6. Lifecycle Tracing

### Model development → deployment → monitoring → retirement

**Training phase:**
```
Glob("**/train*"), Glob("**/notebook*"), Glob("**/*.ipynb")
Grep -ri "fit|train|epoch|batch|learning.?rate|optimizer|loss"
```

**Evaluation phase:**
```
Grep -ri "evaluat|benchmark|metric|accuracy|precision|recall|f1"
Grep -ri "test.?set|validation.?set|holdout|cross.?valid"
```

**Deployment phase:**
```
Grep -ri "deploy|serve|endpoint|api|container|lambda|function"
Glob("**/Dockerfile*"), Glob("**/k8s/**"), Glob("**/helm/**")
```

**Monitoring phase:**
```
Grep -ri "monitor|observ|prometheus|grafana|dashboard|health.?check"
Grep -ri "drift|decay|performance.?drop|data.?quality.?monitor"
```

**Update/retirement:**
```
Grep -ri "version|rollback|canary|blue.?green|a.?b.?test|deprecat"
Grep -ri "retrain|update.?model|refresh|rollout"
```

---

## 7. Third-Party AI Integration

### External AI service dependencies

```
Grep -ri "api.?key|api.?token|bearer|authorization.*key"
Grep -ri "openai|anthropic|google.*ai|azure.*ai|aws.*ai|hugging.?face"
Grep -ri "sdk|client|wrapper|adapter|connector"
```

### Mapping output

For each third-party AI service:
- **Provider**: Who provides the AI model/service?
- **Model**: Which specific model is used?
- **Data shared**: What data is sent to the third party?
- **Responsibility**: Who is the "provider" vs "deployer" under Art. 25?
- **Documentation**: Does the third party provide Annex XII integration docs?
- **Processing location**: Where is data processed? (EU/non-EU relevance)
