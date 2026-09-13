import { Switch } from '@libs/components/Switch';
import { createSignal } from 'solid-js';
import { DemoList, Row, StateText } from './DemoList';
import type { Demo } from './types';

export const switchDemo: Demo = {
  name: 'Switch',
  desc: 'MD3 开关, 轨道 28×48dp, 选中时填充 primary。MD3 规范中 Switch 不带水波纹, 状态层由 CSS 实现。',
  render: () => <SwitchDemo />,
};

function SwitchDemo() {
  const [checked, setChecked] = createSignal(true);

  return (
    <DemoList>
      <Row caption='未选中'>
        <Switch />
      </Row>
      <Row caption='选中'>
        <Switch defaultChecked={true} />
      </Row>
      <Row caption='禁用'>
        <Switch disabled={true} />
      </Row>
      <Row caption='选中 + 禁用'>
        <Switch defaultChecked={true} disabled={true} />
      </Row>
      <Row caption='交互示例'>
        <Switch defaultChecked={true} onCheckedChange={(details) => setChecked(details.checked)} />
        <StateText>当前: {checked() ? 'checked' : 'unchecked'}</StateText>
      </Row>
    </DemoList>
  );
}
