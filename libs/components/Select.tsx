import { Select as ArkSelect, type SelectRootProps } from '@ark-ui/solid/select';
import { createListCollection } from '@ark-ui/solid/collection';
import { Icon } from '@libs/components/Icon';
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
      data-invalid={invalid() ? '' : undefined}
      data-disabled={local.disabled ? '' : undefined}
    >
      <ArkSelect.Context>
        {(api) => (
          <>
            <div class='select-box' data-float={api().hasSelectedItems || api().open ? '' : undefined} data-open={api().open ? '' : undefined}>
              <ArkSelect.Label class='select-label'>{local.label}</ArkSelect.Label>
              <ArkSelect.Trigger class='select-trigger'>
                <ArkSelect.ValueText class='select-value' placeholder={local.placeholder ?? ' '} />
                <span class='select-arrow'>
                  <Icon name='expand_more' />
                </span>
              </ArkSelect.Trigger>
            </div>
            <div class='select-support'>
              <Show when={invalid() ? local.error : local.helper} fallback={<span />}>
                <div class={invalid() ? 'select-error' : 'select-helper'}>{invalid() ? local.error : local.helper}</div>
              </Show>
            </div>
          </>
        )}
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
                </ArkSelect.Item>
              )}
            </For>
          </ArkSelect.Content>
        </ArkSelect.Positioner>
      </Portal>
    </ArkSelect.Root>
  );
}

/* MD3 outlined select: 触发器与 TextField 同款 56dp 描边盒 + 尾部箭头,
   面板与 Menu 同款 surface-container; data-float 由 Context api 驱动 (stylis :has 缺陷规避) */
const rootClassName = css`
  display: block;
  width: 100%;
  font-family: inherit;
  color: var(--mdui-color-on-surface);

  & .select-box {
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 56px;
    padding: 0 12px 0 16px;
    border-radius: 4px;
    outline: 1px solid var(--mdui-color-outline);
    outline-offset: -1px;
    transition:
      outline-color var(--mdui-motion-duration-short4, 200ms) var(--mdui-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
  }

  &:not([data-disabled]):not([data-invalid]) .select-box:hover {
    outline-width: 2px;
  }

  & .select-box:focus-within {
    outline: 2px solid var(--mdui-color-primary);
  }

  &[data-invalid] .select-box {
    outline-color: var(--mdui-color-error);
  }

  &[data-invalid] .select-box:focus-within {
    outline: 2px solid var(--mdui-color-error);
  }

  &[data-disabled] {
    & .select-box {
      outline-color: color-mix(in srgb, var(--mdui-color-on-surface) 12%, transparent);
      background-color: color-mix(in srgb, var(--mdui-color-on-surface) 4%, transparent);
      pointer-events: none;
    }

    & .select-label,
    & .select-value,
    & .select-arrow {
      color: color-mix(in srgb, var(--mdui-color-on-surface) 38%, transparent);
    }
  }

  & .select-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
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
    display: flex;
    align-items: center;
    height: 100%;
    box-sizing: border-box;
    /* 与 TextField 一致: 文字带下移, 上方留给浮动标签 */
    padding: 22px 0 6px;
    font-size: 16px;
    line-height: 24px;
  }

  /* 空值且标签停靠时隐藏占位符 (标签就是提示) */
  & .select-box:not([data-float]) .select-value[data-placeholder-shown] {
    visibility: hidden;
  }

  & .select-arrow {
    display: inline-flex;
    flex: none;
    align-items: center;
    color: var(--mdui-color-on-surface-variant);
    transition: transform var(--mdui-motion-duration-short4, 200ms) var(--mdui-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
  }

  & .select-box[data-open] .select-arrow {
    transform: rotate(180deg);
  }

  & .select-label {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    transform-origin: left center;
    pointer-events: none;
    max-width: calc(100% - 48px);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 16px;
    line-height: 24px;
    color: var(--mdui-color-on-surface-variant);
    transition:
      top var(--mdui-motion-duration-short4, 200ms) var(--mdui-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
      transform var(--mdui-motion-duration-short4, 200ms) var(--mdui-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
      color var(--mdui-motion-duration-short4, 200ms) var(--mdui-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
  }

  & .select-box[data-float] .select-label {
    top: 0;
    transform: translateY(-50%) scale(0.75);
    padding: 0 4px;
    margin-left: -4px;
    background-color: var(--mdui-color-background);
  }

  & .select-box:focus-within .select-label {
    top: 0;
    transform: translateY(-50%) scale(0.75);
    padding: 0 4px;
    margin-left: -4px;
    background-color: var(--mdui-color-background);
    color: var(--mdui-color-primary);
  }

  &[data-invalid] .select-box:focus-within .select-label {
    color: var(--mdui-color-error);
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
  min-width: var(--reference-width, 160px);
  max-height: min(var(--available-height, 320px), 320px);
  overflow-y: auto;
  padding: 8px 0;
  border-radius: 12px;
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
    animation: mdui-select-in 150ms cubic-bezier(0.2, 0, 0, 1);
  }

  &[data-state='closed'] {
    animation: mdui-select-out 100ms cubic-bezier(0.3, 0, 1, 1);
  }

  @keyframes mdui-select-in {
    from {
      opacity: 0;
      transform: scale(0.94);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes mdui-select-out {
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
