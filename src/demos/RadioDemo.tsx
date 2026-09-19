import { Radio } from '@libs/components/Radio';
import { createSignal } from 'solid-js';
import { css } from 'solid-styled-components';
import { DemoList, Row, StateText } from './DemoList';
import type { Demo } from './types';

export const radioDemo: Demo = {
  name: 'Radio',
  desc: 'MD3 单选框, 20dp 圆环 + 实心点形变, 同 name 互斥, 支持禁用 / 只读, 悬停水波纹。',
  render: () => <RadioDemo />,
};

function RadioDemo() {
  const [fruit, setFruit] = createSignal('apple');

  return (
    <DemoList>
      <Row caption='单选组'>
        <div class={groupClassName}>
          <Radio name='fruit' defaultChecked onChange={() => setFruit('apple')}>
            苹果
          </Radio>
          <Radio name='fruit' onChange={() => setFruit('香蕉')}>
            香蕉
          </Radio>
          <Radio name='fruit' onChange={() => setFruit('橙子')}>
            橙子
          </Radio>
        </div>
        <StateText>当前: {fruit()}</StateText>
      </Row>
      <Row caption='禁用'>
        <div class={groupClassName}>
          <Radio name='disabled-demo' disabled>
            未选中禁用
          </Radio>
          <Radio name='disabled-demo' defaultChecked disabled>
            选中禁用
          </Radio>
        </div>
      </Row>
      <Row caption='只读'>
        <Radio name='readonly-demo' readOnly defaultChecked>
          只读 (不可更改)
        </Radio>
      </Row>
      <Row caption='无标签'>
        <Radio name='bare' />
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
  gap: 16px;
`;
