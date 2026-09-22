import { Show, createEffect, createSignal, onCleanup, onMount, splitProps, type JSX } from 'solid-js';
import { css } from 'solid-styled-components';
import { classNames } from '@libs/utils/classNames';

interface FieldSetProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** 图例文字, 默认浮在顶线上 (缺口由 clip-path 裁出) */
  legend?: JSX.Element;
  /** 主体内容 */
  body?: JSX.Element;
  /** 前导区 (如图标), 图例与缺口自动跟随其右缘 */
  start?: JSX.Element;
  /** 尾部区 */
  end?: JSX.Element;
  /** 聚焦态: 主色 2px */
  focused?: boolean;
  /** 图例沉入盒内 (缺口闭合) */
  floating?: boolean;
  disabled?: boolean;
  /** 错误态: 边框/图例标红 */
  invalid?: boolean;
}

/**
 * 带缺口图例的边框容器 (TextField 的边框层, 通用化):
 * 单 div 真边框 overlay + 内联 clip-path 顶边凹口; focused 用 outline 内圈拼 2px。
 * 几何可经 --mdui-field-set-* 变量定制 (padding / min-height / gap / 沉入位置)。
 */
export function FieldSet(props: FieldSetProps) {
  const [local, restProps] = splitProps(props, ['class', 'legend', 'body', 'start', 'end', 'focused', 'floating', 'disabled', 'invalid', 'children']);

  let root!: HTMLDivElement;
  let content!: HTMLDivElement;
  let legend!: HTMLSpanElement;
  let start!: HTMLSpanElement;
  const [sizes, setSizes] = createSignal({ sw: 0, lw: 0 });
  const [notch, setNotch] = createSignal({ x: 12, w: 0 });
  /* 入场抑制: 首测落地前不启用 clip-path 过渡, 绘制两帧建立基线后再开 */
  const [notchReady, setNotchReady] = createSignal(false);

  const measure = () => {
    if (!legend?.isConnected) return;
    const gap = start?.isConnected ? Number.parseFloat(getComputedStyle(content).columnGap) || 0 : 0;
    setSizes({ sw: start?.isConnected ? start.offsetWidth + gap : 0, lw: legend.offsetWidth });
  };
  /* sizes 变化 -> 图例 left (CSS 变量) 重排 -> 本 effect 在 DOM 更新后读取解析值 */
  createEffect(() => {
    const { sw, lw } = sizes();
    root.style.setProperty('--fs-start-w', `${sw}px`);
    if (!legend?.isConnected) return;
    setNotch({ x: Number.parseFloat(getComputedStyle(legend).left) - 4, w: lw * 0.75 + 8 });
  });

  onMount(() => {
    measure();
    document.fonts?.ready.then(measure);
    requestAnimationFrame(() => requestAnimationFrame(() => setNotchReady(true)));
    const ro = new ResizeObserver(measure);
    ro.observe(legend);
    if (start) ro.observe(start);
    onCleanup(() => ro.disconnect());
  });

  /* 顶边裁出 [x, x+w] × [-2, 4] 凹口; 图例沉入 (floating) 时闭合 */
  const clipPath = () => {
    const { x, w: gap } = notch();
    const w = local.floating ? 0 : gap;
    return `polygon(-2px -2px, ${x}px -2px, ${x}px 4px, ${x + w}px 4px, ${x + w}px -2px, calc(100% + 2px) -2px, calc(100% + 2px) calc(100% + 2px), -2px calc(100% + 2px))`;
  };

  return (
    <div
      {...restProps}
      ref={root!}
      class={classNames(rootClassName, local.class)}
      data-focused={local.focused ? '' : undefined}
      data-floating={local.floating ? '' : undefined}
      data-disabled={local.disabled ? '' : undefined}
      data-invalid={local.invalid ? '' : undefined}
    >
      <div class='fieldset-border' data-notch-pending={!notchReady() ? '' : undefined} style={{ 'clip-path': clipPath() }} />
      <Show when={local.legend}>
        <span class='fieldset-legend' ref={legend!}>
          {local.legend}
        </span>
      </Show>
      <div class='fieldset-content' ref={content!}>
        <Show when={local.start}>
          <span class='fieldset-icon' ref={start!}>{local.start}</span>
        </Show>
        <div class='fieldset-body'>{local.body}</div>
        <Show when={local.end}>
          <span class='fieldset-icon'>{local.end}</span>
        </Show>
        {local.children}
      </div>
    </div>
  );
}

const rootClassName = css`
  position: relative;
  box-sizing: border-box;
  display: block;
  font-size: 15px;
  line-height: calc(100% + 8px);
  color: var(--mdui-color-on-surface);

  /* 对外定制点 */
  --fs-pad-t: var(--mdui-field-set-padding-top, var(--mdui-field-set-padding, 12px));
  --fs-pad-b: var(--mdui-field-set-padding-bottom, var(--mdui-field-set-padding, 12px));
  --fs-pad-l: var(--mdui-field-set-padding-left, var(--mdui-field-set-padding, 16px));
  --fs-pad-r: var(--mdui-field-set-padding-right, var(--mdui-field-set-padding, 16px));
  --fs-min-h: var(--mdui-field-set-min-height, 48px);
  --fs-gap: var(--mdui-field-set-gap, 8px);
  --fs-radius: var(--mdui-field-set-border-radius, var(--mdui-shape-corner-extra-small));
  --fs-legend-sunk-top: var(--mdui-field-set-legend-sunk-top, calc(var(--fs-pad-t) + 11px));

  & *,
  & *::before,
  & *::after {
    box-sizing: border-box;
  }

  /* 单 div 真边框 overlay; 缺口由内联 clip-path 在顶边裁出 */
  .fieldset-border {
    position: absolute;
    inset: 0;
    border: 1px solid var(--mdui-color-outline);
    border-radius: var(--fs-radius);
    outline: 2px solid transparent; /* 点亮后与边框拼成 2px */
    outline-offset: -2px;
    pointer-events: none;
    transition:
      clip-path ease 240ms,
      border-color ease 240ms,
      outline-color ease 240ms;
  }

  .fieldset-border[data-notch-pending] {
    transition:
      border-color ease 240ms,
      outline-color ease 240ms;
  }

  /* hover: 灰色 2px; 禁用/错误态不响应 */
  &:not([data-disabled]):not([data-invalid]):hover .fieldset-border {
    outline-color: var(--mdui-color-outline);
  }

  &[data-focused] .fieldset-border {
    border-color: var(--mdui-color-primary);
    outline-color: var(--mdui-color-primary);
  }

  &[data-invalid] .fieldset-border {
    border-color: var(--mdui-color-error);
  }

  &[data-invalid][data-focused] .fieldset-border {
    border-color: var(--mdui-color-error);
    outline-color: var(--mdui-color-error);
  }

  /* 图例: 浮在顶线 (默认) / 沉入盒内 (floating) */
  .fieldset-legend {
    position: absolute;
    left: calc(var(--fs-pad-l) + var(--fs-start-w, 0px));
    top: 0;
    transform: translateY(-50%) scale(0.75);
    transform-origin: left center;
    pointer-events: none;
    white-space: nowrap;
    max-width: calc(100% - (var(--fs-pad-l) + var(--fs-pad-r)));
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--mdui-color-on-surface-variant);
    transition:
      top ease 200ms,
      transform ease 200ms,
      color ease 200ms;
  }

  &[data-floating] .fieldset-legend {
    top: var(--fs-legend-sunk-top);
    transform: translateY(-50%) scale(1);
    /* 沉入态兼作 placeholder: MD3 用 60% on-surface-variant */
    color: color-mix(in srgb, var(--mdui-color-on-surface-variant) 60%, transparent);
  }

  &[data-focused] .fieldset-legend {
    color: var(--mdui-color-primary);
  }

  &[data-invalid]:not([data-floating]) .fieldset-legend {
    color: var(--mdui-color-error);
  }

  .fieldset-content {
    display: flex;
    align-items: center;
    gap: var(--fs-gap);
    padding: var(--fs-pad-t) var(--fs-pad-r) var(--fs-pad-b) var(--fs-pad-l);
    min-height: var(--fs-min-h);
  }

  .fieldset-body {
    flex: 1;
    min-width: 0;
  }

  .fieldset-icon {
    display: flex;
    align-items: center;
    flex: none;
    color: var(--mdui-color-on-surface-variant);
  }

  /* 禁用态 (MD3): 边框 12% / 图例与图标 38%; 置后覆盖聚焦/错误色 */
  &[data-disabled] {
    .fieldset-border {
      border-color: color-mix(in srgb, var(--mdui-color-on-surface) 12%, transparent);
    }

    .fieldset-legend,
    .fieldset-icon {
      color: color-mix(in srgb, var(--mdui-color-on-surface) 38%, transparent);
    }
  }
`;
