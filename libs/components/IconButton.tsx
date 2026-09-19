import type { MaterialIcon } from '@material-design-icons/font';
import { Show, splitProps, type JSX } from 'solid-js';
import { css } from 'solid-styled-components';
import { classNames } from '@libs/utils/classNames';
import { Icon } from './Icon';
import { Ripple } from './Ripple';

export type IconButtonVariant = 'standard' | 'filled' | 'tonal' | 'outlined';

export type IconButtonProps = JSX.IntrinsicElements['button'] & {
  name: MaterialIcon;
  /** standard (透明底) / filled / tonal / outlined, 默认 standard */
  variant?: IconButtonVariant;
  /** 直径 px, 默认 40 (M3 标准), 图标占 60% */
  size?: number;
};

export function IconButton(props: IconButtonProps) {
  const [local, restProps] = splitProps(props, ['class', 'name', 'variant', 'size', 'disabled']);

  const diameter = () => local.size ?? 40;

  return (
    <button
      {...restProps}
      type='button'
      class={classNames(rootClassName, local.class)}
      data-variant={local.variant}
      disabled={local.disabled}
      style={{
        width: `${diameter()}px`,
        height: `${diameter()}px`,
        'font-size': `${Math.round(diameter() * 0.58)}px`,
      }}
    >
      <Icon name={local.name} />
      <Show when={!local.disabled}>
        <Ripple />
      </Show>
    </button>
  );
}

/* M3 icon button: 圆形 / 40dp 默认 / hover 与按压由 Ripple 状态层提供 */
const rootClassName = css`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  box-sizing: border-box;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--mdui-color-on-surface-variant);
  font-family: inherit;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition:
    background-color 200ms cubic-bezier(0.2, 0, 0, 1),
    color 200ms cubic-bezier(0.2, 0, 0, 1);

  /* 字体图标固定 24px, 改为跟随按钮字号 (即直径的 60%) */
  & .material-icons {
    font-size: inherit;
  }

  &[data-variant='filled'] {
    background-color: var(--mdui-color-primary);
    color: var(--mdui-color-on-primary);
  }

  &[data-variant='tonal'] {
    background-color: var(--mdui-color-secondary-container);
    color: var(--mdui-color-on-secondary-container);
  }

  &[data-variant='outlined'] {
    color: var(--mdui-color-on-surface-variant);
  }

  /* 描边用伪元素, 避免 border 挤压圆形内容区 */
  &[data-variant='outlined']::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    border: 1px solid var(--mdui-color-outline-variant);
    border-radius: 50%;
  }

  &:disabled {
    pointer-events: none;
    color: color-mix(in srgb, var(--mdui-color-on-surface) 38%, transparent);
  }

  &[data-variant='filled']:disabled,
  &[data-variant='tonal']:disabled {
    background-color: color-mix(in srgb, var(--mdui-color-on-surface) 12%, transparent);
  }
`;
