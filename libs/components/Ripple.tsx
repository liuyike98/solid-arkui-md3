import { onCleanup, onMount, type JSX } from 'solid-js';
import { css } from 'solid-styled-components';
import { classNames } from '@libs/utils/classNames';

export interface RippleProps {
  disabled?: boolean;
  disabledHover?: boolean;
  delay?: number;
  parent?: HTMLElement;
  children?: JSX.Element;
  /** 附加到 ripple 容器上的 class, 用于自定义容器尺寸/形状 */
  class?: string;
}
const parseDuration = (value: string) => {
  const match = value.trim().match(/^([\d.]+)(s|ms)$/);
  if (!match) return 0;
  const number = Number(match[1]);
  return match[2] === 's' ? number * 1000 : number;
};

const pointerFine = matchMedia('(any-pointer: fine)');

const oneEvent = <K extends keyof DocumentEventMap>(events: K[], callback: (event: DocumentEventMap[K]) => void) => {
  let handler: (event: DocumentEventMap[K]) => void = () => {};
  const remove = () => {
    for (const name of events) document.removeEventListener(name, handler);
  };
  handler = (event) => {
    callback(event);
    remove();
  };
  for (const name of events) document.addEventListener(name, handler);
};

const setupRipple = (container: HTMLDivElement, wave: HTMLDivElement, mask: HTMLDivElement, props: RippleProps) => {
  const parent = props.parent ?? container.parentElement!;

  const getAnimateOptions = () => {
    const style = getComputedStyle(container);
    return { duration: parseDuration(style.animationDuration), easing: style.animationTimingFunction };
  };

  const startRipple = (event: PointerEvent, duration: number, easing: string) => {
    const rect = container.getBoundingClientRect();
    const x = Math.max(rect.left, Math.min(event.clientX, rect.left + rect.width));
    const y = Math.max(rect.top, Math.min(event.clientY, rect.top + rect.height));
    const state = { x: x - rect.left, y: y - rect.top, h: rect.height / 2, w: rect.width / 2 };
    const size = Math.sqrt(
      (Math.abs(state.h - state.y) + state.h) ** 2 * 4 + (Math.abs(state.w - state.x) + state.w) ** 2 * 4,
    );
    let node = wave;
    if (node.getAnimations().length > 0) {
      node = wave.cloneNode() as HTMLDivElement;
      container.appendChild(node);
    }
    const animation = node.animate(
      {
        opacity: [1, 1],
        width: [`${size}px`, `${size}px`],
        height: [`${size}px`, `${size}px`],
        transform: ['translate(-50%, -50%) scale(0)', 'translate(-50%, -50%) scale(1)'],
        left: [`${state.x}px`, `${state.x}px`],
        top: [`${state.y}px`, `${state.y}px`],
      },
      { duration, easing, fill: 'forwards' },
    );
    return () => {
      const time = Number(animation.currentTime);
      const short = duration / 2;
      const fadeDuration = time > duration - short ? short : duration - time;
      const fade = node.animate({ opacity: [1, 0] }, { duration: fadeDuration, easing, fill: 'forwards' });
      fade.finished.then(() => node !== wave && node.isConnected && container.removeChild(node));
    };
  };

  const start = (event: PointerEvent) => {
    if (props.disabled) return;
    const run = (e: PointerEvent) => {
      const { duration, easing } = getAnimateOptions();
      return startRipple(e, duration, easing);
    };
    if (event.pointerType === 'mouse') return oneEvent(['pointerup', 'pointercancel'], run(event));
    const delay = props.delay ?? 0;
    if (delay <= 0) return oneEvent(['touchend', 'touchcancel'], run(event));
    let stop: (() => void) | null = null;
    const timer = setTimeout(() => (stop = run(event)), delay);
    const cancel = (e: TouchEvent) => {
      clearTimeout(timer);
      stop?.();
      if (e.type === 'touchmove') return;
      !stop && run(event)();
    };
    oneEvent(['touchend', 'touchcancel', 'touchmove'], cancel);
  };

  const hovering = (event: PointerEvent) => {
    if (props.disabledHover || !pointerFine.matches || event.pointerType !== 'mouse') return;
    mask.classList.toggle('hover', event.type === 'pointerenter');
  };

  const down = (event: PointerEvent) => {
    if (event.button !== 0) return;
    start(event);
  };

  parent.addEventListener('pointerenter', hovering);
  parent.addEventListener('pointerleave', hovering);
  parent.addEventListener('pointercancel', hovering);
  parent.addEventListener('pointerdown', down);

  return () => {
    parent.removeEventListener('pointerenter', hovering);
    parent.removeEventListener('pointerleave', hovering);
    parent.removeEventListener('pointercancel', hovering);
    parent.removeEventListener('pointerdown', down);
  };
};

export function Ripple(props: RippleProps) {
  let container: HTMLDivElement = undefined!;
  let wave: HTMLDivElement = undefined!;
  let mask: HTMLDivElement = undefined!;
  let dispose: (() => void) | undefined;

  onMount(() => {
    dispose = setupRipple(container, wave, mask, props);
  });

  onCleanup(() => dispose?.());

  return (
    <div class={classNames(containerClassName, props.class)} ref={container}>
      <div class={maskClassName} ref={mask}></div>
      <div class={waveClassName} ref={wave}></div>
    </div>
  );
}

const containerClassName = css`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  border-radius: inherit;
  overflow: hidden;
  animation-duration: var(--s-motion-duration-long4, 600ms);
  animation-timing-function: var(--s-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));

  @media (prefers-reduced-motion: reduce) {
    animation-duration: 0s;
  }
`;

const maskClassName = css`
  position: absolute;
  inset: 0;
  animation-duration: inherit;
  animation-timing-function: inherit;
  opacity: 0;
  transition: opacity var(--s-motion-duration-short4, 200ms) var(--s-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
  background: var(--s-ripple-color, currentColor);

  &.hover {
    opacity: var(--s-ripple-hover-opacity, 0.1);
  }

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 0s;
  }
`;

const waveClassName = css`
  position: absolute;
  inset: 0;
  animation-duration: inherit;
  animation-timing-function: inherit;
  opacity: 0;
  border-radius: 50%;
  background: var(--s-ripple-color, currentColor);
  filter: opacity(var(--s-ripple-opacity, 0.24));
`;
