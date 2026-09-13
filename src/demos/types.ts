import type { JSX } from 'solid-js';

/** 侧边栏里的一个组件演示单元 */
export interface Demo {
  /** 侧边栏与正文标题展示的名字 */
  name: string;
  /** 标题下的一句话说明 */
  desc: string;
  /** 正文渲染入口, 用箭头函数包一层以保留 Solid 的组件边界 */
  render: () => JSX.Element;
}
