import { Progress as ArkProgress, type ProgressRootProps } from '@ark-ui/solid/progress';
import { splitProps } from 'solid-js';
import { css } from 'solid-styled-components';
import { classNames } from '@libs/utils/classNames';

export interface ProgressProps extends ProgressRootProps {
  /** 轨道粗细 (px), 默认 4 */
  size?: number;
}

/* ---------- 不定量动画: 完全对齐 Sober s-progress 的 5 段 left/width 逐帧生成 ---------- */

const bezier = (x1: number, y1: number, x2: number, y2: number) => {
  const sample = (t: number, a: number, b: number) => {
    const i = 1 - t;
    return 3 * i * i * t * a + 3 * i * t * t * b + t * t * t;
  };
  return (x: number) => {
    let l = 0;
    let h = 1;
    let t = 0;
    for (let i = 0; i < 14; i++) {
      t = (l + h) / 2;
      if (sample(t, x1, x2) < x) l = t;
      else h = t;
    }
    return sample(t, y1, y2);
  };
};

const CONFIG = { duration: 1800, gap: 4, fps: 60 } as const;

/** [起始时刻, 持续, 缓动] — MDC 四段错峰 */
const ANIMATIONS = [
  [1267, 533, bezier(0.2, 0, 0.8, 1)],
  [1000, 567, bezier(0.4, 0, 1, 1)],
  [333, 850, bezier(0, 0, 0.65, 1)],
  [0, 750, bezier(0.1, 0, 0.45, 1)],
] as const;

const animationValue = (elapsed: number, delay: number, duration: number, easing: (x: number) => number) => {
  if (elapsed <= delay) return 0;
  if (elapsed >= delay + duration) return 1;
  return easing((elapsed - delay) / duration);
};

const format = (value: number) => Number(value.toFixed(5));

const segmentStyle = (start: number, end: number, startGap = 0, endGap = 0) => {
  if (end <= start) return 'left:0;width:0;visibility:hidden;';
  const left = `calc(${format(start * 100)}% + ${startGap}px)`;
  const width = `max(0px,calc(${format((end - start) * 100)}% - ${startGap + endGap}px))`;
  return `left:${left};width:${width};visibility:visible;`;
};

const frame = (elapsed: number) => {
  const [lateStart, lateEnd, earlyStart, earlyEnd] = ANIMATIONS.map(([delay, duration, easing]) =>
    animationValue(elapsed, delay, duration, easing),
  );
  return [
    segmentStyle(0, lateStart, 0, CONFIG.gap),
    segmentStyle(lateStart, lateEnd),
    segmentStyle(lateEnd, earlyStart, lateEnd > 0 ? CONFIG.gap : 0, earlyStart < 1 ? CONFIG.gap : 0),
    segmentStyle(earlyStart, earlyEnd),
    segmentStyle(earlyEnd, 1, earlyEnd > 0 ? CONFIG.gap : 0),
  ];
};

const createKeyframes = () => {
  const count = Math.round((CONFIG.duration / 1000) * CONFIG.fps);
  const rules = [0, 1, 2, 3, 4].map((_, index) => `@keyframes mdui-progress-segment-${index}{`);
  for (let i = 0; i <= count; i++) {
    const progress = i / count;
    const percentage = format(progress * 100);
    frame(progress * CONFIG.duration).forEach((style, index) => (rules[index] += `${percentage}%{${style}}`));
  }
  return rules.map((rule) => `${rule}}`).join('');
};

if (typeof document !== 'undefined' && !document.getElementById('mdui-progress-keyframes')) {
  const style = document.createElement('style');
  style.id = 'mdui-progress-keyframes';
  style.textContent = createKeyframes();
  document.head.appendChild(style);
}

/* ---------- 组件 ---------- */

export function Progress(props: ProgressProps) {
  const [local, restProps] = splitProps(props, ['class', 'size']);

  return (
    <ArkProgress.Root {...restProps} class={classNames(rootClassName, local.class)}>
      <ArkProgress.Track class='progress-track' style={{ '--progress-height': `${local.size ?? 4}px` }}>
        <ArkProgress.Range class='progress-range' />
        <span class='progress-stop' />
        <span class='progress-segment' data-segment='0' />
        <span class='progress-segment' data-segment='1' />
        <span class='progress-segment' data-segment='2' />
        <span class='progress-segment' data-segment='3' />
        <span class='progress-segment' data-segment='4' />
      </ArkProgress.Track>
    </ArkProgress.Root>
  );
}

/* MD3 linear progress, 不定量动画与 Sober s-progress 对齐:
   定量 = secondaryContainer 底槽 + primary 进度 + 末端圆点;
   不定量 = 5 段平铺层 (0/2/4 底槽色, 1/3 主色) 跑逐帧 left/width 动画。
   注意: ark 把 data-state 挂在 Track (progressbar 角色元素) 上 */
const rootClassName = css`
  display: block;
  width: 100%;
  color: var(--mdui-color-primary);

  & .progress-track {
    position: relative;
    height: var(--progress-height, 4px);
    border-radius: 999px;
    overflow: hidden;
    background-color: var(--mdui-color-secondary-container);
  }

  & .progress-range {
    position: absolute;
    inset: 0 auto 0 0;
    height: 100%;
    border-radius: inherit;
    background-color: currentcolor;
    transition: width var(--mdui-motion-duration-short4, 200ms) var(--mdui-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
  }

  & .progress-stop {
    position: absolute;
    right: 0;
    height: 100%;
    aspect-ratio: 1;
    border-radius: 50%;
    background-color: currentcolor;
  }

  & .progress-segment {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    height: 100%;
    border-radius: inherit;
    background-color: var(--mdui-color-secondary-container);

    &[data-segment='1'],
    &[data-segment='3'] {
      background-color: currentcolor;
    }
  }

  & .progress-track[data-state='indeterminate'] {
    background-color: transparent;

    & .progress-range,
    & .progress-stop {
      display: none;
    }

    & .progress-segment {
      display: block;
      animation-duration: 1800ms;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
      animation-fill-mode: both;
    }
  }

  /* 5 段动画名分别绑定 */
  & .progress-track[data-state='indeterminate'] .progress-segment[data-segment='0'] {
    animation-name: mdui-progress-segment-0;
  }
  & .progress-track[data-state='indeterminate'] .progress-segment[data-segment='1'] {
    animation-name: mdui-progress-segment-1;
  }
  & .progress-track[data-state='indeterminate'] .progress-segment[data-segment='2'] {
    animation-name: mdui-progress-segment-2;
  }
  & .progress-track[data-state='indeterminate'] .progress-segment[data-segment='3'] {
    animation-name: mdui-progress-segment-3;
  }
  & .progress-track[data-state='indeterminate'] .progress-segment[data-segment='4'] {
    animation-name: mdui-progress-segment-4;
  }
`;
