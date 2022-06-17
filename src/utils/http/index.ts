// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
import { VAxios } from "./Axios";
import { AxiosTransform } from "./axiosTransform";
import axios, { AxiosResponse } from "axios";
import { checkStatus } from "./checkStatus";
import { joinTimestamp, formatRequestDate } from "./helper";
import { RequestEnum, ResultEnum, ContentTypeEnum } from "@/enums/httpEnum";
import { PageEnum } from "@/enums/pageEnum";

import { useGlobSetting } from "@/hooks/setting/index";

import { isString } from "@/utils/is";
import { setObjToUrlParams, deepMerge, isUrl, isTokenExpired } from "@/utils";
import { RequestOptions, Result, CreateAxiosOptions } from "./types";

import { useAppUserStore } from "@/store/modules/useUserStore";
import { useMessage, useDialog } from "naive-ui";
import { otherUrl } from "@/config/config";
import router from "@/router";
import { locStorage } from "@/utils/storage";

const globSetting = useGlobSetting();
const urlPrefix = globSetting.urlPrefix || "";


const naiMessage = useMessage();
const naiDialog = useDialog();

//@ts-ignore
let $message = window.$message;

// 是否有请求正在刷新token
window.isRefreshing = false;
// 被挂起的请求数组
let refreshSubscribers: Fn[] = [];
// 刷新请求（refreshSubscribers数组中的请求得到新的token之后会自执行，用新的token去请求数据）
function onRrefreshed(token: string) {
  refreshSubscribers.map(cb => cb(token));
}
// push所有请求到数组中
// function subscribeTokenRefresh(cb:Fn) {
//   refreshSubscribers.push(cb);
// }

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  /**
   * @description: 处理请求数据
   */
  transformRequestData: (res: AxiosResponse<Result>, options: RequestOptions) => {
    const {
      isShowMessage = true,
      isShowErrorMessage,
      isShowSuccessMessage,
      successMessageText,
      errorMessageText,
      isTransformResponse,
      isReturnNativeResponse,
    } = options;

    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res;
    }
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformResponse) {
      return res;
    }

    const { data } = res;

    if (!data) {
      // return '[HTTP] Request has no return value';
      throw new Error("请求出错，请稍候重试");
    }


    //  这里 code，result，message为 后台统一的字段，需要修改为项目自己的接口返回格式
    const { success, code, message } = data;
    // 请求成功
    // const hasSuccess = data && Reflect.has(data, success) && success === ResultEnum.SUCCESS;
    // const hasSuccess = data && Reflect.has(data, success) && success

    // 是否显示提示信息
    if (isShowMessage) {
      if (success && (successMessageText || isShowSuccessMessage)) {
        // 是否显示自定义信息提示
        naiDialog.success({
          type: "success",
          content: successMessageText || message || "操作成功！",
        });
      } else if (!success && (errorMessageText || isShowErrorMessage)) {
        // 是否显示自定义信息提示
        naiMessage.error(message || errorMessageText || "操作失败！");
      } else if (!success && options.errorMessageMode === "modal") {
        // errorMessageMode=‘custom-modal’的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
        console.log(naiDialog);

        // naiDialog.info({
        //   title: "提示",
        //   content: message,
        //   positiveText: "确定",
        //   onPositiveClick: () => { },
        // });
      }
    }

    // 接口请求成功，直接返回结果
    // if (code === ResultEnum.SUCCESS) {
    //   return result;
    // }
    if (!success && !code && !message) {
      return data
    }

    if (success) {
      return data;
    } else {
      // @ts-ignore
      window.$message.error(message);
    }
    // 接口请求错误，统一提示错误信息 这里逻辑可以根据项目进行修改
    let errorMsg = message;
    switch (code) {
      // 请求失败
      case ResultEnum.ERROR:
        naiMessage.error(errorMsg);
        break;
      // 登录超时
      case ResultEnum.TIMEOUT:
        const LoginName = PageEnum.BASE_LOGIN_NAME;
        const LoginPath = PageEnum.BASE_LOGIN;
        if (router.currentRoute.value?.name === LoginName) return;
        // 到登录页
        errorMsg = "登录超时，请重新登录!";
        naiDialog.warning({
          title: "提示",
          content: "登录身份已失效，请重新登录!",
          positiveText: "确定",
          //negativeText: '取消',
          closable: false,
          maskClosable: false,
          onPositiveClick: () => {
            locStorage.clear();
            window.location.href = LoginPath;
          },
          onNegativeClick: () => { },
        });
        break;
    }

    throw new Error(errorMsg);
  },

  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = true, urlPrefix } = options;

    const isUrlStr = isUrl(config.url as string);

    if (!isUrlStr && joinPrefix) {
      config.url = `${urlPrefix}${config.url}`;
    }

    if (!isUrlStr && apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`;
    }
    const params = config.params || {};
    const data = config.data || false;
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      } else {
        // 兼容restful风格
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`;
        config.params = undefined;
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params);
        if (Reflect.has(config, "data") && config.data && Object.keys(config.data).length > 0) {
          config.params = params;
          // 传参数方式修改
        } else {
          config.data = data;
          config.params = undefined;
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(
            config.url as string,
            Object.assign({}, config.params, config.data)
          );
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params;
        config.params = undefined;
      }
    }
    return config;
  },

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config, options) => {
    // 请求之前处理config
    /// token
    const userStore = useAppUserStore();
    const { refreshTokenData } = useAppUserStore();
    const token = userStore.getToken;
    if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
      // jwt token
      (config as Recordable).headers.Authorization = options.authenticationScheme
        ? `${options.authenticationScheme} ${token}`
        : token;
    }

    // 判断token是否将要过期
    if (isTokenExpired()) {
      // 判断是否正在刷新
      if (!window.isRefreshing) {
        // 将刷新token的标志置为true
        window.isRefreshing = true;
        // 发起刷新token的请求
        refreshTokenData().then((token: string) => {
          // 将标志置为false
          window.isRefreshing = false;
          // 执行数组里的函数,重新发起被挂起的请求
          onRrefreshed(token);
          /*执行onRefreshed函数后清空数组中保存的请求*/
          refreshSubscribers = [];
        }).catch(() => {
          /*将标志置为false*/
          window.isRefreshing = false;
        })
      }
      // /*把请求(token)=>{....}都push到一个数组中*/
      // let retry = new Promise((resolve) => {
      //   /*(token) => {...}这个函数就是回调函数*/
      //   subscribeTokenRefresh(() => {
      //     // config.headers.Authorization = "Bearer " + getToken();
      //     (config as Recordable).headers.Authorization = options.authenticationScheme
      //   ? `${options.authenticationScheme} ${token}`
      //   : token;
      //     /*将请求挂起*/
      //     resolve(config);
      //   });
      // });
      // return retry;
    }
    return config;
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (error: any) => {
    const { response, code, message } = error || {};
    // TODO 此处要根据后端接口返回格式修改
    const msg: string =
      response && response.data && response.data.message ? response.data.message : "";
    const err: string = error.toString();
    try {
      if (code === "ECONNABORTED" && message.indexOf("timeout") !== -1) {
        naiMessage.error("接口请求超时，请刷新页面重试!");
        return;
      }
      if (err && err.includes("Network Error")) {
        naiDialog.info({
          title: "网络异常",
          content: "请检查您的网络连接是否正常",
          positiveText: "确定",
          //negativeText: '取消',
          closable: false,
          maskClosable: false,
          onPositiveClick: () => { },
          onNegativeClick: () => { },
        });
        return Promise.reject(error);
      }
    } catch (error) {
      throw new Error(error as any);
    }
    // 请求是否被取消
    const isCancel = axios.isCancel(error);
    if (!isCancel) {
      checkStatus(error.response && error.response.status, msg);
    } else {
      console.warn(error, "请求被取消！");
    }
    //return Promise.reject(error);
    return Promise.reject(response?.data);
  },
};

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    deepMerge(
      {
        timeout: 50000,
        authenticationScheme: "",
        // 接口前缀
        prefixUrl: urlPrefix,
        headers: { Accept: ContentTypeEnum.JSON, "Content-Type": ContentTypeEnum.JSON },
        // 数据处理方式
        transform,
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: "none",
          // 接口地址
          apiUrl: globSetting.apiUrl,
          //   apiUrl: "http://test-ngcxpm-api.yiminyueche.com",
          // 接口拼接地址
          urlPrefix: urlPrefix,
          //  是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
          // 是否携带token
          withToken: true,
        },
        withCredentials: false,
      },
      opt || {}
    )
  );
}

export const http = createAxios();

// 项目，多个不同 api 地址，直接在这里导出多个
// src/api ts 里面接口，就可以单独使用这个请求，
// import { httpTwo } from '@/utils/http/axios'
// export const otherHttp = createAxios({
//   requestOptions: {
//     apiUrl: otherUrl,
//     urlPrefix: '',
//   },
// });\

export const otherHttp = createAxios({
  requestOptions: {
    apiUrl: otherUrl
  },
  headers: {
    Accept: ContentTypeEnum.JSON, "Content-Type": ContentTypeEnum.FORM_URLENCODED,
  },
  withCredentials: false,
  // crossDomain: false,
});
