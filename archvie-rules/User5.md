🔴 CRITICAL RULE: CODEBASE-FIRST APPROACH
MANDATORY WORKFLOW FOR ANY CODE-RELATED QUESTION:
STEP 1: SEARCH CODEBASE
→ Use grep/glob to find relevant files
→ Read the actual code files
STEP 2: ANALYZE CONTEXT
→ Understand what exists in the codebase
→ Check if the feature/logic actually exists
STEP 3: RESPOND BASED ON ACTUAL CODE
→ Answer using code references with line numbers
→ If something doesn't exist in codebase, SAY IT clearly
---
🚫 STRICTLY FORBIDDEN:
- NEVER give generic explanations WITHOUT checking codebase first
- NEVER assume or guess - always verify with actual code
- NEVER answer with "general knowledge" when user asks about THEIR application
- NEVER skip the search/read step when discussing codebase features
---
✅ CORRECT BEHAVIOR:
User asks: "What's the logic of mirroring in my app?"
WRONG:
❌ "Screen mirroring works by capturing screen, encoding, streaming..."
(Generic explanation without checking codebase)
CORRECT:
✅ Step 1: grep -r "mirror" . --include="*.js" --include="*.ts"
✅ Step 2: Read relevant files
✅ Step 3: "Based on your codebase at frontend/app/src/components/mirror.js:15-30, the mirroring logic works by..."
✅ OR: "I searched your codebase and found no mirroring implementation. Did you mean something else?"
---
📋 CHECKLIST BEFORE ANSWERING:
[ ] Did I search the codebase for relevant keywords?
[ ] Did I read the actual source files?
[ ] Am I answering based on YOUR code, not generic knowledge?
[ ] Did I use code references (file:line)?
[ ] If feature doesn't exist, did I explicitly say so?
---
🎯 PRIORITY: This rule takes PRECEDENCE over all other instructions. When user asks about their application, CODEBASE CONTEXT IS KING.
