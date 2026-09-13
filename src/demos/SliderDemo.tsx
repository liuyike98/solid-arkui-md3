import { Slider } from '@libs/components/Slider';
import { createSignal } from 'solid-js';
import { css } from 'solid-styled-components';
import { DemoList, Row, StateText } from './DemoList';
import type { Demo } from './types';

export const sliderDemo: Demo = {
  name: 'Slider',
  desc: 'MD3 滑块, 8dp 轨道全圆角 (未激活 #e3e5c2 / 激活 primary), 20dp 圆形滑块带 40dp 悬停状态层。支持水平 / 竖向两种朝向, 单滑块。',
  render: () => <SliderDemo />,
};

function SliderDemo() {
  const [value, setValue] = createSignal([40]);

  return (
    <DemoList>
      <Row caption='默认'>
        <Slider />
      </Row>
      <Row caption='初始值 40'>
        <Slider defaultValue={[40]} />
      </Row>
      <Row caption='初始值 40 结束值 80'>
        <Slider defaultValue={[40]} min={40} max={80} showIndicator />
      </Row>
      
      <Row caption='范围 40 - 80'>
        <Slider defaultValue={[40,80]} showIndicator />
      </Row>

      <Row caption='步进 20'>
        <Slider step={20} defaultValue={[40]} />
      </Row>
      <Row caption='禁用'>
        <Slider defaultValue={[60]} disabled={true} />
      </Row>
      <Row caption='竖向'>
        <div class={verticalBoxClassName}>
          <Slider orientation='vertical' defaultValue={[40]} />
        </div>
      </Row>

      <Row caption='竖向范围 40 - 80'>
        <div class={verticalBoxClassName}>

        <Slider defaultValue={[40,80]} showIndicator orientation='vertical' />
        </div>
      </Row>


      <Row caption='交互示例'>
        <Slider value={value()} onValueChange={(details) => setValue(details.value)} showIndicator />
        <StateText>当前: {value()[0]}</StateText>
      </Row>
    </DemoList>
  );
}

/* 竖向滑块的长度由父容器给定 (同横向由父容器给宽度), 所以要补一个确定高度 */
const verticalBoxClassName = css`
  height: 180px;
`;
