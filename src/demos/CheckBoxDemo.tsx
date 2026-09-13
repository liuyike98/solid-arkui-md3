import { createSignal } from 'solid-js';
import { CheckBox } from '@libs/components/CheckBox';
import { DemoList, Row, StateText } from './DemoList';
import type { Demo } from './types';

export const checkBoxDemo: Demo = {
  name: 'CheckBox',
  desc: 'MD3 复选框, 18dp 容器 (2dp 圆角 + 2dp 描边) 搭配 40dp 状态层, 支持未选中 / 选中 / 半选三态, 按压带水波纹。',
  render: () => <CheckBoxDemo />,
};

function CheckBoxDemo() {
  const [checked, setChecked] = createSignal<boolean | 'indeterminate'>('indeterminate');

  return (
    <DemoList>
      <Row caption='未选中'>
        <CheckBox />
      </Row>
      <Row caption='选中'>
        <CheckBox defaultChecked={true} />
      </Row>
      <Row caption='半选'>
        <CheckBox defaultChecked='indeterminate' />
      </Row>
      <Row caption='禁用'>
        <CheckBox disabled={true} />
      </Row>
      <Row caption='选中 + 禁用'>
        <CheckBox defaultChecked={true} disabled={true} />
      </Row>
      <Row caption='带文字标签'>
        <CheckBox>记住这台设备</CheckBox>
      </Row>
      <Row caption='交互示例'>
        <CheckBox checked={checked()} onCheckedChange={(details) => setChecked(details.checked)}>
          三态切换
        </CheckBox>
        <StateText >当前: {String(checked())}</StateText>
      </Row>
    </DemoList>
  );
}
