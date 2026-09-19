import {
  Toast as ArkToast,
  Toaster as ArkToaster,
  createToaster,
  type CreateToasterProps,
  type CreateToasterReturn,
  type ToastOptions,
  type ToasterProps as ArkToasterProps,
} from '@ark-ui/solid/toast';
import { Icon } from '@libs/components/Icon';
import { Show, splitProps } from 'solid-js';
import { css } from 'solid-styled-components';

export { createToaster };
export type { CreateToasterProps, CreateToasterReturn, ToastOptions };

export interface ToasterProps extends Omit<ArkToasterProps, 'children'> {
  /** 自定义 toast 模板, 不传则使用 MD3 snackbar 默认模板 */
  children?: ArkToasterProps['children'];
}

export function Toaster(props: ToasterProps) {
  const [local, restProps] = splitProps(props, ['children']);

  return (
    <ArkToaster {...restProps}>
      {local.children ??
        ((toast) => (
          <ArkToast.Root class={rootClassName}>
            <Show when={iconName(toast().type)}>
              <span class={iconClassName} data-type={toast().type}>
                <Icon name={iconName(toast().type)!} />
              </span>
            </Show>
            <div class={textClassName}>
              <Show when={toast().title}>
                <ArkToast.Title class={titleClassName}>{toast().title}</ArkToast.Title>
              </Show>
              <Show when={toast().description}>
                <ArkToast.Description class={descriptionClassName}>{toast().description}</ArkToast.Description>
              </Show>
            </div>
            <Show when={toast().action}>
              <ArkToast.ActionTrigger class={actionClassName}>{toast().action?.label}</ArkToast.ActionTrigger>
            </Show>
            <ArkToast.CloseTrigger class={closeClassName}>
              <Icon name='close' />
            </ArkToast.CloseTrigger>
          </ArkToast.Root>
        ))}
    </ArkToaster>
  );
}

const iconName = (type?: string) =>
  (({ success: 'check_circle', error: 'error', warning: 'warning', info: 'info' }) as Record<string, 'check_circle' | 'error' | 'warning' | 'info'>)[type ?? ''];

/* MD3 snackbar: inverseSurface 深灰底 / 圆角 / 白字, 进出场用 ark 的 --x/--y/--scale 变量 */
const rootClassName = css`
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  min-width: 320px;
  max-width: min(480px, calc(100vw - 32px));
  min-height: 48px;
  padding: 10px 12px;
  border-radius: 8px;
  background-color: var(--mdui-color-inverse-surface);
  color: var(--mdui-color-inverse-on-surface);
  font-size: 14px;
  line-height: 20px;

  translate: var(--x) var(--y);
  scale: var(--scale);
  z-index: var(--z-index);
  height: var(--height);
  opacity: var(--opacity);
  will-change: translate, opacity, scale;
  transition:
    translate 400ms cubic-bezier(0.21, 1.02, 0.73, 1),
    scale 400ms cubic-bezier(0.21, 1.02, 0.73, 1),
    opacity 400ms cubic-bezier(0.21, 1.02, 0.73, 1),
    height 400ms cubic-bezier(0.21, 1.02, 0.73, 1);

  &[data-state='closed'] {
    transition:
      translate 400ms cubic-bezier(0.06, 0.71, 0.55, 1),
      scale 400ms cubic-bezier(0.06, 0.71, 0.55, 1),
      opacity 200ms cubic-bezier(0.06, 0.71, 0.55, 1);
  }
`;

const iconClassName = css`
  display: inline-flex;
  flex: none;

  &[data-type='success'] {
    color: light-dark(#6fdb9a, #0f7a3d);
  }

  &[data-type='error'] {
    color: light-dark(#ffb4ab, #b3261e);
  }

  &[data-type='warning'] {
    color: light-dark(#e2c54b, #8a6d00);
  }

  &[data-type='info'] {
    color: light-dark(#84cfff, #00658e);
  }
`;

const textClassName = css`
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
`;

const titleClassName = css`
  margin: 0;
  font-size: 14px;
  font-weight: 500;
`;

const descriptionClassName = css`
  margin: 0;
  opacity: 0.85;
`;

const actionClassName = css`
  flex: none;
  padding: 4px 12px;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: var(--mdui-color-inverse-primary);
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: background-color 150ms cubic-bezier(0.2, 0, 0, 1);

  &:hover {
    background-color: #ffffff1f;
  }
`;

const closeClassName = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: inherit;
  opacity: 0.7;
  cursor: pointer;
  transition:
    background-color 150ms cubic-bezier(0.2, 0, 0, 1),
    opacity 150ms;

  &:hover {
    opacity: 1;
    background-color: #ffffff1f;
  }
`;
