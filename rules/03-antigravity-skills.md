# Antigravity Skills — routing per kategori (ala 100-best-ai-agent-skills)

Precedence: Security (INSTRUCTIONS.md) > `00-workflow.md` > file ini.

Sumber: `skills-antigravity-awesome/` (1839 skills, gitignored, reproducible via
`npx antigravity-awesome-skills --path skills-antigravity-awesome`).
Aturan main:
- Skill kurasi `skills/` + matrix `00-workflow.md` SELALU menang untuk kerja
  coding sehari-hari. Folder antigravity = cadangan untuk hal di luar itu.
- 33 duplikat sudah di-rename prefix `ax-` supaya tidak menimpa skill kurasi.
  Jangan invoke `ax-*` kecuali sadar itu versi duplikat.
- Butuh yang tidak ada di daftar → grep deskripsi:
  `grep -rl -i "<keyword>" skills-antigravity-awesome/*/SKILL.md`

## 1. Development & Coding

Trigger: tulis/fix/review/test kode di luar pola kurasi, bahasa/framework spesifik.

| Trigger                             | Skill                                              |
| ----------------------------------- | -------------------------------------------------- |
| Commit                              | `commit`                                           |
| Review PR/diff                      | `code-reviewer`, `review-swarm`, `vibecode-production-qa-validator` |
| Bug misterius                       | `bug-hunter`, `debugger`, `error-detective`        |
| Sederhanakan kode                   | `code-simplifier`, `clean-code`, `simplify-code`   |
| Tes Java / Python / JS              | `junit-5-skill`, `pytest-skill`, `jest-skill`, `vitest-skill`, `cypress-skill`, `playwright-skill` |
| Go / Rust / Python / TS / PHP       | `golang-pro`, `rust-pro`, `python-pro`, `typescript-pro`, `php-pro` |
| FastAPI / Django / Laravel          | `fastapi-pro`, `django-pro`, `laravel-expert`      |
| Git advanced / hooks / upgrade dep  | `git-advanced-workflows`, `git-hooks-automation`, `dependency-upgrade` |

## 2. Design & Frontend

Trigger: sentuh UI di luar satu arah visual yang sudah dipilih di `00-workflow.md`.

| Trigger                              | Skill                                             |
| ------------------------------------ | ------------------------------------------------- |
| Landing page                         | `landing-page-generator`, `antigravity-design-expert` |
| Design system                        | `tailwind-design-system`, `radix-ui-design-system`, `shadcn` |
| Review "AI look"                     | `styleseed-design-review`                         |
| Perf / CI gate                       | `frontend-lighthouse`                             |
| 3D web                               | `3d-web-experience`                               |

## 3. Data & Analytics

Trigger: query, pipeline, dashboard, RAG, vector DB.

| Trigger                              | Skill                                             |
| ------------------------------------ | ------------------------------------------------- |
| Postgres / SQL lambat                | `postgres-best-practices`, `sql-optimization-patterns` |
| Desain skema                         | `database-design`                                 |
| dbt / pipeline                       | `dbt-transformation-patterns`                     |
| RAG / vector search                  | `rag-implementation`, `vector-database-engineer`  |
| DataFrame cepat                      | `polars`                                          |
| Dashboard / narasi data              | `kpi-dashboard-design`, `data-storytelling`       |

## 4. Document Processing

Trigger: PDF/DOCX/paper/transkrip/notes → markdown terstruktur.

| Trigger                              | Skill                                             |
| ------------------------------------ | ------------------------------------------------- |
| PDF operasi / konversi               | `pdf-official`, `pdf-conversion-router`           |
| DOCX baca/tulis                      | `docx-official`                                   |
| Paper akademik                       | `papers-skill`, `latex-paper-conversion`          |
| YouTube → catatan                    | `youtube-summarizer`, `youtube-notetaker`         |
| Obsidian vault                       | `obsidian-markdown`, `obsidian-cli`               |
| Wiki repo                            | `wiki-qa`, `wiki-page-writer`, `wiki-builder`     |
| Notion CRUD                          | `notion-automation`                               |

## 5. Content Creation & Writing

Trigger: tulisan panjang, copy, proofread (bukan kode).

| Trigger                              | Skill                                             |
| ------------------------------------ | ------------------------------------------------- |
| Blog standar penerbit                | `blog-writing-guide`                              |
| Copy landing/email                   | `copywriting`                                     |
| Konten SEO                           | `seo-content-writer`                              |
| Proofread                            | `professional-proofreader`                        |
| Publish ke X                         | `x-article-publisher-skill`                       |

## 6. Security & Compliance

Trigger: audit, pentest, vuln, supply-chain, smart contract.

| Trigger                              | Skill                                             |
| ------------------------------------ | ------------------------------------------------- |
| Audit + threat model umum            | `007`, `security-audit`, `threat-modeling-expert`, `stride-analysis-patterns` |
| Checklist pentest                    | `pentest-checklist`, `vulnerability-scanner`      |
| Web injeksi (SQLi/XSS/IDOR/SSRF)     | `sql-injection-testing`, `xss-html-injection`, `idor-testing` |
| CI/CD exploit                        | `gha-security-review`                             |
| Container                            | `container-security-hardening`                    |
| Privesc Linux                        | `linux-privilege-escalation`                      |
| Solidity                             | `solidity-security`                               |

## 7. Business & Marketing

Trigger: SEO, email dingin, pricing, PM, sosmed bisnis.

| Trigger                              | Skill                                             |
| ------------------------------------ | ------------------------------------------------- |
| Audit SEO                            | `seo`, `seo-audit`                                |
| Email dingin B2B                     | `cold-email`                                      |
| LinkedIn post                        | `linkedin-post-writer`                            |
| PM / pricing                         | `product-manager`, `pricing`                      |

## 8. Productivity & Automation

Trigger: orkestrasi alat SaaS, workflow n8n/temporal, rilis.

| Trigger                              | Skill                                             |
| ------------------------------------ | ------------------------------------------------- |
| Chat/PM tools (Slack dkk)            | `slack-automation`, `linear-automation`, `jira-automation`, `github-automation`, `notion-automation`, `gmail-automation` |
| Bot Telegram/Discord/Zoom            | `telegram-bot-builder`, `discord-bot-architect`, `zoom-automation` |
| Workflow engine                      | `n8n-workflow-patterns`, `temporal-golang-pro`    |

## 9. Communication & Collaboration

Trigger: sama seperti §8 tapi fokus kanal komunikasi — gabung ke §8,
kecuali butuh voice/phone: `voice-ai-development`, `fal-audio`, `podcast-generation`.

## 10. DevOps & Infrastructure

Trigger: container, K8s, IaC, CI, cloud, deploy platform.

| Trigger                              | Skill                                             |
| ------------------------------------ | ------------------------------------------------- |
| Docker / K8s                         | `docker-expert`, `kubernetes-architect`           |
| Terraform                            | `terraform-specialist`                            |
| CI GitHub                            | `github-actions-advanced`                         |
| Serverless AWS                       | `aws-serverless`                                  |
| Deploy Vercel/Expo/Supabase          | `vercel-deployment`, `expo-deployment`, `supabase` |
| Mobile native                        | `flutter-expert`, `android-dev`, `swiftui-expert-skill` |

## 11. Creative & Media

Trigger: gambar/video/audio/game.

| Trigger                              | Skill                                             |
| ------------------------------------ | ------------------------------------------------- |
| Gambar AI                            | `stability-ai`                                    |
| Audio/voice                          | `fal-audio`, `podcast-generation`                 |
| Embed editor foto                    | `photopea-embedded-editor`                        |
| Video extract/OCR                    | `video-content-extractor`                         |
| Game Unity/Godot                     | `unity-developer`, `godot-gdscript-patterns`      |

## 12. Enterprise & Industry-Specific

Trigger: domain teregulasi / vertikal khusus.

| Trigger                              | Skill                                             |
| ------------------------------------ | ------------------------------------------------- |
| Legal/GDPR                           | `legal-advisor`                                   |
| HR                                   | `hr-pro`                                          |
| Odoo ERP                             | `odoo-accounting-setup`                           |
| Riset medis                          | `pubmed-database`                                 |
| Manufaktur/energi                    | `production-scheduling`, `energy-procurement`     |
| Billing SaaS                         | `billing-automation`                              |
