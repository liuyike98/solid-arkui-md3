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

/* 细滚动条: 平时隐藏, 悬停 / 滚动时淡入 (MD3 风格) */
const scrollbarClassName = css`
  position: absolute;
  margin: 4px;
  border-radius: 999px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 200ms cubic-bezier(0.2, 0, 0, 1);

  &[data-hover],
  &[data-scrolling] {
    opacity: 1;
    pointer-events: auto;
  }

  &[data-orientation='vertical'] {
    top: 0;
    right: 0;
    bottom: 0;
    width: 4px;

    &:not([data-overflow-y]) {
      display: none;
    }
  }

  &[data-orientation='horizontal'] {
    left: 0;
    right: 0;
    bottom: 0;
    height: 4px;

    &:not([data-overflow-x]) {
      display: none;
    }
  }
`;

const thumbClassName = css`
  border-radius: inherit;
  background-color: var(--mdui-color-outline);
`;
