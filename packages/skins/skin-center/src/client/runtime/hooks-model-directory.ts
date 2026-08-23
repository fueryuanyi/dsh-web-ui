/**
 * Minimal model-directory handle exposed to skin hooks (optional facet).
 *
 * The skin-center client injects the official `@deepseek-ai/dsh-client-ui-model-selection`
 * module and threads its `modelDirectories` service into the hooks context so
 * interactive skins can read the current model's reasoning efforts and select
 * a reasoning effort (the real "slider" of the Liang skin). The types here are
 * a local structural contract on purpose: the skin-center does not depend on
 * the model-selection package's types, only on the runtime shape.
 */

export interface HooksModelSelection {
  provider: string
  model: string
  reasoningEffort?: string
}

export interface HooksModelDirectory {
  /** Snapshot store of the model directory (subscribe + getSnapshot). */
  readonly store: {
    subscribe(listener: () => void): () => void
    getSnapshot(): unknown
  }
  /** Force a refresh of the directory. */
  load(): Promise<unknown>
  /** Persist a model selection (e.g. a reasoning effort change). */
  select(selection: HooksModelSelection): Promise<boolean>
}

export interface HooksModelDirectories {
  directoryFor(sessionId: string): HooksModelDirectory | undefined
}

/** Minimal session runtime face forwarded to skin hooks. */
export interface HooksSessions {
  readonly list: {
    subscribe(listener: () => void): () => void
    getSnapshot(): { current?: string; ids: string[] }
  }
}
