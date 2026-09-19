import { Tooltip as ArkTooltip, type TooltipRootProps } from '@ark-ui/solid/tooltip';
import { classNames } from '@libs/utils/classNames';
import { splitProps, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import { css } from 'solid-styled-components';

export type TooltipPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

export interface TooltipProps extends Omit<TooltipRootProps, 'children'> {
  /** 附加到气泡内容上的 class */
  class?: string;
  /** 气泡内容 */
  content: JSX.Element;
  /** 快捷气泡方位, 默认 top; 更细的配置直接用 positioning */
  placement?: TooltipPlacement;
  /** 触发元素 */
  children?: JSX.Element;
}

export function Tooltip(props: TooltipProps) {
  const [local, restProps] = splitProps(props, ['class', 'content', 'placement', 'children']);

  return (
    <ArkTooltip.Root
      openDelay={0}
      closeDelay={0}
      {...restProps}
      positioning={{
        placement: 'top',
        ...props.positioning,
        ...(local.placement ? { placement: local.placement } : {}),
      }}
    >
      <ArkTooltip.Trigger class={triggerClassName}>{props.children}</ArkTooltip.Trigger>
      <Portal>
        <ArkTooltip.Positioner>
          <ArkTooltip.Content class={classNames(contentClassName, local.class)}>{local.content}</ArkTooltip.Content>
        </ArkTooltip.Positioner>
      </Portal>
    </ArkTooltip.Root>
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

/* M3 tooltip: inverseSurface 深灰底 / 4dp 圆角 / label-medium 12px 文字, 无箭头 */
const contentClassName = css`
  position: relative;
  box-sizing: border-box;
  z-index: 1000;
  max-width: 250px;
  padding: 6px 10px;
  border-radius: 6px;
  background-color: var(--mdui-color-inverse-surface);
  color: var(--mdui-color-inverse-on-surface);
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  pointer-events: none;
  transform-origin: var(--transform-origin);

  &[data-state='open'] {
    animation: mdui-tooltip-in 150ms cubic-bezier(0.2, 0, 0, 1);
  }

  &[data-state='closed'] {
    animation: mdui-tooltip-out 100ms cubic-bezier(0.3, 0, 1, 1);
  }

  @keyframes mdui-tooltip-in {
    from {
      opacity: 0;
      transform: scale(0.96);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes mdui-tooltip-out {
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
