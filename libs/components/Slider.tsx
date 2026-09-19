import { Show, splitProps } from 'solid-js';
import { Slider as ArkSlider, type SliderRootProps as ArkSliderRootProps } from '@ark-ui/solid/slider';
import { classNames } from '@libs/utils/classNames';
import { css } from 'solid-styled-components';

interface SliderProps extends ArkSliderRootProps {
  showIndicator?: boolean;
}

export function Slider(props: SliderProps) {
  const [local, restProps] = splitProps(props, ['class', 'children']);

  const isRangeMode = () => {
    return (props.value?.length ?? 0) > 1 || (props.defaultValue?.length ?? 0) > 1;
  };

  return (
    <ArkSlider.Root
      class={classNames(rootClassName, local.class)}
      is-range-mode={isRangeMode()}
      {...restProps}
      max={props.max}
      min={props.min}
    >
      <ArkSlider.Control>
        <ArkSlider.Track>
          <div class='range-left'></div>
          <Show when={isRangeMode()}>
            <div class='range-center'></div>
          </Show>
          <div class='range-right'></div>
        </ArkSlider.Track>

        <ArkSlider.Thumb index={0}>
          <Show when={props.showIndicator}>
            <ArkSlider.DraggingIndicator />
          </Show>
          <ArkSlider.HiddenInput />
        </ArkSlider.Thumb>

        <Show when={isRangeMode()}>
          <ArkSlider.Thumb index={1}>
            <Show when={props.showIndicator}>
              <ArkSlider.DraggingIndicator />
            </Show>
            <ArkSlider.HiddenInput />
          </ArkSlider.Thumb>
        </Show>
      </ArkSlider.Control>
    </ArkSlider.Root>
  );
}

/*
 * 结构: 两向共用的「形状 + 配色」放最上面, 各自的「几何」放最下面两个 orientation 块。
 * 覆盖关系靠特异性保证 —— orientation 块多一层 [data-orientation] 属性, 稳定压过共用块。
 *
 * 尺寸约定: 厚度固定 8dp, 长度交给父容器 (横向给它宽度 / 竖向给它高度),
 * 所以竖向 root 的 height: 100% 必须由父容器给出确定高度, 否则整条链塌成 0。
 */
const rootClassName = css`
  &[data-orientation='horizontal'] {
    width: 100%;
    height: 6px;
  }

  &[data-orientation='vertical'] {
    width: 6px;
    height: 100%;
  }

  /* 百分比尺寸链, 每一层都要显式撑满 */
  [data-part='control'] {
    width: 100%;
    height: 100%;
  }

  &[is-range-mode='true'] {
    [data-part='track'] {
      .range-left {
        background-color: transparent;
      }
    }
  }

  /* 轨道: 8dp 全圆角, 未激活 secondaryContainer (与 Progress 底槽一致); 内部用 flex 拼「已激活 + 剩余」两段 */
  [data-part='track'] {
    display: flex;
    width: 100%;
    height: 100%;
    border-radius: 999px;
    background-color: var(--mdui-color-secondary-container);

    .range-left {
      border-radius: 999px;
      background-color: var(--mdui-color-primary);
    }

    .range-center {
      background-color: var(--mdui-color-primary);
    }

    .range-right {
      background-color: var(--mdui-color-secondary-container);
    }
  }

  /* 滑块: 20dp 圆 (厚度的 250%), 40dp 悬停/拖拽状态层 */
  [data-part='thumb'] {
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;

    &::before {
      content: '';
      position: absolute;
      height: 100%;
      aspect-ratio: 1;
      border-radius: 50%;
      background-color: var(--mdui-color-primary);
      z-index: 1;
    }

    &::after {
      content: '';
      position: absolute;
      height: 100%;
      aspect-ratio: 1;
      border-radius: 50%;
      background-color: #a3a3a35a;
      transition: height 150ms ease;
    }

    &:hover::after,
    &[data-dragging]::after {
      height: 200%;
    }
  }

  /*
   * 拖拽值气泡: 形状 / 配色 / 入场动效都与朝向无关, 放共用段; 各朝向只覆盖「定位」。
   *
   * Ark 会往这个元素注入 inline 的 inset-inline-start(横向) / bottom(竖向), 值都是
   * var(--slider-thumb-offset-N)。但这个元素的包含块是 **thumb**(20dp), 百分比按 thumb
   * 自身尺寸解算, 而不是按轨道长度 —— 直接沿用 Zag 算出的值会随数值漂移。
   * 置成 50% 即「thumb 自身尺寸的一半」, 正好把它对到 thumb 中心, 再叠加 Ark 注入的
   * translateX/Y(±50%) 完成居中; 横向竖向都是这一条。
   */
  [data-part='dragging-indicator'] {
    --slider-thumb-offset-0: 50%;

    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    padding: 4px;
    border-radius: 999px;
    color: var(--mdui-color-inverse-on-surface);
    background-color: var(--mdui-color-inverse-surface);
    font-size: 13px;
    scale: 0;
    transition: scale 150ms ease;

    /*
     * 锚点必须是 bottom left, 不能写 bottom center。
     * Ark 用 inline transform(横向 translateX(-50%) / 竖向 translateY(50%)) 做居中, 而
     * transform 属性在变换矩阵里比 scale 更内层 —— scale: 0 会连同这个位移一起塌掉,
     * 所以 transform-origin 是相对「未位移的盒子」量出来的:
     *   bottom center -> 落在最终盒子的右下角(实测锚点 X = 0.999)
     *   bottom left   -> 横向 = 最终盒子的底边中心 / 竖向 = 最终盒子的左边中点
     * 即「从右下角冒出」这个观感的来源。锚点与内容尺寸无关。
     */
    transform-origin: bottom left;

    &[data-state='open'] {
      scale: 1;
    }
  }

  /* 横向: 沿 x 轴铺开; Ark 给 thumb 挂 inset-inline-start + translateX(-50%), 这里只补纵向居中 */
  &[data-orientation='horizontal'] {
    [data-part='track'] {
      flex-direction: row;

      .range-left {
        width: var(--slider-thumb-offset-0);
        height: 100%;
      }

      .range-center {
        width: calc(var(--slider-thumb-offset-1) - var(--slider-thumb-offset-0));
      }

      .range-right {
        height: 100%;
        border-radius: 0 999px 999px 0;
      }
    }

    [data-part='thumb'] {
      top: 50%;
      height: 250%;
      translate: 0 -50%;
    }

    /* 气泡在 thumb 上方: -200% = 2 个 thumb 高 */
    [data-part='dragging-indicator'] {
      bottom: 170%;

    }
  }

  /* 竖向: 沿 y 轴自下而上铺开; Ark 给 thumb 挂 bottom + translateY(50%), 这里只补横向居中 */
  &[data-orientation='vertical'] {
    [data-part='track'] {
      flex-direction: column-reverse;

      .range-left {
        width: 100%;
        height: var(--slider-thumb-offset-0);
      }

       .range-center {
        width: 100%;
        height: calc(var(--slider-thumb-offset-1) - var(--slider-thumb-offset-0));
      }

      .range-right {
        width: 100%;
        height: var(--slider-range-end);
        border-radius: 999px 999px 0 0;
      }
    }

    [data-part='thumb'] {
      /* top 必须清掉: 与 Ark 的 bottom 同时存在会把滑块纵向拉长 */
      top: auto;
      left: 50%;
      width: 250%;
      height: auto;
      translate: -50% 0;
    }

    /*
     * 气泡在 thumb 右侧: 100% = thumb 宽度(20dp), 再留 8dp 间隙。
     * 纵向不用管 —— Ark 给竖向挂的是 bottom: var(--slider-thumb-offset-0)(已在共用段
     * 置成 50% = thumb 高度的一半) + translateY(50%), 正好垂直居中于 thumb。
     * 竖向 Ark 不给 left, 所以这条不会被 inline 样式压掉。
     */
    [data-part='dragging-indicator'] {
      left: 170%;
    }
  }

  /* 禁用态 */
  &[data-disabled] {
    [data-part='thumb']::after {
      display: none;
    }
    opacity: 0.6;
  }
`;
