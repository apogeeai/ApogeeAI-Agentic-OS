# OpenClaw System Overview

## What It Is

OpenClaw is an autonomous multi-agent AI platform running on VM 105 (Proxmox LXC, user `apogeeai`). It coordinates 7 core agents across 7 tenants (6 revenue empires + 1 internal operations), backed by 17 golden skill bundles, local + cloud LLMs, Redis stream coordination, and a Founder OS C-suite layer that wraps it all into a virtual company. The system's purpose is escape velocity: generate enough autonomous income to cover all costs and living expenses without daily human involvement.

---

## Architecture

```
                         ADAM (Human)
                            |
                      [Telegram Bot]
                            |
                    +-------v--------+
                    | OpenClaw       |
                    | Gateway        |     Port 18789 (loopback)
                    | v2026.4.24     |     openclaw-gateway.service
                    +-------+--------+
                            |
               +------------+-------------+
               |                          |
      +--------v--------+       +--------v--------+
      |   OPENCLAW       |       |   FOUNDER OS     |
      |   7 Agents        |       |   C-Suite Layer  |
      |   (openclaw.json) |       |   /opt/founder-os|
      +--------+--------+       +--------+--------+
               |                          |
      +--------v--------+       +--------v--------+
      |  17 Golden Skills|       |  8 C-Suite Roles |
      |  (skill bundles) |       |  CEO/CTO/CMO/... |
      +--------+--------+       +--------+--------+
               |                          |
      +--------v--------+       +--------v--------+
      |  Agent Swarm     |       |  14 Sub-Agents   |
      |  40+ workspaces  |       |  analytics,audio |
      |  4 pipelines     |       |  designer,editor |
      +---------+--------+       +--------+--------+
                |                          |
       +--------v--------------------------v--------+
       |              REDIS 6379 (local)             |
       |  88 keys | 25+ streams | kanban | budgets   |
       +--------+----------------------------------+
                |
       +--------v--------+       +------------------+
       | Postgres 5432    |       | Sage AI Rig      |
       | swarm_ops DB     |       | 192.168.0.225    |
       | episodic_memory  |       | RTX 3090s/4090   |
       | approvals.db     |       | vLLM :8000/:8001 |
       +-----------------+       | Ollama :11434    |
                                  +------------------+
                                          |
                                  +-------v----------+
                                  | ComfyUI LXC      |
                                  | Image/Video Gen   |
                                  +------------------+

       +------------------+
       | LXC 109 (Claude) |
       | Claude Code      |
       | GSD execution    |
       | Golden Skills    |
       | Bed CEO          |
       +------------------+
```

---

## Core Agents (openclaw.json)

| Agent | Role | Tools | Can Spawn | Model |
|-------|------|-------|-----------|-------|
| **DIRECTOR** (main) | Routes tasks, decomposes goals, orchestrates all other agents | sessions_spawn, sessions_list, sessions_send, session_status, read, write, exec | maker, builder, seller, ops, wiggum, skill_reviewer | Qwen 3.6 35B Abliterated |
| **MAKER** | Content creation, briefs, social posts, creative output | read, write, exec, sessions_spawn | wiggum | Qwen 3.6 35B Abliterated |
| **BUILDER** | Technical implementation -- code, audio, video, ComfyUI workflows | read, write, exec | none | Qwen 3.6 35B Abliterated |
| **SELLER** | Sales, outreach, marketplace listings, lead generation | read, write, exec | none | Qwen 3.6 35B Abliterated |
| **OPS** | Infrastructure, cost tracking, dashboard, system health | read, write, exec | none | Qwen 3.6 35B Abliterated |
| **WIGGUM** | Policy enforcement, quality gate, compliance, brand voice | read, write | none | Qwen 3.6 35B Abliterated |
| **SKILL_REVIEWER** | Reviews and vets new skill bundles before deployment | read, write | none | Qwen 3.6 35B Abliterated |

---

## Founder OS C-Suite (/opt/founder-os/)

The C-suite is a higher-level orchestration layer that wraps the OpenClaw agents into a virtual company structure. Each role has a SOUL.md contract, workers, prompts, config, KPIs, and per-tenant memory.

| Role | Code | Mission | Status |
|------|------|---------|--------|
| **CEO** | ceo | Routes briefs to execs, decomposes goals, tracks execution | Functional (rule-based routing) |
| **CTO** | cto | Recursive self-upgrade, healing, profiling, refactoring | Stub |
| **CMO** | cmo | Brand, content, distribution, audience growth | Functional (writes drafts) |
| **CIO** | cio | Data-to-decisions, analytics, competitive intel | Stub |
| **CSO** | cso | Sales pipeline, outreach, CRM, deal flow | Stub |
| **CRO** | cro | Conversion-rate optimization, funnel analysis, pricing experiments | Stub |
| **Creative Director** | creative | Brand voice steward, final approval gate between CMO and publish | Stub |
| **Support** | support | Keep the lights on -- job management, onboarding, log rotation | Stub |

### C-Suite Communication (Redis Streams)

```
Owner brief --> c-suite.briefs (XADD)
            --> CEO routes to c-suite.assignments (exec=<role>)
            --> Exec ACKs, does work, emits c-suite.kpis.<exec>
            --> c-suite.telegram-replies (back to Adam)
```

### Sub-Agents (under _agents/)

14 specialized agents wrapped under the C-suite roles:

| Agent | Wrapped Under | Purpose |
|-------|---------------|---------|
| director | CEO.Router | Brief routing (v3) |
| gsd_runner | CEO.Decomposer | SSHs to LXC 109, runs Claude Code tasks |
| claudia | CEO.OwnerBriefing | Morning briefing composer |
| trendscout | CMO/CIO | Trend research, competitor scanning |
| creative | CMO | Content strategy, brief authoring |
| tastemaker | CMO | Quality scoring gate (0-100, publish at 70+) |
| designer | CMO | Visual asset generation via ComfyUI |
| audio | CMO | 8D binaural audio, frequency generation |
| editor | CMO | Video editing, frame assembly |
| twitter_analyst | CMO | Twitter/X content analysis |
| community | CMO | Community management |
| analytics | CIO | Data analysis and reporting |
| rss_brief_agent | CIO | RSS feed monitoring and brief generation |
| test_wiggum_slow | (test) | Policy gate testing |

---

## Tenants / Empires

| Tenant ID | Name | Primary Metric | Channels | Weekly Budget |
|-----------|------|----------------|----------|---------------|
| **synaptive** | Synaptive Sounds | watch_time | YouTube Shorts, Twitter/X | $10 |
| **digital_influencer** | Digital Influencer | subscriber_count | TikTok, Instagram, Fanvue | $15 |
| **digital_products** | Digital Products | units_sold | Etsy, Gumroad, Shopify | $5 |
| **localbiz** | Local Business Growth | leads_generated | Email, Google Maps | $10 |
| **freelance** | Freelance Empire | gigs_completed | Fiverr, Upwork | $5 |
| **apogee_dashboard** | Apogee AI Dashboard | mrr | Web Dashboard, API | $20 |
| **internal_founder_os** | Founder OS Operations | system_health | Internal | Unlimited |

Each tenant has its own Redis prefix (`tenant:<id>:`), ntfy topic, and Telegram notifications enabled.

---

## Golden Skill Bundles (17 total)

Skill bundles are domain-knowledge packages loaded into agent context per task. Stored at `/home/claude/golden_skills/` (LXC 109) and deployed to `~/.openclaw/workspace/skills/` on the OpenClaw VM.

| # | Skill | Description | Agents | Empires |
|---|-------|-------------|--------|---------|
| 00 | empire-router | Tenant identification, routing tables, budget lookups | main | all |
| 01 | synaptive-sounds-bundle | Content pillars, frequency rules, SACRED pipeline, quality thresholds | maker, builder | synaptive |
| 02 | trend-scout | Research methodology, scoring criteria, trend-to-brief conversion | maker | synaptive, DI, products |
| 03 | taste-gate | Scoring rubric 0-100, publish threshold 70+, quality dimensions | maker, wiggum | synaptive, DI |
| 04 | creative-direction | Brief authoring, editorial calendar, brand voice per empire | maker | all content empires |
| 05 | audio-spatial-engine | 8D binaural panning, 432Hz/528Hz generation, ffmpeg audio chains | builder | synaptive, DI |
| 06 | visual-factory-comfyui | ComfyUI workflows, checkpoint selection, resolution configs, batch gen | builder | synaptive, DI, products |
| 07 | lora-training | LoRA fine-tuning, dataset prep, training hyperparameters | builder | DI |
| 08 | ltx2-video-motion | LTX2/Wan video generation, Higgsfield dance motion, frame interpolation | builder | DI, synaptive |
| 09 | social-publisher | Platform formatting, posting schedules, hashtag strategy, captions | maker | all content empires |
| 10 | marketplace-product-factory | Etsy/Gumroad/Shopify listings, SEO, pricing, mockup generation | maker, seller | products |
| 11 | localbiz-growth-engine | Lead prospecting, before/after visuals, cold outreach, CRM stages | seller, maker | localbiz |
| 12 | freelance-delivery-engine | Fiverr/Upwork profile optimization, gig delivery, quality checklists | seller, maker, builder | freelance |
| 13 | founder-os-dashboard-actions | Dashboard API, approval queue, KPI aggregation, tenant CRUD | ops, builder | apogee, internal |
| 14 | wiggum-policy-gate | Per-empire compliance, anti-slop patterns, security checklist | wiggum | all |
| 15 | cost-profit-ledger | Token cost tracking, API spend, per-tenant P&L, budget alerts, ROI | ops | all |
| 16 | di-image-pipeline (V6) | Z-Image Turbo + LBM Relight + Darkroom + 4K upscale via ComfyUI | builder | DI |

Additional deployed workspace skills (28 total on VM): autonomous-stack, brave-search, c-suite-bridge, di_lora_trainer, di_scene_generator, openai-whisper, openclaw-ops-brain, self-improving-agent, skill-vetter, web-browsing.

---

## Infrastructure

### Models Configured

| Provider | Model | Context | Cost | Notes |
|----------|-------|---------|------|-------|
| **local-rig** (:8000) | Qwen 3.6 27B Q4_K_M | 32K | Free | Local coder on Sage |
| **local-rig-worker2** (:8001) | Qwen 3.6 35B A3B | 32K | Free | Local router on Sage |
| **local-abliterated** (:11434) | Qwen 3.6 35B Abliterated (Claude 4.7 quant) | 131K | Free | Default for all agents (Ollama) |
| **Venice** | Llama 3.3 70B, Hermes 3 405B, Qwen3 235B (thinking+instruct), DeepSeek V3.2, Qwen3 Coder 480B, Qwen3 Next 80B, Qwen3 VL 235B, Qwen3 4B, Qwen 3.5 35B, MiniMax M2.7 | 32-262K | Free | 12 models via Venice API |
| **OpenAI** | GPT-4o, GPT-4o Mini, gpt-image-1 | 128K | $2.50-$40/M | Paid fallback + image generation |

### Services Running (systemd --user)

| Service | Description | Port |
|---------|-------------|------|
| openclaw-gateway.service | OpenClaw Gateway v2026.4.24 | 18789 (loopback) |
| langfuse-forwarder.service | Langfuse telemetry forwarder | -- |
| di-gallery.service | Digital Influencer Gallery + LoRA Training API | 8888 |

### Ports in Use

| Port | Service |
|------|---------|
| 22 | SSH |
| 3000 | Python service (unknown) |
| 3001 | Python service (Founder OS dashboard) |
| 4000 | Unknown (listening on all interfaces) |
| 5432 | PostgreSQL (loopback) |
| 6379 | Redis (loopback) |
| 8888 | DI Gallery + LoRA API (all interfaces) |
| 18789 | OpenClaw Gateway (loopback) |

### Redis Streams (active)

```
os:stream:briefs        -- Inbound content briefs
os:stream:assembled     -- Assembled content packages
os:stream:visuals       -- Visual generation queue
os:stream:audio         -- Audio generation queue
os:stream:scoring       -- Quality scoring queue
os:stream:approvals     -- Human approval queue
os:stream:delivered     -- Completed deliveries
os:stream:dead          -- Dead letter queue
os:stream:audit         -- Audit trail
c-suite.briefs          -- CEO inbound briefs
c-suite.assignments     -- Routed assignments to execs
c-suite.kpis.ceo        -- CEO KPI emissions
c-suite.events          -- System events
c-suite.telegram-replies-- Telegram reply queue
pipeline:dead_letter    -- Pipeline failures
kanban:backlog          -- Task backlog
```

### Databases

- **Redis** -- 88 keys, streams, budgets, pipeline stats, model configs
- **PostgreSQL** -- swarm_ops database (inherited from agent-swarm)
- **SQLite** -- approvals.db, episodic_memory.db, task_ledger.db

---

## Agent Swarm (/home/apogeeai/agent-swarm/)

40+ workspace directories, each with SOUL.md, IDENTITY.md, TOOLS.md, memory/, and logs/. Major workspaces:

**C-Suite Workspaces:** workspace-ceo, workspace-cto, workspace-cmo, workspace-cio, workspace-cso, workspace-cro, workspace-support

**Content/Creative:** workspace-creative, workspace-creative-director, workspace-designer, workspace-editor, workspace-audio, workspace-tastemaker, workspace-trendscout, workspace-community

**Business/Revenue:** workspace-prospector, workspace-outreach_writer, workspace-funnel_analyst, workspace-pricing_modeler, workspace-crm_manager, workspace-retention_agent

**Technical:** workspace-coder, workspace-sre, workspace-deployer, workspace-sentinel, workspace-experimenter, workspace-soul_optimizer, workspace-wiggum

**Other:** workspace-analyst, workspace-brief_composer, workspace-cleanup_bot, workspace-demo_prepper, workspace-doc_writer, workspace-job_monitor, workspace-main, workspace-onboarder, workspace-researcher

### Pipelines

| Pipeline | Purpose |
|----------|---------|
| synaptive-audio | Audio generation pipeline for Synaptive Sounds |
| etsy-images | Product image generation for Etsy listings |
| stripe-billing | MRR tracking and usage billing for Apogee AI |
| voice | Audio transcription (Whisper) |

### Scripts

cleanup-stale-locks.sh, register-agents.sh, verify-agents.sh, langfuse-forwarder.py, heartbeat.py, add-heartbeat-cron.sh, save-db-url.sh, test-heartbeat.sh

### Overnight Execution

`run-overnight.sh` + `morning-digest.sh` -- processes briefs queue, runs agents, generates morning report.

---

## What It Can Do Today

- **Route and decompose goals** -- CEO Director decomposes high-level goals into 3-7 subtasks via LLM (Venice/Qwen), scores with tenant-aware weighting, queues top tasks for execution
- **Execute tasks via Claude Code** -- GSD Runner SSHs to LXC 109 and runs tasks through Claude Code with 30-min timeout
- **Generate images** -- ComfyUI integration (V6 DI pipeline: Z-Image Turbo + LBM Relight + Darkroom + 4K upscale), LoRA-consistent character images
- **Generate audio** -- 8D binaural panning, 432Hz/528Hz healing frequencies, ffmpeg spatial mixing
- **Generate video** -- LTX2/Wan video generation, Higgsfield dance motion
- **Trend research** -- TrendScout scans sources, scores trends, converts to actionable briefs
- **Quality gating** -- Tastemaker scores content 0-100, Wiggum enforces brand/compliance policies
- **Content publishing** -- Platform-specific formatting for YouTube, TikTok, Instagram, Etsy, Gumroad, Twitter/X
- **Sales outreach** -- Cold email templates, CRM pipeline stages, lead prospecting for local businesses
- **Freelance delivery** -- Fiverr/Upwork gig templates and quality checklists
- **Cost tracking** -- Per-tenant P&L, token cost aggregation, budget alerts
- **Dashboard** -- Web dashboard on :3001 for system status (stub-level)
- **Telegram integration** -- DM policy, thread bindings, subagent session spawning, Telegram bot for Adam
- **Overnight batch** -- Briefs queue processes overnight, morning digest delivered
- **Episodic memory** -- Persistent memory across sessions via workspace memory/ files and episodic_memory.db
- **Approval queue** -- Human-in-the-loop approval for external actions (publish, send, spend)
- **DI Gallery** -- Web gallery for Digital Influencer images on :8888 with LoRA training API
- **Langfuse telemetry** -- LLM call tracing and cost forwarding

---

## What's Not Working / Needs Fixing

### Critical

- **Most C-suite roles are stubs** -- Only CEO and CMO have real workers. CTO, CIO, CSO, CRO, Creative Director, and Support are skeleton implementations that ACK + log + emit KPIs but do no real work.
- **No real LLM invocation in CEO tiebreaker** -- CEO routing is rule-based only; LLM tiebreak for ambiguous briefs is TODO.
- **CMO subprocess invocation gated** -- CMO can write drafts but does not yet invoke wrapped agents as subprocesses.
- **Security issues identified but not all fixed** -- .env file permissions (0664 world-readable), raw-stream.jsonl exposed, workspace logs world-readable, dashboard bound to 0.0.0.0:3001. Fix commands documented in memory but not all applied.
- **Port 4000 open on all interfaces** -- Unknown service, potential security exposure.

### Important

- **Sub-agents have no SOUL.md** -- The 14 agents under /opt/founder-os/_agents/ have worker .py files but no SOUL.md personality contracts (they exist in the agent-swarm workspaces instead).
- **CTO recursive self-upgrade not wired** -- The Proposer/Reviewer/Applier/Learner loop is designed but not implemented.
- **Multi-tenant is single-tenant** -- System is designed for multi-tenant but currently runs as `default`. Tenant registry at _data/tenants.json is TODO.
- **No Stripe billing integration** -- stripe-billing pipeline has tracking code but no live Stripe connection.
- **No real CRM** -- CSO has no CRM integration.
- **No A/B test bucketing** -- CRO has no real experimentation framework.
- **Cron jobs may be overdue** -- Security audit noted cron jobs last ran 7+ days prior to the audit.

### Nice to Have

- **Dashboard is stub-level** -- HTML + Redis-poll JSON, not a real Next.js dashboard.
- **White-label portal not started** -- Planned for Apogee AI but not built.
- **Morning digest delivery** -- Script exists but may not be on a working cron/timer.
- **Overnight pipeline reliability** -- run-overnight.sh exists but needs verification that it completes end-to-end consistently.

---

## Key File Paths

```
/home/apogeeai/.openclaw/openclaw.json          -- Main gateway + agent config
/home/apogeeai/.openclaw/workspace/              -- Agent workspace root
/home/apogeeai/.openclaw/workspace/tenants/      -- 7 tenant configs
/home/apogeeai/.openclaw/workspace/skills/       -- 28 deployed skill bundles
/home/apogeeai/.openclaw/workspace/memory/       -- Persistent memory files
/home/apogeeai/.openclaw/workspace/output/       -- Generated outputs
/opt/founder-os/                                 -- C-suite layer (8 roles)
/opt/founder-os/_agents/                         -- 14 sub-agents
/opt/founder-os/_shared/                         -- Cross-cutting utilities
/opt/founder-os/_dashboard/                      -- Status console (:3001)
/home/apogeeai/agent-swarm/                      -- 40+ workspace dirs + pipelines
/home/claude/golden_skills/                      -- 17 golden skill bundle sources (LXC 109)
```

---

*Generated 2026-05-02 by Claude (Opus 4.6) from live system audit.*
