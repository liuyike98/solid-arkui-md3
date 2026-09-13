import { Slider } from '@libs/components/Slider';
import { createSignal } from 'solid-js';
import { DemoList, Row, StateText } from './DemoList';
import type { Demo } from './types';

export const sliderDemo: Demo = {
  name: 'Slider',
  desc: 'MD3 滑块, 8dp 轨道全圆角 (未激活 #e3e5c2 / 激活 primary), 20dp 圆形滑块带 40dp 悬停状态层。当前是水平单滑块形态。',
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
      <Row caption='步进 20'>
        <Slider step={20} defaultValue={[40]} />
      </Row>
      <Row caption='禁用'>
        <Slider defaultValue={[60]} disabled={true} />
      </Row>
      <Row caption='交互示例'>
        <Slider value={value()} onValueChange={(details) => setValue(details.value)} />
        <StateText>当前: {value()[0]}</StateText>
      </Row>
    </DemoList>
  );
}
