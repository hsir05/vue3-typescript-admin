import { h, RendererElement } from 'vue';
import { NIcon, NTag } from 'naive-ui';

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