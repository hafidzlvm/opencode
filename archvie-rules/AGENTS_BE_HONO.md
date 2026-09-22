# AGENTS.md — App Backend

Guidelines for AI agents working in this repository.

## Repository Layout

```
backend_be_dev/
├── README.md                     # Docker usage guide
├── docker-compose.backend.yaml
├── deploy.sh / DEPLOY.md         # Deployment
└── backend/app/              # ← The actual backend app (all work happens here)
    ├── src/
    │   ├── db/                   # schema.ts (all tables), relations.ts, index.ts (drizzle pool)
    │   ├── routes/               # v1.ts (/api/v1), v2.ts, index.ts (root router)
    │   ├── services/             # One folder per feature (see Pattern below)
    │   ├── middlewares/          # auth, permission, api-key, limit, timeout
    │   ├── utils/                # response.util.ts, pagination.util.ts, db.util.ts, error.util.ts
    │   ├── type/                 # app.ts (response schemas), pagination.ts
    │   └── config/               # cors, version
    ├── bin/                      # Entrypoints & workers (www.ts, file-cleaner.ts, workers)
    ├── drizzle/                  # Migrations: dev/, test/, prod/, archive/
    ├── docs/                     # Proposals & design docs
    ├── drizzle-dev.config.ts     # generate → drizzle/dev  (needs .env.development)
    ├── drizzle-prod.config.ts    # generate → drizzle/prod
    ├── drizzle.config.ts         # → drizzle/test
    ├── tsconfig.json             # strict mode
    └── package.json
```

- **Work directory**: `backend/app`. Run every command from there.
- **Stack**: Hono 4 + drizzle-orm (node-postgres) + better-auth + zod + bun/Node 22. ESM only.
- **Git branch**: `develop`.

## Commands (run in `backend/app`)

| Task | Command |
|------|---------|
| Typecheck (required before done) | `npx tsc --noEmit -p tsconfig.json` |
| Dev server | `bun run dev` (or `npm run dev` → `tsx watch bin/www.ts`) |
| Build | `npm run build` |
| Tests | `npm test` (vitest) |
| Generate dev migration | `cp .env .env.development && npx drizzle-kit generate --config drizzle-dev.config.ts && rm .env.development` |

**Verification gate**: after any code change, run `npx tsc --noEmit -p tsconfig.json` and it must pass with zero errors.

## Service Pattern (MOST IMPORTANT)

Follow the **ticket** pattern: each feature is a folder in `src/services/<name>/` with three sub-folders, each holding one file per action plus an `index.ts` aggregator.

```
src/services/<name>/
├── route/
│   ├── index.ts        # new Hono<{ Variables: RequiredAuthType }>, instantiate service, register routes
│   ├── list.ts         # export function registerListRoute(app, service)
│   └── detail.ts       # export function registerDetailRoute(app, service)
├── service/
│   ├── index.ts        # class XService { private deps: XServiceDeps; constructor() { this.deps = {...} } }
│   ├── types.ts        # export interface XServiceDeps { ... }
│   ├── get-all.ts      # export async function getX(deps, params)
│   └── get-by-id.ts    # export async function getXById(deps, id, workspaceId)
└── repository/
    ├── index.ts        # class XRepository { findAll() { return findAllX(params) } ... }
    ├── find-all.ts     # export async function findAllX(params)
    ├── find-by-id.ts
    └── insert.ts
```

- **Route registration**: `src/routes/v1.ts` — `v1Routes.route("/u/<name>", xRoute)`. Auth-protected routes go under `/u/*`. Add permission middleware **inside** each route handler (inline `requirePermission`), not globally.
- **Reference implementations**: `src/services/ticket/**` (full CRUD pattern) and `src/services/whatsapp-webhook-history/**` (simple read API + owner/admin guard). `src/services/activity-log/**` (middleware + recordChange, mirrors ticket pattern).

## Conventions

- **Naming**: kebab-case file/folder names; camelCase functions/vars; PascalCase classes. Entity in schema: `nameInOmnichannel` (e.g. `activityLogsInOmnichannel`), table name kebab (`activity_logs`), column snake_case with camelCase alias.
- **ESM**: all relative imports must end with `.js` (`import x from "./file.js"`).
- **Zod**: build schemas from the drizzle table with `createSelectSchema` (read/response) and `createInsertSchema` (create/update payloads) — both from `drizzle-zod` — so types stay in sync with `src/db/schema.ts` (reference: `src/services/conversation/conversation.validation.ts`). Override `jsonb` fields with `z.unknown().nullable()`. Query params use `z.coerce.number()` (e.g. page/limit/statusCode).
- **bigserial**: `activityId` is `bigint` in DB — convert with `Number(...)` before returning JSON (JSON.stringify throws on BigInt).
- **describeRoute docs**: every route must carry clear, complete OpenAPI docs via `describeRoute` — explain the endpoint's purpose, each field (required/optional, format, constraints), business rules/state-machine, side effects (emails, in-app notifications, Pusher), and every possible status code. FE (Swagger UI) consumes these docs, so clarity matters. Reference: `src/services/ticket/route/create.ts` and `src/services/ticket/route/update.ts` (the most detailed examples).
- **Validation**: use `validator("query"|"param"|"json", schema, (result, c) => ...)` from `hono-openapi`, error out via `errorResponse(c, errors, 400)`.
- **Responses** (`src/utils/response.util.ts`): `successResponse`, `createdResponse`, `paginatedResponse` (list shape `{ items, pagination }`), `errorResponse`, `notFoundResponse`, `forbiddenResponse`. List pagination via `calculatePagination(page, limit, total)`.
- **DB helpers**: `totalCount(table)` from `src/utils/db.util.js` for count queries.
- **Permissions** (`src/services/better-auth/auth.constant.ts`): add statement to the `statement` object + assign to roles in `member`/`admin`/`owner`. Guard routes with `requirePermission({ resource: ["action"] })` which sets `workspaceId`, `workspaceRole`, `workspaceMemberId` on context. Scope data by `c.get("workspaceId")`.
- **Auth**: `requireAuth` sets `user` + `session` (NOT workspaceId). `session.activeOrganizationId` is the fallback workspace.
- **Side-effect writes that must not block the response**: fire-and-forget with `.catch(err => console.error(...))` (see `activity-log` service `recordChange`/`insertEnvelope`).
- **No comments unless needed**; when present, follow the language/register of surrounding code. Keep functions small and single-purpose.

## Database & Migrations

- All tables live in the `app` schema (`schemaFilter: ['app']`). Define in `src/db/schema.ts`, relations in `src/db/relations.ts`.
- **Soft delete** via `deletedAt` column is the norm.
- Migration flow (dev): copy `.env` → `.env.development`, run `npx drizzle-kit generate --config drizzle-dev.config.ts` (outputs to `drizzle/dev/`), remove `.env.development` after.
- **Gotcha**: drizzle-kit `generate` prompts **interactively** for column renames/conflicts — it needs a TTY. If a column was renamed, choose **rename** at the prompt (not drop+create) to preserve data.
- `.env*` is gitignored. Never commit secrets.

## TypeScript Strictness

`tsconfig.json` is strict: `noImplicitAny`, `strictNullChecks`, `noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess`. Arrays are `T | undefined` when indexed — guard before access. Do not loosen these flags.

## Testing

- Vitest. Run with `npm test` / `npm run test:watch`. Test files are excluded from the build (`**/*.test.ts`, `**/*.spec.ts`).
- Match existing test structure — check `bin/test/` and neighboring services before adding new tests.
