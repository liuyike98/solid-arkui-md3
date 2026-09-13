import { css } from 'solid-styled-components';
import { Checkbox as ArkCheckbox, type CheckboxRootProps } from '@ark-ui/solid';
import { createSignal, splitProps } from 'solid-js';
import { Ripple } from '@libs/components/Ripple';
import { classNames } from '@libs/utils/classNames';

export interface CheckBoxProps extends CheckboxRootProps {}

export function CheckBox(props: CheckBoxProps) {
  const [local, restProps] = splitProps(props, ['class', 'children']);
  const [root, setRoot] = createSignal<HTMLLabelElement>();

  return (
    <ArkCheckbox.Root class={classNames(rootClassName, local.class)} {...restProps} ref={setRoot}>
      <ArkCheckbox.Control>
        <Ripple class='ripple' parent={root()} />
        <ArkCheckbox.Indicator>
          <svg viewBox='0 0 18 18'>
            <polyline points='4 9 7.5 12.5 14 6' />
          </svg>
        </ArkCheckbox.Indicator>
      </ArkCheckbox.Control>
      {local.children && <ArkCheckbox.Label>{local.children}</ArkCheckbox.Label>}
      <ArkCheckbox.HiddenInput />
    </ArkCheckbox.Root>
  );
}

const rootClassName = css`
  display: flex;
  align-items: center;
  cursor: pointer;

  .ripple {
    /* background-color: red; */
    width: 250%;
    height: 250%;
    position: absolute;
    inset: 50% auto auto 50%;
    translate: -50% -50%;
    border-radius: 50%;
  }

  /* 容器: 18dp 大小 / 2dp 圆角 / 2dp 描边, 选中填充 primary */
  [data-part='control'] {
    margin-right: 10px;
    position: relative;
    box-sizing: border-box;
    width: 18px;
    height: 18px;
    border: 2px solid #78786a;
    border-radius: 2px;
    color: #78786a;
    transition:
      background-color ease 150ms,
      border-color ease 150ms;

    &[data-state='checked'],
    &[data-state='indeterminate'] {
      background-color: #596400;
      border-color: #596400;
      color: #596400;
    }
  }

  /* display: block 覆盖 [hidden], 让勾/横线保留过渡 */
  [data-part='indicator'] {
    display: block;
    position: absolute;
    inset: -2px;
    color: #ffffff;

    & svg {
      display: block;
      width: 100%;
      height: 100%;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      opacity: 0;
      transform: scale(0.7);
      transition:
        opacity ease 100ms,
        transform ease 200ms;
    }

    &[data-state='checked'] svg {
      opacity: 1;
      transform: none;
    }

    /* indeterminate 短横线: 常驻渲染, 与勾交叉淡入淡出 */
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      margin: auto;
      width: 10px;
      height: 2px;
      border-radius: 1px;
      background-color: currentColor;
      opacity: 0;
      transform: scaleX(0.4);
      transition:
        opacity ease 100ms,
        transform ease 200ms;
    }

    &[data-state='indeterminate']::before {
      opacity: 1;
      transform: none;
    }
  }

  [data-part='label'] {
    font-size: 16px;
    line-height: 2;
    user-select: none;
  }

  &[data-disabled] {
    cursor: default;
    opacity: 0.38;
  }
`;
