import type { MockMethod } from "vite-plugin-mock";
import type { BackendServiceResult } from "../../src//interface/index";

export default [
  {
    url: "/api/getDict",
    method: "get",
    response: (): BackendServiceResult => {
      return {
        code: 200,
        message: "ok",
        data: "测试mock数据",
      };
    },
  },
] as MockMethod[];
