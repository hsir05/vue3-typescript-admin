import type { Plugin, PluginOption } from "vite";
import Components from "unplugin-vue-components/vite";
import vue from "@vitejs/plugin-vue";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import { visualizer } from "rollup-plugin-visualizer";
import { createHtmlPlugin } from "vite-plugin-html";
import { configCompressPlugin } from "./compress";
import WindiCSS from "vite-plugin-windicss";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import path from "path";

export function createVitePlugins(env: ViteEnv, isBuild: boolean) {
  const { VITE_GLOB_APP_TITLE } = env;
  const {
    VITE_BUILD_COMPRESS,
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
  } = env;

  const vitePlugins: (Plugin | Plugin[] | PluginOption[])[] = [
    vue(),
    Components({
      resolvers: [NaiveUiResolver()],
    }),
    visualizer({
      open: false, // 是否直接打开报告
      gzipSize: false, // 是否显示 gzipSize
      brotliSize: false, // 是否显示brotliSize
    }),
    createHtmlPlugin({
      minify: isBuild,
      inject: {
        data: {
          title: VITE_GLOB_APP_TITLE,
        },
      },
    }),
    WindiCSS(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
      symbolId: "icon-[dir]-[name]",
    }),
  ];

  if (isBuild) {
    vitePlugins.push(
      configCompressPlugin(
        VITE_BUILD_COMPRESS,
        VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE
      )
    );
  }

  return vitePlugins;
}
