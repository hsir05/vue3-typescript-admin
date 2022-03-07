import type { UserConfig, ConfigEnv } from 'vite';
import { wrapperEnv } from "./build/utils";
import { createVitePlugins } from "./build/vite/plugin";
import { resolve } from "path";
import { loadEnv } from "vite";

export default ({ command, mode }: ConfigEnv): UserConfig => {
    const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);
  const { VITE_PUBLIC_PATH, VITE_PORT } = viteEnv;
  const isBuild = command === "build";

  return {
    base: VITE_PUBLIC_PATH,
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
          additionalData: '@import "@/assets/styles/var.scss";',
        },
      },
    },
    server: {
       host: true,
      port: VITE_PORT,
    //   proxy: {
    //     "/api": "http://localhost:8888/",
    //   },
    },
  };
};
