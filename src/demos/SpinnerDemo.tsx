import { Slider } from '@libs/components/Slider';
import { Spinner } from '@libs/components/Spinner';
import { createSignal } from 'solid-js';
import { css } from 'solid-styled-components';
import { DemoList, Row, StateText } from './DemoList';
import type { Demo } from './types';

export const spinnerDemo: Demo = {
  name: 'Spinner',
  desc: 'MD3 圆形进度, 不传 value 为不定量加载动画, 传 0-100 进入定量模式 (可放中心内容)。',
  render: () => <SpinnerDemo />,
};

function SpinnerDemo() {
  const [value, setValue] = createSignal([60]);
  const percent = () => Math.round(value()[0]);

  return (
    <DemoList>
      <Row caption='不定量'>
        <Spinner />
      </Row>
      <Row caption='尺寸与线宽'>
        <div class={groupClassName}>
          <Spinner size={24} strokeWidth={3} />
          <Spinner size={40} />
          <Spinner size={64} strokeWidth={6} />
        </div>
      </Row>
      <Row caption='定量'>
        <div class={groupClassName}>
          <Spinner value={25} />
          <Spinner value={60} />
          <Spinner value={100} />
        </div>
      </Row>
      <Row caption='中心内容'>
        <Spinner value={percent()}>{percent()}%</Spinner>
      </Row>
      <Row caption='交互示例'>
        <div class={sliderClassName}>
          <Slider
            min={0}
            max={100}
            value={value()}
            onValueChange={(details) => setValue(details.value)}
          />
        </div>
        <StateText>当前: {percent()}%</StateText>
      </Row>
    </DemoList>
  );
}

const groupClassName = css`
  display: flex;
  flex: 1;
  min-width: 0;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
`;

const sliderClassName = css`
  flex: 1;
  min-width: 160px;
`;
