import { Show, createSignal, onCleanup, onMount, splitProps, type JSX } from 'solid-js';
import { css } from 'solid-styled-components';
import { classNames } from '@libs/utils/classNames';

interface FieldSetProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** 图例文字, 默认浮在顶线上 (缺口由 clip-path 裁出) */
  legend?: JSX.Element;
  /** 主体内容 */
  body?: JSX.Element;
  /** 前导区 (如图标) */
  start?: JSX.Element;
  /** 尾部区 */
  end?: JSX.Element;
  /** 聚焦态: 主色 2px */
  focused?: boolean;
  /** 图例沉入盒内 (缺口闭合) */
  floating?: boolean;
}

const PADDING_X = 16; // JS 计算用
const PADDING_X_CSS = '16px'; // css 插值必须传字符串 (solid-styled-components 不接受 number)
const PADDING_X_2_CSS = '32px';
const PADDING_Y_CSS = '12px';

export function FieldSet(props: FieldSetProps) {
  const [local, restProps] = splitProps(props, ['class', 'legend', 'body', 'start', 'end', 'focused', 'floating', 'children']);

  let legend!: HTMLSpanElement;
  const [notch, setNotch] = createSignal({ x: PADDING_X - 4, w: 0 });
  const [notchReady, setNotchReady] = createSignal(false);
  const measure = () => {
    if (!legend?.isConnected) return;
    setNotch({ x: PADDING_X - 4, w: legend.offsetWidth * 0.75 + 8 });
  };
  onMount(() => {
    measure();
    document.fonts?.ready.then(measure);
    requestAnimationFrame(() => requestAnimationFrame(() => setNotchReady(true)));
    const ro = new ResizeObserver(measure);
    ro.observe(legend);
    onCleanup(() => ro.disconnect());
  });
  /* 与 TextField 同款: 顶边裁出 [x, x+w] × [-2, 4] 凹口; floating 时闭合 */
  const clipPath = () => {
    const { x, w: gap } = notch();
    const w = local.floating ? 0 : gap;
    return `polygon(-2px -2px, ${x}px -2px, ${x}px 4px, ${x + w}px 4px, ${x + w}px -2px, calc(100% + 2px) -2px, calc(100% + 2px) calc(100% + 2px), -2px calc(100% + 2px))`;
  };

  return (
    <div {...restProps} class={classNames(rootClassName, local.class)} data-focused={local.focused ? '' : undefined} data-floating={local.floating ? '' : undefined}>
      <div class='fieldset-border' data-notch-pending={!notchReady() ? '' : undefined} style={{ 'clip-path': clipPath() }} />
      <Show when={local.legend}>
        <span class='fieldset-legend' ref={legend!}>
          {local.legend}
        </span>
      </Show>
      <div class='fieldset-content'>
        <Show when={local.start}>
          <span class='fieldset-icon'>{local.start}</span>
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
    border-radius: var(--mdui-shape-corner-extra-small);
    outline: 2px solid transparent; /* 聚焦时与边框拼成 2px 主色 */
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

  &[data-focused] .fieldset-border {
    border-color: var(--mdui-color-primary);
    outline-color: var(--mdui-color-primary);
  }

  /* 图例: 默认浮在顶线上, 0.75 缩放 (与 TextField 浮起标签同款几何) */
  .fieldset-legend {
    position: absolute;
    left: ${PADDING_X_CSS};
    top: 0;
    transform: translateY(-50%) scale(0.75);
    transform-origin: left center;
    pointer-events: none;
    white-space: nowrap;
    max-width: calc(100% - ${PADDING_X_2_CSS});
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--mdui-color-on-surface-variant);
    transition:
      top ease 200ms,
      transform ease 200ms,
      color ease 200ms;
  }

  /* floating: 图例沉入首行 (顶线补全), 尺寸还原 */
  &[data-floating] .fieldset-legend {
    top: 23px; /* padding-top 12 + 首行行高一半 11 */
    transform: translateY(-50%) scale(1);
  }

  &[data-focused] .fieldset-legend {
    color: var(--mdui-color-primary);
  }

  .fieldset-content {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: ${PADDING_Y_CSS} ${PADDING_X_CSS};
    min-height: 48px;
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
`;
