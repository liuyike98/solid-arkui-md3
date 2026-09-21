import { css } from 'solid-styled-components';
import { Switch as ArkSwitch, type SwitchRootProps } from '@ark-ui/solid';
import { splitProps } from 'solid-js';
import { classNames } from '@libs/utils/classNames';

export interface SwitchProps extends SwitchRootProps {}

export function Switch(props: SwitchProps) {
  const [local, restProps] = splitProps(props, ['class', 'children']);

  return (
    <ArkSwitch.Root class={classNames(rootClassName, local.class)} {...restProps}>
      <ArkSwitch.Control>
        <ArkSwitch.Thumb />
      </ArkSwitch.Control>
      <ArkSwitch.HiddenInput />
    </ArkSwitch.Root>
  );
}

const rootClassName = css`
  display: block;
  width: fit-content;
  box-sizing: border-box;

  [data-part='control'] {
    position: relative;
    width: 48px;
    height: 28px;
    /* M3: 未选中描边 outline, 选中变 primary */
    border: 2px solid var(--mdui-color-outline);
    border-radius: 999px;
    background-color: var(--mdui-color-surface-container-highest);
    display: flex;
    transition:
      background-color ease 150ms,
      border-color ease 150ms;

    &[data-state='checked'] {
      background-color: var(--mdui-color-primary);
      border-color: var(--mdui-color-primary);
    }
  }

  [data-part='thumb'] {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    /* background-color: #71787e; */
    border-radius: 50%;
    height: 100%;
    aspect-ratio: 1;
    transition: all ease 150ms;

    &::before {
      content: '';
      border-radius: 50%;
      margin: auto;
      display: block;
      width: 100%;
      aspect-ratio: 1;
      z-index: 1;
      background-color: var(--mdui-color-outline);
      transform: scale(0.55);
      transition: transform ease 200ms;
    }

    &::after {
      content: '';
      position: absolute;
      display: block;
      width: 100%;
      aspect-ratio: 1;
      border-radius: 50%;
      /* 未选中: 中性状态层 (MD3 规范 on-surface 10%) */
      background-color: color-mix(in srgb, var(--mdui-color-on-surface) 10%, transparent);
      transform: scale(0.5);
      transition: transform ease 200ms;
    }

    &[data-state='unchecked'] {
      left: 0;

      &[data-hover] {
      }
    }

    &[data-state='checked'] {
      left: 100%;
      translate: -100%;

      &::before {
        background-color: var(--mdui-color-on-primary);
        transform: scale(0.85);
      }

      /* 选中: 主题色状态层 */
      &::after {
        background-color: color-mix(in srgb, var(--mdui-color-primary) 15%, transparent);
      }

      &[data-active] {
      }
    }

    &[data-hover] {
      &::after {
        transform: scale(1.5);
      }
    }

    &[data-active] {
      &::before {
        transform: scale(0.9);
      }
    }
  }

  &[data-disabled] {
    opacity: 0.25;
  }
`;
