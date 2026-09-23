import { Select as ArkSelect, type SelectRootProps } from '@ark-ui/solid/select';
import { createListCollection } from '@ark-ui/solid/collection';
import { Icon } from '@libs/components/Icon';
import { FieldSet } from '@libs/components/FieldSet';
import { Ripple } from '@libs/components/Ripple';
import { For, Show, splitProps, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import { css } from 'solid-styled-components';
import { classNames } from '@libs/utils/classNames';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectRootProps<SelectOption>, 'children' | 'collection'> {
  class?: string;
  /** 浮动标签 */
  label?: JSX.Element;
  /** 占位文案 (标签停靠时不显示) */
  placeholder?: string;
  helper?: JSX.Element;
  error?: JSX.Element;
  options: SelectOption[];
}

export function Select(props: SelectProps) {
  const [local, restProps] = splitProps(props, ['class', 'label', 'placeholder', 'helper', 'error', 'options', 'disabled', 'invalid']);

  const invalid = () => !!local.error || !!local.invalid;

  return (
    <ArkSelect.Root
      {...restProps}
      collection={createListCollection<SelectOption>({ items: local.options })}
      disabled={local.disabled}
      invalid={invalid()}
      class={classNames(rootClassName, local.class)}
    >
      <ArkSelect.Context>
        {(api) => {
          const floated = () => api().hasSelectedItems || api().open;
          return (
            <>
              <FieldSet
                class='select-field'
                legend={<ArkSelect.Label>{local.label}</ArkSelect.Label>}
                focused={api().open}
                floating={!floated()}
                disabled={local.disabled}
                invalid={invalid()}
                body={
                  <ArkSelect.Trigger class='select-trigger'>
                    <ArkSelect.ValueText class='select-value' data-placeholder-shown={api().hasSelectedItems ? undefined : ''} placeholder={local.placeholder ?? ' '} />
                    <span class='select-arrow'>
                      <Icon name='expand_more' />
                    </span>
                  </ArkSelect.Trigger>
                }
              />
              <div class='select-support'>
                <Show when={invalid() ? local.error : local.helper} fallback={<span />}>
                  <div class={invalid() ? 'select-error' : 'select-helper'}>{invalid() ? local.error : local.helper}</div>
                </Show>
              </div>
            </>
          );
        }}
      </ArkSelect.Context>
      <ArkSelect.HiddenSelect />
      <Portal>
        <ArkSelect.Positioner>
          <ArkSelect.Content class={contentClassName}>
            <For each={local.options}>
              {(option) => (
                <ArkSelect.Item class={itemClassName} item={option}>
                  <ArkSelect.ItemIndicator class={checkClassName}>
                    <Icon name='check' size={20} />
                  </ArkSelect.ItemIndicator>
                  <ArkSelect.ItemText>{option.label}</ArkSelect.ItemText>
                  <Show when={!option.disabled}>
                    <Ripple disabledHover={true} />
                  </Show>
                </ArkSelect.Item>
              )}
            </For>
          </ArkSelect.Content>
        </ArkSelect.Positioner>
      </Portal>
    </ArkSelect.Root>
  );
}

/* MD3 outlined select: 边框/图例/缺口/四态配色全部复用 FieldSet (与 TextField 同源),
   这里只剩 trigger 内容与 support 文案 */
const rootClassName = css`
  display: block;
  width: 100%;
  font-family: inherit;
  color: var(--mdui-color-on-surface);

  & .select-field {
    --fs-pad-t: 0px;
    --fs-pad-b: 0px;
    --fs-pad-l: 12px;
    --fs-pad-r: 12px;
    --fs-min-h: 40px;
    --fs-gap: 0px;
    --fs-legend-sunk-top: 20px;
  }

  & .select-field .fieldset-content {
    align-items: stretch;
  }

  & .select-field .fieldset-body {
    display: flex;
    align-items: center;
  }

  & .select-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    flex: 1;
    min-width: 0;
    height: 100%;
    padding: 0;
    border: none;
    background: transparent;
    font: inherit;
    color: inherit;
    text-align: left;
    cursor: pointer;
    outline: none;
  }

  & .select-value {
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: inherit;
    line-height: 2;
    color: var(--mdui-color-on-surface);
  }

  /* 图例沉底 (空值未交互) 时隐藏占位符, 图例本身就是提示 */
  & .select-field[data-floating] .select-value[data-placeholder-shown] {
    visibility: hidden;
  }

  & .select-arrow {
    display: inline-flex;
    flex: none;
    align-items: center;
    color: var(--mdui-color-on-surface-variant);
    transition: transform var(--mdui-motion-duration-short4, 200ms) var(--mdui-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
  }

  & .select-trigger[data-state='open'] .select-arrow {
    transform: rotate(180deg);
  }

  & .select-support {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    box-sizing: border-box;
    padding: 0 12px;
    margin-top: 4px;
    font-size: 12px;
    line-height: 16px;
  }

  & .select-helper {
    color: var(--mdui-color-on-surface-variant);
  }

  & .select-error {
    color: var(--mdui-color-error);
  }
`;

/* ---- 下拉面板 (Portal 挂到 body 下, 不能依赖根类作用域; 与 Menu 同风格) ---- */

const contentClassName = css`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  z-index: 1000;
  /* --reference-width 是 trigger 宽, trigger 在 body 内缩了 12px x2;
     用 margin + calc 把参考框撑回 FieldSet 外沿, 面板与组件严格等宽 */
  min-width: calc(var(--reference-width, 160px) + 24px);
  margin-left: -12px;
  max-height: min(var(--available-height, 320px), 320px);
  overflow-y: auto;
  padding: 4px 0;
  /* Sober Picker 面板同款: 1px outline-variant 描边 (浅色背景下纯阴影不够立) */
  border: 1px solid var(--mdui-color-outline-variant);
  border-radius: 8px;
  background-color: var(--mdui-color-surface-container);
  color: var(--mdui-color-on-surface);
  font-family: inherit;
  font-size: 14px;
  outline: none;
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 20%),
    0 4px 8px 3px rgb(0 0 0 / 10%);
  transform-origin: var(--transform-origin);

  /* display:flex 会盖掉 [hidden] 的 UA 规则 */
  &[hidden] {
    display: none;
  }

  &[data-state='open'] {
    animation: mdui-select-open 180ms cubic-bezier(0.2, 0, 0, 1);
  }

  &[data-state='closed'] {
    animation: mdui-select-close 200ms cubic-bezier(0.3, 0, 1, 1);
  }

  @keyframes mdui-select-open {
    from {
      opacity: 0;
      transform: scale(.95) translateY(-12px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes mdui-select-close {
    from {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
    to {
      opacity: 0;
      transform: scale(.95) translateY(-12px);
    }
  }
`;

const itemClassName = css`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  box-sizing: border-box;
  min-height: 36px;
  padding: 0 12px;
  outline: none;
  overflow: hidden;
  color: var(--mdui-color-on-surface-variant);
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  user-select: none;
  cursor: pointer;

  & [data-part='item-text'] {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &[data-highlighted] {
    background-color: color-mix(in srgb, var(--mdui-color-on-surface) 8%, transparent);
  }

  &[data-disabled] {
    color: color-mix(in srgb, var(--mdui-color-on-surface) 38%, transparent);
    cursor: default;
    pointer-events: none;
  }
`;

const checkClassName = css`
  display: inline-flex;
  flex: none;
  width: 20px;
  color: var(--mdui-color-primary);

  &[hidden] {
    display: none;
  }
`;
