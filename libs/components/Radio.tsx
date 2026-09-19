import { createSignal, onCleanup, onMount, splitProps, type JSX } from 'solid-js';
import { css } from 'solid-styled-components';
import { classNames } from '@libs/utils/classNames';
import { Ripple } from './Ripple';

export interface RadioProps extends Omit<JSX.IntrinsicElements['div'], 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  /** 单选组名, 同组内的 radio 选中互斥 */
  name?: string;
  onChange?: (checked: boolean) => void;
}

/** 同组互斥的内部协调事件 */
const UNCHECK_EVENT = 'mdui-radio-uncheck';

export function Radio(props: RadioProps) {
  const [local, restProps] = splitProps(props, [
    'class',
    'checked',
    'defaultChecked',
    'disabled',
    'readOnly',
    'name',
    'onChange',
    'children',
  ]);
  const [checked, setChecked] = createSignal(local.defaultChecked ?? local.checked ?? false);
  let dom!: HTMLDivElement;

  const handleClick = () => {
    if (local.disabled || local.readOnly || checked()) return;
    setChecked(true);
    local.onChange?.(true);
    dom
      .getRootNode()
      .dispatchEvent(new CustomEvent(UNCHECK_EVENT, { detail: { name: local.name, except: dom } }));
  };

  onMount(() => {
    const uncheck = (event: Event) => {
      const { name, except } = (event as CustomEvent).detail;
      if (name === local.name && except !== dom) setChecked(false);
    };
    const root = dom.getRootNode();
    root.addEventListener(UNCHECK_EVENT, uncheck);
    onCleanup(() => root.removeEventListener(UNCHECK_EVENT, uncheck));
  });

  return (
    <div
      {...restProps}
      ref={dom}
      class={classNames(radioClassName, local.class)}
      role='radio'
      aria-checked={checked()}
      aria-disabled={local.disabled || undefined}
      tabindex={local.disabled || local.readOnly ? undefined : 0}
      data-checked={checked() ? '' : undefined}
      data-disabled={local.disabled ? '' : undefined}
      data-readonly={local.readOnly ? '' : undefined}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault();
          handleClick();
        }
      }}
    >
      <div class='layout'>
        <div class='icon'>
          <svg viewBox='0 0 20 20' shape-rendering='geometricPrecision'>
            <circle class='outline' cx='10' cy='10' r='9' />
            <circle class='fill' cx='10' cy='10' r='5' />
          </svg>
        </div>
        <Ripple class={rippleClassName} disabled={local.disabled} parent={dom}/>
      </div>
      {local.children}
    </div>
  );
}

const radioClassName = css`
  display: inline-flex;
  gap: 8px;
  vertical-align: middle;
  align-items: center;
  position: relative;
  height: 24px;
  line-height: calc(100% + 4px);
  max-width: -moz-available;
  max-width: -webkit-fill-available;
  color: var(--mdui-color-on-surface-variant);
  cursor: pointer;
  user-select: none;
  transition:
    color var(--mdui-motion-duration-short4, 200ms) var(--mdui-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));

  /* 优先级需高于下方 .icon .fill 的基础规则, 否则选中态被覆盖 */
  &[data-checked] {
    color: var(--mdui-color-primary);

    & .icon .fill {
      transform: scale(1);
      opacity: 1;
    }
  }

  &[data-readonly] {
    pointer-events: none;
  }

  &[data-disabled] {
    pointer-events: none;
    cursor: default;

    & .layout {
      color: var(--mdui-color-on-surface);
      opacity: 0.38;
    }
  }

  &:focus-visible {
    outline: none;

    & .layout {
      outline: 2px solid currentColor;
      outline-offset: 0;
    }
  }

  & .layout {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    height: 100%;
    aspect-ratio: 1;
    flex-shrink: 0;
    border-radius: 50%;
  }

  & .icon {
    width: calc(100% - 4px);
    height: calc(100% - 4px);

    & svg {
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    & circle {
      stroke: currentcolor;
      transform-box: view-box;
      transform-origin: center;
      transition:
        transform var(--mdui-motion-duration-short4, 200ms) var(--mdui-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
        opacity var(--mdui-motion-duration-short4, 200ms) var(--mdui-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
    }

    & .outline {
      stroke-width: 2px;
      fill: transparent;
    }

    & .fill {
      fill: currentcolor;
      stroke: none;
      opacity: 0;
      transform: scale(2);
    }
  }
`;

/* 水波纹覆盖整个点击热区 (挂在 .layout 内, parent 默认取 .layout) */
const rippleClassName = css`
  aspect-ratio: 1;
  height: calc(100% + 16px);
  width: auto;
  inset: auto;
`;
