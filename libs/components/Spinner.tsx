import { Show, splitProps, type JSX } from 'solid-js';
import { css } from 'solid-styled-components';
import { classNames } from '@libs/utils/classNames';

export interface SpinnerProps {
  /** 附加到根元素上的 class */
  class?: string;
  /** 直径 (px), 默认 40 */
  size?: number;
  /** 描边宽度 (px), 默认 4 */
  strokeWidth?: number;
  /** 0 - 100; 不传为不定量加载动画 */
  value?: number;
  /** 中心内容 (如百分比文字), 仅定量模式常用 */
  children?: JSX.Element;
}

/** viewBox 边长与 pathLength, 与 Sober s-spinner 相同 (40 / 100) */
const SIZE = 40;
const PATH = 100;
/** 定量模式下轨道与进度弧之间的留白 (px), 抵消 round 线帽的延伸 */
const STROKE_GAP = 4;

export function Spinner(props: SpinnerProps) {
  const [local] = splitProps(props, ['class', 'size', 'strokeWidth', 'value', 'children']);

  const strokeWidth = () => local.strokeWidth ?? 4;
  const percent = () => (local.value === undefined ? null : Math.min(Math.max(local.value, 0), 100));
  /** dash 单位下弧端需要留出的间隙, 同 Sober: (线宽+留白) / (π * (直径-线宽)) * 100 */
  const dashGap = () => ((strokeWidth() + STROKE_GAP) / (Math.PI * (SIZE - strokeWidth()))) * PATH;

  const trackStyle = () => {
    const base = { 'stroke-width': `${strokeWidth()}px` };
    const p = percent();
    if (p === null) return base;
    const gap = dashGap();
    if (p === 0) return { ...base, 'stroke-dasharray': `${PATH} 0`, 'stroke-dashoffset': '0' };
    if (p + gap * 2 > PATH) return { ...base, opacity: '0' };
    return {
      ...base,
      'stroke-dasharray': `${PATH - p - gap * 2} ${p + gap * 2}`,
      'stroke-dashoffset': `${-(p + gap)}`,
    };
  };

  const indicatorStyle = () => {
    const base = { 'stroke-width': `${strokeWidth()}px` };
    const p = percent();
    if (p === null) return base;
    if (p === 0) return { ...base, opacity: '0' };
    return { ...base, 'stroke-dasharray': `${p} ${PATH - p}` };
  };

  return (
    <div
      class={classNames(rootClassName, local.class)}
      data-indeterminate={percent() === null ? '' : undefined}
      style={{ width: `${local.size ?? SIZE}px`, '--mdui-spinner-dash-gap': `${dashGap()}px` }}
    >
      <svg class={svgClassName} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden>
        <circle class='track' cx={SIZE / 2} cy={SIZE / 2} r={18} pathLength={PATH} style={trackStyle()} />
        <circle class='indicator' cx={SIZE / 2} cy={SIZE / 2} r={18} pathLength={PATH} style={indicatorStyle()} />
      </svg>
      <Show when={local.children}>
        <div class={textClassName}>{local.children}</div>
      </Show>
    </div>
  );
}

const rootClassName = css`
  position: relative;
  display: inline-block;
  vertical-align: middle;
  aspect-ratio: 1;
  color: #596400;

  .track,
  .indicator {
    fill: none;
    stroke-linecap: round;
    transform: rotate(-90deg);
    transform-origin: center;
    transition:
      stroke-dasharray 200ms cubic-bezier(0.2, 0, 0, 1),
      stroke-dashoffset 200ms cubic-bezier(0.2, 0, 0, 1);
  }

  /* 轨道只画进度弧之外的剩余段, 两端各留 dash-gap, 与 Sober 一致 */
  .track {
    stroke: #e3e5c2;
  }

  .indicator {
    stroke: currentColor;
  }

  &[data-indeterminate] .indicator {
    animation: mdui-spinner-indicator 5400ms linear infinite;
  }

  &[data-indeterminate] .track {
    animation: mdui-spinner-track 5400ms linear infinite;
  }

  /* 不定量动画关键帧: 由 Sober s-spinner 的生成器算法 (duration 5400 / segment 667 /
     expand / collapse / rotate 1520 + cubic-bezier(0.4,0,0.2,1) 采样) 复算导出, 循环处无缝 */
  @keyframes mdui-spinner-indicator {
    0% { stroke-dasharray: 5.6 94.4; stroke-dashoffset: 5.6; }
    2.96% { stroke-dasharray: 20.4 79.6; stroke-dashoffset: -7; }
    5.93% { stroke-dasharray: 57.5 42.5; stroke-dashoffset: -19.5; }
    8.89% { stroke-dasharray: 71.3 28.7; stroke-dashoffset: -32; }
    11.85% { stroke-dasharray: 74.9 25.1; stroke-dashoffset: -44.5; }
    12.35% { stroke-dasharray: 75 25; stroke-dashoffset: -46.6; }
    15.31% { stroke-dasharray: 60.2 39.8; stroke-dashoffset: -73.9; }
    18.28% { stroke-dasharray: 23 77; stroke-dashoffset: -123.6; }
    21.24% { stroke-dasharray: 9.2 90.8; stroke-dashoffset: -149.9; }
    24.2% { stroke-dasharray: 5.6 94.4; stroke-dashoffset: -166; }
    25% { stroke-dasharray: 5.6 94.4; stroke-dashoffset: -169.4; }
    27.96% { stroke-dasharray: 20.4 79.6; stroke-dashoffset: -182; }
    30.93% { stroke-dasharray: 57.5 42.5; stroke-dashoffset: -194.5; }
    33.89% { stroke-dasharray: 71.3 28.7; stroke-dashoffset: -207; }
    36.85% { stroke-dasharray: 74.9 25.1; stroke-dashoffset: -219.5; }
    37.35% { stroke-dasharray: 75 25; stroke-dashoffset: -221.6; }
    40.31% { stroke-dasharray: 60.2 39.8; stroke-dashoffset: -248.9; }
    43.28% { stroke-dasharray: 23 77; stroke-dashoffset: -298.6; }
    46.24% { stroke-dasharray: 9.2 90.8; stroke-dashoffset: -324.9; }
    49.2% { stroke-dasharray: 5.6 94.4; stroke-dashoffset: -341; }
    50% { stroke-dasharray: 5.6 94.4; stroke-dashoffset: -344.4; }
    52.96% { stroke-dasharray: 20.4 79.6; stroke-dashoffset: -357; }
    55.93% { stroke-dasharray: 57.5 42.5; stroke-dashoffset: -369.5; }
    58.89% { stroke-dasharray: 71.3 28.7; stroke-dashoffset: -382; }
    61.85% { stroke-dasharray: 74.9 25.1; stroke-dashoffset: -394.5; }
    62.35% { stroke-dasharray: 75 25; stroke-dashoffset: -396.6; }
    65.31% { stroke-dasharray: 60.2 39.8; stroke-dashoffset: -423.9; }
    68.28% { stroke-dasharray: 23 77; stroke-dashoffset: -473.6; }
    71.24% { stroke-dasharray: 9.2 90.8; stroke-dashoffset: -499.9; }
    74.2% { stroke-dasharray: 5.6 94.4; stroke-dashoffset: -516; }
    75% { stroke-dasharray: 5.6 94.4; stroke-dashoffset: -519.4; }
    77.96% { stroke-dasharray: 20.4 79.6; stroke-dashoffset: -532; }
    80.93% { stroke-dasharray: 57.5 42.5; stroke-dashoffset: -544.5; }
    83.89% { stroke-dasharray: 71.3 28.7; stroke-dashoffset: -557; }
    86.85% { stroke-dasharray: 74.9 25.1; stroke-dashoffset: -569.5; }
    87.35% { stroke-dasharray: 75 25; stroke-dashoffset: -571.6; }
    90.31% { stroke-dasharray: 60.2 39.8; stroke-dashoffset: -598.9; }
    93.28% { stroke-dasharray: 23 77; stroke-dashoffset: -648.6; }
    96.24% { stroke-dasharray: 9.2 90.8; stroke-dashoffset: -674.9; }
    99.2% { stroke-dasharray: 5.6 94.4; stroke-dashoffset: -691; }
    100% { stroke-dasharray: 5.6 94.4; stroke-dashoffset: -694.4; }
  }

  @keyframes mdui-spinner-track {
    0% { stroke-dasharray: calc(94.4px - var(--mdui-spinner-dash-gap) * 2) calc(5.6px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((0px + var(--mdui-spinner-dash-gap)) * -1); }
    2.96% { stroke-dasharray: calc(79.6px - var(--mdui-spinner-dash-gap) * 2) calc(20.4px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((27.3px + var(--mdui-spinner-dash-gap)) * -1); }
    5.93% { stroke-dasharray: calc(42.5px - var(--mdui-spinner-dash-gap) * 2) calc(57.5px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((77px + var(--mdui-spinner-dash-gap)) * -1); }
    8.89% { stroke-dasharray: calc(28.7px - var(--mdui-spinner-dash-gap) * 2) calc(71.3px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((103.3px + var(--mdui-spinner-dash-gap)) * -1); }
    11.85% { stroke-dasharray: calc(25.1px - var(--mdui-spinner-dash-gap) * 2) calc(74.9px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((119.4px + var(--mdui-spinner-dash-gap)) * -1); }
    12.35% { stroke-dasharray: calc(25px - var(--mdui-spinner-dash-gap) * 2) calc(75px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((121.6px + var(--mdui-spinner-dash-gap)) * -1); }
    15.31% { stroke-dasharray: calc(39.8px - var(--mdui-spinner-dash-gap) * 2) calc(60.2px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((134.1px + var(--mdui-spinner-dash-gap)) * -1); }
    18.28% { stroke-dasharray: calc(77px - var(--mdui-spinner-dash-gap) * 2) calc(23px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((146.6px + var(--mdui-spinner-dash-gap)) * -1); }
    21.24% { stroke-dasharray: calc(90.8px - var(--mdui-spinner-dash-gap) * 2) calc(9.2px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((159.1px + var(--mdui-spinner-dash-gap)) * -1); }
    24.2% { stroke-dasharray: calc(94.4px - var(--mdui-spinner-dash-gap) * 2) calc(5.6px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((171.6px + var(--mdui-spinner-dash-gap)) * -1); }
    25% { stroke-dasharray: calc(94.4px - var(--mdui-spinner-dash-gap) * 2) calc(5.6px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((175px + var(--mdui-spinner-dash-gap)) * -1); }
    27.96% { stroke-dasharray: calc(79.6px - var(--mdui-spinner-dash-gap) * 2) calc(20.4px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((202.3px + var(--mdui-spinner-dash-gap)) * -1); }
    30.93% { stroke-dasharray: calc(42.5px - var(--mdui-spinner-dash-gap) * 2) calc(57.5px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((252px + var(--mdui-spinner-dash-gap)) * -1); }
    33.89% { stroke-dasharray: calc(28.7px - var(--mdui-spinner-dash-gap) * 2) calc(71.3px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((278.3px + var(--mdui-spinner-dash-gap)) * -1); }
    36.85% { stroke-dasharray: calc(25.1px - var(--mdui-spinner-dash-gap) * 2) calc(74.9px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((294.4px + var(--mdui-spinner-dash-gap)) * -1); }
    37.35% { stroke-dasharray: calc(25px - var(--mdui-spinner-dash-gap) * 2) calc(75px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((296.6px + var(--mdui-spinner-dash-gap)) * -1); }
    40.31% { stroke-dasharray: calc(39.8px - var(--mdui-spinner-dash-gap) * 2) calc(60.2px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((309.1px + var(--mdui-spinner-dash-gap)) * -1); }
    43.28% { stroke-dasharray: calc(77px - var(--mdui-spinner-dash-gap) * 2) calc(23px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((321.6px + var(--mdui-spinner-dash-gap)) * -1); }
    46.24% { stroke-dasharray: calc(90.8px - var(--mdui-spinner-dash-gap) * 2) calc(9.2px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((334.1px + var(--mdui-spinner-dash-gap)) * -1); }
    49.2% { stroke-dasharray: calc(94.4px - var(--mdui-spinner-dash-gap) * 2) calc(5.6px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((346.6px + var(--mdui-spinner-dash-gap)) * -1); }
    50% { stroke-dasharray: calc(94.4px - var(--mdui-spinner-dash-gap) * 2) calc(5.6px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((350px + var(--mdui-spinner-dash-gap)) * -1); }
    52.96% { stroke-dasharray: calc(79.6px - var(--mdui-spinner-dash-gap) * 2) calc(20.4px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((377.3px + var(--mdui-spinner-dash-gap)) * -1); }
    55.93% { stroke-dasharray: calc(42.5px - var(--mdui-spinner-dash-gap) * 2) calc(57.5px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((427px + var(--mdui-spinner-dash-gap)) * -1); }
    58.89% { stroke-dasharray: calc(28.7px - var(--mdui-spinner-dash-gap) * 2) calc(71.3px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((453.3px + var(--mdui-spinner-dash-gap)) * -1); }
    61.85% { stroke-dasharray: calc(25.1px - var(--mdui-spinner-dash-gap) * 2) calc(74.9px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((469.4px + var(--mdui-spinner-dash-gap)) * -1); }
    62.35% { stroke-dasharray: calc(25px - var(--mdui-spinner-dash-gap) * 2) calc(75px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((471.6px + var(--mdui-spinner-dash-gap)) * -1); }
    65.31% { stroke-dasharray: calc(39.8px - var(--mdui-spinner-dash-gap) * 2) calc(60.2px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((484.1px + var(--mdui-spinner-dash-gap)) * -1); }
    68.28% { stroke-dasharray: calc(77px - var(--mdui-spinner-dash-gap) * 2) calc(23px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((496.6px + var(--mdui-spinner-dash-gap)) * -1); }
    71.24% { stroke-dasharray: calc(90.8px - var(--mdui-spinner-dash-gap) * 2) calc(9.2px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((509.1px + var(--mdui-spinner-dash-gap)) * -1); }
    74.2% { stroke-dasharray: calc(94.4px - var(--mdui-spinner-dash-gap) * 2) calc(5.6px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((521.6px + var(--mdui-spinner-dash-gap)) * -1); }
    75% { stroke-dasharray: calc(94.4px - var(--mdui-spinner-dash-gap) * 2) calc(5.6px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((525px + var(--mdui-spinner-dash-gap)) * -1); }
    77.96% { stroke-dasharray: calc(79.6px - var(--mdui-spinner-dash-gap) * 2) calc(20.4px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((552.3px + var(--mdui-spinner-dash-gap)) * -1); }
    80.93% { stroke-dasharray: calc(42.5px - var(--mdui-spinner-dash-gap) * 2) calc(57.5px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((602px + var(--mdui-spinner-dash-gap)) * -1); }
    83.89% { stroke-dasharray: calc(28.7px - var(--mdui-spinner-dash-gap) * 2) calc(71.3px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((628.3px + var(--mdui-spinner-dash-gap)) * -1); }
    86.85% { stroke-dasharray: calc(25.1px - var(--mdui-spinner-dash-gap) * 2) calc(74.9px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((644.4px + var(--mdui-spinner-dash-gap)) * -1); }
    87.35% { stroke-dasharray: calc(25px - var(--mdui-spinner-dash-gap) * 2) calc(75px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((646.6px + var(--mdui-spinner-dash-gap)) * -1); }
    90.31% { stroke-dasharray: calc(39.8px - var(--mdui-spinner-dash-gap) * 2) calc(60.2px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((659.1px + var(--mdui-spinner-dash-gap)) * -1); }
    93.28% { stroke-dasharray: calc(77px - var(--mdui-spinner-dash-gap) * 2) calc(23px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((671.6px + var(--mdui-spinner-dash-gap)) * -1); }
    96.24% { stroke-dasharray: calc(90.8px - var(--mdui-spinner-dash-gap) * 2) calc(9.2px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((684.1px + var(--mdui-spinner-dash-gap)) * -1); }
    99.2% { stroke-dasharray: calc(94.4px - var(--mdui-spinner-dash-gap) * 2) calc(5.6px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((696.6px + var(--mdui-spinner-dash-gap)) * -1); }
    100% { stroke-dasharray: calc(94.4px - var(--mdui-spinner-dash-gap) * 2) calc(5.6px + var(--mdui-spinner-dash-gap) * 2); stroke-dashoffset: calc((700px + var(--mdui-spinner-dash-gap)) * -1); }
  }
`;

const svgClassName = css`
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
`;

const textClassName = css`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #4e4e4e;
`;
