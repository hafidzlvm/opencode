import { Plugin } from "@opencode/plugin"

// V2 port of opencode-handoff v0.5.0 (V1 implementations do not run in V2).
// /handoff <goal> carries context to a new session: the new session starts
// with a compact tail of the previous conversation plus a read_session tool
// to fetch more detail on demand.

function textOf(part: any): string | null {
  if (!part || typeof part !== "object") return null
  if (typeof part.text === "string") return part.text
  if (typeof part.content === "string") return part.content
  return null
}

function summarize(messages: any[], maxMessages: number, maxChars: number): string {
  const tail = messages.slice(-maxMessages)
  const lines: string[] = []
  for (const msg of tail) {
    const role = msg?.info?.role ?? msg?.role ?? "unknown"
    const parts = Array.isArray(msg?.parts) ? msg.parts : []
    const texts = parts.map(textOf).filter((t): t is string => !!t)
    if (texts.length === 0) continue
    const header = role === "user" ? "User" : role === "assistant" ? "Assistant" : String(role)
    lines.push(`## ${header}`)
    for (const t of texts) {
      lines.push(t.length > maxChars ? t.slice(0, maxChars) + "…[truncated]" : t)
    }
    lines.push("")
  }
  return lines.join("\n").trim() || "(no text messages found)"
}

function formatTranscript(messages: any[], limit: number): string {
  const body = summarize(messages, limit, 2000)
  return body + `\n\n(End of transcript - ${messages.length} messages)`
}

export default Plugin.define({
  id: "handoff",
  async setup(ctx) {
    await ctx.command.transform((editor) => {
      editor.add({
        name: "handoff",
        description: "Continue work in a new session with context carried over",
        execute: async ({ sessionID, prompt }) => {
          const goal = (prompt as { text?: string }).text?.trim() ?? ""
          let messages: any[] = []
          try {
            messages = [...(await ctx.session.context({ sessionID }))]
          } catch {
            messages = []
          }
          const body = [
            `Continuing work from session ${sessionID}.`,
            goal
              ? `Goal: ${goal}`
              : "Goal: continue naturally from where the previous session left off.",
            "",
            "Context from previous session (most recent last):",
            summarize(messages, 20, 1500),
            "",
            `When you lack specific information, use the read_session tool with sessionID ${sessionID} to fetch more.`,
          ].join("\n")
          const created: any = await ctx.session.create({
            title: goal.slice(0, 60) || "Handoff",
          })
          const newID: string = created?.id ?? created?.sessionID
          await ctx.session.prompt({ sessionID: newID, text: body })
        },
      })
    })

    await ctx.tool.transform((editor) => {
      editor.add({
        name: "read_session",
        description:
          "Read the conversation transcript from a previous session. Use this when you need specific information from the source session that wasn't included in the handoff summary.",
        input: {
          type: "object",
          properties: {
            sessionID: { type: "string" },
            limit: { type: "number" },
          },
          required: ["sessionID"],
          additionalProperties: false,
        },
        execute: async (input) => {
          const { sessionID, limit } = input as { sessionID: string; limit?: number }
          const n = Math.min(limit ?? 100, 500)
          try {
            const messages = [...(await ctx.session.context({ sessionID }))]
            if (messages.length === 0) return { content: "Session has no messages or does not exist." }
            return { content: formatTranscript(messages, n) }
          } catch (error) {
            return {
              content: `Could not read session ${sessionID}: ${error instanceof Error ? error.message : "Unknown error"}`,
            }
          }
        },
      })
    })
  },
})
