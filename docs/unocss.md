## Unocss 安装使用

### 安装依赖

```
//  @unocss/preset-uno 工具类预设
//  @unocss/preset-attributify 属性化模式支持
// @unocss/preset-icons icon支持

pnpm i -D unocss @unocss/preset-uno @unocss/preset-attributify @unocss/preset-icons
```

### 配置

在`vite.config.ts`中配置

```
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 引入Unocss
import Unocss from 'unocss/vite';
import { presetUno, presetAttributify, presetIcons } from 'unocss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Unocss({ // 使用Unocss
      presets: [
        presetUno(),
        presetAttributify(),
        presetIcons()],
    })
  ]
})
```

### main.ts 中引入

```
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// 导入Unocss
import 'uno.css'
createApp(App).mount('#app')

```

### 使用图标

```
比如使用@iconify-json这个图标库
//  https://icones.js.org/
// 
pnpm i -D @iconify-json/logos
```

### unocss 预设

在vite.config.ts增加 rules 规则

```
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import Unocss from 'unocss/vite';
import { presetUno, presetAttributify, presetIcons } from 'unocss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Unocss({
      presets: [
        presetUno(),
        presetAttributify(),
        presetIcons()
      ],
      rules: [ // 在这个可以增加预设规则, 也可以使用正则表达式
        [
          'p-c', // 使用时只需要写 p-c 即可应用该组样式
          {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%)`
          }
        ],
        [/^m-(\d+)$/, ([, d]) => ({ margin: `${d / 4}rem` })],
      ]
    })
  ]
})


```

[样式查询地址](https://uno.antfu.me/)

