import { Progress } from '@libs/components/Progress';
import { Slider } from '@libs/components/Slider';
import { createSignal } from 'solid-js';
import { css } from 'solid-styled-components';
import { DemoList, Row, StateText } from './DemoList';
import type { Demo } from './types';

export const progressDemo: Demo = {
  name: 'Progress',
  desc: 'MD3 线性进度条, secondaryContainer 底槽 + primary 进度与末端圆点, 不定量为 5 段错峰波条动画 (与 Sober 对齐)。',
  render: () => <ProgressDemo />,
};

function ProgressDemo() {
  const [value, setValue] = createSignal([45]);

  return (
    <DemoList>
      <Row caption='定量'>
        <div class={boxClassName}>
          <Progress value={25} />
          <Progress value={60} />
          <Progress value={100} />
        </div>
      </Row>
      <Row caption='不定量'>
        <div class={boxClassName}>
          <Progress value={null} />
        </div>
      </Row>
      <Row caption='粗细'>
        <div class={boxClassName}>
          <Progress value={50} size={8} />
          <Progress value={50} size={2} />
        </div>
      </Row>
      <Row caption='交互示例'>
        <div class={sliderClassName}>
          <Slider min={0} max={100} value={value()} onValueChange={(details) => setValue(details.value)} />
        </div>
        <Progress value={value()[0]} class={progressClassName} />
        <StateText>{Math.round(value()[0])}%</StateText>
      </Row>
    </DemoList>
  );
}

const boxClassName = css`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  gap: 16px;
`;

const sliderClassName = css`
  flex: 1;
  min-width: 160px;
`;

const progressClassName = css`
  width: 120px;
`;
