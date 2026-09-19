import { Popover as ArkPopover, type PopoverRootProps } from '@ark-ui/solid/popover';
import { splitProps, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import { css } from 'solid-styled-components';
import { classNames } from '@libs/utils/classNames';

export interface PopoverProps extends Omit<PopoverRootProps, 'children'> {
  /** 气泡内容 */
  content: JSX.Element;
  /** 标题 (可选) */
  title?: JSX.Element;
  /** 快捷气泡方位, 默认 bottom; 更细的配置直接用 positioning */
  placement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end';
  /** 触发元素 */
  children?: JSX.Element;
  /** 附加到气泡面板上的 class */
  class?: string;
}

export function Popover(props: PopoverProps) {
  const [local, restProps] = splitProps(props, ['class', 'content', 'title', 'placement', 'children']);

  return (
    <ArkPopover.Root
      {...restProps}
      positioning={{
        placement: 'bottom',
        ...props.positioning,
        ...(local.placement ? { placement: local.placement } : {}),
      }}
    >
      <ArkPopover.Trigger class={triggerClassName}>{local.children}</ArkPopover.Trigger>
      <Portal>
        <ArkPopover.Positioner>
          <ArkPopover.Content class={classNames(contentClassName, local.class)}>
            {local.title && <ArkPopover.Title class={titleClassName}>{local.title}</ArkPopover.Title>}
            {local.content}
          </ArkPopover.Content>
        </ArkPopover.Positioner>
      </Portal>
    </ArkPopover.Root>
  );
}

/* 默认触发器: 无边框 inline 容器, 事件与 aria 由 ark 注入 */
const triggerClassName = css`
  display: inline-flex;
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  cursor: default;
`;

/* MD3: surface 面板 + level3 阴影, 8dp 圆角 */
const contentClassName = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-sizing: border-box;
  position: relative;
  z-index: 1000;
  width: 320px;
  max-width: calc(100vw - 32px);
  padding: 16px;
  border-radius: 8px;
  background-color: var(--mdui-color-surface-container-high);
  color: var(--mdui-color-on-surface-variant);
  font-size: 14px;
  line-height: 20px;
  outline: none;
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 20%),
    0 4px 8px 3px rgb(0 0 0 / 10%);
  transform-origin: var(--transform-origin);

  /* display:flex 会盖掉 [hidden] 的 UA 规则, 关闭后必须显式隐藏 */
  &[hidden] {
    display: none;
  }

  &[data-state='open'] {
    animation: mdui-popover-in 150ms cubic-bezier(0.2, 0, 0, 1);
  }

  &[data-state='closed'] {
    animation: mdui-popover-out 100ms cubic-bezier(0.3, 0, 1, 1);
  }

  @keyframes mdui-popover-in {
    from {
      opacity: 0;
      transform: scale(0.96);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes mdui-popover-out {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.96);
    }
  }
`;

const titleClassName = css`
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: var(--mdui-color-on-surface);
`;
