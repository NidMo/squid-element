/* eslint-disable @typescript-eslint/no-var-requires */

// import fs from 'fs-extra'
import { Plugin } from "rollup"
import { createMarkdownRenderFn, VUEDOC_RE } from "./markdownToVue"

import { VueDocPluginOptions } from "."
import { VueBlockType } from "./remark"

const slash = require("slash")
const debug = require("debug")("vite:vuedoc:build")

const cacheDemos: {
  [key: string]: { component: any; demos: VueBlockType[]; }
} = {}

export function createVuedocBuildPlugin(options: VueDocPluginOptions): Plugin {
  const markdownToVue = createMarkdownRenderFn(options, true)
  return {
    name: "vuedoc",
    resolveId(id) {
      if (VUEDOC_RE.test(id)) {
        return id
      }
      return null
    },
    async load(id) {
      if (id.indexOf("?vue") === -1) {
        if (VUEDOC_RE.test(id)) {
          const [, filepath, demoid] = VUEDOC_RE.exec(id) || []
          debug(`VUEDOC_DEMO:${id} filepath:${filepath} demoid:${demoid}`)
          const md = cacheDemos[slash(filepath)] || { component: "", demos: [] }
          const demo = md.demos.find(item => item.id === demoid)
          debug(`md get:${filepath}`)
          return demo?.code || ""
        }
        if (id.endsWith(".md")) {
          debug(`VUEDOC_MAIN:${id}`)
          const { component, demos } = await markdownToVue(id, id)
          cacheDemos[slash(id)] = { component, demos }
          debug(`md set:${id}`)
          return component
        }
      }

      return null
    },
  }
}
