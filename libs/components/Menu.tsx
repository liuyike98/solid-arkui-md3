import { Menu as ArkMenu, type MenuItemProps as ArkMenuItemProps, type MenuRootProps } from '@ark-ui/solid/menu';
import { classNames } from '@libs/utils/classNames';
import { Portal } from 'solid-js/web';
import { css } from 'solid-styled-components';

export interface MenuProps extends MenuRootProps {}
export interface MenuItemProps extends ArkMenuItemProps {}

export function MenuItem(props: MenuItemProps) {
  return <ArkMenu.Item {...props}></ArkMenu.Item>;
}

export function MenuItemDivider() {
  return <ArkMenu.Separator></ArkMenu.Separator>;
}

export function MenuTirggerItem() {
  return (
    <ArkMenu.Root>
      <ArkMenu.Positioner>
        <ArkMenu.TriggerItem></ArkMenu.TriggerItem>
        <Portal>
          <ArkMenu.Positioner>
            <ArkMenu.Content></ArkMenu.Content>
          </ArkMenu.Positioner>
        </Portal>
      </ArkMenu.Positioner>
    </ArkMenu.Root>
  );
}

export function Menu(props: MenuProps) {
  return (
    <ArkMenu.Root open {...props}>
      <ArkMenu.Trigger>File</ArkMenu.Trigger>
      <Portal>
        <ArkMenu.Positioner class={classNames(styleSheet)}>
          <ArkMenu.Content></ArkMenu.Content>
        </ArkMenu.Positioner>
      </Portal>
    </ArkMenu.Root>
  );
}

const styleSheet = css`
  width: 120px;
  border: 1px solid gray;
  border-radius: 14px;
  padding: 4px;
  font-size: 14px;

  [data-part='content'] {
    outline: none;
  }

  [data-part='item'],
  [data-part='trigger-item'] {
    background-color: gray;
    border-radius: 10px;
    padding: 6px 8px;
    &:hover {
    }
  }
`;
