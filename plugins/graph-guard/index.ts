import { Plugin } from "@opencode/plugin"
import { existsSync, readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"

// Graph-first enforcement for OpenCode (adapted from the smart-grep-hook
// pattern: deny-with-answer). Intercepts the native `grep` tool: when the
// session's repo has a graphify graph containing the pattern, the call is
// blocked with the graph answer inline — zero retry loop. Everything else
// passes silently. Escape hatch: put "graph-tried" in the pattern, or use
// bash grep (string literals, configs, logs — things AST can't index).

function findGraph(startDir: string): string | null {
  let d = resolve(startDir)
  while (true) {
    const candidate = join(d, "graphify-out", "graph.json")
    if (existsSync(candidate)) return candidate
    const parent = dirname(d)
    if (parent === d) return null
    d = parent
  }
}

function searchGraph(graphPath: string, pattern: string): string[] {
  try {
    const raw = readFileSync(graphPath, "utf-8")
    const g = JSON.parse(raw)
    const nodes = g?.nodes ?? []
    const low = pattern.toLowerCase()
    const out: string[] = []
    for (const n of nodes) {
      const label = String(n?.label ?? "")
      const id = String(n?.id ?? "")
      if (label.toLowerCase().includes(low) || id.toLowerCase().includes(low)) {
        const src = String(n?.source_file ?? "")
        const loc = String(n?.source_location ?? n?.line ?? "")
        out.push(`[graphify] ${n?.file_type ?? "node"}  ${label}  ->  ${src}:${loc}`)
        if (out.length >= 5) break
      }
    }
    return out
  } catch {
    return []
  }
}

async function sessionDir(ctx: any, event: any): Promise<string | null> {
  const tried: Array<() => any> = [
    () => event?.session?.directory,
    () => event?.sessionID && ctx.session.get({ sessionID: event.sessionID }),
    () => event?.directory,
    () => event?.cwd,
    () => ctx.location?.directory,
    () => process.cwd(),
  ]
  for (const get of tried) {
    try {
      const v = await get()
      const dir = typeof v === "string" ? v : v?.directory
      if (typeof dir === "string" && dir.length > 0) return dir
    } catch {
      // try next
    }
  }
  return null
}

export default Plugin.define({
  id: "graph-guard",
  async setup(ctx) {
    await ctx.tool.hook("execute.before", async (event: any) => {
      try {
        if (event?.tool !== "grep") return
        const input = event?.input ?? {}
        const pattern = String(input?.pattern ?? "")
        if (pattern.length <= 2) return
        if (pattern.includes("graph-tried")) return

        const dir = await sessionDir(ctx, event)
        if (!dir) return
        const graph = findGraph(dir)
        if (!graph) return

        const hits = searchGraph(graph, pattern)
        if (hits.length === 0) return

        throw new Error(
          `Graph has this - no grep needed:\n\n${hits.join("\n")}\n\n` +
            `Explore further: graphify query '${pattern}' | graphify path '<A>' '<B>'. ` +
            `If you truly need raw text search (string literals, configs, logs), re-run via bash grep.`
        )
      } catch (err) {
        // Never break grep: only rethrow our own deny-with-answer.
        if (err instanceof Error && err.message.startsWith("Graph has this")) throw err
      }
    })
  },
})
