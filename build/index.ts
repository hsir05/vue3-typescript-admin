import type { Plugin, PluginOption } from "vite";
import Components from "unplugin-vue-components/vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import { visualizer } from "rollup-plugin-visualizer";
import { createHtmlPlugin } from "vite-plugin-html";
import { configCompressPlugin } from "./compress";
import Unocss from 'unocss/vite'
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import path from "path";
// 预设
import { presetIcons, presetAttributify, presetUno } from 'unocss'

export function createVitePlugins(env: ViteEnv, isBuild: boolean) {
    const { VITE_GLOB_APP_SHORT_NAME } = env;
    const {
        VITE_BUILD_COMPRESS,
        VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
    } = env;

    const vitePlugins: (Plugin | Plugin[] | PluginOption[])[] = [
        vue(),
        vueJsx(),
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
                    title: VITE_GLOB_APP_SHORT_NAME,
                },
            },
        }),
        createSvgIconsPlugin({
            iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
            symbolId: "icon-[dir]-[name]",
        }),
        Unocss({
            presets: [presetIcons(), presetAttributify(), presetUno()],
            rules: [
                ['flex', { display: "flex" }],
                ['green', { color: "green" }],
                ['font28', { 'font-size': '40px' }],
                [/^m-(\d+)$/, ([, d]) => ({ margin: `${Number(d) * 10}px` })],
            ],
            // 组合样式 自定义
            shortcuts: {
                fuck: ['green', 'font28']
            }
        })

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
