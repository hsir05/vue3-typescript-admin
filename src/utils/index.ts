import { h, RendererElement } from 'vue';
import { NIcon, NTag } from 'naive-ui';
import { isObject } from './is';

/**
 * render 图标
 * */
export function renderIcon(icon:RendererElement) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const newTagColors = { color: '#f90', textColor: '#fff', borderColor: '#f90' };

export function renderNew(type = 'warning', text = 'New', color: object = newTagColors) {
  return () =>
    h(
      NTag as any,
      {
        type,
        round: true,
        size: 'small',
        color,
      },
      { default: () => text }
    );
}

function addLight(color: string, amount: number) {
  const cc = parseInt(color, 16) + amount;
  const c = cc > 255 ? 255 : cc;
  return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`;
}

export function lighten(color: string, amount: number) {
  color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color;
  amount = Math.trunc((255 * amount) / 100);
  return `#${addLight(color.substring(0, 2), amount)}${addLight(
    color.substring(2, 4),
    amount
  )}${addLight(color.substring(4, 6), amount)}`;
}

export function isUrl(url: string) {
  return /(^http|https:\/\/)/g.test(url);
}

export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string;
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
  }
  return src;
}

// @ts-ignore
export function setObjToUrlParams(baseUrl: string, obj: object): string {
  let parameters = '';
  let url = '';
  for (const key in obj) {

// @ts-ignore
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&';
  }
  parameters = parameters.replace(/&$/, '');
  if (/\?$/.test(baseUrl)) {
    url = baseUrl + parameters;
  } else {
    url = baseUrl.replace(/\/?$/, '?') + parameters;
  }
  return url;
}

// 根究经纬度数值计算关键点经纬度数值
export function calculateKey(num: number, gridPrecision: number) {
    // 1.让目标经纬度数字乘以精度（2、5或10），2.四舍五入保留一位小数，3.除以精度
    return Number(
        (Math.round(num * gridPrecision * 10) / 10 / gridPrecision).toFixed(2)
    );
}