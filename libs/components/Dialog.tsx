import { Dialog as ArkDialog, type DialogRootProps } from '@ark-ui/solid/dialog';
import type { MaterialIcon } from '@material-design-icons/font';
import { Icon } from '@libs/components/Icon';
import { Show, splitProps, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import { css } from 'solid-styled-components';
import { classNames } from '@libs/utils/classNames';

export interface DialogProps extends DialogRootProps {}

export interface DialogContentProps {
  class?: string;
  /** 右上角关闭按钮图标, 传 null 隐藏 */
  closeIcon?: MaterialIcon | null;
  children?: JSX.Element;
}

export function Dialog(props: DialogProps) {
  return <ArkDialog.Root {...props} />;
}

export function DialogTrigger(props: { class?: string; children?: JSX.Element }) {
  const [local, restProps] = splitProps(props, ['class', 'children']);
  return (
    <ArkDialog.Trigger {...restProps} class={classNames(triggerClassName, local.class)}>
      {local.children}
    </ArkDialog.Trigger>
  );
}

export function DialogContent(props: DialogContentProps) {
  const [local, restProps] = splitProps(props, ['class', 'closeIcon', 'children']);
  return (
    <Portal>
      <ArkDialog.Backdrop class={backdropClassName} />
      <ArkDialog.Positioner class={positionerClassName}>
        <ArkDialog.Content {...restProps} class={classNames(contentClassName, local.class)}>
          {local.children}
          <Show when={local.closeIcon !== null}>
            <ArkDialog.CloseTrigger class={closeTriggerClassName}>
              <Icon name={local.closeIcon ?? 'close'} />
            </ArkDialog.CloseTrigger>
          </Show>
        </ArkDialog.Content>
      </ArkDialog.Positioner>
    </Portal>
  );
}

export function DialogTitle(props: { class?: string; children?: JSX.Element }) {
  const [local, restProps] = splitProps(props, ['class', 'children']);
  return (
    <ArkDialog.Title {...restProps} class={classNames(titleClassName, local.class)}>
      {local.children}
    </ArkDialog.Title>
  );
}

export function DialogDescription(props: { class?: string; children?: JSX.Element }) {
  const [local, restProps] = splitProps(props, ['class', 'children']);
  return (
    <ArkDialog.Description {...restProps} class={classNames(descriptionClassName, local.class)}>
      {local.children}
    </ArkDialog.Description>
  );
}

/** 底部按钮区, 内容右对齐; 点击内部任意按钮自动关闭对话框 */
export function DialogActions(props: { class?: string; children?: JSX.Element }) {
  const [local, restProps] = splitProps(props, ['class', 'children']);
  return (
    <ArkDialog.Context>
      {(dialogApi) => (
        <div
          {...restProps}
          class={classNames(actionsClassName, local.class)}
          onClick={(event) => {
            if ((event.target as HTMLElement).closest('button')) dialogApi().setOpen(false);
          }}
        >
          {local.children}
        </div>
      )}
    </ArkDialog.Context>
  );
}

const triggerClassName = css`
  display: inline-flex;
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  cursor: default;
`;

/* Sober 同款遮罩: 纯黑 75% (sober dialog ::backdrop = scrim + opacity .75) */
const backdropClassName = css`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background-color: rgb(0 0 0 / 75%);

  &[data-state='open'] {
    animation: mdui-dialog-backdrop-in 200ms cubic-bezier(0.2, 0, 0, 1);
  }

  &[data-state='closed'] {
    animation: mdui-dialog-backdrop-out 150ms cubic-bezier(0.3, 0, 1, 1);
  }

  @keyframes mdui-dialog-backdrop-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes mdui-dialog-backdrop-out {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;

const positionerClassName = css`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  inset: 0;
  z-index: 1001;
  overscroll-behavior-y: none;
`;

/* MD3 dialog: 28dp 圆角 surface 面板 */
const contentClassName = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  box-sizing: border-box;
  width: 400px;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 32px);
  padding: 24px;
  border-radius: 28px;
  background-color: var(--mdui-color-surface-container-high);
  color: var(--mdui-color-on-surface-variant);
  font-size: 14px;
  line-height: 20px;
  outline: none;
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 20%),
    0 4px 8px 3px rgb(0 0 0 / 10%);

  /* display:flex 会盖掉 [hidden] 的 UA 规则, 关闭后必须显式隐藏 */
  &[hidden] {
    display: none;
  }

  &[data-state='open'] {
    animation: mdui-dialog-in 200ms cubic-bezier(0, 0, 0, 1);
  }

  &[data-state='closed'] {
    animation: mdui-dialog-out 150ms cubic-bezier(0.3, 0, 1, 1);
  }

  @keyframes mdui-dialog-in {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes mdui-dialog-out {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.9);
    }
  }
`;

const titleClassName = css`
  margin: 0;
  padding-right: 32px;
  font-size: 22px;
  font-weight: 500;
  line-height: 28px;
  color: var(--mdui-color-on-surface);
`;

const descriptionClassName = css`
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 20px;
`;

const actionsClassName = css`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  width: 100%;
  margin-top: 24px;
`;

const closeTriggerClassName = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--mdui-color-outline);
  cursor: pointer;
  transition: background-color 150ms cubic-bezier(0.2, 0, 0, 1);

  &:hover {
    background-color: color-mix(in srgb, var(--mdui-color-on-surface) 8%, transparent);
  }
`;
