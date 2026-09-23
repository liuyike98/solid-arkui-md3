import {
  Menu as ArkMenu,
  type MenuItemGroupLabelProps,
  type MenuItemGroupProps,
  type MenuItemProps as ArkMenuItemProps,
  type MenuTriggerItemProps,
  type MenuRootProps,
} from '@ark-ui/solid/menu';
import type { MaterialIcon } from '@material-design-icons/font';
import { Icon } from '@libs/components/Icon';
import { Ripple } from '@libs/components/Ripple';
import { Show, splitProps, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import { css } from 'solid-styled-components';
import { classNames } from '@libs/utils/classNames';

export interface MenuProps extends MenuRootProps {}

export interface MenuItemProps extends ArkMenuItemProps {
  /** 前置图标 */
  icon?: MaterialIcon;
}

export function Menu(props: MenuProps) {
  return <ArkMenu.Root {...props} />;
}

export interface BindMenuProps {
  children?: JSX.Element;
  menuContent: JSX.Element | JSX.Element[]
}

export function BindMenu(props: BindMenuProps) {
  return (
    <Menu>
      <MenuTrigger>{props.children}</MenuTrigger>
      <MenuContent>
        {props.menuContent}
      </MenuContent>
    </Menu>
  );
}

/** 打开菜单的触发按钮 (无边框包裹, 内部放任意内容) */
export function MenuTrigger(props: { class?: string; children?: JSX.Element }) {
  const [local, restProps] = splitProps(props, ['class', 'children']);
  return (
    <ArkMenu.Trigger {...restProps} class={classNames(triggerClassName, local.class)}>
      {local.children}
    </ArkMenu.Trigger>
  );
}

/** 右键热区: 放在 Menu 内, 右键时弹出同菜单 */
export function MenuContextTrigger(props: { class?: string; children?: JSX.Element }) {
  const [local, restProps] = splitProps(props, ['class', 'children']);
  return (
    <ArkMenu.ContextTrigger {...restProps} class={classNames(contextTriggerClassName, local.class)}>
      {local.children}
    </ArkMenu.ContextTrigger>
  );
}

/** 菜单面板: Portal + 定位层 + 内容 */
export function MenuContent(props: { class?: string; children?: JSX.Element }) {
  const [local, restProps] = splitProps(props, ['class', 'children']);
  return (
    <Portal>
      <ArkMenu.Positioner>
        <ArkMenu.Content {...restProps} class={classNames(contentClassName, local.class)}>
          {local.children}
        </ArkMenu.Content>
      </ArkMenu.Positioner>
    </Portal>
  );
}

export function MenuItem(props: MenuItemProps) {
  const [local, restProps] = splitProps(props, ['class', 'icon', 'children', 'disabled']);
  return (
    <ArkMenu.Item {...restProps} disabled={local.disabled} class={classNames(itemClassName, local.class)}>
      <Show when={local.icon}>
        <span class='menu-item-icon'>
          <Icon name={local.icon!} size={16} />
        </span>
      </Show>
      <ArkMenu.ItemText>{local.children}</ArkMenu.ItemText>
      <Show when={!local.disabled}>
        <Ripple disabledHover={true} />
      </Show>
    </ArkMenu.Item>
  );
}

/** 菜单分组容器 */
export function MenuGroup(props: MenuItemGroupProps) {
  return <ArkMenu.ItemGroup {...props} class={classNames(groupClassName, props.class)} />;
}

/** 分组标题 */
export function MenuGroupLabel(props: MenuItemGroupLabelProps) {
  return <ArkMenu.ItemGroupLabel {...props} class={classNames(labelClassName, props.class)} />;
}

/** 二级菜单入口: 放在父 MenuContent 内, 悬停 / 回车展开嵌套的 Menu */
export function MenuItemTrigger(props: MenuTriggerItemProps) {
  const [local, restProps] = splitProps(props, ['class', 'children']);
  return (
    <ArkMenu.TriggerItem {...restProps} class={classNames(itemTriggerClassName, local.class)}>
      <ArkMenu.ItemText>{local.children}</ArkMenu.ItemText>
      <Ripple disabledHover={true} />
    </ArkMenu.TriggerItem>
  );
}

export function MenuSeparator() {
  return <ArkMenu.Separator class={separatorClassName} />;
}

const triggerClassName = css`
  display: inline-flex;
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  cursor: default;
`;

const contextTriggerClassName = css`
  display: block;
`;

/* MD3 menu: surface-container 容器 / 12dp 圆角 / level3 阴影, 上下 8dp 内边距 */
const contentClassName = css`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  z-index: 1000;
  min-width: 160px;
  max-height: min(var(--available-height, 320px), 320px);
  overflow-y: auto;
  padding: 6px 0;
  border: 1px solid var(--mdui-color-outline-variant);
  border-radius: 8px;
  background-color: var(--mdui-color-surface-container);
  color: var(--mdui-color-on-surface);
  font-size: 13px;
  outline: none;
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 20%),
    0 4px 8px 3px rgb(0 0 0 / 10%);
  transform-origin: var(--transform-origin);

  /* display:flex 会盖掉 [hidden] 的 UA 规则, 关闭后必须显式隐藏 */
  &[hidden] {
    display: none;
  }

  & [data-part='item-text'] {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &[data-state='open'] {
    animation: mdui-menu-in 150ms cubic-bezier(0.2, 0, 0, 1);
  }

  &[data-state='closed'] {
    animation: mdui-menu-out 100ms cubic-bezier(0.3, 0, 1, 1);
  }

  @keyframes mdui-menu-in {
    from {
      opacity: 0;
      transform: scale(0.94);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes mdui-menu-out {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.94);
    }
  }
`;

/* M3 菜单项: 36dp 高全宽热区, 键盘/悬停高亮为 8% 状态层 */
const itemClassName = css`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  min-height: 32px;
  padding: 0 10px;
  outline: none;
  overflow: hidden;
  color: var(--mdui-color-on-surface-variant);
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  user-select: none;
  cursor: pointer;

  & .menu-item-icon {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 24px;
    color: inherit; /* 跟随项色 (禁用态 38% 自动生效) */
  }

  &[data-highlighted]:not([data-disabled]) {
    background-color: color-mix(in srgb, var(--mdui-color-on-surface) 8%, transparent);
  }

  &[data-disabled] {
    color: color-mix(in srgb, var(--mdui-color-on-surface) 38%, transparent);
    cursor: default;
    pointer-events: none;
  }
`;

const groupClassName = css`
  display: flex;
  flex-direction: column;
`;

/* 二级菜单入口: 与菜单项同规格, 尾部箭头指示 */
const itemTriggerClassName = css`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  box-sizing: border-box;
  min-height: 32px;
  padding: 0 12px;
  outline: none;
  overflow: hidden;
  color: var(--mdui-color-on-surface-variant);
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  text-align: left;
  user-select: none;
  cursor: pointer;

  &::after {
    content: '›';
    flex: none;
    color: var(--mdui-color-on-surface-variant);
    font-size: 18px;
    line-height: 1;
  }

  &:hover,
  &[data-state='open'] {
    background-color: color-mix(in srgb, var(--mdui-color-on-surface) 8%, transparent);
  }
`;

const labelClassName = css`
  padding: 4px 14px;
  color: var(--mdui-color-on-surface-variant);
  font-size: 11px;
  font-weight: 400;
  line-height: 16px;
`;

const separatorClassName = css`
  height: 1px;
  margin: 2px 12px;
  border: none;
  opacity: 0.5;
  background-color: var(--mdui-color-outline-variant);
`;
