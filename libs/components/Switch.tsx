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
    border: 2px solid #596400;
    border-radius: 999px;
    background-color: #e5e2da;
    display: flex;
    transition: background-color ease 150ms;

    &[data-state='checked'] {
      background-color: #596400;
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
      background-color: #78786a;
      transform: scale(0.5);
      transition: transform ease 200ms;
    }

    &::after {
      content: '';
      position: absolute;
      display: block;
      width: 120%;
      aspect-ratio: 1;
      border-radius: 50%;
      background-color: #84848434;
      transform: scale(0);
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
        background-color: #ffffff;
        transform: scale(0.85);
      }

      &[data-active] {
      }
    }

    &[data-hover] {
      &::after {
        transform: scale(1.15);
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
