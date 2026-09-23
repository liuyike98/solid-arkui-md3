import { ScrollArea as ArkScrollArea, type ScrollAreaRootProps } from '@ark-ui/solid/scroll-area';
import { mergeProps, splitProps } from 'solid-js';
import { css } from 'solid-styled-components';
import { classNames } from '@libs/utils/classNames';

export interface ScrollAreaProps extends ScrollAreaRootProps {}

export function ScrollArea(props: ScrollAreaProps) {
  const [local, restProps] = splitProps(props, ['class', 'children']);

  return (
    <ArkScrollArea.Root {...mergeProps({ class: classNames(rootClassName, local.class) }, restProps)}>
      <ArkScrollArea.Viewport class={viewportClassName}>
        <ArkScrollArea.Content>{local.children}</ArkScrollArea.Content>
      </ArkScrollArea.Viewport>
      <ArkScrollArea.Scrollbar orientation='vertical' class={scrollbarClassName}>
        <ArkScrollArea.Thumb class={thumbClassName} />
      </ArkScrollArea.Scrollbar>
      <ArkScrollArea.Scrollbar orientation='horizontal' class={scrollbarClassName}>
        <ArkScrollArea.Thumb class={thumbClassName} />
      </ArkScrollArea.Scrollbar>
      <ArkScrollArea.Corner />
    </ArkScrollArea.Root>
  );
}

/* 尺寸由使用者通过 class / style 指定, 组件本身撑满外层盒子 */
const rootClassName = css`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;

  /* 移入立即显示, 移出后停留 1s 再淡出 */
  &:hover [data-part='scrollbar'] {
    opacity: 1;
    pointer-events: auto;
    transition-delay: 0s;
  }
`;

const viewportClassName = css`
  width: 100%;
  height: 100%;
  overscroll-behavior: contain;
  outline: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

/* 纯 CSS 时序:
   - 基础态 transition-delay 1s -> 移开后 opacity 停留 1 秒再回落
   - 根悬停 / 滚动中 -> 立即淡入 */
const scrollbarClassName = css`
  position: absolute;
  margin: 4px;
  /* flex: 让 thumb 交叉轴撑满轨道 (block 布局下横向 thumb 高度会是 0), 主轴尺寸仍由 ark 内联 % 控制 */
  display: flex;
  border-radius: 999px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 200ms cubic-bezier(0.2, 0, 0, 1);
  transition-delay: 1s;

  /* 滚动中立即显示: 必须清掉基础的 1s 延迟, 否则淡入被推迟到松手 1s 后 */
  &[data-scrolling] {
    opacity: 1;
    pointer-events: auto;
    transition-delay: 0s;
  }

  &[data-orientation='vertical'] {
    top: 0;
    right: 0;
    bottom: 0;
    width: 8px;
    flex-direction: column;

    &:not([data-overflow-y]) {
      display: none;
    }
  }

  &[data-orientation='horizontal'] {
    left: 0;
    right: 0;
    bottom: 0;
    height: 8px;

    &:not([data-overflow-x]) {
      display: none;
    }
  }
`;

const thumbClassName = css`
  border-radius: inherit;
  background-color: color-mix(in srgb, var(--mdui-color-on-surface) 30%, transparent);
  transition: background-color 150ms cubic-bezier(0.2, 0, 0, 1);

  &:hover {
    background-color: color-mix(in srgb, var(--mdui-color-on-surface) 45%, transparent);
  }

  &:active {
    background-color: color-mix(in srgb, var(--mdui-color-on-surface) 60%, transparent);
  }
`;
