/* eslint-disable @typescript-eslint/no-var-requires */

import { Plugin } from "vite"
import { createVuedocBuildPlugin } from "./build"
import { createVuedocServerPlugin } from "./server"

export type VueDocPluginOptions = {
  wrapperClass: string
  previewClass: string
  markdownPlugins: any[]
  prism: {
    theme: "default" | "coy" | "dark" | "funky" | "okaidia" | "solarizedlight" | "tomorrow" | "twilight" | "custom"
  }
}

export default function createVueDocPlugin(options: Partial<VueDocPluginOptions> = {}): Plugin {
  const { wrapperClass = "", previewClass = "", markdownPlugins = [], prism = { theme: "default" } } = options
  const _options: VueDocPluginOptions = {
    wrapperClass,
    previewClass,
    markdownPlugins,
    prism,
  }
  return {
    configureServer: [createVuedocServerPlugin(_options)],
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    rollupPluginVueOptions: {
      include: /\.(vue|md)$/,
    },
    rollupInputOptions: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      plugins: [createVuedocBuildPlugin(_options)],
    },
  }
}
