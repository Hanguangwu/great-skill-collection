import type { Skill } from '@/types/skill'

// Note: site identity / links live in `@/config/site` (see `.env`), not here.

/* -------------------------------------------------------------------------- */
/* coding                                                                     */
/* -------------------------------------------------------------------------- */

const reactUiBuilder: Skill = {
  id: 'react-ui-builder',
  name: 'React UI Builder',
  description:
    'Turns a one-paragraph brief, a screenshot, or a half-finished component into production-ready React 19 + TypeScript with accessible markup and Tailwind styling.',
  author: 'Qingyang',
  version: '1.4.0',
  tags: ['react', 'typescript', 'tailwind', 'accessibility'],
  category: 'coding',
  license: 'MIT',
  updatedAt: '2026-09-24',
  featured: true,
  popular: true,
  compatibility: { claudeCode: true, codex: true, kimiCode: true },
  changelog: [
    { version: '1.4.0', date: '2026-09-24', note: 'Added a state-matrix step so empty and error states stop being forgotten.' },
    { version: '1.3.0', date: '2026-07-11', note: 'Now reads design tokens from the project instead of inventing hex values.' },
    { version: '1.2.0', date: '2026-05-19', note: 'Focus-visible rings and reduced-motion fallbacks.' },
  ],
  icon: '⚛️',
  body: `# React UI Builder

Design and generate production-ready React interfaces from a short brief, a screenshot, or an
existing component. The output is idiomatic React 19 with TypeScript, Tailwind utility classes,
accessible markup by default, and a component split you can paste straight into a project.

## Capability

- Turns a natural-language brief into a component tree, then into runnable code
- Chooses real layout primitives (stack, grid, flex) instead of absolute positioning
- Applies the project's own design tokens rather than inventing new values
- Adds keyboard and screen-reader affordances without being asked
- Splits the result into the smallest set of files that still reads well

## When to Use

- You need a settings panel, a list view, or a form and want it done in one pass
- You are porting a static mock or a Figma frame to real components
- You want accessibility handled alongside the visuals instead of in a follow-up ticket
- You are reviewing an existing component and want a second opinion on its structure

> Use this for the first 80% of UI work. Drop to hand-written code once a screen needs a
> canvas, a virtualised grid, a rich text editor, or a third-party widget wrapper.

## Inputs

| Field | Required | Default | Notes |
| --- | --- | --- | --- |
| \`brief\` | yes | — | One or two sentences describing the screen |
| \`tokens\` | no | \`src/index.css\` | Where the Tailwind \`@theme\` block lives |
| \`entry\` | no | \`src/components\` | Directory the new files are written to |
| \`a11y\` | no | \`true\` | Set to \`false\` only for throwaway prototypes |

## Outputs

- \`Component.tsx\` — the component itself, with no CSS files
- \`Component.test.tsx\` — interaction tests for the primary flows
- A short written summary of the layout decisions you made

---

## Steps

1. Restate the brief as a list of regions (header, body, footer, overlay).
2. Map each region to a layout primitive and pick spacing from the token scale.
3. Write the markup top-down; keep every interactive element reachable by keyboard.
4. Cover the state matrix before you write a line of styling.

   ### State matrix

   | State | Expected behaviour |
   | --- | --- |
   | default | The happy path renders |
   | hover / focus-visible | Visible affordance, never colour-only |
   | disabled | Non-interactive, still legible |
   | loading | Skeleton or spinner, no layout shift |
   | empty | Explains what will appear here |
   | error | Says what failed and what to do next |

5. Run the test suite. Fix anything that reaches for \`document\` during render.
6. Re-read the brief. If a requirement is not visible in the UI, it is not done.

## Example

\`\`\`tsx
import { useId, useState } from 'react'

type ToggleProps = {
  label: string
  onChange: (next: boolean) => void
}

export function Toggle({ label, onChange }: ToggleProps) {
  const id = useId()
  const [checked, setChecked] = useState(false)

  return (
    <div className="flex items-center gap-3">
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => {
          const next = !checked
          setChecked(next)
          onChange(next)
        }}
        className="rounded-card bg-leaf-400 px-4 py-2 text-ink-900 shadow-soft
                   focus-visible:outline-2 focus-visible:outline-ocean-500"
      >
        {checked ? 'On' : 'Off'}
      </button>
      <label htmlFor={id} className="text-ink-700">
        {label}
      </label>
    </div>
  )
}
\`\`\`

## Conventions

### Component files

- Keep \`className\` values as complete literal strings so Tailwind can see them at build time
- Prefer \`const\` arrow components for anything under roughly 60 lines
- Put \`useState\` at the top of the component; never inside a conditional
- Derive rather than duplicate: if you compute a value from props, do not also store it

### State discipline

- One \`useState\` per independent concern; two states that always change together are one state
- Reset transient state when the props that created it change
- Never mirror a prop into state just to display it differently

### Review checklist

- [ ] Every interactive element has a visible \`focus-visible\` style
- [ ] Icon-only buttons carry an \`aria-label\`
- [ ] Long lists are keyed by a stable id, never by array index
- [ ] The component renders sensibly at 360px wide
- [ ] Nothing depends on a hover-only interaction

## Notes

- Never nest interactive elements — a button inside a link is always a bug.
- If the design uses three or four different greys, ask whether it needs two.
- Motion is decoration. Wrap anything animated in \`motion-reduce:\` guards.
`,
}

const apiContractWriter: Skill = {
  id: 'api-contract-writer',
  name: 'API Contract Writer',
  description:
    'Designs HTTP and JSON contracts between services before any implementation exists, then generates matching client types, fixtures, and an OpenAPI fragment.',
  author: 'Qingyang',
  version: '1.1.0',
  tags: ['api', 'openapi', 'typescript', 'backend'],
  category: 'coding',
  license: 'MIT',
  updatedAt: '2026-08-30',
  compatibility: { claudeCode: true, codex: true, kimiCode: false },
  icon: '🛠️',
  body: `# API Contract Writer

Writes the interface between two systems before either one is built. The output is a reviewable
contract — endpoint table, schema definitions, error taxonomy — plus generated TypeScript types and
fixtures that both sides can compile against.

## Capability

- Drafts a resource-oriented endpoint surface from one paragraph of intent
- Produces a closed error taxonomy so clients stop guessing at failure modes
- Generates TypeScript types and a JSON Schema fragment that stay in sync
- Produces realistic fixtures, including the ugly ones nobody wants to type by hand

## When to Use

- Two teams are about to build against each other and have not agreed on shapes
- A legacy endpoint is being wrapped and you need to document what actually happens
- You are adding a field to a public API and need to reason about compatibility
- Tests need data that matches production shape without hitting production

> Contracts are cheaper to change before implementation. Ten minutes here saves a week of
> "which side is right?" later.

## Inputs

| Field | Required | Notes |
| --- | --- | --- |
| \`intent\` | yes | What the caller is trying to accomplish |
| \`resources\` | yes | The nouns involved |
| \`auth\` | no | Defaults to bearer token in \`Authorization\` |
| \`style\` | no | \`rest\` (default) or \`rpc\` |

### Error envelope

Every endpoint returns exactly these shapes. Nothing else.

\`\`\`json
{
  "error": {
    "code": "SKILL_NOT_FOUND",
    "message": "No skill with that id.",
    "details": { "id": "react-ui-builder" },
    "requestId": "req_01HZX9K2"
  }
}
\`\`\`

---

## Steps

1. List the nouns. Each one is a resource with a plural collection URL.
2. Write down, for each action a caller wants, the verb and the URL.
3. Define the shape of each resource in JSON Schema first, prose second.
4. Assign an error code to every failure you can name. Codes are stable; messages are not.
5. Write the happy-path example and the two worst realistic failures.
6. Generate TypeScript types from the schema and export them from the package index.
7. Hand the contract to both teams and book a 20-minute review.

## Endpoint example

| Method | Path | Success | Errors |
| --- | --- | --- | --- |
| \`GET\` | \`/skills\` | \`200\` list | — |
| \`GET\` | \`/skills/:id\` | \`200\` skill | \`404\` |
| \`POST\` | \`/skills\` | \`201\` skill | \`409\`, \`422\` |
| \`PATCH\` | \`/skills/:id\` | \`200\` skill | \`404\`, \`422\` |

## Generated types

\`\`\`ts
export interface Skill {
  id: string
  name: string
  version: string
  tags: string[]
}

export type SkillListResponse = {
  items: Skill[]
  nextCursor: string | null
}

export const SKILL_ERROR_CODES = [
  'SKILL_NOT_FOUND',
  'SKILL_EXISTS',
  'SKILL_INVALID',
] as const

export type SkillErrorCode = (typeof SKILL_ERROR_CODES)[number]
\`\`\`

## Rules

### Compatibility

1. Adding an optional field is a compatible change. Removing or renaming one is not.
2. Dates are ISO 8601 strings with an offset, never epoch milliseconds.
3. Identifiers are opaque strings. Clients must not parse them for meaning.

### Paging and limits

4. Paginated endpoints always return \`nextCursor\`, even when it is \`null\`.
5. Lists are never capped silently; if you truncate, say so in the response.

## Notes

> If you cannot write the failure cases, you do not understand the happy path yet.

- Do not expose database column names as a contract.
- Avoid \`any\` in generated types; unknown fields should be preserved, not dropped.
- Version the whole service, not individual endpoints.
`,
}

const devopsShipIt: Skill = {
  id: 'devops-ship-it',
  name: 'DevOps Ship It',
  description:
    'Takes a merged branch and walks it through build, containerise, deploy, verify, and roll back — with the rollback path written before the deploy runs.',
  author: 'Qingyang',
  version: '2.0.1',
  tags: ['devops', 'ci', 'docker', 'release'],
  category: 'coding',
  license: 'Apache-2.0',
  updatedAt: '2026-09-11',
  featured: true,
  compatibility: { claudeCode: true, codex: true, kimiCode: true },
  changelog: [
    { version: '2.0.0', date: '2026-08-02', note: 'Rewrote around immutable images; mutable tags are now rejected in CI.' },
    { version: '1.5.0', date: '2026-06-18', note: 'Added progressive health checks and a canary stage.' },
    { version: '1.4.0', date: '2026-05-04', note: 'Fixed rollback when migrations run inside the release job.' },
  ],
  icon: '🚀',
  body: `# DevOps Ship It

A release runbook for a small team shipping a static or containerised app a few times a week. It is
deliberately boring: build once, promote the same artefact, verify, and keep a rollback that has
been rehearsed.

## Capability

- Builds one immutable artefact and promotes it through environments unchanged
- Writes the migration step so it is safe to run before, during, or after the code cutover
- Defines health checks that actually detect a broken release
- Produces a rollback command before the deploy starts, not during the incident

## When to Use

- You are about to run a production deploy and want a checklist rather than muscle memory
- Your CI builds twice and you have never been sure which artefact shipped
- You need to hand a release off to someone who did not build the service
- A postmortem asked for a rehearsed rollback and you did not have one

> If you cannot roll back in one command, you do not have a rollback. You have a hope.

## Pipeline stages

| Stage | Gate | Time budget |
| --- | --- | --- |
| install | lockfile unchanged | 2 min |
| typecheck | \`tsc --noEmit\` clean | 3 min |
| test | unit suite green | 5 min |
| build | output committed to artefact | 4 min |
| scan | no critical CVEs | 2 min |
| canary | 5% traffic, 10 min soak | 12 min |
| promote | full traffic | 1 min |

---

## Steps

1. Confirm the working tree is clean and the branch is up to date with \`main\`.
2. Run the full pipeline locally with the same commands CI uses.
3. Tag the commit. The tag is the release identity; the branch name is not.
4. Build the container with a content-addressed tag:

   \`\`\`bash
   IMAGE=ghcr.io/$YOUR_ORG/your-service
   TAG=$(git rev-parse --short HEAD)
   docker build -t "$IMAGE:$TAG" .
   docker push "$IMAGE:$TAG"
   \`\`\`

5. Deploy to canary, then watch the health endpoint for a full soak period.
6. Promote the same tag. Never rebuild between environments.
7. Tag the release in the changelog and announce it.

## Health check

### The endpoint

\`\`\`bash
curl -fsS --max-time 3 https://skill-island.example/healthz
# {"status":"ok","version":"$(git rev-parse --short HEAD)"}
\`\`\`

A health check that only returns \`200\` is useless. It must assert that the version serving
traffic is the version you just deployed.

## Rollback

### One command, please

\`\`\`bash
PREV=$(git describe --tags --abbrev=0 HEAD^)
kubectl -n skill-island set image deploy/web web="$IMAGE:$PREV"
kubectl -n skill-island rollout status deploy/web --timeout=120s
\`\`\`

Run this once per quarter against staging. A rehearsed rollback is the cheapest insurance
available to a small team.

## Migration rules

### Expand

1. Expand: add the new column, keep writing the old one.
2. Backfill in batches with a rate limit.

### Switch

3. Switch reads to the new column.

### Contract

4. Contract: drop the old column in a later release, never the same one.

---

## Notes

- Pin base images by digest, not by \`latest\`.
- A green pipeline that skipped the scan is not green.
- Keep deploys under 20 minutes end to end; slower releases get batched into bigger risks.
`,
}

/* -------------------------------------------------------------------------- */
/* research                                                                   */
/* -------------------------------------------------------------------------- */

const paperReader: Skill = {
  id: 'paper-reader',
  name: 'Paper Reader',
  description:
    'Reads an academic paper end to end and returns a structured brief: claim, method, evidence, and limitations, plus the three follow-up papers worth reading next.',
  author: 'Qingyang',
  version: '1.3.2',
  tags: ['research', 'paper', 'arxiv', 'summarization'],
  category: 'research',
  license: 'MIT',
  updatedAt: '2026-09-27',
  popular: true,
  featured: true,
  compatibility: { claudeCode: true, codex: true, kimiCode: true },
  changelog: [
    { version: '1.3.2', date: '2026-09-27', note: 'Table extraction no longer drops merged header cells.' },
    { version: '1.3.0', date: '2026-07-29', note: 'Added a limitations section — previously the brief was too flattering.' },
    { version: '1.2.1', date: '2026-06-03', note: 'Fixes citation URLs pointing at the abstract page instead of the PDF.' },
  ],
  icon: '📚',
  body: `# Paper Reader

Reads an academic paper properly and returns a structured brief instead of a paragraph of
vibes. The goal is that after 30 seconds you know what was claimed, how it was tested, whether
the evidence supports the claim, and where the authors admit weakness.

## Capability

- Separates the claim from the evidence from the speculation
- Extracts the experimental setup into a table you can compare across papers
- Reports limitations stated by the authors *and* limitations you can infer
- Suggests follow-up reading based on the citation graph, not generic advice

## When to Use

- A new paper lands in your feed and you have 20 minutes, not two hours
- You are writing a related-work section and need precision, not vibes
- A claim from this paper is being repeated somewhere and you want to check the source
- You are reviewing a student paper and want the structure of your feedback first

> A summary that only contains the authors' own framing is marketing. Push on the numbers.

## Output shape

| Section | Length | Notes |
| --- | --- | --- |
| Claim | 1 sentence | What the paper asserts |
| Method | 3 bullets | How they tested it |
| Evidence | table | Numbers, with the baseline they beat |
| Limitations | 3–5 bullets | Author-stated and inferred, labelled |
| Follow-ups | 3 links | Papers that cite or are cited by this one |

---

## Steps

1. Read the abstract, then the figures. Skipping straight to the body wastes the easy part.
   Accept an \`arXiv\` id, a DOI, or a local PDF path — all three work.
2. Find the stated contribution list. Usually a bullet list near the end of the intro.
3. Locate the experimental section and pull out the setup:

   ### Setup extraction

   | Field | Example |
   | --- | --- |
   | Dataset | CIFAR-100 |
   | Split | 50k train / 10k test |
   | Metric | Top-1 accuracy |
   | Baseline | 71.4% (ResNet-50) |
   | Result | 73.9% |
   | Runs | 3 seeds, mean reported |

4. Compute the delta yourself. If the paper claims a 2.5 point gain and the baseline moved
   1.8 points between versions, that is not a 2.5 point gain.
5. Read the limitations section. Then read what they did not evaluate at all.
6. Walk the citation graph outwards three hops and pick three papers that disagree.

## Extraction example

### Types

\`\`\`ts
interface PaperBrief {
  claim: string
  method: string[]
  evidence: { metric: string; baseline: number; result: number; runs: number }[]
  limitations: { text: string; inferred: boolean }[]
  followUps: string[]
}

export function delta(e: PaperBrief['evidence'][number]): number {
  return Number((e.result - e.baseline).toFixed(2))
}
\`\`\`

## Questions to always ask

### The five questions

1. What is the baseline, and was it tuned as hard as the proposed method?
2. How many random seeds? A single run is an anecdote.
3. Is the improvement statistically distinguishable from run-to-run noise?

### And two more

4. Does the evaluation cover the failure cases the authors care about?
5. Would this conclusion survive a different dataset?

## Notes

- Quote the exact sentence for any claim you attribute to the authors.
- If a number only appears in a figure, say so rather than reading it off the axis.
- Never cite a paper you have not read past the abstract.
`,
}

const researchDigest: Skill = {
  id: 'research-digest',
  name: 'Research Digest',
  description:
    'Watches a set of sources on a schedule and produces a short, deduplicated digest with what changed, what matters, and what you can safely ignore.',
  author: 'Qingyang',
  version: '1.2.0',
  tags: ['research', 'rss', 'automation', 'summarization'],
  category: 'research',
  license: 'MIT',
  updatedAt: '2026-08-19',
  popular: true,
  compatibility: { claudeCode: true, codex: false, kimiCode: true },
  icon: '🔬',
  body: `# Research Digest

Collects updates from a fixed list of sources, removes the noise, and writes one short digest
you can read in five minutes. The hard part is not summarising — it is deciding what does not
deserve a line.

## Capability

- Polls RSS, Atom, and plain-text changelogs on a cron schedule
- Deduplicates syndicated copies of the same announcement across sources
- Scores each item by novelty against what you have already seen
- Emits a fixed-structure digest that stays diffable week to week

## When to Use

- You follow twenty sources and read about three of the posts
- Release notes matter to you but only the breaking-change kind
- You want one inbox for a topic instead of twelve tabs
- A weekly summary for a team would help and nobody has time to write it

> If you read every item in the digest, the ranking is wrong. Tune the threshold.

## Item score

| Factor | Weight | Note |
| --- | --- | --- |
| Source trust | 0.30 | Configurable per feed |
| Novelty vs. seen set | 0.35 | Cosine distance on title + summary |
| Relevance to your stack | 0.25 | Keyword match against project config |
| Urgency markers | 0.10 | "breaking", "deprecat", "security" |

Anything scoring below the threshold is dropped, but the count is still reported so you know
the filter is working.

### Tuning the threshold

Start at \`0.55\`. If your digest is unreadable, raise it to \`0.65\` before you add sources.

---

## Steps

1. Define the feed list in \`digest.config.json\`, grouped by topic.

### Fetch and normalise

2. Fetch all feeds in parallel with a per-request timeout of 10 seconds.
3. Normalise each entry to a common record.

### Score and cut

4. Drop anything already in the seen set, keyed on canonical URL.
5. Score the remainder and cut at the threshold.
6. Group by theme, not by source, so related items sit together.
7. Write the digest and update the seen set.

## Config

### digest.config.json

\`\`\`json
{
  "threshold": 0.55,
  "maxItems": 12,
  "sources": [
    { "name": "Vite", "url": "https://vite.dev/blog/rss.xml", "trust": 0.9 },
    { "name": "React", "url": "https://react.dev/rss.xml", "trust": 0.9 },
    { "name": "Hacker News", "url": "https://hnrss.org/frontpage", "trust": 0.4 }
  ]
}
\`\`\`

## Digest template

\`\`\`markdown
## This week

1. **Title** — one sentence on what changed and who is affected. _source, 3 min_
2. **Title** — ...

## Breaking changes

- \`package@x.y.z\` — what breaks and the migration path.

## Ignored

- 14 items below threshold. Say why in one line if the filter looks wrong.
\`\`\`

## Operational notes

### Fetching

- Fetch with a conditional \`If-Modified-Since\` header; most feeds support it.
- Retry once with exponential backoff, then give up and count the failure.

### Storage

- Persist the seen set in SQLite so restarts do not replay the week.
- Never let a single slow feed delay the digest; fail per source, not globally.

---

## Notes

- Two feeds carrying the same press release is one item, not two.
- If an item needs three sentences to explain why you should care, it is not important yet.
- Keep the ignored count visible. A silent filter is indistinguishable from a broken crawler.
`,
}

const summarizer: Skill = {
  id: 'summarizer',
  name: 'Summarizer',
  description:
    'Summarises documents at three depths — one line, one paragraph, one page — and always states what it dropped so you can decide whether to read the original.',
  author: 'Qingyang',
  version: '1.0.3',
  tags: ['summarization', 'writing', 'notes'],
  category: 'research',
  license: 'MIT',
  updatedAt: '2026-06-22',
  compatibility: { claudeCode: true, codex: true, kimiCode: true },
  icon: '✂️',
  body: `# Summarizer

Summarises a document at a depth you choose, and always tells you what it left out. Most summary
tools fail by being confidently incomplete; the fix is to make the omissions explicit.

## Capability

- Three depths: \`one-line\`, \`one-paragraph\`, \`one-page\`
- Preserves numbers, dates, and named entities exactly as written
- Lists what was dropped so you can decide whether to read the source
- Handles long documents by summarising sections first, then the whole

## When to Use

- A long thread or document needs a decision before you read all of it
- You are writing meeting notes and need the shape first
- You need to triage a pile of submissions
- You want to hand someone a summary without misrepresenting the original

> A summary with no omissions section is a paragraph of vibes with extra steps.

## Depth table

| Depth | Target length | Use for |
| --- | --- | --- |
| \`one-line\` | ≤ 25 words | Triage, search results |
| \`one-paragraph\` | 80–120 words | Skim before reading |
| \`one-page\` | 400–600 words | Study notes, hand-offs |

## Output shape

\`\`\`json
{
  "oneLine": "string",
  "oneParagraph": "string",
  "onePage": "string",
  "omitted": [
    { "detail": "string", "why": "string" }
  ],
  "confidence": 0.0
}
\`\`\`

---

## Steps

1. Read the whole document before writing anything. Partial reads produce partial summaries.
2. List the claims the document makes, in the document's own order.
3. Write the one-line summary. If it cannot be done in 25 words, the document has no thesis.
4. Expand to a paragraph, keeping the same thesis.
5. Expand to a page, adding the supporting evidence for each claim.
6. Diff your summary against the claim list. Anything missing goes in \`omitted\`.
7. Report confidence honestly. Low confidence means "read the original", not "here is a caveat".

## Rules

### Fidelity

1. Numbers, dates, versions, and proper nouns are copied verbatim, never paraphrased.
2. Never introduce a claim the document does not make.
3. Hedge when the document hedges. Do not upgrade "may" into "will".

### Conflicts

4. If the document contradicts itself, say so instead of picking a side.

## Chunking long input

### Paragraph-safe chunking

\`\`\`ts
export function chunk(text: string, size = 4000): string[] {
  const paragraphs = text.split(/\\n{2,}/)
  const out: string[] = []
  let buf = ''

  for (const p of paragraphs) {
    if ((buf + p).length > size) {
      if (buf) out.push(buf)
      buf = ''
    }
    buf += (buf ? '\\n\\n' : '') + p
  }
  if (buf) out.push(buf)
  return out
}
\`\`\`

Summarise each chunk at \`one-paragraph\`, then summarise the concatenation at the requested depth.

## Notes

- Length targets are targets, not laws. A dense paragraph may run long; do not pad.
- If the document is mostly boilerplate, say that first — it saves everyone time.
- Never summarise a summary and present it as the original.
`,
}

/* -------------------------------------------------------------------------- */
/* creative                                                                   */
/* -------------------------------------------------------------------------- */

const imagePromptCrafter: Skill = {
  id: 'image-prompt-crafter',
  name: 'Image Prompt Crafter',
  description:
    'Expands a rough visual idea into a structured image prompt with subject, composition, lighting, palette, and negative terms — then logs what the model actually liked.',
  author: 'Qingyang',
  version: '1.5.0',
  tags: ['image', 'prompt', 'creative', 'design'],
  category: 'creative',
  license: 'MIT',
  updatedAt: '2026-09-02',
  popular: true,
  compatibility: { claudeCode: true, codex: true, kimiCode: false },
  icon: '🎨',
  body: `# Image Prompt Crafter

Turns "a nice island scene" into a prompt that gets you what you pictured. Most image models are
not hard to use; they are just badly specified. This skill supplies the missing specification.

## Capability

- Expands a one-line idea into a structured prompt with named sections
- Holds a palette consistent across a whole series of images
- Produces negative terms that actually fix the failure you are seeing
- Keeps a log of prompt → outcome so the next one is better

## When to Use

- You have a feeling for the image but no words for it
- A series of images needs to look like a set
- The model keeps adding text, extra fingers, or a second subject
- You are writing a style guide for image generation

> Describe the picture you already have in your head. Do not describe the model's history.

## Prompt structure

### The seven sections

| Section | Length | Example |
| --- | --- | --- |
| Subject | 1 clause | a small wooden dock on a tropical island |
| Setting | 1 clause | calm shallow lagoon at mid-morning |
| Composition | 1 clause | rule-of-thirds, low horizon, dock leading left |
| Lighting | 1 clause | soft warm sunlight, long gentle shadows |
| Palette | 3–5 hex | \`#FAF6EC\`, \`#7FCB72\`, \`#6FC3DA\` |
| Style | 1 clause | clean flat vector, soft edges, no texture |
| Negative | 3–6 terms | text, watermark, extra limbs |

---

## Steps

1. Write the subject as a noun phrase. No verbs, no mood words yet.
2. Add setting and time of day. Time of day does more for mood than adjectives.
3. Choose composition explicitly. "Rule of thirds" beats "nice composition".
4. Pin five palette values from the project tokens so the result matches the site.
5. Add style, then add negatives that target a specific failure you have seen.
6. Generate four variants. Pick the closest, then describe the delta in words.
7. Log the prompt, the seed, and the delta. That log is the actual asset.

## Example prompt

\`\`\`text
Subject: a small wooden research hut on a grassy island cliff
Setting: tropical coastline, late afternoon
Composition: wide shot, hut on the left third, sea filling the right two thirds
Lighting: warm low sun from the right, long soft shadows
Palette: #FAF6EC, #A8DE9B, #6FC3DA, #8B5E3C
Style: soft flat vector illustration, gentle gradients, no outlines
Negative: text, watermark, photograph, extra windows, people
\`\`\`

## Series consistency

For a set of images that must feel related, hold four things constant:

### The four constants

1. The palette — reuse the exact same five hex values.
2. The style sentence, verbatim.
3. The camera language (wide shot, eye level).
4. The aspect ratio.

Change only the subject and the time of day.

## Negative terms that earn their place

### Targeting a specific failure

| Failure you see | Negative to add |
| --- | --- |
| Gibberish text in the image | \`text, letters, captions, watermark\` |
| Unwanted faces in the background | \`people, crowd, portrait\` |
| Hyper-real when you wanted flat | \`photograph, photorealistic, bokeh\` |
| Blurry edges | \`blurry, lowres, jpeg artifacts\` |

---

## Notes

- Do not stack synonyms. Ten adjectives describing "beautiful" is a weaker prompt than one
  precise lighting description.
- Keep prompts in version control. They are source code.
- If a prompt stops working, the model likely changed — re-test before assuming it is your prompt.
`,
}

const postMaker: Skill = {
  id: 'post-maker',
  name: 'Post Maker',
  description:
    'Turns a rough note into a publishable post: a real opening, a structure that survives skimming, and an honest ending — with frontmatter filled in for you.',
  author: 'Qingyang',
  version: '1.1.2',
  tags: ['writing', 'blog', 'markdown', 'publishing'],
  category: 'creative',
  license: 'MIT',
  updatedAt: '2026-07-08',
  popular: false,
  compatibility: { claudeCode: true, codex: true, kimiCode: true },
  changelog: [
    { version: '1.1.2', date: '2026-07-08', note: 'Opening-paragraph check now rejects "In this post I will".' },
    { version: '1.1.0', date: '2026-05-27', note: 'Added frontmatter generation with sane default tags.' },
    { version: '1.0.0', date: '2026-04-14', note: 'First release.' },
  ],
  icon: '✍️',
  body: `# Post Maker

Turns a messy note into a post someone can finish reading. Most drafts fail in the first
paragraph, so that is where the work goes. Everything after the opening is structure.

## Capability

- Finds the actual claim buried in a page of notes
- Writes an opening that earns the second paragraph
- Structures the middle so a skim-reader still gets it
- Generates frontmatter so the post is publishable as-is

## When to Use

- You have notes, not a draft, and a deadline
- A post feels bloated and you cannot find what to cut
- You need the same post adapted for a newsletter and a changelog
- You write often enough that the structure should be reusable

> If the first paragraph could open any post, it opens none of them.

## Structure

| Part | Length | Job |
| --- | --- | --- |
| Title | ≤ 60 chars | Concrete, not clever |
| Lede | 2–3 sentences | The specific thing that happened |
| Thesis | 1 sentence | What you concluded |
| Body | 3–6 sections | Evidence, one idea per section |
| Turn | 1 paragraph | Where you were wrong |
| Ending | 1–2 sentences | What you will do differently |

## Frontmatter

### Generated header

\`\`\`yaml
---
title: "The rollback I never rehearsed"
date: 2026-07-08
tags: [devops, release]
description: "Why our rollback worked the first time and what we changed afterwards."
---
\`\`\`

---

## Steps

1. Read the notes and write, in one sentence, what the post is actually about.
2. Cut everything that does not serve that sentence. Keep the list; you can re-add.
3. Write the lede with a concrete detail: a number, a name, a moment.
4. State the thesis. If you cannot, the post is two posts.
5. Outline the body as section headings that each make a claim.
6. Write under each heading. Delete any paragraph that repeats a previous one.
7. Add the turn — the part where the argument changed. Readers trust posts with a turn.
8. Fill in frontmatter and check the description length.

## Editing passes

Run these in order. Doing them out of order wastes effort.

### Mechanical

1. **Cut** — remove 20% of the words without losing meaning.
2. **Front-load** — move the conclusion to paragraph two, keep the nuance later.

### Judgement

3. **Concrete** — replace every abstraction with a specific noun: \`config\` becomes
   \`digest.config.json\`, "the settings" becomes the actual setting.
4. **Read aloud** — anything you stumble over, rewrite.
5. **Proofread** — names, dates, version numbers.

## Length targets

| Format | Words | Reading time |
| --- | --- | --- |
| Changelog entry | 40–80 | 30 seconds |
| Newsletter | 400–700 | 3 minutes |
| Blog post | 900–1,600 | 6 minutes |

## Checklist

- [ ] First paragraph contains a concrete detail
- [ ] The thesis is stated by paragraph three
- [ ] Every heading makes a claim, not a label
- [ ] At least one thing in the post is a turn, not a confirmation
- [ ] No sentence uses the word "just", "literally", or "very"
- [ ] Description is under 160 characters

### Cut list

Everything that does not serve the thesis sentence goes in the cut list, not in the trash. You
will want two of those paragraphs back in about a third of the time.

## Notes

- Write the ending last and make it small. Big endings read as marketing.
- If you cannot find a turn, you wrote a report, not a post. That is fine — ship it as a report.
`,
}

const travelPlanner: Skill = {
  id: 'travel-planner',
  name: 'Travel Planner',
  description:
    'Builds a day-by-day itinerary that respects opening hours, transit reality, and how tired you will actually be — with a wet-weather fallback for every outdoor block.',
  author: 'Qingyang',
  version: '1.3.0',
  tags: ['travel', 'planning', 'itinerary', 'life'],
  category: 'life',
  license: 'MIT',
  updatedAt: '2026-08-05',
  popular: true,
  compatibility: { claudeCode: true, codex: true, kimiCode: true },
  icon: '✈️',
  body: `# Travel Planner

Plans a trip you will enjoy rather than a list you will abandon on day two. The hard constraints
are opening hours, transit time between neighbourhoods, and energy — most itineraries ignore all
three.

## Capability

- Fits real opening hours and last-entry times into a day
- Groups things by neighbourhood so you are not crossing town six times
- Caps each day at three anchors and treats everything else as optional
- Provides a wet-weather substitute for every outdoor block
- Produces a budget split that matches how people actually spend

## When to Use

- You have three to ten days and a rough idea of where
- You are travelling with someone whose pace differs from yours
- You want structure without a rigid schedule
- The trip is in a place where transit or holidays complicate things

> An itinerary with six anchors a day is not ambitious, it is a plan you will quit by noon.

## Day shape

### The shape of a good day

| Block | Duration | Energy | Notes |
| --- | --- | --- | --- |
| Anchor 1 | 1.5–2h | high | The thing you came for |
| Lunch | 1h | low | Near anchor 1 |
| Anchor 2 | 1.5h | medium | Same neighbourhood |
| Break | 1h | low | Coffee, park, sit |
| Anchor 3 | 2h | medium | Flexible, droppable |
| Dinner | 2h | low | Near where you end up |

## Weather fallback

| Outdoor plan | Indoor substitute |
| --- | --- |
| Mountain viewpoint | Museum on the same street |
| Coastal walk | Market hall, aquarium |
| Hiking trail | Spa, café district, long lunch |
| Beach afternoon | Cinema, library, shopping |

---

## Steps

1. Fix the dates — pass a \`YYYY-MM-DD\` range; "next weekend" is ambiguous across calendars.
   Check for public holidays and site closures before anything else.
2. Choose a base. One base beats three hotels for a trip under ten days.
3. List every place you actually want to go, then cut to the ones you would regret missing.

### Verify and cluster

4. Verify opening hours and last entry for each. Note the day it is closed.
5. Sort the survivors by neighbourhood and by opening hour.
6. Build days of at most three anchors, leaving a gap between them.

### Finish

7. Attach a wet-weather substitute to every outdoor anchor.
8. Add the transit leg with a realistic walking buffer — 1.5× the map estimate.

## Notes file

\`\`\`bash
# Rough itinerary skeleton kept as markdown in the repo
notes/day-1.md  notes/day-2.md  notes/rain-plan.md

# Check sunrise/sunset so the golden hour plan is not nonsense
python -c "import astral; print(astral.sun.sunrise(astral.LocationInfo('Kyoto','JP',35.01,135.76)).isoformat())"
\`\`\`

## Budget split

### Where the money goes

| Category | Typical share | Notes |
| --- | --- | --- |
| Transport | 25–35% | Book early, especially flights |
| Accommodation | 30–40% | Location beats size |
| Food | 20–25% | One cheap meal a day helps |
| Activities | 10–20% | Pre-book the expensive ones |
| Buffer | 10% | Non-negotiable. Keep it. |

## Rules

1. Never plan more than three anchors per day.
2. Put the hardest thing first, while you still have energy.
3. Leave one full day with no plans. Trips are not a checklist.
4. If two places are in the same neighbourhood, they are the same day.
5. Write the plan so a tired version of you can follow it.

## Packing note

Pack for the weather on day three, not the weather on day one. That is the day you are still
outside when it turns.

---

## Notes

- Book the return ticket before the outbound if anything is non-refundable.
- Save every confirmation offline; phone reception is the first thing to fail abroad.
- Ask one local person a single question per day. It is worth more than any list.
`,
}

/* -------------------------------------------------------------------------- */
/* life                                                                       */
/* -------------------------------------------------------------------------- */

const studySprint: Skill = {
  id: 'study-sprint',
  name: 'Study Sprint',
  description:
    'Runs a 50-minute focus sprint with a single named outcome, an active-recall check at the end, and a written record of what you actually remember.',
  author: 'Qingyang',
  version: '1.1.0',
  tags: ['learning', 'productivity', 'notes', 'life'],
  category: 'life',
  license: 'MIT',
  updatedAt: '2026-06-11',
  compatibility: { claudeCode: true, codex: false, kimiCode: true },
  icon: '📝',
  body: `# Study Sprint

A 50-minute focused work block with a defined outcome, an active-recall check at the end, and a
written record. The record is the point: without it you re-read the same chapter four times and
feel busy.

## Capability

- Forces one named outcome per sprint, written before the timer starts
- Ends with active recall rather than re-reading
- Logs what stuck and what did not, in one line each
- Plans the next sprint from the log

## When to Use

- You are learning something where recall matters, not just familiarity
- Reading feels productive but nothing sticks
- You need to prepare for an exam or a certification
- You are building a habit and need the block to be small enough to repeat

> Re-reading creates the feeling of learning. Closing the book and writing creates the
> actual learning.

## Sprint anatomy

| Phase | Minutes | What happens |
| --- | --- | --- |
| Set outcome | 3 | Write one sentence: "I will be able to …" |
| Recall first | 5 | Blank page, write everything you remember |
| Focus | 35 | New material, no phone, one tab |
| Recall again | 7 | Close everything, write it from memory |

## The log entry

### Four lines, every time

\`\`\`markdown
## 2026-06-11 — CSS cascade layers

Outcome: explain why my override lost to a utility class
Stuck: specificity, \`@layer\` order, \`!important\` still wins
Not stuck: \`:where()\` and zero-specificity selectors
Next sprint: layer order in Tailwind v4 vs plain CSS
Confidence: 3/5
\`\`\`

---

## Steps

1. Write the outcome as a capability, not a topic. "Understand flexbox" fails; "centre a
   modal with flexbox without absolute positioning" passes.
2. Run the first recall pass on a blank page before opening anything.
3. Focus on exactly one thing for 35 minutes. Silence notifications properly.
4. Close everything and write what you remember. This is uncomfortable; that is the signal.
5. Diff against the source and note what was missing.
6. Write the log entry in four lines. Do not skip it.
7. Queue the next sprint from the \`Not stuck\` line.

## Rules

1. One sprint, one topic. If you want two topics, plan two sprints.
2. Stop when the timer stops, even mid-sentence. Momentum is not the goal.
3. "Not stuck" is written in the voice of the topic, not "read more about this".
4. A sprint with no log entry did not happen.

## Recall techniques that work

### Pick one per sprint

| Technique | Best for | Cost |
| --- | --- | --- |
| Blank-page recall | Definitions, lists | Low |
| Feynman explanation | Concepts, mechanisms | Medium |
| Retrieval questions | Facts, numbers | Low |
| Spaced re-test | Anything, over weeks | Low |

> Explain it as if teaching someone who is smart but new. If you reach for jargon to save
> time, you have not understood it.

## Weekly rhythm

- **Monday** — plan three sprints, pick the outcomes
- **Tue / Thu** — two sprints each
- **Saturday** — one long review pass over the week's logs
- **Sunday** — rest. The habit needs a floor, not a ceiling.

---

## Notes

- Two solid sprints beat six scattered ones. Protect the streak over the volume.
- If you cannot state the outcome in one sentence, the material is too broad for one sprint.
- Revisit \`Not stuck\` lines from two weeks ago. That list is your real curriculum.
`,
}

export const mockSkills: Skill[] = [
  reactUiBuilder,
  apiContractWriter,
  devopsShipIt,
  paperReader,
  researchDigest,
  summarizer,
  imagePromptCrafter,
  postMaker,
  travelPlanner,
  studySprint,
]
