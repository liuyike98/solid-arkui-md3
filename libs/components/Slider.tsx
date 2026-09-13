import { splitProps } from 'solid-js';
import { Slider as ArkSlider, type SliderRootProps as ArkSliderRootProps } from '@ark-ui/solid/slider';
import { classNames } from '@libs/utils/classNames';
import { css } from 'solid-styled-components';

interface SliderProps extends ArkSliderRootProps {}
export function Slider(props: SliderProps) {
  const [local, restProps] = splitProps(props, ['class', 'children']);
  return (
    <ArkSlider.Root class={classNames(rootClassName, local.class)} {...restProps}>
      <ArkSlider.Control>
        <ArkSlider.Track>
          {/* <ArkSlider.Range /> */}
          <div class='range-left'></div>
  
          <div class='range-right'></div>
        </ArkSlider.Track>
        <ArkSlider.Thumb index={0}>
          <ArkSlider.HiddenInput />
        </ArkSlider.Thumb>
      </ArkSlider.Control>
    </ArkSlider.Root>
  );
}

const rootClassName = css`
  height: 8px;
  width: 100%;

  [data-part='control'] {
    height: 100%;
    align-items: center;

    [data-part='track'] {
      border-radius: 999px;
      height: 100%;
      background-color: #e3e5c2;
      display: flex;

      [data-part='range'] {
        border-radius: 999px 0 0 999px;
        height: 100%;
      }

      .range-left {
        --right-border-radius: calc((100% - var(--slider-range-end)) * 999px);
        width: calc(100% - var(--slider-range-end));
        height: 100%;
        background-color: #596400;
      }
      
      .range-right {
        width: var(--slider-range-end);
        height: 100%;
        background-color: #e3e5c2;
        border-radius: 0 999px 999px 0;
      }
    }

    [data-part='thumb'] {
      height: 250%;
      aspect-ratio: 1;
      translate: 0 -50%;
      top: 50%;
      display: flex;
      align-items: center;
      justify-content: center;

      &::before {
        content: '';
        width: 100%;
        height: 100%;
        background-color: #596400;
        position: absolute;
        border-radius: 50%;
        z-index: 1;
      }

      &::after {
        content: '';
        height: 100%;
        aspect-ratio: 1;
        background-color: #a3a3a35a;
        position: absolute;
        border-radius: 50%;
        transition: height 150ms ease;
      }

      &:hover::after {
        height: 200%;
      }
    }
  }
`;
