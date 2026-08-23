/**
 * ORCA LINK skin hooks — v2 skin contract escape hatch
 * (x-org.linxin666.skin-center/v1alpha1).
 *
 * Faithful port of the presentation soul of the orca-link bundle
 * (Small-tailqwq/dsh-deep-whale): the hero/active background crossfade
 * driven by the conversation phase, the sidebar wordmark and link-status
 * signal, the standby chrome and the hero headline typewriter. Art is
 * served from this skin asset directory via ctx.assetBase. Loading this
 * module executes nothing; apply() owns every write and registers
 * retraction through ctx.onCleanup.
 */

const SKIN_OWNER = "orca-link"
const SKIN_TITLE = "ORCA LINK · DSH"
const LIGHT_HERO = "--orca-link-light-hero-art"
const LIGHT_ACTIVE = "--orca-link-light-active-art"
const DARK_HERO = "--orca-link-dark-hero-art"
const DARK_ACTIVE = "--orca-link-dark-active-art"
const SIDEBAR_WIDTH = "--orca-sidebar-width"
const SIDEBAR_ART_WIDTH = "--orca-sidebar-art-width"
const SIDEBAR_WIDE = "data-orca-sidebar-wide"
const SCENE_ATTR = "data-orca-scene"
const BODY_SKIN_ATTR = "data-dsh-orca-link"
const CONVERSATION_SCROLL_SELECTOR = "[data-conversation-scroll]"
const SIDEBAR_LOGO_ROW_SELECTOR = "[data-slot=sidebar] > :first-child > :first-child"
const SIGNAL_SELECTOR = "[data-orca-link-signal]"
const SIGNAL_LABEL_SELECTOR = "[data-orca-link-signal-label]"
const HIGH_CHURN_SELECTOR = ".xterm, [data-input-backdrop]"

const SCENE_CSS = `html[data-dsh-skin="orca-link"] .lightScene {
  position: fixed;
  z-index: 0;
  inset: 0;
  display: block;
  overflow: hidden;
  pointer-events: none;
  background: #f6f1e7;
}

html[data-dsh-skin="orca-link"] body[data-ds-dark-theme] .lightScene {
  display: none;
}

html[data-dsh-skin="orca-link"] .lightScene::after {
  content: '';
  position: absolute;
  z-index: 2;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(248, 250, 253, 0.34) 0%, rgba(248, 250, 253, 0.18) 46%, rgba(248, 250, 253, 0.02) 72%),
    linear-gradient(180deg, rgba(248, 250, 253, 0.03), transparent 68%, rgba(239, 243, 248, 0.16));
}

html[data-dsh-skin="orca-link"] .lightSceneLayer {
  position: absolute;
  z-index: 1;
  inset: 0;
  opacity: 0;
  transform: scale(1.008);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  filter: saturate(0.9) contrast(0.98) blur(0);
  will-change: opacity, transform, filter;
  transition:
    opacity 640ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 900ms cubic-bezier(0.22, 1, 0.36, 1),
    filter 640ms cubic-bezier(0.22, 1, 0.36, 1);
}

html[data-dsh-skin="orca-link"] .lightSceneHero {
  opacity: 0.94;
  transform: scale(1) translateY(0);
  filter: saturate(0.9) contrast(0.98) blur(0);
  background-image: var(--orca-link-light-hero-art);
}

html[data-dsh-skin="orca-link"] .lightSceneActive {
  opacity: 0;
  transform: scale(1.015) translateY(6px);
  filter: saturate(0.9) contrast(0.98) blur(2px);
  background-image: var(--orca-link-light-active-art);
}

html[data-dsh-skin="orca-link"] body:not([data-ds-dark-theme])[data-orca-scene='active'] .lightSceneHero {
  opacity: 0;
  transform: scale(1.02) translateY(-8px);
  filter: saturate(0.9) contrast(0.98) blur(2px);
}

html[data-dsh-skin="orca-link"] body:not([data-ds-dark-theme])[data-orca-scene='active'] .lightSceneActive {
  opacity: 0.94;
  transform: scale(1) translateY(0);
  filter: saturate(0.9) contrast(0.98) blur(0);
}

/* Dark mode is a two-state narrative rather than a decorative wallpaper:
   the mug scene welcomes the user in hero/empty states, while the reading
   scene takes over once a task begins. Both use the same crop, grade and
   veil so the crossfade feels like one room changing posture. */
html[data-dsh-skin="orca-link"] .darkScene {
  position: fixed;
  z-index: 0;
  inset: 0;
  display: none;
  overflow: hidden;
  pointer-events: none;
  background: #090d14;
}

html[data-dsh-skin="orca-link"] body[data-ds-dark-theme] .darkScene {
  display: block;
}

html[data-dsh-skin="orca-link"] .darkScene::after {
  content: '';
  position: absolute;
  z-index: 2;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(6, 10, 16, 0.58) 0%, rgba(6, 10, 16, 0.38) 38%, rgba(6, 10, 16, 0.12) 68%, rgba(6, 10, 16, 0.18) 100%),
    linear-gradient(180deg, rgba(5, 9, 15, 0.08), rgba(7, 11, 18, 0.12) 58%, rgba(5, 9, 15, 0.34));
}

html[data-dsh-skin="orca-link"] .darkSceneLayer {
  position: absolute;
  z-index: 1;
  inset: 0;
  opacity: 0;
  transform: scale(1.01);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  filter: brightness(0.88) saturate(0.74) contrast(1.05) blur(0);
  will-change: opacity, transform, filter;
  transition:
    opacity 640ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 900ms cubic-bezier(0.22, 1, 0.36, 1),
    filter 640ms cubic-bezier(0.22, 1, 0.36, 1);
}

html[data-dsh-skin="orca-link"] .darkSceneHero {
  opacity: 0.94;
  transform: scale(1) translateY(0);
  filter: brightness(0.88) saturate(0.74) contrast(1.05) blur(0);
  background-image: var(--orca-link-dark-hero-art);
}

html[data-dsh-skin="orca-link"] .darkSceneActive {
  opacity: 0;
  transform: scale(1.015) translateY(6px);
  filter: brightness(0.88) saturate(0.74) contrast(1.05) blur(2px);
  background-image: var(--orca-link-dark-active-art);
}

html[data-dsh-skin="orca-link"] body[data-ds-dark-theme][data-orca-scene='active'] .darkSceneHero {
  opacity: 0;
  transform: scale(1.02) translateY(-8px);
  filter: brightness(0.88) saturate(0.74) contrast(1.05) blur(2px);
}

html[data-dsh-skin="orca-link"] body[data-ds-dark-theme][data-orca-scene='active'] .darkSceneActive {
  opacity: 0.94;
  transform: scale(1) translateY(0);
  filter: brightness(0.88) saturate(0.74) contrast(1.05) blur(0);
}

/* Skin-manager preferences are document attributes, so this stylesheet owns
   only presentation while the shared manager owns persistence and timers. */
html[data-dsh-whale-orca-background='hidden']
  html[data-dsh-skin="orca-link"]
  :is(.lightScene, .darkScene) {
  display: none !important;
}

html[data-dsh-whale-orca-art='hidden']
  html[data-dsh-skin="orca-link"]
  :is(.lightSceneLayer, .darkSceneLayer) {
  opacity: 0 !important;
  visibility: hidden;
}
html[data-dsh-skin="orca-link"] .dshWordmark {
  display: block;
  position: absolute;
  z-index: 1;
  top: 15px;
  left: 4px;
  width: 118px;
  height: 30px;
  color: #11151b;
  opacity: 0.82;
  pointer-events: none;
  /* Collapse through one compositor transform. Resizing the SVG box while
     its origin sat at center made the mark dip before returning to the rail. */
  transform: scale(0.28);
  transform-origin: left top;
  filter: blur(0.18px);
  transition:
    opacity 130ms ease-in,
    transform 160ms cubic-bezier(0.4, 0, 1, 1),
    filter 130ms ease-in;
  will-change: transform, opacity, filter;
}
html[data-dsh-skin="orca-link"][data-orca-sidebar-wide] .dshWordmark {
  opacity: 1;
  transform: scale(1);
  filter: blur(0) drop-shadow(0 0 5px rgba(0, 108, 255, 0.16));
  transition-duration: 180ms, 220ms, 180ms;
  transition-timing-function: ease-out, cubic-bezier(0.16, 1, 0.3, 1), ease-out;
}
html[data-dsh-skin="orca-link"][data-orca-sidebar-wide] [data-slot='sidebar'] > :first-child > :first-child::after {
  animation: orcaWordmarkScan 360ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
html[data-dsh-skin="orca-link"]:not([data-orca-sidebar-wide]) [data-slot='sidebar'] > :first-child > :first-child > button:first-of-type > svg,
html[data-dsh-skin="orca-link"]:not([data-orca-sidebar-wide]) [data-slot='sidebar'] > :first-child > :first-child > button:first-of-type [data-slot='sidebar.brand.mark'] svg {
  opacity: 0;
}
/* The collapsed rail shrinks the logo row to ~35px while the wordmark's
   scaled box is 33x8.4px. The wide-state anchor (left 4px / top 15px) then
   lands the mark right of center and clips the H at the row's overflow
   edge. Center the scaled box inside the live row instead. */
html[data-dsh-skin="orca-link"]:not([data-orca-sidebar-wide]) .dshWordmark {
  left: calc((100% - 33px) / 2);
  top: calc((100% - 8.4px) / 2);
}
html[data-dsh-skin="orca-link"] body[data-ds-dark-theme] .dshWordmark { color: #eef4ff; }

@keyframes orcaWordmarkScan {
  0% {
    opacity: 0;
    transform: translateX(0) scaleY(0.72);
  }
  18% { opacity: 0.92; }
html[data-dsh-skin="orca-link"] .signalChip {
  --orca-signal-color: var(--orca-cyan);
  --orca-signal-wash: color-mix(in srgb, var(--orca-signal-color) 8%, transparent);
  position: absolute; z-index: 1; top: 50%; left: 136px;
  transform: translateY(-50%);
  display: flex; align-items: center; gap: 7px;
  box-sizing: border-box;
  min-height: 18px;
  padding: 4px 7px 4px 6px;
  border-left: 1px solid color-mix(in srgb, var(--orca-signal-color) 52%, transparent);
  background: linear-gradient(90deg, var(--orca-signal-wash), transparent 90%);
  color: color-mix(in srgb, var(--orca-signal-color) 70%, var(--orca-graphite));
  white-space: nowrap; pointer-events: none;
  font: 600 8px/1 ui-monospace, "SFMono-Regular", Consolas, monospace;
  letter-spacing: 0.2em;
  opacity: 0;
  transition: opacity 220ms ease 90ms, color 160ms ease, border-color 160ms ease, background-color 160ms ease;
}
html[data-dsh-skin="orca-link"][data-orca-sidebar-wide] .signalChip { opacity: 1; }
html[data-dsh-skin="orca-link"] .signalDot {
  width: 6px; height: 6px; border-radius: 0;
  flex: 0 0 6px;
  background: var(--orca-signal-color);
  box-shadow: 0 0 10px color-mix(in srgb, var(--orca-signal-color) 70%, transparent);
  animation: orcaSignalPulse 2.6s ease-in-out infinite;
}

html[data-dsh-skin="orca-link"] .signalChip[data-orca-link-status='syncing'],
html[data-dsh-skin="orca-link"] .signalChip[data-orca-link-status='working'] {
  --orca-signal-color: var(--orca-blue);
}

html[data-dsh-skin="orca-link"] .signalChip[data-orca-link-status='approval'] {
  --orca-signal-color: var(--orca-permission-write);
}

html[data-dsh-skin="orca-link"] .signalChip[data-orca-link-status='input'],
html[data-dsh-skin="orca-link"] .signalChip[data-orca-link-status='review'] {
  --orca-signal-color: #8859d6;
}

html[data-dsh-skin="orca-link"] .signalChip[data-orca-link-status='complete'] {
  --orca-signal-color: #238a58;
}

html[data-dsh-skin="orca-link"] .signalChip[data-orca-link-status='fault'] {
  --orca-signal-color: #d14343;
}

html[data-dsh-skin="orca-link"] .signalChip[data-orca-link-status='offline'] {
  --orca-signal-color: #798394;
}

html[data-dsh-skin="orca-link"] .signalChip[data-orca-link-status='ready'] {
  --orca-signal-color: #5483a8;
}

html[data-dsh-skin="orca-link"] .signalChip[data-orca-link-status='working'] .signalDot {
html[data-dsh-skin="orca-link"] .spine {
  position: fixed; top: 0; bottom: 0; left: var(--orca-sidebar-width);
  z-index: 850; width: 9px; transform: translateX(-4px);
  pointer-events: none;
  background: repeating-linear-gradient(180deg, var(--orca-line) 0 1px, transparent 1px 56px);
  -webkit-mask-image: linear-gradient(180deg, transparent, #000 56px, #000 calc(100% - 56px), transparent);
  mask-image: linear-gradient(180deg, transparent, #000 56px, #000 calc(100% - 56px), transparent);
}

/* ---- Hero橱窗：空态是皮肤的展示窗口 -------------------------------------- */

html[data-dsh-skin="orca-link"] [data-phase='hero'] [class*='headlineText'] {
  display: inline-block;
  min-width: 8.2em;
  color: var(--orca-ink);
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-align: left;
  white-space: nowrap;
}
html[data-dsh-skin="orca-link"] [data-phase='hero'] [class*='headlineText']::after {
  content: '';
  display: inline-block;
  width: 9px; height: 9px; margin-left: 10px;
  background: var(--orca-blue);
  box-shadow: 0 0 8px color-mix(in srgb, var(--orca-blue) 50%, transparent);
  animation: orca-terminal-caret 1.05s steps(1, end) infinite;
}

html[data-dsh-skin="orca-link"] .standby {
  position: fixed; bottom: 18px; left: calc(50% + 9vw); z-index: 900;
  display: none; align-items: center; gap: 14px; width: min(420px, 38vw);
  transform: translateX(-50%); color: var(--orca-muted);
  font: 500 8px/1 ui-monospace, "SFMono-Regular", Consolas, monospace;
  letter-spacing: 0.2em; pointer-events: none;
}
html[data-dsh-skin="orca-link"][data-orca-scene='hero'] .standby { display: flex; }
html[data-dsh-skin="orca-link"] .standbyLine {
  flex: 1; height: 1px; background: linear-gradient(90deg, transparent, var(--orca-line));
}
html[data-dsh-skin="orca-link"] .standbyLine:last-child {
  background: linear-gradient(90deg, var(--orca-line), transparent);
}

html[data-dsh-skin="orca-link"] [data-aionui-explorer-col],
html[data-dsh-skin="orca-link"] [data-aionui-preview-col],
html[data-dsh-skin="orca-link"] [data-gitgraph-dialog] {
  border-color: var(--orca-line); background: var(--orca-surface); box-shadow: var(--orca-shadow);
}

/* Icon redraw: matched host glyphs keep their element, sizing and React
   ownership, but the original drawing is retired while the ORCA art group
   (see icons.ts) carries the visible rectilinear geometry instead. */
html[data-dsh-skin="orca-link"] [data-orca-link-icon] > :not([data-orca-link-icon-art]) {
  display: none;
}

/* Busy spinner: the square outline's four edges light up clockwise in hard
   steps, replacing the host's orbiting-dot loader. */
html[data-dsh-skin="orca-link"] [data-orca-link-icon='spinner'] [data-orca-link-spinner-seq] {
  animation: orcaSquareTrace 0.96s infinite;
}
html[data-dsh-skin="orca-link"] [data-orca-link-icon='spinner'] [data-orca-link-spinner-seq='1'] { animation-delay: -0.72s; }
html[data-dsh-skin="orca-link"] [data-orca-link-icon='spinner'] [data-orca-link-spinner-seq='2'] { animation-delay: -0.48s; }
html[data-dsh-skin="orca-link"] [data-orca-link-icon='spinner'] [data-orca-link-spinner-seq='3'] { animation-delay: -0.24s; }
  html[data-dsh-skin="orca-link"] :is([data-pane='sidebar'], [data-slot='sidebar'] > :first-child)::after { display: none; }
  html[data-dsh-skin="orca-link"][data-orca-sidebar-wide] [data-slot='sidebar'] [class*='regionArea'] {
    margin-top: 0;
    border-top: none;
    background: transparent;
    backdrop-filter: none;
  }
  html[data-dsh-skin="orca-link"][data-orca-sidebar-wide] [data-slot='sidebar'] [class*='regionArea']::before { display: none; }
  html[data-dsh-skin="orca-link"] .spine,
  html[data-dsh-skin="orca-link"] .signalChip,
  html[data-dsh-skin="orca-link"] .statusCharacter,
  html[data-dsh-skin="orca-link"] .pricingLight { display: none; }
  html[data-dsh-skin="orca-link"][data-orca-scene='hero'] .standby { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  html[data-dsh-skin="orca-link"] button,
  html[data-dsh-skin="orca-link"] [role='button'],
  html[data-dsh-skin="orca-link"] .dshWordmark,
  html[data-dsh-skin="orca-link"] .statusCharacter,
  html[data-dsh-skin="orca-link"] .statusCharacterBubble,
`

const STATUS_LABELS = {
  standby: "LINK ACTIVE", syncing: "LINK SYNC", working: "TASK RUNNING",
  approval: "AUTH REQUEST", input: "INPUT REQUIRED", review: "PLAN REVIEW",
  complete: "TASK COMPLETE", fault: "LINK FAULT", offline: "LINK OFFLINE", ready: "SESSION READY",
}

const HEADLINE_GROUPS = [["如切如磋，如琢如磨"], ["不诱于誉，不恐于诽", "率道而行，端然正己"]]

function belongsToHighChurnSubtree(node) {
  if (node instanceof Element) return node.matches(HIGH_CHURN_SELECTOR) || node.closest(HIGH_CHURN_SELECTOR) !== null
  return (node.parentElement?.closest(HIGH_CHURN_SELECTOR) ?? null) !== null
}
function isHighChurnOnly(record) {
  if (belongsToHighChurnSubtree(record.target)) return true
  if (record.type !== "childList") return false
  const changed = [...record.addedNodes, ...record.removedNodes]
  return changed.length > 0 && changed.every(belongsToHighChurnSubtree)
}
function hasMutationOutsideTerminal(records) {
  return records.some((record) => !isHighChurnOnly(record))
}

function conversationRoot(body) {
  for (const candidate of body.querySelectorAll("[data-phase]")) {
    if (candidate.querySelector(":scope > [data-conversation-scroll]") !== null) return candidate
  }
  return null
}

function lastFlowRow(flow) {
  const rows = Array.from(flow.children).filter((child) => child instanceof HTMLElement && child.hasAttribute("data-chat-flow-kind"))
  return rows.at(-1) ?? null
}
function lastMeaningfulFlowRow(flow) {
  const rows = Array.from(flow.children).filter((child) => child instanceof HTMLElement && child.dataset.chatFlowKind !== undefined && child.dataset.chatFlowKind !== "turn-tail")
  return rows.at(-1) ?? null
}
function resolveStatus(root) {
  if (root === null) return "standby"
  const phase = root.dataset.phase ?? ""
  if (phase === "hero") return "standby"
  if (phase === "settling") return "syncing"
  if (phase !== "active") return "ready"
  if (root.querySelector("[data-approval-key]") !== null) return "approval"
  if (root.querySelector("[data-plan-review-key]") !== null) return "review"
  if (root.querySelector("[data-question-key]") !== null) return "input"
  const input = root.querySelector("textarea[data-phase]")
  if (input?.dataset.phase === "submitting" || input?.dataset.phase === "adjudicating") return "syncing"
  if (root.querySelector("svg[data-orca-link-icon=stop]") !== null || root.querySelector("[data-state=running]") !== null) return "working"
  if (input?.disabled === true) return "offline"
  const flow = root.querySelector("[data-chat-flow]")
  if (flow === null) return "ready"
  const tail = lastFlowRow(flow)
  const meaningful = lastMeaningfulFlowRow(flow)
  if (meaningful?.querySelector("[data-state=error], [data-state=interrupted]") !== null) return "fault"
  if (tail?.dataset.chatFlowKind === "turn-tail") return "complete"
  return "ready"
}

function text(tag, className, value) {
  const element = document.createElement(tag)
  element.className = className
  element.textContent = value
  return element
}

function splitGraphemes(value) {
  if (typeof Intl.Segmenter === "function") {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" })
    return Array.from(segmenter.segment(value), ({ segment }) => segment)
  }
  return Array.from(value)
}

function shuffledGroupOrder(previousGroup, groupCount) {
  const order = Array.from({ length: groupCount }, (_, index) => index)
  for (let index = order.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1))
    ;[order[index], order[target]] = [order[target], order[index]]
  }
  if (order.length > 1 && order[0] === previousGroup) {
    ;[order[0], order[1]] = [order[1], order[0]]
  }
  return order
}

export default function defineSkinHooks() {
  return {
    apply(ctx) {
      const body = document.body
      const scope = `html[data-dsh-skin="${ctx.scopeAttr}"]`
      const cleanups = []
      const onCleanup = (fn) => { cleanups.push(fn); ctx.onCleanup(fn) }

      const originalTitle = document.title
      const originalStyles = new Map()
      for (const property of [LIGHT_HERO, LIGHT_ACTIVE, DARK_HERO, DARK_ACTIVE, SIDEBAR_WIDTH, SIDEBAR_ART_WIDTH]) {
        originalStyles.set(property, body.style.getPropertyValue(property))
      }
      const originalWide = body.hasAttribute(SIDEBAR_WIDE)
      const originalScene = body.getAttribute(SCENE_ATTR)
      const originalBodySkin = body.getAttribute(BODY_SKIN_ATTR)

      // Art wiring (webp assets served from this skin dir).
      body.style.setProperty(LIGHT_HERO, `url("${ctx.assetBase}/assets/light-hero-v4.webp")`)
      body.style.setProperty(LIGHT_ACTIVE, `url("${ctx.assetBase}/assets/light-active-concept-v3.webp")`)
      body.style.setProperty(DARK_HERO, `url("${ctx.assetBase}/assets/dark-hero-v2.webp")`)
      body.style.setProperty(DARK_ACTIVE, `url("${ctx.assetBase}/assets/dark-active-v2.webp")`)
      body.setAttribute(BODY_SKIN_ATTR, "")

      // Hooks-owned stylesheet with the scene / signal / wordmark / standby chrome.
      const style = document.createElement("style")
      style.dataset.skinOwner = SKIN_OWNER
      style.textContent = SCENE_CSS.replace(/html\\[data-dsh-skin="orca-link"\\]/g, scope)
      document.head.append(style)
      onCleanup(() => style.remove())

      // Scene layers into the fixed background decoration layer (behind #root).
      const lightScene = document.createElement("div")
      lightScene.className = "lightScene"
      lightScene.setAttribute("aria-hidden", "true")
      const lightHero = document.createElement("div")
      lightHero.className = "lightSceneLayer lightSceneHero"
      const lightActive = document.createElement("div")
      lightActive.className = "lightSceneLayer lightSceneActive"
      lightScene.append(lightHero, lightActive)

      const darkScene = document.createElement("div")
      darkScene.className = "darkScene"
      darkScene.setAttribute("aria-hidden", "true")
      const darkHero = document.createElement("div")
      darkHero.className = "darkSceneLayer darkSceneHero"
      const darkActive = document.createElement("div")
      darkActive.className = "darkSceneLayer darkSceneActive"
      darkScene.append(darkHero, darkActive)

      const standby = document.createElement("div")
      standby.className = "standby"
      standby.setAttribute("aria-hidden", "true")
      standby.append(text("span", "standbyLine", ""), text("span", "standbyCopy", "ORCA LINK STANDBY"), text("span", "standbyLine", ""))

      ctx.layers.background.append(lightScene, darkScene, standby)
      onCleanup(() => { lightScene.remove(); darkScene.remove(); standby.remove() })

      // Scene controller: mirror conversation phase onto body[data-orca-scene].
      const syncScene = () => {
        const root = conversationRoot(body)
        const phase = root?.dataset.phase
        const scene = phase === "settling" || phase === "active" ? "active" : "hero"
        if (body.dataset.orcaScene !== scene) body.dataset.orcaScene = scene
      }
      const sceneObserver = new MutationObserver((records) => {
        if (hasMutationOutsideTerminal(records)) syncScene()
      })
      sceneObserver.observe(body, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-phase"] })
      syncScene()
      onCleanup(() => { sceneObserver.disconnect() })

      // Link status: project conversation state onto the sidebar signal chip.
      const syncStatus = () => {
        const status = resolveStatus(conversationRoot(body))
        if (body.dataset.orcaLinkStatus !== status) body.dataset.orcaLinkStatus = status
        const chip = body.querySelector(SIGNAL_SELECTOR)
        if (chip === null) return
        if (chip.dataset.orcaLinkStatus !== status) chip.dataset.orcaLinkStatus = status
        const label = chip.querySelector(SIGNAL_LABEL_SELECTOR)
        if (label !== null && label.textContent !== STATUS_LABELS[status]) label.textContent = STATUS_LABELS[status]
      }
      const statusObserver = new MutationObserver((records) => {
        if (hasMutationOutsideTerminal(records)) syncStatus()
      })
      statusObserver.observe(body, {
        childList: true, subtree: true, attributes: true,
        attributeFilter: ["aria-selected", "data-phase", "data-state", "data-orca-link-icon", "disabled"],
      })
      syncStatus()
      onCleanup(() => { statusObserver.disconnect() })

      // Sidebar wordmark + signal chip.
      const mountDshWordmark = () => {
        const row = document.querySelector(SIDEBAR_LOGO_ROW_SELECTOR)
        if (!(row instanceof HTMLElement)) return false
        const buttons = Array.from(row.querySelectorAll(":scope > button"))
        const brand = buttons.find((button, index) => {
          const label = button.getAttribute("aria-label") ?? ""
          return index === 0 && (buttons.length > 1 || !/sidebar|侧边栏/i.test(label))
        })
        if (brand) brand.dataset.orcaLinkBrand = ""
        if (!row.querySelector(":scope > [data-orca-link-wordmark]")) {
          const wordmark = document.createElementNS("http://www.w3.org/2000/svg", "svg")
          wordmark.classList.add("dshWordmark")
          wordmark.dataset.orcaLinkWordmark = ""
          wordmark.dataset.skinChrome = "wordmark"
          wordmark.setAttribute("viewBox", "0 0 180 44")
          wordmark.setAttribute("aria-hidden", "true")
          wordmark.innerHTML = "<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M4 5H44L57 17V28L44 39H4V5ZM16 14V30H40L46 25V20L40 14H16Z\" fill=\"currentColor\"/><path d=\"M70 5H119L110 14H80L76 18H108L118 27L106 39H59L68 30H101L105 26H72L62 17L70 5Z\" fill=\"currentColor\"/><path d=\"M125 5H137V18H163V5H175V39H163V27H137V39H125V5Z\" fill=\"currentColor\"/>"
          row.append(wordmark)
        }
        if (!row.querySelector(":scope > [data-orca-link-signal]")) {
          const chip = document.createElement("span")
          chip.className = "signalChip"
          chip.dataset.orcaLinkSignal = ""
          chip.setAttribute("aria-hidden", "true")
          const dot = document.createElement("span")
          dot.className = "signalDot"
          const label = text("span", "signalChipLabel", "LINK ACTIVE")
          label.dataset.orcaLinkSignalLabel = ""
          chip.append(dot, label)
          row.append(chip)
        }
        return true
      }
      const wordmarkObserver = new MutationObserver((records) => {
        if (!hasMutationOutsideTerminal(records)) return
        mountDshWordmark()
      })
      mountDshWordmark()
      wordmarkObserver.observe(body, { childList: true, subtree: true })
      onCleanup(() => {
        wordmarkObserver.disconnect()
        document.querySelectorAll("[data-orca-link-wordmark]").forEach((node) => node.remove())
        document.querySelectorAll("[data-orca-link-signal]").forEach((node) => node.remove())
        document.querySelectorAll("[data-orca-link-brand]").forEach((node) => node.removeAttribute("data-orca-link-brand"))
      })

      // Sidebar width sync for the wide/narrow chrome.
      const syncSidebarWidth = () => {
        const pane = document.querySelector("[data-slot=sidebar] > :first-child")
        if (!(pane instanceof Element)) return
        const width = pane.getBoundingClientRect().width
        if (width <= 0) return
        body.style.setProperty(SIDEBAR_WIDTH, `${width}px`)
        body.toggleAttribute(SIDEBAR_WIDE, width > 96)
      }
      const sidebarObserver = new MutationObserver(() => syncSidebarWidth())
      if (document.querySelector("[data-slot=sidebar]") === null) {
        sidebarObserver.observe(body, { childList: true, subtree: true })
        onCleanup(() => sidebarObserver.disconnect())
      }
      syncSidebarWidth()
      const resizeObserver = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(() => syncSidebarWidth())
      resizeObserver?.observe(body)
      onCleanup(() => resizeObserver?.disconnect())

      // Hero headline typewriter.
      const HEADLINE_SELECTOR = "[data-phase=hero] [class*=headlineText]"
      const TYPE_DELAY_MS = 105, DELETE_DELAY_MS = 55, OPEN_DELAY_MS = 320
      const SEGMENT_GAP_MS = 420, GROUP_GAP_MS = 640, GROUP_HOLD_MS = 20000
      const timers = new Set()
      const reducedMotion = body.ownerDocument.defaultView?.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
      let headline = null, originalText = "", renderedText = "", generation = 0, groupOrder = [], previousGroup = -1
      const clearTimers = () => { timers.forEach((timer) => clearTimeout(timer)); timers.clear() }
      const schedule = (callback, delay, token = generation) => {
        const timer = setTimeout(() => { timers.delete(timer); if (token === generation && headline?.isConnected) callback() }, delay)
        timers.add(timer)
      }
      const render = (value) => { renderedText = value; if (headline) headline.textContent = value }
      const typeText = (value, complete) => {
        if (reducedMotion) { render(value); complete(); return }
        const graphemes = splitGraphemes(value)
        let index = 0
        const step = () => {
          if (!headline?.isConnected) return
          index += 1
          render(graphemes.slice(0, index).join(""))
          if (index < graphemes.length) schedule(step, TYPE_DELAY_MS)
          else complete()
        }
        render("")
        schedule(step, OPEN_DELAY_MS)
      }
      const deleteText = (complete) => {
        if (reducedMotion || renderedText.length === 0) { complete(); return }
        const graphemes = splitGraphemes(renderedText)
        let index = graphemes.length
        const step = () => {
          index -= 1
          render(graphemes.slice(0, index).join(""))
          if (index > 0) schedule(step, DELETE_DELAY_MS)
          else complete()
        }
        schedule(step, DELETE_DELAY_MS)
      }
      const typeHeadline = () => {
        const target = body.querySelector(HEADLINE_SELECTOR)
        if (target === null || target === headline) return
        headline = target
        originalText = target.textContent ?? ""
        const groups = HEADLINE_GROUPS
        groupOrder = shuffledGroupOrder(previousGroup, groups.length)
        previousGroup = groupOrder[0]
        let groupIndex = 0
        const playGroup = () => {
          const group = groups[groupOrder[groupIndex]]
          let segmentIndex = 0
          const playSegment = () => {
            const segment = group[segmentIndex]
            const next = () => {
              segmentIndex += 1
              if (segmentIndex < group.length) schedule(playSegment, SEGMENT_GAP_MS)
              else {
                const hold = () => {
                  const advance = () => {
                    groupIndex += 1
                    if (groupIndex < groupOrder.length) schedule(playGroup, GROUP_GAP_MS)
                    else schedule(typeHeadline, GROUP_HOLD_MS)
                  }
                  deleteText(advance)
                }
                schedule(hold, GROUP_HOLD_MS)
              }
            }
            typeText(segment, next)
          }
          playSegment()
        }
        generation += 1
        playGroup()
      }
      const typewriterObserver = new MutationObserver((records) => {
        if (!hasMutationOutsideTerminal(records)) return
        if (body.querySelector(HEADLINE_SELECTOR) !== null) typeHeadline()
      })
      typewriterObserver.observe(body, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-phase"] })
      typeHeadline()
      onCleanup(() => {
        typewriterObserver.disconnect()
        clearTimers()
        generation += 1
        if (headline !== null && headline.textContent === renderedText) headline.textContent = originalText
      })

      // Favicon + title.
      const favicon = document.createElement("link")
      favicon.rel = "icon"
      favicon.href = "data:image/svg+xml;utf8," + encodeURIComponent("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\"><rect width=\"64\" height=\"64\" fill=\"#f7f9fc\"/><path d=\"M8 18c9 1 15 7 18 16 2-11 8-19 18-24-2 9 1 15 7 19 2-3 4-5 7-6-2 16-12 26-28 27-10 0-18-7-22-18-2-6-5-11-10-14Z\" fill=\"#11151b\"/><rect x=\"43\" y=\"26\" width=\"4\" height=\"4\" fill=\"#086cff\"/></svg>")
      document.head.append(favicon)
      document.title = SKIN_TITLE
      onCleanup(() => {
        favicon.remove()
        if (document.title === SKIN_TITLE) document.title = originalTitle
      })

      // Final cleanup of body state.
      onCleanup(() => {
        delete body.dataset.orcaScene
        delete body.dataset.orcaLinkStatus
        delete body.dataset.dshOrcaLink
        for (const [property, value] of originalStyles) {
          if (value === "") body.style.removeProperty(property)
          else body.style.setProperty(property, value)
        }
        body.toggleAttribute(SIDEBAR_WIDE, originalWide)
        if (originalScene === null) body.removeAttribute(SCENE_ATTR)
        else body.setAttribute(SCENE_ATTR, originalScene)
        if (originalBodySkin === null) body.removeAttribute(BODY_SKIN_ATTR)
        else body.setAttribute(BODY_SKIN_ATTR, originalBodySkin)
      })
    },
  }
}
