import { Show, splitProps, type JSX } from 'solid-js';
import { css } from 'solid-styled-components';
import { Ripple } from '@libs/components/Ripple';
import { classNames } from '@libs/utils/classNames';

export type ButtonVariant = 'filled' | 'elevated' | 'tonal' | 'outlined' | 'text';
/** 不传 = small (40dp 基准), 其余档位见下方尺寸样式 */
export type ButtonSize = 'extra-small' | 'medium' | 'large';

export type ButtonProps = JSX.IntrinsicElements['button'] & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** 前置图标, 传 JSX (如 <Icon name='star' />) */
  iconStart?: JSX.Element;
  /** 后置图标 */
  iconEnd?: JSX.Element;
};

export function Button(props: ButtonProps) {
  const [local, restProps] = splitProps(props, [
    'class',
    'variant',
    'size',
    'type',
    'iconStart',
    'iconEnd',
    'children',
    'disabled',
  ]);

  return (
    <button
      class={classNames(rootClassName, local.class)}
      data-variant={local.variant}
      data-size={local.size}
      type={local.type ?? 'button'}
      {...restProps}
    >
      <Show when={local.iconStart}>
        <span class='button-icon'>{local.iconStart}</span>
      </Show>
      {local.children}
      <Show when={local.iconEnd}>
        <span class='button-icon'>{local.iconEnd}</span>
      </Show>
      <Show when={!local.disabled}>
        <Ripple />
      </Show>
    </button>
  );
}

const rootClassName = css`
  position: relative;
  display: inline-flex;
  /* 作为 flex 子项时不被压缩, 宽度由内容决定 */
  flex: none;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  box-sizing: border-box;
  gap: 8px;
  min-width: 56px;
  height: 40px;
  padding: 0 16px;
  border: none;
  border-radius: 20px;
  background-color: var(--mdui-color-primary);
  color: var(--mdui-color-on-primary);
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition:
    background-color 200ms cubic-bezier(0.2, 0, 0, 1),
    box-shadow 200ms cubic-bezier(0.2, 0, 0, 1),
    color 200ms cubic-bezier(0.2, 0, 0, 1);

  .button-icon {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    font-size: 20px;

    /* 字体图标自带 font-size: 24px, 需继承按钮档位尺寸 */
    & .material-icons {
      font-size: inherit;
    }

    & svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
    }
  }

  &[data-variant='elevated'] {
    background-color: var(--mdui-color-surface-container-low);
    color: var(--mdui-color-primary);
    box-shadow:
      0 1px 2px 0 rgb(0 0 0 / 20%),
      0 1px 3px 1px rgb(0 0 0 / 10%);
  }

  &[data-variant='tonal'] {
    background-color: var(--mdui-color-secondary-container);
    color: var(--mdui-color-on-secondary-container);
  }

  &[data-variant='tonal']:hover:not(:active) {
    box-shadow:
      0 1px 2px 0 rgb(0 0 0 / 20%),
      0 1px 3px 1px rgb(0 0 0 / 10%);
  }

  &[data-variant='outlined'] {
    background-color: transparent;
    color: var(--mdui-color-on-surface-variant);
  }

  /* 描边用伪元素, 避免 border 挤压内容宽度 */
  &[data-variant='outlined']::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    border: 1px solid var(--mdui-color-outline);
    border-radius: inherit;
  }

  &[data-variant='text'] {
    background-color: transparent;
    color: var(--mdui-color-primary);
  }

  &[data-size='extra-small'] {
    gap: 4px;
    height: 32px;
    padding: 0 12px;
    border-radius: 16px;
    font-size: 12px;

    .button-icon {
      width: 16px;
      height: 16px;
      font-size: 16px;
    }
  }

  &[data-size='medium'] {
    height: 56px;
    padding: 0 24px;
    border-radius: 28px;
    font-size: 16px;

    .button-icon {
      width: 24px;
      height: 24px;
      font-size: 24px;
    }
  }

  &[data-size='large'] {
    gap: 12px;
    height: 96px;
    padding: 0 48px;
    border-radius: 48px;
    font-size: 24px;

    .button-icon {
      width: 32px;
      height: 32px;
      font-size: 32px;
    }
  }

  &:disabled {
    pointer-events: none;
    box-shadow: none;
    background-color: color-mix(in srgb, var(--mdui-color-on-surface) 12%, transparent);
    color: color-mix(in srgb, var(--mdui-color-on-surface) 38%, transparent);
  }

  &[data-variant='outlined']:disabled::before {
    content: none;
  }
`;
