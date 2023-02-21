import type { UserConfig, ConfigEnv } from "vite";
import { wrapperEnv } from "./build/utils";
import { createVitePlugins } from "./build";
import { resolve } from "path";
import { loadEnv } from "vite";
import { createViteProxy } from './build/proxy'
 
export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd(); // 项目根目录
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);
  const { VITE_PUBLIC_PATH, VITE_PORT, VITE_DROP_CONSOLE, VITE_HTTP_PROXY } = viteEnv;
  const isBuild = command === "build";
  const isOpenProxy = VITE_HTTP_PROXY === true 

  return {
    base: VITE_PUBLIC_PATH, //开发或生产环境服务的 公共基础路径
    plugins: createVitePlugins(viteEnv, isBuild),
    resolve: {
      alias: [
        {
          find: /\/#\//,
          replacement: resolve(process.cwd(), ".", "types") + "/",
        },
        { 
          find: "@",
          replacement: resolve(process.cwd(), ".", "src") + "/",
        },
      ],
      dedupe: ["vue"],
    },
    css: {
      preprocessorOptions: {
        scss: {
          charset: false, // 解决scss编译报警告问题
          additionalData: '@import "@/assets/styles/global.scss";',
        },
      },
    },
    server: {
      host: '0.0.0.0',
      port: VITE_PORT,
      open: true,
      proxy: createViteProxy(isOpenProxy)
    },
    optimizeDeps: {
      //在预构建中强制排除的依赖项。
      include: [],
      exclude: ["vue-demi"], // vue-demi同时支持Vue2和3的通用Vue库的开发工具
    },
    build: {
      target: "es2015",
      outDir: "dist", //指定输出路径
      minify: 'terser',
      terserOptions: {
        compress: {
          // 通过false以完全跳过压缩。传递一个对象以指定自定义压缩选项。
          keep_infinity: true,
          drop_console: VITE_DROP_CONSOLE,
        },
      },
     // brotliSize: false, //启用/禁用 brotli 压缩大小报告
      chunkSizeWarningLimit: 2000, // 可以通过合并来对您的块进行后处理。
    },
  };
};
