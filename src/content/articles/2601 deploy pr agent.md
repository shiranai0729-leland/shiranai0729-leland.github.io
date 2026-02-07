---
title: "Deploying a Self-Hosted AI Code Reviewer"
description: "A battle-tested guide to deploying a self-hosted AI code reviewer using pr-agent, Docker, and SiliconFlow. Learn how to overcome infinite restarts, authentication errors, and configuration hell."
pubDate: "Feb 6 2026"
tags: ["AI", "DevOps", "Docker", "GitHub", "Self-Hosted"]
---

## The Goal

We wanted a **self-hosted GitHub App** that:

1. Listens for Pull Request events.
2. Automatically reviews code using a powerful LLM (Qwen via SiliconFlow).
3. Posts comments directly in the PR.
4. Runs via Docker Compose on a cloud server (GCP).

## Phase 1: The Setup

Before touching the server, you need the "identity" for your bot.

### 1. Create a GitHub App

Don't use a personal account and a PAT (Personal Access Token). Create a **GitHub App**.

* **Permissions:**
  * `Pull Requests`: Read & Write (Essential for reviewing).
  * `Issues`: Read & Write (Essential for commenting).
  * `Contents`: Read-only.
* **Events:** Subscribe to `pull_request` and `issue_comment`.
* **Keys:** Generate a Private Key (`.pem`) and note down the `App ID`.

### 2. The Model Provider

We initially tried OpenRouter but ran into compatibility issues with the underlying library (`litellm`). We switched to **SiliconFlow** (SiliconCloud) using the **Qwen** model. It provides a stable, OpenAI-compatible API endpoint that plays nicely with the bot.

---

## Phase 2: The Troubleshooting Chronicles

Here are the four major "Boss Battles" we fought during deployment.

### Boss 1: The "Infinite Restart" Loop

**The Symptom:** We ran `docker compose up`, and the container kept crashing and restarting.

**The Error:**

```text
usage: cli.py --pr_url=<URL> <command>
cli.py: error: the following arguments are required: command
```

**The Cause:** The official Docker image’s default `ENTRYPOINT` is set to run the CLI tool (`cli.py`), which expects a URL immediately. We needed the *server* mode.

**The Fix:** We had to override the entrypoint in `docker-compose.yml` to force it to run the GitHub App server.

```yaml
entrypoint: ["python", "-m", "pr_agent.servers.github_app"]
```

### Boss 2: The "BoxKeyError" (Dynaconf Hell)

**The Symptom:**

```text
dynaconf.vendor.box.exceptions.BoxKeyError: "'DynaBox' object has no attribute 'private_key'"
```

**The Cause:** `pr-agent` uses `Dynaconf` for configuration. It expects settings in a specific dictionary structure. When we tried to pass the path to the key (`GITHUB__PRIVATE_KEY_PATH`), the application logic seemingly ignored it and stubbornly looked for the raw key content (`private_key`), crashing when it wasn't found.

**The Fix:** We stopped fighting the file path logic and performed a "brute force injection." We read the `.pem` file content and passed it directly as an environment variable string.

```yaml
environment:
  - GITHUB__PRIVATE_KEY=${GITHUB_PRIVATE_KEY_CONTENT}
```

### Boss 3: The 404/405 Webhook Mystery

**The Symptom:** GitHub delivered the webhook, but the server returned `404 Not Found` or `405 Method Not Allowed`.

**The Cause:**

* We pointed GitHub to `http://IP:3000/`. (Wrong)
* We pointed GitHub to `http://IP:3000/webhook`. (Wrong)

**The Fix:** The FastAPI server inside the container listens on a very specific path.

**Correct URL:** `http://<YOUR_IP>:3000/api/v1/github_webhooks`

### Boss 4: The "No Cookie Auth" & Provider Identity Crisis

**The Symptom:**

```text
litellm.AuthenticationError: OpenAIException - No cookie auth credentials found
```

**The Cause:** This was the trickiest one. When we used the model name `openrouter/...`, the `LiteLLM` library (which powers the bot) tried to use a browser-based authentication method instead of a standard API Key. It thought we were trying to hack into a web interface instead of using an API.

**The Fix:**

1. **Lie to the bot:** We told it the provider is `openai`.
2. **Point the Base URL elsewhere:** We set the `OPENAI__API_BASE` to SiliconFlow.
3. **Prefix Magic:** We used `openai/` in the model name to force standard Bearer Token authentication, but pointed it to the Qwen model.

---

## Phase 3: The Final, Working Configuration

If you want to replicate our success, here is the battle-tested `docker-compose.yml`.

**Prerequisites in `.env` file:**

```bash
GITHUB_APP_ID=123456
# Paste your entire PEM key content here, preserving newlines as \n
GITHUB_PRIVATE_KEY_CONTENT="-----BEGIN RSA PRIVATE KEY-----\nMIIE...\n-----END RSA PRIVATE KEY-----"
SILICONFLOW_API_KEY=sk-your-key-here
```

**The `docker-compose.yml`:**

```yaml
services:
  pr-agent:
    image: codiumai/pr-agent:latest
    container_name: pr-agent
    ports:
      - "3000:3000"
    restart: always
    # CRITICAL: Override the CLI entrypoint to run the server
    entrypoint: ["python", "-m", "pr_agent.servers.github_app"]
    
    environment:
      # --- GitHub App Configuration ---
      - GITHUB__DEPLOYMENT_TYPE=app
      - GITHUB_APP__PUSH_TRIGGER_PENDING_TASKS_TTL=300
      - GITHUB__RATELIMIT_RETRIES=5
      - GITHUB__APP_ID=${GITHUB_APP_ID}
      # Inject key content directly to avoid path resolution errors
      - GITHUB__PRIVATE_KEY=${GITHUB_PRIVATE_KEY_CONTENT}

      # --- AI Model Configuration (SiliconFlow / Qwen) ---
      # We use the 'openai/' prefix to force standard API authentication
      - CONFIG__MODEL=openai/Qwen/Qwen2.5-72B-Instruct
      - OPENAI__API_BASE=https://api.siliconflow.cn/v1
      - OPENAI__KEY=${SILICONFLOW_API_KEY}

      # --- Critical Fixes ---
      # Manually set max tokens, otherwise it crashes on unknown models
      - CONFIG__CUSTOM_MODEL_MAX_TOKENS=100000
      # Disable fallback to prevent it from trying OpenAI when Qwen fails
      - CONFIG__FALLBACK_MODELS=[]
      
      # --- Customization ---
      - PR_REVIEWER__EXTRA_INSTRUCTIONS=Please speak in Chinese.

    volumes:
      # Optional: Map key if you still want to try path-based loading
      - ./pr_agent.pem:/app/pr_agent.pem
```

## How to Test It

1. **Start the bot:** `docker compose up -d`
2. **Configure GitHub Webhook:** Point it to `http://<YOUR_SERVER_IP>:3000/api/v1/github_webhooks`.
3. **Trigger:** Go to a Pull Request and comment:

```text
/review
```

4. **Profit:** Watch the logs (`docker compose logs -f`) as it fetches your code, sends it to SiliconFlow, and posts a review in Chinese!

## Conclusion

Deploying AI agents is rarely "plug and play." It often requires understanding the layers between the Docker container, the configuration manager, and the LLM client library.

By standardizing on the `openai` protocol (even when not using OpenAI) and being explicit with configuration variables, we turned a crashing container into a stable, helpful code review assistant.

Happy Debugging! 🚀