import { UserConfig } from "vite"
import { resolve, join } from "path"
import mdLoader from "./md-loader"

function pathResolve(dir: string) {
  return resolve(__dirname, ".", dir)
}
const viteConfig: UserConfig = {
  port: 3050,
  // alias a path to a fs directory
  // 路径别名必须以斜杠开头斜杠结尾
  alias: {
    "/@/": pathResolve("."),
  },
  cssPreprocessOptions: {
    less: {
      modifyVars: {
        hack: `true; @import "${join(
          __dirname,
          "./styles/index.less",
        )}";`,
      },
      javascriptEnabled: true,
    },
  },
  plugins: [
    mdLoader({
      prism: {
        theme: "okaidia",
      },
    }),
  ],
}

export default viteConfig
