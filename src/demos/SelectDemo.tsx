import { Select } from '@libs/components/Select';
import { createSignal } from 'solid-js';
import { css } from 'solid-styled-components';
import { DemoList, Row, StateText } from './DemoList';
import type { Demo } from './types';

export const selectDemo: Demo = {
  name: 'Select',
  desc: 'MD3 下拉框, outlined 触发盒 + 浮动标签 + 箭头翻转, 面板与 Menu 同风格, 选中项前置对勾。',
  render: () => <SelectDemo />,
};

const frameworks = [
  { value: 'solid', label: 'SolidJS' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular (禁用)', disabled: true },
];

function SelectDemo() {
  const [fruit, setFruit] = createSignal('');
  const [required, setRequired] = createSignal<string[]>([]);

  return (
    <DemoList>
      <Row caption='基础'>
        <div class={colClassName}>
          <Select label='框架' placeholder='选一个框架' options={frameworks} helper='仅前端视角' />
          <Select label='默认选中' options={frameworks} defaultValue={['solid']} />
        </div>
      </Row>
      <Row caption='受控'>
        <Select label='喜欢的水果' options={[{ value: 'apple', label: '苹果' }, { value: 'banana', label: '香蕉' }, { value: 'cherry', label: '车厘子' }]} value={fruit() ? [fruit()] : []} onValueChange={(details) => setFruit(details.value[0] ?? '')} />
        <StateText>{fruit() || '-'}</StateText>
      </Row>
      <Row caption='错误与禁用'>
        <div class={colClassName}>
          <Select label='必选项' options={frameworks} value={required()} onValueChange={(details) => setRequired(details.value)} error={required().length === 0 ? '不能为空' : undefined} />
          <Select label='不可用' options={frameworks} disabled />
        </div>
      </Row>
    </DemoList>
  );
}

const colClassName = css`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  gap: 16px;
`;
