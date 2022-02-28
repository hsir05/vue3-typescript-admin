# Vue 3 + Typescript + Router + Vite + Pinia

## 1. 安装依赖及启动

```js
pnpm install //安装依赖

pnpm dev // 启动

```

## 2. 功能配置说明

1. 自动引入 [unplugin-vue-components GitHub](https://github.com/antfu/unplugin-vue-components)

2. 自动压缩/开启压缩报告

    ```js
    rollup-plugin-visualizer // 自动打开打包报告
    vite-plugin-compression // 是否开启压缩
    ```

3. mock 数据

    ​  [mock Github](https://github.com/vbenjs/vite-plugin-mock)


4. vite-plugin-html

    **HTML 压缩能力,EJS 模版能力,多页应用支持,支持自定义entry,支持自定义template**

     [vite-plugin-html](https://github.com/vbenjs/vite-plugin-html/blob/main/README.zh_CN.md)

5. vite-plugin-svg-icons

    [Github](https://github.com/anncwb/vite-plugin-svg-icons)

    方便在项目中使用.svg 文件

    ```js
        pnpm install vite-plugin-svg-icons -D

        import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
        import path from 'path'

        export default () => {
            return {
                plugins: [
                createSvgIconsPlugin({
                    // Specify the icon folder to be cached
                    iconDirs: [path.resolve(process.cwd(), 'src/icons')],
                    // Specify symbolId format
                    symbolId: 'icon-[dir]-[name]',
                    inject?: 'body-last' | 'body-first'
                    customDomId: '__svg__icons__dom__',
                }),
                ],
            }
        }
    ```

    使用

    ```js

        在 src/main.ts

        import 'virtual:svg-icons-register'

        /src/components/SvgIcon.vue

        <template>
            <svg aria-hidden="true">
                <use :href="symbolId" :fill="color" />
            </svg>
        </template>

        <script>
        import { defineComponent, computed } from 'vue'

        export default defineComponent({
            name: 'SvgIcon',
            props: {
                prefix: {
                    type: String,
                    default: 'icon',
                },
                name: {
                    type: String,
                    required: true,
                },
                color: {
                    type: String,
                    default: '#333',
                },
            },
            setup(props) {
                const symbolId = computed(() => `#${props.prefix}-${props.name}`)
                return { symbolId }
            },
        })
        </script>
    ```

6. vite-plugin-style-import 按需导入组件库样式

    ```js
    pnpm add vite-plugin-style-import -D
    效果
    import { Button } from 'ant-design-vue';
    import 'ant-design-vue/lib/button/style/index.js';
    ```

    使用

    ```js
    vite.config.ts 
    import { UserConfigExport } from 'vite'

    import {
    createStyleImportPlugin,
    AndDesignVueResolve,
    VantResolve,
    ElementPlusResolve,
    NutuiResolve,
    AntdResolve,
    } from 'vite-plugin-style-import'

    export default (): UserConfigExport => {
    return {
        // 1. 如果使用的是ant-design 系列的 需要配置这个
        // 2. 确保less安装在依赖 `yarn add less -D`
        css: {
        preprocessorOptions: {
            less: {
            javascriptEnabled: true,
            },
        },
        },
        plugins: [
        createStyleImportPlugin({
            resolves:[
            AndDesignVueResolve(),
            VantResolve(),
            ElementPlusResolve(),
            NutuiResolve(),
            AntdResolve(),]
            libs: [
            // 如果没有你需要的resolve，可以在lib内直接写，也可以给我们提供PR
            {
                libraryName: 'ant-design-vue',
                esModule: true,
                resolveStyle: (name) => {
                return `ant-design-vue/es/${name}/style/index`
                },
            },
            ],
        }),
        ],
    }
    }

    ```

7. css原子化 windicss

   [windi 官网](https://windicss.org/integrations/vite.html)
