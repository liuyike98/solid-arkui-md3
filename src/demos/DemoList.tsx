import type { JSX } from 'solid-js';
import { css } from 'solid-styled-components';

/** 演示区外框: 圆角描边卡片, 内部由若干 Row 组成 */
export function DemoList(props: { children: JSX.Element }) {
  return <div class={listClassName}>{props.children}</div>;
}

/** 一行形态: 左侧固定宽度 caption, 右侧放组件 */
export function Row(props: { caption: string; children: JSX.Element }) {
  return (
    <div class={rowClassName}>
      <div class={captionClassName}>{props.caption}</div>
      {props.children}
    </div>
  );
}

/** 行尾状态回显, 靠 margin-left: auto 顶到最右 */
export function StateText(props: { children: JSX.Element }) {
  return <div class={stateClassName}>{props.children}</div>;
}

const listClassName = css`
  max-width: 640px;
  margin-top: 24px;
  border: 1px solid #e5e2da;
  border-radius: 12px;
`;

const rowClassName = css`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;

  & + & {
    border-top: 1px solid #e5e2da;
  }
`;

const captionClassName = css`
  flex: none;
  width: 132px;
  font-size: 14px;
  color: #78786a;
`;

const stateClassName = css`
  margin-left: auto;
  font-size: 14px;
  color: #78786a;
  min-width: 100px;
`;
