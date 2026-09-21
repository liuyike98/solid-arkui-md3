import { Show, createEffect, createSignal, splitProps, type JSX } from 'solid-js';
import { css } from 'solid-styled-components';
import { classNames } from '@libs/utils/classNames';
import type { MaterialIcon } from '@material-design-icons/font';
import { IconButton } from '@libs/components/IconButton';

type AlertVariant = 'surface' | 'info' | 'success' | 'warning' | 'error';

interface AlertProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'title' | 'onToggle'> {
  variant?: AlertVariant;
  /** 前导图标 (24px) */
  start?: JSX.Element;
  /** 标题 (16px/500), 与 HTML title 属性无关 */
  title?: JSX.Element;
  /** 尾部操作区 */
  end?: JSX.Element;
  /** 折叠模式: 正文收进标题下方, 显示展开按钮 */
  collapsed?: boolean;
  /** 展开态 (受控/非受控皆可) */
  open?: boolean;
  closable?: boolean;
  closeIcon?: MaterialIcon;
  toggleIcon?: MaterialIcon;
  onToggle?: (open: boolean) => void;
  onClose?: () => void;
}

export function Alert(props: AlertProps) {
  const [local, restProps] = splitProps(props, ['class', 'variant', 'start', 'title', 'end', 'collapsed', 'open', 'closable', 'closeIcon', 'toggleIcon', 'onToggle', 'onClose', 'children']);

  const [internalOpen, setInternalOpen] = createSignal(local.open ?? false);
  const open = () => local.open ?? internalOpen();
  const setOpenState = (value: boolean) => {
    if (local.open === undefined) setInternalOpen(value);
    local.onToggle?.(value);
  };

  let el!: HTMLDivElement;
  let content!: HTMLDivElement;

  /* 折叠高度动画: 0 ↔ 自然高度; 中途再触发时直接 reverse 现有动画 (Sober 同款) */
  const animate = async (value: boolean) => {
    if (!el.isConnected || !content?.isConnected || !local.collapsed || local.title === undefined) return;
    const [old] = content.getAnimations();
    if (old) return old.reverse();
    content.style.display = 'block';
    const height = content.offsetHeight;
    const keyframe = { height: ['0px', `${height}px`] };
    if (!value) keyframe.height.reverse();
    const cs = getComputedStyle(el);
    const duration = Number.parseFloat(cs.transitionDuration) * 1000 || 200;
    await content.animate(keyframe, { easing: cs.transitionTimingFunction, duration }).finished;
    content.style.removeProperty('display');
  };
  let first = true;
  createEffect(() => {
    const value = open();
    /* 挂载时携带的初始状态不播放动画 */
    if (first) {
      first = false;
      return;
    }
    void animate(value);
  });

  return (
    <div
      {...restProps}
      ref={el!}
      class={classNames(rootClassName, local.class)}
      data-variant={local.variant}
      data-collapsed={local.collapsed ? '' : undefined}
      data-open={open() ? '' : undefined}
      data-closable={local.closable ? '' : undefined}
    >
      <div class={classNames('alert-layout', local.title !== undefined && 'has-title')}>
        <Show when={local.start}>
          <span class='alert-start'>{local.start}</span>
        </Show>
        <div class='alert-text'>
          <div class='alert-title'>{local.title}</div>
          <Show when={local.children}>
            <div class='alert-content' ref={content!}>
              <div class='alert-content-wrap'>{local.children}</div>
            </div>
          </Show>
        </div>
        <div class='alert-actions'>
          <IconButton class='alert-toggle' size={32} name={local.toggleIcon ?? 'expand_more'} aria-label='toggle' onClick={() => setOpenState(!open())} />
          <Show when={local.closable}>
            <IconButton class='alert-close' size={32} name={local.closeIcon ?? 'close'} aria-label='close' onClick={() => local.onClose?.()} />
          </Show>
        </div>
        <Show when={local.end}>
          <span class='alert-end'>{local.end}</span>
        </Show>
      </div>
    </div>
  );
}

const rootClassName = css`
  display: flex;
  flex-wrap: wrap;
  position: relative;
  box-sizing: border-box;
  min-height: 48px;
  padding: 12px 16px;
  line-height: calc(100% + 8px);
  font-size: 14px;
  font-family: inherit;
  color: var(--mdui-color-on-surface);
  border-radius: var(--mdui-shape-corner-small);
  background: var(--mdui-color-surface-container-high);
  transition-duration: var(--mdui-motion-duration-short4);
  transition-timing-function: var(--mdui-motion-easing-standard);
  width: 100%;

  /* surface (默认): 用 overlay 描边, 不吃布局 */
  &:not([data-variant]),
  &[data-variant='surface'] {
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      border-radius: inherit;
      border: 1px solid var(--mdui-color-surface-variant);
    }
  }

  &[data-variant='info'] {
    color: var(--mdui-color-on-secondary-container);
    background: var(--mdui-color-secondary-container);
  }

  &[data-variant='success'] {
    color: var(--mdui-color-on-success-container);
    background: var(--mdui-color-success-container);
  }

  &[data-variant='warning'] {
    color: var(--mdui-color-on-warning-container);
    background: var(--mdui-color-warning-container);
  }

  &[data-variant='error'] {
    color: var(--mdui-color-on-error-container);
    background: var(--mdui-color-error-container);
  }

  .alert-layout {
    display: contents;
  }

  .alert-start {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin-right: 8px;

    & > * {
      width: 24px;
      height: 24px;
      font-size: 24px;
    }
  }

  .alert-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
    user-select: text;
  }

  .alert-title {
    font-weight: 500;
    font-size: 16px;
  }

  .alert-content {
    overflow: hidden;
    contain: layout;
  }

  .alert-actions {
    display: flex;
    align-items: flex-start;
    height: fit-content;
    margin-top: -4px;
    margin-bottom: -4px;
    position: relative;
    right: -8px;
  }

  .alert-toggle,
  .alert-close {
    display: none;
    /* 跟随变体文字色 (IconButton 默认 on-surface-variant) */
    color: inherit;
  }

  .alert-toggle .material-icons {
    transition: transform var(--mdui-motion-duration-short4) var(--mdui-motion-easing-standard);
  }

  .alert-end {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin-left: 8px;
  }

  /* 折叠模式: 标题占满一行, 正文换行整宽, toggle 出现 */
  &[data-collapsed] .has-title {
    .alert-text {
      display: contents;
    }

    .alert-title {
      display: flex;
      flex-grow: 1;
      flex-basis: 0;
    }

    .alert-content {
      flex-basis: 100%;
      order: 1;
    }

    .alert-content-wrap {
      padding-top: 4px;
    }

    .alert-toggle {
      display: inline-flex;
    }
  }

  &[data-collapsed]:not([data-open]) .has-title .alert-content {
    display: none;
  }

  &[data-collapsed][data-open] .has-title .alert-toggle .material-icons {
    transform: rotate(-180deg);
  }

  &[data-closable] .alert-close {
    display: inline-flex;
  }
`;
