import type { UserConfig, ConfigEnv } from "vite";
import { wrapperEnv } from "./build/utils";
import { createVitePlugins } from "./build/vite/plugin";
import { resolve } from "path";
import { OUTPUT_DIR } from "./build/constant";
import { loadEnv } from "vite";
import pkg from "./package.json";
import { format } from "date-fns";

const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
};

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd(); // 项目根目录
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);
  const { VITE_PUBLIC_PATH, VITE_PORT, VITE_DROP_CONSOLE } = viteEnv;
  const isBuild = command === "build";

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
    define: {
      // 定义全局变量替换方式。每项在开发时会被定义为全局变量，而在构建时则是静态替换
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    css: {
      preprocessorOptions: {
        scss: {
          charset: false, // 解决scss编译报警告问题
          additionalData: '@import "@/assets/styles/var.scss";',
        },
      },
    },
    server: {
      host: true,
      port: VITE_PORT,
      proxy: {
        //   "*": "http://localhost:8888",
        // "/api": {
        //   target: "http://192.168.1.50:8080",
        //   changeOrigin: true,
        //   rewrite: (path) => {
        //       return path.replace("/api", "") 
        //   },
        // },
        "/api": {
          target: "http://test-ngcxpm-api.yiminyueche.com",
          changeOrigin: true, // 默认changeOrigin的值是true,意味着host设置成target
          rewrite: (path) => {
              return path.replace("/api", "")
          },
        },
        "/attachFile/upload": {
          target: "http://test-ngcxpm-api.yiminyueche.com",
          changeOrigin: true,
        },
      },
    },
    optimizeDeps: {
      //在预构建中强制排除的依赖项。
      include: [],
      exclude: ["vue-demi"], // vue-demi同时支持Vue2和3的通用Vue库的开发工具
    },
    build: {
      target: "es2015",
      outDir: OUTPUT_DIR, //指定输出路径
      terserOptions: {
        compress: {
          // 通过false以完全跳过压缩。传递一个对象以指定自定义压缩选项。
          keep_infinity: true,
          drop_console: VITE_DROP_CONSOLE,
        },
      },
      brotliSize: false, //启用/禁用 brotli 压缩大小报告
      chunkSizeWarningLimit: 2000, // 可以通过合并来对您的块进行后处理。
    },
  };
};
