/**
 * Liang Intensity (滑动变阻器) skin hooks — real reasoning-effort slider.
 *
 * Port of the dsh-liang-skin slider (kingOfSoySauce) onto the skin-center
 * v2 hooks contract. Uses the optional interactive facet: ctx.sessions
 * (current session id) + ctx.modelDirectories (per-session model directory)
 * to read the current model reasoning efforts and SELECT a reasoning effort
 * — the slider really changes the model intensity, plus the 6-stop palette
 * interpolation and portrait stage switching. Guards for the absence of the
 * facet: without it the skin still applies its static look, no slider.
 */

const PACKAGE = "liang-intensity"
const BIND_KEY = "liang-skin:bind-effort"
const PREVIEW_MAX_FRAME = 240
const MAX_LEVEL = 30
const LIANG_RANKS = ["小难梁", "牢梁", "梁子", "梁圣", "梁神", "梁祖"]
const STAGE_FILES = ["stage-00.webp", "stage-06.webp", "stage-12.webp", "stage-18.webp", "stage-24.webp", "stage-30.webp"]

const SLIDER_CSS = `html[data-dsh-skin="liang-intensity"] .liang-effort-control {
  --liang-control-accent: var(--dsw-alias-brand-primary-new-colorprimary-new-color, #4176e6);
  --liang-control-rail: var(--dsw-alias-border-l3, rgb(0 0 0 / 16%));
  position: relative;
  display: flex;
  width: 124px;
  height: 28px;
  align-items: center;
  margin: 0 3px;
  overflow: visible;
}

body[data-liang-skin="on"] html[data-dsh-skin="liang-intensity"] .liang-effort-control {
  --liang-control-accent: var(--liang-secondary);
  --liang-control-rail: color-mix(in srgb, var(--liang-secondary) 28%, transparent);
}

html[data-dsh-skin="liang-intensity"] .liang-effort-control__ticks {
  position: absolute;
  z-index: 0;
  inset: 0 10px;
  pointer-events: none;
}

html[data-dsh-skin="liang-intensity"] .liang-effort-control__ticks::before {
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  height: 1px;
  content: "";
  background: var(--liang-control-rail);
  transform: translateY(-50%);
}

html[data-dsh-skin="liang-intensity"] .liang-effort-control__tooltip {
  position: absolute;
  z-index: 4;
  bottom: calc(100% + 7px);
  left: calc(10px + (100% - 20px) * var(--liang-slider-ratio));
  min-width: max-content;
  padding: 5px 8px;
  border: 1px solid var(--liang-border, rgb(0 0 0 / 12%));
  border-radius: 7px;
  color: var(--liang-ink, #171816);
  background: var(--liang-layer-1, #fff);
  box-shadow: 0 5px 16px rgb(0 0 0 / 16%);
  font-size: 11px;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: 0.01em;
  pointer-events: none;
  transform: translateX(-50%);
  white-space: nowrap;
}

html[data-dsh-skin="liang-intensity"] .liang-effort-control__tooltip::after {
  position: absolute;
  top: 100%;
  left: 50%;
  width: 7px;
  height: 7px;
  content: "";
  background: inherit;
  transform: translate(-50%, -4px) rotate(45deg);
}

html[data-dsh-skin="liang-intensity"] .liang-effort-control__tick {
  position: absolute;
  top: 50%;
  width: 1px;
  height: 7px;
  background: var(--liang-control-accent);
  opacity: 0.42;
  transform: translate(-50%, -50%);
}

html[data-dsh-skin="liang-intensity"] .liang-effort-control__range {
  position: relative;
  z-index: 1;
  width: calc(100% - 7px);
  height: 28px;
  margin: 0 3.5px;
  cursor: ew-resize;
  appearance: none;
  background: transparent;
  touch-action: pan-y;
}

html[data-dsh-skin="liang-intensity"] .liang-effort-control__range:disabled {
  cursor: progress;
  opacity: 0.58;
}

html[data-dsh-skin="liang-intensity"] .liang-effort-control__range::-webkit-slider-runnable-track {
  height: 1px;
  border-radius: 1px;
  background: transparent;
}

html[data-dsh-skin="liang-intensity"] .liang-effort-control__range::-webkit-slider-thumb {
  width: 13px;
  height: 13px;
  margin-top: -6px;
  border: 1.5px solid color-mix(in srgb, var(--liang-control-accent) 72%, transparent);
  border-radius: 50%;
  appearance: none;
  background: radial-gradient(circle, var(--liang-control-accent) 0 2px, color-mix(in srgb, var(--liang-control-accent) 22%, var(--dsw-alias-bg-layer-1, #fff)) 2.5px);
  box-shadow: 0 1px 4px rgb(0 0 0 / 14%);
}

body[data-liang-skin="on"] html[data-dsh-skin="liang-intensity"] .liang-effort-control__range::-webkit-slider-thumb {
  width: 13px;
  height: 13px;
  margin-top: -6px;
  border-color: color-mix(in srgb, var(--liang-control-accent) 72%, transparent);
  background: radial-gradient(circle, var(--liang-control-accent) 0 2px, color-mix(in srgb, var(--liang-control-accent) 22%, var(--liang-layer-1)) 2.5px);
}

html[data-dsh-skin="liang-intensity"] .liang-effort-control__range::-moz-range-track {
  height: 1px;
  background: transparent;
}

html[data-dsh-skin="liang-intensity"] .liang-effort-control__range::-moz-range-progress {
  height: 1px;
  background: transparent;
}

html[data-dsh-skin="liang-intensity"] .liang-effort-control__range::-moz-range-thumb {
  width: 11px;
  height: 11px;
  border: 1.5px solid color-mix(in srgb, var(--liang-control-accent) 72%, transparent);
  border-radius: 50%;
  background: color-mix(in srgb, var(--liang-control-accent) 24%, var(--dsw-alias-bg-layer-1, #fff));
}

html[data-dsh-skin="liang-intensity"] .liang-effort-control__range:focus-visible {
  outline: none;
}

html[data-dsh-skin="liang-intensity"] .liang-effort-control[data-state="error"] {
  --liang-control-accent: var(--dsw-alias-state-error-primary, #e43c3c);
}

.liang-appearance-choice {
  box-sizing: border-box;
  border: 1px solid var(--dsw-alias-border-l2);
  flex: 180px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 20px 32px;
  border-radius: 16px;
  font: inherit;
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
  background: transparent;
  font-size: 14px;
  line-height: 22px;
  display: flex;
}

[class*="_8HJdBW_cubeRow"]:has(.liang-appearance-choice) {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.liang-appearance-choice:hover:not([aria-pressed="true"]) {
  background: var(--dsw-alias-interactive-bg-hover);
}

.liang-appearance-choice[aria-pressed="true"] {
  border-color: var(--dsw-static-neutral-bluish-400);
  background: var(--dsw-alias-bg-module-platform);
}

.liang-appearance-choice__icon {
  display: block;
  flex: 0 0 16px;
  width: 16px;
  height: 16px;
  color: currentColor;
  font-size: 16px;
  line-height: 16px;
}

.liang-appearance-choice__label {
  display: block;
}

`

// 6-stage palette anchors (original calibrator, from logic.ts).
const STOPS = [
  { at: 0, page: [232, 233, 229], surface: [248, 248, 245], surface2: [238, 239, 235], ink: [23, 24, 22], secondary: [112, 116, 111], accent: [181, 43, 36], portraitOpacity: 0.92 },
  { at: 6, page: [211, 211, 206], surface: [239, 239, 234], surface2: [224, 224, 218], ink: [26, 26, 24], secondary: [101, 101, 96], accent: [181, 43, 36], portraitOpacity: 0.93 },
  { at: 12, page: [171, 168, 162], surface: [211, 208, 201], surface2: [190, 186, 179], ink: [27, 26, 24], secondary: [83, 79, 74], accent: [166, 54, 42], portraitOpacity: 0.94 },
  { at: 18, page: [117, 112, 106], surface: [154, 148, 140], surface2: [128, 122, 115], ink: [24, 22, 20], secondary: [65, 61, 56], accent: [154, 56, 42], portraitOpacity: 0.94 },
  { at: 24, page: [43, 39, 37], surface: [48, 43, 40], surface2: [58, 51, 46], ink: [244, 241, 232], secondary: [184, 180, 169], accent: [181, 92, 54], portraitOpacity: 0.94 },
  { at: 30, page: [17, 17, 17], surface: [30, 27, 25], surface2: [41, 35, 30], ink: [244, 241, 232], secondary: [184, 180, 169], accent: [193, 154, 73], portraitOpacity: 0.94 },
]

function clampFrame(value) {
  if (!Number.isFinite(value)) return 0
  return Math.min(PREVIEW_MAX_FRAME, Math.max(0, Math.round(value)))
}
function frameForEffort(index, count) {
  if (count <= 1 || !Number.isFinite(index)) return 0
  const safe = Math.min(count - 1, Math.max(0, Math.round(index)))
  return Math.round((safe / (count - 1)) * PREVIEW_MAX_FRAME)
}
function nearestEffortIndex(frame, efforts) {
  if (efforts.length === 0) return -1
  let best = 0
  let distance = Math.abs(clampFrame(frame) - frameForEffort(0, efforts.length))
  for (let index = 1; index < efforts.length; index += 1) {
    const next = Math.abs(clampFrame(frame) - frameForEffort(index, efforts.length))
    if (next < distance) { best = index; distance = next }
  }
  return best
}
function selectedEffortIndex(efforts, selectedId, defaultId) {
  const id = selectedId ?? defaultId
  return id === undefined ? -1 : efforts.findIndex((effort) => effort.id === id)
}
function liangRankForFrame(rawFrame) {
  const level = (clampFrame(rawFrame) / PREVIEW_MAX_FRAME) * MAX_LEVEL
  const index = level >= MAX_LEVEL ? LIANG_RANKS.length - 1 : Math.floor(level / 6)
  return LIANG_RANKS[Math.min(LIANG_RANKS.length - 1, Math.max(0, index))]
}
function indicatorLabel(rawFrame, efforts) {
  const effort = efforts[nearestEffortIndex(rawFrame, efforts)]
  return effort === undefined ? liangRankForFrame(rawFrame) : `${liangRankForFrame(rawFrame)} · ${effort.name}`
}
function lerp(a, b, t) { return a + (b - a) * t }
function mix(a, b, amount) { return [Math.round(lerp(a[0], b[0], amount)), Math.round(lerp(a[1], b[1], amount)), Math.round(lerp(a[2], b[2], amount))] }
function rgb(value, alpha = 1) {
  return alpha === 1 ? `rgb(${value[0]} ${value[1]} ${value[2]})` : `rgb(${value[0]} ${value[1]} ${value[2]} / ${alpha})`
}
function paletteForFrame(rawFrame) {
  const frame = clampFrame(rawFrame)
  const level = (frame / PREVIEW_MAX_FRAME) * MAX_LEVEL
  const portraitStage = Math.min(5, Math.floor(level / 6))
  const portraitFrom = STOPS[portraitStage]
  const portraitTo = STOPS[Math.min(5, portraitStage + 1)]
  const portraitAmount = portraitFrom === portraitTo ? 0 : (level - portraitFrom.at) / (portraitTo.at - portraitFrom.at)
  const dark = level >= 24
  const ui = dark ? STOPS[5] : STOPS[0]
  const page = ui.page, surface = ui.surface, surface2 = ui.surface2
  const ink = ui.ink, secondary = ui.secondary
  const sidebar = mix(page, surface2, 0.25)
  const accent = dark ? [193, 154, 73] : [65, 118, 230]
  const accentHover = mix(accent, ink, 0.13)
  return {
    level, stage: dark ? 5 : 0, strength: level / MAX_LEVEL,
    page: rgb(page), base: rgb(page, dark ? 0.42 : 0.28),
    layer1: rgb(surface, 0.94), layer2: rgb(surface2, 0.96), layer3: rgb(surface2, 0.99),
    sidebar: rgb(sidebar, 0.96), ink: rgb(ink), secondary: rgb(secondary),
    tertiary: rgb(mix(secondary, page, 0.28)), border: rgb(ink, dark ? 0.15 : 0.12),
    accent: rgb(accent), accentHover: rgb(accentHover), hover: rgb(ink, dark ? 0.09 : 0.07),
    portraitOpacity: String(lerp(portraitFrom.portraitOpacity, portraitTo.portraitOpacity, portraitAmount)),
    portraitFrom: portraitStage, portraitTo: Math.min(5, portraitStage + 1),
  }
}

function modelReasoning(state) {
  const current = state?.current
  if (current === null || current === undefined) return null
  const group = (state.groups ?? []).find((item) => item.id === current.provider)
  const model = group?.models?.find((item) => item.id === current.model)
  if (model?.reasoning === undefined) return null
  return { selection: current, efforts: model.reasoning.efforts, defaultEffort: model.reasoning.defaultEffort }
}

export default function defineSkinHooks() {
  return {
    apply(ctx) {
      const doc = document
      const body = doc.body
      const cleanups = []
      const onCleanup = (fn) => { cleanups.push(fn); ctx.onCleanup(fn) }
      const asset = (name) => `${ctx.assetBase}/assets/${name}`

      const style = doc.createElement("style")
      style.dataset.skinOwner = PACKAGE
      style.textContent = SLIDER_CSS
      doc.head.append(style)
      onCleanup(() => style.remove())

      // No interactive facet -> static look only.
      if (!ctx.modelDirectories || !ctx.sessions) return
      const sessions = ctx.sessions
      const resolver = ctx.modelDirectories

      const previousTokens = new Map()
      const TOKEN_KEYS = ["--dsw-alias-bg-base","--dsw-alias-bg-layer-1","--dsw-alias-bg-layer-2","--dsw-alias-bg-layer-3","--dsw-alias-bg-module-platform","--dsw-alias-bg-overlay","--dsw-alias-border-l1","--dsw-alias-border-l2","--dsw-alias-border-l3","--dsw-alias-brand-primary","--dsw-alias-brand-text","--dsw-alias-button-primary-fill","--dsw-alias-button-primary-hover","--dsw-alias-button-info-fill","--dsw-alias-button-info-hover","--dsw-alias-button-floating-fill","--dsw-alias-button-floating-hover","--dsw-alias-interactive-bg-active","--dsw-alias-interactive-bg-hover","--dsw-alias-interactive-bg-hover-solid","--dsw-alias-label-primary","--dsw-alias-label-secondary","--dsw-alias-label-tertiary","--dsw-alias-label-caption","--dsw-alias-state-business-primary","--dsw-alias-state-business-tertiary","--dsw-specific-bubble","--dsw-specific-bubble-highlight","--dsw-specific-input-major","--dsw-specific-menu","--dsw-specific-selector","--dsw-specific-sidebar-fill","--dsw-specific-sidebar-nav-item-active","--dsw-specific-sidebar-nav-item-active-accent","--dsw-specific-sidebar-nav-item-hover"]
      for (const key of TOKEN_KEYS) previousTokens.set(key, body.style.getPropertyValue(key))

      let portraitEl = null
      const applyPalette = (frame) => {
        const p = paletteForFrame(frame)
        body.style.setProperty("--liang-slider-ratio", String(frame / PREVIEW_MAX_FRAME))
        const map = {
          "--dsw-alias-bg-base": p.base, "--dsw-alias-bg-layer-1": p.layer1, "--dsw-alias-bg-layer-2": p.layer2,
          "--dsw-alias-bg-layer-3": p.layer3, "--dsw-alias-bg-module-platform": p.layer3, "--dsw-alias-bg-overlay": p.layer3,
          "--dsw-alias-border-l1": p.border, "--dsw-alias-border-l2": p.border, "--dsw-alias-border-l3": `color-mix(in srgb, ${p.accent} 40%, transparent)`,
          "--dsw-alias-brand-primary": p.accent, "--dsw-alias-brand-text": p.accentHover,
          "--dsw-alias-button-primary-fill": p.accent, "--dsw-alias-button-primary-hover": p.accentHover,
          "--dsw-alias-button-info-fill": p.accent, "--dsw-alias-button-info-hover": p.accentHover,
          "--dsw-alias-button-floating-fill": p.layer2, "--dsw-alias-button-floating-hover": p.layer3,
          "--dsw-alias-interactive-bg-active": p.hover, "--dsw-alias-interactive-bg-hover": p.hover,
          "--dsw-alias-interactive-bg-hover-solid": p.layer3,
          "--dsw-alias-label-primary": p.ink, "--dsw-alias-label-secondary": p.secondary,
          "--dsw-alias-label-tertiary": p.tertiary, "--dsw-alias-label-caption": p.tertiary,
          "--dsw-alias-state-business-primary": p.accent, "--dsw-alias-state-business-tertiary": p.layer3,
          "--dsw-specific-bubble": p.layer1, "--dsw-specific-bubble-highlight": p.layer2,
          "--dsw-specific-input-major": p.layer2, "--dsw-specific-menu": p.layer3, "--dsw-specific-selector": p.layer3,
          "--dsw-specific-sidebar-fill": p.sidebar, "--dsw-specific-sidebar-nav-item-active": p.hover,
          "--dsw-specific-sidebar-nav-item-active-accent": p.accent, "--dsw-specific-sidebar-nav-item-hover": p.hover,
        }
        for (const [k, v] of Object.entries(map)) body.style.setProperty(k, v)
        if (portraitEl !== null) {
          portraitEl.style.backgroundImage = `url("${asset(STAGE_FILES[p.portraitFrom] ?? STAGE_FILES[0])}")`
          portraitEl.style.opacity = p.portraitOpacity
        }
      }

      // Portrait backdrop (fixed, behind content).
      portraitEl = doc.createElement("div")
      portraitEl.className = "liang-portrait"
      portraitEl.setAttribute("aria-hidden", "true")
      portraitEl.style.cssText = "position:fixed;inset:0;z-index:0;pointer-events:none;background-size:cover;background-position:center;transition:opacity 180ms linear;"
      body.append(portraitEl)
      onCleanup(() => portraitEl.remove())

      // Slider control.
      const control = doc.createElement("div")
      control.className = "liang-effort-control"
      const ticks = doc.createElement("div")
      ticks.className = "liang-effort-control__ticks"
      const tooltip = doc.createElement("div")
      tooltip.className = "liang-effort-control__tooltip"
      const range = doc.createElement("input")
      range.type = "range"
      range.className = "liang-effort-control__range"
      range.min = "0"
      range.max = String(PREVIEW_MAX_FRAME)
      range.step = "1"
      range.setAttribute("aria-label", "推理强度滑动变阻器")
      control.append(ticks, tooltip, range)
      const mountSlider = () => {
        const card = doc.querySelector("[data-composer-card]")
        if (card === null || card.contains(control)) return
        // Prefer the input row's trailing area (next to the model seat,
        // where the original conversation.input.right slot rendered); fall
        // back to the card root.
        const trailing = card.querySelector("[class*=trailing]")
        const target = trailing ?? card
        target.append(control)
      }
      const mountObserver = new MutationObserver(() => mountSlider())
      mountObserver.observe(body, { childList: true, subtree: true })
      mountSlider()
      onCleanup(() => { mountObserver.disconnect(); control.remove() })

      // State wiring: current session -> directory -> efforts.
      let directory = null, efforts = [], selection = null, committedFrame = PREVIEW_MAX_FRAME, bindEffort = true
      try { bindEffort = localStorage.getItem(BIND_KEY) !== "0" } catch { /* ignore */ }

      const syncLabel = (frame) => {
        tooltip.textContent = indicatorLabel(frame, efforts)
        tooltip.style.setProperty("--liang-slider-ratio", String(frame / PREVIEW_MAX_FRAME))
        range.style.setProperty("--liang-slider-ratio", String(frame / PREVIEW_MAX_FRAME))
      }
      const syncFromSnapshot = () => {
        const snapshot = sessions.list.getSnapshot()
        const sessionId = snapshot?.current
        if (sessionId === undefined || sessionId === null) { control.style.display = "none"; return }
        try {
          if (directory === null) directory = resolver.directoryFor(sessionId)
        } catch { control.style.display = "none"; return }
        const reasoning = modelReasoning(directory.store.getSnapshot())
        if (reasoning === null || reasoning.efforts.length < 2) { control.style.display = "none"; return }
        efforts = reasoning.efforts
        selection = reasoning.selection
        const committedIndex = selectedEffortIndex(efforts, selection.reasoningEffort, reasoning.defaultEffort)
        committedFrame = committedIndex < 0 ? PREVIEW_MAX_FRAME : frameForEffort(committedIndex, efforts.length)
        control.style.display = ""
        ticks.replaceChildren()
        for (const effort of efforts) {
          const t = doc.createElement("span")
          t.className = "liang-effort-control__tick"
          t.title = effort.name
          ticks.append(t)
        }
        if (bindEffort && !range.matches(":active")) range.value = String(committedFrame)
        syncLabel(committedFrame)
        applyPalette(committedFrame)
      }

      const onInput = () => {
        const frame = Number(range.value)
        syncLabel(frame)
        applyPalette(frame)
        if (!bindEffort) return
        const index = nearestEffortIndex(frame, efforts)
        const target = efforts[index]
        if (target === undefined || selection === null) return
        syncLabel(frameForEffort(index, efforts.length))
        void directory.select({ provider: selection.provider, model: selection.model, reasoningEffort: target.id })
          .then(() => {}, () => {})
      }

      let storeUnsub = () => {}
      if (directory !== null) storeUnsub = directory.store.subscribe(() => { syncFromSnapshot() })
      const sessionsUnsub = sessions.list.subscribe(() => { syncFromSnapshot() })
      range.addEventListener("input", onInput)
      range.addEventListener("change", onInput)
      onCleanup(() => {
        storeUnsub(); sessionsUnsub()
        for (const [k, v] of previousTokens) {
          if (v === "") body.style.removeProperty(k)
          else body.style.setProperty(k, v)
        }
        body.style.removeProperty("--liang-slider-ratio")
      })
      syncFromSnapshot()
    },
  }
}
