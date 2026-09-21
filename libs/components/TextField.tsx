import { classNames } from '@libs/utils/classNames';
import { Show, createEffect, createSignal, onCleanup, onMount, splitProps } from 'solid-js';
import type { JSX } from 'solid-js/jsx-runtime';
import { css } from 'solid-styled-components';

interface TextFieldProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onInput'> {
  label?: string;
  disabled?: boolean;
  type?: 'text' | 'password';
  iconStart?: JSX.Element;
  iconEnd?: JSX.Element;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onInput?: (event: InputEvent & { currentTarget: HTMLInputElement | HTMLTextAreaElement }) => void;
}

export function TextField(props: TextFieldProps) {
  const [local, rest] = splitProps(props, ['class', 'label', 'disabled', 'type', 'iconStart', 'iconEnd', 'value', 'defaultValue', 'placeholder', 'onInput']);
  /* 初始态同步取自 value/defaultValue, 有默认值时首帧即浮起, 避免入场播放标签动画 */
  const [hasText, setHasText] = createSignal((local.value ?? local.defaultValue ?? '') !== '');
  const [focused, setFocused] = createSignal(false);
  const floated = () => focused() || hasText();
  /* 受控模式: 外部 signal 改 value 不触发 onInput, 需响应式同步标签浮起态 */
  createEffect(() => {
    const value = local.value;
    if (value !== undefined) setHasText(value !== '');
  });

  let content: HTMLDivElement = undefined!;
  let label: HTMLDivElement = undefined!;
  /* 缺口几何: x 实测标签左缘 (含 iconStart 挤出的偏移), w = 浮起标签宽 + 左右 4px 余量 */
  const [notch, setNotch] = createSignal({ x: 8, w: 0 });
  /* 入场抑制: 首测落地前不启用 clip-path 过渡, 绘制两帧 (建立无动画基线) 后再开 */
  const [notchReady, setNotchReady] = createSignal(false);
  const measure = () => {
    if (!label?.isConnected) return;
    setNotch({ x: label.offsetLeft + content.offsetLeft - 4, w: label.offsetWidth * 0.75 + 8 });
  };
  onMount(() => {
    measure();
    document.fonts?.ready.then(measure);
    requestAnimationFrame(() => requestAnimationFrame(() => setNotchReady(true)));
    const ro = new ResizeObserver(measure);
    ro.observe(content);
    if (label) ro.observe(label);
    onCleanup(() => ro.disconnect());
  });
  /* 顶边裁出 [x, x+w] × [-2, 4] 的凹口 = 缺口; 顶点数固定, w 0↔自然宽度间可插值动画 */
  const clipPath = () => {
    const { x, w: gap } = notch();
    const w = floated() ? gap : 0;
    return `polygon(-2px -2px, ${x}px -2px, ${x}px 4px, ${x + w}px 4px, ${x + w}px -2px, calc(100% + 2px) -2px, calc(100% + 2px) calc(100% + 2px), -2px calc(100% + 2px))`;
  };

  return (
    <div
      {...rest}
      class={classNames(local.class, defaultStyle, textFieldStyle)}
      data-float={floated() ? '' : undefined}
      data-focused={focused() ? '' : undefined}
      data-disabled={local.disabled ? '' : undefined}
      data-icon-start={local.iconStart ? '' : undefined}
      data-icon-end={local.iconEnd ? '' : undefined}
    >
      <div class='field-border' data-notch-pending={!notchReady() ? '' : undefined} style={{ 'clip-path': clipPath() }} />
      <Show when={local.iconStart}>
        <span class='field-icon'>{local.iconStart}</span>
      </Show>
      <div class='field-content' ref={content!}>
        <Show when={props.label}>
          <div class='text-field-label' ref={label!}>
            {props.label}
          </div>
        </Show>
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
      </div>
      <Show when={local.iconEnd}>
        <span class='field-icon'>{local.iconEnd}</span>
      </Show>
    </div>
  );
}

export function TextArea(props: TextFieldProps) {
  const [local, rest] = splitProps(props, ['class', 'label', 'disabled', 'value', 'defaultValue', 'placeholder', 'onInput']);
  const [hasText, setHasText] = createSignal((local.value ?? local.defaultValue ?? '') !== '');
  const [focused, setFocused] = createSignal(false);
  const floated = () => focused() || hasText();

  let ta: HTMLTextAreaElement = undefined!;
  const resize = () => {
    ta.style.height = 'auto';
    ta.style.height = `${ta.scrollHeight}px`;
  };
  createEffect(() => {
    const value = local.value;
    if (value !== undefined) setHasText(value !== '');
  });

  let label: HTMLDivElement = undefined!;
  const [notchW, setNotchW] = createSignal(0);
  const [notchReady, setNotchReady] = createSignal(false);
  const measure = () => setNotchW(label ? label.offsetWidth * 0.75 + 8 : 0);
  onMount(() => {
    measure();
    resize();
    document.fonts?.ready.then(measure);
    requestAnimationFrame(() => requestAnimationFrame(() => setNotchReady(true)));
    const ro = new ResizeObserver(measure);
    if (label) ro.observe(label);
    onCleanup(() => ro.disconnect());
  });
  const clipPath = () => {
    const x = 8;
    const w = floated() ? notchW() : 0;
    return `polygon(-2px -2px, ${x}px -2px, ${x}px 4px, ${x + w}px 4px, ${x + w}px -2px, calc(100% + 2px) -2px, calc(100% + 2px) calc(100% + 2px), -2px calc(100% + 2px))`;
  };

  return (
    <div
      {...rest}
      class={classNames(local.class, defaultStyle, textFieldStyle, textAreaStyle)}
      data-float={floated() ? '' : undefined}
      data-focused={focused() ? '' : undefined}
      data-disabled={local.disabled ? '' : undefined}
    >
      <div class='field-border' data-notch-pending={!notchReady() ? '' : undefined} style={{ 'clip-path': clipPath() }} />
      <Show when={props.label}>
        <div class='text-field-label' ref={label!}>
          {props.label}
        </div>
      </Show>
      <textarea
        rows={1}
        disabled={local.disabled}
        value={local.value ?? local.defaultValue ?? ''}
        placeholder={local.placeholder}
        ref={ta!}
        onInput={(event) => {
          setHasText(event.currentTarget.value !== '');
          resize();
          local.onInput?.(event);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}

const defaultStyle = css`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;

  input,
  textarea {
    outline: none;
    border: none;
    background-color: transparent;
    resize: none;
    margin: 0;
    width: 100%;
  }
`;

const PADDING_LEFT: string = '12px';
const textFieldStyle = css`
  height: 40px;
  font-size: 15px;

  /* 单 div 真边框 overlay; 缺口由内联 clip-path 在顶边裁出 */
  .field-border {
    position: absolute;
    inset: 0;
    box-sizing: border-box;
    border: 1px solid var(--mdui-color-outline);
    border-radius: 4px;
    outline: 2px solid transparent; /* 点亮后与 1px 边框拼成 2px 粗线 */
    outline-offset: -2px;
    pointer-events: none;
    transition:
      clip-path ease 240ms,
      border-color ease 240ms,
      outline-color ease 240ms;
  }

  /* 入场首测期间: clip-path 不参与过渡, 避免缺口在页面加载时播放展开动画 */
  .field-border[data-notch-pending] {
    transition:
      border-color ease 240ms,
      outline-color ease 240ms;
  }

  /* hover: 灰色 2px (点亮 outline 内圈, 边框色不变); 禁用态不响应 */
  &:not([data-disabled]):hover .field-border {
    outline-color: var(--mdui-color-outline);
  }

  /* 聚焦 (仅 input/textarea 本体, data-focused 由信号驱动): 主色 2px; 写在 hover 之后靠后覆盖。
     不用 :has(:focus) — 它会把 iconEnd 按钮获焦也算进来 */
  &[data-focused] .field-border {
    border-color: var(--mdui-color-primary);
    outline-color: var(--mdui-color-primary);
  }

  /* 标签/输入的统一内容区: iconStart 存在时整体右移, 标签与文字自动对齐 */
  .field-content {
    position: relative;
    display: flex;
    align-items: center;
    align-self: stretch;
    flex: 1;
    min-width: 0;
  }

  .field-icon {
    flex: none;
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 4px;
    color: var(--mdui-color-on-surface-variant);
    transition: color ease 200ms;
  }

  input {
    height: 100%;
    line-height: 2;
    font-size: inherit;
    padding: 0 ${PADDING_LEFT};
    color: var(--mdui-color-on-surface);
    caret-color: var(--mdui-color-primary);
  }

  /* 隐藏 Edge/IE 原生密码显隐小眼睛, 用 iconEnd 的 IconButton 替代 */
  input::-ms-reveal {
    display: none;
  }

  /* 有图标时图标侧收窄到 8px (图标自带 4px padding), 标签同步跟随保持与文字对齐 */
  &[data-icon-start] {
    padding-left: 6px;

    input {
      padding-left: 4px;
    }

    .text-field-label {
      left: 4px;
    }
  }

  &[data-icon-end] input {
    padding-right: 8px;
  }

  .text-field-label {
    position: absolute;
    left: ${PADDING_LEFT};
    top: 50%; /* 静止态: 盒内垂直居中 */
    transform: translateY(-50%);
    transform-origin: left center;
    pointer-events: none;
    /* 静止态兼作 placeholder: MD3 用 60% on-surface-variant */
    color: color-mix(in srgb, var(--mdui-color-on-surface-variant) 60%, transparent);
    transition:
      top ease 200ms,
      transform ease 200ms,
      color ease 200ms;
  }

  /* 浮起态: 聚焦或已有输入内容时 (data-float = focused || hasText), 标签移到顶线并缩小 */
  &[data-float] {
    .text-field-label {
      top: 0;
      transform: translateY(-50%) scale(0.75);
    }
  }

  /* 有值浮起 (未聚焦): 恢复完整 on-surface-variant */
  &[data-float] .text-field-label {
    color: var(--mdui-color-on-surface-variant);
  }

  &[data-focused] .text-field-label {
    color: var(--mdui-color-primary);
  }

  &[data-focused] .field-icon {
    color: var(--mdui-color-primary);
  }

  /* 禁用态 (MD3): 边框 12% / 文字与标签 38% on-surface; 置于最后覆盖浮起/聚焦色 */
  &[data-disabled] {
    .field-border {
      border-color: color-mix(in srgb, var(--mdui-color-on-surface) 12%, transparent);
    }

    input,
    textarea {
      color: color-mix(in srgb, var(--mdui-color-on-surface) 38%, transparent);
      caret-color: transparent;
    }

    .text-field-label {
      color: color-mix(in srgb, var(--mdui-color-on-surface) 38%, transparent);
    }

    .field-icon {
      color: color-mix(in srgb, var(--mdui-color-on-surface) 38%, transparent);
    }
  }
`;

/* 多行差异: 高度随内容自适应 (JS 测 scrollHeight), 空态与单行等高; padding 5px 使首行 = 5+30+5 = 40px */
const textAreaStyle = css`
  height: auto;
  align-items: flex-start;

  textarea {
    line-height: 24px;
    min-height: 40px;
    font-size: inherit;
    padding: 8px ${PADDING_LEFT};
    color: var(--mdui-color-on-surface);
    caret-color: var(--mdui-color-primary);
    box-sizing: border-box;
  }

  .text-field-label {
    top: 20px; /* 首行中心 = 上 padding 5 + 行高 30 / 2 */
  }
`;
