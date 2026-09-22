import { classNames } from '@libs/utils/classNames';
import { Show, createEffect, createSignal, onMount, splitProps } from 'solid-js';
import type { JSX } from 'solid-js/jsx-runtime';
import { css } from 'solid-styled-components';
import { FieldSet } from '@libs/components/FieldSet';

interface TextFieldProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onInput'> {
  label?: string;
  disabled?: boolean;
  type?: 'text' | 'password';
  iconStart?: JSX.Element;
  iconEnd?: JSX.Element;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  /** 必填: 标签后追加红色星号 */
  required?: boolean;
  /** 底部辅助文案 */
  helper?: JSX.Element;
  /** 错误文案: 存在即进入错误态 */
  error?: JSX.Element;
  /** 强制错误态 (无文案也可标红) */
  invalid?: boolean;
  onInput?: (event: InputEvent & { currentTarget: HTMLInputElement | HTMLTextAreaElement }) => void;
}

/* 初始浮起态同步取自 value/defaultValue, 避免入场播放标签动画 */
const useFieldState = (local: { value?: string; defaultValue?: string }) => {
  const [hasText, setHasText] = createSignal((local.value ?? local.defaultValue ?? '') !== '');
  const [focused, setFocused] = createSignal(false);
  const floated = () => focused() || hasText();
  /* 受控模式: 外部 signal 改 value 不触发 onInput, 需响应式同步标签浮起态 */
  createEffect(() => {
    const value = local.value;
    if (value !== undefined) setHasText(value !== '');
  });
  return { hasText, setHasText, focused, setFocused, floated };
};

export function TextField(props: TextFieldProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'label',
    'disabled',
    'type',
    'iconStart',
    'iconEnd',
    'value',
    'defaultValue',
    'placeholder',
    'required',
    'helper',
    'error',
    'invalid',
    'onInput',
  ]);
  const { setHasText, focused, setFocused, floated } = useFieldState(local);
  const invalid = () => !!local.error || !!local.invalid;
  const support = () => (invalid() ? local.error : local.helper);

  return (
    <div {...rest} class={classNames(local.class, textFieldStyle)} data-icon-start={local.iconStart ? '' : undefined} data-icon-end={local.iconEnd ? '' : undefined}>
      <FieldSet
        class='field-set'
        legend={
          local.label ? (
            <>
              {local.label}
              <Show when={local.required}>
                <span class='field-required'> *</span>
              </Show>
            </>
          ) : undefined
        }
        focused={focused()}
        floating={!floated()}
        disabled={local.disabled}
        invalid={invalid()}
        start={local.iconStart}
        end={local.iconEnd}
        body={
          <input
            type={local.type ?? 'text'}
            disabled={local.disabled}
            /* 不单独传 defaultValue: el.value='' 会先置 dirty 使其失效, 直接并入初值链 */
            value={local.value ?? local.defaultValue ?? ''}
            placeholder={local.placeholder}
            onInput={(event) => {
              setHasText(event.currentTarget.value !== '');
              local.onInput?.(event);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        }
      />
      <Show when={support() !== undefined}>
        <div class='field-support'>
          <span class={invalid() ? 'field-error' : 'field-helper'}>{support()}</span>
        </div>
      </Show>
    </div>
  );
}

export function TextArea(props: TextFieldProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'label',
    'disabled',
    'iconStart',
    'iconEnd',
    'value',
    'defaultValue',
    'placeholder',
    'required',
    'helper',
    'error',
    'invalid',
    'onInput',
  ]);
  const { setHasText, focused, setFocused, floated } = useFieldState(local);
  const invalid = () => !!local.error || !!local.invalid;
  const support = () => (invalid() ? local.error : local.helper);

  /* 高度随内容自适应 */
  let ta!: HTMLTextAreaElement;
  const resize = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };
  /* ref 回调时元素尚未插入文档 (scrollHeight=0), 必须等 onMount */
  onMount(() => resize(ta));

  return (
    <div {...rest} class={classNames(local.class, textFieldStyle, textAreaStyle)} data-icon-start={local.iconStart ? '' : undefined} data-icon-end={local.iconEnd ? '' : undefined}>
      <FieldSet
        class='field-set'
        legend={
          local.label ? (
            <>
              {local.label}
              <Show when={local.required}>
                <span class='field-required'> *</span>
              </Show>
            </>
          ) : undefined
        }
        focused={focused()}
        floating={!floated()}
        disabled={local.disabled}
        invalid={invalid()}
        start={local.iconStart}
        end={local.iconEnd}
        body={
          <textarea
            rows={1}
            disabled={local.disabled}
            value={local.value ?? local.defaultValue ?? ''}
            placeholder={local.placeholder}
            ref={ta!}
            onInput={(event) => {
              setHasText(event.currentTarget.value !== '');
              resize(event.currentTarget);
              local.onInput?.(event);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        }
      />
      <Show when={support() !== undefined}>
        <div class='field-support'>
          <span class={invalid() ? 'field-error' : 'field-helper'}>{support()}</span>
        </div>
      </Show>
    </div>
  );
}

const PADDING_LEFT: string = '12px';
/* 借 FieldSet 画框, 这里只定制几何与输入控件样式; 类名是 FieldSet 的全局内部约定 */
const textFieldStyle = css`
  display: block;
  width: 100%;
  font-size: 15px;

  & .field-set {
    --fs-pad-t: 0px;
    --fs-pad-b: 0px;
    --fs-pad-l: ${PADDING_LEFT};
    --fs-pad-r: ${PADDING_LEFT};
    --fs-min-h: 40px;
    --fs-gap: 0px;
    --fs-legend-sunk-top: 20px; /* 沉入态垂直居中 (40/2) */
  }

  /* 有图标时内容侧 padding 收窄到 8px (图标自带 4px, 文字距边框仍为 12px);
     图例 left = pad-l + start 宽, 走同一变量自动对齐 */
  &[data-icon-start] .field-set {
    --fs-pad-l: 8px;
  }

  /* 有前导图标时正文再让出 4px; 图例同步 +4 保持与文字对齐 (缺口 x 读自图例解析值, 自动跟随) */
  &[data-icon-start] .field-set .fieldset-body {
    padding-left: 4px;
  }

  &[data-icon-start] .field-set .fieldset-legend {
    left: calc(var(--fs-pad-l) + var(--fs-start-w, 0px) + 4px);
  }

  &[data-icon-end] .field-set {
    --fs-pad-r: 0px;
  }

  & .field-set .fieldset-content {
    align-items: stretch;
  }

  & .field-set .fieldset-icon {
    /* 不写 height: 100% —— 父级高度来自 min-height (非 definite), 百分比失效还会抑制 stretch */
    padding: 0 4px;
  }

  & .field-set .fieldset-body {
    display: flex;
    align-items: center;
  }

  & input {
    flex: 1;
    min-width: 0;
    width: 100%;
    height: 100%;
    outline: none;
    border: none;
    background-color: transparent;
    margin: 0;
    padding: 0;
    font-family: inherit;
    line-height: 2;
    font-size: inherit;
    color: var(--mdui-color-on-surface);
    caret-color: var(--mdui-color-primary);
  }

  /* 隐藏 Edge/IE 原生密码显隐小眼睛, 用 iconEnd 的 IconButton 替代 */
  & input::-ms-reveal {
    display: none;
  }

  /* 禁用态输入文字 (边框/图例由 FieldSet 处理) */
  & .field-set[data-disabled] input {
    color: color-mix(in srgb, var(--mdui-color-on-surface) 38%, transparent);
    caret-color: transparent;
  }

  & .field-support {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    box-sizing: border-box;
    padding: 0 ${PADDING_LEFT};
    margin-top: 4px;
    font-size: 12px;
    line-height: 16px;
  }

  & .field-helper {
    color: var(--mdui-color-on-surface-variant);
  }

  & .field-error {
    color: var(--mdui-color-error);
  }

  & .field-required {
    color: var(--mdui-color-error);
  }
`;

/* 多行差异: 顶对齐, 首行中心 = textarea padding-top 8 + 行高 24/2 = 20 */
const textAreaStyle = css`
  & .field-set .fieldset-content {
    align-items: flex-start;
  }

  & .field-set .fieldset-body {
    display: block;
  }

  & textarea {
    /* block: 消除 inline 基线对齐撑出的额外行盒高度 (~6px) */
    display: block;
    width: 100%;
    outline: none;
    border: none;
    background-color: transparent;
    margin: 0;
    resize: none;
    font-family: inherit;
    line-height: 24px;
    min-height: 40px;
    font-size: inherit;
    padding: 8px 0;
    color: var(--mdui-color-on-surface);
    caret-color: var(--mdui-color-primary);
    box-sizing: border-box;
  }

  & .field-set[data-disabled] textarea {
    color: color-mix(in srgb, var(--mdui-color-on-surface) 38%, transparent);
    caret-color: transparent;
  }
`;
